import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageTrainers.css';
import CreateTrainer from './CreateTrainer';
import { useNavigate } from 'react-router-dom';

const ManageTrainers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

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
            if (selectedTrainer) {
                await axios.put(`http://localhost:5000/api/trainers/${selectedTrainer.username}`, trainerData);
                setTrainers(trainers.map(trainer => 
                    trainer.username === selectedTrainer.username ? { ...trainer, ...trainerData } : trainer
                ));
                alert('Trainer updated successfully');
            } else {
                const response = await axios.post('http://localhost:5000/api/trainers', trainerData);
                setTrainers([...trainers, response.data.newTrainer]);
                alert('Trainer created successfully');
            }

            setIsModalOpen(false);
            setSelectedTrainer(null);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                const duplicateFields = error.response.data.existingFields;
                const errorMessages = [];
                if (duplicateFields.username) errorMessages.push('Username already exists');
                if (duplicateFields.email) errorMessages.push('Email already exists');
                if (duplicateFields.phone) errorMessages.push('Phone number already exists');
                setErrorMessage(errorMessages.join(', '));
            } else {
                setErrorMessage('Failed to create/update trainer');
            }
        }
    };

    const handleUpdateTrainer = (trainer) => {
        setSelectedTrainer(trainer);
        setIsModalOpen(true);
    };

    const deleteTrainer = async (username) => {
        const confirmed = window.confirm('Are you sure you want to delete this trainer? This action cannot be undone.');
        if (!confirmed) return;

        try {
            await axios.delete(`http://localhost:5000/api/trainers/${username}`);
            setTrainers(trainers.filter(trainer => trainer.username !== username));
            alert('Trainer and corresponding account deleted successfully!');
        } catch (error) {
            console.error('Error deleting trainer:', error);
            alert('Failed to delete trainer. Please try again.');
        }
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
                                        <td>{trainer.full_name}</td>
                                        <td>{trainer.email}</td>
                                        <td>{trainer.phone}</td>
                                        <td>{trainer.specialization}</td>
                                        <td>
                                            <button onClick={() => handleUpdateTrainer(trainer)}>Update</button>
                                            <button onClick={() => deleteTrainer(trainer.username)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <CreateTrainer 
                    isOpen={isModalOpen} 
                    onClose={() => { setIsModalOpen(false); setSelectedTrainer(null); }} 
                    onSubmit={handleCreateTrainer} 
                    errorMessage={errorMessage}
                    trainer={selectedTrainer}
                />
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
};

export default ManageTrainers;
