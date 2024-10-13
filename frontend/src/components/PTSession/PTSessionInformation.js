import React from 'react';

const PTSessionInformation = ({ classDetails, onClose, onDeleteSuccess, onUpdate }) => {
    if (!classDetails) {
        return null;
    }

    const { id, full_name, description, status, time } = classDetails;
    console.log(classDetails)

    const handleDelete = () => {
        onDeleteSuccess();
    };

    const handleUpdate = () => {
        onUpdate();
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
                    <button onClick={handleUpdate}>Update PT Session</button>
                    <button onClick={handleDelete}>Delete PT Session</button>
                </div>
            )}

            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default PTSessionInformation;
