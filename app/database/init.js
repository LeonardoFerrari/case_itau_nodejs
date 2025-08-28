const setupDatabase = require('./Sqlite.database');
const config = require('../config/init').db;

let db;

async function initDb() {
    db = await setupDatabase(config.sqlite);
    return db;
}

function getDb() {
    return db;
}

module.exports = { initDb, getDb };