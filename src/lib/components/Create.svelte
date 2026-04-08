<script>
    import {insertReminder} from "$lib/database/db.js"

    let { onSubmit } = $props()

    let day = $state()
    let time = $state()
    let message = $state("")
    let status = $state()

    async function handleSubmit(event) {
        event.preventDefault()
        const [year, month, datePart] = day.split("-");
        const [hour, minute] = time.split(":");
        const date = new Date(year, month - 1, datePart, hour, minute, 0);
        try {
            await insertReminder(date, message)
            onSubmit()
        } catch (e) {
            console.error(e)
        }
        
    }
</script>

<main>
    <form onsubmit={async (e) => await handleSubmit(e)}>
        <label for="day">Day: <input type="date" id="day" bind:value={day} required></label>
        <label for="time">Time: <input type="time" id="time" bind:value={time} required></label>
        <label for="message">Message: <input type="text" id="message" bind:value={message} required></label>
        <button type="submit">Submit</button>
        <p>{status}</p>
    </form>
</main>