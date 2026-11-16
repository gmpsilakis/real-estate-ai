# InvestIQ: AI Real Estate Research Dashboard

An AI research assistant for real estate investors. It pulls live housing market data from the web and scores markets against clear investment criteria for four strategies: long-term rentals, vacation rentals, condos and fix-and-flips.

I built it because real estate research is scattered across a dozen sites (Freddie Mac, NAR, Zillow, Redfin, AirDNA) and most tools just show numbers without telling you whether a deal meets your rules. I wanted something that does the legwork, applies investor criteria strictly, and always surfaces the red flags.

## What it does

- **Market Dashboard:** live national or state- and region-level indicators: 30-year mortgage rate, median price, month-over-month change, months of supply, rent growth and foreclosure trend. It adds a 12-month price chart, a buyer/seller market gauge, the top 3 markets to invest in now, and a short, opinionated take on whether it's a good time to buy.
- **Strategy analyzers**, each with its own criteria:
  - **Single family rentals:** cap rate 5–8%, cash-on-cash return of 6% or more, price-to-rent ratio of 15 or less, gross rent multiplier of 12 or less, plus location and property green flags
  - **Vacation rentals (Airbnb/STR):** occupancy and nightly-rate benchmarks, seasonality, and local STR regulations. HOA Airbnb bans are disqualifying.
  - **Condos:** HOA fees capped as a share of rent, rental caps, owner-occupancy ratio and HOA litigation checks
  - **Fix & flip:** distressed-property economics and resale risk
- **Scoring and red flags:** every market is scored against the criteria, markets that fail more than two green-flag criteria aren't recommended, and red flags are always shown.

## How it works

- **Next.js 15 + React 19 + TypeScript**, styled with Tailwind CSS, with charts in Recharts.
- Two server-side API routes (`/api/market-data` and `/api/analyze`) call **Claude through the Anthropic API**, using the **web search tool** so results come from current sources rather than the model's memory.
- Each strategy has its own system prompt encoding the investment criteria (`lib/prompts.ts`), and Claude returns structured JSON that the dashboard renders.
- Responses **stream** to the page as they're generated, and the long system prompts use **prompt caching** to cut cost and latency.
- The API key stays on the server in an environment variable and is never sent to the browser.

## Run it locally

1. Install [Node.js](https://nodejs.org) (version 20 or later).
2. Copy `.env.local.example` to `.env.local` and add your own Anthropic API key.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open http://localhost:3000. On Windows you can also double-click `Start App.bat`.

## What's next

- Property-level analysis from a specific listing or address
- Saved searches and a watchlist of markets
- Exporting an investment memo for a market or property

## Built with

Next.js · React · TypeScript · Tailwind CSS · Recharts · Anthropic API (Claude with web search)
