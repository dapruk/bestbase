import { Search } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { BaseButton } from './base-button';

describe('BaseButton', () => {
  it('renders loading text and disables the button while loading', () => {
    const markup = renderToStaticMarkup(
      <BaseButton loading loadingText="Saving">
        Save
      </BaseButton>
    );

    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('Saving');
    expect(markup).not.toContain('>Save<');
  });

  it('keeps shadcn button variants and supports full width', () => {
    const markup = renderToStaticMarkup(
      <BaseButton fullWidth variant="outline">
        Save
      </BaseButton>
    );

    expect(markup).toContain('data-variant="outline"');
    expect(markup).toContain('w-full');
  });

  it('supports BestBase variants on top of shadcn button variants', () => {
    const markup = renderToStaticMarkup(
      <BaseButton variant="soft">Save</BaseButton>
    );

    expect(markup).toContain('data-variant="secondary"');
    expect(markup).toContain('bg-muted');
  });

  it('renders provided icons when not loading', () => {
    const markup = renderToStaticMarkup(
      <BaseButton leftIcon={<Search />} rightIcon={<Search />}>
        Search
      </BaseButton>
    );

    expect(markup).toContain('data-icon="inline-start"');
    expect(markup).toContain('data-icon="inline-end"');
    expect(markup).toContain('Search');
  });
});
