import React from 'react';

const TrainerPTSessionInfo = ({ sessionDetails, onClose }) => {
    if (!sessionDetails) {
        return null;
    }

    const { full_name, description, status, session_date, start_time } = sessionDetails;

    const sessionDateOnly = session_date.split('T')[0];
    const sessionDateTime = new Date(`${sessionDateOnly}T${start_time}`);
    const endTime = new Date(sessionDateTime.getTime() + 60 * 60000);

    return (
        <div>
            <h2>PT Session Information</h2>
            <p>{description}</p>
            <p>Customer: {full_name}</p>
            <p>Date: {sessionDateTime.toLocaleDateString()}</p>
            <p>Time: {sessionDateTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()}</p>
            <p>Status: {status}</p>

            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default TrainerPTSessionInfo;
