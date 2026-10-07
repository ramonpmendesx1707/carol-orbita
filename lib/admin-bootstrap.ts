// Only server runtime secrets may request an account reset. Revisions are applied once.
export async function applyAdminBootstrap(db:D1Database,secret:string|undefined){
 if(!secret)return;
 const config=JSON.parse(secret) as {username:string;hash:string;revision:string;mustChange:boolean};
 if(!/^[a-zA-Z0-9_.-]{1,64}$/.test(config.username)||!/^[-a-f0-9]{36}:[a-f0-9]{64}$/.test(config.hash)||!config.revision||config.revision.length>100||typeof config.mustChange!=='boolean')throw Error('Configuração administrativa inválida.');
 const applied=await db.prepare('SELECT payload FROM cc_state WHERE id=?').bind('admin-bootstrap').first<{payload:string}>();
 if(applied?.payload===config.revision)return;
 const guard="NOT EXISTS (SELECT 1 FROM cc_state WHERE id='admin-bootstrap' AND payload=?)";
 await db.batch([
  db.prepare(`INSERT INTO cc_state(id,payload) SELECT 'admin',? WHERE ${guard} ON CONFLICT(id) DO UPDATE SET payload=excluded.payload`).bind(JSON.stringify({username:config.username,hash:config.hash,mustChange:config.mustChange}),config.revision),
  db.prepare(`DELETE FROM cc_sessions WHERE ${guard}`).bind(config.revision),
  db.prepare(`DELETE FROM cc_attempts WHERE ${guard}`).bind(config.revision),
  db.prepare('INSERT INTO cc_state(id,payload) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').bind('admin-bootstrap',config.revision),
 ]);
}
