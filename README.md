# GOLD AI ANALYZER

**KM** · កម្មវិធីវិភាគមាស (XAU/USD) កម្រិតស្ថាប័ន ដោយប្រើទិន្នន័យពិត និង AI
**EN** · Institutional-grade gold (XAU/USD) analysis dashboard with real market data and AI.

## ជាអ្វី / What it is
| | KM | EN |
|---|---|---|
| ទិន្នន័យ / Data | Yahoo Finance (GC=F, SI=F, DX-Y.NYB, ^TNX) + gold-api.com (spot) | same |
| វិភាគ / Quant | RSI, SMA 20/50/200, MACD, Bollinger, ATR, support/resistance | same |
| សញ្ញា / Signal | ពិន្ទុសរុប ទិញ/លក់/រង់ចាំ ព្រមទាំងហេតុផល | Composite BUY/SELL/NEUTRAL score with reasons |
| ម៉ាក្រូ / Macro | និន្នាការ DXY និង US10Y ធៀបនឹងមាស | DXY & US10Y trend vs gold |
| AI | Claude សរសេររបាយការណ៍ (regime, bias, scenarios, risks) | Claude strategist-style report |
| ភាសា / Language | ខ្មែរ + English | KM + EN toggle |

## ស្ថាបត្យកម្ម / Architecture
```
Browser (public/index.html)
   ├─ GET  /api/market → functions/api/market.js → Yahoo Finance + gold-api.com (edge-cached 5 min)
   └─ POST /api/ai     → functions/api/ai.js     → Anthropic API (key kept server-side)
```
All indicators are computed in the browser; the AI receives only the computed summary, not raw prices.

## ដំឡើង / Setup
1. Create a GitHub repo and push these files (keep the folder structure).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git** → pick the repo. Build command: *(empty)*, output directory: `public`.
   *Or* use the included GitHub Action: add repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, and create the Pages project named `gold-ai-analyzer` once.
3. Pages → Settings → Variables and Secrets → add `ANTHROPIC_API_KEY` (optional; otherwise users paste their own key in the app).

Local: `npx wrangler pages dev public`

## ដែនកំណត់ / Limitations
- Yahoo Finance is an unofficial public endpoint and may rate-limit or change.
- Daily candles only; not tick data. Data can be delayed.
- Signals are rule-based indicators plus AI commentary, not predictions.

## ការបដិសេធ / Disclaimer
មិនមែនជាដំបូន្មានវិនិយោគទេ។ Not financial advice. Trade at your own risk.
