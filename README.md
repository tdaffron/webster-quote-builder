# Webster replacement estimate

A demo lead generator for [Webster Air Conditioning & Heating](https://websterac.com/). A homeowner walks six steps — home, current equipment locations, system details, comfort options, an approximate range, and a short form.

Pricing is placeholder data. It is not a quote. Swap `src/lib/pricing.ts` when Webster’s price book is ready. The screens read that file only.

There is no running total. Plate photos are not collected. A typed model number still decodes for three outdoor-unit formats:

| Brand | Example model | What it reads |
| --- | --- | --- |
| Trane | `4TWR4036J1000A` | Heat pump, 3 tons. Serial `1428TRN4512` is week 28 of 2014. |
| Carrier | `24ACC648A003` | Air conditioner, 4 tons. Serial `1218C55219` is week 12 of 2018. |
| Goodman | `GSX140241` | 14 SEER series, 2 tons. Serial `2103123984` is March 2021. |

Carrier heat pumps (`25…`) and Goodman heat pumps (`GSZ…`) decode the same way. Anything else asks the homeowner to pick a size.

The customer chooses the system size. Square footage is no longer collected.

## Not in this version

- Copper line set, yes or no. Webster asked to add it, and did not say what Yes means. Hold it for a follow-up.
- A financing line for Fairwinds Credit Union. The name is known. Webster has not decided to show it.
- Reading a photo of the data plate.

## Share it on GitHub Pages

The site exports to static files, and `.github/workflows/pages.yml` publishes them to [tdaffron/webster-quote-builder](https://github.com/tdaffron/webster-quote-builder).

1. Push the `main` branch to that repository.
2. In the repository, open Settings → Pages → Build and deployment, and set Source to GitHub Actions.
3. Open the Actions tab and wait for “Publish demo” to finish.

The client link is [https://tdaffron.github.io/webster-quote-builder/](https://tdaffron.github.io/webster-quote-builder/).

The quote form confirms on the page with a `WEB-` reference. GitHub Pages has no server, so the demo does not store or email the lead.

To publish it at [estimator.websterac.com](https://estimator.websterac.com/), follow [HOSTING.md](HOSTING.md). That is a static upload onto the subdomain. It does not email leads, and it is not the GitHub Pages build. The Pages files are prefixed with `/webster-quote-builder` and will 404 on the subdomain.

## Run it

```bash
npm install
npm run dev
```

Open the URL printed in the terminal. A static export, the same one GitHub Pages serves:

```bash
npm run build
npx serve out
```

Checks:

```bash
npm test
npm run lint
```

## Swap the price book

Edit `src/lib/pricing.ts`. Keep the tier, tonnage, thermostat, air-quality, location, and home-type keys. Replace the dollar ranges. The price step uses `buildQuote` in `src/lib/estimate.ts`. There is no monthly payment on screen.

## Brand

Cabin headings, Roboto body, and the Webster logo. The interface colors are `#53708e`, `#6f87a0`, `#abb9c8`, `#d9d9d9`, and `#dbe1e8`. Phone, email, and license CAC1819524 are the company’s public details.
