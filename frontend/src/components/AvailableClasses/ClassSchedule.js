import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Calendar from '../Calendar/Calendar';
import ClassPopup from './ClassPopup';

const ClassSchedule = ({ username }) => {
    const [registeredClasses, setRegisteredClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const fetchRegisteredClasses = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/class-schedule/registered/${username}`);
            setRegisteredClasses(response.data);
        } catch (error) {
            console.error('Error fetching registered classes:', error);
        }
    }, [username]);

    useEffect(() => {
        fetchRegisteredClasses();
    }, [fetchRegisteredClasses]);

    const handleEventClick = (event) => {
        setSelectedClass({
            id: event.event.extendedProps.id,
            title: event.event.title,
            description: event.event.extendedProps.description,
            time: event.event.start.toISOString(),
            full_name: event.event.extendedProps.full_name
        });
        setIsModalOpen(true);
    };

    const handleUnregisterSuccess = () => {
        setIsModalOpen(false);
        fetchRegisteredClasses();
    };

    return (
        <div>
            <h2>Your Class Schedule</h2>
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
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    classDetails={selectedClass}
                    onUnregisterSuccess={handleUnregisterSuccess}
                />
            )}
        </div>
    );
};

export default ClassSchedule;
