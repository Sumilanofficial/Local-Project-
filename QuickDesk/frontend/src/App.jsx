import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, MessageSquare, PlusCircle, User, LogIn, LogOut, Search, Filter, X, ArrowRight, ChevronsUpDown, Check, Trash2, Edit, Send } from 'lucide-react';

// --- Mock Database ---
// This section simulates a backend database. In a real application,
// these functions would make API calls to your server.
const DB = {
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

// --- Components ---

const Spinner = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
);

const Header = ({ user, setPage, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleLogout = () => { onLogout(); setPage('login'); };
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={() => setPage('dashboard')} className="flex-shrink-0 text-2xl font-bold text-blue-600 dark:text-blue-400">QuickDesk</button>
                        <nav className="hidden md:flex md:ml-10 md:space-x-8">
                            <button onClick={() => setPage('dashboard')} className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Dashboard</button>
                            {user && <button onClick={() => setPage('createTicket')} className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">New Ticket</button>}
                            {user?.role === 'admin' && <button onClick={() => setPage('admin')} className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Admin</button>}
                        </nav>
                    </div>
                    <div className="flex items-center">
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user.email} ({user.role})</span>
                                    <button onClick={handleLogout} className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"><LogOut className="mr-2 h-5 w-5" /> Logout</button>
                                </>
                            ) : (
                                <button onClick={() => setPage('login')} className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"><LogIn className="mr-2 h-5 w-5" /> Login</button>
                            )}
                        </div>
                        <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 dark:text-gray-300"><ChevronsUpDown size={24} /></button></div>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         <button onClick={() => { setPage('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Dashboard</button>
                        {user && <button onClick={() => { setPage('createTicket'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">New Ticket</button>}
                        {user?.role === 'admin' && <button onClick={() => { setPage('admin'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Admin</button>}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                        {user ? (
                            <div className="px-5">
                                <p className="text-base font-medium text-gray-800 dark:text-white">{user.email}</p>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.role}</p>
                                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="mt-3 flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"><LogOut className="mr-2 h-5 w-5" /> Logout</button>
                            </div>
                        ) : (
                             <div className="px-2"><button onClick={() => { setPage('login'); setIsMenuOpen(false); }} className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"><LogIn className="mr-2 h-5 w-5" /> Login</button></div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

const Auth = ({ setPage, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (isLogin) {
            const user = await DB.findUserByEmail(email);
            if (user && user.password === password) { onLoginSuccess(user); } else { setError('Invalid email or password.'); }
        } else {
            const existingUser = await DB.findUserByEmail(email);
            if (existingUser) { setError('User with this email already exists.'); } else { const newUser = await DB.addUser({ email, password, role: 'user' }); onLoginSuccess(newUser); }
        }
        setLoading(false);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">{isLogin ? 'Sign in to your account' : 'Create a new account'}</h2></div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div><input id="email-address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Email address" /></div>
                        <div><input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="Password" /></div>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div><button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">{loading ? <Spinner /> : (isLogin ? 'Sign in' : 'Register')}</button></div>
                </form>
                <div className="text-sm text-center"><button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">{isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Sign in'}</button></div>
            </div>
        </div>
    );
};

const Ticket = ({ ticket, setPage, setSelectedTicketId, onVote }) => {
    const statusColor = { 'Open': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', 'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', 'Resolved': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-grow">
                <button onClick={() => { setSelectedTicketId(ticket.id); setPage('ticketDetail'); }} className="text-left"><h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{ticket.subject}</h3></button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Posted by {ticket.creatorName || 'Anonymous'} on {new Date(ticket.createdAt).toLocaleDateString()}</p>
                <div className="mt-2 flex items-center space-x-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor[ticket.status]}`}>{ticket.status}</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">{ticket.category}</span>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"><MessageSquare size={18} /><span>{ticket.replies || 0}</span></div>
                <div className="flex items-center space-x-1">
                    <button onClick={() => onVote(ticket.id, 'upvotes')} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronUp size={20} className="text-green-500" /></button>
                    <span className="font-medium text-sm">{ (ticket.upvotes || 0) - (ticket.downvotes || 0) }</span>
                    <button onClick={() => onVote(ticket.id, 'downvotes')} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronDown size={20} className="text-red-500" /></button>
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ user, setPage, setSelectedTicketId }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [myTicketsFilter, setMyTicketsFilter] = useState(false);
    const [sortBy, setSortBy] = useState('recentlyModified');
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 10;
    const fetchData = useCallback(async () => { setLoading(true); const [ticketsData, categoriesData] = await Promise.all([ DB.getTickets(), DB.getCategories() ]); setTickets(ticketsData); setCategories(categoriesData); setLoading(false); }, []);
    useEffect(() => { fetchData(); }, [fetchData]);
    const handleVote = async (ticketId, type) => { const ticket = tickets.find(t => t.id === ticketId); if (ticket) { await DB.updateTicket(ticketId, { [type]: (ticket[type] || 0) + 1 }); fetchData(); } };
    const filteredAndSortedTickets = useMemo(() => { let filtered = tickets; if (search) { filtered = filtered.filter(ticket => ticket.subject.toLowerCase().includes(search.toLowerCase()) || ticket.description.toLowerCase().includes(search.toLowerCase())); } if (statusFilter !== 'All') filtered = filtered.filter(ticket => ticket.status === statusFilter); if (categoryFilter !== 'All') filtered = filtered.filter(ticket => ticket.category === categoryFilter); if (myTicketsFilter && user) filtered = filtered.filter(ticket => ticket.createdBy === user.id); return [...filtered].sort((a, b) => { switch (sortBy) { case 'mostReplied': return (b.replies || 0) - (a.replies || 0); case 'recentlyModified': default: return new Date(b.updatedAt) - new Date(a.updatedAt); } }); }, [tickets, search, statusFilter, categoryFilter, myTicketsFilter, sortBy, user]);
    const currentTickets = filteredAndSortedTickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage);
    const totalPages = Math.ceil(filteredAndSortedTickets.length / ticketsPerPage);
    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ticket Dashboard</h1><button onClick={() => setPage('createTicket')} className="flex items-center justify-center w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"><PlusCircle size={20} className="mr-2" /> Create New Ticket</button></div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="All">All Statuses</option><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></div>
                    <div><select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="All">All Categories</option>{categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}</select></div>
                    <div><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option value="recentlyModified">Sort by: Recently Modified</option><option value="mostReplied">Sort by: Most Replied</option></select></div>
                    {user && (<div className="flex items-center col-span-full"><input type="checkbox" id="my-tickets" checked={myTicketsFilter} onChange={e => setMyTicketsFilter(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label htmlFor="my-tickets" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Show my tickets only</label></div>)}
                </div>
            </div>
            <div className="space-y-4">{currentTickets.length > 0 ? (currentTickets.map(ticket => <Ticket key={ticket.id} ticket={ticket} setPage={setPage} setSelectedTicketId={setSelectedTicketId} onVote={handleVote} />)) : (<div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm"><p className="text-gray-500 dark:text-gray-400">No tickets found.</p></div>)}</div>
            {totalPages > 1 && (<div className="mt-6 flex justify-center items-center space-x-2">{Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (<button key={number} onClick={() => setCurrentPage(number)} className={`px-4 py-2 rounded-md text-sm ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>{number}</button>))}</div>)}
        </div>
    );
};

const CreateTicket = ({ user, setPage }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => { const fetchCategories = async () => { const cats = await DB.getCategories(); setCategories(cats); if (cats.length > 0) setCategory(cats[0].name); }; fetchCategories(); }, []);
    const handleSubmit = async (e) => { e.preventDefault(); if (!subject || !description || !category) { setError('All fields are required.'); return; } setLoading(true); setError(''); try { await DB.addTicket({ subject, description, category, status: 'Open', createdBy: user.id, creatorName: user.email, }); setPage('dashboard'); } catch (err) { setError('Failed to create ticket. Please try again.'); } finally { setLoading(false); } };
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create a New Ticket</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div><label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label><input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" /></div>
                    <div><label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label><select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">{categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}</select></div>
                    <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label><textarea id="description" rows="6" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea></div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end space-x-4"><button type="button" onClick={() => setPage('dashboard')} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button><button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">{loading ? 'Submitting...' : 'Submit Ticket'}</button></div>
                </form>
            </div>
        </div>
    );
};

const TicketDetail = ({ ticketId, user, setPage }) => {
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchData = useCallback(async () => { setLoading(true); const [ticketData, commentsData] = await Promise.all([ DB.getTicketById(ticketId), DB.getComments(ticketId) ]); setTicket(ticketData); setComments(commentsData); setLoading(false); }, [ticketId]);
    useEffect(() => { if (ticketId) fetchData(); }, [ticketId, fetchData]);
    const handleAddComment = async (e) => { e.preventDefault(); if (!newComment.trim() || !user) return; setIsSubmitting(true); await DB.addComment(ticketId, { text: newComment, authorId: user.id, authorName: user.email }); setNewComment(''); setIsSubmitting(false); fetchData(); };
    const handleStatusChange = async (newStatus) => { if (!ticketId || user.role === 'user') return; await DB.updateTicket(ticketId, { status: newStatus }); fetchData(); };
    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    if (!ticket) return <div className="text-center p-8">Ticket not found.</div>;
    const statusColor = { 'Open': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', 'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', 'Resolved': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <button onClick={() => setPage('dashboard')} className="mb-4 text-blue-600 dark:text-blue-400 hover:underline">&larr; Back to Dashboard</button>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
                        {user.role !== 'user' ? (<select value={ticket.status} onChange={(e) => handleStatusChange(e.target.value)} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select>) : (<span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor[ticket.status]}`}>{ticket.status}</span>)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Opened by {ticket.creatorName} on {new Date(ticket.createdAt).toLocaleString()} &bull; Category: {ticket.category}</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="prose dark:prose-invert max-w-none"><p>{ticket.description}</p></div>
                    <div className="border-t dark:border-gray-700 pt-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conversation</h2>
                        <div className="space-y-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0"><div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center"><User size={20} className="text-gray-500 dark:text-gray-400" /></div></div>
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <div className="flex items-center justify-between"><p className="text-sm font-medium text-gray-900 dark:text-white">{comment.authorName}</p><p className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p></div>
                                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {user && (
                        <div className="border-t dark:border-gray-700 pt-6">
                            <form onSubmit={handleAddComment} className="flex items-start space-x-3">
                                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a reply..." rows="3" required className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"><Send size={20} /></button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const UserManagement = () => {
        const [users, setUsers] = useState([]);
        const [loading, setLoading] = useState(true);
        const fetchData = useCallback(async () => { setLoading(true); const data = await DB.getUsers(); setUsers(data); setLoading(false); }, []);
        useEffect(() => { fetchData(); }, [fetchData]);
        const handleRoleChange = async (userId, newRole) => { await DB.updateUser(userId, { role: newRole }); fetchData(); };
        if (loading) return <Spinner />;
        return (
            <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th></tr></thead><tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">{users.map(user => (<tr key={user.id}><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)} className="p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"><option>user</option><option>agent</option><option>admin</option></select></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td></tr>))}</tbody></table></div>
        );
    };
    const CategoryManagement = () => {
        const [categories, setCategories] = useState([]);
        const [newCategory, setNewCategory] = useState('');
        const [loading, setLoading] = useState(true);
        const fetchData = useCallback(async () => { setLoading(true); const data = await DB.getCategories(); setCategories(data); setLoading(false); }, []);
        useEffect(() => { fetchData(); }, [fetchData]);
        const handleAddCategory = async (e) => { e.preventDefault(); if (!newCategory.trim()) return; await DB.addCategory({ name: newCategory }); setNewCategory(''); fetchData(); };
        if (loading) return <Spinner />;
        return (
            <div><form onSubmit={handleAddCategory} className="flex gap-2 mb-4"><input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="flex-grow px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" /><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add</button></form><ul className="space-y-2">{categories.map(cat => (<li key={cat.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md flex justify-between items-center"><span className="text-gray-900 dark:text-white">{cat.name}</span></li>))}</ul></div>
        );
    };
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h1>
            <div className="border-b border-gray-200 dark:border-gray-700"><nav className="-mb-px flex space-x-8" aria-label="Tabs"><button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>User Management</button><button onClick={() => setActiveTab('categories')} className={`${activeTab === 'categories' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Category Management</button></nav></div>
            <div className="mt-6">{activeTab === 'users' ? <UserManagement /> : <CategoryManagement />}</div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [page, setPage] = useState('login'); // login, dashboard, createTicket, ticketDetail, admin
    const [user, setUser] = useState(null);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    const handleLoginSuccess = (loggedInUser) => {
        setUser(loggedInUser);
        setPage('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setPage('login');
    };

    const renderPage = () => {
        if (!user && page !== 'login') {
            return <Auth setPage={setPage} onLoginSuccess={handleLoginSuccess} />;
        }

        switch (page) {
            case 'login':
                return <Auth setPage={setPage} onLoginSuccess={handleLoginSuccess} />;
            case 'createTicket':
                return <CreateTicket user={user} setPage={setPage} />;
            case 'ticketDetail':
                return <TicketDetail ticketId={selectedTicketId} user={user} setPage={setPage} />;
            case 'admin':
                return user.role === 'admin' ? <AdminPanel /> : <Dashboard user={user} setPage={setPage} setSelectedTicketId={setSelectedTicketId} />;
            case 'dashboard':
            default:
                return <Dashboard user={user} setPage={setPage} setSelectedTicketId={setSelectedTicketId} />;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            <Header user={user} setPage={setPage} onLogout={handleLogout} />
            <main>
                {renderPage()}
            </main>
        </div>
    );
}
