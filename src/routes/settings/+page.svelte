<script>
    import { resolve } from "$app/paths";
    import { genUUID, getTheme } from "$lib/database/db";
    import { onMount } from "svelte";
    import { setTheme } from "$lib/theme.svelte";

    let uuid = $state();
    let theme = $state("cosmo");

    onMount(async () => {
        const tmpUUID = await genUUID();
        const tmpTheme = await getTheme();
        theme = tmpTheme;
        console.log(theme)
        uuid = tmpUUID;
    });

    async function handleChange(event) {
        let tmpTheme = event.target.value;
        theme = tmpTheme;
        await setTheme(tmpTheme);
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
        <p>remind-me v0.0.1-dev</p>
        <p>
            © 2026-2026 Delfi-CH <a href="https://delfi.dev"
                >(https://delfi.dev)</a
            >
        </p>
        <h2>User Info</h2>
        <p>Your UUID: <strong>{uuid}</strong></p>
        <h2>Settings</h2>
        <label for="themeSelect"
            >Theme:
            <select
                name="Theme"
                id="themeSelect"
                class="form-select"
                onchange={handleChange}
                bind:value={theme}
            >
                <option value="cosmo">Minimal</option>
                <option value="quartz">Colorful</option>
                <option value="materia">Pop</option>
                <option value="spacelab">Classic</option>
            </select>
        </label>
    </main>
</div>
