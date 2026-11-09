/**
 * Converts any title string into an SEO-friendly URL slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Formats ISO dates into Indian readable date format (e.g., 14 November 2026)
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Checks whether the configured phone number is a real dialable number vs a placeholder
 */
export function isDialablePhone(phone: string | undefined): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && !phone.toLowerCase().includes('pending') && !phone.includes('[');
}
