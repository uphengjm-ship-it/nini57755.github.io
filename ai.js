// Cloudflare Pages Function: Claude proxy. Set secret ANTHROPIC_API_KEY (or user sends x-user-key).
export async function onRequestPost({request,env}){
  const key=env.ANTHROPIC_API_KEY||request.headers.get("x-user-key");
  const err=(m,s=400)=>new Response(JSON.stringify({error:{message:m}}),{status:s,headers:{"content-type":"application/json"}});
  if(!key)return err("No API key configured. Set ANTHROPIC_API_KEY in Cloudflare or paste your key.",501);
  let b;try{b=await request.json()}catch(e){return err("Bad JSON")}
  const body={model:"claude-sonnet-4-6",max_tokens:Math.min(b.max_tokens||1200,2000),system:String(b.system||"").slice(0,2000),messages:(b.messages||[]).slice(-4)};
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},body:JSON.stringify(body)});
  return new Response(await r.text(),{status:r.status,headers:{"content-type":"application/json"}});
}
