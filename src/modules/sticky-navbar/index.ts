const STICKY_NAVBAR: string = 'sticky-navbar';
const STICKY_FOOTER: string = 'sticky-footer';

jpdb.settings.registerActivatable({
  name: STICKY_NAVBAR,
  category: 'Navigation',
  displayText: 'Fix header navigation',
  description: 'Sticks the header navigation to the top of the page, thus making it always visible',
  author: 'JawGBoi',
});
jpdb.settings.registerActivatable({
  name: STICKY_FOOTER,
  category: 'Navigation',
  displayText: 'Fix footer navigation',
  description:
    'Sticks the footer navigation to the bottom of the page, thus making it always visible',
});

jpdb.runOnceWhenActive(/^(?!\/review)/, STICKY_NAVBAR, () => {
  const navEl = document.jpdb.adjacentElement('body', 'afterbegin', {
    tag: 'div',
    style: {},
  });

  jpdb.css.add({
    key: STICKY_NAVBAR,
    css: `
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--background-color);
  box-shadow: 0 0 10px 2px var(--big-shadow-color);
  -webkit-box-shadow: 0 0 10px 2px var(--big-shadow-color);
}

.notifications {
  top: calc(80px + 2rem);
}
    `,
  });

  const updatePadding = (): string =>
    (navEl.style.paddingTop = `${document.jpdb.findElement('.nav').offsetHeight}px`);

  window.addEventListener('resize', updatePadding);
  updatePadding();
});

jpdb.runOnceWhenActive(/\/(review|settings)/, STICKY_FOOTER, () => {
  jpdb.css.add({
    key: STICKY_FOOTER,
    css: `
#save-all-settings-box,
.review-button-group {
  border-top: 0;
  box-shadow: 0 0 10px 2px var(--big-shadow-color);
  -webkit-box-shadow: 0 0 10px 2px var(--big-shadow-color);
}
    `,
  });
});
jpdb.runOnceWhenActive(/^(?!\/(review|settings))/, STICKY_FOOTER, () => {
  const footerEl = document.jpdb.adjacentElement('body', 'beforeend', {
    tag: 'div',
    style: {},
  });

  jpdb.css.add({
    key: STICKY_FOOTER,
    css: `
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--background-color);
  box-shadow: 0 0 10px 2px var(--big-shadow-color);
  -webkit-box-shadow: 0 0 10px 2px var(--big-shadow-color);

  display: flex;
  flex-wrap: wrap;
  padding: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.75rem;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
}
    `,
  });

  const updatePadding = (): string =>
    (footerEl.style.paddingBottom = `${document.jpdb.findElement('.footer').offsetHeight}px`);

  window.addEventListener('resize', updatePadding);
  updatePadding();
});
