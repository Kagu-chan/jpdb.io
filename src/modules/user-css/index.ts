((): void => {
  const USER_CSS: string = 'user-css';

  jpdb.settings.registerConfigurable({
    name: USER_CSS,
    category: 'UI',
    displayText: 'Allows adding own CSS definitions',
    children: [],
  });
})();
