import { type RedisClientType, createClient } from "redis";
import { log } from "../utils/logger";
import { redisConfig } from "../configs";

class RedisService {
  private client: RedisClientType;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.client = createClient({
      username: redisConfig.user,
      password: redisConfig.password,
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
        reconnectStrategy: (retries) => {
          // Exponential backoff with max delay of 5 seconds
          const delay = Math.min(retries * 100, 5000);
          log.info(
            `Retrying Redis connection in ${delay}ms (attempt ${retries})`,
          );
          return delay;
        },
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.client.on("error", (err) => {
      log.error("Redis error:", err);
      this.connectionPromise = null; // Reset connection promise on error
    });

    this.client.on("connect", () => {
      log.info("Connected to Redis");
    });

    this.client.on("ready", () => {
      log.info("Redis is ready");
    });

    this.client.on("reconnecting", () => {
      log.info("Reconnecting to Redis");
      this.connectionPromise = null; // Reset connection promise during reconnection
    });

    this.client.on("end", () => {
      log.info("Disconnected from Redis");
      this.connectionPromise = null; // Reset connection promise when disconnected
    });
  }

  async connect(): Promise<void> {
    // If already connecting, return the existing promise
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // If already connected, return immediately
    if (this.client.isReady) {
      return Promise.resolve();
    }

    // If not connected, attempt to connect
    this.connectionPromise = this.client.connect() as any;
    await this.connectionPromise;
    this.connectionPromise = null;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client.isOpen) {
        await this.client.disconnect();
      }
      this.connectionPromise = null;
    } catch (error: any) {
      log.error("Error disconnecting from Redis:", error);
      throw error;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.client.isReady) {
      log.info("Redis not ready, attempting to connect...");
      await this.connect();
    }
  }

  async set(
    key: string,
    value: string,
    options?: { EX?: number },
  ): Promise<void> {
    try {
      await this.ensureConnection();
      await this.client.set(key, value, options);
    } catch (error: any) {
      log.error(`Failed to set Redis key ${key}:`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      await this.ensureConnection();
      return await this.client.get(key);
    } catch (error: any) {
      log.error(`Failed to get Redis key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      await this.ensureConnection();
      return await this.client.del(key);
    } catch (error: any) {
      log.error(`Failed to delete Redis key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      await this.ensureConnection();
      return await this.client.exists(key);
    } catch (error: any) {
      log.error(`Failed to check existence of Redis key ${key}:`, error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.client.isReady;
  }

  isConnecting(): boolean {
    return this.connectionPromise !== null;
  }

  // Get connection status for debugging
  getConnectionStatus(): {
    isReady: boolean;
    isOpen: boolean;
    isConnecting: boolean;
  } {
    return {
      isReady: this.client.isReady,
      isOpen: this.client.isOpen,
      isConnecting: this.connectionPromise !== null,
    };
  }
}

// Create singleton instance
const redisService = new RedisService();

export default redisService;
