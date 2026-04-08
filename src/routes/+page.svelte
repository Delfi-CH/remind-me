<script>
    import { onMount } from "svelte" 
    import { genUUID } from "$lib/database/db";
    let uuid = $state()
    onMount(async ()=>{
        const tmpUUID = await genUUID()
        uuid = tmpUUID
        console.log(uuid)
    })
</script>

<main>
    <h1>remind-me</h1>
    <p>uuid: {uuid}</p>
</main>