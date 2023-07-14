export const _post_refresh_and_notify = (msg: string): void => {
  jpdb.onNextRefresh(() => jpdb.toaster.toast(msg, 'success'));
  post_and_refresh();
};
