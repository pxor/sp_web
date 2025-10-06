<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/text';

	// background “sliding” effect: update CSS var based on scroll
	let heroEl: HTMLElement | null = null;

	const onScroll = () => {
		if (!heroEl) return;
		const y = window.scrollY || 0;
		// dampen movement so it subtly slides
		heroEl.style.setProperty('--bg-offset', `${Math.round(y * 0.25)}px`);
	};

	onMount(() => {
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	export let form;

	const cases = [
		{ n: 1, before: '/images/before_demo.jpg', after: '/images/after_demo.jpg', label: 'Case 1' },
		{ n: 2, before: '/images/before_demo.jpg', after: '/images/after_demo.jpg', label: 'Case 2' },
		{ n: 3, before: '/images/before_demo.jpg', after: '/images/after_demo.jpg', label: 'Case 3' },
		{ n: 4, before: '/images/before_demo.jpg', after: '/images/after_demo.jpg', label: 'Case 4' }
	];

	const caseLabel = (n: number, base: string) =>
		($t?.('results.case') || base).replace('{n}', String(n));
</script>

<section id="home" class="hero" bind:this={heroEl} aria-label={$t('nav.home')}>
	<div class="hero-inner">
		<img class="logo" src="/images/logo.png" alt={$t('hero.logoAlt')} />
		<h1>{$t('hero.slogan')}</h1>
		<p class="tagline">{$t('hero.tagline')}</p>
	</div>
</section>

<section id="before-after" class="section section-center">
	<h2>{$t('results.title')}</h2>
	<p class="muted">{$t('results.subtitle')}</p>

	<div class="ba-grid">
		{#each cases as c}
			<article class="ba-card" aria-label={caseLabel(c.n, c.label)}>
				<img class="ba-img before" src={c.before} alt={caseLabel(c.n, c.label) + ' — before'} />

				<div class="ba-text">
					<div class="ba-title">{caseLabel(c.n, c.label)}</div>
					<div class="ba-sub">{$t('results.subtitle')}</div>
				</div>

				<img class="ba-img after" src={c.after} alt={caseLabel(c.n, c.label) + ' — after'} />
			</article>
		{/each}
	</div>
</section>

<!-- make other section headers centered, too -->
<section id="about" class="section section-center">
	<h2>{$t('about.title')}</h2>
	<p>{$t('about.body')}</p>
</section>

<section id="contact" class="section section-center">
    <h2>{$t('contact.title')}</h2>
  
    <form method="POST" action="?/contact" class="contact">
      <label>
        {$t('contact.name') /* or "Your name" */}
        <input name="name" type="text" required placeholder={$t('contact.name.placeholder') || 'Your name'} />
      </label>
  
      <label>
        {$t('contact.email') /* or "Your email" */}
        <input name="email" type="email" required placeholder={$t('contact.email.placeholder') || 'you@example.com'} />
      </label>
  
      <label>
        {$t('contact.message') /* or "Message" */}
        <textarea name="message" rows="5" required placeholder={$t('contact.message.placeholder') || 'How can we help?'}></textarea>
      </label>
  
      <!-- (optional) honeypot for bots -->
      <input type="text" name="company" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" />
  
      <button type="submit">{$t('contact.submit') || 'Send'}</button>
  
      {#if form?.success}
        <p class="success">{$t('contact.success') || 'Thanks! We’ll be in touch.'}</p>
      {:else if form?.error}
        <p class="error">{$t(form.error) || form.error}</p>
      {/if}
    </form>
  </section>

<footer class="footer">
	<p>&copy; {new Date().getFullYear()} {$t('footer.copyright')}</p>
</footer>

<style>
    textarea {
        width: unset
    }

    .contact {
        max-width: unset !important
    }

	.section {
		max-width: 1100px;
		margin: 0 auto;
		padding: 4rem 1rem;
	}
	h2 {
		margin: 0 0 0.75rem 0;
		font-size: 2rem;
	}
	.muted {
		color: #666;
		margin: 0 0 1.5rem 0;
	}

	/* HERO with sliding background */
	.hero {
		position: relative;
		min-height: 80svh;
		display: grid;
		place-items: center;
		text-align: center;
		padding: 4rem 1rem;
		color: white;

		/* Replace with your background image */
		background-image:
			linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),
			url('/images/bg_primary.jpg');
		background-size: cover;
		background-repeat: no-repeat;
		/* Slide with scroll: we shift background-position Y via CSS var */
		background-position: center calc(var(--bg-offset, 0px));
	}
	.hero-inner {
		max-width: 900px;
	}
	.logo {
		width: 120px;
		height: 120px;
		object-fit: contain;
		margin-bottom: 1rem;
	}
	h1 {
		font-size: clamp(2rem, 4vw + 1rem, 3.5rem);
		margin: 0.25rem 0;
	}
	.tagline {
		font-size: 1.125rem;
		opacity: 0.95;
	}

	/* Before/After simple grid */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
	}
	.ba {
		background: #fafafa;
		border: 1px solid #eee;
		border-radius: 12px;
		overflow: hidden;
	}
	.ba img {
		display: block;
		width: 100%;
		height: auto;
	}
	.ba figcaption {
		padding: 0.5rem 0.75rem;
		color: #444;
		font-weight: 600;
	}

	/* Contact form */
	.contact {
		display: grid;
		gap: 0.75rem;
		max-width: 680px;
	}
	label {
		font-weight: 600;
		display: grid;
		gap: 0.35rem;
	}
	input,
	textarea {
		font: inherit;
		padding: 0.6rem 0.7rem;
		border: 1px solid #ddd;
		border-radius: 10px;
	}
	button {
		justify-self: start;
		padding: 0.6rem 1rem;
		border: 0;
		border-radius: 999px;
		background: #111;
		color: white;
		cursor: pointer;
	}
	.success {
		color: #1b8a3d;
	}
	.error {
		color: #b00020;
	}

	.footer {
		text-align: center;
		padding: 2rem 1rem 3rem;
		color: #777;
		border-top: 1px solid #eee;
		margin-top: 3rem;
	}

	.ba-title {
		font-weight: 700;
		font-size: 1.05rem;
		margin-bottom: 0.15rem;
	}

	.ba-sub {
		font-size: 0.9rem;
		color: #666;
	}
	/* 2×2 grid on desktop, 1×4 stack on mobile */
	.ba-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 900px) {
		.ba-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Same markup, responsive layout via grid areas */
	.ba-card {
		border: 1px solid #eee;
		border-radius: 12px;
		background: #fafafa;
		padding: 0.75rem;
		display: grid;
		gap: 0.75rem;

		/* Desktop: image | text | image */
		grid-template-columns: 1fr minmax(160px, 0.9fr) 1fr;
		grid-template-areas: 'before text after';
		align-items: center;
	}

	.ba-img {
		width: 100%;
		height: 220px;
		object-fit: cover;
		border-radius: 10px;
	}
	.ba-text {
		grid-area: text;
		display: grid;
		gap: 0.25rem;
		text-align: center;
		padding: 0.25rem 0.5rem;
	}
	.before {
		grid-area: before;
	}
	.after {
		grid-area: after;
	}

	/* Mobile: before → text → after (stacked) */
	@media (max-width: 900px) {
		.ba-card {
			grid-template-columns: 1fr;
			grid-template-areas:
				'before'
				'text'
				'after';
		}
		.ba-img {
			height: 200px;
		} /* optional tighter height on phones */
	}
</style>
