import { useState, useEffect } from 'react';
import { Search, RefreshCw, Edit, ChevronLeft, PaperclipIcon, X, Check, Send, ChevronUp, ChevronDown } from 'lucide-react';

const Tickets = () => {
  // State for tickets data
  const [tickets, setTickets] = useState([
    { 
      id: 6, 
      code: 6, 
      user: 'John Doe', 
      dateIssued: '20/11/23', 
      status: 'open', 
      category: 0, 
      issue: 'Invalid Invoices', 
      priority: 'High',
      description: "I'm having issues with several invoices that appear to be invalid. The system is not recognizing them.",
      comments: [
        { author: 'System', text: 'Ticket created', timestamp: '20/11/23 09:15 AM' },
        { author: 'John Doe', text: 'I\'ve attached screenshots of the error messages.', timestamp: '20/11/23 09:20 AM' },
        { author: 'Support Staff', text: 'Thank you for reporting this. We\'ll look into it.', timestamp: '20/11/23 11:45 AM' }
      ],
      attachments: [
        { name: 'invoice_error.png', type: 'image', url: '/api/placeholder/400/300' },
        { name: 'error_log.txt', type: 'text', url: '#' }
      ]
    },
    { 
      id: 5, 
      code: 5, 
      user: 'Lester Moe', 
      dateIssued: '20/11/22', 
      status: 'pending', 
      category: 0, 
      issue: 'Implementation', 
      priority: 'Medium',
      description: "Need assistance with implementation of the new module.",
      comments: [
        { author: 'System', text: 'Ticket created', timestamp: '20/11/22 14:30 PM' },
        { author: 'Support Staff', text: 'Could you provide more details about your setup?', timestamp: '20/11/22 15:10 PM' }
      ],
      attachments: []
    },
    { 
      id: 4, 
      code: 4, 
      user: 'Devious Adam', 
      dateIssued: '20/11/21', 
      status: 'closed', 
      category: 7, 
      issue: 'Install Program', 
      priority: 'Low',
      description: "Cannot install the program due to compatibility issues.",
      comments: [
        { author: 'System', text: 'Ticket created', timestamp: '20/11/21 08:45 AM' },
        { author: 'Devious Adam', text: 'Getting error code 0x80004005 during installation', timestamp: '20/11/21 08:50 AM' },
        { author: 'Support Staff', text: 'Please try running as administrator', timestamp: '20/11/21 09:30 AM' },
        { author: 'Devious Adam', text: 'That worked, thank you!', timestamp: '20/11/21 10:15 AM' },
        { author: 'Support Staff', text: 'Great! Closing this ticket.', timestamp: '20/11/21 10:20 AM' }
      ],
      attachments: [
        { name: 'error_screenshot.jpg', type: 'image', url: '/api/placeholder/400/300' }
      ]
    },
    { 
      id: 3, 
      code: 3, 
      user: 'Valentina', 
      dateIssued: '20/11/20', 
      status: 'open', 
      category: 0, 
      issue: 'Invalid Invoices', 
      priority: 'High',
      description: "Several invoices are showing errors when processed through the system.",
      comments: [
        { author: 'System', text: 'Ticket created', timestamp: '20/11/20 16:20 PM' }
      ],
      attachments: [
        { name: 'invoice1.pdf', type: 'pdf', url: '#' },
        { name: 'invoice2.pdf', type: 'pdf', url: '#' }
      ]
    },
    { 
      id: 2, 
      code: 2, 
      user: 'Ashley King', 
      dateIssued: '20/11/19', 
      status: 'open', 
      category: 0, 
      issue: 'Install Program', 
      priority: 'Low',
      description: "Need help installing the program on a new machine.",
      comments: [
        { author: 'System', text: 'Ticket created', timestamp: '20/11/19 13:40 PM' },
        { author: 'Support Staff', text: 'Have you downloaded the latest version?', timestamp: '20/11/19 14:15 PM' },
        { author: 'Ashley King', text: 'Yes, I have version 2.3.1', timestamp: '20/11/19 14:30 PM' }
      ],
      attachments: []
    },
    { 
      id: 1, 
      code: 1, 
      user: 'Arka Reynanda', 
      dateIssued: '20/11/18', 
      status: 'pending', 
      category: 2, 
      issue: 'Invalid Invoices', 
      priority: 'Low',
      description: "Having trouble with invoice validation. The system keeps rejecting valid invoices.",
      comments: [
        { author: 'System', text: 'Ticket created', timestamp: '20/11/18 10:05 AM' },
        { author: 'Arka Reynanda', text: 'This is urgent as it affects our billing process', timestamp: '20/11/18 10:10 AM' },
        { author: 'Support Staff', text: 'We\'re working on it. Could you send an example invoice?', timestamp: '20/11/18 10:25 AM' }
      ],
      attachments: [
        { name: 'sample_invoice.xlsx', type: 'excel', url: '#' }
      ]
    },
  ]);

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for selected ticket
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // State for new comment
  const [newComment, setNewComment] = useState('');
  
  // State for closing ticket confirmation
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'dateIssued',
    direction: 'desc' // Default sort by most recent tickets
  });

  // Function to get status color class
  const getStatusColor = (status) => {
    switch(status) {
      case 'open':
        return 'bg-green-500';
      case 'pending':
        return 'bg-orange-500';
      case 'closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to get status background color for inline styling
  const getStatusBgColor = (status) => {
    switch(status) {
      case 'open':
        return '#10B981'; // green-500 equivalent
      case 'pending':
        return '#F97316'; // orange-500 equivalent
      case 'closed':
        return '#EF4444'; // red-500 equivalent
      default:
        return '#6B7280'; // gray-500 equivalent
    }
  };

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Function to get sorted tickets
  const getSortedTickets = (tickets) => {
    const sortableTickets = [...tickets];
    if (sortConfig.key) {
      sortableTickets.sort((a, b) => {
        // Handle date sorting with proper date conversion
        if (sortConfig.key === 'dateIssued') {
          // Convert DD/MM/YY to a proper date object
          const dateA = a.dateIssued.split('/').reverse().join('/');
          const dateB = b.dateIssued.split('/').reverse().join('/');
          return sortConfig.direction === 'asc' 
            ? new Date(dateA) - new Date(dateB)
            : new Date(dateB) - new Date(dateA);
        }
        
        // Handle numerical values like category
        if (sortConfig.key === 'category' || sortConfig.key === 'code') {
          return sortConfig.direction === 'asc'
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        }
        
        // Handle priority special case (Low, Medium, High)
        if (sortConfig.key === 'priority') {
          const priorityWeight = { 'Low': 1, 'Medium': 2, 'High': 3 };
          return sortConfig.direction === 'asc'
            ? priorityWeight[a.priority] - priorityWeight[b.priority]
            : priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        
        // Default string comparison for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTickets;
  };

  // Function to render sorting indicator
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Function to filter tickets based on search term
  const filteredTickets = getSortedTickets(
    tickets.filter(ticket => 
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.code.toString().includes(searchTerm)
    )
  );

  // Function to handle clicking on a ticket
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowCloseConfirmation(false);
  };

  // Function to handle adding a comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        const updatedTicket = {
          ...ticket,
          comments: [
            ...ticket.comments,
            {
              author: 'Support Staff',
              text: newComment,
              timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
        setSelectedTicket(updatedTicket);
        return updatedTicket;
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setNewComment('');
  };

  // Function to handle ticket closure
  const handleCloseTicket = () => {
    setShowCloseConfirmation(true);
  };

  // Function to confirm ticket closure
  const confirmCloseTicket = () => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        const updatedTicket = {
          ...ticket,
          status: 'closed',
          comments: [
            ...ticket.comments,
            {
              author: 'Support Staff',
              text: 'This ticket has been marked as closed. Awaiting user confirmation.',
              timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
        setSelectedTicket(updatedTicket);
        return updatedTicket;
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setShowCloseConfirmation(false);
  };

  // Function to cancel ticket closure
  const cancelCloseTicket = () => {
    setShowCloseConfirmation(false);
  };

  // Function to go back to ticket list
  const handleBackToList = () => {
    setSelectedTicket(null);
    setShowCloseConfirmation(false);
  };

  // Render attachment thumbnail based on type
  const renderAttachmentThumbnail = (attachment) => {
    switch (attachment.type) {
      case 'image':
        return <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover rounded" />;
      case 'pdf':
        return (
          <div className="flex items-center justify-center h-full bg-red-100 rounded">
            <span className="text-red-700 font-bold">PDF</span>
          </div>
        );
      case 'excel':
        return (
          <div className="flex items-center justify-center h-full bg-green-100 rounded">
            <span className="text-green-700 font-bold">XLSX</span>
          </div>
        );
      case 'text':
        return (
          <div className="flex items-center justify-center h-full bg-blue-100 rounded">
            <span className="text-blue-700 font-bold">TXT</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded">
            <span className="text-gray-700 font-bold">FILE</span>
          </div>
        );
    }
  };

  // If a ticket is selected, show the ticket detail view
  if (selectedTicket) {
    return (
      <div className="p-6 h-full">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            onClick={handleBackToList}
          >
            <ChevronLeft size={20} />
            <span>Back to Tickets</span>
          </button>
          <h1 className="text-2xl font-bold">Ticket #{selectedTicket.code}</h1>
        </div>

        {/* Ticket details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Ticket information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">{selectedTicket.issue}</h2>
                  <div className="flex items-center">
                    <span style={{ 
                      width: '0.75rem', 
                      height: '0.75rem', 
                      borderRadius: '9999px', 
                      backgroundColor: getStatusBgColor(selectedTicket.status),
                      marginRight: '0.5rem'
                    }}></span>
                    <span className="capitalize">{selectedTicket.status}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Submitted by</p>
                    <p className="font-medium">{selectedTicket.user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date submitted</p>
                    <p className="font-medium">{selectedTicket.dateIssued}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className="font-medium">{selectedTicket.priority}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="p-4 bg-gray-50 rounded">{selectedTicket.description}</p>
                </div>
                
                {/* Attachments */}
                {selectedTicket.attachments.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Attachments</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedTicket.attachments.map((attachment, index) => (
                        <div key={index} className="border border-gray-200 rounded p-2">
                          <div className="w-full h-24 mb-2">
                            {renderAttachmentThumbnail(attachment)}
                          </div>
                          <p className="text-sm truncate text-center">{attachment.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Close ticket button */}
            {selectedTicket.status !== 'closed' && (
              <div className="mb-6">
                {!showCloseConfirmation ? (
                  <button
                    style={{ 
                      backgroundColor: '#DC2626', // red-600 equivalent 
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'} // red-700 equivalent
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}  // red-600 equivalent
                    onClick={handleCloseTicket}
                  >
                    Close Ticket
                  </button>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="mb-4">Are you sure you want to close this ticket? The user will need to confirm that the issue is resolved.</p>
                    <div className="flex gap-4">
                      <button
                        style={{ 
                          backgroundColor: '#DC2626', // red-600 equivalent 
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'} // red-700 equivalent
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}  // red-600 equivalent
                        onClick={confirmCloseTicket}
                      >
                        Yes, Close Ticket
                      </button>
                      <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={cancelCloseTicket}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right column - Comments section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Comments</h3>
              </div>
              
              {/* Comments list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '500px' }}>
                {selectedTicket.comments.map((comment, index) => (
                  <div key={index} className={`p-3 rounded ${comment.author === 'Support Staff' ? 'bg-blue-50 ml-4' : 'bg-gray-50 mr-4'}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
              
              {/* Add comment section */}
              {selectedTicket.status !== 'closed' && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button
                      style={{ 
                        backgroundColor: '#2563EB', // blue-600 equivalent
                        color: 'white',
                        borderTopRightRadius: '0.25rem',
                        borderBottomRightRadius: '0.25rem',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'} // blue-700 equivalent
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}  // blue-600 equivalent
                      onClick={handleAddComment}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tickets list view
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets</h1>
        
        {/* Search bar */}
        <div className="flex items-center">
          <div className="relative mr-2">
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          
          <button 
            style={{ 
              backgroundColor: '#4F46E5', // indigo-600 equivalent
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338CA'} // indigo-700 equivalent
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}  // indigo-600 equivalent
            onClick={() => console.log('Refresh clicked')}
          >
            <RefreshCw size={18} style={{ marginRight: '0.5rem' }} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Tickets table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('code')}
              >
                <div className="flex items-center">
                  Code
                  {getSortDirectionIcon('code')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('user')}
              >
                <div className="flex items-center">
                  User
                  {getSortDirectionIcon('user')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('dateIssued')}
              >
                <div className="flex items-center">
                  Date Issued
                  {getSortDirectionIcon('dateIssued')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center justify-center">
                  Status
                  {getSortDirectionIcon('status')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('category')}
              >
                <div className="flex items-center justify-center">
                  Category
                  {getSortDirectionIcon('category')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('issue')}
              >
                <div className="flex items-center">
                  Issue
                  {getSortDirectionIcon('issue')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('priority')}
              >
                <div className="flex items-center">
                  Priority
                  {getSortDirectionIcon('priority')}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleTicketClick(ticket)}>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.user}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.dateIssued}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center">
                    <div style={{ 
                      width: '1.5rem', 
                      height: '1.5rem', 
                      borderRadius: '9999px', 
                      backgroundColor: getStatusBgColor(ticket.status)
                    }}></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{ticket.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ticket.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button 
                    style={{ 
                      height: '2rem',
                      width: '2rem',
                      borderRadius: '9999px',
                      backgroundColor: '#E0E7FF', // indigo-100 equivalent
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C7D2FE'} // indigo-200 equivalent
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E0E7FF'}  // indigo-100 equivalent
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleTicketClick(ticket);
                    }}
                  >
                    <Edit size={16} style={{ color: '#4F46E5' }} /> {/* indigo-600 equivalent */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Tickets;