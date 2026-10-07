import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.CAROL_PLAYWRIGHT_PACKAGE||'playwright');
const url=process.env.CAROL_TEST_URL||'http://127.0.0.1:4185/';
const orbita=process.env.CAROL_TEST_ORBITA==='1';
const browser=await chromium.launch({headless:true,...(process.env.CAROL_CHROME_EXECUTABLE?{executablePath:process.env.CAROL_CHROME_EXECUTABLE}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const catalog=JSON.parse(await fs.readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
await page.route('**/api/catalog',route=>route.fulfill({json:{products:catalog.products,revision:1}}));
await page.route('**/api/company?*',route=>route.fulfill({status:503,json:{error:'Consulta indisponível agora.'}}));
let payload;
await page.route('**/api/contact',async route=>{payload=route.request().postDataJSON();await route.fulfill({json:{id:payload.id,simulated:true,whatsappUrl:url+'#qa-whatsapp-prepared'}})});
await page.goto(url,{waitUntil:'networkidle'});
const favorite=i=>page.locator('.product-grid .product-card .favorite').nth(i);
await favorite(0).click();await favorite(1).click();
assert.equal(await page.locator('.quote-toggle b').textContent(),'2');
assert.equal(await favorite(0).getAttribute('aria-pressed'),'true');
const selectedStyle=await favorite(0).evaluate(el=>({background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color,fill:getComputedStyle(el.querySelector('svg')).fill}));assert.notEqual(selectedStyle.background,'rgb(255, 255, 255)');assert.equal(selectedStyle.fill,selectedStyle.color);
await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.quote-toggle b').textContent(),'2');
await page.locator('.quote-toggle').click();assert.equal(await page.locator('.quote-item').count(),2);
await page.locator('.quote-item input').first().fill('3');
await page.locator('.quote-item>button').nth(1).click();assert.equal(await page.locator('.quote-toggle b').textContent(),'1');await page.keyboard.press('Escape');
await page.locator('.product-grid .product-card .card-actions>a').first().click();
await page.locator('.detail-summary select').selectOption({index:1});await page.getByRole('spinbutton',{name:'Quantidade',exact:true}).fill('3');
await page.getByRole('button',{name:'Adicionar à cotação',exact:true}).click();assert.equal(await page.locator('.quote-toggle b').textContent(),'1');await page.keyboard.press('Escape');
await favorite(1).click();assert.equal(await page.locator('.quote-toggle b').textContent(),'2');
await page.getByRole('button',{name:'Iniciar contato pelo WhatsApp',exact:true}).click();assert.equal(await page.locator('.contact-selection li').count(),2);
await page.getByRole('textbox',{name:'CNPJ',exact:true}).fill('11222333000181');await page.getByRole('textbox',{name:'Telefone com DDD',exact:true}).fill('41999751171');
await page.getByRole('button',{name:'Continuar no WhatsApp',exact:true}).click();await page.waitForFunction(()=>location.hash==='#qa-whatsapp-prepared');
assert.equal(payload.items.length,2);assert.equal(payload.items[0].qty,3);assert.notEqual(payload.items[0].variant,'Medida a definir');assert.equal(payload.items[1].variant,'Medida a definir');assert.match(payload.cnpj,/11\.222\.333\/0001-81/);await page.keyboard.press('Escape');
const report={savedCount:2,persisted:true,removal:true,quoteDeduplicated:true,payloadItems:payload.items.length,selectedStyle,breakpoints:[],errors};
if(orbita){report.regions={};for(const [region,count] of [['Todo o Brasil',27],['Norte',7],['Nordeste',9],['Centro-Oeste',4],['Sudeste',4],['Sul',3]]){await page.getByRole('button',{name:region,exact:true}).click();assert.equal(await page.locator('.map-connection').count(),count);assert.equal(await page.locator('.map-connection-under[marker-end]').count(),count);assert.equal(await page.locator('.capital-list li').count(),count);report.regions[region]=count;}
await page.getByRole('button',{name:'Nordeste',exact:true}).click();await page.locator('.brazil-stage').scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.screenshot({path:'work/map-capitals-desktop.png'});
report.footer=await page.locator('.footer').evaluate(el=>({background:getComputedStyle(el).backgroundColor,links:[...el.querySelectorAll('.footer-grid a')].map(a=>getComputedStyle(a).color),headings:[...el.querySelectorAll('.footer-grid>div>strong')].map(a=>getComputedStyle(a).color)}));
const luminance=c=>{const values=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return values[0]*.2126+values[1]*.7152+values[2]*.0722};const bg=luminance(report.footer.background);report.footer.minimumContrast=Math.min(...report.footer.links.map(c=>(luminance(c)+.05)/(bg+.05)));assert.ok(report.footer.minimumContrast>=4.5);
await page.locator('.footer').scrollIntoViewIfNeeded();await page.screenshot({path:'work/footer-contrast.png'});}
for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);const measure=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(measure.scroll<=width,JSON.stringify(measure));report.breakpoints.push(measure);}
await page.setViewportSize({width:390,height:844});if(orbita){await page.locator('.brazil-stage').scrollIntoViewIfNeeded();await page.screenshot({path:'work/map-capitals-mobile.png'});await page.locator('#inicio').scrollIntoViewIfNeeded();await page.screenshot({path:'work/new-headline-mobile.png'});}
assert.deepEqual(errors,[]);console.log(JSON.stringify(report,null,2));await browser.close();
