import {requireChatGPTUser} from '@/app/chatgpt-auth';
import Validation from './validation';
export default async function Page(){const user=await requireChatGPTUser('/validacao');return <Validation user={user.displayName}/>;}
