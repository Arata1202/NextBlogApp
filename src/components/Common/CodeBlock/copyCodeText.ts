export const copyCodeText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.top = '-1000px';
  textArea.style.left = '-1000px';

  document.body.appendChild(textArea);
  textArea.select();

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Failed to copy code.');
    }
  } finally {
    document.body.removeChild(textArea);
  }
};
