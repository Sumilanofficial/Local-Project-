import React, { useState, useEffect } from 'react';
import { DB } from '../utils/mockDB';
import Spinner from './Spinner';

const CreateTicket = ({ user, setPage }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await DB.getCategories();
                setCategories(cats);
                if (cats.length > 0) setCategory(cats[0].name);
            } catch (err) {
                setError('Failed to load categories. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !description || !category) {
            setError('All fields are required.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await DB.addTicket({
                subject,
                description,
                category,
                status: 'Open',
                createdBy: user.id,
                creatorName: user.email,
            });
            setPage('dashboard');
        } catch (err) {
            setError('Failed to create ticket. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create a New Ticket</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Subject
                        </label>
                        <input 
                            type="text" 
                            id="subject" 
                            value={subject} 
                            onChange={e => setSubject(e.target.value)} 
                            disabled={submitting}
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-60" 
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                        </label>
                        <select 
                            id="category" 
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            disabled={submitting}
                            required 
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-60"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea 
                            id="description" 
                            rows="6" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            disabled={submitting}
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-60"
                        ></textarea>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end space-x-4">
                        <button 
                            type="button" 
                            onClick={() => setPage('dashboard')} 
                            disabled={submitting}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:hover:bg-blue-600"
                        >
                            {submitting ? (
                                <div className="flex items-center">
                                    <Spinner />
                                    <span className="ml-2">Creating...</span>
                                </div>
                            ) : (
                                'Create Ticket'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicket;