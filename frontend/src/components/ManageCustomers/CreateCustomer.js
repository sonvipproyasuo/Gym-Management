import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CreateCustomer = ({ isOpen, onClose, onSubmit, errorMessage, customer }) => {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [ptSessions, setPtSessions] = useState(0);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (customer) {
            setUsername(customer.username);
            setFullName(customer.full_name);
            setEmail(customer.email);
            setPhone(customer.phone);
            setAddress(customer.address);
            setPtSessions(customer.pt_sessions_registered);
            setAvatar(null);
        } else {
            setUsername('');
            setFullName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setPtSessions(0);
            setAvatar(null);
        }
    }, [customer]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const customerData = {
            username,
            fullName,
            email,
            phone,
            address,
            pt_sessions_registered: ptSessions,
            avatar
        };

        await onSubmit(customerData);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            contentLabel={customer ? 'Update Customer' : 'Create Customer'}
            className="modal" 
            overlayClassName="ReactModal__Overlay"
        >
            <h2>{customer ? 'Update Customer' : 'Create New Customer'}</h2>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group-container">
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            disabled={!!customer}
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
                            disabled={!!customer}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            disabled={!!customer}
                        />
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
                    <button type="submit">{customer ? 'Update Customer' : 'Create Customer'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateCustomer;
