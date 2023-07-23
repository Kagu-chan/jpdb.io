((): void => {
  const USER_CSS: string = 'user-css';

  jpdb.settings.registerConfigurable({
    name: USER_CSS,
    category: 'UI',
    displayText: 'Allows adding own CSS definitions',
    description:
      'Allows you to add your own CSS definitions to change the look and feel of JPDB.io',
    children: [
      {
        key: 'styles',
        type: ModuleUserOptionFieldType.TEXTAREA,
        default: '',
      },
    ],
  });
})();
