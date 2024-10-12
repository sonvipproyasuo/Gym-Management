import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Calendar from '../Calendar/Calendar';
import ClassPopup from './ClassPopup';

const ClassSchedule = ({ username }) => {
    const [classes, setClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classDetails, setClassDetails] = useState({
        title: '',
        description: '',
        time: '',
        maxParticipants: 20,
        duration: 60
    });
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);

    const fetchClasses = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/classes/${username}`);
            setClasses(response.data.map(cls => ({
                title: cls.title,
                start: cls.time,
                end: new Date(new Date(cls.time).getTime() + cls.duration * 60000),
                extendedProps: {
                    description: cls.description,
                    maxParticipants: cls.max_participants,
                    id: cls.id
                }
            })));
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    }, [username]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handleCreateClass = async () => {
        try {
            await axios.post('http://localhost:5000/api/classes', {
                ...classDetails,
                instructor_username: username
            });

            fetchClasses();
    
            setIsModalOpen(false);
            resetClassDetails();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                console.error('Error creating class:', error);
            }
        }
    };    

    const handleUpdateClass = async () => {
        if (window.confirm("Are you sure you want to update this class?")) {
            try {
                await axios.put(`http://localhost:5000/api/classes/${selectedClassId}`, {
                    ...classDetails,
                    instructor_username: username
                });
            
                fetchClasses();
                setIsModalOpen(false);
                resetClassDetails();
            } catch (error) {
                console.error('Error updating class:', error);
            }
        }
    };
    
    const handleDeleteClass = async () => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            try {
                await axios.delete(`http://localhost:5000/api/classes/${selectedClassId}`);
    
                fetchClasses();
                setIsModalOpen(false);
                resetClassDetails();
            } catch (error) {
                console.error('Error deleting class:', error);
            }
        }
    };

    const handleEventClick = async (event) => {
        const classId = event.event.extendedProps.id;
        setSelectedClassId(classId);
    
        try {
            const response = await axios.get(`http://localhost:5000/api/classes/${classId}/participants`);
            const participants = response.data;
    
            const localTime = new Date(event.event.start.getTime() - event.event.start.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
    
            setClassDetails({
                title: event.event.title,
                description: event.event.extendedProps.description,
                time: localTime,
                maxParticipants: event.event.extendedProps.maxParticipants,
                duration: (event.event.end.getTime() - event.event.start.getTime()) / 60000,
                participants: participants
            });
            setIsUpdateMode(true);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const resetClassDetails = () => {
        setClassDetails({
            title: '',
            description: '',
            time: '',
            maxParticipants: 20,
            duration: 60
        });
        setIsUpdateMode(false);
        setSelectedClassId(null);
    };

    return (
        <div>
            <button onClick={() => {
                resetClassDetails();
                setIsModalOpen(true);
            }}>Create Class</button>

            <Calendar
                events={classes}
                onSelectEvent={handleEventClick}
                onSelectSlot={() => {
                    resetClassDetails();
                    setIsModalOpen(true);
                }}
            />

            <ClassPopup
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={isUpdateMode ? handleUpdateClass : handleCreateClass}
                onDelete={isUpdateMode ? handleDeleteClass : null}
                classDetails={classDetails}
                setClassDetails={setClassDetails}
                isUpdateMode={isUpdateMode}
            />
        </div>
    );
};

export default ClassSchedule;
