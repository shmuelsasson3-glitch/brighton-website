<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactSubmissionResource\Pages;
use App\Models\ContactSubmission;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;

class ContactSubmissionResource extends Resource
{
    protected static ?string $model = ContactSubmission::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?int $navigationSort = 2;

    public static function getNavigationBadge(): ?string
    {
        $new = static::getModel()::where('status', 'new')->count();

        return $new > 0 ? (string) $new : null;
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Section::make('Contact')
                    ->schema([
                        TextEntry::make('name'),
                        TextEntry::make('phone'),
                        TextEntry::make('email')->copyable(),
                        TextEntry::make('created_at')->dateTime()->label('Received'),
                    ])
                    ->columns(2),
                Section::make('Request')
                    ->schema([
                        TextEntry::make('property_type')->badge(),
                        TextEntry::make('service')->placeholder('Not specified'),
                        TextEntry::make('details')->placeholder('None provided')->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone'),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('property_type')
                    ->badge()
                    ->color(fn (string $state): string => $state === 'commercial' ? 'info' : 'success'),
                Tables\Columns\TextColumn::make('service')
                    ->placeholder('Not specified')
                    ->limit(30),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'warning',
                        'read' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('Received')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(array_combine(ContactSubmission::STATUSES, ContactSubmission::STATUSES)),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->after(fn (ContactSubmission $record) => $record->status === 'new' ? $record->update(['status' => 'read']) : null),
                Tables\Actions\Action::make('archive')
                    ->icon('heroicon-o-archive-box')
                    ->color('gray')
                    ->visible(fn (ContactSubmission $record): bool => $record->status !== 'archived')
                    ->action(fn (ContactSubmission $record) => $record->update(['status' => 'archived'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('markRead')
                        ->label('Mark as read')
                        ->icon('heroicon-o-check')
                        ->action(fn (Collection $records) => $records->each->update(['status' => 'read'])),
                    Tables\Actions\BulkAction::make('archive')
                        ->icon('heroicon-o-archive-box')
                        ->action(fn (Collection $records) => $records->each->update(['status' => 'archived'])),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactSubmissions::route('/'),
        ];
    }
}
