import { Preferences } from '@capacitor/preferences';

class User {
    uuid;
    constructor(uuid) {
        this.uuid = uuid;
    }
}

class Reminder {
    id;
    reminderTime;
    message;
    constructor(reminderTime, message) {
        this.id = crypto.randomUUID();
        this.reminderTime = reminderTime;
        this.message = message;
    }
}

export async function genUUID_Capacitor() {
    const { value } = await Preferences.get({ key: "user" });
    
    if (value) {
        const parsed = JSON.parse(value);
        return new User(parsed.uuid).uuid;
    }

    const uuid = crypto.randomUUID();
    const user = new User(uuid);
    await Preferences.set({
        key: "user",
        value: JSON.stringify(user),
    });
    return user;
}

export async function insertReminder_Capacitor(reminderTime, message) {
    const reminders = await getAllReminders_Capacitor();
    reminders.push(new Reminder(reminderTime.toISOString(), message));
    await Preferences.set({
        key: "reminders",
        value: JSON.stringify(reminders),
    });
}

export async function getAllReminders_Capacitor() {
    const { value } = await Preferences.get({ key: "reminders" });
    if (!value) return [];
    const parsed = JSON.parse(value);
    return parsed.map(r => new Reminder(r.reminderTime, r.message));
}

export async function getSpecificReminder_Capacitor(date, message) {
    const datetime = date.toISOString();
    const reminders = await getAllReminders_Capacitor();
    return reminders.filter(r => r.reminderTime === datetime && r.message === message);
}

export async function deleteReminder_Capacitor(date, message) {
    const datetime = date.toISOString();
    let reminders = await getAllReminders_Capacitor();
    reminders = reminders.filter(r => !(r.reminderTime === datetime && r.message === message));
    await Preferences.set({
        key: "reminders",
        value: JSON.stringify(reminders),
    });
}

export async function updateReminder_Capacitor(oldDate, oldMessage, newDate, newMessage) {
    const oldDatetime = oldDate.toISOString();
    const newDatetime = newDate.toISOString();
    let reminders = await getAllReminders_Capacitor();
    reminders = reminders.map(r => {
        if (r.reminderTime === oldDatetime && r.message === oldMessage) {
            return new Reminder(newDatetime, newMessage);
        }
        return r;
    });
    await Preferences.set({
        key: "reminders",
        value: JSON.stringify(reminders),
    });
}

export async function initDB_Capacitor() {
    await Preferences.set({
        key: "theme",
        value: "cosmo"
    })
}

export async function updateTheme_Capacitor(theme) {
    console.log(theme)
    await Preferences.set({
        key: "theme",
        value: theme
    })
}

export async function getTheme_Capacitor() {
    const value = await Preferences.get({
        key: "theme"
    })
    return value.value
}