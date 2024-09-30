import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ClassPopup = ({ isOpen, onClose, onSubmit, onDelete, classDetails, setClassDetails, isUpdateMode }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit();
    };

    const handleDelete = async () => {
        if (onDelete) {
            await onDelete();
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="ReactModal__Overlay">
            <h2>{isUpdateMode ? 'Update Class' : 'Create New Class'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group-container">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={classDetails.title || ''}
                            onChange={(e) => setClassDetails({ ...classDetails, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={classDetails.description || ''}
                            onChange={(e) => setClassDetails({ ...classDetails, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Time</label>
                        <input
                            type="datetime-local"
                            value={classDetails.time || ''}
                            onChange={(e) => setClassDetails({ ...classDetails, time: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Max Participants</label>
                        <input
                            type="number"
                            value={classDetails.maxParticipants || 20}
                            onChange={(e) => setClassDetails({ ...classDetails, maxParticipants: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration (minutes)</label>
                        <input
                            type="number"
                            value={classDetails.duration || 60}
                            onChange={(e) => setClassDetails({ ...classDetails, duration: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit">{isUpdateMode ? 'Update Class' : 'Create Class'}</button>
                    {isUpdateMode && (
                        <button type="button" onClick={handleDelete} className="delete-button">
                            Delete Class
                        </button>
                    )}
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default ClassPopup;
