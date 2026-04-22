// notify.js
import isElectron from "is-electron";
const electron = isElectron()

export async function initNotification() {
    if (electron) {
        return
    } else {
        const { LocalNotifications } = await import('@capacitor/local-notifications')
        const perms = await getPerms()
        if (!perms) return;
        await LocalNotifications.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: 4,
        })
        return
    }
}

export async function dummyNotifycation() {
    if (electron) {
        let now = new Date()
        now.setSeconds(now.getSeconds() + 5)
        await window.notify.scheduleNotification(now , "Dummy!")
    } else {
        const { LocalNotifications } = await import('@capacitor/local-notifications')
        const perms = await getPerms()
        if (!perms) return;
        let now = new Date()
        now.setSeconds(now.getSeconds() + 5)

        await LocalNotifications.schedule({
            notifications: [{
                title: "Reminder!",
                body: "Dummy!",
                id: Math.floor(Math.random() * 100000),
                channelId: "default",
                schedule: { at: now }
            }]
        })
    }
}

export async function sendNotification(time, message) {
    if (electron) {
        return await window.notify.scheduleNotification(time , message)
    } else {
        const { LocalNotifications } = await import('@capacitor/local-notifications')
        const perms = await getPerms()
        if (!perms) return;

        const id = Math.floor(Math.random() * 100000)
        await LocalNotifications.schedule({
            notifications: [{
                title: "Reminder!",
                body: message,
                id: id,
                channelId: "default",
                schedule: { at: time }
            }]
        })
        return id
    }
}

export async function getPendingNotifications() {
    let messages;
    if (electron) {
        messages = await window.notify.getActiveNotifications()
    } else {
        const { LocalNotifications } = await import('@capacitor/local-notifications')
        const perms = await getPerms()
        if (!perms) return;
        messages = await LocalNotifications.getPending()
    }
    return messages
    
}

async function getPerms() {
    if (electron) {
        return false
    }
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    const perm = await LocalNotifications.checkPermissions()

    const status = await LocalNotifications.checkExactNotificationSetting();
    if (status.exact_alarm !== 'granted') {
        await LocalNotifications.changeExactNotificationSetting();
    }

    if (perm.display !== 'granted') {
        const perm2 = await LocalNotifications.requestPermissions()

        if (perm2.display !== 'granted') {
            console.warn('Notification permission not granted')
            return false
        }
    }
    return true
}

export async function cancelNotification(id) {
    if (electron) {
        return window.notify.cancelNotification(id);
    } else {
        const { LocalNotifications } = await import('@capacitor/local-notifications');

        await LocalNotifications.cancel({
            notifications: [
                { id }
            ]
        });
    }
}