<script>
    import { onMount } from "svelte" 
    import { getAllReminders } from "$lib/database/db.js";
    import Create from "$lib/components/Create.svelte";
    import Viewer from "$lib/components/Viewer.svelte";
    import {resolve} from "$app/paths";
    import { initNotification } from "$lib/notify/notify.js";
    import { ref } from "process";

    let reminders = $state()

    onMount(async ()=>{
        await initNotification()
        await refetchAll()
    })

    async function refetchAll() {
        const tmpReminders = await getAllReminders()
        reminders = tmpReminders
    }
</script>

<main>
    <h1>remind-me</h1>
    <Create onSubmit={async ()=> await refetchAll()}></Create>
    {#each reminders as reminder (reminder.id)}
        <Viewer reminder={reminder} onRefetch={async ()=> refetchAll()}></Viewer>
    {/each}
    <p><a href={resolve("/settings")}>Settings</a></p>
</main>