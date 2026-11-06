# Put the estimator on estimator.websterac.com

This is the handoff for the person publishing the Webster replacement estimator at `https://estimator.websterac.com/`.

The site is a static export. After the build, the server only has to serve files. It does not run Node, and it does not have an API.

Source code: [github.com/tdaffron/webster-quote-builder](https://github.com/tdaffron/webster-quote-builder), branch `main`.

## What you are publishing

One page. The homeowner walks through home type, equipment location, system size, comfort options, a price range, and a contact form. House drawings, equipment badges, and the Webster logos are image files in the build. Fonts are included in the build. The browser does not call Google Fonts.

The contact form does not send email and does not save the lead. On submit it shows a confirmation and a `WEB-` reference generated in the browser. Wiring that form to `info@websterac.com` is a separate job. Do not expect a form action, a webhook, or a database.

Prices in the page are placeholder ranges for budgeting. They are not Webster’s price book.

## Build it for the subdomain

The live GitHub Pages demo is built with a path prefix, `/webster-quote-builder`. Those files will not work on `estimator.websterac.com`. Every stylesheet, script, and image would request `/webster-quote-builder/...` and 404. Build again with no prefix.

Requirements on the machine that builds: Node.js 22, npm, and a copy of `main`.

```bash
git clone https://github.com/tdaffron/webster-quote-builder.git
cd webster-quote-builder
npm ci
unset BASE_PATH
npm run build
```

`npm run build` writes a folder named `out`. That folder is the site. Do not upload the git repo, `node_modules`, or `.next`.

Confirm the prefix is empty before you upload. The home page should reference `/_next/...`, not `/webster-quote-builder/_next/...`.

```bash
grep -o '/webster-quote-builder/_next' out/index.html || echo "prefix is empty, good to upload"
```

If that grep prints a path, the build picked up `BASE_PATH`. Unset it and build again.

## Upload it

`estimator.websterac.com` should be its own site, with the estimator at the root of that hostname. `https://estimator.websterac.com/` serves `index.html`.

Upload the **contents** of `out`, not the `out` folder itself. The document root needs `index.html` at the top, next to these:

- `_next/` holds the JavaScript, CSS, and font files. The names are content-hashed. Upload the whole directory.
- `homes/` holds the house drawings and the air-handler and condenser badges.
- `brand/` holds the logos.
- `404.html` is the missing-page file.
- `.nojekyll` is only for GitHub Pages. Leaving it in place does no harm.

The production server does not need Node after this upload.

Point DNS for `estimator.websterac.com` at the host that serves this folder, and serve it over HTTPS. The page is all one origin. There is no third-party script to allow.

### If the files live in a subfolder instead

This guide assumes the hostname root. If the estimator has to live at a path such as `https://websterac.com/estimator/`, stop and rebuild. From the project directory:

```bash
export BASE_PATH=/estimator
npm run build
```

Use the real path, with a leading slash and no trailing slash. Upload the new `out` contents into that folder. A root build and a subfolder build are not interchangeable.

## Server settings

The app is one HTML page plus assets. You do not need a rewrite to a Node process.

`trailingSlash` is on, so the built page is `index.html`. Default directory indexes are enough for `/`.

Cache the hashed files under `_next/static/` for a long time. Do not cache `index.html` for a long time, or a new upload will look like the old page until the browser expires it.

Apache, in the site config or an `.htaccess` next to `index.html`:

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

nginx:

```nginx
root /var/www/estimator;
index index.html;

location /_next/static/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

location / {
  try_files $uri $uri/ $uri/index.html =404;
  add_header Cache-Control "no-cache";
}
```

Change `root` to the directory you uploaded into. The `no-cache` header on `/` also covers images. If you would rather cache the pictures, give `homes/` and `brand/` their own locations with a shorter max-age.

## Check it after it is live

Open `https://estimator.websterac.com/` in a private window.

1. The Webster logo, the phone number, and the three house drawings load.
2. Choose a home, then Continue. On the setup step, pick an air handler location and a condenser location. Both badges appear on the house.
3. Continue through size and heat, pick Basic, Enhanced, or Premium, and reach a price range.
4. Submit the contact form with a name, a 10-digit phone, an email, a 5-digit ZIP, a call time, and the consent box. The page shows a `WEB-` reference and says the sales team will be in contact within 24–48 business hours. Nothing is emailed. That is the current behavior.
5. In the browser network panel, CSS and JavaScript return 200 from `/_next/static/...`. A request to `/webster-quote-builder/...` means this is the GitHub Pages build. Rebuild with `BASE_PATH` unset and upload again.

## Updating later

Pull `main`, run `npm ci`, leave `BASE_PATH` unset, run `npm run build`, and replace the files in the document root with the new `out` contents. Replace `_next/` rather than merging it, so retired hashed files do not pile up. Keep `index.html` on a short cache so the new page is what visitors get.
