import { useMemo, useState } from 'react';

import { completeImageUrl } from '@/shared/utils/image-url';

import type { AppImageProps } from './app-image.types';

export function AppImage({
  alt,
  decoding = 'async',
  fallbackSrc,
  loading = 'lazy',
  onError,
  src,
  ...props
}: AppImageProps) {
  const resolvedFallback = useMemo(
    () => completeImageUrl(null, { fallbackImageUrl: fallbackSrc }),
    [fallbackSrc]
  );
  const resolvedSrc = useMemo(
    () => completeImageUrl(src, { fallbackImageUrl: resolvedFallback }),
    [resolvedFallback, src]
  );
  return (
    <AppImageElement
      key={resolvedSrc}
      alt={alt}
      decoding={decoding}
      fallbackSrc={resolvedFallback}
      loading={loading}
      onError={onError}
      src={resolvedSrc}
      {...props}
    />
  );
}

interface AppImageElementProps
  extends Omit<AppImageProps, 'fallbackSrc' | 'src'> {
  fallbackSrc: string;
  src: string;
}

function AppImageElement({
  fallbackSrc,
  onError,
  src,
  ...props
}: AppImageElementProps) {
  const [failed, setFailed] = useState(false);
  const currentSrc = failed ? fallbackSrc : src;
  return (
    <img
      src={currentSrc}
      onError={(event) => {
        if (!failed) setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}
