class WidenViewport {
  private WIDEN_VIEWPORT = 'widen-viewport';
  private DEFAULT_FIX_WIDTH: string = '73rem';

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
      options: [
        {
          type: 'text',
          key: 'fixWidth',
          text: 'Which width to fix the main frame to',
          default: this.DEFAULT_FIX_WIDTH,
        },
      ],
    });
  }

  private addEventListeners(): void {
    jpdb.runOnceOnEnable(/.*/, this.WIDEN_VIEWPORT, () => {
      this.addCss();

      jpdb.on('update-widen-viewport-fixWidth', () => {
        jpdb.css.remove(this.WIDEN_VIEWPORT);
        this.addCss();
      });
    });

    jpdb.runOnceOnDisable(/.*/, this.WIDEN_VIEWPORT, () => {
      jpdb.css.remove(this.WIDEN_VIEWPORT);
      jpdb.clearEvents('update-widen-viewport-fixWidth');
    });
  }

  private addCss(): void {
    const value = jpdb.settings.persistence.getModuleOption<string>(
      this.WIDEN_VIEWPORT,
      'fixWidth',
    );
    const css = `body, .container.bugfix, .review-reveal, .review-hidden, .text-content {
      max-width: ${value} !important;
    }`;

    jpdb.css.add({
      key: this.WIDEN_VIEWPORT,
      css,
    });
  }
}

new WidenViewport();
