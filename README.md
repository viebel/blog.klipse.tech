# Contribution

Create a fork.

Do your work on  the `master` branch

# How to add a blog post?

## Launch jekyll

Open a terminal and run
```bash
bundle exec jekyll serve --port 4000
```

Open your browser at [http://localhost:4000](http://localhost:4000)

## Create a new post


Create a file under the `_posts` folder.
(You can copy an existing one - as a template)

You're done: Open a Pull Request

## Deploy

Deployment is automatic. Every push to the `master` branch triggers the
GitHub Actions workflow (`.github/workflows/jekyll-docker.yml`), which builds
the site and publishes it to the `gh-pages` branch served at
[https://blog.klipse.tech](https://blog.klipse.tech).

```bash
git add -A && git commit -m "New post" && git push origin master
```


