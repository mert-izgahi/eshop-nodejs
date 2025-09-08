import { Router, type Request, type Response } from "express";
import { tryCatchMiddleware } from "../middlewares/try-catch.middleware";
import {
  register,
  login,
  getMe,
  updateMe,
  updatePassword,
  logout,
  refresh,
} from "../controllers/auth.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Conflict Error (Existing email)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already in use
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 title:
 *                   type: string
 *                   example: Conflict Error
 *                 status:
 *                   type: number
 *                   example: 409
 *       500:
 *         description: Internal server error (Unknown error)
 */
router.post("/register", tryCatchMiddleware(register));

// =========================================================================================================
// Login
// =========================================================================================================

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       401:
 *         description: Unauthorized Error (Invalid credentials)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 title:
 *                   type: string
 *                   example: Unauthorized Error
 *                 status:
 *                   type: number
 *                   example: 401
 *       500:
 *         description: Internal server error (Unknown error)
 */
router.post("/login", tryCatchMiddleware(login));

// =========================================================================================================
// Get Me
// =========================================================================================================

/**
 * @swagger
 * /api/v1/me:
 *   get:
 *     summary: Get user information
 *     description: Retrieve user information based on the provided token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64b8c9d8e4b8c9d8e4b8c9d8
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     firstName:
 *                       type: string
 *                       example: John Doe
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     role:
 *                       type: string
 *                       example: customer
 *                     provider:
 *                       type: string
 *                       example: google
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-07-18T12:34:56.789Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-07-18T12:34:56.789Z
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *       401:
 *         description: Unauthorized Error (Invalid credentials)
 *       500:
 *         description: Internal server error (Unknown error)
 */

router.get("/me", authMiddleware, tryCatchMiddleware(getMe));

// =========================================================================================================
// Logout
// =========================================================================================================

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 title:
 *                   type: string
 *                   example: Logout Successful
 *                 status:
 *                   type: number
 *                   example: 200
 */
router.post("/logout", authMiddleware, tryCatchMiddleware(logout));

// =========================================================================================================
// Refresh Tokens
// =========================================================================================================
/**
 * @swagger
 * /api/v1/refresh:
 *  post:
 *    summary: Refresh access token using refresh token
 *    description: Refresh access token using refresh token
 *    security:
 *      - bearerAuth: []
 *    tags: [Authentication]
 *    responses:
 *      200:
 *        description: Success response
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Refresh successful
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  data:
 *                    type: boolean
 *                    example: true
 *      401:
 *        description: Unauthorized (Invalid refresh token)
 *      500:
 *        description: Internal server error (Unknown error)
 */
router.post("/refresh", tryCatchMiddleware(refresh));

// =========================================================================================================
// Update Me
// =========================================================================================================
/**
 * @swagger
 * /api/v1/update-me:
 *  patch:
 *    summary: Update user information
 *    description: Update user information
 *    security:
 *      - bearerAuth: []
 *    tags: [Authentication]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *                example: John Doe
 *              lastName:
 *                type: string
 *                example: Doe
 *              profilePicture:
 *                type: string
 *                example: http://example.com/profile.jpg
 *    responses:
 *      200:
 *        description: Success response
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Update successful
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  data:
 *                    type: boolean
 *                    example: true
 *      401:
 *        description: Unauthorized (Invalid token)
 *      500:
 *        description: Internal server error (Unknown error)
 */
router.patch("/update-me", authMiddleware, tryCatchMiddleware(updateMe));

// =========================================================================================================
// Update Password
// =========================================================================================================

/**
 * @swagger
 * /api/v1/update-password:
 *    patch:
 *      summary: Update user password
 *      description: Update user password
 *      security:
 *        - bearerAuth: []
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                currentPassword:
 *                  type: string
 *                  example: oldpassword
 *                newPassword:
 *                  type: string
 *                  example: newpassword
 *      responses:
 *        200:
 *          description: Success response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Password updated successfully
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  data:
 *                    type: boolean
 *                    example: true
 *        401:
 *          description: Unauthorized (Invalid token)
 *        500:
 *          description: Internal server error (Unknown error)
 */
router.patch(
  "/update-password",
  authMiddleware,
  tryCatchMiddleware(updatePassword),
);

export { router as authRouter };
