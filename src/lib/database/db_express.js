import { DatabaseSync } from "node:sqlite";

export function initDB_Express() {
    const db = new DatabaseSync('data/remind-me_backend.db')
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            uuid TEXT UNIQUE NOT NULL
        )
    `)

    db.exec(`
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY,
            reminderTime TEXT UNIQUE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            message TEXT NOT NULL DEFAULT 'message',
            userFK INTEGER,
            FOREIGN KEY (userFK) REFERENCES users(id)
        )
    `)
    
    db.exec(`
        CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY,
            deviceString TEXT NOT NULL,
            userFK INTEGER,
            FOREIGN KEY (userFK) REFERENCES users(id)
        )
    `)

    return db
}