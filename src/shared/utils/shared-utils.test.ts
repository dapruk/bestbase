import { describe, expect, it } from 'vitest';

import {
  createInitialTableState,
  resetTablePage,
  toApiPaginationParams,
  toApiSortingParams,
} from '@/shared/components/data-display/bbase-data-table';

import {
  buildQuery,
  compactArray,
  completeImageUrl,
  formatCurrency,
  formatDate,
  formatFileSize,
  formatNumber,
  getErrorMessage,
  isMobileViewport,
  joinUrl,
  omitEmptyValues,
  truncateText,
  uniqueBy,
} from '.';

describe('shared utilities', () => {
  it('joins urls safely', () => {
    expect(joinUrl('https://api.example.com/', '/products')).toBe(
      'https://api.example.com/products'
    );
  });

  it('builds query strings and keeps falsey values', () => {
    expect(buildQuery({ a: 'x', b: undefined, c: '', d: false, e: 0 })).toBe(
      '?a=x&d=false&e=0'
    );
    expect(buildQuery({ tag: ['a', 'b'] })).toBe('?tag=a&tag=b');
  });

  it('completes image urls', () => {
    expect(
      completeImageUrl('/uploads/product.png', {
        baseUrl: 'https://cdn.example.com',
      })
    ).toBe('https://cdn.example.com/uploads/product.png');
    expect(completeImageUrl('https://cdn.example.com/product.png')).toBe(
      'https://cdn.example.com/product.png'
    );
    expect(completeImageUrl(null, { fallbackImageUrl: '/fallback.png' })).toBe(
      '/fallback.png'
    );
  });

  it('formats currency and numbers', () => {
    expect(formatCurrency(1000)).toContain('1.000');
    expect(formatCurrency('bad')).toBe('-');
    expect(formatNumber(1000)).toBe('1.000');
  });

  it('formats dates with fallback', () => {
    expect(formatDate('2026-05-16T10:00:00Z')).toContain('2026');
    expect(formatDate('not-a-date')).toBe('-');
  });

  it('formats file sizes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(Number.NaN)).toBe('-');
  });

  it('checks mobile viewport width', () => {
    expect(isMobileViewport(767, 768)).toBe(true);
    expect(isMobileViewport(768, 768)).toBe(false);
  });

  it('gets error messages', () => {
    expect(getErrorMessage(new Error('Boom'))).toBe('Boom');
    expect(getErrorMessage({ data: { message: 'API failed' } })).toBe(
      'API failed'
    );
  });

  it('handles string, array, and object helpers', () => {
    expect(truncateText('abcdef', 5)).toBe('ab...');
    expect(uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], (item) => item.id))
      .toHaveLength(2);
    expect(compactArray([1, null, 2, false])).toEqual([1, 2]);
    expect(omitEmptyValues({ a: '', b: 0, c: false, d: null })).toEqual({
      b: 0,
      c: false,
    });
  });

  it('maps table helper state', () => {
    const state = createInitialTableState({
      pagination: { pageIndex: 2, pageSize: 20 },
      sorting: [{ id: 'name', desc: true }],
    });

    expect(toApiPaginationParams(state.pagination)).toEqual({
      page: 3,
      limit: 20,
    });
    expect(toApiSortingParams(state.sorting)).toEqual({
      sort: 'name',
      order: 'desc',
    });
    expect(resetTablePage(state).pagination.pageIndex).toBe(0);
  });
});
