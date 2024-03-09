export function blurFocus() {
  const tempDiv = document.createElement('div');
  tempDiv.tabIndex = -1;
  document.body.appendChild(tempDiv);
  tempDiv.focus();
  document.body.removeChild(tempDiv);
}
