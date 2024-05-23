const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Contact',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        phoneNumber: {
            type: 'varchar',
            nullable: true,
        },
        email: {
            type: 'varchar',
            nullable: true,
        },
        linkedId: {
            type: 'int',
            nullable: true,
        },
        linkPrecedence: {
            type: 'varchar',
            enum: ['primary', 'secondary'],
        },
        createdAt: {
            type: 'datetime',
            createDate: true,
        },
        updatedAt: {
            type: 'datetime',
            updateDate: true,
        },
        deletedAt: {
            type: 'datetime',
            nullable: true,
        },
    },
});

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

        // Find existing contacts with the provided email or phone number
        const existingContacts = await contactRepository.find({ where: [{ email }, { phoneNumber }] });

        if (existingContacts.length === 0) {
            // If no existing contacts, create a new primary contact
            const newPrimaryContact = contactRepository.create({
                email,
                phoneNumber,
                linkPrecedence: 'primary',
            });
            await contactRepository.save(newPrimaryContact);

            // Return details of the new primary contact
            return res.json({
                contact: {
                    primaryContactId: newPrimaryContact.id,
                    emails: [newPrimaryContact.email],
                    phoneNumbers: [newPrimaryContact.phoneNumber],
                    secondaryContactIds: [],
                },
            });
        } else {
            let primaryContact;
            let secondaryContacts = [];
            // Find the oldest contact among the existing contacts
            const oldestContact = existingContacts.reduce((oldest, current) => {
                if (current.createdAt < oldest.createdAt) {
                    primaryContact = oldest;
                    secondaryContacts.push(current);
                    return current;
                } else {
                    primaryContact = current;
                    secondaryContacts.push(oldest);
                    return oldest;
                }
            });

            // Check if the existing contacts have both email and phone number
            const hasEmail = existingContacts.some((contact) => contact.email === email);
            const hasPhoneNumber = existingContacts.some((contact) => contact.phoneNumber === phoneNumber);

            if (!hasEmail && !hasPhoneNumber) {
                // Create a new primary contact if neither email nor phone number exists
                const newPrimaryContact = contactRepository.create({
                    email,
                    phoneNumber,
                    linkPrecedence: 'primary',
                });
                await contactRepository.save(newPrimaryContact);

                // Return details of the new primary contact
                return res.json({
                    contact: {
                        primaryContactId: newPrimaryContact.id,
                        emails: [newPrimaryContact.email],
                        phoneNumbers: [newPrimaryContact.phoneNumber],
                        secondaryContactIds: [],
                    },
                });
            } else if (hasEmail && !hasPhoneNumber) {
                // If email exists but phone number doesn't, make the existing primary contact as primary
                // and create a new secondary contact
                const newSecondaryContact = contactRepository.create({
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary',
                });
                await contactRepository.save(newSecondaryContact);

                // Return details of the existing primary contact and the new secondary contact
                return res.json({
                    contact: {
                        primaryContactId: primaryContact.id,
                        emails: [primaryContact.email, newSecondaryContact.email],
                        phoneNumbers: [primaryContact.phoneNumber, newSecondaryContact.phoneNumber],
                        secondaryContactIds: [newSecondaryContact.id],
                    },
                });
            } else if (!hasEmail && hasPhoneNumber) {
                // If phone number exists but email doesn't, make the existing primary contact as primary
                // and create a new secondary contact
                const newSecondaryContact = contactRepository.create({
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary',
                });
                await contactRepository.save(newSecondaryContact);

                // Return details of the existing primary contact and the new secondary contact
                return res.json({
                    contact: {
                        primaryContactId: primaryContact.id,
                        emails: [primaryContact.email, newSecondaryContact.email],
                        phoneNumbers: [primaryContact.phoneNumber, newSecondaryContact.phoneNumber],
                        secondaryContactIds: [newSecondaryContact.id],
                    },
                });
            } else {
                // If both email and phone number exist, make the oldest primary contact as primary
                // and create a new secondary contact
                const newSecondaryContact = contactRepository.create({
                    email,
                    phoneNumber,
                    linkedId: oldestContact.id,
                    linkPrecedence: 'secondary',
                });
                await contactRepository.save(newSecondaryContact);

                // Return details of the oldest primary contact and the new secondary contact
                return res.json({
                    contact: {
                        primaryContactId: oldestContact.id,
                        emails: [oldestContact.email, newSecondaryContact.email],
                        phoneNumbers: [oldestContact.phoneNumber, newSecondaryContact.phoneNumber],
                        secondaryContactIds: [newSecondaryContact.id],
                    },
                });
            }
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});



app.listen(3000, () => {
    console.log('Server running on port 3000');
});
