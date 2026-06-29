export function getAgentPacketFilename(organizationName?: string | null) {
  const slug = (organizationName ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `${slug || 'organization'}-agent-packet.json`;
}
