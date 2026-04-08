<script>
    import { deleteReminder } from "$lib/database/db";
    let { reminder, onRefetch } = $props();

    async function deleteReminderFromDB(time, message) {
    const confirmation = await confirm('Do you want to delete this reminder?', { title: 'Warning', kind: 'warning' });
    if (confirmation === true) {
        await deleteReminder(time, message)
        onRefetch();
    }
}
</script>

<main>
    <p>{reminder.message}</p>
    <p>When: {new Date(reminder.reminderTime).toLocaleString()}</p>
    <button onclick={async () => await deleteReminderFromDB(new Date(reminder.reminderTime), reminder.message)}>Delete</button>
</main>