import {validCnpj,maskCnpj,maskPhone} from './validation';
export type Company={cnpj:string;legalName:string;tradeName:string;status:string;city:string;state:string;partners:{name:string;role:string}[];source:string};
export async function lookupCompany(cnpj:string):Promise<Company>{
 const n=cnpj.replace(/[^A-Z0-9]/ig,'').toUpperCase();if(!validCnpj(n))throw Error('CNPJ inválido.');
 const r=await fetch(`https://api.opencnpj.org/${n}`,{headers:{Accept:'application/json','User-Agent':'CarolComponentes/2.3'},signal:AbortSignal.timeout(6500)});
 if(!r.ok)throw Error(r.status===404?'Empresa não localizada.':'Consulta temporariamente indisponível.');
 const d=await r.json() as Record<string,any>;if(!d.razao_social)throw Error('Cadastro indisponível.');
 const clean=(x:unknown)=>String(x||'').replace(/[\r\n<>]/g,' ').slice(0,250);
 return {cnpj:n,legalName:clean(d.razao_social),tradeName:clean(d.nome_fantasia),status:clean(d.situacao_cadastral),city:clean(d.municipio),state:clean(d.uf),partners:(Array.isArray(d.QSA)?d.QSA:[]).slice(0,30).map((s:Record<string,unknown>)=>({name:clean(s.nome_socio),role:clean(s.qualificacao_socio)})),source:'OpenCNPJ — dados públicos cadastrais'};
}
export type Contact={id:string;cnpj:string;phone:string;name:string;source:string;message:string;items:{name:string;variant:string;qty:number}[];company?:Company|null};
export function contactText(p:Contact){const c=p.company;return [
 '*Nova cotação | Carol Componentes*','Atendimento Joinville • Envio para todo o Brasil','',
 '*Empresa*',`CNPJ: ${maskCnpj(p.cnpj)}`,c?`Razão social: ${c.legalName}`:'Cadastro empresarial: consulta indisponível',c?.tradeName?`Nome fantasia: ${c.tradeName}`:'',c?`Situação cadastral: ${c.status}`:'',c?.city?`Localização: ${c.city} / ${c.state}`:'',
 ...(c?.partners.length?['','*Sócios e administradores (cadastro público)*',...c.partners.map(s=>`• ${s.name} — ${s.role}`)]:[]),
 '', '*Contato*',`Nome: ${p.name||'Não informado'}`,`Telefone: ${maskPhone(p.phone)}`,`Interesse: ${p.source}`,
 ...(p.items.length?['','*Componentes da cotação*',...p.items.map((i,n)=>`${n+1}. ${i.qty} × ${i.name}${i.variant?' | '+i.variant:''}`)]:[]),
 '', '*Sua necessidade*',p.message||'Gostaria de conversar com a equipe.', '',`Protocolo: ${p.id.slice(0,8)}`,c?'Dados cadastrais: OpenCNPJ. Sujeitos à atualização da base.':''
 ].filter(x=>x!==undefined).join('\n').replace(/\n{3,}/g,'\n\n');}
export function contactHtml(p:Contact){const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#edf3ef;font-family:Arial,sans-serif;color:#163c35"><main style="max-width:640px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden"><header style="background:#163c35;color:white;padding:28px"><h1 style="margin:0;font-size:24px">Nova cotação</h1><p>Carol Componentes Industriais</p></header><section style="padding:28px;line-height:1.7;white-space:pre-wrap">${esc(contactText(p)).replace(/\*([^*\n]+)\*/g,'<strong>$1</strong>')}</section><footer style="padding:20px 28px;background:#e3eee7">Retorne para ${esc(maskPhone(p.phone))}. Dados enviados para atendimento comercial.</footer></main></body></html>`;}
