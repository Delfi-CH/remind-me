<script>
    import { onMount } from "svelte";
    import { getAllReminders, getTheme } from "$lib/database/db.js";
    import Create from "$lib/components/Create.svelte";
    import Viewer from "$lib/components/Viewer.svelte";
    import { initNotification } from "$lib/notify/notify.js";

    let reminders = $state();
    let theme = $state()

    onMount(async () => {
        await initNotification();
        await refetchAll();
        let tmpTheme = await getTheme()
        theme = tmpTheme
    });

    async function refetchAll() {
        const tmpReminders = await getAllReminders();
        reminders = tmpReminders;
    }
</script>

<div class="d-flex">
    <main class="flex-fill px-4 py-3">
        <Create onSubmit={async () => await refetchAll()} />
        {#each reminders as reminder (reminder.id)}
            <Viewer reminder={reminder} onRefetch={async () => refetchAll()} theme={theme}/>
        {/each}
    </main>
</div>
