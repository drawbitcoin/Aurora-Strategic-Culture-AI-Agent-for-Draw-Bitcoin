# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aurora is a Next.js 14 chat interface that exposes a single AI persona ("Aurora — Strategic Culture Operator for Draw Bitcoin") backed by the Anthropic API. The entire application is three source files. There is no database, no auth layer, and no test suite.

Deployment target: Vercel. Required environment variable: `ANTHROPIC_API_KEY`.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start local dev server (localhost:3000)
npm run build        # production build
npm run start        # serve the production build
```

No lint, format, or test scripts are configured.

## Architecture

### Request flow

`app/page.js` (client component) → `POST /api/aurora` → `app/api/aurora/route.js` (Edge Runtime) → Anthropic Messages API → response rendered in `page.js`.

The API route calls `https://api.anthropic.com/v1/messages` directly with `fetch` (no SDK). It uses `export const runtime = 'edge'` so it runs as a Vercel Edge Function, not a Node.js lambda. The current model is `claude-sonnet-4-20250514` with `max_tokens: 1500`.

### UI state

`page.js` manages the full conversation history as a `msgs` array of `{role, content}` objects, which is sent in its entirety on every request (no truncation). A `started` boolean gates the landing splash vs. active chat view. All styling is inline — there is no CSS file or Tailwind config.

### Aurora's system prompt

Defined as the `SYSTEM` constant in `route.js`. It establishes the persona, voice, three weekly deliverables (Culture Brief, Outreach Batch, Tailored Pitch), and the constraint that all outputs must be denominated in BTC and actionable within 48 hours. Changes to Aurora's behavior belong here.

### Quick-action buttons

Four preset prompts are defined in the `QA` array in `page.js`. They appear as buttons on the landing screen and as a compact toolbar after the first message is sent. Adding or changing Aurora's preset workflows means updating `QA`.

## Key Conventions

- The API route does not stream — it waits for the full Anthropic response before returning JSON. Streaming would require switching to the Anthropic SDK or manual SSE handling.
- Conversation history grows unboundedly in client memory; there is no trimming or summarisation logic.
- The `PixelGrid` component in `page.js` simulates animated pixel art (10×10 grid, 180 ms interval) using the project's brand palette defined in the `C` constant.
- All colour tokens live in the `C` object at the top of `page.js`; use those values for any UI additions rather than raw hex strings.
