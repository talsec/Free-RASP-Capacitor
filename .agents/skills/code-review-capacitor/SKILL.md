---
name: code-review-capacitor
description: Performs strict code reviews on Capacitor plugin projects covering TypeScript, the Kotlin (Android) and Swift (iOS) native bridges. Focuses on optimal code, readability, maintainability, deduplication, single-responsibility, straightforward control flow, Capacitor best practices, the rule that native layers must not invent hardcoded fallbacks for values the TypeScript layer or platform SDK already owns, alignment of identifiers and API surface across TypeScript/Kotlin/Swift (especially plugin name, addListener event names, getThreatChannelData shape, and EventIdentifiers), and explicit documentation of platform-specific features. Use when the user asks to "review PR", "do a code review", "review this code", "code review for PR#N", or otherwise requests review of changes in a Capacitor plugin — including its built output (`dist/`) and native source under `android/` and `ios/Plugin/`.
---

# Code Review (Capacitor)

Strict, opinionated code review for Capacitor plugin codebases with Kotlin + Swift bridges. Optimised for catching the kinds of issues that survive linters and tests but degrade a codebase over time.

## Review priorities, in order

1. **Correctness & contract** — bugs, breaking changes, public-API violations, SemVer; identifiers and API surface aligned across TypeScript, Kotlin, and Swift.
2. **Native-layer cleanliness** — no hardcoded fallbacks for values owned by TypeScript or the platform SDK; no behaviour duplicated across language boundaries; platform-specific features explicitly documented.
3. **Single responsibility** — each function, class, and file does one thing.
4. **Deduplication (DRY)** — repeated parsing, serialisation, and validation patterns get extracted.
5. **Readability** — naming, argument styles, generated-vs-handwritten boundaries, no surprises.
6. **Maintainability** — generated files untouched, defaults documented in one place, tests for new public surface.
7. **Capacitor / TypeScript best practices** — `const`, `@deprecated` discipline, `null` vs `undefined`, strict tsconfig honoured.
8. **Polish** — JSDoc style, example brevity, changelog accuracy, PR description present.

## Workflow

### 1. Gather context

If the user references a GitHub PR by number:

```bash
gh pr view <N> --json title,body,author,state,baseRefName,headRefName,additions,deletions,changedFiles,files,url
gh pr diff <N>
git log <base>..<head> --oneline
```

If the changes are local:

```bash
git diff <base>..HEAD --stat
git diff <base>..HEAD
```

Always read the full file (not only the diff) for any non-trivial change so you see the surrounding context the diff hides — especially around native bridges, `addListener` overrides, and `EventIdentifiers`.

### 2. Classify every changed file

Each file falls into exactly one of these buckets, and the bucket determines what's acceptable:

| Bucket | Examples | Rule |
|---|---|---|
| Hand-written TypeScript | `src/` | Full review applies. |
| Built JS / type output | `dist/plugin.cjs.js`, `dist/esm/`, `dist/**/*.d.ts` | **Must not be hand-edited.** Regenerate via `npm run build` (tsc + rollup). |
| Hand-written native | `android/src/main/kotlin/**`, `ios/Plugin/**/*.swift` | Full review applies, with extra scrutiny on the bridge layer. |
| Build / config | `package.json`, `*.gradle`, `*.podspec`, `rollup.config.js`, `tsconfig.json` | Verify version bumps follow SemVer; confirm SDK/binary updates match changelog. |
| Docs / release | `CHANGELOG.md`, `README.md` | Verify claims match the diff (e.g. SDK versions, breaking-change list, public-API additions). |

### 3. Run the checklist below and produce the report

---

## Hard rules — block the merge

### 1. No hand-edits to built files

`dist/` (built by tsc + rollup) must be touched only by `npm run build`.

Red flags:
- Behaviour-changing edits inside `dist/` that differ from what `npm run build` would produce.
- A `// eslint-disable` or `// @ts-ignore` directive added to a file inside `dist/`.

Action: ask the author to run `npm run build` and commit the clean output.

### 2. SemVer must match the change

A breaking public-API change requires a major version bump. "Public" includes anything exported from `src/index.ts` and anything that changes the wire format with the native side.

Common breaks to flag:
- Renamed or retyped fields on exported TypeScript types or interfaces.
- Renamed string values consumers may pattern-match against.
- Removed or repurposed enum variants that map to native callback codes.
- Changed required/optional status on config parameters.

If `CHANGELOG.md` claims SemVer adherence and the bump doesn't match the change, call it out with the affected symbols and the recommended version.

### 3. No hardcoded fallbacks in the native layer

The native layer (Kotlin / Swift) is a transport adapter between TypeScript and the platform SDK. It must not:

- **Invent default values** for fields the TypeScript layer marks required.
- **Substitute defaults** for nullable/optional fields. Either the SDK has its own default (skip the call) or the default belongs in TypeScript.
- **Encode the same default in multiple places.**
- **Hardcode enum names as raw strings.** Use the SDK enum's `.name` property or avoid manual parsing.

Recommended remediation:
- For **required** TypeScript fields: drop the native default; let parsing throw and surface through the existing error path.
- For **optional** TypeScript fields: skip the builder/setter call when the field is absent; let the SDK apply its own default.
- Document the default once — in the TypeScript JSDoc — so the public contract is unambiguous.

### 4. Plugin name must be consistent across all layers

The string used to register and look up the plugin must agree across three places:

| Layer | Location | Value |
|---|---|---|
| TypeScript | `src/api/nativeModules.ts` — `registerPlugin<TalsecPlugin>('Freerasp', {})` | `"Freerasp"` |
| Kotlin | `FreeraspPlugin.kt` annotation — `@CapacitorPlugin(name = "Freerasp")` | `"Freerasp"` |
| Swift | `FreeraspPlugin.swift` — must be registered under the same name in the Capacitor plugin registry | `"Freerasp"` |

Any drift in this string causes the plugin to be unavailable at runtime with no compile-time error.

### 5. `addListener` event names aligned across TypeScript, Kotlin, and Swift

Threats and execution state are delivered through obfuscated event listeners. The event names are fetched at runtime via two methods:

| Method | Returns | Kotlin | Swift |
|---|---|---|---|
| `getThreatChannelData` | **3 strings**: `[channelName, threatKey, malwareKey]` | `getThreatChannelData()` | `getThreatChannelData(_:)` |
| `getRaspExecutionStateChannelData` | **2 strings**: `[channelName, key]` | `getRaspExecutionStateChannelData()` | `getRaspExecutionStateChannelData(_:)` |

The TypeScript side calls `Talsec.addListener(channelName, callback)` where `channelName` is `[0]` from the returned array. The Swift `FreeraspPlugin` **overrides** `addListener(eventName:call:)` to detect when `eventName` matches `EventIdentifiers.threatChannelName` or `EventIdentifiers.raspExecutionStateChannelName` and wires the appropriate dispatcher.

Verify for every change touching these methods:
- Array length is the same on Kotlin and Swift sides.
- Semantic order of items matches what `src/channels/threat.ts` and `src/channels/raspExecutionState.ts` destructure by index.
- The `TalsecPlugin` TypeScript interface in `src/types/types.ts` reflects any change to the array shape.
- The Swift `addListener` override handles all new event name variants.

### 6. `EventIdentifiers` must stay obfuscated — never replace with hardcoded strings

`ios/Plugin/utils/EventIdentifiers.swift` derives all channel identifiers at runtime from `RandomGenerator.generateRandomIdentifiers(length: N)`. This obfuscation is intentional and security-relevant.

Hard blocks:
- Replacing a `generatedNumbers[i]` reference with a hardcoded string or integer constant.
- Adding a new identifier slot without expanding `length` and updating all index references consistently.
- Using the same index for two different identifier roles (index collision).

The Kotlin side generates its own independent random identifiers; they are not shared with iOS by design.

### 7. `addListener` / `removeAllListeners` symmetry

Every `Talsec.addListener(channelName, callback)` call must have a matching cleanup path.

Check:
- The returned `PluginListenerHandle` is explicitly `.remove()`d in the TypeScript cleanup path.
- `Talsec.removeListenerForEvent({ eventName: channelName })` is called to unregister on the native side when the listener is torn down.
- The Swift `addListener` override does not leak references to dispatchers when `remove()` is called.

### 8. `TalsecPlugin` interface completeness

The `TalsecPlugin` TypeScript interface (in `src/types/types.ts`) is the source of truth for the plugin's surface. Verify:
- Every method on the interface has a Kotlin implementation in `FreeraspPlugin.kt`.
- Every method on the interface has a Swift implementation in `FreeraspPlugin.swift`.
- No native method exists without a corresponding TypeScript declaration.

### 9. Platform-specific features must be documented and gated

Not every API works on both platforms. Some checks are Android-only (e.g. malware detection, package introspection), some iOS-only (e.g. jailbreak sub-checks).

Required:
- **JSDoc states the platform**: any type, field, or callback that only works on one platform must say so — e.g. `/** Android only. No-op on iOS. */`
- **Config class isolation**: platform-specific config fields belong on the platform-specific config class, not on `TalsecConfig`.
- **CHANGELOG calls out the platform**: bullets must say "(Android)" or "(iOS)" when applicable.

Red flags:
- A `TalsecConfig`-level field read only by one native handler, with no platform marker.
- A callback that fires only on one platform without a JSDoc note.
- An enum variant with no native producer on one platform.

### 10. Tests for new public API

Every newly exported type, enum, or function needs at least:
- Construction / instantiation test (defaults, required fields).
- Round-trip serialisation test if the type crosses the JS–native bridge as JSON.
- Enum-name stability test if the enum maps to native callback codes.

---

## Significant issues — should fix

### Single responsibility

- A function that parses, validates, defaults, and constructs in one body is doing four things. Split.
- A Kotlin class with `parse*`, `build*`, and `dispatch*` methods is three classes.
- A TypeScript file that mixes API methods, listener helpers, and type definitions is three modules.

### Deduplication

Flag verbatim or near-verbatim repetition, especially:
- The same `(0 until arr.length()).map { arr.getString(it) }` pattern repeated for every JSON array field. Extract a helper.
- Multiple `runCatching { Enum.valueOf(s) }.getOrDefault(...)` calls. Extract a generic `parseEnumOr(default)` helper.

### Argument style for many-parameter constructors

Constructors with **3+ parameters of similar type** should use named arguments. Positional calls are swap-bug magnets.

### Old API still wired alongside the new one

When deprecating an API path, ensure the new path doesn't quietly run both code paths. Either short-circuit the deprecated path or document the precedence explicitly.

---

## Style & polish — call out, don't block

- **Trailing newlines, formatting churn**: separate from the feature; mention but don't argue.
- **Verbose examples**: example code that explicitly sets parameters to their defaults teaches nothing.
- **Inconsistent terminology**: flag multiple names for the same concept before release.
- **JSDoc consistency**: full sentences, end with a period, match the project's existing style.
- **`@deprecated` discipline**: deprecating a field is fine; leaving the constructor accepting it with no warning is inconsistent.
- **PR description**: an empty PR body for a release PR is a defect of its own.
- **Changelog accuracy**: every bullet in `CHANGELOG.md` should be verifiable from `git diff <base>..HEAD`.
- **npm vs yarn**: this repo uses npm. Any instruction in the README or PR description to run `yarn` is wrong.

---

## Output format

Structure the review as:

```markdown
## Summary

<2–3 sentences: what the PR does, overall verdict>

## Blockers / Major issues

### 1. <short title — one line>

<context, citing file:line; show the offending snippet using a code reference>

<concrete remediation>

### 2. ...

## Significant issues

(same shape, less severe)

## Minor / polish

(numbered list, one to three lines each)

## Recommended action

<numbered, ordered list of what must change before merge>
```

Rules for the report:
- Cite specific files and line numbers for every issue. When showing existing code, use the `startLine:endLine:filepath` reference form so the user can click through.
- Prefer one detailed example over a vague generality; if a pattern repeats, mention it once and list the other locations.
- Distinguish between "this is wrong" and "I'd prefer this." Flag the first as Major, the second as Polish.
- Never assert facts about a closed-source SDK without verifying. If the SDK isn't readable from the repo, phrase findings as "verify whether the SDK provides X; if so, do not duplicate it."
- End with a short, ordered "Recommended action" list — the actual gating items, not a wishlist.
