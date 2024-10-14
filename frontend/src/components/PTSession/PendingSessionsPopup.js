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

    const handleConfirm = async (sessionId, actionType) => {
        try {
            if (actionType === 'delete') {
                await axios.post(`http://localhost:5000/api/pt-sessions/confirm-delete`, { session_id: sessionId, action: 'confirm' });
                alert(`PT session deletion confirmed and session has been removed.`);
            } else {
                await axios.put(`http://localhost:5000/api/pt-sessions/confirm`, { session_id: sessionId, action_type: actionType });
                alert(`PT session ${actionType} confirmed successfully.`);
            }
            onConfirmSuccess();
            onClose();
        } catch (error) {
            console.error(`Error confirming PT session ${actionType}:`, error);
            alert(`Failed to confirm PT session ${actionType}.`);
        }
    };

    const handleCancel = async (sessionId, actionType) => {
        try {
            if (actionType === 'delete' || actionType === 'update') {
                await axios.post(`http://localhost:5000/api/pt-sessions/confirm-delete`, { session_id: sessionId, action: 'reject' });
                alert(`PT session ${actionType} request has been canceled and session remains unchanged.`);
            } else if (actionType === 'create') {
                await axios.put(`http://localhost:5000/api/pt-sessions/cancel`, { session_id: sessionId, action_type: 'create' });
                alert(`Pending PT session creation has been canceled.`);
            }
            onConfirmSuccess();
            onClose();
        } catch (error) {
            console.error(`Error canceling PT session ${actionType}:`, error);
            alert(`Failed to cancel PT session ${actionType}.`);
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
                                <p>Request Type: {session.pending_action}</p>
                                <p>Customer: {session.customer_full_name}</p>
                                <p>Time: {fullDateTime.toLocaleString()}</p>

                                {session.pending_action === 'create' && (
                                    <>
                                        <button onClick={() => handleConfirm(session.id, 'create')}>Confirm Create</button>
                                        <button onClick={() => handleCancel(session.id, 'create')}>Cancel Create</button>
                                    </>
                                )}

                                {session.pending_action === 'update' && (
                                    <>
                                        <button onClick={() => handleConfirm(session.id, 'update')}>Confirm Update</button>
                                        <button onClick={() => handleCancel(session.id, 'update')}>Cancel Update</button>
                                    </>
                                )}

                                {session.pending_action === 'delete' && (
                                    <>
                                        <button onClick={() => handleConfirm(session.id, 'delete')}>Confirm Delete</button>
                                        <button onClick={() => handleCancel(session.id, 'delete')}>Cancel Delete</button>
                                    </>
                                )}
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
