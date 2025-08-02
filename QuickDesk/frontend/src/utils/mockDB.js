// Mock Database
export const DB = {
    users: [
        { id: 'user-1', email: 'admin@example.com', password: 'password', role: 'admin', createdAt: new Date() },
        { id: 'user-2', email: 'agent@example.com', password: 'password', role: 'agent', createdAt: new Date() },
        { id: 'user-3', email: 'user@example.com', password: 'password', role: 'user', createdAt: new Date() },
    ],
    tickets: [
        { 
            id: 'ticket-1', 
            subject: 'Login button not working on Safari', 
            description: 'When I try to click the login button on the Safari browser, nothing happens. I have tried clearing my cache and cookies, but the issue persists. This is blocking our team from accessing the platform.',
            category: 'Bug Report', 
            status: 'Open', 
            createdBy: 'user-3', 
            creatorName: 'user@example.com',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            upvotes: 10, 
            downvotes: 1, 
            replies: 2,
        },
        { 
            id: 'ticket-2', 
            subject: 'Feature Request: Dark Mode', 
            description: 'The application is great, but a dark mode would be easier on the eyes, especially for those of us working late nights. Please consider adding a theme switcher.',
            category: 'Feature Request', 
            status: 'In Progress', 
            createdBy: 'user-2', 
            creatorName: 'agent@example.com',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
            upvotes: 25, 
            downvotes: 0, 
            replies: 1,
        },
    ],
    categories: [
        { id: 'cat-1', name: 'Bug Report' },
        { id: 'cat-2', name: 'Feature Request' },
        { id: 'cat-3', name: 'Technical Support' },
        { id: 'cat-4', name: 'Billing Inquiry' },
    ],
    comments: {
        'ticket-1': [
            { id: 'comment-1-1', text: 'We are looking into this issue. Can you please provide your Safari version?', authorId: 'user-2', authorName: 'agent@example.com', createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000) },
            { id: 'comment-1-2', text: 'Sure, I am using Safari version 15.1.', authorId: 'user-3', authorName: 'user@example.com', createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000) },
        ],
        'ticket-2': [
             { id: 'comment-2-1', text: 'Thanks for the suggestion! We have added this to our product roadmap.', authorId: 'user-1', authorName: 'admin@example.com', createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000) },
        ]
    },
    findUserByEmail: (email) => new Promise(resolve => setTimeout(() => resolve(DB.users.find(u => u.email === email)), 500)),
    addUser: (userData) => new Promise(resolve => setTimeout(() => { const newUser = { ...userData, id: `user-${Date.now()}`, createdAt: new Date() }; DB.users.push(newUser); resolve(newUser); }, 500)),
    getUsers: () => new Promise(resolve => setTimeout(() => resolve([...DB.users]), 300)),
    updateUser: (userId, updates) => new Promise(resolve => setTimeout(() => { const userIndex = DB.users.findIndex(u => u.id === userId); if (userIndex !== -1) { DB.users[userIndex] = { ...DB.users[userIndex], ...updates }; resolve(DB.users[userIndex]); } else { resolve(null); } }, 300)),
    getTickets: () => new Promise(resolve => setTimeout(() => resolve([...DB.tickets]), 500)),
    getTicketById: (ticketId) => new Promise(resolve => setTimeout(() => resolve(DB.tickets.find(t => t.id === ticketId)), 300)),
    addTicket: (ticketData) => new Promise(resolve => setTimeout(() => { const newTicket = { ...ticketData, id: `ticket-${Date.now()}`, createdAt: new Date(), updatedAt: new Date(), upvotes: 0, downvotes: 0, replies: 0, }; DB.tickets.unshift(newTicket); resolve(newTicket); }, 500)),
    updateTicket: (ticketId, updates) => new Promise(resolve => setTimeout(() => { const ticketIndex = DB.tickets.findIndex(t => t.id === ticketId); if (ticketIndex !== -1) { DB.tickets[ticketIndex] = { ...DB.tickets[ticketIndex], ...updates, updatedAt: new Date() }; resolve(DB.tickets[ticketIndex]); } else { resolve(null); } }, 300)),
    getCategories: () => new Promise(resolve => setTimeout(() => resolve([...DB.categories]), 300)),
    addCategory: (categoryData) => new Promise(resolve => setTimeout(() => { const newCategory = { ...categoryData, id: `cat-${Date.now()}` }; DB.categories.push(newCategory); resolve(newCategory); }, 300)),
    getComments: (ticketId) => new Promise(resolve => setTimeout(() => resolve(DB.comments[ticketId] ? [...DB.comments[ticketId]] : []), 300)),
    addComment: (ticketId, commentData) => new Promise(resolve => setTimeout(() => { if (!DB.comments[ticketId]) { DB.comments[ticketId] = []; } const newComment = { ...commentData, id: `comment-${ticketId}-${Date.now()}`, createdAt: new Date() }; DB.comments[ticketId].push(newComment); const ticketIndex = DB.tickets.findIndex(t => t.id === ticketId); if(ticketIndex !== -1) { DB.tickets[ticketIndex].replies = (DB.tickets[ticketIndex].replies || 0) + 1; DB.tickets[ticketIndex].updatedAt = new Date(); } resolve(newComment); }, 500)),
};