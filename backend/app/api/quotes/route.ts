import { env } from 'cloudflare:workers';
import { bearerOwner } from '../../session';
import {validMedia} from '../../hero';
export const dynamic='force-dynamic';
const FRONT='https://iemfaraz.github.io';
const OWNER='faraznawaz2014@gmail.com';
const states=['New','Contacted','Quoted','Scheduled','Completed','Closed'];
function cors(req:Request){const h:Record<string,string>={'Cache-Control':'no-store','Vary':'Origin'};if(req.headers.get('origin')===FRONT){h['Access-Control-Allow-Origin']=FRONT;h['Access-Control-Allow-Methods']='GET, POST, PATCH, OPTIONS';h['Access-Control-Allow-Headers']='Content-Type, Authorization';}return h;}
function json(req:Request,data:unknown,status=200){return Response.json(data,{status,headers:cors(req)});}
export async function OPTIONS(req:Request){return new Response(null,{status:204,headers:cors(req)});}
export async function POST(req:Request){
 if(req.headers.get('origin')!==FRONT)return json(req,{error:'Please submit from the ENGINEX website.'},403);
 if(!/^(application\/json|multipart\/form-data)/.test(req.headers.get('content-type')||''))return json(req,{error:'Unsupported request format.'},415);
 const pendingKeys:string[]=[];let stored=false;
 try{
 let b:any;let uploads:File[]=[];if(req.headers.get('content-type')?.startsWith('multipart/form-data')){if(Number(req.headers.get('content-length')||0)>7*1024*1024)return json(req,{error:'Photos are too large.'},413);const form=await req.formData();const payload=form.get('payload');if(typeof payload!=='string'||payload.length>16000)return json(req,{error:'Invalid form.'},400);b=JSON.parse(payload);uploads=form.getAll('photos').filter((v):v is File=>v instanceof File&&v.size>0);}else{const raw=await req.text();if(raw.length>16000)return json(req,{error:'Request is too large.'},413);b=JSON.parse(raw);} if(b.website)return json(req,{error:'Request could not be accepted.'},400);
 const fields:Record<string,string>={};for(const [key,max] of Object.entries({name:120,phone:40,email:254,service:120,city:160,details:5000})){if(typeof b[key]!=='string'||!b[key].trim()||b[key].length>max)return json(req,{error:'Please check '+key+'.'},400);fields[key]=b[key].trim();}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)||!/[0-9]{5}/.test(fields.phone.replace(/\D/g,'')))return json(req,{error:'Please enter a valid email and phone number.'},400);
 if(typeof b.id!=='string'||!/^[-a-f0-9]{36}$/.test(b.id))return json(req,{error:'Invalid request reference. Reload the page.'},400);
 const db=env.DB;if(!db)return json(req,{error:'Service temporarily unavailable. Please contact us directly.'},503);
 const old=await db.prepare('SELECT id FROM quotes WHERE id=?').bind(b.id).first();if(old)return json(req,{ok:true,id:b.id},200);
 const ip=req.headers.get('cf-connecting-ip')||'unknown';
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(new URL(req.url).host+'|'+new Date().toISOString().slice(0,10)+'|'+ip));
 const hash=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');const now=Date.now();
 const extra={property:typeof b.property==='string'?b.property.slice(0,80):'',quantity:typeof b.quantity==='string'?b.quantity.slice(0,50):'',preferredDate:typeof b.preferredDate==='string'?b.preferredDate.slice(0,30):'',urgency:['Flexible','Soon','Urgent'].includes(b.urgency)?b.urgency:'Flexible'};if(uploads.length>3)return json(req,{error:'Upload up to 3 photos.'},400);const photos:{id:string;name:string;mime:string}[]=[];const checked=[];for(const f of uploads){if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>2*1024*1024)return json(req,{error:'Use JPG, PNG or WebP photos up to 2 MB each.'},400);const bytes=new Uint8Array(await f.arrayBuffer());if(!validMedia(bytes,f.type))return json(req,{error:'Invalid photo format.'},400);checked.push({f,bytes});}for(const {f,bytes}of checked){const id=crypto.randomUUID();await env.BUCKET!.put('quotes/'+b.id+'/'+id,bytes,{httpMetadata:{contentType:f.type}});pendingKeys.push('quotes/'+b.id+'/'+id);photos.push({id,name:f.name.slice(0,120),mime:f.type});}
 const r=await db.prepare(`INSERT OR IGNORE INTO quotes(id,created_at,name,phone,email,service,city,details,ip_hash,extra,photos) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM quotes WHERE ip_hash=? AND created_at>?) < 10`).bind(b.id,now,fields.name,fields.phone,fields.email,fields.service,fields.city,fields.details,hash,JSON.stringify(extra),JSON.stringify(photos),hash,now-3600000).run();
 if(!r.meta.changes){for(const p of photos)await env.BUCKET!.delete('quotes/'+b.id+'/'+p.id);return json(req,{error:'Too many requests. Please call or WhatsApp us.'},429);}
 stored=true;return json(req,{ok:true,id:b.id},201);
 }catch(e){if(!stored)for(const key of pendingKeys)await env.BUCKET?.delete(key).catch(()=>{});if(e instanceof SyntaxError)return json(req,{error:'Invalid request data.'},400);console.error('Quote submission failed');return json(req,{error:'Could not save your request. Please try again or contact us directly.'},503);}
}
async function owner(req:Request){return bearerOwner(req);}
export async function GET(req:Request){if(!await owner(req))return json(req,{error:'Owner sign-in required.'},403);const data=await env.DB!.prepare('SELECT id,created_at,name,phone,email,service,city,details,status,notes,extra,photos FROM quotes ORDER BY created_at DESC LIMIT 1000').all();return json(req,{quotes:data.results});}
export async function PATCH(req:Request){if(!await owner(req))return json(req,{error:'Owner sign-in required.'},403);if(![new URL(req.url).origin,FRONT].includes(req.headers.get('origin')||''))return json(req,{error:'Invalid origin.'},403);try{const raw=await req.text();if(raw.length>12000)return json(req,{error:'Too large.'},413);const b=JSON.parse(raw);if(typeof b.id!=='string'||!states.includes(b.status)||typeof b.notes!=='string'||b.notes.length>5000)return json(req,{error:'Invalid update.'},400);const r=await env.DB!.prepare('UPDATE quotes SET status=?,notes=? WHERE id=?').bind(b.status,b.notes,b.id).run();if(!r.meta.changes)return json(req,{error:'Request not found.'},404);return json(req,{ok:true});}catch{return json(req,{error:'Could not save review.'},503);}}
