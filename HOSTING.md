# Put the estimator on estimator.websterac.com

This is the handoff for publishing the Webster replacement estimator. `websterac.com` stays as it is. The estimator is a separate site at `https://estimator.websterac.com/`.

Publish the files and stop there. Do not add email, a database, or a form backend for this launch. The contact form only confirms on the page.

Source code: [github.com/tdaffron/webster-quote-builder](https://github.com/tdaffron/webster-quote-builder), branch `main`.

## Easiest setup

Use the server that already hosts `websterac.com`. Add the subdomain as its own site with an empty document root. Upload the static build into that folder. The production server does not run Node.

You control DNS for `websterac.com`. Point `estimator` at that same server:

- An `A` record for `estimator` to the server’s IPv4 address, and an `AAAA` record if the main site has one.
- Or a `CNAME` from `estimator` to the hostname the host gives you for the new site.

Give the subdomain its own HTTPS certificate. A certificate that only covers `websterac.com` will not cover `estimator.websterac.com`.

Do not install this inside the main site’s files, and do not put it in a folder such as `websterac.com/estimator/`. A subdomain with its own folder is the whole job.

## What the page does

One page. The homeowner walks through home type, equipment location, system size, comfort options, a price range, and a contact form. Drawings, badges, logos, and fonts are files in the build. The browser does not call Google Fonts.

Submitting the form does not send email and does not save the lead. The page shows a confirmation and a `WEB-` reference created in the browser. Leave it that way. The words on the confirmation mention `info@websterac.com`, but no message is sent.

Prices on the page are placeholder ranges for budgeting. They are not Webster’s price book.

## Build it

The GitHub Pages demo is built with a path prefix, `/webster-quote-builder`. Those files will not work on the subdomain. Stylesheets, scripts, and images would request `/webster-quote-builder/...` and 404. Build again with no prefix.

On the machine that builds, install Node.js 22 and npm, then:

```bash
git clone https://github.com/tdaffron/webster-quote-builder.git
cd webster-quote-builder
npm ci
unset BASE_PATH
npm run build
```

`npm run build` writes a folder named `out`. That folder is the site. Do not upload the git repo, `node_modules`, or `.next`.

Confirm the prefix is empty before you upload:

```bash
grep -o '/webster-quote-builder/_next' out/index.html || echo "prefix is empty, good to upload"
```

If that grep prints a path, `BASE_PATH` was set. Unset it and build again.

## Upload it

Upload the **contents** of `out` into the subdomain’s document root, so `index.html` sits at the top of that folder. These come with it:

- `_next/` holds the JavaScript, CSS, and font files. Upload the whole directory. The filenames are content-hashed.
- `homes/` holds the house drawings and the air-handler and condenser badges.
- `brand/` holds the logos.
- `404.html` is the missing-page file.
- `.nojekyll` is only for GitHub Pages. Leaving it in place does no harm.

The app is one HTML page plus assets. `index.html` is the page for `/`. Default directory indexes are enough. You do not need a rewrite to a Node process.

Cache the hashed files under `_next/static/` for a long time. Do not cache `index.html` for a long time, or a new upload will look like the old page.

Apache, in the subdomain config or an `.htaccess` next to `index.html`:

```apache
<IfModule mod_setenvif.c>
  SetEnvIf Request_URI "^/_next/static/" long_cache
</IfModule>
<IfModule mod_headers.c>
  <FilesMatch "^index\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  Header set Cache-Control "public, max-age=31536000, immutable" env=long_cache
</IfModule>
```

nginx, with `root` set to the folder you uploaded into:

```nginx
server {
  server_name estimator.websterac.com;
  root /var/www/estimator;
  index index.html;

  location /_next/static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    try_files $uri $uri/ $uri/index.html =404;
    add_header Cache-Control "no-cache";
  }
}
```

Add the subdomain’s certificate in the usual way for that server. The `no-cache` header on `/` also covers the images. That is fine for this launch.

## Check it after it is live

Open `https://estimator.websterac.com/` in a private window. `https://websterac.com/` should be unchanged.

1. The Webster logo, the phone number, and the three house drawings load.
2. Choose a home, then Continue. On the setup step, pick an air handler location and a condenser location. Both badges appear on the house.
3. Continue through size and heat, pick Basic, Enhanced, or Premium, and reach a price range.
4. Submit the contact form with a name, a 10-digit phone, an email, a 5-digit ZIP, a call time, and the consent box. The page shows a `WEB-` reference. The browser does not send that information anywhere. Do not add a mailer to change that.
5. In the network panel, CSS and JavaScript return 200 from `/_next/static/...`. A request to `/webster-quote-builder/...` means this is the GitHub Pages build. Rebuild with `BASE_PATH` unset and upload again.

## Updating later

Pull `main`, run `npm ci`, leave `BASE_PATH` unset, run `npm run build`, and replace the files in the document root with the new `out` contents. Replace `_next/` rather than merging it, so retired hashed files do not pile up.
