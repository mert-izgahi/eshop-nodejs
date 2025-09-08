import { Router, type Request, type Response } from "express";
import { BadRequestError, InternalServerError } from "../utils/api-errors";

const router = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current health status of the server
 *     tags:
 *       - System
 *     security: []
 *     responses:
 *       200:
 *         description: Server is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                   description: Status of the server
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                   description: Health status message
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:45.123Z
 *                   description: Current server timestamp
 *                 uptime:
 *                   type: number
 *                   example: 3600.125
 *                   description: Server uptime in seconds
 *                 environment:
 *                   type: string
 *                   example: development
 *                   description: Current environment
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                   description: API version
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 title:
 *                   type: string
 *                   example: Internal Server Error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: number
 *                   example: 500
 *                   description: Error status code
 */
router.get("/health", (req: Request, res: Response) => {
  try {
    throw new BadRequestError();
    res.status(200).json({
      status: "success",
      message: "Server is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.API_VERSION || "1.0.0",
    });
  } catch (error) {
    throw new InternalServerError();
  }
});

export { router as healthRouter };
