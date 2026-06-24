<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BlockedIpResource\Pages;
use App\Models\BlockedIp;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BlockedIpResource extends Resource
{
    protected static ?string $model = BlockedIp::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-exclamation';

    protected static ?string $navigationLabel = 'Blocked IPs';

    protected static ?int $navigationSort = 10;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('ip')
                    ->label('IP Address')
                    ->required()
                    ->maxLength(45),
                TextInput::make('reason')
                    ->nullable(),
                DateTimePicker::make('blocked_until')
                    ->label('Block Until')
                    ->helperText('Leave empty for permanent block.')
                    ->nullable(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('ip')
                    ->label('IP Address')
                    ->searchable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('reason')
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('blocked_until')
                    ->label('Block Until')
                    ->dateTime()
                    ->placeholder('Permanent')
                    ->sortable(),
                Tables\Columns\IconColumn::make('active')
                    ->label('Active')
                    ->boolean()
                    ->getStateUsing(fn (BlockedIp $record): bool => $record->isActive()),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Blocked At')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\Filter::make('active')
                    ->label('Active blocks only')
                    ->query(fn ($query) => $query->where(
                        fn ($q) => $q->whereNull('blocked_until')->orWhere('blocked_until', '>', now())
                    )),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('unblock')
                    ->label('Unblock')
                    ->icon('heroicon-o-lock-open')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (BlockedIp $record) => $record->delete()),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()->label('Unblock selected'),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBlockedIps::route('/'),
            'create' => Pages\CreateBlockedIp::route('/create'),
            'edit' => Pages\EditBlockedIp::route('/{record}/edit'),
        ];
    }
}
