import { CSSManager } from '../css/css-manager';

type ToastTypes = 'default' | 'error' | 'gray' | 'warning' | 'success';

export class Toaster {
  private TYPE_MAP: Record<ToastTypes, string> = {
    default: 'v0',
    error: 'v1',
    gray: 'v2',
    warning: 'v3',
    success: 'v4',
  };
  private _notifications;

  constructor(private _css: CSSManager) {
    this._css.add({
      key: Toaster.name,
      css: __load_css('./src/lib/toaster/toaster.css'),
    });
    this._notifications = document.jpdb.appendElement('body', {
      tag: 'ul',
      class: ['notifications'],
    });
  }

  public toast(message: string, type: ToastTypes): void {
    const toast = document.jpdb.appendElement(this._notifications, {
      tag: 'li',
      class: ['toast', 'outline', this.TYPE_MAP[type]],
      handler: () => toast.classList.add('hide'),
      children: [
        {
          tag: 'div',
          class: ['column'],
          children: [
            {
              tag: 'span',
              innerHTML: message,
            },
          ],
        },
      ],
    });

    let timeout: NodeJS.Timeout;
    const startTimeout = (t: number = 5000): void => {
      if (timeout) return;
      timeout = setTimeout(() => {
        toast.classList.add('hide');
        stopTimeout();
        setTimeout(() => toast.remove(), 500);
      }, t);
    };
    const stopTimeout = (): void => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
    };

    startTimeout();
    toast.addEventListener('mouseover', () => stopTimeout());
    toast.addEventListener('mouseout', () => startTimeout(500));
  }
}
