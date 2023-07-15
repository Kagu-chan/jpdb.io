const STICKY_NAVBAR: string = 'sticky-navbar';
const STICKY_FOOTER: string = 'sticky-footer';

jpdb.settings.registerActivatable({
  name: STICKY_NAVBAR,
  displayText: 'Fix header navigation',
  description: 'Sticks the header navigation to the top of the page, thus making it always visible',
  author: 'JawGBoi',
});
jpdb.settings.registerActivatable({
  name: STICKY_FOOTER,
  displayText: 'Fix footer navigation',
  description:
    'Sticks the footer navigation to the bottom of the page, thus making it always visible',
});

jpdb.runOnceWhenActive(/^(?!\/review)/, STICKY_NAVBAR, () => {
  jpdb.css.add({
    key: STICKY_NAVBAR,
    css: `
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--deeper-background-color);
  box-shadow: 0 0 10px 2px var(--big-shadow-color);
  -webkit-box-shadow: 0 0 10px 2px var(--big-shadow-color);
}

body {
  padding-top: 80px;
}

.notifications {
  top: calc(80px + 2rem);
}
    `,
  });
});

jpdb.runOnceWhenActive(/^(?!\/(review|settings))/, STICKY_FOOTER, () => {
  jpdb.css.add({
    key: STICKY_FOOTER,
    css: `
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--deeper-background-color);
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

body {
  padding-bottom: 80px;
}
    `,
  });
});