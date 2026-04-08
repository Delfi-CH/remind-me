import isElectron from 'is-electron';

const electron = isElectron();
let db = null;

export async function init() {
    if (electron) {
        const { initDB_Electron } = await import("./db_electron.js");
        db = initDB_Electron();
    } else {
        db = null;
    }
    return db;
}

export async function genUUID() {
    if (electron) {
        const { genUUID_Electron } = await import("./db_electron.js");
        return genUUID_Electron(db);
    } else {
        const { genUUID_Capacitor } = await import("./db_capacitor.js");
        return await genUUID_Capacitor();
    }
}

export async function getAllReminders() {
    if (electron) {
        const { getAllReminders_Electron } = await import("./db_electron.js");
        return getAllReminders_Electron(db);
    } else {
        const { getAllReminders_Capacitor } = await import("./db_capacitor.js");
        return await getAllReminders_Capacitor();
    }
}

export async function getSpecificReminder(date, message) {
    if (electron) {
        const { getSpecificReminder_Electron } = await import("./db_electron.js");
        return getSpecificReminder_Electron(db, date, message);
    } else {
        const { getSpecificReminder_Capacitor } = await import("./db_capacitor.js");
        return await getSpecificReminder_Capacitor(date, message);
    }
}

export async function insertReminder(date, message) {
    if (electron) {
        const { insertReminder_Electron } = await import("./db_electron.js");
        return insertReminder_Electron(db, date, message);
    } else {
        const { insertReminder_Capacitor } = await import("./db_capacitor.js");
        return await insertReminder_Capacitor(date, message);
    }
}

export async function deleteReminder(date, message) {
    if (electron) {
        const { deleteReminder_Electron } = await import("./db_electron.js");
        return deleteReminder_Electron(db, date, message);
    } else {
        const { deleteReminder_Capacitor } = await import("./db_capacitor.js");
        return await deleteReminder_Capacitor(date, message);
    }
}

export async function updateReminder(oldDate, oldMessage, newDate, newMessage) {
    if (electron) {
        const { updateReminder_Electron } = await import("./db_electron.js");
        return updateReminder_Electron(db, oldDate, oldMessage, newDate, newMessage);
    } else {
        const { updateReminder_Capacitor } = await import("./db_capacitor.js");
        return await updateReminder_Capacitor(oldDate, oldMessage, newDate, newMessage);
    }
}

export async function getUser() {
    if (electron) {
        const { getUser_Electron } = await import("./db_electron.js");
        return getUser_Electron();
    } else {
        const { getUser_Capacitor } = await import("./db_capacitor.js");
        return await getUser_Capacitor();
    }
}