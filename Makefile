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
