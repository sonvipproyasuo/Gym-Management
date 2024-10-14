import React, { useState } from 'react';
import axios from 'axios';

const PTSessionPopup = ({ trainers, username, onClose }) => {
    const [trainerUsername, setTrainerUsername] = useState('');
    const [sessionDate, setSessionDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [error, setError] = useState('');

    const handleBookSession = async () => {
        if (!trainerUsername || !sessionDate || !startTime) {
            setError('All fields are required.');
            return;
        }
    
        const formattedStartTime = startTime.includes(':') ? startTime + ':00' : startTime;
    
        console.log({
            customer_username: username,
            trainer_username: trainerUsername,
            session_date: sessionDate,
            start_time: formattedStartTime
        });
    
        try {
            const response = await axios.post('http://localhost:5000/api/pt-sessions/book', {
                customer_username: username,
                trainer_username: trainerUsername,
                session_date: sessionDate,
                start_time: formattedStartTime
            });
    
            alert('PT session booked successfully.');
            onClose();
        } catch (error) {
            console.error('Error booking PT session:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to book PT session. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>Book a PT Session</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-group-container pt-session">
                <div className="form-group">
                    <label>
                        Select PT (Trainer):
                    </label>
                    <select value={trainerUsername} onChange={(e) => setTrainerUsername(e.target.value)}>
                        <option value="">-- Select a PT --</option>
                        {trainers.map(trainer => (
                            <option key={trainer.username} value={trainer.username}>
                                {trainer.full_name} ({trainer.username})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>
                        Session Date:
                    </label>
                    <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />

                </div>
                <div className="form-group">
                    <label>
                        Start Time:
                    </label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <button onClick={handleBookSession}>Book PT Session</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default PTSessionPopup;
