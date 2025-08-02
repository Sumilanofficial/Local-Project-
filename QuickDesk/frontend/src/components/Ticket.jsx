import React from 'react';
import { ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';

const Ticket = ({ ticket, onSelect, onVote }) => {
    const statusColor = {
        'Open': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Resolved': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-grow">
                <button 
                    onClick={onSelect} 
                    className="text-left w-full"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                        {ticket.subject}
                    </h3>
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Posted by {ticket.creatorName || 'Anonymous'} on {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex items-center space-x-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor[ticket.status]}`}>
                        {ticket.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                        {ticket.category}
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <MessageSquare size={18} />
                    <span>{ticket.replies || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onVote(ticket.id, 'upvotes');
                        }} 
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ChevronUp size={20} className="text-green-500" />
                    </button>
                    <span className="font-medium text-sm">
                        {(ticket.upvotes || 0) - (ticket.downvotes || 0)}
                    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onVote(ticket.id, 'downvotes');
                        }} 
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ChevronDown size={20} className="text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ticket;