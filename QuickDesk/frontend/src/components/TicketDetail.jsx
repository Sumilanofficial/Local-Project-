import React, { useState, useEffect, useCallback } from 'react';
import { User, Send } from 'lucide-react';
import { DB } from '../utils/mockDB';
import Spinner from './Spinner';

const TicketDetail = ({ ticketId, user, setPage }) => {
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [ticketData, commentsData] = await Promise.all([
            DB.getTicketById(ticketId),
            DB.getComments(ticketId)
        ]);
        setTicket(ticketData);
        setComments(commentsData);
        setLoading(false);
    }, [ticketId]);

    useEffect(() => {
        if (ticketId) fetchData();
    }, [ticketId, fetchData]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setIsSubmitting(true);
        await DB.addComment(ticketId, {
            text: newComment,
            authorId: user.id,
            authorName: user.email
        });
        setNewComment('');
        setIsSubmitting(false);
        fetchData();
    };

    const handleStatusChange = async (newStatus) => {
        if (!ticketId || user.role === 'user') return;
        await DB.updateTicket(ticketId, { status: newStatus });
        fetchData();
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    if (!ticket) return <div className="text-center p-8">Ticket not found.</div>;

    const statusColor = {
        'Open': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Resolved': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <button 
                onClick={() => setPage('dashboard')} 
                className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
            >
                &larr; Back to Dashboard
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
                        {user.role !== 'user' ? (
                            <select 
                                value={ticket.status} 
                                onChange={(e) => handleStatusChange(e.target.value)} 
                                className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Closed</option>
                            </select>
                        ) : (
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor[ticket.status]}`}>
                                {ticket.status}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Opened by {ticket.creatorName} on {new Date(ticket.createdAt).toLocaleString()} &bull; Category: {ticket.category}
                    </p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="prose dark:prose-invert max-w-none">
                        <p>{ticket.description}</p>
                    </div>
                    <div className="border-t dark:border-gray-700 pt-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conversation</h2>
                        <div className="space-y-4">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                            <User size={20} className="text-gray-500 dark:text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.authorName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {user && (
                        <div className="border-t dark:border-gray-700 pt-6">
                            <form onSubmit={handleAddComment} className="flex items-start space-x-3">
                                <textarea 
                                    value={newComment} 
                                    onChange={(e) => setNewComment(e.target.value)} 
                                    placeholder="Add a reply..." 
                                    rows="3" 
                                    required 
                                    className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                ></textarea>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;