const Ticket = require("../models/Tickets");

// Getting dashboard statistics for the main dashboard page
const getDashboardStats = async (req, res) => {
    try {
        // Get all tickets
        const allTickets = await Ticket.find().lean(); 
        const count = allTickets.length;

        // Get most recent ticket
        let recentTicket = null;
        if (allTickets.length > 0) {
            // Sort by creation date descending
            allTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            recentTicket = allTickets[0];
        } else {
            recentTicket = await Ticket.findOne().sort({ createdAt: -1 }).lean();
        }

        let formattedRecentTicket = {};
        if (recentTicket) {
            formattedRecentTicket = {
                user: recentTicket.userId,
                submitted: new Date(recentTicket.createdAt).toLocaleDateString('en-GB'),
                subject: recentTicket.Issue.substring(0, 30) + (recentTicket.Issue.length > 30 ? '...' : ''),
                issue: recentTicket.Issue,
                category: recentTicket.category,
                priority: recentTicket.priority,
                status: recentTicket.status
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

        // Ensure all priority levels exist
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

        // Ensure all status levels exist
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

        // Monthly ticket data calculation
        const getMonthlyTicketData = (tickets) => {
            const now = new Date();
            const monthlyData = [];

            for (let i = 11; i >= 0; i--) {
                const month = new Date(now);
                month.setMonth(now.getMonth() - i);

                const monthYear = month.toLocaleString('default', { month: 'short', year: 'numeric' });
                const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
                const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

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

        const monthlyData = getMonthlyTicketData(allTickets);

        // Build final response object
        const dashboardData = {
            total: count,
            recent: formattedRecentTicket,
            priorityData,
            statusData,
            monthlyData
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
};
