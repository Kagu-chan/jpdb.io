const STICKY_NAVBAR: string = 'sticky-navbar';

jpdb.settings.registerActivatable({
  name: STICKY_NAVBAR,
  displayText: 'Stick navigation',
  description: 'Sticks the navigation to the top of the page, thus making it always visible',
  author: 'JawGBoi',
});

jpdb.runOnceWhenActive(/.*/, STICKY_NAVBAR, () => {
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
  box-shadow: 0 4px 2px 0px var(--big-shadow-color);
}

body {
  padding-top: 70px;
}

.notifications {
  top: calc(70px + 2rem);
}
    `,
  });
});
