source "https://rubygems.org"


gem 'jekyll'
gem 'coderay'
gem 'pygments.rb'
gem 'rake-jekyll'
gem 'github-pages', '>= 228'

group :jekyll_plugins do
  gem 'jekyll-feed'
  gem 'jekyll-paginate'
  gem 'jekyll-seo-tag'
  gem 'jekyll-sitemap'
  gem 'jekyll-asciidoc'
end


gem "webrick", "~> 1.7"

# Jekyll 3.9.3 (pinned by github-pages 228) is incompatible with logger >= 1.6
# shipped by Ruby 3.3+, which raises `undefined method [] for nil` on startup.
gem "logger", "~> 1.5.3"
