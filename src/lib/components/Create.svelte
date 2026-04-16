<script>
    import {insertReminder} from "$lib/database/db.js"
    import {sendNotification} from "$lib/notify/notify.js"

    let { onSubmit } = $props()

    let day = $state()

    let message = $state("")
    let status = $state()

    async function handleSubmit(event) {
        event.preventDefault()
        console.log(new Date(day))
        const date = new Date(day);
        try {
            await insertReminder(date, message)
            await sendNotification(date, message)
                onSubmit()
        } catch (e) {
            console.error(e)
        }
        
    }
</script>

<main class="card bg-success">
    <p class="card-header">New Reminder</p>
    <form onsubmit={async (e) => await handleSubmit(e)} class="card-body">
        <label for="day" class="form-label">Day & Time: <input type="datetime-local" class="hover form-control" id="day" bind:value={day} required></label>
        <label for="message" class="form-label">Message: <input type="text" id="message" bind:value={message} class="form-control" required></label>
        <button type="submit" class="btn btn-primary">Submit</button>
        <p>{status}</p>
    </form>
</main>

<style>
    .hover:hover {
        cursor: pointer;
    }
</style>