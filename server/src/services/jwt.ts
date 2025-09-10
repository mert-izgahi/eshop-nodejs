import jwt, { type JwtPayload } from "jsonwebtoken";

export interface IPayload extends JwtPayload {
  id: string;
  role: string;
}

export class JwtService {
  private static AccessTokenSecret =
    process.env.JWT_ACCESS_TOKEN_SECRET || "secret";
  private static AccessTokenExpiration =
    process.env.JWT_ACCESS_TOKEN_EXPIRATION || "1d";
  private static RefreshTokenSecret =
    process.env.JWT_REFRESH_TOKEN_SECRET || "secret";
  private static RefreshTokenExpiration =
    process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d";

  private static generateToken(
    payload: IPayload,
    secret: string,
    expiresIn: any,
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  public static generateAccessToken(payload: IPayload): string {
    return this.generateToken(
      payload,
      this.AccessTokenSecret,
      this.AccessTokenExpiration,
    );
  }

  public static generateRefreshToken(payload: IPayload): string {
    return this.generateToken(
      payload,
      this.RefreshTokenSecret,
      this.RefreshTokenExpiration,
    );
  }

  public static generateTokenPair(payload: IPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  public static verifyToken(token: string): IPayload | null {
    try {
      const decoded = jwt.verify(token, this.AccessTokenSecret);
      return decoded as IPayload;
    } catch (error) {
      return null;
    }
  }

  public static verifyRefreshToken(token: string): IPayload | null {
    try {
      const decoded = jwt.verify(token, this.RefreshTokenSecret);
      return decoded as IPayload;
    } catch (error) {
      return null;
    }
  }

  public static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.verify(token, this.AccessTokenSecret) as IPayload;
      const expiration = decoded.exp as number;
      const currentTime = Math.floor(Date.now() / 1000);
      return expiration < currentTime;
    } catch (error) {
      return true;
    }
  }
}
