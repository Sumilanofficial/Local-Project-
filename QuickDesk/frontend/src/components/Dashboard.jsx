import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { DB } from '../utils/mockDB';
import Spinner from './Spinner';
import Ticket from './Ticket';

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

    const fetchData = useCallback(async () => { 
        setLoading(true); 
        try {
            const [ticketsData, categoriesData] = await Promise.all([
                DB.getTickets(),
                DB.getCategories()
            ]);
            setTickets(ticketsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchData(); 
    }, [fetchData]);

    const handleVote = async (ticketId, type) => {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            await DB.updateTicket(ticketId, { [type]: (ticket[type] || 0) + 1 });
            fetchData();
        }
    };

    const handleCreateTicket = () => {
        setPage('create-ticket');
    };

    const handleTicketClick = (ticketId) => {
        setSelectedTicketId(ticketId);
        setPage('ticket-detail');
    };

    const filteredAndSortedTickets = useMemo(() => {
        let filtered = tickets;
        
        if (search) {
            filtered = filtered.filter(ticket =>
                ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
                ticket.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        if (statusFilter !== 'All') {
            filtered = filtered.filter(ticket => ticket.status === statusFilter);
        }
        
        if (categoryFilter !== 'All') {
            filtered = filtered.filter(ticket => ticket.category === categoryFilter);
        }
        
        if (myTicketsFilter && user) {
            filtered = filtered.filter(ticket => ticket.createdBy === user.id);
        }

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'mostReplied':
                    return (b.replies || 0) - (a.replies || 0);
                case 'recentlyModified':
                default:
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
        });
    }, [tickets, search, statusFilter, categoryFilter, myTicketsFilter, sortBy, user]);

    const currentTickets = filteredAndSortedTickets.slice(
        (currentPage - 1) * ticketsPerPage,
        currentPage * ticketsPerPage
    );

    const totalPages = Math.ceil(filteredAndSortedTickets.length / ticketsPerPage);

    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ticket Dashboard</h1>
                <button 
                    onClick={handleCreateTicket} 
                    className="flex items-center justify-center w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    <PlusCircle size={20} className="mr-2" /> Create New Ticket
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search tickets..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        />
                    </div>
                    <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)} 
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <select 
                        value={categoryFilter} 
                        onChange={e => setCategoryFilter(e.target.value)} 
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                    <select 
                        value={sortBy} 
                        onChange={e => setSortBy(e.target.value)} 
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="recentlyModified">Recently Modified</option>
                        <option value="mostReplied">Most Replied</option>
                    </select>
                </div>
                {user && (
                    <div className="mt-4">
                        <label className="inline-flex items-center">
                            <input 
                                type="checkbox" 
                                checked={myTicketsFilter} 
                                onChange={e => setMyTicketsFilter(e.target.checked)} 
                                className="form-checkbox h-5 w-5 text-blue-600" 
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">Show only my tickets</span>
                        </label>
                    </div>
                )}
            </div>
            <div className="space-y-4">
                {currentTickets.map(ticket => (
                    <Ticket 
                        key={ticket.id} 
                        ticket={ticket} 
                        onSelect={() => handleTicketClick(ticket.id)}
                        onVote={handleVote} 
                    />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-md ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;