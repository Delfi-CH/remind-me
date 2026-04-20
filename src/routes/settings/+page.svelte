<script>
    import { genUUID, getTheme } from "$lib/database/db";
    import { onMount } from "svelte";
    import { setTheme } from "$lib/theme.svelte";

    let uuid = $state();
    let theme = $state("cosmo");

    let showSecretCounter = $state(0);
    let showSecretTheme = $derived(showSecretCounter >= 5 ? true : false);

    onMount(async () => {
        const tmpUUID = await genUUID();
        const tmpTheme = await getTheme();
        theme = tmpTheme;
        console.log(theme);
        uuid = tmpUUID;
        showSecretCounter = localStorage.getItem("secretCounter");
    });

    async function handleChange(event) {
        let tmpTheme = event.target.value;
        theme = tmpTheme;
        await setTheme(tmpTheme);
    }

    async function updateSecret() {
        showSecretCounter++;
        localStorage.setItem("secretCounter", showSecretCounter);
    }
</script>

<div class="d-flex">
    <main class="flex-fill px-4 py-3" style="padding-left: 1.5rem !important;">
        <div class="card bg-primary text-white mb-3">
            <h2 class="card-header">App Info</h2>
            <div class="card-body">
                <p>remind-me v0.0.1-dev</p>
                <p>
                    © 2026-2026 Delfi-CH <a
                        href="https://delfi.dev"
                        class="text-white">(https://delfi.dev)</a
                    >
                </p>
            </div>
        </div>
        <div class="card bg-primary text-white mt-3 mb-3">
            <h2 class="card-header">User Info</h2>
            <div class="card-body">
                <p>
                    Your UUID: <strong onclick={async () => updateSecret()}
                        >{uuid}</strong
                    >
                </p>
            </div>
        </div>
        <div class="card bg-primary text-white mt-3 mb-3">
            <h2 class="card-header">Settings</h2>
            <div class="card-body">
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
                        <option value="spacelab">Classic</option>
                        <option value="slate">Dark</option>
                        {#if showSecretTheme}
                            <option value="quartz">Purple</option>
                            <option value="mint">Mint</option>
                            <option value="drawn">Drawn</option>
                            <option value="lux">Fancy</option>
                            <option value="liquid">Liquid Glassy</option>
                        {/if}
                    </select>
                </label>
            </div>
        </div>
    </main>
</div>
