import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingSessionsPopup = ({ trainerUsername, onClose, onConfirmSuccess }) => {
    const [pendingSessions, setPendingSessions] = useState([]);

    const fetchPendingSessions = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/pt-sessions/pending/${trainerUsername}`);
            setPendingSessions(response.data);
        } catch (error) {
            console.error('Error fetching pending PT sessions:', error);
        }
    };

    useEffect(() => {
        fetchPendingSessions();
    }, [trainerUsername]);

    const handleConfirm = async (sessionId) => {
        try {
            await axios.put(`http://localhost:5000/api/pt-sessions/confirm`, { session_id: sessionId, action_type: 'create' });
            alert('PT session confirmed successfully.');
            onConfirmSuccess();
            onClose();
        } catch (error) {
            console.error('Error confirming PT session:', error);
            alert('Failed to confirm PT session.');
        }
    };

    const handleCancel = async (sessionId) => {
        try {
            await axios.put(`http://localhost:5000/api/pt-sessions/cancel`, { session_id: sessionId, action_type: 'create' });
            alert('Pending PT session creation has been canceled.');
            onConfirmSuccess();
            onClose();
        } catch (error) {
            console.error('Error canceling PT session:', error);
            alert('Failed to cancel PT session.');
        }
    };

    return (
        <div>
            <h2>Pending PT Sessions</h2>
            {pendingSessions.length === 0 ? (
                <p>No pending sessions at the moment.</p>
            ) : (
                <ul>
                    {pendingSessions.map(session => {
                        const sessionDate = session.session_date.split('T')[0];
                        const startTime = session.start_time;
                        const fullDateTime = new Date(`${sessionDate}T${startTime}`);

                        return (
                            <li key={session.id}>
                                <p>Customer: {session.customer_full_name}</p>
                                <p>Time: {fullDateTime.toLocaleString()}</p>
                                <button onClick={() => handleConfirm(session.id)}>Confirm</button>
                                <button onClick={() => handleCancel(session.id)}>Cancel</button>
                            </li>
                        );
                    })}
                </ul>
            )}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default PendingSessionsPopup;
