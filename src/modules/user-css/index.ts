((): void => {
  const USER_CSS: string = 'user-css';

  jpdb.settings.moduleManager.register({
    name: USER_CSS,
    category: 'UI',
    displayText: 'Add own CSS definitions',
    description:
      'Allows you to add your own CSS definitions to change the look and feel of JPDB.io',
    options: [
      {
        key: 'styles',
        type: 'textarea',
        default: '',
        placeholder: 'CSS',
      },
    ],
  });

  jpdb.runAlwaysWhenActive(/.*/, USER_CSS, () =>
    jpdb.css.add(USER_CSS, jpdb.settings.persistence.getModuleOption(USER_CSS, 'styles')),
  );
})();
