import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CreateTicket from './components/CreateTicket';
import TicketDetail from './components/TicketDetail';
import AdminPanel from './components/AdminPanel';
import Spinner from './components/Spinner';

const App = () => {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState('dashboard');
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    const handleLogout = () => {
        setUser(null);
        setPage('dashboard');
    };

    const handlePageChange = (newPage, ticketId = null) => {
        setIsLoading(true);
        if (ticketId !== null) {
            setSelectedTicketId(ticketId);
        }
        setPage(newPage);
        // Simulate page transition loading
        setTimeout(() => setIsLoading(false), 300);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header user={user} onLogout={handleLogout} />
            <main>
                {!user ? (
                    <Auth setUser={setUser} onLoginSuccess={setUser} setPage={handlePageChange} />
                ) : (
                    <>
                        {page === 'dashboard' && (
                            <Dashboard 
                                user={user} 
                                setPage={handlePageChange} 
                                setSelectedTicketId={setSelectedTicketId} 
                            />
                        )}
                        {page === 'create-ticket' && (
                            <CreateTicket 
                                user={user} 
                                setPage={handlePageChange} 
                            />
                        )}
                        {page === 'ticket-detail' && (
                            <TicketDetail 
                                ticketId={selectedTicketId} 
                                user={user} 
                                setPage={handlePageChange} 
                            />
                        )}
                        {page === 'admin' && user.role === 'admin' && (
                            <AdminPanel />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default App;
