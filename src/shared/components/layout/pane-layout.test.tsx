import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PaneLayout } from './pane-layout';

describe('PaneLayout', () => {
  it('renders responsive panes with a CSS gap value', () => {
    const markup = renderToStaticMarkup(
      <PaneLayout gap={24}>
        <PaneLayout.Pane>Left</PaneLayout.Pane>
        <PaneLayout.Pane>Right</PaneLayout.Pane>
      </PaneLayout>
    );

    expect(markup).toContain('flex-col md:flex-row');
    expect(markup).toContain('gap:24px');
    expect(markup).toContain('Left');
    expect(markup).toContain('Right');
  });

  it('supports percentage pane sizes without dynamic Tailwind classes', () => {
    const markup = renderToStaticMarkup(
      <PaneLayout>
        <PaneLayout.Pane size={35}>Sidebar</PaneLayout.Pane>
        <PaneLayout.Pane>Main</PaneLayout.Pane>
      </PaneLayout>
    );

    expect(markup).toContain('flex-basis:35%');
    expect(markup).toContain('Sidebar');
  });

  it('supports explicit Tailwind size classes', () => {
    const markup = renderToStaticMarkup(
      <PaneLayout stackAt="never">
        <PaneLayout.Pane size="basis-1/3">Sidebar</PaneLayout.Pane>
        <PaneLayout.Pane>Main</PaneLayout.Pane>
      </PaneLayout>
    );

    expect(markup).toContain('flex-row');
    expect(markup).toContain('basis-1/3');
  });
});
