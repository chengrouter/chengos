---
name: http-tool-guide
description: Use this skill when the assistant needs to configure or call the ChengOS `tools/http` node, build workflows that use HTTP requests, decide whether an HTTP request is safe enough to call directly, or avoid mistakes around URLs, JSON bodies, credentials, headers, timeouts, and response truncation.
---

# HTTP Tool Guide

Use this skill whenever the assistant needs to configure, call, or build a workflow around ChengOS `tools/http`.

## Node Profile

- Node id: `tools/http`
- Category: Tools
- Classification: basic for public/read-only requests; complex when credentials, private APIs, mutating methods, or business-specific headers are involved
- Primary use: send HTTP requests to external endpoints and return structured response data
- Safe default: prefer read-only `GET` requests to public `https://` URLs

`tools/http` sends an HTTP request to a target URL and returns:

- HTTP status code
- response headers
- response body
- elapsed time
- whether the body was truncated
- whether credential-based auth was used

## When To Use

Use `tools/http` for:

- calling public APIs
- fetching remote data
- testing endpoints
- calling authenticated APIs when the credential is configured on the node
- composing workflows that need one HTTP request as a step

Do not use `tools/http` when:

- the target is `localhost`, a private IP, loopback, or an internal hostname
- the task needs browser state, JavaScript rendering, cookies, or form interaction; use `tools/browser`
- the endpoint contract is unknown and the request may mutate data
- the user has not provided enough information for a required URL, payload, or credential

## Configuration Contract

Separate node/static configuration from LLM-filled request fields.

| Field | Who should set it | Notes |
|-------|-------------------|-------|
| `mode` | workflow author | Use LLM mode when the agent should fill request fields dynamically. |
| `credential_id` | workflow author / user | Optional. Lets the node inject Bearer or Basic auth. |
| `url` | LLM or workflow | Must be a full `http://` or `https://` URL. |
| `method` | LLM or workflow | Match method to action risk. |
| `headers` | LLM or workflow | Extra metadata only; do not override credential auth. |
| `body` | LLM or workflow | Required only when the endpoint expects a body. |
| `timeout_secs` | workflow author | Default 30; valid range 1-300. |

## Request Rules

### Method

- `GET`: read-only retrieval
- `POST`: create or action requests
- `PUT`: replace or full update
- `PATCH`: partial update
- `DELETE`: deletion

If the request may change remote state, treat it as mutating and require a clearer user instruction or an example workflow boundary.

### URL

- Use a full URL including scheme.
- Prefer `https://`.
- Do not target `localhost`, private IPs, loopback, or internal hostnames.
- Keep the URL under the maximum length and avoid malformed strings.

### Authentication

- If `credential_id` is configured, let the node inject the auth header
- Do not manually set `Authorization` in `headers` when credential auth exists
- Use Bearer credentials for token-based APIs
- Use Basic credentials only when the API explicitly expects username/password

### Body

- If `Content-Type` is `application/json`, `body` must be a valid JSON string
- If the request uses form data or plain text, make the body match the endpoint contract
- Do not invent fields that are not part of the API
- Keep large payloads concise unless the endpoint requires them

### Headers

Use `headers` for things like:

- `Content-Type`
- `Accept`
- custom API headers

Do not use `headers` to override credential injection or to smuggle unrelated state.

### Timeout And Size

- Default timeout is 30 seconds
- Valid range is 1–300 seconds
- Large responses may be truncated at the tool limit; check `body_truncated`

## LLM Calling Checklist

When the assistant is about to call `tools/http`, it should reason in this order:

1. What is the endpoint?
2. Which method matches the action?
3. Does the request need auth?
4. Is the body JSON, form data, or empty?
5. Which headers are truly necessary?
6. Will the response be used directly or only as evidence?
7. Is the request public/read-only, or does it need a safer workflow with credential and approval boundaries?

## Common Mistakes

- Calling the tool with a private or internal URL
- Using `GET` for a mutating operation
- Putting non-JSON text into a JSON body
- Overriding `Authorization` when a credential is already attached
- Supplying a body for requests that should be empty
- Assuming a 200 response means the body is complete when `body_truncated` is true

## Minimal Examples

### Read-only request

- method: `GET`
- url: `https://api.example.com/v1/status`
- headers: `{"Accept": "application/json"}`
- body: omitted

### JSON request with auth

- method: `POST`
- url: `https://api.example.com/v1/items`
- credential_id: configured by the node
- headers: `{"Content-Type": "application/json"}`
- body: valid JSON string such as `{"name":"demo","enabled":true}`

## Example Workflow Shapes

### Public API Lookup

Use this shape when no credential is needed and the request is read-only:

1. Input node collects the lookup term or URL.
2. `tools/http` sends a `GET` request.
3. LLM or formatter summarizes the response.
4. Output node returns the result and mentions truncation if `body_truncated` is true.

### Authenticated Business API

Use this shape when the endpoint needs a token or account-specific credential:

1. Workflow author configures `credential_id` on `tools/http`.
2. LLM fills only safe request fields such as `url`, `method`, `headers`, and `body`.
3. If the method mutates state, insert an approval step or require explicit user confirmation.
4. Downstream node checks status code and parses response body.

## Failure Handling

- For 4xx responses, treat the call as rejected by the remote API and inspect the body for details.
- For 5xx responses, report the upstream service failure and avoid retry loops unless the workflow explicitly supports retries.
- If `body_truncated` is true, do not claim the response is complete.
- If auth fails, verify the credential configuration before changing headers.
- If URL validation fails, ask for a public, fully qualified URL.

## Final Rule

If the request details are ambiguous, ask for the missing endpoint or payload shape before calling the tool.
