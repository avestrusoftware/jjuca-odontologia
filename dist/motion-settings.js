(() => {
  'use strict';
  // The site's full choreography is the default, including on reduced-motion
  // browsers, as requested by the client. A quiet mode remains explicit by URL.
  const reduced = new URLSearchParams(location.search).get('motion') === 'reduced';
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  window.JucaMotion = Object.freeze({
    reduced,
    reducedQuery: reduced ? '(min-width: 0px)' : '(max-width: 0px)'
  });
})();
