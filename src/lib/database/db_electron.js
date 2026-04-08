// @ts-nocheck
import Database from "better-sqlite3";
import path from "path";
import os from "os";
import fs from "fs";

export function initDB_Electron() {
    try {
        const db = loadDB_Electron();
        initSchema_Electron(db);
        return db;
    } catch (e) {
        console.error("Failed to init DB:", e);
        throw e;
    }
}

function loadDB_Electron() {
    const dir = path.join(os.homedir(), ".remind-me");

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const dbPath = path.join(dir, "remind-me.db");
    return new Database(dbPath);
}

function initSchema_Electron(db) {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            uuid TEXT UNIQUE NOT NULL
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY,
            reminderTime TEXT UNIQUE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            message TEXT NOT NULL DEFAULT 'message',
            userFK INTEGER,
            FOREIGN KEY (userFK) REFERENCES users(id)
        )
    `).run();
}

export function genUUID_Electron(db) {
    let user = db.prepare("SELECT * FROM users WHERE id = 0").get();

    if (user && user.id === 0) {
        return user.uuid;
    }

    const uuid = crypto.randomUUID();

    db.prepare("DELETE FROM users WHERE id = 0").run();
    db.prepare("INSERT INTO users (id, uuid) VALUES (?, ?)").run(0, uuid);

    return uuid;
}

export function getAllReminders_Electron(db) {
    return db.prepare("SELECT * FROM reminders").all();
}

export function getSpecificReminder_Electron(db, date, message) {
    const datetime = date.toISOString();
    return db.prepare("SELECT * FROM reminders WHERE reminderTime = ? AND message = ?").all(datetime, message);
}

export function insertReminder_Electron(db, date, message) {
    const datetime = date.toISOString();
    db.prepare("INSERT INTO reminders (reminderTime, message) VALUES (?, ?)").run(datetime, message);
}

export function deleteReminder_Electron(db, date, message) {
    const datetime = date.toISOString();
    db.prepare("DELETE FROM reminders WHERE reminderTime = ? AND message = ?").run(datetime, message);
}

export function updateReminder_Electron(db, oldDate, oldMessage, newDate, newMessage) {
    const oldDatetime = oldDate.toISOString();
    const newDatetime = newDate.toISOString();
    db.prepare("UPDATE reminders SET reminderTime = ?, message = ? WHERE reminderTime = ? AND message = ?")
        .run(newDatetime, newMessage, oldDatetime, oldMessage);
}