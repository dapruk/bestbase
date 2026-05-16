export interface AppImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  fallbackSrc?: string | undefined;
  src?: string | null | undefined;
}
