import { env } from 'cloudflare:workers';
export async function GET(){try{await env.DB!.prepare('SELECT COUNT(*) AS n FROM quotes').first();return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({ok:false},{status:503});}}
