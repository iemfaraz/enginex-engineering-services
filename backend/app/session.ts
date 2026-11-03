import {env} from 'cloudflare:workers';
export const FRONT='https://iemfaraz.github.io';
export const DASH=FRONT+'/enginex-engineering-services/dashboard.html';
export async function hash(s:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');}
export function random(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');}
export async function bearerOwner(req:Request){const value=req.headers.get('authorization')||'';if(!/^Bearer [a-f0-9]{64}$/.test(value))return false;return !!await env.DB!.prepare('SELECT token_hash FROM admin_sessions WHERE token_hash=? AND expires>?').bind(await hash(value.slice(7)),Date.now()).first();}
export function sessionHeaders(req:Request){return {'Cache-Control':'no-store','Referrer-Policy':'no-referrer','Vary':'Origin',...(req.headers.get('origin')===FRONT?{'Access-Control-Allow-Origin':FRONT,'Access-Control-Allow-Methods':'POST, DELETE, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'}:{})};}
