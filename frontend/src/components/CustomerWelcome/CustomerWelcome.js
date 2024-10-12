import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Notifications from '../Notifications/Notifications';
import { useNavigate } from 'react-router-dom';
import Calendar from '../Calendar/Calendar';
import AvailableClasses from '../AvailableClasses/AvailableClasses';
import ClassPopup from '../AvailableClasses/ClassPopup';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const CustomerWelcome = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [isPasswordReset, setIsPasswordReset] = useState(auth.status !== 'inactive');
    const [isAvailableClassesOpen, setIsAvailableClassesOpen] = useState(false);
    const [isClassPopupOpen, setIsClassPopupOpen] = useState(false);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [registeredClasses, setRegisteredClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const { logout } = useContext(AuthContext);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/notifications/${auth.username}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [auth.username]);

    useEffect(() => {
        if (!isPasswordReset) {
            alert('Please change your password for the first login');
        } else {
            fetchNotifications();
            fetchRegisteredClasses();
            fetchAvailableClasses();
        }
    }, [isPasswordReset, fetchNotifications]);

    const fetchAvailableClasses = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/class-schedule/available/${auth.username}`);
            setAvailableClasses(response.data);
        } catch (error) {
            console.error('Error fetching available classes:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchRegisteredClasses = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/class-schedule/registered/${auth.username}`);
            setRegisteredClasses(response.data);
        } catch (error) {
            console.error('Error fetching registered classes:', error);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/customers/${auth.username}/change-password`, {
                newPassword
            });
            alert('Password changed successfully. Please log in again.');
            logout();
            navigate('/');
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Failed to change password. Please try again.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleEventClick = (event) => {
        setSelectedClass({
            id: event.event.extendedProps.id,
            title: event.event.title,
            description: event.event.extendedProps.description,
            time: event.event.start.toISOString(),
            full_name: event.event.extendedProps.full_name
        });
        setIsClassPopupOpen(true);
    };

    const handleUnregisterSuccess = () => {
        setIsClassPopupOpen(false);
        fetchRegisteredClasses();
        fetchAvailableClasses();
    };

    if (!isPasswordReset) {
        return (
            <div className="welcome-container">
                <div className="welcome-box">
                    <h1>Welcome, {auth.full_name}!</h1>
                    <p>This is your customer dashboard.</p>

                    <div className="change-password-container">
                        <input
                            className='password-change'
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            className='password-change'
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleChangePassword}>Change Password</button>
                        {error && <p className="error-text">{error}</p>}
                    </div>
                </div>

                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div className="welcome-container">
            <div className="welcome-box customer">
                <h1>Welcome, {auth.full_name}!</h1>
                <p>Your role is: {auth.role}</p>

                <button onClick={() => {
                    if (!isFetching) {
                        fetchAvailableClasses();
                    }
                    setIsAvailableClassesOpen(true);
                }}>Register a Class</button>

                <Calendar
                    events={registeredClasses.map(cls => ({
                        title: cls.title,
                        start: cls.time,
                        end: new Date(new Date(cls.time).getTime() + cls.duration * 60000),
                        extendedProps: {
                            id: cls.id,
                            description: cls.description,
                            full_name: cls.full_name
                        }
                    }))}
                    onSelectEvent={handleEventClick}
                />

                {selectedClass && (
                    <ClassPopup
                        auth={auth}
                        isOpen={isClassPopupOpen}
                        onClose={() => setIsClassPopupOpen(false)}
                        classDetails={selectedClass}
                        fetchAvailableClasses={fetchAvailableClasses}
                        onUnregisterSuccess={handleUnregisterSuccess}
                    />
                )}

                <Modal
                    isOpen={isAvailableClassesOpen}
                    onRequestClose={() => setIsAvailableClassesOpen(false)}
                    className="modal"
                    overlayClassName="ReactModal__Overlay"
                >
                    <AvailableClasses
                        availableClasses={availableClasses}
                        username={auth.username}
                        fetchAvailableClasses={fetchAvailableClasses}
                        onRegisterSuccess={() => {
                            setIsAvailableClassesOpen(false);
                            fetchRegisteredClasses();
                            fetchAvailableClasses();
                        }}
                    />
                </Modal>
            </div>

            <Notifications username={auth.username} token={auth.token} notifications={notifications} />

            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default CustomerWelcome;
