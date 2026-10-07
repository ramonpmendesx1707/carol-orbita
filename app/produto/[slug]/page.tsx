import Experience from '@/app/experience';
import {products,shortName} from '@/lib/catalog';
import {notFound} from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=products.find(p=>p.slug===slug);return {title:p?`${shortName(p)} | Carol Componentes`:'Produto não encontrado',description:p?.summary};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!products.some(p=>p.slug===slug))notFound();return <Experience initialProduct={slug}/>}
