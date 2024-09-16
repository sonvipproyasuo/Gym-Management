import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CreateTrainer = ({ isOpen, onClose, onSubmit, errorMessage }) => {
    const [trainerData, setTrainerData] = useState({
        username: '',
        full_name: '',
        email: '',
        phone: '',
        specialization: 'trainer'
    });

    const handleInputChange = (e) => {
        setTrainerData({
            ...trainerData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(trainerData);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            contentLabel="Create Trainer" 
            className="modal" 
            overlayClassName="ReactModal__Overlay"
        >
            <h2>Create New Trainer</h2>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={trainerData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={trainerData.full_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={trainerData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={trainerData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Specialization</label>
                    <select
                        name="specialization"
                        value={trainerData.specialization}
                        onChange={handleInputChange}
                    >
                        <option value="trainer">Trainer</option>
                        <option value="instructor">Instructor</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit">Add Trainer</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateTrainer;
