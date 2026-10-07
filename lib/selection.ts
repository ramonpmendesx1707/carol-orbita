import type {Product} from './catalog';
export type SelectionItem={key:string;id:number;variant:string;qty:number};
// A saved product is a request for guidance until its measure is selected.
// Explicit quote lines take precedence over the saved product placeholder.
export function buildSelection(products:Product[],quotes:SelectionItem[],saved:number[]):SelectionItem[]{
 const available=new Set(products.map(p=>p.id));
 const specified=new Set(quotes.filter(q=>q.variant).map(q=>q.id));
 const seen=new Set<string>();
 const result=quotes.filter(q=>available.has(q.id)&&(!specified.has(q.id)||!!q.variant)).filter(q=>{if(seen.has(q.key))return false;seen.add(q.key);return true});
 const included=new Set(result.map(q=>q.id));
 for(const id of saved){if(available.has(id)&&!included.has(id)){result.push({key:`${id}:`,id,variant:'',qty:1});included.add(id)}}
 return result;
}
