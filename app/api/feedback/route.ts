import {getChatGPTUser} from '@/app/chatgpt-auth';
import {getDb} from '@/db';
import {feedback} from '@/db/schema';
import {eq,desc} from 'drizzle-orm';
export async function GET(){const user=await getChatGPTUser();if(!user)return Response.json({error:'Entre com o ChatGPT.'},{status:401});return Response.json(await getDb().select().from(feedback).where(eq(feedback.userId,user.userId)).orderBy(desc(feedback.createdAt)).limit(100));}
export async function POST(request:Request){const user=await getChatGPTUser();if(!user)return Response.json({error:'Entre com o ChatGPT.'},{status:401});const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Origem inválida.'},{status:403});try{const body=await request.json() as {message?:string;area?:string};const message=String(body.message||'').trim().slice(0,3000);if(message.length<5)return Response.json({error:'Descreva o pedido em pelo menos 5 caracteres.'},{status:400});const row={id:crypto.randomUUID(),userId:user.userId,area:String(body.area||'Geral').slice(0,80),message,createdAt:Date.now()};await getDb().insert(feedback).values(row);return Response.json(row,{status:201});}catch{return Response.json({error:'Não foi possível salvar. Tente novamente.'},{status:503});}}

