import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validCnpj,normalizedPhone} from '../lib/validation.ts';
const base=process.env.CAROL_TEST_URL||'http://127.0.0.1:5173';
const catalog=JSON.parse(fs.readFileSync(new URL('../data/catalog.json',import.meta.url)));
assert.equal(catalog.products.length,50);assert.equal(catalog.categories.length,16);assert.equal(catalog.products.reduce((n,p)=>n+p.variations.length,0),290);
assert.equal(new Set(catalog.products.map(p=>p.slug)).size,50);
for(const p of catalog.products){assert(p.description);for(const image of [p.image,...p.images])assert(fs.existsSync(new URL('../public'+image,import.meta.url)));}
assert(validCnpj('11.222.333/0001-81'));assert(!validCnpj('11.222.333/0001-80'));assert(!validCnpj('00000000000000'));assert.equal(normalizedPhone('+55 (47) 99999-0000'),'47999990000');assert.equal(normalizedPhone('123'),null);
for(const path of ['/',`/produto/${catalog.products[0].slug}`,`/produto/${catalog.products[1].slug}`,'/downloads/catalogo-carol-componentes.pdf']){const r=await fetch(base+path);assert.equal(r.status,200,path);}
assert.equal((await fetch(base+'/produto/inexistente')).status,404);
for(const [cep,price]of [['89218301',18.9],['80240270',39.9],['01001000',59.9]]){const r=await fetch(base+'/api/frete?cep='+cep);assert.equal(r.status,200);const d=await r.json();assert.equal(d.price,price);assert.equal(d.simulated,true);}
assert.equal((await fetch(base+'/api/frete?cep=123')).status,400);
const body={id:crypto.randomUUID(),cnpj:'11222333000181',phone:'47999990000',name:'Teste local',source:'Verificação local',message:'Demonstração técnica, sem envio real.',items:[],website:''};
const post=(payload,headers={})=>fetch(base+'/api/contato',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(payload)});
assert.equal((await post({...body,cnpj:'00000000000000'})).status,400);
assert.equal((await post({...body,phone:''})).status,400);
assert.equal((await post(body,{Origin:'https://outro.example'})).status,403);
const result=await post(body);assert.equal(result.status,200);const d=await result.json();assert.equal(d.simulated,true);const whatsapp=new URL(d.whatsappUrl);assert.equal(whatsapp.searchParams.get('phone'),'5547996180088');assert(whatsapp.searchParams.get('text').includes('CNPJ: 11222333000181'));assert.equal((await post(body)).status,200);
assert.equal((await fetch(base+'/api/feedback')).status,401);
const login=await fetch(base+'/signin-with-chatgpt?return_to=/validacao',{redirect:'manual'});const cookie=login.headers.get('set-cookie')?.split(';')[0];assert(cookie,'local mock-auth cookie');
const feedback=await fetch(base+'/api/feedback',{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify({area:'Teste local',message:'Validação automática local: persistência confirmada.'})});assert.equal(feedback.status,201);const entry=await feedback.json();const list=await fetch(base+'/api/feedback',{headers:{Cookie:cookie}});assert.equal(list.status,200);assert((await list.json()).some(v=>v.id===entry.id));
assert.equal((await fetch(base+'/validacao',{headers:{Cookie:cookie}})).status,200);
console.log('PASS: counts, local media, CNPJ/phone, product routes, PDF, shipping, contact, sole WhatsApp, idempotency, authenticated feedback persistence.');
