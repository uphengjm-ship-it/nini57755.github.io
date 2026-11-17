// Cloudflare Pages Function: server-side market data (no CORS issues), edge-cached 5 min
const SYMS={gold:"GC=F",silver:"SI=F",dxy:"DX-Y.NYB",us10y:"^TNX"};
const H={"User-Agent":"Mozilla/5.0"};
async function candles(sym){
  for(const host of ["query1","query2"]){
    try{
      const u=`https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1y&interval=1d`;
      const r=await fetch(u,{headers:H,cf:{cacheTtl:300,cacheEverything:true}});
      const j=(await r.json()).chart.result[0],q=j.indicators.quote[0];
      return j.timestamp.map((t,i)=>({t:t*1000,o:q.open[i],h:q.high[i],l:q.low[i],c:q.close[i]})).filter(x=>x.c!=null);
    }catch(e){}
  }
  return [];
}
export async function onRequestGet(){
  const out={updated:new Date().toISOString(),source:"Yahoo Finance (GC=F, SI=F, DX-Y.NYB, ^TNX)"};
  const keys=Object.keys(SYMS);
  (await Promise.all(keys.map(k=>candles(SYMS[k])))).forEach((v,i)=>out[keys[i]]=v);
  try{ // live spot overlay
    const p=(await (await fetch("https://api.gold-api.com/price/XAU",{cf:{cacheTtl:30}})).json()).price;
    const l=out.gold.at(-1);
    if(p&&l){l.c=p;l.h=Math.max(l.h,p);l.l=Math.min(l.l,p);out.source+=" + gold-api.com (live spot)"}
  }catch(e){}
  return new Response(JSON.stringify(out),{headers:{"content-type":"application/json","cache-control":"public, max-age=60"}});
}
