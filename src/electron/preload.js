const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("db", {
  genUUID: () => ipcRenderer.invoke("db:genUUID"),
  getAllReminders: () => ipcRenderer.invoke("db:getAllReminders"),
  getSpecificReminder: (date, message) => ipcRenderer.invoke("db:getSpecificReminder", date, message),
  insertReminder: (date, message) => ipcRenderer.invoke("db:insertReminder", date, message),
  deleteReminder: (date, message) => ipcRenderer.invoke("db:deleteReminder", date, message),
  updateReminder: (oldDate, oldMessage, newDate, newMessage) =>
    ipcRenderer.invoke("db:updateReminder", oldDate, oldMessage, newDate, newMessage)
});

contextBridge.exposeInMainWorld("notify", {
    scheduleNotification: async (time, message) => await ipcRenderer.invoke("notify:scheduleNotification", time, message),
    cancelNotification: (id) => ipcRenderer.invoke("notify:cancelNotification", id),
    getActiveNotifications: () => ipcRenderer.invoke("notify:getActiveNotifications")
})