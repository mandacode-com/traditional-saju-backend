FROM node:24-alpine

WORKDIR /app

# Install Prisma CLI and create non-root user in single layer
RUN npm install -g prisma@6.16.2 && \
    npm cache clean --force && \
    adduser -D -u 1001 migrations

# Copy Prisma schema and migrations
COPY --chown=1001:1001 prisma ./prisma

# Switch to non-root user
USER 1001

# Set environment variable check + migration execution as entrypoint
ENTRYPOINT ["/bin/sh", "-c", "\
  if [ -z \"$DATABASE_URL\" ]; then \
    echo '❌ DATABASE_URL is not set'; \
    exit 1; \
  fi && \
  echo 'Running migrations...' && \
  prisma migrate deploy && \
  echo 'Migrations completed successfully' \
  "]
