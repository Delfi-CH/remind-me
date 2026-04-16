<script>
    import { onMount } from "svelte";
    import { getAllReminders } from "$lib/database/db.js";
    import Create from "$lib/components/Create.svelte";
    import Viewer from "$lib/components/Viewer.svelte";
    import { initNotification } from "$lib/notify/notify.js";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let reminders = $state();

    onMount(async () => {
        await initNotification();
        await refetchAll();
    });

    async function refetchAll() {
        const tmpReminders = await getAllReminders();
        reminders = tmpReminders;
    }
</script>

<div class="d-flex">
    <Sidebar></Sidebar>

    <main class="flex-fill px-4 py-3">
        <Create onSubmit={async () => await refetchAll()} />
        {#each reminders as reminder (reminder.id)}
            <Viewer {reminder} onRefetch={async () => refetchAll()} />
        {/each}
    </main>
</div>
