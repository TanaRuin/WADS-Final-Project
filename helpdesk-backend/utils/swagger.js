const swaggerJsDoc = require("swagger-jsdoc");
const path = require('path');

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

const swaggerSpec = swaggerJsDoc({
  definition: {
      openapi: "3.0.3",
      info: {
          title: "Belantara Help Desk",
          version: "1.0.0",
          description: "Help Desk for Belantara.",
      },
      servers: [
          {
              url: 'https://e2425-wads-l4ccg5-server.csbihub.id/',
              description: 'Production',
          }
      ],
      security: [
          {
              bearerAuth: []
          }
      ]
  },
  apis: [
      path.join(__dirname, '..', 'routes', '*.js'),
      path.join(__dirname, '..', 'routes', '*.ts'),
      path.join(__dirname, 'swagger.js'),
      path.join(__dirname, 'swagger.ts'),
  ],
});

module.exports = swaggerSpec;