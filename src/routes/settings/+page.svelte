<script>
    import { genUUID, getTheme } from "$lib/database/db";
    import { onMount } from "svelte";
    import { setTheme } from "$lib/theme.svelte";
    import { getDeviceInfo } from "$lib/system/device";
    import PrivacyPolicy from "$lib/components/PrivacyPolicy.svelte";

    let uuid = $state();
    let theme = $state("cosmo");
    let device = $state({});
    let showSyncPopup = $state(false);
    let syncPopupAgreePrivacy = $state(false)

    let showSecretCounter = $state(0);
    let showSecretTheme = $derived(showSecretCounter >= 5 ? true : false);

    onMount(async () => {
        const tmpUUID = await genUUID();
        const tmpTheme = await getTheme();
        const tmpDevice = await getDeviceInfo();
        theme = tmpTheme;
        uuid = tmpUUID;
        device = tmpDevice;
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

    function updateSyncStatus(event) {
        if (event.target.checked) {
            showSyncPopup = true;
        }
    }
</script>

<div class="d-flex">
    <main class="flex-fill px-4 py-3" style="padding-left: 1.5rem !important;">
        <div class="card bg-primary text-white mb-3">
            <h2 class="card-header">App Info</h2>
            <div class="card-body">
                <p>remind-me v0.8.0-debug</p>
                <p>
                    <a href="https://github.com/Delfi-CH/remind-me"
                        >Source Code (GitHub)</a
                    >
                </p>
                <p>
                    © 2026-2026 Delfi-CH <a
                        href="https://delfi.dev"
                        class="text-white">(https://delfi.dev)</a
                    >
                </p>
            </div>
        </div>
        <div class="card bg-info text-white mt-3 mb-3">
            <h2 class="card-header">User Info</h2>
            <div class="card-body">
                <p>
                    Your UUID: <strong onclick={async () => updateSecret()}
                        >{uuid}</strong
                    >
                </p>
            </div>
        </div>
        <div class="card bg-warning text-white mt-3 mb-3">
            <h2 class="card-header">Synchronisation</h2>
            <div class="card-body">
                <p>
                    Current device: {device.name} ({device.os}
                    {device.osVersion})
                </p>
                <div class="form-check form-switch">
                    <label for="syncStatus">
                        <input
                            type="checkbox"
                            id="syncStatus"
                            class="form-check-input"
                            onchange={updateSyncStatus}
                        />
                        Synchronisation</label
                    >
                </div>
            </div>
        </div>
        {#if showSyncPopup}
            <div
                class="modal show d-block"
                tabindex="-1"
                style="background: rgba(0,0,0,0.5);"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <h2>Enable Synchronisation</h2>
                            <p>You are about to enable Synchronisation.</p>
                            <p>Synchronisation allows you to synchronise your Reminders with multiple devices.</p>
                            <p>To enable Synchronisation, you need to agree to our Privacy Policy (found underneath).</p>
                            <div>
                                <PrivacyPolicy></PrivacyPolicy>
                                <label for="privacyPolicyAgree">
                                    I have read and understood the Privacy Policy.
                                    <input type="checkbox" id="privacyPolicyAgree" bind:checked={syncPopupAgreePrivacy}>
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                        <button
                                class="btn btn-danger"
                                onclick={() => (showSyncPopup= false)}
                                disabled={!syncPopupAgreePrivacy}
                            >
                                Enable Synchronisation
                            </button>
                            <button
                                class="btn btn-secondary"
                                onclick={() => (showSyncPopup = false)}
                            >
                                Leave Disabled
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
        <div class="card bg-warning text-white mt-3 mb-3">
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
                            <option value="liquid">Liquid Glassy</option>
                        {/if}
                    </select>
                </label>
            </div>
        </div>
    </main>
</div>
