const ptSessionModel = require('../models/ptSessionModel');
const classModel = require('../models/classModel');
const notificationModel = require ('../models/notificationModel')

const bookPTSession = async (req, res) => {
    const { customer_username, trainer_username, session_date, start_time } = req.body;
    try {
        const hasClass = await classModel.checkIfClassExists(customer_username, session_date, start_time);
        if (hasClass) {
            return res.status(400).json({ message: 'You already have a class at this time.' });
        }

        const hasPTSession = await ptSessionModel.checkExistingSession(customer_username, session_date);
        if (hasPTSession) {
            return res.status(400).json({ message: 'You have already booked a PT session that day.' });
        }

        const isTrainerAvailable = await ptSessionModel.checkTrainerAvailability(trainer_username, session_date, start_time);
        if (!isTrainerAvailable) {
            return res.status(400).json({ message: 'Trainer is not available at this time.', details: { trainer_username, session_date, start_time } });
        }

        await ptSessionModel.bookSession(customer_username, trainer_username, session_date, start_time, 'create');

        await notificationModel.createNotification({
            username: trainer_username,
            message: `New PT session request from ${customer_username} on ${session_date} at ${start_time}.`
        });

        await notificationModel.createNotification({
            username: customer_username,
            message: `Your PT session request with ${trainer_username} on ${session_date} at ${start_time} is pending confirmation.`
        });

        return res.status(201).json({ message: 'PT session booked successfully. Waiting for trainer confirmation.' });

    } catch (error) {
        console.error('Error booking PT session:', error);
        return res.status(500).json({ message: 'Failed to book PT session', error: error.message });
    }
};

const confirmPTSession = async (req, res) => {
    const { session_id } = req.body;

    try {
        const session = await ptSessionModel.getSessionById(session_id);

        if (!session) {
            return res.status(404).json({ message: 'PT session not found.' });
        }

        await ptSessionModel.confirmSession(session_id);
        await ptSessionModel.updatePendingAction(session_id, 'none');

        await notificationModel.createNotification({
            username: session.customer_username,
            message: `Your PT session with ${session.trainer_username} on ${session.session_date} at ${session.start_time} has been confirmed.`
        });

        return res.status(200).json({ message: 'PT session confirmed successfully.' });

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
            case 'delete': {
                await ptSessionModel.updatePendingAction(session_id, 'none');
                await ptSessionModel.updateSessionStatus(session_id, 'confirmed');

                await notificationModel.createNotification({
                    username: session.customer_username,
                    message: `Your PT session delete request for the session on ${session.session_date} has been rejected.`
                });

                return res.status(200).json({ message: 'PT session deletion request has been canceled.' });
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

    if (!session_id) {
        return res.status(400).json({ message: 'Session ID is required.' });
    }

    try {
        const isConfirmed = await ptSessionModel.isSessionConfirmed(session_id);
        if (!isConfirmed) {
            await ptSessionModel.deleteSession(session_id);
            return res.status(200).json({ message: 'PT session deleted successfully.' });
        } else {
            return res.status(400).json({ message: 'Cannot delete a confirmed session.' });
        }
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

const requestDeletePTSession = async (req, res) => {
    const { session_id } = req.body;

    try {
        const session = await ptSessionModel.getSessionById(session_id);
        if (!session) {
            return res.status(404).json({ message: 'PT session not found.' });
        }

        await ptSessionModel.updatePendingAction(session_id, 'delete');
        await ptSessionModel.updateSessionStatus(session_id, 'pending');

        await notificationModel.createNotification({
            username: session.trainer_username,
            message: `Delete request received for PT session on ${session.session_date}.`
        });

        await notificationModel.createNotification({
            username: session.customer_username,
            message: `Your PT session delete request for ${session.session_date} is pending confirmation by ${session.trainer_username}.`
        });

        return res.status(200).json({ message: 'PT session delete requested. Waiting for trainer confirmation.' });
    } catch (error) {
        console.error('Error requesting PT session delete:', error);
        return res.status(500).json({ message: 'Failed to request PT session delete' });
    }
};

const confirmDeletePTSession = async (req, res) => {
    const { session_id, action } = req.body;

    try {
        const session = await ptSessionModel.getSessionById(session_id);
        if (!session) {
            return res.status(404).json({ message: 'PT session not found.' });
        }

        if (action === 'confirm') {
            await ptSessionModel.deleteSession(session_id);

            await notificationModel.createNotification({
                username: session.customer_username,
                message: `Your PT session on ${session.session_date} has been successfully deleted.`
            });

            return res.status(200).json({ message: 'PT session deleted successfully.' });
        } else if (action === 'reject') {
            await ptSessionModel.updatePendingAction(session_id, 'none');
            await ptSessionModel.updateSessionStatus(session_id, 'confirmed');

            await notificationModel.createNotification({
                username: session.customer_username,
                message: `Your PT session delete request has been rejected.`
            });

            return res.status(200).json({ message: 'PT session delete request rejected.' });
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }
    } catch (error) {
        console.error('Error confirming PT session delete:', error);
        return res.status(500).json({ message: 'Failed to confirm PT session delete' });
    }
};

const requestUpdatePTSession = async (req, res) => {
    const { session_id, new_session_date, new_start_time } = req.body;

    try {
        const session = await ptSessionModel.getSessionById(session_id);
        if (!session) {
            return res.status(404).json({ message: 'PT session not found.' });
        }

        const hasClass = await classModel.checkIfClassExists(session.customer_username, new_session_date, new_start_time);
        if (hasClass) {
            return res.status(400).json({ message: 'You already have a class at this new time.' });
        }

        const isTrainerAvailable = await ptSessionModel.checkTrainerAvailability(session.trainer_username, new_session_date, new_start_time);
        if (!isTrainerAvailable) {
            return res.status(400).json({ 
                message: 'Trainer is not available at this new time.', 
                details: { trainer_username: session.trainer_username, new_session_date, new_start_time } 
            });
        }

        await ptSessionModel.updatePendingAction(session_id, 'update');
        await ptSessionModel.setPendingUpdate(session_id, new_session_date, new_start_time);
        await ptSessionModel.updateSessionStatus(session_id, 'pending');

        await notificationModel.createNotification({
            username: session.trainer_username,
            message: `Update request received for PT session on ${session.session_date} to new date ${new_session_date} and time ${new_start_time}.`
        });

        await notificationModel.createNotification({
            username: session.customer_username,
            message: `Your PT session update request for ${new_session_date} is pending confirmation by ${session.trainer_username}.`
        });

        return res.status(200).json({ message: 'PT session update requested. Waiting for trainer confirmation.' });
    } catch (error) {
        console.error('Error requesting PT session update:', error);
        return res.status(500).json({ message: 'Failed to request PT session update' });
    }
};


const confirmUpdatePTSession = async (req, res) => {
    const { session_id, action } = req.body;

    try {
        const session = await ptSessionModel.getSessionById(session_id);
        if (!session) {
            return res.status(404).json({ message: 'PT session not found.' });
        }

        if (action === 'confirm') {
            await ptSessionModel.applyPendingUpdate(session_id);
            await ptSessionModel.updatePendingAction(session_id, 'none');
            await ptSessionModel.updateSessionStatus(session_id, 'confirmed');

            await notificationModel.createNotification({
                username: session.customer_username,
                message: `Your PT session update for ${session.new_session_date} has been confirmed.`
            });

            return res.status(200).json({ message: 'PT session updated successfully.' });
        } else if (action === 'reject') {
            await ptSessionModel.updatePendingAction(session_id, 'none');
            await ptSessionModel.updateSessionStatus(session_id, 'confirmed');

            await notificationModel.createNotification({
                username: session.customer_username,
                message: `Your PT session update request has been rejected.`
            });

            return res.status(200).json({ message: 'PT session update request rejected.' });
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }
    } catch (error) {
        console.error('Error confirming PT session update:', error);
        return res.status(500).json({ message: 'Failed to confirm PT session update' });
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
    cancelPTSession,
    requestDeletePTSession,
    confirmDeletePTSession,
    requestUpdatePTSession,
    confirmUpdatePTSession
};