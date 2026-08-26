# Security Policy

This is a static documentation site and an instruction-only skill collection. It should not require secrets, user accounts, analytics identifiers, or access to private data.

## Report privately

Please use [GitHub private vulnerability reporting](https://github.com/YitziG/great-rabbis-skills/security/advisories/new) for suspected vulnerabilities. Do not include secrets, personal information, or exploit details in a public issue.

Include the affected file or route, the observed behavior, the impact, and the smallest safe reproduction you can provide.

## Supported version

Security fixes target the current `main` branch. Published site behavior should be verified against the current production deployment before reporting a stale preview or local build.

## Scope

Security issues include dependency vulnerabilities with a reachable impact, unsafe generated HTML, exposed private data, malicious installation behavior, or a skill that directs an agent to bypass authorization or safety boundaries.

The deployed site is static output and accepts no uploads, remote image input, or other runtime content. Production builds use repository-controlled content, and the repository intentionally contains no tracked raster media. Pull-request validation can parse contributor-controlled content, so that job is read-only and capped at ten minutes. These boundaries limit exposure to parser vulnerabilities in build-only transitive dependencies while upstream fixes are unavailable; they are not a waiver, and those dependencies should be updated as soon as compatible fixes are published.

Questions about a teaching, translation, source interpretation, or religious practice are not security reports; use a normal issue without personal or sensitive information.
