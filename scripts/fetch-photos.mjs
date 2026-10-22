/** Refresh the exact, credited assets. The committed assets make normal builds offline. */
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const credits=JSON.parse(await fs.readFile('assets/credits.json','utf8'));
for(const photo of credits){
  const response=await fetch(photo.downloadUrl);
  if(!response.ok)throw new Error(`Photo ${photo.id}: HTTP ${response.status}`);
  const data=Buffer.from(await response.arrayBuffer());
  if(data[0]!==255||data[1]!==216)throw new Error(`Photo ${photo.id}: expected JPEG`);
  const hash=createHash('sha256').update(data).digest('hex');
  if(hash!==photo.sha256)throw new Error(`Photo ${photo.id}: source bytes changed; review before replacing the committed asset`);
  await fs.writeFile('assets/'+photo.file,data);
  console.log('Verified '+photo.id);
}
