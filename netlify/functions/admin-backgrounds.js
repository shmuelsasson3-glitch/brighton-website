import { requireAdmin, adminDb, json } from './_lib/auth.js';

export const config = {
  path: ['/api/admin/backgrounds', '/api/admin/backgrounds/:pageKey'],
};

export default async (req, context) => {
  const user = await requireAdmin(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const db = adminDb();
  const pageKey = context.params.pageKey;

  if (req.method === 'GET') {
    const { data, error } = await db.from('page_backgrounds').select('*').order('label', { ascending: true });
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  if (req.method === 'PUT') {
    if (!pageKey) return json({ error: 'Missing page key' }, 400);
    const body = await req.json();
    const { media_type, media_url } = body;
    if (!media_type || !media_url) return json({ error: 'media_type and media_url are required' }, 400);

    const { data, error } = await db
      .from('page_backgrounds')
      .update({ media_type, media_url })
      .eq('page_key', pageKey)
      .select()
      .single();
    if (error) return json({ error: error.message }, 400);
    return json(data);
  }

  return json({ error: 'Method not allowed' }, 405);
};
