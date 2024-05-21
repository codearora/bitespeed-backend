const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Contact',
    tableName: 'contacts',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },
        phoneNumber: {
            type: 'varchar',
            nullable: true
        },
        email: {
            type: 'varchar',
            nullable: true
        },
        linkedId: {
            type: 'int',
            nullable: true
        },
        linkPrecedence: {
            type: 'varchar', // Change enum to varchar
            default: 'primary'
        },
        createdAt: {
            type: 'datetime',
            createDate: true
        },
        updatedAt: {
            type: 'datetime',
            updateDate: true
        },
        deletedAt: {
            type: 'datetime',
            nullable: true
        }
    }
});
