class WidenViewport {
  constructor() {
    jpdb.settings.renameModuleSetting('widen-viewport', WidenViewport.name);

    jpdb.onDesktop(() => {
      this.register();

      this.addEventListeners();
    });
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: WidenViewport.name,
      category: 'UI',
      displayText: 'Widen viewport',
      description: 'Widens the viewport of the main frame, making the page wider on bigger screens',
      author: 'JawGBoi',
    });
  }

  private addEventListeners(): void {
    jpdb.runOnceOnEnable(/.*/, WidenViewport.name, () => {
      jpdb.css.add({
        key: WidenViewport.name,
        css: __load_css('./src/modules/widen-viewport/viewport.css'),
      });
    });

    jpdb.runOnceOnDisable(/.*/, WidenViewport.name, () => jpdb.css.remove(WidenViewport.name));
  }
}

new WidenViewport();
