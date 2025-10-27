
# Variables

HASHES=docs/_data/commits.yml


# Targets

.PHONY: all clean hashes install serve

all: serve

install: local-test/Gemfile
	cd local-test && bundle install

serve: docs/_config.yml local-test/Gemfile
	cd local-test && bundle exec jekyll serve --source ../docs --baseurl ''

clean:
	rm -r local-test/_site

hashes:
	echo "# Generated mappings from commit id (timestamp) to commit hash\n" > $(HASHES)
	git log --branches --grep="See https://.*\.html#commit-" --pretty="%H" | \
	while read h; do \
		echo "$$( \
			git log -1 --pretty='%b' $$h | \
			head -n 1 | \
			sed 's/.*commit-//' \
		): $$h"; \
	done | \
	sort >> $(HASHES)
