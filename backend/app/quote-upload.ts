import {env} from 'cloudflare:workers';
export const MAX_PHOTO=150*1024*1024,PART_SIZE=8*1024*1024;
export const uuid=(v:unknown):v is string=>typeof v==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(v);
export async function digest(v:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v))),x=>x.toString(16).padStart(2,'0')).join('')}
export async function ipHash(req:Request){return digest(new URL(req.url).host+'|'+new Date().toISOString().slice(0,10)+'|'+(req.headers.get('cf-connecting-ip')||'unknown'))}
export async function uploadRow(id:string,token:string){if(!uuid(id)||!uuid(token))return null;return env.DB!.prepare('SELECT * FROM quote_uploads WHERE id=? AND token_hash=? AND created>?').bind(id,await digest(token),Date.now()-7200000).first<any>()}
export const uploadKey=(r:{quote_id:string;id:string})=>'quotes/'+r.quote_id+'/'+r.id;
