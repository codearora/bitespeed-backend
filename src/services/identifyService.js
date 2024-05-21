const { getRepository } = require('typeorm');
const Contact = require('../entities/Contact');

const identifyContact = async (email, phoneNumber) => {
    const contactRepository = getRepository(Contact);

    let existingContacts = [];

    if (email) {
        const contactsByEmail = await contactRepository.find({ where: { email } });
        existingContacts = [...existingContacts, ...contactsByEmail];
    }

    if (phoneNumber) {
        const contactsByPhone = await contactRepository.find({ where: { phoneNumber } });
        existingContacts = [...existingContacts, ...contactsByPhone];
    }

    let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary');
    if (!primaryContact && existingContacts.length > 0) {
        primaryContact = existingContacts[0];
    }

    if (!primaryContact) {
        primaryContact = new Contact();
        primaryContact.email = email;
        primaryContact.phoneNumber = phoneNumber;
        primaryContact.linkPrecedence = 'primary';
        await contactRepository.save(primaryContact);
    }

    const secondaryContacts = existingContacts.filter(contact => contact.id !== primaryContact.id);

    for (const contact of secondaryContacts) {
        if (!contact.linkedId) {
            contact.linkedId = primaryContact.id;
            contact.linkPrecedence = 'secondary';
            await contactRepository.save(contact);
        }
    }

    return {
        contact: {
            primaryContactId: primaryContact.id,
            emails: [primaryContact.email, ...secondaryContacts.map(contact => contact.email)].filter(Boolean),
            phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)].filter(Boolean),
            secondaryContactIds: secondaryContacts.map(contact => contact.id)
        }
    };
};

module.exports = {
    identifyContact
};
