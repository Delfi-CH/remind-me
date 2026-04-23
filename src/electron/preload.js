const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("db", {
  genUUID: () => ipcRenderer.invoke("db:genUUID"),
  getAllReminders: () => ipcRenderer.invoke("db:getAllReminders"),
  getSpecificReminder: (date, message) => ipcRenderer.invoke("db:getSpecificReminder", date, message),
  insertReminder: (date, message) => ipcRenderer.invoke("db:insertReminder", date, message),
  deleteReminder: (date, message) => ipcRenderer.invoke("db:deleteReminder", date, message),
  updateReminder: (oldDate, oldMessage, newDate, newMessage) =>
    ipcRenderer.invoke("db:updateReminder", oldDate, oldMessage, newDate, newMessage),
  getTheme: () => ipcRenderer.invoke("db:getTheme"),
  updateTheme: (theme) => ipcRenderer.invoke("db:updateTheme", theme),
});

contextBridge.exposeInMainWorld("notify", {
    scheduleNotification: async (time, message) => await ipcRenderer.invoke("notify:scheduleNotification", time, message),
    cancelNotification: (id) => ipcRenderer.invoke("notify:cancelNotification", id),
    getActiveNotifications: () => ipcRenderer.invoke("notify:getActiveNotifications")
})

contextBridge.exposeInMainWorld("sys", {
  hostname: () => ipcRenderer.invoke("sys:hostname"),
  arch: () => ipcRenderer.invoke("sys:arch"),
  platform: () => ipcRenderer.invoke("sys:platform"),
  type: () => ipcRenderer.invoke("sys:type"),
  version: () => ipcRenderer.invoke("sys:version"),
  linuxOsInfo: () => ipcRenderer.invoke("sys:linuxOsInfo")
})