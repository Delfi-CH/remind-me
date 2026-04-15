<script>
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { initTheme } from '$lib/theme.svelte';
	onMount(async ()=> {
		await initTheme()
	})
	import 'bootstrap/dist/js/bootstrap.bundle.min.js';
	
	let { children } = $props();
</script>

<svelte:head>
	<link id="theme-link" rel="stylesheet" href="" />
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
