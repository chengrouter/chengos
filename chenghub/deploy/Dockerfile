# Build stage -----------------------------------------------------------
FROM rust:1.79-bookworm AS build
WORKDIR /src

# Cache dependencies separately from source changes.
COPY Cargo.toml Cargo.lock* ./
RUN mkdir -p src && echo 'fn main() {}' > src/main.rs \
    && echo '' > src/lib.rs \
    && cargo build --release 2>/dev/null || true \
    && rm -rf src

COPY src ./src
COPY migrations ./migrations
RUN touch src/main.rs src/lib.rs && cargo build --release

# Runtime stage --------------------------------------------------------
FROM debian:bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --uid 10001 --home /app chenghub

WORKDIR /app
COPY --from=build /src/target/release/chenghub /usr/local/bin/chenghub
COPY config/default.toml ./config/default.toml

USER chenghub
EXPOSE 8400
HEALTHCHECK --interval=30s --timeout=3s CMD curl -fsS http://127.0.0.1:8400/healthz || exit 1
ENTRYPOINT ["chenghub"]
CMD ["serve"]
