import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { bearerOwner } from '../../session';
export const dynamic='force-dynamic';
const FRONT='https://iemfaraz.github.io';
const OWNER='faraznawaz2014@gmail.com';
const states=['New','Contacted','Quoted','Completed','Closed'];
function cors(req:Request){const h:Record<string,string>={'Cache-Control':'no-store','Vary':'Origin'};if(req.headers.get('origin')===FRONT){h['Access-Control-Allow-Origin']=FRONT;h['Access-Control-Allow-Methods']='GET, POST, PATCH, OPTIONS';h['Access-Control-Allow-Headers']='Content-Type, Authorization';}return h;}
function json(req:Request,data:unknown,status=200){return Response.json(data,{status,headers:cors(req)});}
export async function OPTIONS(req:Request){return new Response(null,{status:204,headers:cors(req)});}
export async function POST(req:Request){
 if(req.headers.get('origin')!==FRONT)return json(req,{error:'Please submit from the ENGINEX website.'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json(req,{error:'JSON required.'},415);
 try{
 const raw=await req.text();if(raw.length>16000)return json(req,{error:'Request is too large.'},413);
 const b=JSON.parse(raw);if(b.website)return json(req,{error:'Request could not be accepted.'},400);
 const fields:Record<string,string>={};for(const [key,max] of Object.entries({name:120,phone:40,email:254,service:120,city:160,details:5000})){if(typeof b[key]!=='string'||!b[key].trim()||b[key].length>max)return json(req,{error:'Please check '+key+'.'},400);fields[key]=b[key].trim();}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)||!/[0-9]{5}/.test(fields.phone.replace(/\D/g,'')))return json(req,{error:'Please enter a valid email and phone number.'},400);
 if(typeof b.id!=='string'||!/^[-a-f0-9]{36}$/.test(b.id))return json(req,{error:'Invalid request reference. Reload the page.'},400);
 const db=env.DB;if(!db)return json(req,{error:'Service temporarily unavailable. Please contact us directly.'},503);
 const old=await db.prepare('SELECT id FROM quotes WHERE id=?').bind(b.id).first();if(old)return json(req,{ok:true,id:b.id},200);
 const ip=req.headers.get('cf-connecting-ip')||'unknown';
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(new URL(req.url).host+'|'+new Date().toISOString().slice(0,10)+'|'+ip));
 const hash=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');const now=Date.now();
 const r=await db.prepare(`INSERT OR IGNORE INTO quotes(id,created_at,name,phone,email,service,city,details,ip_hash) SELECT ?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM quotes WHERE ip_hash=? AND created_at>?) < 10`).bind(b.id,now,fields.name,fields.phone,fields.email,fields.service,fields.city,fields.details,hash,hash,now-3600000).run();
 if(!r.meta.changes)return json(req,{error:'Too many requests. Please call or WhatsApp us.'},429);
 return json(req,{ok:true,id:b.id},201);
 }catch(e){if(e instanceof SyntaxError)return json(req,{error:'Invalid request data.'},400);console.error('Quote submission failed');return json(req,{error:'Could not save your request. Please try again or contact us directly.'},503);}
}
async function owner(req:Request){if(req.headers.has('authorization'))return bearerOwner(req);const u=await getChatGPTUser();return !!u&&u.email.toLowerCase()===OWNER;}
export async function GET(req:Request){if(!await owner(req))return json(req,{error:'Owner sign-in required.'},403);const data=await env.DB!.prepare('SELECT id,created_at,name,phone,email,service,city,details,status,notes FROM quotes ORDER BY created_at DESC LIMIT 1000').all();return json(req,{quotes:data.results});}
export async function PATCH(req:Request){if(!await owner(req))return json(req,{error:'Owner sign-in required.'},403);if(![new URL(req.url).origin,FRONT].includes(req.headers.get('origin')||''))return json(req,{error:'Invalid origin.'},403);try{const raw=await req.text();if(raw.length>12000)return json(req,{error:'Too large.'},413);const b=JSON.parse(raw);if(typeof b.id!=='string'||!states.includes(b.status)||typeof b.notes!=='string'||b.notes.length>5000)return json(req,{error:'Invalid update.'},400);const r=await env.DB!.prepare('UPDATE quotes SET status=?,notes=? WHERE id=?').bind(b.status,b.notes,b.id).run();if(!r.meta.changes)return json(req,{error:'Request not found.'},404);return json(req,{ok:true});}catch{return json(req,{error:'Could not save review.'},503);}}
