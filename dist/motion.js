(() => {
  'use strict';
  const heroRoot = document.querySelector('.hero');
  function staticHero() {
    const sync = () => heroRoot.classList.toggle('is-hero-revealed', window.scrollY > 2);
    window.addEventListener('scroll', sync, {passive: true});
    sync();
    return () => {
      window.removeEventListener('scroll', sync);
      heroRoot.classList.remove('is-hero-revealed');
    };
  }
  if (!window.gsap || !window.ScrollTrigger) {
    staticHero();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  const media = gsap.matchMedia();
  const entrances = new Map();
  const select = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Focused links/buttons become visible immediately, including after keyboard jumps.
  document.addEventListener('focusin', event => {
    for (let node = event.target; node; node = node.parentElement) {
      entrances.get(node)?.progress(1);
    }
  });

  media.add({
    desktop: '(min-width: 1001px)',
    mobile: '(max-width: 1000px)',
    reduced: window.JucaMotion?.reducedQuery || '(max-width: 0px)'
  }, context => {
    if (context.conditions.reduced) return staticHero();
    const desktop = context.conditions.desktop;
    const travel = desktop ? 42 : 25;
    const duration = desktop ? .95 : .78;

    function entrance(root, {start = 'top 87%', delay = 0} = {}) {
      // CSS hover transitions must not chase GSAP's per-frame transforms.
      const prepare = () => root.classList.add('is-scroll-animating');
      const settle = () => root.classList.remove('is-scroll-animating');
      prepare();
      const timeline = gsap.timeline({
        delay,
        defaults: {duration: .7, ease: 'power3.out'},
        onStart: prepare,
        onComplete: settle,
        onReverseComplete: settle,
        scrollTrigger: {
          trigger: root,
          start: `clamp(${start})`,
          end: 'clamp(bottom top)',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true,
          onLeaveBack: prepare
        }
      });
      entrances.set(root, timeline);
      return timeline;
    }

    // SplitText recalculates lines after fonts load and when the available width changes.
    function revealCopy(root) {
      const heading = root.querySelector('h2, h3');
      const eyebrow = root.querySelector('.eyebrow');
      const paragraphs = select(':scope > p:not(.eyebrow)', root);
      const buttons = select(':scope > .button', root);
      const tags = select('.tags > span', root);

      function animate(lines, split = false) {
        const timeline = entrance(root);
        if (eyebrow) timeline.from(eyebrow, {
          opacity: 0, y: 12, duration: .55, clearProps: 'transform,opacity'
        }, 0);
        if (lines.length) timeline.from(lines, {
          opacity: 0,
          ...(split ? {yPercent: 110} : {y: travel}),
          duration,
          stagger: {amount: Math.min((lines.length - 1) * .09, .28)},
          clearProps: 'transform,opacity'
        }, .08);
        if (paragraphs.length) timeline.from(paragraphs, {
          opacity: 0, y: travel * .65, stagger: .08,
          clearProps: 'transform,opacity'
        }, .32);
        if (buttons.length) timeline.from(buttons, {
          opacity: 0, y: 20, scale: .96, duration: .6, stagger: .09,
          clearProps: 'transform,opacity'
        }, .48);
        if (tags.length) timeline.from(tags, {
          opacity: 0, y: 13, duration: .5, stagger: {amount: .18},
          clearProps: 'transform,opacity'
        }, .3);
        return timeline;
      }

      if (heading && window.SplitText && heading.getClientRects().length) {
        const accessibleTitle = heading.innerText.replace(/\s+/g, ' ').trim();
        SplitText.create(heading, {
          type: 'lines', mask: 'lines', linesClass: 'motion-line',
          autoSplit: true, aria: 'auto',
          onSplit: self => {
            heading.setAttribute('aria-label', accessibleTitle);
            return animate(self.lines, true);
          }
        });
      } else {
        animate(heading ? [heading] : []);
      }
    }

    // The photograph is visible from the first frame. Only a real scroll reveals copy.
    const hero = gsap.timeline({
      defaults: {ease: 'power3.out', duration: .7},
      onStart: () => heroRoot.classList.add('is-hero-revealed', 'is-scroll-animating'),
      onComplete: () => heroRoot.classList.remove('is-scroll-animating'),
      onReverseComplete: () => heroRoot.classList.remove('is-hero-revealed', 'is-scroll-animating'),
      scrollTrigger: {
        start: 2,
        end: 'max',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => heroRoot.classList.add('is-scroll-animating')
      }
    });
    entrances.set(heroRoot, hero);
    hero.fromTo('.hero-shade', {opacity: 0}, {opacity: 1, duration: .85}, 0)
      .fromTo('.hero-eyebrow', {opacity: 0, y: 12}, {opacity: 1, y: 0, duration: .6}, .08)
      .fromTo('.hero h1 .line > span', {yPercent: 110, opacity: 0}, {
        yPercent: 0, opacity: 1, duration: 1, stagger: .12
      }, .18)
      .fromTo('.hero-description', {opacity: 0, y: 24}, {opacity: 1, y: 0}, .45)
      .fromTo('.hero-actions .button', {opacity: 0, y: 22, scale: .96}, {
        opacity: 1, y: 0, scale: 1, duration: .65, stagger: .1,
        clearProps: 'transform,opacity'
      }, .58)
      .fromTo('.hero-word', {yPercent: 55, opacity: 0}, {
        yPercent: 0, opacity: 1, duration: 1.1, stagger: .12
      }, .38)
      .fromTo('.scroll-cue', {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: .6}, .88);

    gsap.fromTo('.hero-photo img', {'--photo-scale': 1.02}, {
      '--photo-scale': 1.08, ease: 'none',
      scrollTrigger: {
        trigger: heroRoot,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (desktop ? .48 : .3))}`,
        pin: true, pinSpacing: true, scrub: .8, anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    select('.about-aside, .intro-copy, .banner-text, .services-intro, .faq > .reveal, .footer-statement')
      .forEach(revealCopy);

    // Each card has its own trigger so the same sequence works in a stacked mobile layout.
    select('.feature-card, .service-card').forEach(card => {
      const siblings = [...card.parentElement.children];
      const position = siblings.indexOf(card);
      const columns = card.matches('.feature-card') ? 3 : 2;
      const delay = desktop ? (position % columns) * .11 : 0;
      const timeline = entrance(card, {start: 'top 89%', delay});
      const photo = card.querySelector(':scope > img');
      const heading = card.querySelector('h3');
      const copy = select('.feature-bottom > :not(h3), :scope > p, .service-link, .doctor-caption > span, .doctor-caption > p', card);
      const arrow = card.querySelector('.round-arrow');

      timeline.from(card, {
        opacity: 0, y: desktop ? 64 : 34, scale: .97, duration: .9,
        clearProps: 'transform,opacity'
      }, 0);
      if (photo && !card.matches('.availability-card')) timeline.from(photo, {
        scale: 1.16, xPercent: desktop ? -3 : 0, duration: 1.3,
        clearProps: 'transform'
      }, 0);
      if (heading) timeline.from(heading, {
        opacity: 0, y: 24, duration: .75, clearProps: 'transform,opacity'
      }, .18);
      if (copy.length) timeline.from(copy, {
        opacity: 0, y: 19, duration: .65,
        stagger: {amount: Math.min((copy.length - 1) * .08, .24)},
        clearProps: 'transform,opacity'
      }, .34);
      if (arrow) timeline.from(arrow, {
        opacity: 0, scale: .55, rotation: -35, duration: .6,
        clearProps: 'transform,opacity'
      }, .38);
      const illustration = card.querySelector('.tooth-float');
      if (illustration) timeline.from(illustration, {
        opacity: 0, y: 35, scale: .82, rotation: 10, duration: 1.15,
        clearProps: 'transform,opacity'
      }, .12);
      const scannerFrame = card.querySelector('.scanner-focus-frame');
      if (scannerFrame) timeline.from(scannerFrame, {
        opacity: 0, scale: .94, duration: .8, clearProps: 'transform,opacity'
      }, .38);

      const metric = card.querySelector('[data-count]');
      if (metric) {
        const count = {value: 0};
        timeline.to(count, {
          value: Number(metric.dataset.count), duration: 1.5, ease: 'power2.out',
          onUpdate: () => { metric.textContent = Math.round(count.value); }
        }, .18);
      }
    });

    const bannerPhoto = document.querySelector('.banner-photo');
    entrance(bannerPhoto, {start: 'top 88%'})
      .from(bannerPhoto, {opacity: 0, x: desktop ? -45 : 0, y: desktop ? 0 : 30,
        duration: 1, clearProps: 'transform,opacity'}, 0)
      .from(bannerPhoto.querySelector('img'), {
        scale: 1.17, xPercent: -4, duration: 1.4, clearProps: 'transform'
      }, 0);

    // FAQ remains readable and interactive while the individual rows appear.
    select('.faq-item').forEach((item, index) => {
      entrance(item, {start: 'top 92%', delay: desktop ? (index % 3) * .06 : 0})
        .from(item, {opacity: 0, y: 24, duration: .65, clearProps: 'transform,opacity'}, 0)
        .from(item.querySelector('.faq-plus'), {
          scale: .5, rotation: -45, duration: .55, clearProps: 'transform'
        }, .14);
    });

    const footerTop = document.querySelector('.footer-top');
    entrance(footerTop).from(footerTop.children, {
      opacity: 0, y: 20, stagger: .1, clearProps: 'transform,opacity'
    });
    select('.address, .emergency-link').forEach((address, index) => {
      entrance(address, {start: 'top 92%', delay: desktop ? index * .08 : 0})
        .from(address, {opacity: 0, y: 24, clearProps: 'transform,opacity'});
    });
    const wordmark = document.querySelector('.footer-wordmark');
    entrance(wordmark, {start: 'top 97%'})
      .from(wordmark.querySelector('.footer-wordmark-shell'), {
        y: 24, opacity: 0, duration: 1.1,
        clearProps: 'transform,opacity'
      }, 0);
    const backTop = document.querySelector('.back-top');
    entrance(backTop, {start: 'top 99%'}).from(backTop, {
      opacity: 0, y: 12, duration: .6, clearProps: 'transform,opacity'
    });

    // Opposing foreground/background movement gives the scan card real depth.
    gsap.fromTo('.scanner-photo-plane', {yPercent: -4}, {
      yPercent: 4, ease: 'none',
      scrollTrigger: {trigger: '.scanner-card', start: 'top bottom', end: 'bottom top', scrub: 1.1}
    });
    gsap.fromTo('.tooth-depth', {yPercent: desktop ? 12 : 7, rotation: 8}, {
      yPercent: desktop ? -12 : -7, rotation: -8, ease: 'none',
      scrollTrigger: {trigger: '.scanner-card', start: 'top bottom', end: 'bottom top', scrub: .75}
    });
    gsap.fromTo('.scanner-beam', {y: -40}, {
      y: 50, ease: 'none',
      scrollTrigger: {trigger: '.scanner-card', start: 'top 90%', end: 'bottom 20%', scrub: .65}
    });
    if (desktop) {
      // Independent CSS transforms keep parallax separate from photo entrance and hover.
      select('.banner-photo > img, .comfort-card > img, .service-photo > img').forEach(photo => {
        gsap.set(photo, {'--photo-scale': 1.1});
        gsap.fromTo(photo, {'--photo-y': '-3%'}, {
          '--photo-y': '3%', ease: 'none',
          scrollTrigger: {
            trigger: photo.parentElement, start: 'top bottom', end: 'bottom top', scrub: .9
          }
        });
      });
    }

    return () => {
      entrances.clear();
      heroRoot.classList.remove('is-hero-revealed');
      select('.is-scroll-animating').forEach(root => root.classList.remove('is-scroll-animating'));
      select('[data-count]').forEach(metric => { metric.textContent = metric.dataset.count; });
    };
  });

  // Refresh after real content changes; ScrollTrigger already handles viewport resizing.
  let refreshFrame;
  function requestRefresh() {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
  }
  document.fonts?.ready.then(requestRefresh);
  select('img').filter(photo => !photo.complete).forEach(photo => {
    photo.addEventListener('load', requestRefresh, {once: true});
  });
  window.addEventListener('load', requestRefresh, {once: true});
  window.addEventListener('pageshow', requestRefresh);
})();
