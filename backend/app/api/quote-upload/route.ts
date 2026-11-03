import {env} from 'cloudflare:workers';
import {FRONT} from '../../session';
import {validMedia} from '../../hero';
import {MAX_PHOTO,PART_SIZE,uuid,digest,ipHash,uploadRow,uploadKey} from '../../quote-upload';
const headers={'Access-Control-Allow-Origin':FRONT,'Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'POST, PUT, DELETE, OPTIONS','Cache-Control':'no-store'};
const json=(data:unknown,status=200)=>Response.json(data,{status,headers});
export async function OPTIONS(){return new Response(null,{status:204,headers})}
export async function POST(req:Request){if(req.headers.get('origin')!==FRONT)return json({error:'Invalid origin.'},403);try{
 const raw=await req.text();if(raw.length>6000)return json({error:'Request too large.'},413);const b=JSON.parse(raw);
 if(b.action==='start'){
 if(!uuid(b.quoteId)||!['image/jpeg','image/png','image/webp'].includes(b.mime)||!Number.isSafeInteger(b.size)||b.size<1||b.size>MAX_PHOTO||typeof b.name!=='string'||b.name.length>180)return json({error:'Use JPG, PNG or WebP images up to 150 MB each.'},400);
 const hash=await ipHash(req),now=Date.now();const id=crypto.randomUUID(),token=crypto.randomUUID();
 // Atomic reservation bounds abandoned uploads as well as simultaneous starts.
 const reservation=await env.DB!.prepare(`INSERT INTO quote_uploads(id,quote_id,token_hash,upload_id,name,mime,size,created,ip_hash) SELECT ?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM quote_uploads WHERE ip_hash=? AND created>?)<30 AND (SELECT COUNT(*) FROM quote_uploads WHERE quote_id=? AND state!='cancelled')<3 AND NOT EXISTS(SELECT 1 FROM quotes WHERE id=?)`).bind(id,b.quoteId,await digest(token),'',b.name,b.mime,b.size,now,hash,hash,now-3600000,b.quoteId,b.quoteId).run();
 if(!reservation.meta.changes)return json({error:'Upload limit reached. Please retry later or contact us.'},429);
 try{const u=await env.BUCKET!.createMultipartUpload('quotes/'+b.quoteId+'/'+id,{httpMetadata:{contentType:b.mime}});await env.DB!.prepare('UPDATE quote_uploads SET upload_id=? WHERE id=?').bind(u.uploadId,id).run();return json({id,token,partSize:PART_SIZE},201)}catch(e){await env.DB!.prepare("UPDATE quote_uploads SET state='cancelled' WHERE id=?").bind(id).run();throw e}
 }
 const row=await uploadRow(b.id,req.headers.get('authorization')?.replace(/^Bearer /,'')||'');if(!row)return json({error:'Upload expired. Please submit again.'},403);
 if(row.state==='ready')return json({ok:true,id:row.id});if(row.state!=='uploading')return json({error:'Upload is unavailable.'},409);
 const total=Math.ceil(row.size/PART_SIZE);if(b.action!=='complete'||!Array.isArray(b.parts)||b.parts.length!==total||b.parts.some((p:any,i:number)=>p.partNumber!==i+1||typeof p.etag!=='string'||p.etag.length>150))return json({error:'Incomplete upload.'},400);
 const key=uploadKey(row),upload=env.BUCKET!.resumeMultipartUpload(key,row.upload_id);
 let object=await env.BUCKET!.head(key);if(!object){await upload.complete(b.parts);object=await env.BUCKET!.head(key)}
 const first=await env.BUCKET!.get(key,{range:{offset:0,length:16}});const bytes=first?new Uint8Array(await first.arrayBuffer()):new Uint8Array();
 if(object?.size!==row.size||!validMedia(bytes,row.mime)){await env.BUCKET!.delete(key);await env.DB!.prepare("UPDATE quote_uploads SET state='cancelled' WHERE id=?").bind(row.id).run();return json({error:'Invalid image contents or size.'},400)}
 await env.DB!.prepare("UPDATE quote_uploads SET state='ready' WHERE id=?").bind(row.id).run();return json({ok:true,id:row.id});
 }catch{return json({error:'Image upload failed. Please retry.'},503)}}
export async function PUT(req:Request){if(req.headers.get('origin')!==FRONT)return json({error:'Invalid origin.'},403);try{const url=new URL(req.url),row=await uploadRow(url.searchParams.get('id')||'',req.headers.get('authorization')?.replace(/^Bearer /,'')||'');if(!row||row.state!=='uploading')return json({error:'Upload expired.'},403);const part=Number(url.searchParams.get('part')),count=Math.ceil(row.size/PART_SIZE);if(!Number.isInteger(part)||part<1||part>count)return json({error:'Invalid part.'},400);const expected=part===count?row.size-(count-1)*PART_SIZE:PART_SIZE;if(Number(req.headers.get('content-length'))!==expected)return json({error:'Invalid part size.'},400);const bytes=await req.arrayBuffer();if(bytes.byteLength!==expected)return json({error:'Incomplete part.'},400);const uploaded=await env.BUCKET!.resumeMultipartUpload(uploadKey(row),row.upload_id).uploadPart(part,bytes);return json(uploaded)}catch{return json({error:'Could not upload image part. Please retry.'},503)}}
export async function DELETE(req:Request){if(req.headers.get('origin')!==FRONT)return json({error:'Invalid origin.'},403);try{const row=await uploadRow(new URL(req.url).searchParams.get('id')||'',req.headers.get('authorization')?.replace(/^Bearer /,'')||'');if(!row)return json({error:'Upload expired.'},403);if(await env.DB!.prepare('SELECT id FROM quotes WHERE id=?').bind(row.quote_id).first())return json({error:'Submitted photos cannot be removed here.'},409);if(row.state==='uploading'&&row.upload_id)await env.BUCKET!.resumeMultipartUpload(uploadKey(row),row.upload_id).abort();await env.BUCKET!.delete(uploadKey(row));await env.DB!.prepare("UPDATE quote_uploads SET state='cancelled' WHERE id=?").bind(row.id).run();return json({ok:true})}catch{return json({error:'Could not cancel upload.'},503)}}
