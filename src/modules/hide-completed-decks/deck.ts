export class Deck {
  private _title: string;
  private _newCards: HTMLDivElement;
  private _body: HTMLDivElement;
  private _vocab: HTMLDivElement;
  private _kanji: HTMLDivElement;
  private _progress: HTMLDivElement;
  private _coverage: HTMLDivElement;

  private _done: number;
  private _total: number;
  private _donePercent: number;
  private _seenPercent: number;

  private _kanjiDone: number = 0;
  private _kanjiTotal: number = 0;
  private _kanjiDonePercent: number = 0;
  private _kanjiSeenPercent: number = 0;

  private _covPercent: number = 0;
  private _recPercent: number = 0;
  private _targetCov: number = 0;

  //#region Getters
  public get deckNode(): HTMLDivElement {
    return this._deckNode;
  }

  public get classList(): DOMTokenList {
    return this._deckNode.classList;
  }

  public get title(): string {
    return this._title;
  }

  public get done(): number {
    return this._done;
  }

  public get total(): number {
    return this._total;
  }

  public get donePercent(): number {
    return this._donePercent;
  }

  public get seenPercent(): number {
    return this._seenPercent;
  }

  public get kanjiDone(): number {
    return this._kanjiDone;
  }

  public get kanjiTotal(): number {
    return this._kanjiTotal;
  }

  public get kanjiDonePercent(): number {
    return this._kanjiDonePercent;
  }

  public get kanjiSeenPercent(): number {
    return this._kanjiSeenPercent;
  }

  public get covPercent(): number {
    return this._covPercent;
  }

  public get recPercent(): number {
    return this._recPercent;
  }

  public get targetCov(): number {
    return this._targetCov;
  }

  public get completed(): boolean {
    return this._seenPercent >= 100;
  }

  public get coverageReached(): boolean {
    return this._coverage && this._recPercent >= this._targetCov;
  }

  public get hasNewCards(): boolean {
    return !!this._newCards;
  }
  //#endregion

  constructor(private _deckNode: HTMLDivElement) {
    this._title = document.jpdb.findElement(this._deckNode, '.deck-title a')?.innerText;
    this._body = document.jpdb.findElement<'div'>(this._deckNode, '.deck-body div');
    this._newCards = document.jpdb.findElement<'div'>(this._deckNode, '.deck-title .tooltip');

    [this._vocab, this._kanji] = this.childs(this._body);
    [this._progress, this._coverage] = this.childs(this._vocab);

    this.parseVocab();
    this.parseCov();
    this.parseKanji();
  }

  private parseVocab(): void {
    const [title, content] = this.childs(this._progress);
    const [, textContent] = this.childs(title);

    [this._done, this._total] = textContent.innerText
      .replace(/\&nbsp;/g, '')
      .split('/')
      .map((e) => Number(e.trim()));

    const [, second, third] = this.childs(content);
    const text = (
      second.childNodes.length ? this.childs(second) : this.childs(third)
    )[0]?.innerText?.replace(/\&nbsp;/g, '');

    const [done, seen] = Array.from(text.matchAll(/(\d+)%/g)).map(([, e]) => Number(e));
    this._donePercent = done;
    this._seenPercent = seen ?? done;
  }

  private parseCov(): void {
    if (!this._coverage) return;

    const [, content] = this.childs(this._coverage);

    const [, second, third] = this.childs(content);
    const text = (
      second.childNodes.length ? this.childs(second) : this.childs(third)
    )[0]?.innerText?.replace(/\&nbsp;/g, '');

    const [done, seen] = Array.from(text.matchAll(/(\d+)%/g)).map(([, e]) => Number(e));
    this._covPercent = done;
    this._recPercent = seen ?? done;

    const targetCoverageNode = document.jpdb.findElement(this._coverage, 'div[style*="target"]');
    this._targetCov = Number(targetCoverageNode?.style.left?.replace(/[^\d]+/g, '') ?? 0);
  }

  private parseKanji(): void {
    if (!this._kanji) return;

    const [title, content] = this.childs(this._kanji);
    const [, textContent] = this.childs(title);

    [this._kanjiDone, this._kanjiTotal] = textContent.innerText
      .replace(/\&nbsp;/g, '')
      .split('/')
      .map((e) => Number(e.trim()));

    const [, second, third] = this.childs(content);
    const text = (
      second.childNodes.length ? this.childs(second) : this.childs(third)
    )[0]?.innerText?.replace(/\&nbsp;/g, '');

    const [done, seen] = Array.from(text.matchAll(/(\d+)%/g)).map(([, e]) => Number(e));
    this._kanjiDonePercent = done;
    this._kanjiSeenPercent = seen ?? done;
  }

  private childs<T extends HTMLElement = HTMLDivElement>(e: HTMLDivElement): T[] {
    return Array.from(e?.childNodes ?? []) as T[];
  }
}
