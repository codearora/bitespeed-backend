const { identifyContact } = require('../services/identifyService');

const identify = async (req, res) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'Either email or phoneNumber must be provided.' });
    }

    try {
        const result = await identifyContact(email, phoneNumber);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    identify
};
