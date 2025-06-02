import swaggerJsDoc from "swagger-jsdoc";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         userId:
 *           type: string
 *           description: Unique user ID (UUID)
 *           example: "uuid-generated-id"
 *         username:
 *           type: string
 *           description: Unique username (optional)
 *           example: "samuel235"
 *         googleId:
 *           type: string
 *           description: Google OAuth ID (optional)
 *         email:
 *           type: string
 *           description: User email address
 *           example: "samuel23505@gmail.com"
 *         password:
 *           type: string
 *           description: User password (hashed)
 *         firstName:
 *           type: string
 *           description: User first name
 *           example: "Samuel"
 *         lastName:
 *           type: string
 *           description: User last name
 *           example: "Setiadi"
 *         accessLevel:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *         jobRole:
 *           type: string
 *           description: User job role (optional)
 *         description:
 *           type: string
 *           description: User description (optional)
 *         profileImage:
 *           type: string
 *           description: URL or path of user profile image (optional)
 *       example:
 *         userId: "uuid-generated-id"
 *         username: "samuel235"
 *         googleId: null
 *         email: "samuel23505@gmail.com"
 *         password: "hashed-password"
 *         firstName: "Samuel"
 *         lastName: "Setiadi"
 *         accessLevel: "user"
 *         jobRole: "Developer"
 *         description: "Full-stack developer"
 *         profileImage: "/images/profile.png"
 * 
 *     Ticket:
 *       type: object
 *       required:
 *         - userId
 *         - Issue
 *         - description
 *         - category
 *         - priority
 *         - status
 *       properties:
 *         ticketId:
 *           type: string
 *           description: Unique ticket ID (UUID)
 *         userId:
 *           type: string
 *           description: ID of user who created the ticket
 *         Issue:
 *           type: string
 *           description: Ticket issue title
 *         description:
 *           type: string
 *           description: Detailed ticket description
 *         category:
 *           type: string
 *           description: Category of the ticket
 *         priority:
 *           type: string
 *           description: Priority level (high, medium, low)
 *         status:
 *           type: string
 *           description: Status of ticket (open, pending, closed)
 *       example:
 *         ticketId: "ticket-uuid-1234"
 *         userId: "uuid-user-id"
 *         Issue: "Cannot login"
 *         description: "Unable to login with correct credentials"
 *         category: "Authentication"
 *         priority: "high"
 *         status: "open"
 * 
 *     Comment:
 *       type: object
 *       required:
 *         - ticketId
 *         - userId
 *         - content
 *       properties:
 *         commentId:
 *           type: string
 *           description: Unique comment ID (UUID)
 *         ticketId:
 *           type: string
 *           description: ID of the ticket this comment belongs to
 *         userId:
 *           type: string
 *           description: ID of user who made the comment
 *         content:
 *           type: string
 *           description: Comment text content
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the comment was created
 *       example:
 *         commentId: "comment-uuid-1234"
 *         ticketId: "ticket-uuid-1234"
 *         userId: "uuid-user-id"
 *         content: "I have the same issue"
 *         createdAt: "2025-06-02T10:20:00Z"
 * 
 *     Attachment:
 *       type: object
 *       required:
 *         - ticketId
 *         - fileName
 *         - filePath
 *       properties:
 *         attachmentId:
 *           type: string
 *           description: Unique attachment ID (UUID)
 *         ticketId:
 *           type: string
 *           description: ID of the ticket this attachment belongs to
 *         fileName:
 *           type: string
 *           description: Name of the attached file
 *         filePath:
 *           type: string
 *           description: Storage path or URL of the file
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the attachment was created
 *       example:
 *         attachmentId: "attachment-uuid-1234"
 *         ticketId: "ticket-uuid-1234"
 *         fileName: "error_screenshot.png"
 *         filePath: "/uploads/error_screenshot.png"
 *         createdAt: "2025-06-02T10:20:00Z"
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 *   - name: User
 *     description: User profile routes
 *   - name: Tickets
 *     description: Ticket management routes
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "samuel23505@gmail.com"
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Unauthorized, invalid credentials
 */

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user (invalidate token)
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

/**
 * @swagger
 * /api/user/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh JWT token
 *     responses:
 *       200:
 *         description: Returns new JWT token
 */

/**
 * @swagger
 * /api/user/google-login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with Google OAuth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenId:
 *                 type: string
 *                 description: Google OAuth token ID
 *     responses:
 *       200:
 *         description: Google login successful
 */

/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "samuel23505@gmail.com"
 *     responses:
 *       200:
 *         description: Password reset email sent
 */

/**
 * @swagger
 * /api/user/reset-password/{token}:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using token
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 */

/**
 * @swagger
 * /api/user/getProfile:
 *   get:
 *     tags: [User]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/updateProfile:
 *   put:
 *     tags: [User]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User profile updated
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     tags: [Tickets]
 *     summary: Get all tickets for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 * 
 *   post:
 *     tags: [Tickets]
 *     summary: Create a new ticket
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: Ticket created successfully
 */

/**
 * @swagger
 * /api/tickets/{ticketId}:
 *   get:
 *     tags: [Tickets]
 *     summary: Get ticket details by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 * 
 *   put:
 *     tags: [Tickets]
 *     summary: Update ticket by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Ticket updated
 * 
 *   delete:
 *     tags: [Tickets]
 *     summary: Delete ticket by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ticket deleted
 */

/**
 * @swagger
 * /api/comments/{ticketId}:
 *   get:
 *     tags: [Tickets]
 *     summary: Get comments for a ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 * 
 *   post:
 *     tags: [Tickets]
 *     summary: Add comment to a ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a comment"
 *     responses:
 *       201:
 *         description: Comment added
 */

/**
 * @swagger
 * /api/attachments/{ticketId}:
 *   get:
 *     tags: [Tickets]
 *     summary: Get attachments for a ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of attachments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attachment'
 * 
 *   post:
 *     tags: [Tickets]
 *     summary: Upload attachment to a ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Attachment uploaded
 */

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Belantara Ticketing System API",
      version: "1.0.0",
      description: "API documentation for the Belantara Ticketing System",
    },
    servers: [
      {
        url: "http://localhost:5000/service/user",

      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js", "./controllers/*.js")], 
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;