# Hermes Profile Map

This map records the current internal Hermes profiles Jay uses for connectNPO and Giving Arc operations. It stores non-secret operating metadata only. Do not add bot tokens, API keys, passwords, cookies, OAuth refresh tokens, or `.env` contents here.

## Current internal profiles

| Display name | Actual Hermes profile | Purpose | Discord bot | Discord server / channel | Channel ID | User service | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| connectNPO ContentBot | `connectnpo-content` | connectNPO content, website copy, SEO, nonprofit marketing, and public-facing drafts | `ContentBot#0838` | `NPOBot / #content-bot` | `1507203008482771054` | `hermes-gateway-connectnpo-content.service` | running |
| Giving Arc Content | `givingarc-content` | Giving Arc educational content, YouTube, newsletter, blog, and nonprofit accounting education drafts | `Arcbot` | `givingarc's server / #contents` | `1506758086378127362` | `hermes-gateway-givingarc-content.service` | running |
| Giving Arc Meeting Intelligence | `givingarc-meeting-intel` | Pre-meeting nonprofit research, post-meeting transcript analysis, and anonymized insights | `MeetingIntelBot#9997` | `givingarc's server / #meeting-intel` | `1515970894001082378` | `hermes-gateway-givingarc-meeting-intel.service` | running |
| NPO Accounting | `wife-cpa` | Nonprofit CPA, accounting, tax, Form 990, bookkeeping, and review support | `CPATaxBot` | `givingarc's server / #nonprofit-accounting` | `1506758170603819201` | `hermes-gateway-wife-cpa.service` | running |

## Other profiles found on VPS

| Profile | Current use |
| --- | --- |
| `default` | General Hermes support, VPS/Hermes setup, Discord bot operations, and connectNPO operations support. |
| `connectnpo` | Legacy or paused profile. `hermes profile list` shows gateway stopped. Do not use this as the main connectNPO content bot unless Jay explicitly reactivates it. |

## Isolation rule

Keep these contexts separate:

- `connectnpo-content` is for connectNPO content and website/marketing work.
- `givingarc-content` is for Giving Arc educational content and marketing drafts.
- `givingarc-meeting-intel` is for meeting research/transcript intelligence, not CPA advice.
- `wife-cpa` is displayed as **NPO Accounting** and is for CPA/accounting/tax/Form 990 support.

## Dashboard rule

The dashboard should show these as cards using the **actual Hermes profile** field as the source of truth. Bot names, organization names, and display names should not be treated as profile names.
