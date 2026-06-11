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

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Content';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Project')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', Str::slug($state ?? ''))),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->helperText('Used in the page URL: /work/{slug}'),
                        Forms\Components\Select::make('category')
                            ->options([
                                'residential' => 'Residential',
                                'commercial' => 'Commercial',
                            ])
                            ->required(),
                        Forms\Components\TextInput::make('tag')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Residential - NJ')
                            ->helperText('Shown on the project card and hero.'),
                        Forms\Components\TextInput::make('location')
                            ->maxLength(255),
                        Forms\Components\FileUpload::make('cover_image')
                            ->image()
                            ->directory('project-images')
                            ->required(),
                        Forms\Components\Toggle::make('is_published')
                            ->default(true),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Overview')
                    ->description('Optional. The overview section only appears when a body is set.')
                    ->schema([
                        Forms\Components\TextInput::make('overview_kicker')
                            ->placeholder('About the Project')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('overview_heading')
                            ->placeholder('17 Homes. Fully <em>Landscaped.</em>')
                            ->helperText('Supports <em> for the accent style.')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('overview_body')
                            ->rows(5),
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
                            ->maxItems(4),
                    ]),

                Forms\Components\Section::make('Gallery')
                    ->schema([
                        Forms\Components\Repeater::make('images')
                            ->relationship()
                            ->schema([
                                Forms\Components\FileUpload::make('path')
                                    ->image()
                                    ->directory('project-images')
                                    ->required(),
                                Forms\Components\TextInput::make('alt')
                                    ->label('Alt text')
                                    ->maxLength(255),
                            ])
                            ->orderColumn('sort_order')
                            ->reorderable()
                            ->grid(2)
                            ->defaultItems(0),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->state(fn (Project $record): string => $record->coverUrl()),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->badge()
                    ->color(fn (string $state): string => $state === 'commercial' ? 'info' : 'success'),
                Tables\Columns\TextColumn::make('images_count')
                    ->counts('images')
                    ->label('Photos'),
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
