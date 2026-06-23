<style>
    :root {
        --bw-dark-green: #1B3D2B;
        --bw-mid-green: #2a5c3f;
        --bw-green: #52A03C;
        --bw-green-light: #6cbf52;
        --bw-topbar-h: 3.75rem;
    }

    /* ---- Motion primitives ---- */
    @keyframes bw-fade-up {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes bw-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes bw-rise {
        from { opacity: 0; transform: translateY(18px) scale(0.985); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes bw-pop {
        from { opacity: 0; transform: scale(0.96) translateY(-4px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes bw-drift {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(4%, -6%) scale(1.08); }
    }

    /* ---- Page transitions (SPA navigation) — quick fade, no jank ---- */
    .fi-page {
        animation: bw-fade-in 0.18s ease-out both;
    }

    .fi-wi > div > * {
        animation: bw-fade-up 0.25s ease-out both;
    }

    .fi-wi > div > *:nth-child(2) { animation-delay: 0.04s; }
    .fi-wi > div > *:nth-child(3) { animation-delay: 0.08s; }
    .fi-wi > div > *:nth-child(4) { animation-delay: 0.12s; }

    /* ---- Topbar: frosted glass ---- */
    .fi-topbar > nav {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        background-color: rgba(255, 255, 255, 0.85) !important;
    }

    .dark .fi-topbar > nav {
        background-color: rgba(17, 24, 39, 0.8) !important;
    }

    /* ---- Sidebar: deep Brighton green ---- */
    .fi-sidebar {
        background: linear-gradient(180deg, #14301f 0%, var(--bw-dark-green) 45%, #16331f 100%) !important;
    }

    .fi-sidebar-header {
        background: transparent !important;
        color: #fff;
        --tw-ring-color: rgba(255, 255, 255, 0.08);
        height: 4.5rem;
    }

    .fi-sidebar-header img {
        filter: brightness(0) invert(1);
    }

    .fi-sidebar-nav {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
        padding-top: 1.75rem !important;
    }

    .fi-sidebar-group {
        gap: 0.5rem !important;
    }

    .fi-sidebar-item-button {
        border-radius: 0.625rem;
        padding: 0.625rem 0.75rem !important;
        transition: background-color 0.15s ease;
    }

    .fi-sidebar-item-button:hover {
        background-color: rgba(255, 255, 255, 0.08) !important;
    }

    .fi-sidebar-item-label {
        color: rgba(255, 255, 255, 0.78) !important;
        transition: color 0.15s ease;
    }

    .fi-sidebar-item-icon {
        color: rgba(255, 255, 255, 0.55) !important;
        transition: color 0.15s ease;
    }

    .fi-sidebar-item-button:hover .fi-sidebar-item-label,
    .fi-sidebar-item-button:hover .fi-sidebar-item-icon {
        color: #fff !important;
    }

    .fi-sidebar-item-active .fi-sidebar-item-button {
        background: rgba(255, 255, 255, 0.1) !important;
    }

    .fi-sidebar-item-active .fi-sidebar-item-label {
        color: #fff !important;
        font-weight: 600;
    }

    .fi-sidebar-item-active .fi-sidebar-item-icon {
        color: var(--bw-green-light) !important;
    }

    /* Desktop collapse toggle inside dark sidebar header */
    .fi-sidebar-header .fi-icon-btn {
        color: rgba(255, 255, 255, 0.6);
    }

    .fi-sidebar-header .fi-icon-btn:hover {
        color: #fff;
    }

    /* ---- Cards, sections, widgets ---- */
    .fi-section,
    .fi-wi-stats-overview-stat,
    .fi-wi-chart,
    .fi-ta-ctn {
        border-radius: 1rem;
        transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
    }

    .fi-wi-stats-overview-stat {
        position: relative;
        overflow: hidden;
    }

    .fi-wi-stats-overview-stat::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(82, 160, 60, 0.06), transparent 55%);
        pointer-events: none;
    }

    .fi-wi-stats-overview-stat:hover,
    .fi-wi-chart:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px -12px rgba(82, 160, 60, 0.35);
        border-color: rgba(82, 160, 60, 0.4);
    }

    /* ---- Buttons & interactive bits ---- */
    .fi-btn {
        transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }

    .fi-btn:hover {
        transform: translateY(-1px);
    }

    .fi-btn:active {
        transform: translateY(0) scale(0.98);
    }

    .fi-btn-color-primary:hover {
        box-shadow: 0 6px 18px -6px rgba(82, 160, 60, 0.55);
    }

    .fi-ta-row {
        transition: background-color 0.15s ease;
    }

    .fi-badge {
        transition: transform 0.15s ease;
    }

    .fi-badge:hover {
        transform: scale(1.05);
    }

    /* ---- Dropdowns (account menu, table actions) ---- */
    .fi-dropdown-panel {
        animation: bw-pop 0.18s cubic-bezier(0.22, 1, 0.36, 1) both;
        transform-origin: top right;
        border-radius: 0.875rem !important;
        box-shadow: 0 18px 45px -18px rgba(27, 61, 43, 0.45) !important;
    }

    .fi-dropdown-list-item {
        border-radius: 0.5rem;
        transition: background-color 0.15s ease, transform 0.15s ease;
    }

    .fi-dropdown-list-item:hover {
        transform: translateX(2px);
    }

    .fi-user-menu .fi-avatar {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 0 0 2px rgba(82, 160, 60, 0.0);
    }

    .fi-user-menu button:hover .fi-avatar,
    .fi-user-menu .fi-avatar:hover {
        transform: scale(1.06);
        box-shadow: 0 0 0 2px rgba(82, 160, 60, 0.55);
    }

    /* ---- Login & auth pages ---- */
    .fi-simple-layout {
        position: relative;
        isolation: isolate;
        background:
            radial-gradient(60rem 38rem at 85% -10%, rgba(108, 191, 82, 0.22), transparent 60%),
            radial-gradient(50rem 34rem at -10% 110%, rgba(82, 160, 60, 0.18), transparent 60%),
            linear-gradient(155deg, #122a1c 0%, var(--bw-dark-green) 48%, #234c33 100%) !important;
    }

    .fi-simple-layout::before,
    .fi-simple-layout::after {
        content: '';
        position: fixed;
        z-index: -1;
        border-radius: 9999px;
        filter: blur(70px);
        animation: bw-drift 16s ease-in-out infinite;
        pointer-events: none;
    }

    .fi-simple-layout::before {
        width: 34rem;
        height: 34rem;
        top: -12rem;
        right: -10rem;
        background: rgba(108, 191, 82, 0.16);
    }

    .fi-simple-layout::after {
        width: 28rem;
        height: 28rem;
        bottom: -10rem;
        left: -8rem;
        background: rgba(82, 160, 60, 0.14);
        animation-delay: -8s;
    }

    .fi-simple-main {
        animation: bw-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        border-radius: 1.25rem !important;
        background-color: rgba(255, 255, 255, 0.97) !important;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow:
            0 30px 60px -25px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.12) !important;
    }

    .dark .fi-simple-main {
        background-color: rgba(17, 24, 39, 0.92) !important;
    }

    /* Default simple-page header replaced by .bw-login-header below */
    .fi-simple-header {
        display: none;
    }

    .bw-login-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding-bottom: 2rem;
    }

    .bw-login-header img {
        height: 3.5rem;
    }

    .dark .bw-login-header img {
        filter: brightness(0) invert(1);
    }

    .bw-login-title {
        font-size: 1.05rem;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--bw-mid-green);
    }

    .dark .bw-login-title {
        color: var(--bw-green-light);
    }

    .fi-simple-main .fi-input-wrp {
        border-radius: 0.75rem;
    }

    .fi-simple-main .fi-btn-color-primary {
        width: 100%;
        border-radius: 0.75rem;
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
        font-weight: 600;
        background: linear-gradient(135deg, var(--bw-green), var(--bw-mid-green));
        transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
    }

    .fi-simple-main .fi-btn-color-primary:hover {
        filter: brightness(1.06);
        box-shadow: 0 10px 24px -8px rgba(82, 160, 60, 0.7);
    }

    /* ============================================================
       MOBILE / TABLET  ≤1023px — sidebar becomes overlay
       ============================================================ */
    @media (max-width: 1023px) {

        /* --- Topbar: fixed to top, correct z-index --- */
        .fi-topbar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 40 !important;
            height: var(--bw-topbar-h) !important;
        }

        .fi-topbar > nav {
            background: linear-gradient(135deg, #14301f, var(--bw-dark-green)) !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            height: var(--bw-topbar-h) !important;
            width: 100% !important;
        }

        /* White logo on dark bg */
        .fi-topbar .fi-brand img {
            filter: brightness(0) invert(1);
            height: 2rem;
        }

        /* Hide text brand name */
        .fi-topbar .fi-brand span,
        .fi-topbar .fi-brand-name {
            display: none !important;
        }

        /* Hamburger / icon buttons white */
        .fi-topbar .fi-icon-btn,
        .fi-topbar button[aria-label] {
            color: rgba(255, 255, 255, 0.8) !important;
        }

        .fi-topbar .fi-icon-btn:hover,
        .fi-topbar button[aria-label]:hover {
            color: #fff !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-radius: 9999px !important;
        }

        /* Avatar ring on dark bg */
        .fi-topbar .fi-user-menu .fi-avatar {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
        }

        /* --- Main content: offset for fixed topbar --- */
        .fi-layout > .fi-main,
        .fi-main {
            padding-top: var(--bw-topbar-h) !important;
            margin-top: 0 !important;
        }

        /* --- Sidebar: below topbar, correct z-index --- */
        .fi-sidebar {
            top: var(--bw-topbar-h) !important;
            height: calc(100vh - var(--bw-topbar-h)) !important;  /* fallback */
            height: calc(100dvh - var(--bw-topbar-h)) !important;
            z-index: 39 !important;
        }

        /* Sidebar overlay/backdrop */
        .fi-sidebar-close-overlay {
            z-index: 38 !important;
            top: var(--bw-topbar-h) !important;
        }

        /* --- Modals: above topbar --- */
        .fi-modal-window {
            z-index: 50 !important;
        }

        /* Modal backdrop */
        .fi-modal-close-overlay,
        .fi-overlay {
            z-index: 49 !important;
        }

        /* --- Notifications: above everything, below topbar top edge --- */
        .fi-notifications {
            position: fixed !important;
            top: calc(var(--bw-topbar-h) + 0.5rem) !important;
            right: 0.75rem !important;
            z-index: 60 !important;
            max-width: calc(100vw - 1.5rem) !important;
        }

        /* Ensure dropdown panels inside topbar render above topbar stacking context */
        .fi-topbar {
            overflow: visible !important;
        }

        .fi-topbar .fi-dropdown-panel {
            z-index: 50 !important;
        }

        /* Reset color inside topbar dropdowns — don't inherit white text on light bg */
        .fi-topbar .fi-dropdown-panel,
        .fi-topbar .fi-dropdown-panel button,
        .fi-topbar .fi-dropdown-panel a,
        .fi-topbar .fi-dropdown-list-item,
        .fi-topbar .fi-dropdown-list-item-label {
            color: unset !important;
        }
    }

    /* ============================================================
       PHONE  ≤640px — stack everything
       ============================================================ */
    @media (max-width: 640px) {

        /* --- Page animations: shorter on slow devices --- */
        .fi-page {
            animation-duration: 0.15s;
        }

        /* --- Page header: stack heading + actions vertically --- */
        .fi-page-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
            padding: 1rem !important;
        }

        .fi-page-header-heading {
            font-size: 1.25rem !important;
        }

        .fi-page-header-actions {
            width: 100% !important;
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
        }

        /* --- Tables: horizontal scroll --- */
        .fi-ta-ctn {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
        }

        .fi-ta-table {
            min-width: 600px;
        }

        /* --- Forms: single column --- */
        .fi-fo-grid,
        .fi-fo-layout-grid {
            grid-template-columns: 1fr !important;
        }

        .fi-fo-field-wrp {
            width: 100% !important;
        }

        /* --- Touch targets: min 44px per WCAG --- */
        .fi-btn {
            min-height: 44px !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
        }

        .fi-icon-btn {
            min-width: 44px !important;
            min-height: 44px !important;
        }

        .fi-sidebar-item-button {
            min-height: 44px !important;
        }

        /* --- Stat widgets: single column --- */
        .fi-wi-stats-overview {
            grid-template-columns: 1fr !important;
        }

        /* Disable hover lift on touch — no hover state on mobile */
        .fi-wi-stats-overview-stat:hover,
        .fi-wi-chart:hover {
            transform: none !important;
            box-shadow: none !important;
        }

        /* --- Section / card padding: tighter on small screens --- */
        .fi-section-content {
            padding: 0.75rem !important;
        }

        .fi-section-header {
            padding: 0.75rem !important;
        }

        /* --- Modal: full-screen minus topbar --- */
        .fi-modal-window {
            position: fixed !important;
            top: var(--bw-topbar-h) !important;
            left: 0 !important;
            height: calc(100vh - var(--bw-topbar-h)) !important;  /* fallback */
            height: calc(100dvh - var(--bw-topbar-h)) !important;
            max-height: calc(100vh - var(--bw-topbar-h)) !important;  /* fallback */
            max-height: calc(100dvh - var(--bw-topbar-h)) !important;
            border-radius: 0 !important;
            margin: 0 !important;
            max-width: 100vw !important;
            width: 100vw !important;
        }

        .fi-modal-content {
            max-height: calc(100vh - var(--bw-topbar-h) - 4rem) !important;  /* fallback */
            max-height: calc(100dvh - var(--bw-topbar-h) - 4rem) !important;
            overflow-y: auto !important;
        }

        /* --- Login page: hide blobs on tiny screens --- */
        .fi-simple-layout::before,
        .fi-simple-layout::after {
            display: none;
        }

        /* --- Notifications: full width on phone --- */
        .fi-notifications {
            right: 0.5rem !important;
            left: 0.5rem !important;
            max-width: 100% !important;
        }
    }

    /* ---- Respect reduced motion ---- */
    @media (prefers-reduced-motion: reduce) {
        .fi-page,
        .fi-header,
        .fi-wi > div > *,
        .fi-dropdown-panel,
        .fi-simple-main,
        .fi-simple-layout::before,
        .fi-simple-layout::after {
            animation: none;
        }

        .fi-section,
        .fi-wi-stats-overview-stat,
        .fi-wi-chart,
        .fi-btn,
        .fi-sidebar-item-button,
        .fi-badge,
        .fi-dropdown-list-item {
            transition: none;
        }
    }
</style>
