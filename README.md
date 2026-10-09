# Webster replacement estimate

A demo lead generator for [Webster Air Conditioning & Heating](https://websterac.com/). A homeowner walks six steps — home, current setup, data plate, system, live price, and a short form — and leaves with a price range plus a request for a detailed quote.

Pricing is placeholder data for an Orlando heat-pump changeout. It is not a quote. Swap `src/lib/pricing.ts` when Webster’s price book is ready. The screens read that file only.

Photo reading is simulated. The model-number decoder is real for three outdoor-unit formats:

| Brand | Example model | What it reads |
| --- | --- | --- |
| Trane | `4TWR4036J1000A` | Heat pump, 3 tons. Serial `1428TRN4512` is week 28 of 2014. |
| Carrier | `24ACC648A003` | Air conditioner, 4 tons. Serial `1218C55219` is week 12 of 2018. |
| Goodman | `GSX140241` | 14 SEER series, 2 tons. Serial `2103123984` is March 2021. |

Carrier heat pumps (`25…`) and Goodman heat pumps (`GSZ…`) decode the same way. Anything else asks the homeowner to pick a size.

Square footage suggests a starting tonnage (a stand-in for Manual J, not a load calculation). The plate can agree with that size, or the screen will say the existing unit looks oversized or small and offer the allowed sizes.

## Run it

```bash
npm install
npm run dev
```

Open the URL printed in the terminal. Production:

```bash
npm run build
npm start
```

Checks:

```bash
npm test
npm run lint
```

## Swap the price book

Edit `src/lib/pricing.ts`. Keep the tier, tonnage, heat-strip, thermostat, and location keys. Replace the dollar ranges. Financing rate and term are in the same file. The live bar, the price step, and the monthly payment all use `buildQuote` in `src/lib/estimate.ts`.

## Brand

Colors, type, and the wordmark follow websterac.com: Cabin headings, Roboto body, cyan `#57c4e5`, mint `#80ed99`, and the steel Webster logo. Phone, email, and license CAC1819524 are the company’s public details.
