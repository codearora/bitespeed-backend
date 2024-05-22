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
