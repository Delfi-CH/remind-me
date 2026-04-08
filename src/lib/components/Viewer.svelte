<script>
    import { deleteReminder } from "$lib/database/db";
    import { onMount } from "svelte";
    import isElectron from "is-electron";

    let { reminder, onRefetch } = $props();
    let id = $state("");
    let isRunning = $state(false);
    const electron = isElectron()

    onMount(async ()=> {
        const running = checkIfRunning()
        isRunning = running
    })

    async function checkIfRunning() {
        const messages = await window.notify.getActiveNotifications()
        if (messages.length === 0) return false;
        const found = messages.map(msg => msg.message).find((msg) => msg === reminder.message)
        if (!found) return false;
        const newId = messages.find((msg)=> msg.message === reminder.message).id
        id = newId
        return true
    }

    async function deleteReminderFromDB(time, message) {
        const confirmation = await confirm('Do you want to delete this reminder?', { title: 'Warning', kind: 'warning' });
        if (confirmation === true) {
            await cancelNotify();
            await deleteReminder(time, message)
            onRefetch();
        }
    }

    async function cancelNotify() {
        if (id !== "") {
            const sucess = await window.notify.cancelNotification(id)
            if (sucess) id = "";
            onRefetch()
            const running = await checkIfRunning()
            isRunning = running
        }
    }

    async function scheduleNotify(interactive) {
        const running = await checkIfRunning()
        isRunning = running
        if (running === false) {
            if ((new Date(reminder.reminderTime) - new Date()) > 0 && !isNaN(new Date(reminder.reminderTime) - new Date())) {
                const tmpId = await window.notify.scheduleNotification(reminder.reminderTime, reminder.message)
                id = tmpId
                isRunning = true
            } else {
                if (interactive) alert("E")
            }
        }
        onRefetch()
    }
</script>

<main>
    <p>{reminder.message}</p>
    <p>When: {new Date(reminder.reminderTime).toLocaleString()}</p>
    <p>Active: {isRunning ? "Yes": "No"}</p>
    <button onclick={async () => await deleteReminderFromDB(new Date(reminder.reminderTime), reminder.message)}>Delete</button>
    <button onclick={async () => await cancelNotify()}>Cancel</button>
    <button onclick={async () => await scheduleNotify(true)}>Start</button>
</main>