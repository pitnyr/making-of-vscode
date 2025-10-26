
# Targets

.PHONY: all clean install serve

all: serve

install: local-test/Gemfile
	cd local-test && bundle install

serve: docs/_config.yml local-test/Gemfile
	cd local-test && bundle exec jekyll serve --source ../docs --baseurl ''

clean:
	rm -r local-test/_site
