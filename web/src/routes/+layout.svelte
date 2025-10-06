<script lang="ts">
	import { locale, setLocale, t } from '$lib/text';
	export let data: App.PageData;
	import { onMount } from 'svelte';

	let open = false;
	let isMobile = false;

	const MQ = '(max-width: 900px)';
	let mql: MediaQueryList;

	onMount(() => {
		mql = window.matchMedia(MQ);
		const update = () => {
			isMobile = mql.matches;
			if (!isMobile) open = false;
		};
		update();

		mql.addEventListener('change', update);
		return () => mql.removeEventListener('change', update);
	});

	$: if (data?.lang) {
		setLocale(data.lang);
		if (typeof document !== 'undefined') document.documentElement.lang = data.lang;
	}

	async function changeLang(next: 'en' | 'bg') {
		setLocale(next);
		document.documentElement.lang = next;
		const form = new FormData();
		form.set('lang', next);
		await fetch('?/setLang', { method: 'POST', body: form });
	}

	function scrollToId(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		open = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<header class="site-header" on:keydown={onKey}>
	<div class="bar">
		<button class="brand" on:click={() => scrollToId('home')} aria-label="Home">
			<img src="/images/logo.png" alt="Home" width="120" height="32" class="brand-logo" decoding="async" />
		</button>

		<nav class="nav desktop">
			<button on:click={() => scrollToId('home')}>{$t('nav.home')}</button>
			<button on:click={() => scrollToId('before-after')}>{$t('nav.results')}</button>
			<button on:click={() => scrollToId('about')}>{$t('nav.about')}</button>
			<button on:click={() => scrollToId('contact')}>{$t('nav.contact')}</button>
			<div class="lang-inline">
				<button class:active={$locale === 'en'} on:click={() => changeLang('en')}>EN</button>
				<button class:active={$locale === 'bg'} on:click={() => changeLang('bg')}>BG</button>
			</div>
		</nav>

		<button
			class="hamburger mobile"
			aria-label="Menu"
			aria-expanded={open}
			aria-controls="mobileMenu"
			on:click={() => (open = !open)}
		>
			<span class="line" />
			<span class="line" />
			<span class="line" />
		</button>

		{#if isMobile}
			<div id="mobileMenu" class="mobile-panel mobile" hidden={!open}></div>
		{/if}
	</div>

	<div id="mobileMenu" class="mobile-panel mobile" hidden={!open}>
		<button class="panel-link" on:click={() => scrollToId('home')}>{$t('nav.home')}</button>
		<button class="panel-link" on:click={() => scrollToId('before-after')}
			>{$t('nav.results')}</button
		>
		<button class="panel-link" on:click={() => scrollToId('about')}>{$t('nav.about')}</button>
		<button class="panel-link" on:click={() => scrollToId('contact')}>{$t('nav.contact')}</button>

		<div class="panel-lang">
			<span>Language</span>
			<div class="panel-lang-buttons">
				<button class:active={$locale === 'en'} on:click={() => changeLang('en')}>EN</button>
				<button class:active={$locale === 'bg'} on:click={() => changeLang('bg')}>BG</button>
			</div>
		</div>
	</div>
</header>

<main><slot /></main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
	:global(body) {
		margin: 0;
		font-family:
			system-ui,
			-apple-system,
			Segoe UI,
			Roboto,
			Helvetica,
			Arial;
		color: #111;
		background: #fff;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: transparent;
		border: 0;
		padding: 0;
		cursor: pointer;
	}

	.brand-logo {
		display: block;
		height: 32px;
		width: auto;
		object-fit: contain;
		user-select: none;
		-webkit-user-drag: none;
	}
	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid #eee;
	}
	.bar {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0.6rem 1rem;
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}
	.brand {
		font-weight: 800;
		cursor: pointer;
	}
	.nav button {
		appearance: none;
		background: transparent;
		border: 0;
		padding: 0.5rem 0.8rem;
		border-radius: 999px;
		cursor: pointer;
		font-weight: 600;
	}
	.nav button:hover {
		background: #f2f2f2;
	}
	.lang-inline {
		margin-left: 0.5rem;
		display: flex;
		gap: 0.25rem;
	}
	.lang-inline button {
		border: 1px solid #ddd;
		padding: 0.35rem 0.6rem;
		border-radius: 8px;
	}
	.lang-inline button.active {
		background: #111;
		color: #fff;
		border-color: #111;
	}

	.mobile {
		display: none;
	}
	.hamburger {
		background: transparent;
		border: 0;
		width: 40px;
		height: 34px;
		padding: 0;
		display: grid;
		place-items: center;
		gap: 4px;
		cursor: pointer;
	}
	.hamburger .line {
		width: 22px;
		height: 2px;
		background: #111;
		border-radius: 2px;
		display: block;
	}
	.mobile-panel {
		border-top: 1px solid #eee;
		background: #fff;
		transition: height 0.2s ease;
		display: grid;
		gap: 0.25rem;
		padding: 0.5rem 1rem 1rem;
		max-width: 1100px;
		margin: 0 auto;
	}
	.panel-link {
		text-align: left;
		padding: 0.6rem 0.4rem;
		border: 0;
		background: transparent;
		font-weight: 600;
		border-radius: 8px;
	}
	.panel-link:hover {
		background: #f6f6f6;
	}
	.panel-lang {
		display: grid;
		gap: 0.4rem;
		padding-top: 0.25rem;
	}
	.panel-lang-buttons {
		display: flex;
		gap: 0.4rem;
	}
	.panel-lang-buttons button {
		border: 1px solid #ddd;
		padding: 0.35rem 0.6rem;
		border-radius: 8px;
		background: #fff;
	}
	.panel-lang-buttons button.active {
		background: #111;
		color: #fff;
		border-color: #111;
	}

	.desktop {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-left: auto;
	}
	@media (max-width: 900px) {
		.desktop {
			display: none;
		}
		.mobile {
			display: initial;
		}
		.bar {
			padding: 0.5rem 0.75rem;
		}
	}

	main {
		min-height: 100vh;
	}

	.mobile {
		display: none;
	}
	.desktop {
		display: flex;
	}

	@media (max-width: 900px) {
		.desktop {
			display: none;
		}
		.mobile {
			display: initial;
		}
		.mobile-panel {
			display: grid;
		}
	}
	.mobile-panel[hidden] {
		height: 0;
		padding-block: 0;
		overflow: hidden;
		opacity: 0;
	}
	.mobile-panel {
		transition:
			height 0.2s ease,
			opacity 0.2s ease,
			padding 0.2s ease;
	}
</style>
