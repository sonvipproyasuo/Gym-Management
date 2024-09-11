import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CreateCustomer = ({ isOpen, onClose, onSubmit, errorMessage }) => {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [ptSessions, setPtSessions] = useState(0);
    const [avatar, setAvatar] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        try {
            const customerData = {
                username,
                fullName,
                email,
                phone,
                address,
                ptSessionsRegistered: ptSessions,
                avatar
            };

            await onSubmit(customerData);
        } catch (err) {
            if (err.response && err.response.status === 409) {
                const duplicateFields = err.response.data.existingFields || {};
                const errorMessages = [];
                if (duplicateFields.username) errorMessages.push('Username already exists');
                if (duplicateFields.email) errorMessages.push('Email already exists');
                if (duplicateFields.phone) errorMessages.push('Phone number already exists');

                setErrors(duplicateFields);
            }
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            contentLabel="Create Customer" 
            className="modal" 
            overlayClassName="ReactModal__Overlay"
        >
            <h2>Create New Customer</h2>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group-container">
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className={errors.username ? 'input-error' : ''}
                        />
                        {errors.username && <span className="error-text">Username already exists</span>}
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
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-text">Email already exists</span>}
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            className={errors.phone ? 'input-error' : ''}
                        />
                        {errors.phone && <span className="error-text">Phone number already exists</span>}
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input 
                            type="text" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>PT Sessions Registered</label>
                        <input 
                            type="number" 
                            value={ptSessions} 
                            onChange={(e) => setPtSessions(Number(e.target.value))} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Avatar</label>
                        <input 
                            type="file" 
                            onChange={(e) => setAvatar(e.target.files[0])} 
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit">Create Customer</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateCustomer;
