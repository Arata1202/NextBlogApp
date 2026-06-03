import { useEffect, type RefObject } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { CodeBlockToolbar, codeBlockStyles } from '@/components/Common/CodeBlock';

const ENHANCED_ATTRIBUTE = 'data-code-copy-enhanced';
const FILENAME_MOUNTED_ATTRIBUTE = 'data-code-filename-mounted';
const MOUNT_ATTRIBUTE = 'data-code-copy-button-mount';

type EnhancedCodeBlock = {
  mount: HTMLDivElement;
  pre: HTMLPreElement;
  root: Root;
};

export const useCodeBlockCopyButtons = (
  containerRef: RefObject<HTMLElement | null>,
  refreshKey?: unknown,
) => {
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const enhancedCodeBlocks: EnhancedCodeBlock[] = [];

    const updateWrapState = (pre: HTMLPreElement, wrapped: boolean) => {
      pre.classList.toggle(codeBlockStyles.wrapped, wrapped);
      pre.classList.toggle(codeBlockStyles.unwrapped, !wrapped);
    };

    const getFilename = (pre: HTMLPreElement) => {
      return (
        pre.getAttribute('data-filename') ??
        pre.parentElement?.getAttribute('data-filename') ??
        undefined
      );
    };

    const enhanceCodeBlock = (pre: HTMLPreElement) => {
      if (pre.getAttribute(ENHANCED_ATTRIBUTE) === 'true') {
        return;
      }

      const code = pre.querySelector<HTMLElement>('code');

      if (!code) {
        return;
      }

      const mount = document.createElement('div');
      const root = createRoot(mount);
      let wrapped = false;
      const filename = getFilename(pre);

      const renderControls = () => {
        root.render(
          <CodeBlockToolbar
            filename={filename}
            getCodeText={() => code.textContent ?? ''}
            wrapped={wrapped}
            onWrappedChange={(nextWrapped) => {
              wrapped = nextWrapped;
              updateWrapState(pre, wrapped);
              renderControls();
            }}
          />,
        );
      };

      mount.setAttribute(MOUNT_ATTRIBUTE, 'true');
      pre.setAttribute(ENHANCED_ATTRIBUTE, 'true');
      pre.parentElement?.toggleAttribute(FILENAME_MOUNTED_ATTRIBUTE, Boolean(filename));
      pre.classList.add(codeBlockStyles.codeBlock);
      updateWrapState(pre, wrapped);
      pre.insertBefore(mount, pre.firstChild);
      renderControls();
      enhancedCodeBlocks.push({ mount, pre, root });
    };

    const enhanceCodeBlocks = () => {
      container.querySelectorAll<HTMLPreElement>('pre').forEach(enhanceCodeBlock);
    };

    enhanceCodeBlocks();

    const observer = new MutationObserver(() => {
      enhanceCodeBlocks();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      enhancedCodeBlocks.forEach(({ mount, pre, root }) => {
        root.unmount();
        mount.remove();
        pre.removeAttribute(ENHANCED_ATTRIBUTE);
        pre.parentElement?.removeAttribute(FILENAME_MOUNTED_ATTRIBUTE);
        pre.classList.remove(
          codeBlockStyles.codeBlock,
          codeBlockStyles.wrapped,
          codeBlockStyles.unwrapped,
        );
      });
    };
  }, [containerRef, refreshKey]);
};
