<script>
    import { onMount } from "svelte";
    import { sendNotification, cancelNotification, getPendingNotifications } from "$lib/notify/notify.js";
    import { deleteReminder } from "$lib/database/db.js";

    let { reminder, onRefetch } = $props();
    let id = $state("");
    let isRunning = $state(false);

    onMount(async () => {
        const tmprunning = await checkIfRunning()
        isRunning = tmprunning
    });

    async function checkIfRunning() {
        const messages = await getPendingNotifications();
        if (!messages || messages.length === 0) return false;

        const found = messages.find(msg => msg.message === reminder.message);
        if (!found) return false;

        id = found.id;
        return true;
    }

    async function deleteReminderFromDB() {
        const confirmation = await confirm(
            'Do you want to delete this reminder?', 
            { title: 'Warning', kind: 'warning' }
        );


        if (confirmation) {
            await cancelNotify();
            await deleteReminder(new Date(reminder.reminderTime), reminder.message);
            onRefetch();
        }
    }

    async function cancelNotify() {
        if (id) {
            await cancelNotification(id);
            id = "";
            const tmprunning = await checkIfRunning()
            isRunning = tmprunning
            onRefetch();
        }
    }

    async function scheduleNotify(interactive = false) {
        const running = await checkIfRunning();
        isRunning = running;
        if (!running) {
            const time = new Date(new Date(reminder.reminderTime));
            if (time - new Date() > 0 && !isNaN(time - new Date())) {
                const tmpId = await sendNotification(time, reminder.message);
                id = tmpId || "";  // if notify.js returns an id
                isRunning = true;
            } else if (interactive) {
                alert("Reminder time is in the past or invalid!");
            }
        }
        onRefetch();
    }
</script>

<main>
    <p>{reminder.message}</p>
    <p>When: {new Date(new Date(reminder.reminderTime)).toLocaleString()}</p>
    <p>Active: {isRunning ? "Yes" : "No"}</p>
    <button onclick={deleteReminderFromDB} class="btn btn-danger">Delete</button>
    <button onclick={cancelNotify} class="btn btn-warning">Cancel</button>
    <button onclick={() => scheduleNotify(true)}  class="btn btn-primary">Start</button>
</main>