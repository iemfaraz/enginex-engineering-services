import {env} from 'cloudflare:workers';
export type Slide={id:string;alt:string;fit:'cover'|'contain'};
export type Hero={slides:Slide[];autoplay:boolean;interval:number;version:number};
export const defaultHero:Hero={slides:[],autoplay:true,interval:6,version:0};
export async function hero():Promise<Hero>{const row=await env.DB!.prepare('SELECT payload,version FROM hero_settings WHERE id=?').bind('hero').first<{payload:string;version:number}>();return row?{...JSON.parse(row.payload),version:row.version}:defaultHero;}
export function validMedia(bytes:Uint8Array,mime:string){const ascii=(a:number,b:number)=>String.fromCharCode(...bytes.slice(a,b));if(mime==='image/jpeg')return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;if(mime==='image/png')return bytes[0]===137&&ascii(1,4)==='PNG';if(mime==='image/gif')return ['GIF87a','GIF89a'].includes(ascii(0,6));if(mime==='image/webp')return ascii(0,4)==='RIFF'&&ascii(8,12)==='WEBP';if(mime==='video/mp4')return ascii(4,8)==='ftyp';if(mime==='video/webm')return bytes[0]===26&&bytes[1]===69&&bytes[2]===223&&bytes[3]===163;return false;}
