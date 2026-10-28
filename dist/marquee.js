(() => {
  'use strict';
  const root = document.querySelector('.specialties-marquee');
  if (!root) return;
  const enhancedSupported = !!window.ResizeObserver && CSS.supports('transform-style', 'preserve-3d');

  // Adapted from the supplied TiltedGridHero: one animated tile, 16 static facets.
  const SLICES = 16;
  const CAMERA = 1.6;
  const BEND = 38 * Math.PI / 180;
  const ASPECT = 1.4;
  const GAP = .09;
  const SPEED = 4.6;
  const radiusRatio = (CAMERA - 1 + Math.cos(BEND)) / (2 * CAMERA * Math.sin(BEND));
  const viewport = root.querySelector('.marquee-viewport');
  const list = root.querySelector('.marquee-list');
  const status = root.querySelector('[role="status"]');
  const items = [...root.querySelectorAll('.marquee-list li')].map(item => ({
    id: item.dataset.specialty,
    name: item.querySelector('figcaption').textContent.trim(),
    src: item.querySelector('img').getAttribute('src')
  }));
  if (!items.length) return;

  const plane = document.createElement('div');
  plane.className = 'marquee-plane';
  plane.setAttribute('aria-hidden', 'true');
  const style = document.createElement('style');
  root.append(style);
  viewport.append(plane);

  const reduced = !!window.JucaMotion?.reduced;
  let hovered = false;
  let keyboardFocus = false;
  let inView = false;
  let preloaded = false;
  let imagesReady = false;
  const decodedImages = [];
  let lastSize = '';
  let resizeFrame;
  let tiles = [];
  let tileStates = [];
  let animations = [];
  let orbitDuration = 0;
  let navigation = null;
  let navigationFrame;
  let drag = null;
  let pixelsPerStep = 1;

  const canAnimate = () => enhancedSupported && !reduced;
  const wrap = (value, length) => ((value % length) + length) % length;
  function syncPause() {
    root.classList.toggle('is-paused', hovered || keyboardFocus || !!drag || !!navigation || !inView || document.hidden);
  }
  function applyImage(tile, index) {
    const item = items[wrap(index, items.length)];
    tile.dataset.specialty = item.id;
    // One inherited texture changes all facets atomically; no async <img> swaps.
    tile.style.setProperty('--marquee-image', `url("${item.src}")`);
    tile.querySelectorAll('.marquee-caption').forEach(caption => { caption.textContent = item.name; });
  }

  function syncImages() {
    tileStates.forEach(state => {
      // Reading the actual iteration also handles seeks backwards across a wrap.
      const lap = state.animation.effect.getComputedTiming().currentIteration || 0;
      const image = wrap(lap * tiles.length + state.first, items.length);
      if (image === state.image) return;
      state.image = image;
      applyImage(state.tile, image);
    });
  }
  function seek(time) {
    // Tile transforms and facet visibility must always share the same clock.
    animations.forEach(animation => { animation.currentTime = time; });
    syncImages();
  }
  function cancelNavigation() {
    cancelAnimationFrame(navigationFrame);
    navigation = null;
  }
  function stableTime() {
    const current = Number(tileStates[0].animation.currentTime) || 0;
    const cycle = orbitDuration * items.length;
    return cycle + wrap(current, cycle);
  }
  function announceCenter() {
    if (!tileStates.length) return;
    const center = tileStates.reduce((nearest, state) => {
      const distance = Math.abs((state.animation.effect.getComputedTiming().progress ?? 0) - .5);
      return distance < nearest.distance ? {state, distance} : nearest;
    }, {state: tileStates[0], distance: Infinity}).state;
    status.textContent = items[center.image].name;
  }
  function navigate(direction) {
    if (!root.classList.contains('is-enhanced') || !animations.length) {
      const card = list.querySelector('li');
      const distance = card.getBoundingClientRect().width + parseFloat(getComputedStyle(list).gap);
      list.scrollBy({left: direction * distance, behavior: reduced ? 'instant' : 'smooth'});
      return;
    }

    const current = Number(tileStates[0].animation.currentTime) || 0;
    // Rebase by a whole image cycle so repeatedly going back never reaches a
    // negative animation time. The rendered position and photographs stay equal.
    const from = navigation ? current : stableTime();
    const target = (navigation?.target ?? from) + direction * SPEED * 1000;
    cancelNavigation();
    navigation = {from, target, start: performance.now()};
    syncPause();
    animations = plane.getAnimations({subtree: true});
    seek(from);

    function step(now) {
      const progress = Math.min((now - navigation.start) / 560, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      seek(navigation.from + (navigation.target - navigation.from) * eased);
      if (progress < 1) navigationFrame = requestAnimationFrame(step);
      else {
        announceCenter();
        navigation = null;
        syncPause();
      }
    }
    navigationFrame = requestAnimationFrame(step);
  }

  const isPhoto = target => target instanceof Element
    && !!target.closest('.marquee-slice, .marquee-list figure')
    && viewport.contains(target);
  function syncHover(event) {
    if (event.pointerType !== 'mouse' || drag) return;
    hovered = isPhoto(event.target);
    syncPause();
  }
  function endDrag(event, cancelled = false) {
    if (!drag || (event && event.pointerId !== drag.id)) return;
    const ended = drag;
    drag = null;
    root.classList.remove('is-dragging');
    if (viewport.hasPointerCapture(ended.id)) viewport.releasePointerCapture(ended.id);
    hovered = !cancelled && event?.pointerType === 'mouse'
      && isPhoto(document.elementFromPoint(event.clientX, event.clientY));
    if (ended.moved && !cancelled) announceCenter();
    syncPause();
  }
  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || !isPhoto(event.target)) return;
    const enhanced = root.classList.contains('is-enhanced') && !!animations.length;
    // The fallback list keeps the browser's native touch scrolling.
    if (!enhanced && event.pointerType !== 'mouse') return;
    cancelNavigation();
    drag = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      time: enhanced ? stableTime() : 0,
      scroll: list.scrollLeft, enhanced, moved: false
    };
    if (event.pointerType === 'mouse') {
      event.preventDefault();
      viewport.focus({preventScroll: true});
    }
    keyboardFocus = false;
    root.classList.add('is-dragging');
    syncPause();
    viewport.setPointerCapture(event.pointerId);
    if (enhanced) {
      animations = plane.getAnimations({subtree: true});
      seek(drag.time);
    }
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag) { syncHover(event); return; }
    if (event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (event.pointerType !== 'mouse' && !drag.moved) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        endDrag(event, true);
        return;
      }
      if (Math.abs(dx) < 5) return;
    }
    drag.moved ||= Math.abs(dx) > 3;
    // Direct manipulation follows the pointer 1:1, without a snap or jump on release.
    if (drag.enhanced) seek(drag.time - dx / pixelsPerStep * SPEED * 1000);
    else list.scrollLeft = drag.scroll - dx;
  });
  viewport.addEventListener('pointerup', event => endDrag(event));
  viewport.addEventListener('pointercancel', event => endDrag(event, true));
  viewport.addEventListener('lostpointercapture', event => endDrag(event, true));
  viewport.addEventListener('dragstart', event => event.preventDefault());

  function prepareImages() {
    if (preloaded) return;
    preloaded = true;
    Promise.all(items.map(item => {
      const image = new Image();
      image.decoding = 'sync';
      image.src = item.src;
      // Retain decoded textures for subsequent wraps instead of decoding on entry.
      decodedImages.push(image);
      return image.decode().catch(() => {});
    })).then(() => {
      imagesReady = true;
      requestLayout();
    });
  }

  function layout(width, height) {
    if (!canAnimate() || !imagesReady || !width || !height) return;
    const size = `${Math.round(width)}:${Math.round(height)}`;
    if (size === lastSize && tiles.length) return;
    lastSize = size;
    cancelNavigation();
    endDrag(null, true);
    tileStates = [];

    const tileHeight = Math.min(height * .53, width * .55 / ASPECT);
    const tileWidth = tileHeight * ASPECT;
    const radius = width * radiusRatio;
    const degrees = angle => angle * 180 / Math.PI;
    const unit = degrees(tileHeight / radius);
    const pitch = (ASPECT + GAP) * unit;
    const limit = degrees(BEND) + ASPECT * unit / 2;
    const columns = Math.min(12, Math.max(2, Math.ceil(2 * limit / pitch)));
    const sweep = columns * pitch / 2;
    const duration = columns * SPEED;
    orbitDuration = duration * 1000;
    pixelsPerStep = tileHeight * (ASPECT + GAP);
    const turn = angle => `translateZ(${radius.toFixed(3)}px) rotateY(${angle.toFixed(4)}deg) translateZ(${-radius.toFixed(3)}px)`;

    viewport.style.setProperty('--marquee-tile-height', `${tileHeight}px`);
    viewport.style.setProperty('--marquee-tile-width', `${tileWidth}px`);
    viewport.style.setProperty('--marquee-camera', `${radius * CAMERA}px`);
    viewport.style.setProperty('--marquee-duration', `${duration}s`);
    // Cull each facet just beyond the masked viewport edge. Hiding whole tiles
    // leaves their outer facets crossing the camera's near plane on entry,
    // where Chromium can briefly rasterize huge white polygons.
    const facetAngle = ASPECT / SLICES * unit;
    const visibleArc = degrees(BEND) + facetAngle / 2 + 1;
    let keyframes = `@keyframes juca-marquee-orbit{from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}}`;
    for (let slice = 0; slice < SLICES; slice++) {
      const offset = (ASPECT / 2 - (slice + .5) * ASPECT / SLICES) * unit;
      const enter = Math.max(0, (sweep - visibleArc - offset) / (2 * sweep) * 100);
      const leave = Math.min(100, (sweep + visibleArc - offset) / (2 * sweep) * 100);
      keyframes += `@keyframes juca-marquee-facet-${slice}{0%,${enter}%,${leave}%,100%{visibility:hidden}${enter+.001}%,${leave-.001}%{visibility:visible}}`;
    }
    style.textContent = keyframes;

    const fragment = document.createDocumentFragment();
    tiles = Array.from({length: columns}, (_, index) => {
      const tile = document.createElement('div');
      tile.className = 'marquee-tile';
      tile.style.setProperty('--marquee-delay', `${-index * SPEED}s`);
      const share = tileWidth / SLICES;
      for (let slice = 0; slice < SLICES; slice++) {
        const strip = document.createElement('div');
        strip.className = 'marquee-slice';
        strip.style.left = `${(tileWidth - share) / 2}px`;
        strip.style.width = `${share + (slice === SLICES - 1 ? 0 : 1)}px`;
        strip.style.transform = turn((ASPECT / 2 - (slice + .5) * ASPECT / SLICES) * unit);
        strip.style.animationName = `juca-marquee-facet-${slice}`;
        if (!slice) strip.style.borderRadius = '14px 0 0 14px';
        if (slice === SLICES - 1) strip.style.borderRadius = '0 14px 14px 0';
        const content = document.createElement('div');
        content.className = 'marquee-content';
        content.style.left = `${-slice * share}px`;
        const caption = document.createElement('span');
        caption.className = 'marquee-caption';
        content.append(caption);
        strip.append(content);
        tile.append(strip);
      }
      const first = columns - 1 - index;
      applyImage(tile, first);
      tileStates.push({tile, first, image: first, animation: null});
      tile.addEventListener('animationiteration', event => {
        if (event.target !== tile) return;
        // All facets change together only while the tile is outside the frame.
        syncImages();
      });
      fragment.append(tile);
      return tile;
    });
    plane.replaceChildren(fragment);
    root.classList.add('is-enhanced', 'is-ready');
    animations = plane.getAnimations({subtree: true});
    tileStates.forEach(state => { state.animation = state.tile.getAnimations()[0]; });
    syncPause();
  }

  function requestLayout() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      const rect = viewport.getBoundingClientRect();
      layout(rect.width, rect.height);
    });
  }
  const observer = enhancedSupported ? new ResizeObserver(requestLayout) : null;
  observer?.observe(viewport);
  const visibility = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView && canAnimate()) prepareImages();
    syncPause();
  }, {rootMargin: '120px 0px'});
  visibility.observe(root);

  // Browser hit testing follows only the visible 3D facets, not the section's
  // title, the empty viewport padding, or the invisible faces behind the camera.
  viewport.addEventListener('pointerover', syncHover);
  viewport.addEventListener('pointerout', event => {
    if (event.pointerType !== 'mouse' || drag) return;
    hovered = isPhoto(event.relatedTarget);
    syncPause();
  });
  viewport.addEventListener('pointerleave', () => { hovered = false; syncPause(); });
  viewport.addEventListener('focusin', event => {
    keyboardFocus = event.target.matches(':focus-visible');
    syncPause();
  });
  viewport.addEventListener('focusout', event => {
    if (viewport.contains(event.relatedTarget)) return;
    keyboardFocus = false;
    syncPause();
  });
  viewport.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    if (drag) return;
    keyboardFocus = true;
    navigate(event.key === 'ArrowRight' ? 1 : -1);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) endDrag(null, true);
    syncPause();
  });
  requestLayout();
})();
