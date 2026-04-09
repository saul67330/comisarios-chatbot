const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const filesMap = {
  '668642483_1620991746049453_1462197477988922705_n.jpg': 'profile.jpg',
  '619593984_1560248042123824_5224937885015267337_n.jpg': 'cover.jpg',
  '618008311_1560248312123797_7505061636002488855_n.jpg': 'evento_quinceanera.jpg'
};

const dir = 'd:\\Desarrollo De Software\\Imagenes';

async function main() {
  for (const [orig, newName] of Object.entries(filesMap)) {
    const fullPath = path.join(dir, orig);
    console.log(`\nFile: ${orig}`);
    
    // Upload logic
    const fileBuffer = fs.readFileSync(fullPath);
    const uploadName = `real/${newName}`;
    
    console.log(`Uploading as ${uploadName}`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('public_assets')
      .upload(uploadName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading', uploadError);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from('public_assets')
      .getPublicUrl(uploadName);
    
    console.log(`URL: ${urlData.publicUrl}`);
  }
}

main();
