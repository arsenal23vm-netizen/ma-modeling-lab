import{placesEnv}from"./env";import type{GooglePlace}from"./types";
const textMask="places.id,places.name,places.displayName,places.formattedAddress,places.location,places.primaryType,places.types,places.businessStatus,places.googleMapsUri";
const detailMask="id,name,displayName,formattedAddress,location,primaryType,types,businessStatus,googleMapsUri,websiteUri,regularOpeningHours,nationalPhoneNumber";
async function request<T>(url:string,init:RequestInit){const response=await fetch(url,{...init,headers:{"Content-Type":"application/json","X-Goog-Api-Key":placesEnv.apiKey,...init.headers}});if(!response.ok)throw new Error(`Google Places API ${response.status}: ${await response.text()}`);return response.json()as Promise<T>}
export async function textSearch(query:string,limit:number){return request<{places?:GooglePlace[]}>("https://places.googleapis.com/v1/places:searchText",{method:"POST",headers:{"X-Goog-FieldMask":textMask},body:JSON.stringify({textQuery:query,languageCode:"ja",regionCode:"JP",maxResultCount:Math.min(limit,20)})})}
export async function placeDetails(placeId:string){return request<GooglePlace>(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,{method:"GET",headers:{"X-Goog-FieldMask":detailMask}})}
export const fieldMasks={textMask,detailMask};
