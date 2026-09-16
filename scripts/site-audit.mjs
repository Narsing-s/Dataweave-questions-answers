import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const required=['index.html','explorer.html','assistant.html','progress.html','practice-bank.html','lab-v2.html','auth.js','learning.js','manifest.webmanifest','service-worker.js','dataset/questions-10000.json'];
const missing=required.filter(f=>!fs.existsSync(path.join(root,f)));if(missing.length){console.error('Missing required files:',missing.join(', '));process.exit(1)}
const html=fs.readdirSync(root).filter(f=>f.endsWith('.html')).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
const links=[...html.matchAll(/(?:href|src)=["']([^"'#?]+)(?:["'])/g)].map(m=>m[1]).filter(x=>!/^([a-z]+:|\/|data:|mailto:|javascript:)/i.test(x));
const bad=[...new Set(links)].filter(link=>{const clean=link.replace(/^\.\//,'');return !fs.existsSync(path.join(root,clean))});if(bad.length){console.error('Broken local asset links:',bad);process.exit(1)}
const d=JSON.parse(fs.readFileSync(path.join(root,'dataset/questions-10000.json'),'utf8'));const rows=Array.isArray(d)?d:d.examples;if(!Array.isArray(rows)||rows.length!==10000)throw new Error(`Expected 10000 question records; found ${rows?.length??0}`);
const ids=new Set(),dupes=[];for(const [i,x] of rows.entries()){if(!x.id||!x.question||!x.input||!x.output||!x.dataweave||!x.explanation)throw new Error(`Record ${i+1} is missing required content`);if(ids.has(x.id))dupes.push(x.id);ids.add(x.id)}if(dupes.length)throw new Error(`Duplicate IDs: ${dupes.join(', ')}`);
const external=[...html.matchAll(/(?:href|src)=["'](https?:\/\/[^"']+)/g)].map(m=>m[1]);const official=external.filter(x=>/mulesoft\.com|docs\.mulesoft\.com|help\.mulesoft\.com/i.test(x));if(official.length)throw new Error(`External MuleSoft documentation links are not allowed: ${official.join(', ')}`);
console.log(`PASS: ${rows.length} records, ${ids.size} unique IDs, ${new Set(links).size} local asset links checked, no external MuleSoft documentation links.`);
