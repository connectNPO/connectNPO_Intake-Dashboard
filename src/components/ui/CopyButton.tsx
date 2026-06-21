'use client';

import { useState } from 'react';
import { Button } from './Button';

export function CopyButton({
  value,
  label = 'Copy link',
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (e.g. insecure context); fail quietly.
    }
  }

  return (
    <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
      {copied ? 'Copied!' : label}
    </Button>
  );
}
