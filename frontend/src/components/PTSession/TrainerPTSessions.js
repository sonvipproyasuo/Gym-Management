import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; 
import PTSessionSchedule from './PTSessionSchedule'; 
import PendingSessionsPopup from './PendingSessionsPopup'; 
import TrainerPTSessionInfo from './TrainerPTSessionInfo';

Modal.setAppElement('#root');

const TrainerPTSessions = ({ trainerUsername }) => {
    const [isPendingSessionsOpen, setIsPendingSessionsOpen] = useState(false);
    const [confirmedSessions, setConfirmedSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [isSessionInfoOpen, setIsSessionInfoOpen] = useState(false);

    const fetchConfirmedSessions = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/pt-sessions/confirmed/${trainerUsername}`);
            setConfirmedSessions(response.data);
        } catch (error) {
            console.error('Error fetching confirmed PT sessions:', error);
        }
    };

    useEffect(() => {
        fetchConfirmedSessions();
    }, [trainerUsername]);

    const handleSelectSession = (eventInfo) => {
        console.log("Event clicked: ", eventInfo.event);
        const sessionDetails = eventInfo.event.extendedProps;
        setSelectedSession(sessionDetails);
        setIsSessionInfoOpen(true);
    };
    

    return (
        <div>
            <button onClick={() => setIsPendingSessionsOpen(true)}>Pending PT Sessions</button>

            <Modal
                isOpen={isPendingSessionsOpen}
                onRequestClose={() => setIsPendingSessionsOpen(false)}
                className="modal"
                overlayClassName="ReactModal__Overlay"
            >
                <PendingSessionsPopup
                    trainerUsername={trainerUsername}
                    onClose={() => setIsPendingSessionsOpen(false)}
                    onConfirmSuccess={fetchConfirmedSessions}
                />
            </Modal>

            <PTSessionSchedule sessions={confirmedSessions} onSelectSession={handleSelectSession} />

            <Modal
                isOpen={isSessionInfoOpen}
                onRequestClose={() => setIsSessionInfoOpen(false)}
                className="modal"
                overlayClassName="ReactModal__Overlay"
            >
                <TrainerPTSessionInfo
                    sessionDetails={selectedSession}
                    onClose={() => setIsSessionInfoOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default TrainerPTSessions;
