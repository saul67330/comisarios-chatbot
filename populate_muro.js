const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const dir = 'd:\\Desarrollo De Software\\Imagenes\\Eventos';
const files = fs.readdirSync(dir);

const profileUrl = 'https://kkqphhhejfgvdnycabqt.supabase.co/storage/v1/object/public/public_assets/real/evento_quinceanera.jpg';

const captions = [
  "¡Qué gran ambiente se vivió anoche! Gracias a todos por sus muestras de cariño y por bailar con nosotros. #ComisariosDelNorte",
  "Puro estilo norteño sax. Preparándonos para las próximas fechas de este mes. ¡No se lo pierdan!",
  "Un pequeño recuerdo del evento del fin de semana. ¡La pista nunca estuvo sola! Gracias por la invitación.",
  "Afiliando los instrumentos para darles lo mejor. El sonido de los Comisarios no se detiene.",
  "Gracias a toda nuestra gente que nos sigue a cada rincón. Ustedes son el alma de este grupo.",
  "Celebrando la música y la tradición. ¡Puro Comisarios Del Norte, compadre!"
];

async function main() {
  let i = 0;
  for (const f of files) {
    if (!f.endsWith('.jpg')) continue;
    
    const fullPath = path.join(dir, f);
    const fileBuffer = fs.readFileSync(fullPath);
    const uploadName = `real/muro/${f}`;
    
    console.log(`Uploading ${f}...`);
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
    
    const imageUrl = urlData.publicUrl;
    console.log(`URL: ${imageUrl}`);

    const caption = captions[i % captions.length];
    const likes = Math.floor(Math.random() * 500) + 100;
    const comments = Math.floor(Math.random() * 50) + 10;
    const shares = Math.floor(Math.random() * 30) + 5;

    console.log("Inserting post...");
    const { error: dbError } = await supabase.from('feed_posts').insert({
      author_name: 'Comisarios Del Norte',
      author_avatar_url: profileUrl,
      content: caption,
      image_url: imageUrl,
      event_location: 'Coahuila, México',
      likes_count: likes,
      comments_count: comments,
      shares_count: shares
    });

    if (dbError) console.error("DB Error", dbError);
    i++;
  }
  console.log("Done!");
}

main();
