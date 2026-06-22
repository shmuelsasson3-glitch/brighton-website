<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages;
use App\Models\Project;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static ?string $navigationIcon = 'heroicon-o-folder';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'work project';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Hero')
                    ->description('The cover image, title, and tag shown at the top of the project page and on the Our Work grid.')
                    ->icon('heroicon-o-photo')
                    ->schema([
                        Forms\Components\FileUpload::make('cover_image')
                            ->disk('site')
                            ->directory('project-images')
                            ->image()
                            ->imageEditor()
                            ->required()
                            ->columnSpanFull(),
                        Forms\Components\Select::make('cover_image_position')
                            ->label('Image focal point')
                            ->options([
                                'top left'      => 'Top Left',
                                'top center'    => 'Top Center',
                                'top right'     => 'Top Right',
                                'center left'   => 'Center Left',
                                'center center' => 'Center (default)',
                                'center right'  => 'Center Right',
                                'bottom left'   => 'Bottom Left',
                                'bottom center' => 'Bottom Center',
                                'bottom right'  => 'Bottom Right',
                            ])
                            ->default('center center')
                            ->native(false)
                            ->helperText('Controls which part of the cover image stays visible in the hero header.')
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', Str::slug($state ?? ''))),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->prefix('/work/'),
                        Forms\Components\Select::make('category')
                            ->options([
                                'residential' => 'Residential',
                                'commercial' => 'Commercial',
                            ])
                            ->required()
                            ->native(false),
                        Forms\Components\TextInput::make('tag')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Residential - NJ')
                            ->helperText('Shown under the title and on the project card.'),
                        Forms\Components\TextInput::make('location')
                            ->maxLength(255),
                        Forms\Components\Toggle::make('is_published')
                            ->default(true)
                            ->inline(false)
                            ->helperText('Unpublished projects are hidden from the site.'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Overview')
                    ->description('Optional "About the Project" section with up to four stat boxes. It only appears on the page when a body is set.')
                    ->icon('heroicon-o-document-text')
                    ->collapsible()
                    ->collapsed(fn (?Project $record): bool => $record !== null && ! $record->hasOverview())
                    ->schema([
                        Forms\Components\TextInput::make('overview_kicker')
                            ->label('Kicker')
                            ->placeholder('About the Project')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('overview_heading')
                            ->label('Heading')
                            ->placeholder('17 Homes. Fully <em>Landscaped.</em>')
                            ->helperText('Wrap words in <em> for the green accent style.')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('overview_body')
                            ->label('Body')
                            ->rows(5)
                            ->columnSpanFull(),
                        Forms\Components\Repeater::make('stats')
                            ->relationship()
                            ->schema([
                                Forms\Components\TextInput::make('value')->required()->placeholder('200+'),
                                Forms\Components\TextInput::make('label')->required()->placeholder('Trees Installed'),
                            ])
                            ->columns(2)
                            ->orderColumn('sort_order')
                            ->reorderable()
                            ->defaultItems(0)
                            ->maxItems(4)
                            ->addActionLabel('Add stat box')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Gallery')
                    ->description('Photos shown in the project gallery, in order. Drag to reorder.')
                    ->icon('heroicon-o-squares-2x2')
                    ->schema([
                        Forms\Components\Repeater::make('images')
                            ->relationship()
                            ->hiddenLabel()
                            ->schema([
                                Forms\Components\FileUpload::make('path')
                                    ->hiddenLabel()
                                    ->disk('site')
                                    ->directory('project-images')
                                    ->image()
                                    ->imageEditor()
                                    ->required(),
                                Forms\Components\TextInput::make('alt')
                                    ->label('Description (alt text)')
                                    ->maxLength(255),
                            ])
                            ->orderColumn('sort_order')
                            ->reorderable()
                            ->grid(2)
                            ->defaultItems(0)
                            ->addActionLabel('Add photo'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->label('Cover')
                    ->state(fn (Project $record): string => $record->coverUrl())
                    ->size(56)
                    ->square(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Project $record): string => $record->tag),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->color(fn (string $state): string => $state === 'commercial' ? 'info' : 'success'),
                Tables\Columns\ImageColumn::make('gallery')
                    ->state(fn (Project $record): array => $record->images->map->url()->all())
                    ->circular()
                    ->stacked()
                    ->limit(4)
                    ->limitedRemainingText(),
                Tables\Columns\ToggleColumn::make('is_published')
                    ->label('Published'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'residential' => 'Residential',
                        'commercial' => 'Commercial',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('view')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Project $record): string => route('work.show', $record))
                    ->openUrlInNewTab(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->reorderable('sort_order')
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}
