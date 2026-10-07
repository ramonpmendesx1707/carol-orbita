import pathlib,json,re,hashlib
__file__=str(pathlib.Path(__file__).with_name('import-catalog.py'))
source=pathlib.Path(__file__).read_text();exec(compile(source[:source.index('def variation(job):')],__file__,'exec'))
urls=set()
for p in products:
 peer=peers[p['id']]
 if peer['id']!=p['id']:urls.add(peer['permalink'])
 for image in peer['images']:urls.add(image['src'])
 for v in p['variations']:
  label=' / '.join(a['value'] for a in v['attributes']);d=batch.get(manufacturer_variants[p['id']].get(label),{})
  for image in d.get('images',[]):urls.add(image['src'])
 for url in re.findall(r'(?:src|href)=["\']([^"\']+)["\']',p['description']):
  if re.search(r'\.(?:jpg|jpeg|png|webp)(?:\?|$)',url,re.I):urls.add(url)
jobs=[{'url':url,'path':str(ROOT/'work/http'/(hashlib.sha256(url.encode()).hexdigest()+'.bin'))} for url in sorted(urls) if not (ROOT/'work/http'/(hashlib.sha256(url.encode()).hexdigest()+'.bin')).exists()]
(ROOT/'work/downloads.json').write_text(json.dumps(jobs),encoding='utf-8');print('Remaining downloads',len(jobs))
