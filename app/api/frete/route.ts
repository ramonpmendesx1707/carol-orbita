export function GET(request:Request){
 const cep=new URL(request.url).searchParams.get('cep')||'';
 if(!/^\d{8}$/.test(cep)||/^0{8}$/.test(cep))return Response.json({error:'Informe um CEP válido com 8 dígitos.'},{status:400});
 const prefix=Number(cep.slice(0,5)),region=Number(cep.slice(0,2));
 const local=prefix>=89200&&prefix<=89239;
 const sc=region>=88&&region<=89,south=region>=80&&region<=99;
 return Response.json({simulated:true,name:`${cep.slice(0,5)}-${cep.slice(5)} · ${local?'Joinville / SC':sc?'Santa Catarina':south?'Região Sul':'Brasil'}`,price:local?18.9:sc?29.9:south?39.9:59.9,days:local?'1–2 dias úteis':sc?'2–4 dias úteis':south?'3–6 dias úteis':'5–10 dias úteis'});
}
