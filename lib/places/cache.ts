import{createHash}from"node:crypto";import fs from"node:fs/promises";import path from"node:path";import{placesEnv}from"./env";
const dir=path.join(process.cwd(),"data/cache");const file=(kind:string,key:string)=>path.join(dir,`${kind}-${createHash("sha256").update(key).digest("hex")}.json`);
export async function readCache<T>(kind:string,key:string):Promise<T|undefined>{try{const raw=JSON.parse(await fs.readFile(file(kind,key),"utf8"))as{cachedAt:string;data:T};if(Date.now()-Date.parse(raw.cachedAt)>placesEnv.cacheTtlDays*86400000)return;return raw.data}catch{return}}
export async function writeCache<T>(kind:string,key:string,data:T){await fs.mkdir(dir,{recursive:true});const target=file(kind,key),tmp=`${target}.tmp`;await fs.writeFile(tmp,JSON.stringify({cachedAt:new Date().toISOString(),data},null,2));await fs.rename(tmp,target)}
export async function hasValidCache(kind:string,key:string){return(await readCache(kind,key))!==undefined}
