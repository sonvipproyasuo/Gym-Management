import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageTrainers.css';

const ManageTrainers = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/welcome');
    };

    return (
        <div className="manage-trainers-container">
            <div className="manage-trainers-box">
                <h1>Manage Trainers</h1>
                <p>This page will contain the functionality for managing trainers (CRUD operations).</p>
                <button>Add Trainer</button>
                <button className="back-button" onClick={handleBack}>Back</button>
            </div>
        </div>
    );
};

export default ManageTrainers;
