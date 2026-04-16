<script>
    import { onMount } from "svelte";
    import { getAllReminders } from "$lib/database/db.js";
    import Create from "$lib/components/Create.svelte";
    import Viewer from "$lib/components/Viewer.svelte";
    import { resolve } from "$app/paths";
    import { initNotification } from "$lib/notify/notify.js";

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
    <nav class="bg-light sidebar vh-100 p-3 text-dark" style="width: 150px;">
        <h5 class="mb-3">Menu</h5>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link text-dark" href={resolve("/")}> Home </a>
                <a class="nav-link text-dark" href={resolve("/settings")}>
                    Settings
                </a>
            </li>
        </ul>
    </nav>

    <main class="flex-fill px-4 py-3">
        <h1>remind-me</h1>
        <Create onSubmit={async () => await refetchAll()} />
        {#each reminders as reminder (reminder.id)}
            <Viewer {reminder} onRefetch={async () => refetchAll()} />
        {/each}
    </main>
</div>
