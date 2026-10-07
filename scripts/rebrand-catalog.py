"""Preserve technical pages; replace the previous distributor identity and contacts."""
import sys,pathlib,json
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools/python'))
import pymupdf as f
SOURCE=pathlib.Path(r'C:\Users\Ramon Mendes\Downloads\Catalogo-Carolfix-1.pdf')
OUT=ROOT/'public/downloads/catalogo-carol-componentes.pdf'
doc=f.open(SOURCE)
blue=(.071,.227,.388);yellow=(.957,.769,.188);white=(1,1,1)
def box(p,rect,text,size=14,color=blue,font='helv'):
    while size>=10:
        result=p.insert_textbox(f.Rect(rect),text,fontsize=size,fontname=font,color=color,lineheight=1.25)
        if result>=0:return
        size*=.95
    raise RuntimeError('Text does not fit: '+text[:70])
def erase(p,rect,color=white):
    p.add_redact_annot(f.Rect(rect),fill=color);p.apply_redactions(images=2,graphics=2)
# Cover: old identity is outlined artwork, not searchable text.
p=doc[0];erase(p,(80,360,540,525),(.153,.161,.329))
box(p,(95,370,530,460),'CAROL\nCOMPONENTES',36,white,'hebo')
box(p,(95,475,530,535),'Componentes industriais\nCatálogo técnico - conteúdo original 01/2016',13,white)
# Replace the joint-company institutional page; no technical specifications occur here.
p=doc[2];erase(p,(0,0,p.rect.width,p.rect.height))
p.draw_rect(f.Rect(0,0,p.rect.width,170),color=None,fill=blue)
box(p,(48,45,550,145),'Carol Componentes\nIndustriais',30,white,'hebo')
box(p,(48,210,540,275),'Conhecimento técnico.\nAtendimento em Joinville.',25,blue,'hebo')
box(p,(48,305,540,545),'A Carol Componentes Industriais atende a indústria com componentes para manutenção, projetos e fabricação.\n\nEste catálogo reúne linhas e referências técnicas para apoiar a seleção de peças. Medidas, materiais, disponibilidade e condições comerciais devem ser confirmados com nossa equipe.\n\nA edição técnica original é de janeiro de 2016. Nesta versão, a identidade e os contatos foram atualizados para a operação de Joinville; as tabelas e especificações técnicas foram preservadas.',14)
box(p,(48,590,540,755),'Joinville - Santa Catarina\nRua Carlos Willy Boehm, 537 - Santo Antônio\nCEP 89218-301\nTelefone: (47) 3435-0101\nWhatsApp: (47) 99618-0088\ncarolcomponentes.com.br',15)
# Final contact page: remove previous companies, domains, phone numbers and social links.
p=doc[59];erase(p,(0,0,p.rect.width,p.rect.height),blue)
box(p,(48,55,550,165),'CAROL\nCOMPONENTES',38,white,'hebo')
p.draw_line(f.Point(48,200),f.Point(545,200),color=yellow,width=5)
box(p,(48,240,540,315),'Sua próxima peça começa\ncom uma boa conversa.',25,white,'hebo')
box(p,(48,365,540,655),'Componentes industriais\nJoinville - Santa Catarina\n\nRua Carlos Willy Boehm, 537\nSanto Antônio - CEP 89218-301\n\nTelefone: (47) 3435-0101\nWhatsApp: (47) 99618-0088\n\ncarolcomponentes.com.br',17,white)
box(p,(48,725,540,790),'Identidade atualizada em outubro de 2026.\nConteúdo técnico original preservado.',11,white)
doc.set_metadata({'title':'Carol Componentes Industriais - Catálogo técnico','author':'Carol Componentes Industriais','subject':'Componentes industriais - Joinville','keywords':'Carol Componentes, catálogo, componentes industriais'})
for p in doc:
    for link in p.get_links():
        if any(s in link.get('uri','').lower() for s in ['carolfix','caroljo','carolrolamentos']):p.delete_link(link)
doc.save(OUT,garbage=4,deflate=True)
check=f.open(OUT)
assert len(check)==60
for page in check:
    assert not any(s in page.get_text().lower() for s in ['carolfix','carolfix','caroljo','curitiba','carol rolamentos']),page.number
for idx in [0,2,4,15,28,43,58,59]:check[idx].get_pixmap(matrix=f.Matrix(1,1)).save(str(ROOT/f'work/pdf-final-{idx+1}.png'))
# Contact sheets permit visual review of all technical pages and any image-only branding.
for start in range(0,60,12):
    sheet=f.open();pg=sheet.new_page(width=1000,height=900)
    for offset,idx in enumerate(range(start,min(start+12,60))):
        col,row=offset%4,offset//4
        pix=check[idx].get_pixmap(matrix=f.Matrix(.3,.3))
        pg.insert_image(f.Rect(col*250+20,row*300+20,col*250+230,row*300+278),stream=pix.tobytes('png'))
        pg.insert_text((col*250+20,row*300+292),str(idx+1),fontsize=10)
    pg.get_pixmap().save(str(ROOT/f'work/pdf-sheet-{start//12+1}.png'))
print(json.dumps({'pages':len(check),'output':str(OUT),'technicalPagesPreserved':57,'identityPagesUpdated':[1,3,60]},ensure_ascii=False))
