/* BoltProof — scroll-reveal motion. No dependencies. Respects prefers-reduced-motion. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');

  var targets = document.querySelectorAll(
    '.card, .tile, .feature, .stat, .mock, .note, .hero-visual, .prose h2, .prose h3'
  );
  targets.forEach(function (el) { el.classList.add('reveal'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
      // release the reveal classes once done so native hover/lift transitions take over
      setTimeout(function () { entry.target.classList.remove('reveal', 'in'); }, 800);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();
