import isElectron from "is-electron";
const electron = isElectron();

export async function init() {
  if (electron) {
    return true;
  } else {
    const { initDB_Capacitor } = await import("./db_capacitor.js");
    return await initDB_Capacitor();
  }
}

export async function genUUID() {
  if (electron) {
    return window.db.genUUID();
  } else {
    const { genUUID_Capacitor } = await import("./db_capacitor.js");
    return await genUUID_Capacitor();
  }
}

export async function getAllReminders() {
  if (electron) {
    return window.db.getAllReminders();
  } else {
    const { getAllReminders_Capacitor } = await import("./db_capacitor.js");
    return await getAllReminders_Capacitor();
  }
}

export async function getSpecificReminder(date, message) {
  if (electron) {
    return window.db.getSpecificReminder(date.toISOString(), message);
  } else {
    const { getSpecificReminder_Capacitor } = await import("./db_capacitor.js");
    return await getSpecificReminder_Capacitor(date, message);
  }
}

export async function insertReminder(date, message) {
  if (electron) {
    return window.db.insertReminder(date.toISOString(), message);
  } else {
    const { insertReminder_Capacitor } = await import("./db_capacitor.js");
    return await insertReminder_Capacitor(date, message);
  }
}

export async function deleteReminder(date, message) {
  if (electron) {
    return window.db.deleteReminder(date.toISOString(), message);
  } else {
    const { deleteReminder_Capacitor } = await import("./db_capacitor.js");
    return await deleteReminder_Capacitor(date, message);
  }
}

export async function updateReminder(oldDate, oldMessage, newDate, newMessage) {
  if (electron) {
    return window.db.updateReminder(oldDate.toISOString(), oldMessage, newDate.toISOString(), newMessage);
  } else {
    const { updateReminder_Capacitor } = await import("./db_capacitor.js");
    return await updateReminder_Capacitor(oldDate, oldMessage, newDate, newMessage);
  }
}

export async function getTheme() {
  if (electron) {
    return window.db.getTheme()
  } else {
    const { getTheme_Capacitor } = await import("./db_capacitor.js");
    return await getTheme_Capacitor()
  }
}

export async function updateTheme(theme) {
  if (electron) {
    return window.db.updateTheme(theme)
  } else {
    const { updateTheme_Capacitor } = await import("./db_capacitor.js");
    return await updateTheme_Capacitor(theme)
  }
}