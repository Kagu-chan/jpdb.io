jpdb.onDesktop(() => {
  const WIDEN_VIEWPORT = 'widen-viewport';

  jpdb.settings.registerActivatable({
    name: WIDEN_VIEWPORT,
    displayText: 'Widen viewport',
    description: 'Widens the viewport of the main frame, making the page wider on bigger screens',
    author: 'JawGBoi',
  });

  jpdb.runAlwaysWhenActive(/.*/, WIDEN_VIEWPORT, () => {
    jpdb.css.add({
      key: WIDEN_VIEWPORT,
      css: `body, .container.bugfix, .review-reveal, .review-hidden, .text-content {
    max-width: 73rem !important;
}`,
    });
  });
});
