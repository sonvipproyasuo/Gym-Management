import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvailableClasses = ({ username, onRegisterSuccess, fetchAvailableClasses }) => {
    const [availableClasses, setAvailableClasses] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            if (isFetching) return; 
            setIsFetching(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/class-schedule/available/${username}`);
                setAvailableClasses(response.data);
            } catch (error) {
                console.error('Error fetching available classes:', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchClasses();
    }, [username, fetchAvailableClasses]);

    const handleRegister = async (classId) => {
        try {
            await axios.post('http://localhost:5000/api/class-schedule/register', {
                class_id: classId,
                customer_username: username 
            });
            alert('Registered successfully!');
            fetchAvailableClasses(); 
            onRegisterSuccess();
        } catch (error) {
            if (error.response && error.response.data.message === 'The class is full, registration not allowed') {
                alert('The class is full. You cannot register.');
            } else {
                console.error('Error registering for class:', error);
                alert('Failed to register for class.');
            }
        }
    };

    return (
        <div>
            <h2>Available Classes</h2>
            <ul>
                {availableClasses.map(cls => (
                    <li key={cls.id}>
                        <h3>{cls.title}</h3>
                        <p>{cls.description}</p>
                        <p>Instructor: {cls.full_name}</p>
                        <p>Time: {new Date(cls.time).toLocaleString()}</p>
                        <p>Available slots: {cls.available_slots}</p>
                        <button onClick={() => handleRegister(cls.id)}>Register</button>
                    </li>
                ))}
            </ul>
            {availableClasses.length === 0 && <p>No available classes at the moment.</p>}
        </div>
    );
};

export default AvailableClasses;
