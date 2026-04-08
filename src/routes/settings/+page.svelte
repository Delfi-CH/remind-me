<script>
    import {resolve} from "$app/paths";
    import {genUUID} from "$lib/database/db";
    import {onMount} from "svelte";

    let uuid = $state()
    
    onMount(async ()=>{
        const tmpUUID = await genUUID()
        uuid = tmpUUID
    })
</script>

<main>
    <h1>remind-me</h1>
    <p><a href={resolve("/")}>Home</a></p>
    <p>remind-me v0.0.1-dev</p>
    <p>© 2026-2026 Delfi-CH <a href="https://delfi.dev">(https://delfi.dev)</a></p>
    <h2>User Info</h2>
    <p>Your UUID: {uuid}</p>
</main>