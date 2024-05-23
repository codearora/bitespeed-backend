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
            let primaryEmails = new Set();
            let primaryPhoneNumbers = new Set();

            // Find the oldest contact among the existing contacts
            const oldestContact = existingContacts.reduce((oldest, current) => {
                return current.createdAt < oldest.createdAt ? current : oldest;
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
            } else if (hasEmail && hasPhoneNumber) {
                // Make the oldest contact the primary
                primaryContact = oldestContact;

                // Update the contacts with the same phone number to be secondary and link them to the primary
                var flag = false;
                for (const contact of existingContacts) {
                    if (contact.phoneNumber === phoneNumber && contact.id !== primaryContact.id) {
                        flag = true;
                        contact.linkPrecedence = 'secondary';
                        contact.linkedId = primaryContact.id;
                        contact.updatedAt = new Date();
                        await contactRepository.save(contact);
                        secondaryContacts.push(contact.id);
                        primaryEmails.add(contact.email);
                        primaryPhoneNumbers.add(contact.phoneNumber);
                    }
                }
                if (flag == false) {
                    for (const contact of existingContacts) {
                        if (contact.email === email && contact.id !== primaryContact.id) {
                            flag = true;
                            contact.linkPrecedence = 'secondary';
                            contact.linkedId = primaryContact.id;
                            contact.updatedAt = new Date();
                            await contactRepository.save(contact);
                            secondaryContacts.push(contact.id);
                            primaryEmails.add(contact.email);
                            primaryPhoneNumbers.add(contact.phoneNumber);
                        }
                    }
                }

                primaryEmails.add(primaryContact.email);
                primaryPhoneNumbers.add(primaryContact.phoneNumber);

                // Return details of the oldest primary contact and the secondary contacts
                return res.json({
                    contact: {
                        primaryContactId: primaryContact.id,
                        emails: Array.from(primaryEmails),
                        phoneNumbers: Array.from(primaryPhoneNumbers),
                        secondaryContactIds: secondaryContacts,
                    },
                });
            } else if (hasEmail && !hasPhoneNumber) {
                // If email exists but phone number doesn't, make the existing primary contact as primary
                // and create a new secondary contact
                primaryContact = existingContacts.find(contact => contact.email === email);

                const newSecondaryContact = contactRepository.create({
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary',
                });
                await contactRepository.save(newSecondaryContact);

                primaryEmails.add(primaryContact.email);
                primaryPhoneNumbers.add(phoneNumber);

                // Return details of the existing primary contact and the new secondary contact
                return res.json({
                    contact: {
                        primaryContactId: primaryContact.id,
                        emails: Array.from(primaryEmails),
                        phoneNumbers: Array.from(primaryPhoneNumbers),
                        secondaryContactIds: [newSecondaryContact.id],
                    },
                });
            } else if (!hasEmail && hasPhoneNumber) {
                // If phone number exists but email doesn't, make the existing primary contact as primary
                // and create a new secondary contact
                primaryContact = existingContacts.find(contact => contact.phoneNumber === phoneNumber);

                const newSecondaryContact = contactRepository.create({
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary',
                });
                await contactRepository.save(newSecondaryContact);

                primaryEmails.add(email);
                primaryPhoneNumbers.add(primaryContact.phoneNumber);

                // Return details of the existing primary contact and the new secondary contact
                return res.json({
                    contact: {
                        primaryContactId: primaryContact.id,
                        emails: Array.from(primaryEmails),
                        phoneNumbers: Array.from(primaryPhoneNumbers),
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
