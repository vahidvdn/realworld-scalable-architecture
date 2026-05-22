'use client';

import { use, useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();
  const { default: mermaid } = use(
    cachePromise('mermaid', () => import('mermaid')),
  );

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    fontFamily: 'inherit',
    themeCSS: 'margin: 1.5rem auto 0;',
    theme: resolvedTheme === 'dark' ? 'dark' : 'default',
  });

  const { svg, bindFunctions } = use(
    cachePromise(`${chart}-${resolvedTheme}`, () => {
      return mermaid.render(id, chart.replaceAll('\\n', '\n'));
    }),
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scope = container.closest('article') ?? document;
    const cleanups: Array<() => void> = [];

    const nodes = container.querySelectorAll<SVGGElement>(
      'g.node, g[class*="node"], g[data-id]',
    );

    nodes.forEach((node) => {
      const dataId = node.getAttribute('data-id');
      const fromId = node.id
        ? node.id.replace(/^flowchart-/, '').replace(/-\d+$/, '')
        : '';
      const rawId = dataId ?? fromId;

      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[Mermaid hover] node:', {
          id: node.id,
          dataId,
          fromId,
          rawId,
        });
      }

      if (!rawId) return;

      const target = scope.querySelector<HTMLElement>(
        `[data-mermaid-id~="${CSS.escape(rawId)}"]`,
      );
      if (!target) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.debug('[Mermaid hover] no target for', rawId);
        }
        return;
      }

      const onNodeEnter = () => target.classList.add('mermaid-link-active');
      const onNodeLeave = () => target.classList.remove('mermaid-link-active');
      const onTargetEnter = () => node.classList.add('mermaid-node-active');
      const onTargetLeave = () => node.classList.remove('mermaid-node-active');

      node.addEventListener('mouseenter', onNodeEnter);
      node.addEventListener('mouseleave', onNodeLeave);
      target.addEventListener('mouseenter', onTargetEnter);
      target.addEventListener('mouseleave', onTargetLeave);
      node.style.cursor = 'pointer';

      cleanups.push(() => {
        node.removeEventListener('mouseenter', onNodeEnter);
        node.removeEventListener('mouseleave', onNodeLeave);
        target.removeEventListener('mouseenter', onTargetEnter);
        target.removeEventListener('mouseleave', onTargetLeave);
        target.classList.remove('mermaid-link-active');
        node.classList.remove('mermaid-node-active');
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [svg]);

  return (
    <div
      ref={(container) => {
        containerRef.current = container;
        if (container) bindFunctions?.(container);
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
