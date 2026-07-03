# Secret In Package

Fixture: structurally valid package whose reference file contains fake cloud
credentials. Package validation passes, but the secret scan MUST report a
high-severity `secret` finding, so the release lands in `needs_review`.
