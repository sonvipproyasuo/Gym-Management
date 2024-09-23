import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CreateTrainer = ({ isOpen, onClose, onSubmit, errorMessage, trainer }) => {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialization, setSpecialization] = useState('trainer');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (trainer) {
            setUsername(trainer.username);
            setFullName(trainer.full_name);
            setEmail(trainer.email);
            setPhone(trainer.phone);
            setSpecialization(trainer.specialization);
        } else {
            setUsername('');
            setFullName('');
            setEmail('');
            setPhone('');
            setSpecialization('trainer');
            setPassword('');
        }
    }, [trainer]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trainerData = {
            fullName,
            ...(trainer ? {} : { username, email, phone, specialization, password })
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
                            disabled={!!trainer}
                            required={!trainer}
                        />
                    </div>
                    {!trainer && (
                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            disabled={!!trainer}
                            required={!trainer}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            disabled={!!trainer}
                            required={!trainer}
                        />
                    </div>
                    <div className="form-group">
                        <label>Specialization</label>
                        <select 
                            value={specialization} 
                            onChange={(e) => setSpecialization(e.target.value)}
                            disabled={!!trainer}
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
