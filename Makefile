include .env.make

.PHONY: deploy
deploy:
	helm upgrade --install $(RELEASE_NAME) $(CHART_PATH) \
		-n $(NAMESPACE) \
		--create-namespace \
		-f $(VALUES_FILE)

.PHONY: deploy-dry-run
deploy-dry-run:
	helm upgrade --install $(RELEASE_NAME) $(CHART_PATH) \
		-n $(NAMESPACE) \
		--create-namespace \
		-f $(VALUES_FILE) \
		--dry-run --debug

.PHONY: uninstall
uninstall:
	helm uninstall $(RELEASE_NAME) -n $(NAMESPACE)

.PHONY: template
template:
	helm template $(RELEASE_NAME) $(CHART_PATH) -f $(VALUES_FILE)

.PHONY: migration-create
migration-create:
	@echo "Starting temporary PostgreSQL for migration..."
	@docker run -d --name prisma-migration-temp \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=traditional_saju \
		-p 5433:5432 \
		postgres:16-alpine
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	@echo "Creating migration..."
	@DATABASE_URL="postgresql://postgres:postgres@localhost:5433/traditional_saju?schema=public" \
		npx prisma migrate dev --name $(NAME) --create-only
	@echo "Cleaning up temporary database..."
	@docker stop prisma-migration-temp
	@docker rm prisma-migration-temp
	@echo "Migration created successfully!"

.PHONY: migration-validate
migration-validate:
	@echo "Starting temporary PostgreSQL for validation..."
	@docker run -d --name prisma-validate-temp \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=traditional_saju \
		-p 5433:5432 \
		postgres:16-alpine
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	@echo "Running seed data before migration..."
	@docker exec -i prisma-validate-temp psql -U postgres -d traditional_saju < prisma/testdata/seed_before_migration.sql || true
	@echo "Applying migrations..."
	@DATABASE_URL="postgresql://postgres:postgres@localhost:5433/traditional_saju?schema=public" \
		npx prisma migrate deploy
	@echo "Validating database schema..."
	@DATABASE_URL="postgresql://postgres:postgres@localhost:5433/traditional_saju?schema=public" \
		npx prisma db pull --force
	@echo "Cleaning up temporary database..."
	@docker stop prisma-validate-temp
	@docker rm prisma-validate-temp
	@echo "Migration validation completed successfully!"

.PHONY: migration-full
migration-full:
	@$(MAKE) migration-create NAME=$(NAME)
	@$(MAKE) migration-validate
