const express = require('express');
const bodyParser = require('body-parser');
const { DataSource } = require('typeorm');
const Contact = require('./entities/Contact');

const app = express();
app.use(bodyParser.json());

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: [Contact],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

app.post('/identify', async (req, res) => {
    const { email, phoneNumber } = req.body;
    try {
        const contactRepository = AppDataSource.getRepository('Contact');

        let contacts = [];
        if (email && phoneNumber) {
            contacts = await contactRepository.find({ where: [{ email }, { phoneNumber }] });
        } else if (email) {
            contacts = await contactRepository.find({ where: { email } });
        } else if (phoneNumber) {
            contacts = await contactRepository.find({ where: { phoneNumber } });
        }

        if (contacts.length === 0) {
            const newContact = contactRepository.create({
                email,
                phoneNumber,
                linkPrecedence: 'primary',
            });
            await contactRepository.save(newContact);
            return res.json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: [newContact.email].filter(Boolean),
                    phoneNumbers: [newContact.phoneNumber].filter(Boolean),
                    secondaryContactIds: [],
                },
            });
        }

        let primaryContact = contacts.find((contact) => contact.linkPrecedence === 'primary') || contacts[0];
        let secondaryContacts = contacts.filter((contact) => contact.linkPrecedence === 'secondary' || contact.id !== primaryContact.id);

        const emails = new Set(contacts.map((contact) => contact.email).filter(Boolean));
        const phoneNumbers = new Set(contacts.map((contact) => contact.phoneNumber).filter(Boolean));
        const secondaryContactIds = secondaryContacts.map((contact) => contact.id);

        return res.json({
            contact: {
                primaryContactId: primaryContact.id,
                emails: Array.from(emails),
                phoneNumbers: Array.from(phoneNumbers),
                secondaryContactIds,
            },
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
