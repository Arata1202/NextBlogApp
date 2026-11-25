export const copyCodeText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      if (!document.execCommand) throw error;
    }
  }

  const previousFocus = document.activeElement;
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.top = '-1000px';
  textArea.style.left = '-1000px';

  document.body.appendChild(textArea);
  try {
    textArea.select();
    if (!document.execCommand('copy')) {
      throw new Error('Failed to copy code.');
    }
  } finally {
    textArea.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  }
};
