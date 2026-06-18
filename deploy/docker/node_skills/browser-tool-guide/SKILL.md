---
name: browser-tool-guide
description: Use this skill when the assistant needs to call the ChengOS `tools/browser` tool, explain how to fill its parameters, or avoid common mistakes such as calling `navigate` with no URL, mixing up session usage, or repeating browser actions without reading the current page state.
---

# Browser Tool Guide

Use this skill whenever the assistant needs to call `tools/browser` and wants a compact, reliable rule set for constructing browser actions.

## What this tool does

`tools/browser` drives a headless Chromium browser and returns page state for workflows and agents.

It can:

- navigate to a page
- inspect the current page with snapshot or extract
- interact with page elements
- take screenshots
- reuse a keep-alive browser session across calls

## Core rule

If the assistant does not have a concrete URL for a first-page visit, it must not call `navigate`.

Ask for the URL instead of guessing or sending `url: null`.

## How to choose the action

### 1. Use `navigate` only when opening or changing pages

Use `navigate` when:

- the user gave a URL
- the workflow is clearly supposed to open a known page
- the assistant needs to move to a different page from the current one

Requirements:

- `url` must be a non-empty absolute URL
- prefer `https://...`
- do not pass `null`, empty string, or relative paths

Minimal example:

- `{"action":"navigate","url":"https://example.com"}`

### 2. Use `snapshot` after navigation to understand the page

Use `snapshot` when:

- the assistant needs current page text, title, URL, interactives, or page state
- it already has an open page and wants fresh context before deciding the next interaction

Minimal example:

- `{"action":"snapshot"}`

### 3. Use `extract` when a specific structured read is needed

Use `extract` when:

- the assistant needs focused text or structured content
- the user asked for a table, form fields, metadata, or specific element text

Typical inputs:

- `{"action":"extract","selector":"main"}`
- `{"action":"extract","options":{"kind":"table"},"selector":"table"}`

### 4. Use interaction actions only after page context is known

Before `click`, `type`, `select`, `submit`, or `hover`, the assistant should usually know the current page state from a recent `snapshot` or `extract`.

Do not invent selectors.

Examples:

- `{"action":"click","selector":"button[type='submit']"}`
- `{"action":"type","selector":"input[name='q']","text":"ChengFlow"}`

### 5. Use keep-alive sessions for multi-step browsing

If a workflow needs several browser steps across multiple tool calls, prefer explicit session reuse.

Recommended flow:

1. `open_session`
2. `navigate`
3. `snapshot` or `extract`
4. `click`, `type`, or `submit`
5. `close_session` when done

Examples:

- `{"action":"open_session","session_mode":"keep_alive","url":"https://example.com"}`
- `{"action":"snapshot","session_mode":"keep_alive","session_id":"<returned-session-id>"}`
- `{"action":"close_session","session_mode":"keep_alive","session_id":"<returned-session-id>"}`

## Recommended calling pattern for the LLM

When the assistant is about to call `tools/browser`, it should reason in this order:

1. Do I already have a real URL?
2. Am I opening a page or reading the current page?
3. Do I need a persistent session?
4. Do I know the selector, or do I need a snapshot first?
5. Is the next step read-only or interactive?

## Common mistakes to avoid

- calling `navigate` with `url: null`
- calling `navigate` repeatedly after the previous call failed for missing URL
- guessing a URL the user never gave
- guessing selectors before reading the page
- using `snapshot` or `extract` as if they can open a page from nothing
- forgetting `session_id` in keep-alive mode
- re-navigating when the assistant should inspect the already open page

## Minimal examples

### First visit to a known page

- `{"action":"navigate","url":"https://example.com"}`

### Read the current page after navigation

- `{"action":"snapshot"}`

### Search inside a page

- `{"action":"type","selector":"input[type='search']","text":"pricing"}`
- `{"action":"click","selector":"button[type='submit']"}`

### Multi-step session

- `{"action":"open_session","session_mode":"keep_alive","url":"https://example.com"}`
- `{"action":"snapshot","session_mode":"keep_alive","session_id":"<session-id>"}`

## Final rule

If the first page URL is unknown, do not call the browser tool yet. Ask for the URL first.
