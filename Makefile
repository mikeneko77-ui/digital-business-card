.PHONY: deploy

deploy:
	npm run build
	firebase deploy --only hosting