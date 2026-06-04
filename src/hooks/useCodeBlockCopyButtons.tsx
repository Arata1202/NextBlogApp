import { useEffect, type RefObject } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { CodeBlockToolbar, codeBlockStyles } from '@/components/Common/CodeBlock';

const ENHANCED_ATTRIBUTE = 'data-code-copy-enhanced';
const FILENAME_MOUNTED_ATTRIBUTE = 'data-code-filename-mounted';
const MOUNT_ATTRIBUTE = 'data-code-copy-button-mount';
const WRAPPER_ATTRIBUTE = 'data-code-copy-wrapper';

type EnhancedCodeBlock = {
  filenameContainer: HTMLElement | null;
  mount: HTMLDivElement;
  pre: HTMLPreElement;
  root: Root;
  wrapper: HTMLDivElement;
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

    const getFilenameContainer = (pre: HTMLPreElement) => {
      if (pre.hasAttribute('data-filename')) {
        return pre;
      }

      return pre.parentElement?.hasAttribute('data-filename') ? pre.parentElement : null;
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
      const parent = pre.parentElement;

      if (!parent) {
        return;
      }

      const root = createRoot(mount);
      let wrapped = false;
      const filename = getFilename(pre);
      const filenameContainer = getFilenameContainer(pre);
      const wrapper = document.createElement('div');

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
      wrapper.setAttribute(WRAPPER_ATTRIBUTE, 'true');
      wrapper.classList.add(codeBlockStyles.codeBlockFrame);
      pre.setAttribute(ENHANCED_ATTRIBUTE, 'true');
      filenameContainer?.toggleAttribute(FILENAME_MOUNTED_ATTRIBUTE, Boolean(filename));
      pre.classList.add(codeBlockStyles.codeBlock);
      updateWrapState(pre, wrapped);
      parent.insertBefore(wrapper, pre);
      wrapper.appendChild(mount);
      wrapper.appendChild(pre);
      renderControls();
      enhancedCodeBlocks.push({ filenameContainer, mount, pre, root, wrapper });
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
      enhancedCodeBlocks.forEach(({ filenameContainer, mount, pre, root, wrapper }) => {
        root.unmount();
        mount.remove();
        wrapper.parentElement?.insertBefore(pre, wrapper);
        wrapper.remove();
        pre.removeAttribute(ENHANCED_ATTRIBUTE);
        filenameContainer?.removeAttribute(FILENAME_MOUNTED_ATTRIBUTE);
        pre.classList.remove(
          codeBlockStyles.codeBlock,
          codeBlockStyles.wrapped,
          codeBlockStyles.unwrapped,
        );
      });
    };
  }, [containerRef, refreshKey]);
};
