class WidenViewport {
  private WIDEN_VIEWPORT = 'widen-viewport';

  constructor() {
    jpdb.onDesktop(() => {
      this.register();

      this.addEventListeners();
    });
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.WIDEN_VIEWPORT,
      category: 'UI',
      displayText: 'Widen viewport',
      description: 'Widens the viewport of the main frame, making the page wider on bigger screens',
      author: 'JawGBoi',
    });
  }

  private addEventListeners(): void {
    jpdb.runOnceOnEnable(/.*/, this.WIDEN_VIEWPORT, () => {
      jpdb.css.add({
        key: this.WIDEN_VIEWPORT,
        css: __load_css('./src/modules/widen-viewport/viewport.css'),
      });
    });

    jpdb.runOnceOnDisable(/.*/, this.WIDEN_VIEWPORT, () => jpdb.css.remove(this.WIDEN_VIEWPORT));
  }
}

new WidenViewport();
