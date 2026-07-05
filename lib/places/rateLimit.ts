import{placesEnv}from"./env";export const waitForRateLimit=()=>new Promise(resolve=>setTimeout(resolve,placesEnv.requestDelayMs));
