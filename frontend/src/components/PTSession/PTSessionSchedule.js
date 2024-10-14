import React from 'react';
import Calendar from '../Calendar/Calendar';

const PTSessionSchedule = ({ sessions, onSelectSession }) => {
    const events = sessions.map(session => {
        const sessionDateOnly = session.session_date.split('T')[0];
        const startTime = new Date(`${sessionDateOnly}T${session.start_time}`);
        const endTime = new Date(startTime.getTime() + 60 * 60000);

        return {
            title: `PT session with ${session.customer_full_name}`,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            extendedProps: {
                id: session.id,
                description: `PT session with ${session.customer_full_name}`,
                full_name: session.customer_full_name,
                status: session.status,
                start_time: session.start_time,
                session_date: session.session_date,
            }
        };
    });

    return (
        <Calendar
            events={events}
            onSelectEvent={onSelectSession}
        />
    );
};

export default PTSessionSchedule;
