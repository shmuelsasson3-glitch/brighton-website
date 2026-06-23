<div
    class="bw-color-toggle"
    x-data="{
        mode: localStorage.getItem('filamentColorScheme') ?? 'system',
        init() {
            this.apply(this.mode);
        },
        next() {
            const order = ['light', 'dark', 'system'];
            this.mode = order[(order.indexOf(this.mode) + 1) % order.length];
            localStorage.setItem('filamentColorScheme', this.mode);
            this.apply(this.mode);
        },
        apply(m) {
            if (m === 'dark') {
                document.documentElement.classList.add('dark');
            } else if (m === 'light') {
                document.documentElement.classList.remove('dark');
            } else {
                const sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', sys);
            }
        }
    }"
>
    <button
        type="button"
        x-on:click="next()"
        class="bw-color-toggle-btn"
        :title="mode.charAt(0).toUpperCase() + mode.slice(1) + ' mode'"
        aria-label="Toggle colour mode"
    >
        {{-- Sun: light mode --}}
        <svg x-show="mode === 'light'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
        {{-- Moon: dark mode --}}
        <svg x-show="mode === 'dark'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        {{-- Monitor: system mode --}}
        <svg x-show="mode === 'system'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
    </button>
</div>
