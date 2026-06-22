'use client';

import Script from 'next/script';
import { useRef } from 'react';

type Props = {
  siteKey: string;
};

/**
 * Renders the Cloudflare Turnstile widget. The widget injects a hidden input
 * named `cf-turnstile-response` whose value the server action verifies.
 */
export function TurnstileWidget({ siteKey }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div
        ref={containerRef}
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme="light"
      />
    </>
  );
}
