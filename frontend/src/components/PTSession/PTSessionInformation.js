import React, { useState } from 'react';
import axios from 'axios';

const PTSessionInformation = ({ classDetails, onClose, onDeleteSuccess }) => {
    const [newSessionDate, setNewSessionDate] = useState('');
    const [newStartTime, setNewStartTime] = useState('');

    if (!classDetails) {
        return null;
    }

    const { id, full_name, description, status, time } = classDetails;

    const handleUpdateRequest = async () => {
        try {
            await axios.put(`http://localhost:5000/api/pt-sessions/request-update`, {
                session_id: id,
                new_session_date: newSessionDate,
                new_start_time: newStartTime
            });
            alert('Update request sent. Waiting for trainer confirmation.');
        } catch (error) {
            console.error('Error sending update request:', error);
            alert('Failed to send update request.');
        }
    };

    const handleDeleteRequest = async () => {
        try {
            await axios.put(`http://localhost:5000/api/pt-sessions/request-delete`, {
                session_id: id,
            });
            alert('Delete request sent. Waiting for trainer confirmation.');
            onDeleteSuccess();
        } catch (error) {
            console.error('Error sending delete request:', error);
            alert('Failed to send delete request.');
        }
    };

    const sessionDateTime = new Date(time);
    const endTime = new Date(sessionDateTime.getTime() + 60 * 60000);

    return (
        <div>
            <h2>PT Session Information</h2>
            <p>{description}</p>
            <p>Trainer: {full_name}</p>
            <p>Date: {sessionDateTime.toLocaleDateString()}</p>
            <p>Time: {sessionDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            <p>Status: {status}</p>

            {status === 'confirmed' && (
                <div>
                    <div className="form-group-container">
                        <div className="form-group">
                        <label>New Date</label>
                        <input 
                            type="date" 
                            value={newSessionDate} 
                            onChange={(e) => setNewSessionDate(e.target.value)} 
                        />
                        </div>
                        <div className="form-group">
                        <label>New Start Time</label>
                        <input 
                            type="time" 
                            value={newStartTime} 
                            onChange={(e) => setNewStartTime(e.target.value)} 
                        />
                        </div>
                    </div>
                    <button onClick={handleUpdateRequest}>Submit Update Request</button>
                    <button onClick={handleDeleteRequest}>Request Delete PT Session</button>
                </div>
            )}

            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default PTSessionInformation;
