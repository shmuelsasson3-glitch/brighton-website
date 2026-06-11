<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->projects() as $order => $data) {
            $project = Project::updateOrCreate(
                ['slug' => $data['slug']],
                collect($data)->except(['stats', 'images'])->merge(['sort_order' => $order + 1])->all()
            );

            $project->stats()->delete();
            foreach ($data['stats'] ?? [] as $statOrder => [$value, $label]) {
                $project->stats()->create(['value' => $value, 'label' => $label, 'sort_order' => $statOrder + 1]);
            }

            $project->images()->delete();
            foreach ($data['images'] as $imageOrder => [$path, $alt]) {
                $project->images()->create(['path' => $path, 'alt' => $alt, 'sort_order' => $imageOrder + 1]);
            }
        }
    }

    private function projects(): array
    {
        return [
            [
                'title' => 'The Toras Aron Project',
                'slug' => 'toras-aron',
                'category' => 'commercial',
                'tag' => 'Commercial - NJ',
                'cover_image' => 'projects/toras-aron/dji_fly_20250821_143958_122_1755801612096_photo_optimized.jpg',
                'overview_kicker' => 'About the Project',
                'overview_heading' => 'A Full Grounds <em>Revamp.</em>',
                'overview_body' => 'Brighton came into Toras Aron at 500 Summer Avenue and brought the entire property back to life. The playground area was fully refreshed, overgrown trees were pruned and cleaned up, and all the mulch beds were stripped and remulched throughout the grounds. The main signage areas were replanted with fresh, clean plantings to give the property a sharp, welcoming look from every angle.',
                'stats' => [
                    ['Full', 'Playground Revamp'],
                    ['Full', 'Tree Pruning'],
                    ['Full', 'Remulch Throughout'],
                    ['All', 'Signage Areas Planted'],
                ],
                'images' => [
                    ['projects/toras-aron/dji_fly_20250821_143958_122_1755801612096_photo_optimized.jpg', 'Toras Aron aerial'],
                    ['projects/toras-aron/dji_fly_20250822_123250_149_1755880471887_photo_optimized.jpg', 'Toras Aron drone view'],
                    ['projects/toras-aron/dji_fly_20250821_140924_114_1755801571465_photo_optimized.jpg', 'Toras Aron grounds'],
                    ['projects/toras-aron/dji_fly_20250821_143708_117_1755801592331_photo_optimized.jpg', 'Toras Aron landscaping'],
                    ['projects/toras-aron/dji_fly_20250821_151246_138_1755803708546_photo_optimized.jpg', 'Toras Aron property'],
                    ['projects/toras-aron/IMG_0613.jpg', 'Toras Aron detail'],
                    ['projects/toras-aron/IMG_0883.jpg', 'Toras Aron detail'],
                ],
            ],
            [
                'title' => 'The Scotch Way Project',
                'slug' => 'scotchway',
                'category' => 'commercial',
                'tag' => 'Commercial - NJ',
                'cover_image' => 'projects/scotchway/dji_fly_20251208_144004_276_1767113993651_photo_optimized.jpg',
                'overview_kicker' => 'About the Project',
                'overview_heading' => '17 Homes. Fully <em>Landscaped.</em>',
                'overview_body' => 'Scotch Way was a large-scale commercial landscape installation across a 17-home development in New Jersey. Brighton came in and transformed bare lots into finished, professional landscapes - planting over 200 trees and bushes, laying full sod across every property, and installing a complete irrigation system throughout the community. Every yard, every bed, every green space - all Brighton. One crew, no subs, start to finish.',
                'stats' => [
                    ['17', 'Homes Completed'],
                    ['200+', 'Trees & Bushes Installed'],
                    ['Full', 'Sod Installation'],
                    ['Full', 'Landscape Beds'],
                ],
                'images' => [
                    ['projects/scotchway/dji_fly_20251208_144004_276_1767113993651_photo_optimized.jpg', 'Scotchway aerial view'],
                    ['projects/scotchway/dji_fly_20251125_152438_214_1764113398629_photo_optimized.jpg', 'Scotchway drone view'],
                    ['projects/scotchway/IMG_6003.jpg', 'Scotchway landscaping'],
                    ['projects/scotchway/IMG_6023.jpg', 'Scotchway landscaping'],
                    ['projects/scotchway/IMG_6378.jpg', 'Scotchway landscaping'],
                    ['projects/scotchway/IMG_6379.jpg', 'Scotchway landscaping'],
                    ['projects/scotchway/IMG_7672.jpg', 'Scotchway landscaping'],
                    ['projects/scotchway/IMG_7673.jpg', 'Scotchway landscaping'],
                ],
            ],
            [
                'title' => 'The Beige Project',
                'slug' => 'beige',
                'category' => 'residential',
                'tag' => 'Residential - NJ',
                'cover_image' => 'projects/beige/finished2_lowangle.jpg',
                'images' => [
                    ['projects/beige/finished2_lowangle.jpg', 'Finished pool - low angle'],
                    ['projects/beige/finished1_aerial.jpg', 'Finished pool - aerial'],
                    ['projects/beige/finished3_edge.jpg', 'Pool edge & pavers'],
                    ['projects/beige/finished4_thujas.jpg', 'Pool & arborvitae privacy'],
                    ['projects/beige/finished5_corner.jpg', 'Pool corner & coping detail'],
                    ['projects/beige/cover_v2.jpg', 'During construction - aerial'],
                    ['projects/beige/laying_v3.jpg', 'Laying pavers'],
                ],
            ],
            [
                'title' => 'The Jacks Way Project',
                'slug' => 'pool-patio',
                'category' => 'residential',
                'tag' => 'Residential - NJ',
                'cover_image' => 'projects/project2/v5_9349.jpg',
                'images' => [
                    ['projects/project2/v5_9349.jpg', 'Finished patio & pergola'],
                    ['projects/project2/v4_9369.jpg', 'Pool & stepping stones'],
                    ['projects/project2/v5_9352.jpg', 'Patio & pergola'],
                    ['projects/project2/v4_5709.jpg', 'Pergola installation in progress'],
                    ['projects/project2/v4_4194.jpg', 'Site work & grading'],
                    ['projects/project2/v5_4183.jpg', 'Before - excavation'],
                ],
            ],
            [
                'title' => 'The Baker Project',
                'slug' => 'baker',
                'category' => 'residential',
                'tag' => 'Residential - NJ',
                'cover_image' => 'projects/baker/p1_night.jpg',
                'images' => [
                    ['projects/baker/p1_night.jpg', 'Finished driveway at dusk - aerial'],
                    ['projects/baker/p2_dusk.jpg', 'Front of home at dusk'],
                    ['projects/baker/p3_finished.jpg', 'Finished paver driveway'],
                    ['projects/baker/p4b.jpg', 'Driveway during installation'],
                    ['projects/baker/p5b.jpg', 'Crew laying pavers'],
                ],
            ],
            [
                'title' => 'The Vanard Project',
                'slug' => 'vanard',
                'category' => 'residential',
                'tag' => 'Residential - Waterfront - NJ',
                'cover_image' => 'projects/vanard/v1_patio.jpg',
                'images' => [
                    ['projects/vanard/v1_patio.jpg', 'Finished waterfront paver patio'],
                    ['projects/vanard/v2_front.jpg', 'Front driveway during installation'],
                    ['projects/vanard/v3b.jpg', 'Hardscape detail'],
                    ['projects/vanard/mls1.jpg', 'Waterfront paver patio'],
                ],
            ],
            [
                'title' => 'Bates Road Project',
                'slug' => 'bates-road',
                'category' => 'residential',
                'tag' => 'Residential - NJ',
                'cover_image' => 'projects/bates-road/cover_fixed2.jpg',
                'images' => [
                    ['projects/bates-road/IMG_5681_fixed.jpg', 'Bates Road - Retaining Wall'],
                    ['projects/bates-road/IMG_5585_fixed.jpg', 'Bates Road - Lawn'],
                    ['projects/bates-road/IMG_5580_fixed.jpg', 'Bates Road - Plantings'],
                    ['projects/bates-road/IMG_5578_fixed.jpg', 'Bates Road - Detail'],
                ],
            ],
            [
                'title' => 'The Arlington Project',
                'slug' => 'arlington',
                'category' => 'residential',
                'tag' => 'Residential - NJ',
                'cover_image' => 'projects/arlington/p1.jpg',
                'images' => [
                    ['projects/arlington/p1.jpg', 'The Arlington Project'],
                    ['projects/arlington/p2.jpg', 'The Arlington Project'],
                    ['projects/arlington/p3.jpg', 'The Arlington Project'],
                    ['projects/arlington/p4.jpg', 'The Arlington Project'],
                    ['projects/arlington/fhff.jpg', 'The Arlington Project'],
                ],
            ],
            [
                'title' => 'The Corner Project',
                'slug' => 'corner',
                'category' => 'residential',
                'tag' => 'Residential - NJ',
                'cover_image' => 'projects/corner/IMG_4196.jpg',
                'images' => [
                    ['projects/corner/IMG_4196.jpg', 'The Corner Project - Finished'],
                    ['projects/corner/IMG_2149.jpg', 'The Corner Project - Cutting'],
                    ['projects/corner/IMG_1752.jpg', 'The Corner Project - Framing'],
                    ['projects/corner/IMG_1424.jpg', 'The Corner Project - Excavation'],
                    ['projects/corner/616ce283-24b2-481e-81e9-dabe28191472.jpg', 'The Corner Project - Foundation'],
                ],
            ],
            [
                'title' => 'The Sukkah Project',
                'slug' => 'sukkah',
                'category' => 'residential',
                'tag' => 'Residential - NJ',
                'cover_image' => 'projects/sukkah/IMG_5980.jpg',
                'images' => [
                    ['projects/sukkah/IMG_5980.jpg', 'The Sukkah Project'],
                    ['projects/sukkah/IMG_6019.jpg', 'The Sukkah Project'],
                    ['projects/sukkah/IMG_6020.jpg', 'The Sukkah Project'],
                    ['projects/sukkah/IMG_6021.jpg', 'The Sukkah Project'],
                ],
            ],
        ];
    }
}
