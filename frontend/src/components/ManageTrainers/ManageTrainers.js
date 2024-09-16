import React, { useState, useEffect } from 'react';
import CreateTrainer from './CreateTrainer';
import './ManageTrainers.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageTrainers = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trainers, setTrainers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/trainers');
            setTrainers(response.data);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        }
    };

    const handleCreateTrainer = async (trainerData) => {
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/trainers', trainerData);
            setTrainers([...trainers, response.data.newTrainer]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding trainer:', error);
            setErrorMessage('Failed to add trainer');
        }
    };

    const deleteTrainer = async (username) => {
        const confirmed = window.confirm('Are you sure you want to delete this trainer?');
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:5000/api/trainers/${username}`);
            setTrainers(trainers.filter(trainer => trainer.username !== username));
            alert('Trainer deleted successfully');
        } catch (error) {
            console.error('Error deleting trainer:', error);
            alert('Failed to delete trainer');
        }
    };

    const handleBack = () => {
        navigate('/welcome');
    };

    return (
        <div className="manage-trainers-container">
            <div className="manage-trainers-content">
                <h1>Manage Trainers</h1>
                <button className="create-button" onClick={() => setIsModalOpen(true)}>Add Trainer</button>
                <div className="trainers-list">
                    {trainers.length === 0 ? (
                        <p>No trainers available.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Specialization</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainers.map((trainer) => (
                                    <tr key={trainer.username}>
                                        <td>{trainer.username}</td>
                                        <td>{trainer.full_name}</td>
                                        <td>{trainer.email}</td>
                                        <td>{trainer.phone}</td>
                                        <td>{trainer.specialization}</td>
                                        <td>
                                            <button onClick={() => alert('Edit Trainer')}>
                                                Edit
                                            </button>
                                            <button onClick={() => deleteTrainer(trainer.username)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <CreateTrainer 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleCreateTrainer} 
                    errorMessage={errorMessage}
                />
                <button className="back-button" onClick={handleBack}>Back</button>
            </div>
        </div>
    );
};

export default ManageTrainers;
