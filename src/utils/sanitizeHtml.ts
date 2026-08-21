const ALLOWED_TAGS = new Set([
  'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'UL', 'OL', 'LI', 'A', 'SPAN',
]);

const ALLOWED_ATTRS = new Set(['href', 'target', 'rel']);

const isSafeHref = (href: string) => {
  const value = href.trim().toLowerCase();
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('mailto:') ||
    value.startsWith('/') ||
    value.startsWith('#')
  );
};

/**
 * Sanitasi HTML sederhana tanpa dependensi eksternal.
 * Hanya mengizinkan tag formatting dasar + tautan aman.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') return '';

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return '';

  const walk = (node: Element) => {
    Array.from(node.children).forEach((child) => {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        const text = doc.createTextNode(child.textContent || '');
        child.replaceWith(text);
        return;
      }

      Array.from(child.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (!ALLOWED_ATTRS.has(name) || name.startsWith('on')) {
          child.removeAttribute(attr.name);
        }
      });

      if (child.tagName === 'A') {
        const href = child.getAttribute('href') || '';
        if (!isSafeHref(href)) {
          child.removeAttribute('href');
        } else {
          child.setAttribute('target', '_blank');
          child.setAttribute('rel', 'noopener noreferrer nofollow');
        }
      }

      walk(child);
    });
  };

  walk(root);
  return root.innerHTML;
};

export default sanitizeHtml;
