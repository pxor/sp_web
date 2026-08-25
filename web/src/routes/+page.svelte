<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/text';

	// background “sliding” effect: update CSS var based on scroll
	let heroEl: HTMLElement | null = null;
	let emailValue = '';
	let emailTouched = false;
	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	$: emailInvalid = emailTouched && !EMAIL_RE.test(emailValue);

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

	let formStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';

	async function handleContactSubmit(e: SubmitEvent) {
		const target = e.target as HTMLFormElement;
		const data = new FormData(target);
		// honeypot — silently ignore bot submissions
		if ((data.get('company') as string)?.trim()) {
			formStatus = 'success';
			return;
		}
		formStatus = 'sending';
		try {
			// Web3Forms: sign up at https://web3forms.com and replace the access_key below
			data.set('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				body: data
			});
			const json = await res.json();
			formStatus = json.success ? 'success' : 'error';
			if (formStatus === 'success') target.reset();
		} catch {
			formStatus = 'error';
		}
	}

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
			label: $t('results.cases.1.label'),
			summary: $t('results.cases.1.summary'),
			stats: [
				$t('results.cases.1.stats.1'),
				$t('results.cases.1.stats.2'),
				$t('results.cases.1.stats.3')
			]
		},
		{
			n: 2,
			image: '/images/2.png',
			label: $t('results.cases.2.label'),
			summary: $t('results.cases.2.summary'),
			stats: [
				$t('results.cases.2.stats.1'),
				$t('results.cases.2.stats.2'),
				$t('results.cases.2.stats.3')
			]
		},
		{
			n: 3,
			image: '/images/3.png',
			label: $t('results.cases.3.label'),
			summary: $t('results.cases.3.summary'),
			stats: [
				$t('results.cases.3.stats.1'),
				$t('results.cases.3.stats.2'),
				$t('results.cases.3.stats.3')
			]
		},
		{
			n: 4,
			image: '/images/4.png',
			label: $t('results.cases.4.label'),
			summary: $t('results.cases.4.summary'),
			stats: [
				$t('results.cases.4.stats.1'),
				$t('results.cases.4.stats.2'),
				$t('results.cases.4.stats.3')
			]
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
  
    <form class="contact" on:submit|preventDefault={handleContactSubmit}>
      <label>
        {$t('contact.email')}
        {#if emailInvalid}
          <span class="field-error">{$t('contact.email.invalid') || 'Invalid email!'}</span>
        {/if}
        <input
          name="email"
          type="email"
          required
          pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
          title="Please enter a valid email address."
          placeholder={$t('contact.email.placeholder') || 'you@example.com'}
          class:input-error={emailInvalid}
          bind:value={emailValue}
          on:input={() => (emailTouched = true)}
        />
      </label>

      <label>
        {$t('contact.message')}
        <textarea name="message" rows="5" required placeholder={$t('contact.message.placeholder') || 'How can we help?'}></textarea>
      </label>

      <!-- honeypot for bots -->
      <input type="text" name="company" tabindex="-1" autocomplete="off" class="honeypot" />

      <button type="submit" disabled={formStatus === 'sending'}>
        {formStatus === 'sending' ? '...' : ($t('contact.submit') || 'Send')}
      </button>

      {#if formStatus === 'success'}
        <p class="success">{$t('contact.success') || "Thanks! We'll be in touch."}</p>
      {:else if formStatus === 'error'}
        <p class="error">{$t('contact.error') || 'Something went wrong. Please try again.'}</p>
      {/if}
    </form>
  </section>

<section id="map" class="section section-center">
	<iframe
		title="Google Maps - ул. Опълченска 22"
		class="map-embed"
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
		src="https://www.google.com/maps?q=%D1%83%D0%BB.%20%D0%9E%D0%BF%D1%8A%D0%BB%D1%87%D0%B5%D0%BD%D1%81%D0%BA%D0%B0%2022&output=embed"
	></iframe>
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
		box-sizing: border-box;
	}
	.section-center h2 {
		text-align: center;
	}
	.section-center .muted {
		text-align: center;
	}
	#before-after.section {
		max-width: none;
		width: 100%;
		padding-left: clamp(1rem, 6vw, 5rem);
		padding-right: clamp(1rem, 6vw, 5rem);
		box-sizing: border-box;
	}
	h2 {
		margin: 0 0 0.75rem 0;
		font-size: 2rem;
	}
	.muted {
		color: #111;
		font-size: 1rem;
		line-height: 1.6;
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
			url('/images/background.gif');
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
	.input-error {
		border-color: #b00020;
		box-shadow: 0 0 0 3px rgba(176, 0, 32, 0.08);
	}
	.field-error {
		color: #b00020;
		font-size: 0.9rem;
		font-weight: 600;
	}
	.honeypot {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
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

	.map-embed {
		width: 100%;
		height: min(60vh, 520px);
		border: 0;
		border-radius: 16px;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
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
