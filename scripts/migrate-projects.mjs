// One-off migration: seeds the 10 existing hardcoded projects into Supabase.
// Run once after applying supabase/schema.sql:
//   node --env-file=.env scripts/migrate-projects.mjs
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ASSET_BASE = process.env.VITE_ASSET_BASE_URL;

if (!SUPABASE_URL || !SERVICE_KEY || !ASSET_BASE) {
  console.error('Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or VITE_ASSET_BASE_URL in the environment.');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY);

function img(path, alt) {
  return { url: `${ASSET_BASE}/${path}`, alt };
}

const projects = [
  {
    slug: 'toras-aron', title: 'The Toras Aron Project', category: 'commercial', tag: 'Commercial - NJ',
    cover: 'projects/toras-aron/dji_fly_20250821_143958_122_1755801612096_photo_optimized.jpg',
    overview_kicker: 'About the Project',
    overview_heading: 'A Full Grounds <em>Revamp.</em>',
    overview_body: 'Brighton came into Toras Aron at 500 Summer Avenue and brought the entire property back to life. The playground area was fully refreshed, overgrown trees were pruned and cleaned up, and all the mulch beds were stripped and remulched throughout the grounds. The main signage areas were replanted with fresh, clean plantings to give the property a sharp, welcoming look from every angle.',
    stats: [
      { value: 'Full', label: 'Playground Revamp' },
      { value: 'Full', label: 'Tree Pruning' },
      { value: 'Full', label: 'Remulch Throughout' },
      { value: 'All', label: 'Signage Areas Planted' },
    ],
    images: [
      img('projects/toras-aron/dji_fly_20250821_143958_122_1755801612096_photo_optimized.jpg', 'Toras Aron aerial'),
      img('projects/toras-aron/dji_fly_20250822_123250_149_1755880471887_photo_optimized.jpg', 'Toras Aron drone view'),
      img('projects/toras-aron/dji_fly_20250821_140924_114_1755801571465_photo_optimized.jpg', 'Toras Aron grounds'),
      img('projects/toras-aron/dji_fly_20250821_143708_117_1755801592331_photo_optimized.jpg', 'Toras Aron landscaping'),
      img('projects/toras-aron/dji_fly_20250821_151246_138_1755803708546_photo_optimized.jpg', 'Toras Aron property'),
      img('projects/toras-aron/IMG_0613.jpg', 'Toras Aron detail'),
      img('projects/toras-aron/IMG_0883.jpg', 'Toras Aron detail'),
    ],
  },
  {
    slug: 'scotchway', title: 'The Scotch Way Project', category: 'commercial', tag: 'Commercial - NJ',
    cover: 'projects/scotchway/dji_fly_20251208_144004_276_1767113993651_photo_optimized.jpg',
    overview_kicker: 'About the Project',
    overview_heading: '17 Homes. Fully <em>Landscaped.</em>',
    overview_body: "Scotch Way was a large-scale commercial landscape installation across a 17-home development in New Jersey. Brighton came in and transformed bare lots into finished, professional landscapes - planting over 200 trees and bushes, laying full sod across every property, and installing a complete irrigation system throughout the community. Every yard, every bed, every green space - all Brighton. One crew, no subs, start to finish.",
    stats: [
      { value: '17', label: 'Homes Completed' },
      { value: '200+', label: 'Trees & Bushes Installed' },
      { value: 'Full', label: 'Sod Installation' },
      { value: 'Full', label: 'Landscape Beds' },
    ],
    images: [
      img('projects/scotchway/dji_fly_20251208_144004_276_1767113993651_photo_optimized.jpg', 'Scotchway aerial view'),
      img('projects/scotchway/dji_fly_20251125_152438_214_1764113398629_photo_optimized.jpg', 'Scotchway drone view'),
      img('projects/scotchway/IMG_6003.jpg', 'Scotchway landscaping'),
      img('projects/scotchway/IMG_6023.jpg', 'Scotchway landscaping'),
      img('projects/scotchway/IMG_6378.jpg', 'Scotchway landscaping'),
      img('projects/scotchway/IMG_6379.jpg', 'Scotchway landscaping'),
      img('projects/scotchway/IMG_7672.jpg', 'Scotchway landscaping'),
      img('projects/scotchway/IMG_7673.jpg', 'Scotchway landscaping'),
    ],
  },
  {
    slug: 'beige', title: 'The Beige Project', category: 'residential', tag: 'Residential - NJ',
    cover: 'projects/beige/finished2_lowangle.jpg',
    images: [
      img('projects/beige/finished2_lowangle.jpg', 'Finished pool - low angle'),
      img('projects/beige/finished1_aerial.jpg', 'Finished pool - aerial'),
      img('projects/beige/finished3_edge.jpg', 'Pool edge & pavers'),
      img('projects/beige/finished4_thujas.jpg', 'Pool & arborvitae privacy'),
      img('projects/beige/finished5_corner.jpg', 'Pool corner & coping detail'),
      img('projects/beige/cover_v2.jpg', 'During construction - aerial'),
      img('projects/beige/laying_v3.jpg', 'Laying pavers'),
    ],
  },
  {
    slug: 'jacks-way', title: 'The Jacks Way Project', category: 'residential', tag: 'Residential - NJ',
    cover: 'projects/project2/v5_9349.jpg',
    images: [
      img('projects/project2/v5_9349.jpg', 'Finished patio & pergola'),
      img('projects/project2/v4_9369.jpg', 'Pool & stepping stones'),
      img('projects/project2/v5_9352.jpg', 'Patio & pergola'),
      img('projects/project2/v4_5709.jpg', 'Pergola installation in progress'),
      img('projects/project2/v4_4194.jpg', 'Site work & grading'),
      img('projects/project2/v5_4183.jpg', 'Before - excavation'),
    ],
  },
  {
    slug: 'baker', title: 'The Baker Project', category: 'residential', tag: 'Residential - NJ',
    cover: 'projects/baker/p1_night.jpg',
    images: [
      img('projects/baker/p1_night.jpg', 'Finished driveway at dusk - aerial'),
      img('projects/baker/p2_dusk.jpg', 'Front of home at dusk'),
      img('projects/baker/p3_finished.jpg', 'Finished paver driveway'),
      img('projects/baker/p4b.jpg', 'Driveway during installation'),
      img('projects/baker/p5b.jpg', 'Crew laying pavers'),
    ],
  },
  {
    slug: 'vanard', title: 'The Vanard Project', category: 'residential', tag: 'Residential - Waterfront - NJ',
    cover: 'projects/vanard/mls3.jpg',
    images: [
      img('projects/vanard/v1_patio.jpg', 'Finished waterfront paver patio'),
      img('projects/vanard/v2_front.jpg', 'Front driveway during installation'),
      img('projects/vanard/v3b.jpg', 'Hardscape detail'),
      img('projects/vanard/mls1.jpg', 'Waterfront paver patio'),
    ],
  },
  {
    slug: 'bates-road', title: 'Bates Road Project', category: 'residential', tag: 'Residential - NJ',
    cover: 'projects/bates-road/cover_fixed2.jpg',
    images: [
      img('projects/bates-road/IMG_5681_fixed.jpg', 'Bates Road - Retaining Wall'),
      img('projects/bates-road/IMG_5585_fixed.jpg', 'Bates Road - Lawn'),
      img('projects/bates-road/IMG_5580_fixed.jpg', 'Bates Road - Plantings'),
      img('projects/bates-road/IMG_5578_fixed.jpg', 'Bates Road - Detail'),
    ],
  },
  {
    slug: 'arlington', title: 'The Arlington Project', category: 'residential', tag: 'Residential - NJ',
    cover: 'projects/arlington/p1.jpg',
    images: [
      img('projects/arlington/p1.jpg', 'The Arlington Project'),
      img('projects/arlington/p2.jpg', 'The Arlington Project'),
      img('projects/arlington/p3.jpg', 'The Arlington Project'),
      img('projects/arlington/p4.jpg', 'The Arlington Project'),
      img('projects/arlington/fhff.jpg', 'The Arlington Project'),
    ],
  },
  {
    slug: 'corner', title: 'The Corner Project', category: 'residential', tag: 'Residential - NJ',
    cover: 'projects/corner/IMG_4196.jpg',
    images: [
      img('projects/corner/IMG_4196.jpg', 'The Corner Project - Finished'),
      img('projects/corner/IMG_2149.jpg', 'The Corner Project - Cutting'),
      img('projects/corner/IMG_1752.jpg', 'The Corner Project - Framing'),
      img('projects/corner/IMG_1424.jpg', 'The Corner Project - Excavation'),
      img('projects/corner/616ce283-24b2-481e-81e9-dabe28191472.jpg', 'The Corner Project - Foundation'),
    ],
  },
  {
    slug: 'sukkah', title: 'The Sukkah Project', category: 'residential', tag: 'Residential - NJ',
    cover: 'projects/sukkah/IMG_5980.jpg',
    images: [
      img('projects/sukkah/IMG_5980.jpg', 'The Sukkah Project'),
      img('projects/sukkah/IMG_6019.jpg', 'The Sukkah Project'),
      img('projects/sukkah/IMG_6020.jpg', 'The Sukkah Project'),
      img('projects/sukkah/IMG_6021.jpg', 'The Sukkah Project'),
    ],
  },
];

async function run() {
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    console.log(`Inserting ${p.slug}...`);

    const { data: project, error } = await db.from('projects').upsert({
      slug: p.slug,
      title: p.title,
      category: p.category,
      tag: p.tag,
      location: null,
      is_published: true,
      cover_image_url: `${ASSET_BASE}/${p.cover}`,
      cover_image_position: 'center center',
      overview_kicker: p.overview_kicker || null,
      overview_heading: p.overview_heading || null,
      overview_body: p.overview_body || null,
      sort_order: i,
    }, { onConflict: 'slug' }).select().single();

    if (error) {
      console.error(`  FAILED: ${error.message}`);
      continue;
    }

    await db.from('project_stats').delete().eq('project_id', project.id);
    if (p.stats?.length) {
      await db.from('project_stats').insert(
        p.stats.map((s, idx) => ({ project_id: project.id, value: s.value, label: s.label, sort_order: idx })),
      );
    }

    await db.from('project_images').delete().eq('project_id', project.id);
    await db.from('project_images').insert(
      p.images.map((im, idx) => ({ project_id: project.id, url: im.url, alt: im.alt, sort_order: idx })),
    );

    console.log(`  done (${p.images.length} photos${p.stats ? `, ${p.stats.length} stats` : ''})`);
  }
  console.log('Migration complete.');
}

run();
