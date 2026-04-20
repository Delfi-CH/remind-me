<script>
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { initTheme } from '$lib/theme.svelte';
	onMount(async ()=> {
		await initTheme()
	})
	import 'bootstrap/dist/js/bootstrap.bundle.min.js';
	import { resolve } from "$app/paths";
	
	let { children } = $props();
</script>

<svelte:head>
	<link id="theme-link" rel="stylesheet" href="" />
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="d-flex layout">
    <nav class="bg-primary text-white p-3 sidebar">
        <h5 class="mb-3 text-white">remind-me</h5>

        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link text-white" href={resolve("/")}>Home</a>
                <a class="nav-link text-white" href={resolve("/settings")}>Settings</a>
            </li>
        </ul>
    </nav>

    <!-- Page content -->
    <main class="flex-grow-1 p-3">
        {@render children()}
    </main>
</div>

<style>
	.layout {
    	min-height: 100vh;
	}
</style>


