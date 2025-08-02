import React, { useState, useEffect, useCallback } from 'react';
import { DB } from '../utils/mockDB';
import Spinner from './Spinner';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await DB.getUsers();
        setUsers(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRoleChange = async (userId, newRole) => {
        await DB.updateUser(userId, { role: newRole });
        fetchData();
    };

    if (loading) return <Spinner />;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <select 
                                    value={user.role} 
                                    onChange={e => handleRoleChange(user.id, e.target.value)} 
                                    className="p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option>user</option>
                                    <option>agent</option>
                                    <option>admin</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await DB.getCategories();
        setCategories(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        await DB.addCategory({ name: newCategory });
        setNewCategory('');
        fetchData();
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)} 
                    placeholder="New category name" 
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                />
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add
                </button>
            </form>
            <ul className="space-y-2">
                {categories.map(cat => (
                    <li 
                        key={cat.id} 
                        className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md flex justify-between items-center"
                    >
                        <span className="text-gray-900 dark:text-white">{cat.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h1>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('users')} 
                        className={`${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        User Management
                    </button>
                    <button 
                        onClick={() => setActiveTab('categories')} 
                        className={`${activeTab === 'categories' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Category Management
                    </button>
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === 'users' ? <UserManagement /> : <CategoryManagement />}
            </div>
        </div>
    );
};

export default AdminPanel;