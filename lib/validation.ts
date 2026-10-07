export function validCnpj(input:string){
 const n=input.toUpperCase().replace(/[.\/\-\s]/g,'');
 if(!/^[A-Z0-9]{12}\d{2}$/.test(n)||/^(.)\1+$/.test(n))return false;
 const digit=(s:string,w:number[])=>{const r=[...s].reduce((v,c,i)=>v+(c.charCodeAt(0)-48)*w[i],0)%11;return r<2?0:11-r};
 const a=digit(n.slice(0,12),[5,4,3,2,9,8,7,6,5,4,3,2]);
 const b=digit(n.slice(0,12)+a,[6,5,4,3,2,9,8,7,6,5,4,3,2]);return n.slice(-2)===`${a}${b}`;
}
const ddds=new Set('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' '));
export function normalizedPhone(s:string){let n=s.replace(/\D/g,'');if(n.length>=12&&n.startsWith('55'))n=n.slice(2);return ddds.has(n.slice(0,2))&&(/^\d{2}[2-5]\d{7}$/.test(n)||/^\d{2}9\d{8}$/.test(n))?n:null;}
export function maskCnpj(input:string){const n=input.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,14);return n.slice(0,2)+(n.length>2?'.'+n.slice(2,5):'')+(n.length>5?'.'+n.slice(5,8):'')+(n.length>8?'/'+n.slice(8,12):'')+(n.length>12?'-'+n.slice(12):'');}
export function maskPhone(input:string){let n=input.replace(/\D/g,'');if(n.length>=12&&n.startsWith('55'))n=n.slice(2);n=n.slice(0,11);if(!n)return '';if(n.length<=2)return '('+n;const split=n.length>10?7:6;return '('+n.slice(0,2)+') '+n.slice(2,split)+(n.length>split?'-'+n.slice(split):'');}
