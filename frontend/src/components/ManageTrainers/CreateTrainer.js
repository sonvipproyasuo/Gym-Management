import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CreateTrainer = ({ isOpen, onClose, onSubmit, errorMessage, trainer }) => {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialization, setSpecialization] = useState('trainer'); // Đặt giá trị mặc định là 'trainer'

    useEffect(() => {
        if (trainer) {
            // Set giá trị mặc định khi update trainer
            setUsername(trainer.username);
            setFullName(trainer.full_name);
            setEmail(trainer.email);
            setPhone(trainer.phone);
            setSpecialization(trainer.specialization);
        } else {
            // Reset các trường khi tạo trainer mới và đặt giá trị mặc định cho specialization
            setUsername('');
            setFullName('');
            setEmail('');
            setPhone('');
            setSpecialization('trainer');  // Đặt giá trị mặc định khi tạo mới
        }
    }, [trainer]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trainerData = {
            username,
            fullName,
            email,
            phone,
            specialization
        };

        await onSubmit(trainerData);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            contentLabel={trainer ? 'Update Trainer' : 'Create Trainer'}
            className="modal" 
            overlayClassName="ReactModal__Overlay"
        >
            <h2>{trainer ? 'Update Trainer' : 'Create New Trainer'}</h2>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group-container">
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            disabled={!!trainer}  // Chỉ disable khi update, không disable khi tạo mới
                        />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Specialization</label>
                        <select 
                            value={specialization} 
                            onChange={(e) => setSpecialization(e.target.value)}
                        >
                            <option value="trainer">Trainer</option>
                            <option value="instructor">Instructor</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit">{trainer ? 'Update Trainer' : 'Create Trainer'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateTrainer;
