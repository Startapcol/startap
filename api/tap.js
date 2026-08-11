import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Falta el id del negocio');
  }

  const { data: negocio, error } = await supabase
    .from('negocios')
    .select('link_google')
    .eq('id', id)
    .single();

  if (error || !negocio) {
    return res.status(404).send('Negocio no encontrado');
  }

  await supabase.from('taps').insert({ negocio_id: id });

  res.writeHead(302, { Location: negocio.link_google });
  res.end();
}
