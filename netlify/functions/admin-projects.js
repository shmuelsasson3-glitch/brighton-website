import { requireAdmin, adminDb, json } from './_lib/auth.js';

export const config = {
  path: ['/api/admin/projects', '/api/admin/projects/:id'],
};

const PROJECT_FIELDS = [
  'slug', 'title', 'category', 'tag', 'location', 'is_published',
  'cover_image_url', 'cover_image_position',
  'overview_kicker', 'overview_heading', 'overview_body', 'sort_order',
];

function pickProjectFields(body) {
  const out = {};
  for (const field of PROJECT_FIELDS) {
    if (body[field] !== undefined) out[field] = body[field];
  }
  return out;
}

async function replaceChildren(db, table, projectId, rows, extraFields) {
  await db.from(table).delete().eq('project_id', projectId);
  if (!rows?.length) return;
  const payload = rows.map((row, i) => ({
    project_id: projectId,
    sort_order: i,
    ...extraFields(row),
  }));
  const { error } = await db.from(table).insert(payload);
  if (error) throw error;
}

export default async (req, context) => {
  const user = await requireAdmin(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const db = adminDb();
  const id = context.params.id;

  if (req.method === 'GET') {
    if (id) {
      const { data, error } = await db
        .from('projects')
        .select('*, project_stats(*), project_images(*)')
        .eq('id', id)
        .single();
      if (error) return json({ error: error.message }, 404);
      return json(data);
    }
    const { data, error } = await db
      .from('projects')
      .select('*, project_stats(*), project_images(*)')
      .order('sort_order', { ascending: true });
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const fields = pickProjectFields(body);

    if (fields.sort_order === undefined) {
      const { data: maxRow } = await db
        .from('projects')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();
      fields.sort_order = (maxRow?.sort_order ?? -1) + 1;
    }

    const { data: project, error } = await db
      .from('projects')
      .insert(fields)
      .select()
      .single();
    if (error) return json({ error: error.message }, 400);

    try {
      await replaceChildren(db, 'project_stats', project.id, body.stats, (s) => ({ value: s.value, label: s.label }));
      await replaceChildren(db, 'project_images', project.id, body.images, (i) => ({ url: i.url, alt: i.alt || null }));
    } catch (err) {
      return json({ error: err.message }, 400);
    }

    return json(project, 201);
  }

  if (req.method === 'PUT') {
    if (!id) return json({ error: 'Missing project id' }, 400);
    const body = await req.json();

    const { data: project, error } = await db
      .from('projects')
      .update(pickProjectFields(body))
      .eq('id', id)
      .select()
      .single();
    if (error) return json({ error: error.message }, 400);

    try {
      if (body.stats !== undefined) {
        await replaceChildren(db, 'project_stats', id, body.stats, (s) => ({ value: s.value, label: s.label }));
      }
      if (body.images !== undefined) {
        await replaceChildren(db, 'project_images', id, body.images, (i) => ({ url: i.url, alt: i.alt || null }));
      }
    } catch (err) {
      return json({ error: err.message }, 400);
    }

    return json(project);
  }

  if (req.method === 'DELETE') {
    if (!id) return json({ error: 'Missing project id' }, 400);
    const { error } = await db.from('projects').delete().eq('id', id);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};
