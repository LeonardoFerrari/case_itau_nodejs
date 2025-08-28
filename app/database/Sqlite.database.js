const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDatabase(config) {
    const db = await open({
        filename: config.file,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS clientes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            saldo REAL DEFAULT 0
        );
    `);

    return db;
}

module.exports = setupDatabase;