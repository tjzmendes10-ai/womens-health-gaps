// Builds internal links that work under the /womens-health-gaps/ sub-path
// GitHub Pages uses. Always link with url('/history/'), never '/history/'.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const url = (path: string) => `${base}/${path.replace(/^\//, '')}`;
