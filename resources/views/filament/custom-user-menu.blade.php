@php
    $user = filament()->auth()->user();
    $name  = $user?->name  ?? 'User';
    $email = $user?->email ?? '';
    $initial = strtoupper(substr($name, 0, 1));
@endphp

<div
    class="bw-um"
    x-data="{
        open: false,
        mode: localStorage.getItem('filamentColorScheme') ?? 'system',
        setMode(m) {
            this.mode = m;
            localStorage.setItem('filamentColorScheme', m);
            if (m === 'dark') {
                document.documentElement.classList.add('dark');
            } else if (m === 'light') {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.toggle('dark',
                    window.matchMedia('(prefers-color-scheme: dark)').matches);
            }
        }
    }"
    @click.outside="open = false"
    @keydown.escape.window="open = false"
>
    {{-- ── Trigger ── --}}
    <button
        type="button"
        class="bw-um-trigger"
        @click="open = !open"
        :aria-expanded="open.toString()"
        aria-haspopup="true"
        aria-label="Account menu"
    >
        <span class="bw-um-avatar" aria-hidden="true">{{ $initial }}</span>
    </button>

    {{-- ── Panel ── --}}
    <div
        class="bw-um-panel"
        x-show="open"
        x-cloak
        x-transition:enter="bw-um-enter"
        x-transition:enter-start="bw-um-enter-from"
        x-transition:enter-end="bw-um-enter-to"
        x-transition:leave="bw-um-leave"
        x-transition:leave-start="bw-um-leave-from"
        x-transition:leave-end="bw-um-leave-to"
        role="menu"
    >
        {{-- User info --}}
        <div class="bw-um-header">
            <p class="bw-um-name">{{ $name }}</p>
            @if($email)
                <p class="bw-um-email">{{ $email }}</p>
            @endif
        </div>

        <div class="bw-um-sep" role="separator"></div>

        {{-- View website --}}
        <a href="/" target="_blank" rel="noopener noreferrer" class="bw-um-item" role="menuitem">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            View website
            <svg class="bw-um-ext" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
        </a>

        <div class="bw-um-sep" role="separator"></div>

        {{-- Colour mode --}}
        <div class="bw-um-modes">
            <div class="bw-um-modes-btns" role="group" aria-label="Colour mode">
                <button type="button" class="bw-um-mode-btn" :class="{ 'bw-um-mode-btn--on': mode === 'light' }" @click="setMode('light')" title="Light">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    <span>Light</span>
                </button>
                <button type="button" class="bw-um-mode-btn" :class="{ 'bw-um-mode-btn--on': mode === 'dark' }" @click="setMode('dark')" title="Dark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <span>Dark</span>
                </button>
                <button type="button" class="bw-um-mode-btn" :class="{ 'bw-um-mode-btn--on': mode === 'system' }" @click="setMode('system')" title="System">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                    <span>System</span>
                </button>
            </div>
        </div>

        <div class="bw-um-sep" role="separator"></div>

        {{-- Log out --}}
        <form method="POST" action="{{ filament()->getLogoutUrl() }}">
            @csrf
            <button type="submit" class="bw-um-item bw-um-item--danger" role="menuitem">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                Sign out
            </button>
        </form>
    </div>
</div>
