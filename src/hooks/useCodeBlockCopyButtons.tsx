import { useEffect, type RefObject } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { CodeBlockToolbar, codeBlockStyles } from '@/components/Common/CodeBlock';

const ENHANCED_ATTRIBUTE = 'data-code-copy-enhanced';
const FILENAME_MOUNTED_ATTRIBUTE = 'data-code-filename-mounted';
const MOUNT_ATTRIBUTE = 'data-code-copy-button-mount';
const WRAPPER_ATTRIBUTE = 'data-code-copy-wrapper';

type EnhancedCodeBlock = {
  addedAriaLabel: boolean;
  addedRole: boolean;
  addedTabIndex: boolean;
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
      const filenameContainer = getFilenameContainer(pre);
      const filename = filenameContainer?.dataset.filename;
      const wrapper = document.createElement('div');
      const addedAriaLabel = !pre.hasAttribute('aria-label');
      const addedRole = !pre.hasAttribute('role');
      const addedTabIndex = !pre.hasAttribute('tabindex');

      const renderControls = () => {
        root.render(
          <CodeBlockToolbar
            filename={filename}
            getCodeText={() => pre.querySelector('code')?.textContent ?? ''}
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
      if (addedAriaLabel) {
        pre.setAttribute('aria-label', filename ? `コードブロック: ${filename}` : 'コードブロック');
      }
      if (addedRole) {
        pre.setAttribute('role', 'region');
      }
      if (addedTabIndex) {
        pre.tabIndex = 0;
      }
      filenameContainer?.toggleAttribute(FILENAME_MOUNTED_ATTRIBUTE, Boolean(filename));
      pre.classList.add(codeBlockStyles.codeBlock);
      updateWrapState(pre, wrapped);
      parent.insertBefore(wrapper, pre);
      wrapper.appendChild(mount);
      wrapper.appendChild(pre);
      renderControls();
      enhancedCodeBlocks.push({
        addedAriaLabel,
        addedRole,
        addedTabIndex,
        filenameContainer,
        mount,
        pre,
        root,
        wrapper,
      });
    };

    const release = ({
      addedAriaLabel,
      addedRole,
      addedTabIndex,
      filenameContainer,
      mount,
      pre,
      root,
      wrapper,
    }: EnhancedCodeBlock) => {
      queueMicrotask(() => {
        root.unmount();
        mount.remove();
      });
      if (pre.parentElement === wrapper) wrapper.parentElement?.insertBefore(pre, wrapper);
      wrapper.remove();
      pre.removeAttribute(ENHANCED_ATTRIBUTE);
      if (addedAriaLabel) {
        pre.removeAttribute('aria-label');
      }
      if (addedRole) {
        pre.removeAttribute('role');
      }
      if (addedTabIndex) {
        pre.removeAttribute('tabindex');
      }
      filenameContainer?.removeAttribute(FILENAME_MOUNTED_ATTRIBUTE);
      pre.classList.remove(
        codeBlockStyles.codeBlock,
        codeBlockStyles.wrapped,
        codeBlockStyles.unwrapped,
      );
    };
    container.querySelectorAll<HTMLPreElement>('pre').forEach(enhanceCodeBlock);

    const observer = new MutationObserver((changes) => {
      if (changes.some((change) => change.removedNodes.length > 0)) {
        for (let i = enhancedCodeBlocks.length - 1; i >= 0; i--) {
          const block = enhancedCodeBlocks[i];
          if (!container.contains(block.wrapper) || block.pre.parentElement !== block.wrapper) {
            release(block);
            enhancedCodeBlocks.splice(i, 1);
          }
        }
      }
      for (const { addedNodes } of changes) {
        for (const node of addedNodes) {
          if (!(node instanceof HTMLElement) || !container.contains(node)) continue;
          const parentPre = node.closest('pre');
          if (parentPre) enhanceCodeBlock(parentPre);
          node.querySelectorAll('pre').forEach(enhanceCodeBlock);
        }
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      enhancedCodeBlocks.forEach(release);
    };
  }, [containerRef, refreshKey]);
};
