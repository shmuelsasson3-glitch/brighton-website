<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    public static function pages(): array
    {
        return [
            ['/', 'Designing, Building'],
            ['/residential', 'From Vision to'],
            ['/commercial', 'Grounds You Can'],
            ['/commercial-installs', 'New Construction.'],
            ['/sitework', 'The Heavy Work,'],
            ['/snow', 'Commercial Snow Response'],
        ];
    }

    #[DataProvider('pages')]
    public function test_page_renders(string $url, string $marker): void
    {
        $this->get($url)->assertOk()->assertSee($marker);
    }

    public function test_legacy_html_urls_redirect_permanently(): void
    {
        $this->get('/index.html')->assertMovedPermanently()->assertRedirect('/');
        $this->get('/work.html')->assertMovedPermanently()->assertRedirect('/work');
        $this->get('/beige-project.html')->assertMovedPermanently()->assertRedirect('/work/beige');
    }
}
