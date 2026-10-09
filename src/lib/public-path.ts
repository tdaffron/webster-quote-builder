/** Prefix a public file for GitHub Pages project sites. Empty when BASE_PATH is unset. */
export function publicPath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
