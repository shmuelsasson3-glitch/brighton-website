import { requireAdmin, adminDb, json } from './_lib/auth.js';

export const config = {
  path: ['/api/admin/videos', '/api/admin/videos/:id'],
};

const VIDEO_FIELDS = ['title', 'video_url', 'thumbnail_url', 'recorded_at', 'sort_order'];

function pickVideoFields(body) {
  const out = {};
  for (const field of VIDEO_FIELDS) {
    if (body[field] !== undefined) out[field] = body[field];
  }
  return out;
}

export default async (req, context) => {
  const user = await requireAdmin(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const db = adminDb();
  const id = context.params.id;

  if (req.method === 'GET') {
    if (id) {
      const { data, error } = await db.from('videos').select('*').eq('id', id).single();
      if (error) return json({ error: error.message }, 404);
      return json(data);
    }
    const { data, error } = await db.from('videos').select('*').order('sort_order', { ascending: true });
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const fields = pickVideoFields(body);

    if (fields.sort_order === undefined) {
      const { data: maxRow } = await db
        .from('videos')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();
      fields.sort_order = (maxRow?.sort_order ?? -1) + 1;
    }

    const { data, error } = await db.from('videos').insert(fields).select().single();
    if (error) return json({ error: error.message }, 400);
    return json(data, 201);
  }

  if (req.method === 'PUT') {
    if (!id) return json({ error: 'Missing video id' }, 400);
    const body = await req.json();
    const { data, error } = await db.from('videos').update(pickVideoFields(body)).eq('id', id).select().single();
    if (error) return json({ error: error.message }, 400);
    return json(data);
  }

  if (req.method === 'DELETE') {
    if (!id) return json({ error: 'Missing video id' }, 400);
    const { error } = await db.from('videos').delete().eq('id', id);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};
