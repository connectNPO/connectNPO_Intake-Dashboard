/** Format an ISO timestamp as a short, friendly date. Returns '—' if empty. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Render a stored answer value as readable text. */
export function formatAnswer(answer: unknown): string {
  if (answer === null || answer === undefined || answer === '') return '—';
  if (Array.isArray(answer)) return answer.join(', ');
  if (typeof answer === 'boolean') return answer ? 'Yes' : 'No';
  return String(answer);
}
