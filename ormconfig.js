module.exports = {
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: ["src/entities/**/*.js"]
};
