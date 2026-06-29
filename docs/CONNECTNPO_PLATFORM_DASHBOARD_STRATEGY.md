# connectNPO Platform Dashboard Strategy

## Decision

The current Growth Readiness / Intake Dashboard should not become the place where every future connectNPO app is added directly.

Instead, connectNPO should move toward a platform structure:

```text
connectNPO Platform Dashboard
  → Growth Readiness Review app
  → Client Hermes Workspaces app
  → Website / Content Review app
  → Future nonprofit automation apps
```

The current intake dashboard can become the first app/module inside a larger connectNPO admin platform, but it should not absorb unrelated apps in an unplanned way.

## Why

connectNPO will likely build multiple nonprofit-focused apps over time:

- Growth Readiness Review
- client-ready report links
- client Hermes workspace management
- website/content improvement tools
- donor communication tools
- automation setup tools
- GivingArc-related client support tools

If every feature is added directly into the current intake dashboard, the product will become hard to manage.

A platform dashboard keeps the structure cleaner:

```text
One admin login
One connectNPO dashboard shell
Separate apps/modules inside it
Shared clients, users, billing, notes, and status
```

## Recommended structure

### 1. connectNPO Platform Dashboard

This is the future top-level admin area.

Example URL:

```text
/admin
```

Top-level navigation:

```text
Dashboard Home
Clients
Apps
Reports
Hermes Workspaces
Settings
```

### 2. Apps as modules

Each app should live as its own module.

Example:

```text
/admin/apps/growth-readiness
/admin/apps/hermes-workspaces
/admin/apps/website-review
/admin/apps/content-support
```

Each module should have its own:

- purpose
- pages
- tables
- workflow
- permissions later
- documentation

### 3. Shared client record

All apps should connect back to a shared client/nonprofit record.

Example:

```text
Client / Organization
  → Growth Readiness intake
  → Reports
  → Hermes workspace
  → Notes
  → Future apps
```

This avoids duplicate client lists in every app.

## What this means for the current dashboard

The current dashboard remains useful.

It should be treated as:

```text
Growth Readiness Review app v1
```

Not as the final full connectNPO platform.

Current pages can eventually be reorganized like this:

```text
Current:
/admin
/admin/organizations
/admin/report-template
/request-review
/reports/{secure_token}

Future:
/admin/apps/growth-readiness
/admin/apps/growth-readiness/organizations
/admin/apps/growth-readiness/report-template
/request-review
/reports/{secure_token}
```

Public routes can stay clean:

```text
/request-review
/reports/{secure_token}
```

Admin routes can become more modular over time.

## Client Hermes Workspaces module

This should be a separate app/module inside the future platform dashboard.

Purpose:

```text
Manage nonprofit customer Hermes environments that run on separate VPS servers.
```

Future URL:

```text
/admin/apps/hermes-workspaces
```

MVP fields:

- client name
- VPS provider
- VPS IP / hostname
- Hermes status
- gateway status
- Discord bot name
- customer contact
- monthly infrastructure cost
- support status
- notes

MVP actions:

- check status
- restart gateway
- view recent logs
- record setup notes
- record monthly cost
- mark workspace active / paused / retired

Do not expose full Hermes config or secrets in the dashboard.

## Customer isolation rule

For paid or sensitive customer usage:

```text
1 customer = 1 VPS = 1 Hermes install = 1 customer workspace
```

This keeps each nonprofit's data, memory, logs, tools, and integrations separate.

The dashboard should manage these environments, not merge them.

## What not to build yet

Do not start with full automation.

Avoid for now:

- automatic VPS creation
- automatic billing integration
- customer self-serve Hermes setup
- full SaaS multi-tenant assistant
- customer-facing admin panel
- exposing raw Hermes dashboard to customers

Start with operator-managed records and simple status checks.

## MVP path

### Phase 1: Planning and structure

- Keep current dashboard running as Growth Readiness Review MVP.
- Define the future platform structure in documentation.
- Add the idea of apps/modules before building many new features.

### Phase 2: Admin UI reorganization

- Add an Admin Home page.
- Add an Apps section.
- Move current Growth Readiness links under an app grouping.
- Keep existing public links unchanged.

### Phase 3: Client Hermes Workspaces module

- Create basic database table for client workspaces.
- Add list/detail pages.
- Store VPS and support metadata.
- Add manual status check fields first.

### Phase 4: Operational automation

- Add health check scripts.
- Add restart gateway action.
- Add recent log viewer.
- Add monthly cost/status reporting.

## Final principle

connectNPO should become a platform made of small nonprofit apps.

Do not overbuild now, but do not trap future apps inside the first intake dashboard.

The right direction is:

```text
Platform-first architecture
MVP-first implementation
```
