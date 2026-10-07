"""Reproducible read-only import of the public catalog; never requests cart mutations."""
import concurrent.futures as cf, urllib.request, json, re, html, hashlib, pathlib, time, subprocess,os,unicodedata,difflib
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'data'; MEDIA=ROOT/'public/images/catalog'
OUT.mkdir(exist_ok=True); MEDIA.mkdir(parents=True,exist_ok=True)
BASE='https://carolfix.com.br'
def fetch(url):
    cache=ROOT/'work/http';cache.mkdir(parents=True,exist_ok=True)
    target=cache/(hashlib.sha256(url.encode()).hexdigest()+'.bin')
    if target.exists():return target.read_bytes()
    if os.environ.get('CAROL_OFFLINE')=='1':raise FileNotFoundError(url)
    for attempt in range(2):
        try:
            env={**os.environ,'CAROL_FETCH_URL':url,'CAROL_FETCH_PATH':str(target)}
            subprocess.run(['pwsh','-NoProfile','-Command',"$ErrorActionPreference='Stop'; Invoke-WebRequest -Uri $env:CAROL_FETCH_URL -OutFile $env:CAROL_FETCH_PATH -TimeoutSec 12"],env=env,check=True,capture_output=True)
            return target.read_bytes()
        except Exception:
            if attempt==1: raise
            time.sleep(attempt+1)
def clean(value):
    return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',value or ''))).strip()
def renamed(s):
    return re.sub(r'Carol\s*Fix|Carol\s*Rolamentos', 'Carol Componentes',s or '',flags=re.I)
products=json.loads(fetch(BASE+'/wp-json/wc/store/v1/products?per_page=100'))
categories=json.loads(fetch(BASE+'/wp-json/wc/store/v1/products/categories?per_page=100'))
manufacturer=json.loads((ROOT/'work/merkbak-test.json').read_text(encoding='utf-8-sig'))
def norm(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',clean(s).casefold()).encode('ascii','ignore').decode())
peers={}
for p in products:
    ranked=sorted(manufacturer,key=lambda m:difflib.SequenceMatcher(None,norm(p['name']),norm(m['name'])).ratio(),reverse=True)
    score=difflib.SequenceMatcher(None,norm(p['name']),norm(ranked[0]['name'])).ratio()
    peers[p['id']]=ranked[0] if score>.92 else p
assert len(set(m['id'] for m in peers.values()))==50,'Mapping must be one-to-one'
(OUT/'manufacturer-matching.json').write_text(json.dumps([{'originalId':p['id'],'originalName':clean(p['name']),'manufacturerId':peers[p['id']]['id'],'manufacturerName':clean(peers[p['id']]['name'])} for p in products],ensure_ascii=False,indent=2),encoding='utf-8')
assert len(peers)==50,'Every original product must match its manufacturer record'
manufacturer_variants={p['id']:{' / '.join(a['value'] for a in v['attributes']):v['id'] for v in peers[p['id']]['variations']} for p in products}
variation_jobs=[(p['id'],v) for p in products for v in p['variations']]
batch={v['id']:v for path in (ROOT/'work').glob('merkbak-variants-*.json') for v in json.loads(path.read_text(encoding='utf-8-sig'))}
def variation(job):
    parent,v=job; label=' / '.join(a['value'] for a in v['attributes']); mid=manufacturer_variants[parent].get(label)
    originalcache=ROOT/'work/http'/(hashlib.sha256((BASE+'/wp-json/wc/store/v1/products/'+str(v['id'])).encode()).hexdigest()+'.bin')
    d=json.loads(originalcache.read_bytes()) if originalcache.exists() else batch.get(mid,{'sku':'','images':[]})
    return parent,{'id':v['id'],'manufacturerId':mid,'sku':d['sku'],'label':label, 'attributes':v['attributes'],'weight':d.get('formatted_weight',''),'dimensions':d.get('formatted_dimensions',''),'image':d['images'][0]['src'] if d['images'] else None}
variations={p['id']:[] for p in products}
with cf.ThreadPoolExecutor(max_workers=8) as ex:
    for parent,v in ex.map(variation,variation_jobs): variations[parent].append(v)
print('Fetched',len(products),'products and',sum(map(len,variations.values())),'variations',flush=True)
page_failures=[]
def fallback(p):return [{'name':'Peso','value':p.get('formatted_weight','') or 'Sob consulta'},{'name':'Dimensões','value':p.get('formatted_dimensions','') or 'Sob consulta'}]+[{'name':a['name'],'value':', '.join(t['name'] for t in a['terms'])} for a in p['attributes']]
def page(p):
    if peers[p['id']]['id']==p['id']:return p['id'],fallback(p)
    try:raw=fetch(peers[p['id']]['permalink']).decode('utf-8','replace')
    except Exception:page_failures.append(p['id']);return p['id'],fallback(p)
    match=re.search(r'<table[^>]*class="woocommerce-product-attributes.*?</table>',raw,re.S)
    rows=[]
    if match:
        for tr in re.findall(r'<tr\b.*?</tr>',match.group(),re.S):
            cells=re.findall(r'<t[hd]\b[^>]*>(.*?)</t[hd]>',tr,re.S)
            if len(cells)>=2:rows.append({'name':clean(cells[0]),'value':clean(cells[1])})
    return p['id'],rows
attributes={}
with cf.ThreadPoolExecutor(max_workers=6) as ex:
    for i,rows in ex.map(page,products):attributes[i]=rows
print('Additional information collected; page fallbacks:',page_failures,flush=True)
urls=set()
for p in products:
    for image in peers[p['id']]['images']:
        if 'carolfix.com.br' not in image['src']:urls.add(image['src'])
    for v in variations[p['id']]:
        if v['image']:urls.add(v['image'])
    for url in re.findall(r'(?:src|href)=["\']([^"\']+)["\']',p['description']):
        if re.search(r'\.(?:jpg|jpeg|png|webp)(?:\?|$)',url,re.I):urls.add(url)
asset_failures=[]
def asset(url):
    ext=pathlib.Path(url.split('?')[0]).suffix.lower()
    filename=hashlib.sha256(url.encode()).hexdigest()[:16]+ext
    target=MEDIA/filename
    if not target.exists():
        try:target.write_bytes(fetch(url))
        except Exception:asset_failures.append(url);return url,'/images/photo-pending.svg'
    return url,'/images/catalog/'+filename
assets={}
with cf.ThreadPoolExecutor(max_workers=6) as ex:
    for url,local in ex.map(asset,sorted(urls)):assets[url]=local
result=[]
for p in products:
    description=renamed(p['description'])
    for url,local in assets.items():description=description.replace(url,local)
    # Retain technical HTML, remove executable/event content before rendering.
    description=re.sub(r'<(?:script|iframe).*?</(?:script|iframe)>','',description,flags=re.S|re.I)
    description=re.sub(r'\son\w+\s*=\s*(?:"[^"]*"|\'[^\']*\')','',description,flags=re.I)
    description=re.sub(r'javascript\s*:','',description,flags=re.I)
    vs=variations[p['id']]
    for v in vs:v['image']=assets.get(v['image'],v['image'])
    peer=peers[p['id']]
    result.append({'id':p['id'],'slug':p['slug'],'name':renamed(clean(p['name'])),'sku':p['sku'],'brand':'Merkbak','type':p['type'],'summary':renamed(clean(p['short_description'])),'description':description,'categories':p['categories'],'image':assets.get(peer['images'][0]['src'],'/images/photo-pending.svg') if peer['images'] else '/images/photo-pending.svg', 'images':[assets[i['src']] for i in peer['images'] if i['src'] in assets], 'attributes':attributes[p['id']],'weight':p.get('formatted_weight',''),'dimensions':p.get('formatted_dimensions',''),'variations':vs,'sourceUrl':p['permalink'],'technicalSource':peer['permalink'],'sourcePrice':p['prices']['price']})
(OUT/'catalog.json').write_text(json.dumps({'products':result,'categories':categories},ensure_ascii=False,indent=2),encoding='utf-8')
manifest={'collectedAt':'2026-10-06','source':BASE,'products':len(result),'simple':sum(p['type']=='simple' for p in result),'variable':sum(p['type']=='variable' for p in result),'variations':len(variation_jobs),'categories':len(categories),'assets':assets,'missingSku':[p['id'] for p in result if not p['sku']]}
manifest['technicalFallback']='Carolfix became unavailable during collection. Photos, additional-information tables and variant specifications recovered from the matching official Merkbak catalog, matched by product name and exact variation labels. Original Carolfix IDs, category associations, descriptions and summaries preserved.'
manifest['missingVariantSpecifications']=[v['id'] for p in result for v in p['variations'] if not v['weight'] or not v['dimensions']]
manifest['additionalInformationFallbacks']=page_failures
manifest['missingPhotos']=[p['id'] for p in result if p['image']=='/images/photo-pending.svg']
manifest['missingAssets']=asset_failures
(OUT/'import-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Complete:',len(result),'products,',len(variation_jobs),'variations,',len(categories),'categories,',len(assets),'local assets',flush=True)
