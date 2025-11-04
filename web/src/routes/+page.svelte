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

	type TransformationCase = {
		n: number;
		image: string;
		label: string;
		summary: string;
		stats: string[];
	};

	const cases: TransformationCase[] = [
		{
			n: 1,
				image: '/images/1.png',
			label: 'Leah, 22 lb lost',
			summary: 'High-protein meals and 3x weekly strength sessions trimmed 22 lbs in 16 weeks.',
				stats: ['Weight: 178 lb -> 156 lb', 'Body fat: 38% -> 29%', 'Waist: 36" -> 30"']
		},
		{
			n: 2,
				image: '/images/2.png',
			label: 'Carmen, 9 kg lighter',
			summary: 'Mediterranean-inspired nutrition plus mobility drills helped drop 9 kg sustainably.',
				stats: ['Weight: 74 kg -> 65 kg', 'Energy: Afternoon crashes gone', 'Steps: 5k -> 10k daily']
		},
		{
			n: 3,
				image: '/images/3.png',
			label: 'Aisha, 3 sizes down',
			summary: 'Hybrid HIIT and Pilates rebuilt core strength while reshaping her silhouette.',
				stats: ['Dress size: 12 -> 8', 'Midsection: -4"', 'Confidence: Speaking on-stage again']
		},
		{
			n: 4,
				image: '/images/4.png',
			label: 'Julia, postpartum reset',
			summary: 'Smart strength circuits and mindful recovery recharged her postpartum routine.',
				stats: ['Weight: 162 lb -> 142 lb', 'Sleep: 5 hrs -> 7 hrs nightly', 'Weekly workouts: 0 -> 4']
		}
	];

	const caseLabel = (c: TransformationCase) => {
		const template = $t?.('results.case');
		if (template && template.includes('{n}')) {
			return `${template.replace('{n}', String(c.n))} - ${c.label}`;
		}
		return c.label;
	};
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
				<article class="ba-card" aria-label={caseLabel(c)}>
					<div
						class="ba-img before"
						role="img"
						aria-label={caseLabel(c) + ' - before'}
						style={`--img: url('${c.image}')`}
					></div>

					<div class="ba-text">
						<div class="ba-title">{c.label}</div>
						<p class="ba-sub">{c.summary}</p>
						{#if c.stats && c.stats.length}
							<ul class="ba-stats">
								{#each c.stats as stat}
									<li>{stat}</li>
								{/each}
							</ul>
						{/if}
					</div>

					<div
						class="ba-img after"
						role="img"
						aria-label={caseLabel(c) + ' - after'}
						style={`--img: url('${c.image}')`}
					></div>
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
		#before-after.section {
			max-width: none;
			width: 100%;
			padding-left: clamp(1rem, 6vw, 5rem);
			padding-right: clamp(1rem, 6vw, 5rem);
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
		width: 240px;
		height: 240px;
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
		margin: 0;
		line-height: 1.45;
	}

	.ba-stats {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.25rem;
		font-size: 0.9rem;
		color: #444;
	}

	.ba-stats li {
		position: relative;
		padding-left: 1.1rem;
	}

	.ba-stats li::before {
		content: '-';
		position: absolute;
		left: 0;
		color: #999;
	}
	/* Single column layout across viewports */
		.ba-grid {
			display: grid;
			gap: 1.5rem;
			margin: 0 auto;
			width: min(100%, 1200px);
			padding: 0;
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
			grid-template-columns: minmax(300px, 0.95fr) minmax(240px, 0.7fr) minmax(300px, 0.95fr);
			grid-template-areas: 'before text after';
			align-items: stretch;
			max-width: min(1100px, 100%);
			margin: 0 auto;
		}

		.ba-img {
			width: 100%;
			border-radius: 10px;
			background-image: var(--img);
			background-size: 200% 100%;
			background-repeat: no-repeat;
			background-position: center;
			background-color: #e9e9e9;
			aspect-ratio: 3 / 4;
		}
		.ba-text {
			grid-area: text;
			display: grid;
			gap: 0.5rem;
			text-align: center;
			padding: 0.25rem 0.5rem;
			align-content: center;
			justify-items: center;
			align-items: center;
		}
		.before {
			grid-area: before;
			background-position: left center;
		}
		.after {
			grid-area: after;
			background-position: right center;
		}

	/* Mobile: before → text → after (stacked) */
	@media (max-width: 900px) {
		.ba-card {
			grid-template-columns: 1fr;
			grid-template-areas:
				'before'
				'text'
				'after';
			max-width: min(520px, 100%);
			margin: 0 auto;
		}
	}
</style>
