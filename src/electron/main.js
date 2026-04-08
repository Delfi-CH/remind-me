// @ts-nocheck

import {app, BrowserWindow, ipcMain, Menu, Tray, Notification} from "electron"
import path from "node:path"
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { initDB_Electron, genUUID_Electron, getAllReminders_Electron, getSpecificReminder_Electron, insertReminder_Electron, deleteReminder_Electron, updateReminder_Electron } from "../lib/database/db_electron.js";

let db;

const isDev = !app.isPackaged;

let tray = null;
let win = null;

function toggleWindow() {
  if (!win) return;
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
    win.focus();
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../../build/index.html'));
  }
}

app.whenReady().then(()=> {
  tray = new Tray(path.join(__dirname, '../../build/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      click: () => toggleWindow()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('remind-me');
  tray.on('click', (event, bounds, position) => {
    toggleWindow();
  });
  db = initDB_Electron();
  createWindow();
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

const scheduledNotifications = new Map();

async function scheduleNotification(time, message, id) {
  const now = new Date();
  const diff = time - now;
  if (diff < 0 || isNaN(diff)) return;

  const timeoutId = setTimeout(() => {
    const n = new Notification({ title: "Reminder!", subtitle: message, body: message });
    n.show();
    setTimeout(() => n.close(), 10000);
    scheduledNotifications.delete(id);
  }, diff);

  scheduledNotifications.set(id, { timeoutId, time, message });
}

function cancelNotification(id) {
  const entry = scheduledNotifications.get(id);
  if (entry) {
    clearTimeout(entry.timeoutId);
    scheduledNotifications.delete(id);
    return true;
  }
  return false;
}
ipcMain.handle("db:genUUID", () => genUUID_Electron(db));
ipcMain.handle("db:getAllReminders", () => getAllReminders_Electron(db));
ipcMain.handle("db:getSpecificReminder", (event, date, message) => getSpecificReminder_Electron(db, new Date(date), message));
ipcMain.handle("db:insertReminder", (event, date, message) => insertReminder_Electron(db, new Date(date), message));
ipcMain.handle("db:deleteReminder", (event, date, message) => deleteReminder_Electron(db, new Date(date), message));
ipcMain.handle("db:updateReminder", (event, oldDate, oldMessage, newDate, newMessage) =>
  updateReminder_Electron(db, new Date(oldDate), oldMessage, new Date(newDate), newMessage)
);


ipcMain.handle("notify:scheduleNotification", async (event, time, message) => {
  const id = genUUID_Electron(db);
  await scheduleNotification(new Date(time), message, id);
  return id;
});

ipcMain.handle("notify:cancelNotification", (event, id) => cancelNotification(id));

ipcMain.handle("notify:getActiveNotifications", () => {
  const active = [];
  for (const [id, { time, message }] of scheduledNotifications.entries()) {
    active.push({ id, time, message });
  }
  return active;
});