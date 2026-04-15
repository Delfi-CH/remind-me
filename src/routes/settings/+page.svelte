<script>
    import {resolve} from "$app/paths";
    import {genUUID, getTheme} from "$lib/database/db";
    import {onMount} from "svelte";
    import {setTheme} from "$lib/theme.svelte"

    let uuid = $state()
    let theme = $state("cosmo");

    onMount(async ()=>{
        const tmpUUID = await genUUID()
        const tmpTheme = await getTheme()
        console.log(tmpTheme)
        theme = tmpTheme
        uuid = tmpUUID
    })

    async function handleChange(event) {
        let tmpTheme = event.target.value
        theme = tmpTheme
        await setTheme(event.target.value)
    }
</script>

<main>
    <h1>remind-me</h1>
    <p><a href={resolve("/")}>Home</a></p>
    <p>remind-me v0.0.1-dev</p>
    <p>© 2026-2026 Delfi-CH <a href="https://delfi.dev">(https://delfi.dev)</a></p>
    <h2>User Info</h2>
    <p>Your UUID: {uuid}</p>
    <h2>Settings</h2>
    <label for="themeSelect">Theme: 
        <select name="Theme" id="themeSelect" onchange={handleChange} bind:value={theme}>
            <option value="cosmo">Cosmo</option>
            <option value="quartz">Quartz</option>
            <option value="materia">Materia</option>
            <option value="spacelab">SpaceLab</option>
            <option value="cerulean">Cerulean</option>
        </select>
    </label>
</main>