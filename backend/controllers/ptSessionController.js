const ptSessionModel = require('../models/ptSessionModel');
const classModel = require('../models/classModel');

const bookPTSession = async (req, res) => {
    const { customer_username, trainer_username, session_date, start_time } = req.body;
    try {
        const hasClass = await classModel.checkIfClassExists(customer_username, session_date, start_time);
        if (hasClass) {
            return res.status(400).json({ message: 'You already have a class at this time.' });
        }

        const hasPTSession = await ptSessionModel.checkExistingSession(customer_username, session_date);
        if (hasPTSession) {
            return res.status(400).json({ message: 'You have already booked a PT session today.' });
        }

        const isTrainerAvailable = await ptSessionModel.checkTrainerAvailability(trainer_username, session_date, start_time);
        if (!isTrainerAvailable) {
            return res.status(400).json({ message: 'Trainer is not available at this time.', details: { trainer_username, session_date, start_time } });
        }

        await ptSessionModel.bookSession(customer_username, trainer_username, session_date, start_time);
        return res.status(201).json({ message: 'PT session booked successfully. Waiting for trainer confirmation.' });

    } catch (error) {
        console.error('Error booking PT session:', error);
        return res.status(500).json({ message: 'Failed to book PT session', error: error.message });
    }
};

const confirmPTSession = async (req, res) => {
    const { session_id, action_type } = req.body;

    try {
        const session = await ptSessionModel.getSessionById(session_id);

        if (!session) {
            return res.status(404).json({ message: 'PT session not found' });
        }

        switch (action_type) {
            case 'create': {
                await ptSessionModel.confirmSession(session_id);
                return res.status(200).json({ message: 'PT session confirmed successfully.' });
            }
            case 'update': {
                const { new_session_date, new_start_time } = req.body;
                await ptSessionModel.updateSession(session_id, new_session_date, new_start_time);
                return res.status(200).json({ message: 'PT session updated successfully.' });
            }
            case 'delete': {
                await ptSessionModel.deleteSession(session_id);
                return res.status(200).json({ message: 'PT session deleted successfully.' });
            }
            default: {
                return res.status(400).json({ message: 'Invalid action type' });
            }
        }
    } catch (error) {
        console.error('Error confirming PT session:', error);
        return res.status(500).json({ message: 'Failed to confirm PT session' });
    }
};

const cancelPTSession = async (req, res) => {
    const { session_id, action_type } = req.body;

    try {
        const session = await ptSessionModel.getSessionById(session_id);

        if (!session) {
            return res.status(404).json({ message: 'PT session not found' });
        }

        switch (action_type) {
            case 'create': {
                await ptSessionModel.deleteSession(session_id);
                return res.status(200).json({ message: 'Pending PT session creation has been canceled.' });
            }
            case 'update': {
                return res.status(200).json({ message: 'PT session update has been canceled. The session remains unchanged.' });
            }
            case 'delete': {
                return res.status(200).json({ message: 'PT session deletion has been canceled.' });
            }
            default: {
                return res.status(400).json({ message: 'Invalid action type' });
            }
        }
    } catch (error) {
        console.error('Error canceling PT session:', error);
        return res.status(500).json({ message: 'Failed to cancel PT session' });
    }
};


const updatePTSession = async (req, res) => {
    const { session_id, new_session_date, new_start_time } = req.body;

    try {
        const isConfirmed = await ptSessionModel.isSessionConfirmed(session_id);
        if (!isConfirmed) {
            return res.status(400).json({ message: 'Session must be confirmed to be updated.' });
        }

        await ptSessionModel.updateSession(session_id, new_session_date, new_start_time);
        return res.status(200).json({ message: 'PT session updated successfully.' });
    } catch (error) {
        console.error('Error updating PT session:', error);
        return res.status(500).json({ message: 'Failed to update PT session' });
    }
};

const deletePTSession = async (req, res) => {
    const { session_id } = req.body;

    try {
        const isConfirmed = await ptSessionModel.isSessionConfirmed(session_id);
        if (!isConfirmed) {
            return res.status(400).json({ message: 'Session must be confirmed to be deleted.' });
        }

        await ptSessionModel.deleteSession(session_id);
        return res.status(200).json({ message: 'PT session deleted successfully.' });
    } catch (error) {
        console.error('Error deleting PT session:', error);
        return res.status(500).json({ message: 'Failed to delete PT session' });
    }
};

const getTrainerPendingSessions = async (req, res) => {
    const { trainer_username } = req.params;

    try {
        const pendingSessions = await ptSessionModel.getPendingSessions(trainer_username);
        return res.status(200).json(pendingSessions);
    } catch (error) {
        console.error('Error fetching pending sessions:', error);
        return res.status(500).json({ message: 'Failed to fetch pending sessions' });
    }
};

const getTrainers = async (req, res) => {
    try {
        const trainers = await trainerModel.getAvailableTrainers();
        res.status(200).json(trainers);
    } catch (error) {
        console.error('Error fetching trainers:', error);
        res.status(500).json({ message: 'Failed to fetch trainers' });
    }
};

const getPTSessionsForCustomer = async (req, res) => {
    const { customer_username } = req.params;

    try {
        const ptSessions = await ptSessionModel.getSessionsByCustomer(customer_username);

        res.status(200).json(ptSessions);
    } catch (error) {
        console.error('Error fetching PT sessions:', error);
        res.status(500).json({ message: 'Failed to fetch PT sessions' });
    }
};

const getConfirmedPTSessions = async (req, res) => {
    const { trainer_username } = req.params;

    try {
        const confirmedSessions = await ptSessionModel.getConfirmedSessions(trainer_username);
        return res.status(200).json(confirmedSessions);
    } catch (error) {
        console.error('Error fetching confirmed PT sessions:', error);
        return res.status(500).json({ message: 'Failed to fetch confirmed PT sessions' });
    }
};

module.exports = {
    bookPTSession,
    confirmPTSession,
    updatePTSession,
    deletePTSession,
    getTrainerPendingSessions,
    getTrainers,
    getPTSessionsForCustomer,
    getConfirmedPTSessions,
    cancelPTSession
};
