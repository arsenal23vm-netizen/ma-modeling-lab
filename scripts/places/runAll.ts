import{args}from"../../lib/places/env";import{plan}from"./planCollection";import{collect}from"./collectCandidates";import{score}from"./scoreCandidates";import{exportCandidates}from"./exportCandidates";
async function runAll(){await plan();if(args().executeApi)await collect();else console.log("places:all はdry-runのため収集APIをスキップします。");await score();await exportCandidates()}
void runAll().catch(error=>{console.error(error);process.exitCode=1});
