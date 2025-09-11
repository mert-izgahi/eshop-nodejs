import swaggerJsdoc from "swagger-jsdoc";

const swaggerConfigs = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eshop NodeJS API",
      version: "1.0.0",
      description: "API documentation for Eshop NodeJS application",
      contact: {
        name: "Eshop Team",
        email: "eshop@example.com",
      },
      license: {
        name: "MIT License",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  responses: {
    UnauthorizedError: {
      description: "Authentication information is missing or invalid",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              message: {
                type: "string",
                example: "Invalid token",
              },
              details: {
                type: "string",
                example: "Token expired",
              },
            },
          },
        },
      },
    },
    ForbiddenError: {
      description: "Access denied",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              message: {
                type: "string",
                example: "Forbidden",
              },
              details: {
                type: "string",
                example: "You do not have permission to access this resource",
              },
            },
          },
        },
      },
    },
    NotFoundError: {
      description: "Resource not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              message: {
                type: "string",
                example: "Not found",
              },
              details: {
                type: "string",
                example: "The requested resource could not be found",
              },
            },
          },
        },
      },
    },
    ValidationError: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              message: {
                type: "string",
                example: "Validation error",
              },
              details: {
                type: "string",
                example: "Invalid input data",
              },
            },
          },
        },
      },
    },
    ConflictError: {
      description: "Conflict error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              message: {
                type: "string",
                example: "Conflict error",
              },
              details: {
                type: "string",
                example: "The requested resource already exists",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routers/*.ts", "./src/schemas/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerConfigs);

export default swaggerSpec;
