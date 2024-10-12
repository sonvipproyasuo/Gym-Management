import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const ClassPopup = ({ isOpen, onClose, classDetails, onUnregisterSuccess, auth, fetchAvailableClasses }) => {
    const handleUnregister = async () => {
        const confirmed = window.confirm('Are you sure you want to unregister from this class?');
        if (!confirmed) return;

        try {
            await axios.delete('http://localhost:5000/api/class-schedule/unregister', {
                data: {
                    class_id: classDetails.id,
                    customer_username: auth.username
                }
            });
            alert('Unregistered successfully!');
            onUnregisterSuccess();
            fetchAvailableClasses();
        } catch (error) {
            console.error('Error unregistering from class:', error);
            alert('Failed to unregister from class.');
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="ReactModal__Overlay">
            <h2>{classDetails.title}</h2>
            <p>{classDetails.description}</p>
            <p>Instructor: {classDetails.full_name}</p>
            <p>Time: {new Date(classDetails.time).toLocaleString()}</p>
            <button onClick={handleUnregister}>Unregister</button>
            <button onClick={onClose}>Close</button>
        </Modal>
    );
};

export default ClassPopup;
