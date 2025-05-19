const { v4: uuidv4 } = require("uuid");
const Ticket = require("../models/Tickets");
const Comment = require("../models/Comments");
const Attachment = require("../models/Attachments");
const path = require("path");


// Get all tickets (with optional filtering)
const getAllTickets = async (req, res) => {
    try {
        const { status, category, priority, userId } = req.query;
        let whereClause = {};
        
        // Add filters if provided
        if (status) whereClause.status = status;
        if (category) whereClause.category = category;
        if (priority) whereClause.priority = priority;
        if (userId) whereClause.userId = userId;
        
        const tickets = await Ticket.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        
        // Format the response to match the frontend expectations
        const formattedTickets = tickets.map(ticket => {
            const ticketData = ticket.toJSON ? ticket.toJSON() : ticket;
            return {
                code: ticketData.ticketId.substring(0, 8), // Use first 8 chars of UUID as code
                user: ticketData.userId, // This would typically come from a User model
                dateIssued: new Date(ticketData.createdAt).toLocaleDateString('en-GB'),
                status: ticketData.status,
                category: ticketData.category,
                issue: ticketData.Issue,
                priority: ticketData.priority,
                description: ticketData.description
            };
        });
        
        res.status(200).json(formattedTickets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get dashboard statistics for the main dashboard page
const getDashboardStats = async (req, res) => {
    try {
        // Get total ticket count - using findAll() and length as an alternative
        const allTickets = await Ticket.findAll();
        const count = allTickets.length;
        
        // Get most recent ticket - either from the sorted array or with a separate query
        let recentTicket = null;
        if (allTickets.length > 0) {
            // Sort by creation date (if not already sorted from database)
            allTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            recentTicket = allTickets[0];
        } else {
            recentTicket = await Ticket.findOne({
                order: [['createdAt', 'DESC']]
            });
        }
        
        let formattedRecentTicket = {};
        if (recentTicket) {
            const ticketData = recentTicket.toJSON ? recentTicket.toJSON() : recentTicket;
            formattedRecentTicket = {
                user: ticketData.userId,
                submitted: new Date(ticketData.createdAt).toLocaleDateString('en-GB'),
                subject: ticketData.Issue.substring(0, 30) + (ticketData.Issue.length > 30 ? '...' : ''),
                issue: ticketData.Issue,
                category: ticketData.category,
                priority: ticketData.priority,
                status: ticketData.status
            };
        }
        
        // Get tickets count by priority
        const priorityCounts = {};
        allTickets.forEach(ticket => {
            const priority = ticket.priority || 'unknown';
            priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
        });
        
        // Format priority data for charts
        const priorityData = [];
        let foundPriorities = new Set();
        
        // Process priority counts manually
        Object.keys(priorityCounts).forEach(priority => {
            foundPriorities.add(priority.toLowerCase());
            
            let color;
            switch(priority.toLowerCase()) {
                case 'high':
                    color = '#2563eb';
                    break;
                case 'medium':
                    color = '#f59e0b'; 
                    break;
                case 'low':
                    color = '#9ca3af'; 
                    break;
                default:
                    color = '#cbd5e1'; 
            }
            
            priorityData.push({
                name: priority,
                value: priorityCounts[priority],
                color: color
            });
        });
        
        // Ensure we have all priority levels 
        ['high', 'medium', 'low'].forEach(priority => {
            if (!foundPriorities.has(priority)) {
                priorityData.push({
                    name: priority.charAt(0).toUpperCase() + priority.slice(1),
                    value: 0,
                    color: priority === 'high' ? '#2563eb' : 
                           priority === 'medium' ? '#f59e0b' : '#9ca3af'
                });
            }
        });
        
        // Get tickets count by status 
        const statusCounts = {};
        allTickets.forEach(ticket => {
            const status = ticket.status || 'unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        // Format status data for charts
        const statusData = [];
        let foundStatuses = new Set();
        
        // Process status counts manually
        Object.keys(statusCounts).forEach(status => {
            foundStatuses.add(status.toLowerCase());
            
            let color;
            switch(status.toLowerCase()) {
                case 'open':
                    color = '#2563eb'; 
                    break;
                case 'pending':
                    color = '#f59e0b'; 
                    break;
                case 'closed':
                    color = '#10b981'; 
                    break;
                default:
                    color = '#cbd5e1'; 
            }
            
            statusData.push({
                name: status,
                value: statusCounts[status],
                color: color
            });
        });
        
        // Ensure we have all status levels 
        ['open', 'pending', 'closed'].forEach(status => {
            if (!foundStatuses.has(status)) {
                statusData.push({
                    name: status.charAt(0).toUpperCase() + status.slice(1),
                    value: 0,
                    color: status === 'open' ? '#2563eb' : 
                           status === 'pending' ? '#f59e0b' : '#10b981'
                });
            }
        });
        
        // Implementation of manual monthly ticket data function
        const getMonthlyTicketDataManual = (tickets) => {
            const now = new Date();
            const monthlyData = [];
            
            // Create data for the past 12 months
            for (let i = 11; i >= 0; i--) {
                const month = new Date(now);
                month.setMonth(now.getMonth() - i);
                
                const monthYear = month.toLocaleString('default', { month: 'short', year: 'numeric' });
                const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
                const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
                
                // Count tickets closed in this month
                const closedInMonth = tickets.filter(ticket => {
                    const closedDate = ticket.closedAt ? new Date(ticket.closedAt) : null;
                    return closedDate && closedDate >= monthStart && closedDate <= monthEnd;
                }).length;
                
                monthlyData.push({
                    month: monthYear,
                    resolved: closedInMonth
                });
            }
            
            return monthlyData;
        };
        
        // Monthly ticket resolution data 
        const monthlyData = getMonthlyTicketDataManual(allTickets);
        
        // Build response object matching your frontend expectations
        const dashboardData = {
            total: count,
            recent: formattedRecentTicket,
            priorityData: priorityData,
            statusData: statusData,
            monthlyData: monthlyData
        };
        
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return res.status(500).json({ message: error.message });
    }
};

// Get a single ticket with comments and attachments
const getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        const ticket = await Ticket.findOne({ 
            where: { ticketId } 
        });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Get comments for this ticket
        const comments = await Comment.findAll({
            where: { ticketId},
            order: [['createdAt', 'ASC']]
        });
        
        // Get attachments for this ticket
        const attachments = await Attachment.findAll({
            where: { ticketId }
        });
        
        // Format comments to match frontend expectations
        const formattedComments = comments.map(comment => {
            const commentData = comment.toJSON ? comment.toJSON() : comment;
            return {
                author: commentData.userId === 'system' ? 'System' : 'Support Staff',
                text: commentData.content,
                timestamp: new Date(commentData.createdAt).toLocaleDateString('en-GB') + ' ' + 
                          new Date(commentData.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            };
        });
        
        // Format attachments to match frontend expectations
        const formattedAttachments = attachments.map(attachment => {
            const attachmentData = attachment.toJSON ? attachment.toJSON() : attachment;
            const fileExtension = path.extname(attachmentData.fileName).toLowerCase();
            
            // Determine file type based on extension
            let fileType = 'file';
            if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(fileExtension)) {
                fileType = 'image';
            } else if (fileExtension === '.pdf') {
                fileType = 'pdf';
            } else if (['.xls', '.xlsx'].includes(fileExtension)) {
                fileType = 'excel';
            } else if (fileExtension === '.txt') {
                fileType = 'text';
            }
            
            return {
                name: attachmentData.fileName,
                type: fileType,
                url: `/api/attachments/${attachmentData.attachmentId}`
            };
        });
        
        // Format the ticket data
        const ticketData = ticket.toJSON ? ticket.toJSON() : ticket;
        const formattedTicket = {
            code: ticketData.ticketId.substring(0, 8),
            user: ticketData.userId,
            dateIssued: new Date(ticketData.createdAt).toLocaleDateString('en-GB'),
            status: ticketData.status,
            category: ticketData.category,
            issue: ticketData.Issue,
            priority: ticketData.priority,
            description: ticketData.description,
            comments: formattedComments,
            attachments: formattedAttachments
        };
        
        res.status(200).json(formattedTicket);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update a ticket status
const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ message: "Status field is required." });
        }
        
        const ticket = await Ticket.findOne({ 
            where: { ticketId } 
        });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Update status
        ticket.status = status;
        await ticket.save();
        
        // Add a system comment when status changes
        await Comment.create({
            commentId: uuidv4(),
            ticketId: ticketId, 
            userId: "system", 
            content: `Ticket status changed to ${status}`
        });
        
        res.status(200).json({ message: "Ticket status updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Close a ticket
const closeTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        const ticket = await Ticket.findOne({ 
            where: { ticketId } 
        });
        
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found." });
        }
        
        // Update status to closed
        ticket.status = 'closed';
        await ticket.save();
        
        // Add a system comment for ticket closure
        await Comment.create({
            commentId: uuidv4(),
            ticketId: ticketId, 
            userId: "system",
            content: "This ticket has been marked as closed. Awaiting user confirmation."
        });
        
        res.status(200).json({ message: "Ticket closed successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};






module.exports = {
    getAllTickets,
    getTicketById,
    getDashboardStats, 
    updateTicketStatus,
    closeTicket,
};