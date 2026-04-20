<script>
    import { onMount } from "svelte";
    import {
        sendNotification,
        cancelNotification,
        getPendingNotifications,
    } from "$lib/notify/notify.js";
    import { deleteReminder } from "$lib/database/db.js";

    let { reminder, onRefetch, theme } = $props();
    let id = $state("");
    let isRunning = $state(false);

    onMount(async () => {
        console.log(theme)
        const tmprunning = await checkIfRunning();
        isRunning = tmprunning;
    });

    async function checkIfRunning() {
        const result = await getPendingNotifications();

        const messages = result?.notifications || [];

        if (messages.length === 0) return false;

        const found = messages.find(
            (msg) => msg.body === reminder.message,
        );

        if (!found) return false;

        id = found.id;
        return true;
    }

    async function deleteReminderFromDB() {
        const confirmation = await confirm(
            "Do you want to delete this reminder?",
            { title: "Warning", kind: "warning" },
        );

        if (confirmation) {
            await cancelNotify();
            await deleteReminder(
                new Date(reminder.reminderTime),
                reminder.message,
            );
            onRefetch();
        }
    }

    async function cancelNotify() {
        if (id) {
            await cancelNotification(id);
            id = "";
            const tmprunning = await checkIfRunning();
            isRunning = tmprunning;
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
                id = tmpId || "";
                isRunning = true;
            } else if (interactive) {
                alert("Reminder time is in the past or invalid!");
            }
        }
        onRefetch();
    }
</script>

<main>
    <div class="card {theme == "lux" ? "bg-primary" : "bg-secondary"} {theme == "liquid" ? "text-black" : "text-white"} mt-3 mb-3 " >
        <p class="card-header">{reminder.message}</p>
        <div class="card-body">
            <p>
                When: {new Date(
                    new Date(reminder.reminderTime),
                ).toLocaleString()}
            </p>
            <p>Active: {isRunning ? "Yes" : "No"}</p>
            <div class="flexbox-direction">
            <button onclick={deleteReminderFromDB} class="btn btn-danger form-item"
                >Delete</button
            >
            <button onclick={cancelNotify} class="btn btn-warning form-item"
                >Cancel</button
            >
            <button onclick={() => scheduleNotify(true)} class="btn btn-primary form-item"
                >Start</button
            >
            </div>
        </div>
    </div>
</main>

<style>
    .flexbox-direction {
        display: flex;
        flex-direction: column;
    }

    .form-item {
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        height: fit-content;
    }

    @media (min-width: 699px) {
        .flexbox-direction {
            flex-direction: row;
        }

    }
</style>
