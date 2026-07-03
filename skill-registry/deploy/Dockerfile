# Multi-stage build for skill-registry.
# Build context is the skill-registry directory:
#   docker build -f deploy/Dockerfile -t skill-registry .

FROM rust:1.79-slim AS builder
WORKDIR /build
RUN apt-get update && apt-get install -y --no-install-recommends pkg-config && rm -rf /var/lib/apt/lists/*
COPY Cargo.toml Cargo.lock* ./
COPY src ./src
COPY migrations ./migrations
COPY config ./config
RUN cargo build --release --locked || cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/* \
    && useradd --system --home /var/lib/skill-registry --shell /usr/sbin/nologin registry \
    && mkdir -p /var/lib/skill-registry/artifacts \
    && chown -R registry:registry /var/lib/skill-registry

COPY --from=builder /build/target/release/skill-registry /usr/local/bin/skill-registry
COPY --from=builder /build/config/default.toml /etc/skill-registry/default.toml

USER registry
ENV REGISTRY_CONFIG=/etc/skill-registry/default.toml \
    REGISTRY_ARTIFACT_ROOT=/var/lib/skill-registry/artifacts \
    REGISTRY_LISTEN=0.0.0.0:8300 \
    REGISTRY_LOG_FORMAT=json

EXPOSE 8300
# Migrations are applied explicitly (`skill-registry migrate`), never on boot.
ENTRYPOINT ["/usr/local/bin/skill-registry"]
CMD ["serve"]
