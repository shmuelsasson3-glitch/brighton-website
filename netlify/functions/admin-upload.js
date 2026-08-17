import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { requireAdmin, json } from './_lib/auth.js';

export const config = {
  path: '/api/admin/upload',
};

const CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function sanitizeSegment(segment) {
  return segment.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').toLowerCase();
}

// Returns a short-lived presigned PUT URL so the browser can upload the image
// file directly to R2, bypassing the function's request-size limit.
export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const user = await requireAdmin(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { filename, contentType, folder } = await req.json();

  if (!filename || !contentType || !folder) {
    return json({ error: 'filename, contentType, and folder are required' }, 400);
  }
  if (!CONTENT_TYPES.has(contentType)) {
    return json({ error: 'Unsupported content type' }, 400);
  }

  const ext = filename.split('.').pop();
  const safeFolder = folder.split('/').map(sanitizeSegment).join('/');
  const safeBase = sanitizeSegment(filename.replace(/\.[^.]+$/, ''));
  const key = `${safeFolder}/${Date.now()}-${safeBase}.${sanitizeSegment(ext)}`;

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 300 },
  );

  return json({ uploadUrl, publicUrl: `${process.env.R2_PUBLIC_URL}/${key}` });
};
