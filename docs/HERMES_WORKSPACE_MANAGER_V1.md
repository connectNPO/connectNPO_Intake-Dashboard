# Hermes Workspace Manager — v1

A minimal operator dashboard for tracking the staff and client Hermes
environments connectNPO runs. It is a metadata + workflow tool. It does **not**
touch Discord, SSH, or VPS provisioning directly.

## v1 scope

What this app does today:

- Records workspace metadata in the `public.hermes_workspaces` Supabase table
  (RLS: any authenticated admin can manage).
- Lists workspaces with lifecycle status, support status, and the basics
  operators want at a glance (client, key, type, isolation, host, profile,
  dashboard port).
- Offers an `Add workspace` form with type-checked enums and a per-workspace
  notes field for context.
- Lets operators click any row to open a per-workspace detail/edit page that
  re-uses the same validation as the create form. The detail page also shows
  a read-only **connection helper** (remote URL, SSH tunnel command template,
  Hermes profile name) when those fields are populated — these are operator
  notes, not secrets, and nothing is executed from the dashboard.
- Surfaces a four-step setup workflow (record → provision → connect Discord →
  verify) so new operators know the path.

What v1 does **not** do (and should not be added without an explicit ask):

- No automatic VPS provisioning, deploys, or restarts.
- No remote shell or `ssh` execution from the dashboard.
- No bot tokens, API keys, passwords, or `.env` storage. Tokens live on each
  VPS, in the Hermes profile's `.env` file only.
- No Discord webhook input.
- No public/customer self-service. The dashboard is admin-only.
- No raw Hermes dashboard embed or proxying.

## Safe customer isolation rule

One client = one isolated tenant. Pick the model up front:

- **Dedicated VPS** (default for paying clients): one client gets one
  Hetzner/DO/Linode box and its own Hermes install. No noisy-neighbor risk.
- **Shared VPS profile** (internal/pilot only): multiple Hermes profiles on
  one VPS. Each profile is a separate folder + separate dashboard port.
  Acceptable for internal/staff/pilot workspaces; not recommended for
  third‑party paying clients.

Never mix client data across profiles. Never reuse a Discord bot between
clients.

## Profile / VPS patterns

Local-tested pattern used while building this app:

| Profile     | Dashboard port |
| ----------- | -------------- |
| default     | 9119           |
| connectnpo  | 9120           |

When adding a new profile on a shared box, increment the dashboard port
(9121, 9122, …) and record it in the workspace.

## Mac SSH tunnel examples

To open a remote Hermes dashboard locally without exposing it to the public
internet:

```bash
# Default profile on a VPS, surfaced at http://localhost:9119
ssh -N -L 9119:127.0.0.1:9119 ops@hermes-host.example.com

# connectnpo profile, surfaced at http://localhost:9120
ssh -N -L 9120:127.0.0.1:9120 ops@hermes-host.example.com
```

Keep the tunnel running in its own terminal. Close it when you're done — the
dashboard should never be left publicly accessible.

## Discord setup checklist

For each workspace:

1. Create a new Discord application + bot for *this* workspace (don't reuse).
2. Invite the bot to the client's server with the minimum scopes needed.
3. Create the channel and confirm the bot can read + post.
4. SSH to the VPS, drop the bot token in the Hermes profile's `.env`, restart
   that profile only.
5. Send a test message in the channel and confirm it shows in the Hermes
   dashboard.
6. Update the workspace record: `support_status = ok`, `status = active`.

Token handling: tokens stay on the VPS. If a token leaks, rotate it in the
Discord Developer Portal and update the `.env` on the box — not here.

## Operator next steps (after v1 ships)

These are intentional v2 candidates, not v1 work:

- Per-workspace timeline of operator notes (replaces the single `notes`
  column).
- Optional read-only health check that pings the dashboard port through a
  pre-approved bastion, surfacing latency only.
- Linking a workspace to its `organizations` record so Growth Readiness
  intake and Hermes ops share one client view.
- Cost rollup across all active workspaces.

If any of those become urgent, scope them as their own task — don't quietly
expand this app.
