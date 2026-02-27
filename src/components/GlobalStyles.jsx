const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,400;1,14..32,600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* Force Inter across every element — overrides any inline font-family */
    *, *::before, *::after, h1, h2, h3, h4, h5, h6, p, span, button, input, select, textarea, label, a {
      font-family: 'Inter', sans-serif !important;
      font-optical-sizing: auto;
    }

    body {
      font-family: 'Inter', sans-serif;
      font-optical-sizing: auto;
      background: #faf8f5;
      color: #1a1a1a;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e2ddd8; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: #c9c3bc; }

    /* ── Keyframes ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes waveBar {
      0%,100% { transform: scaleY(1); }
      50%      { transform: scaleY(1.8); }
    }

    .page-enter { animation: fadeUp 0.3s cubic-bezier(.4,0,.2,1) both; }
    .msg-enter  { animation: fadeUp 0.18s cubic-bezier(.4,0,.2,1) both; }

    /* ── Sidebar nav pill ── */
    .nav-item {
      display: flex; align-items: center; gap: 11px;
      padding: 9px 14px; border-radius: 10px;
      cursor: pointer; transition: all .15s;
      color: #7a7169; font-size: 13.5px; font-weight: 500;
      border: none; background: none; width: 100%; text-align: left;
      font-family: 'Inter', sans-serif;
    }
    .nav-item:hover  { background: #f0ede9; color: #1a1a1a; }
    .nav-item.active { background: #1a1a1a; color: #fff; }
    .nav-item.active svg { color: #fff; }

    /* ── Cards ── */
    .panel {
      background: #fff;
      border-radius: 18px;
      border: 1px solid #ede9e4;
      box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.04);
    }

    /* ── Stat card ── */
    .stat-card {
      background: #fff; border-radius: 16px;
      border: 1px solid #ede9e4; padding: 20px 22px;
      box-shadow: 0 1px 3px rgba(0,0,0,.04);
    }

    /* ── Table row hover ── */
    .trow { transition: background .12s; cursor: default; }
    .trow:hover { background: #faf8f5 !important; }

    /* ── Input ── */
    .field-input {
      width: 100%; background: #faf8f5;
      border: 1.5px solid #ede9e4; border-radius: 10px;
      padding: 10px 14px; font-size: 14px;
      outline: none; transition: border .18s, background .18s;
      font-family: 'Inter', sans-serif; color: #1a1a1a;
    }
    .field-input:focus  { background: #fff; border-color: #1a1a1a; }
    .field-input:disabled { color: #a09890; cursor: not-allowed; }

    /* ── Buttons ── */
    .btn-dark {
      display: inline-flex; align-items: center; gap: 7px;
      background: #1a1a1a; color: #fff; border: none;
      border-radius: 10px; padding: 10px 18px;
      font-weight: 600; font-size: 13.5px; cursor: pointer;
      transition: opacity .15s; font-family: 'Inter', sans-serif;
    }
    .btn-dark:hover   { opacity: .82; }
    .btn-dark:active  { opacity: .7; }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 7px;
      background: #f0ede9; color: #1a1a1a; border: none;
      border-radius: 10px; padding: 10px 18px;
      font-weight: 600; font-size: 13.5px; cursor: pointer;
      transition: background .15s; font-family: 'Inter', sans-serif;
    }
    .btn-ghost:hover { background: #e6e2dd; }

    /* ── Badge ── */
    .badge {
      display: inline-flex; align-items: center;
      padding: 2px 9px; border-radius: 99px;
      font-size: 11.5px; font-weight: 600;
    }
    .badge-green  { background: #e8f5e9; color: #2e7d32; }
    .badge-amber  { background: #fff8e1; color: #e65100; }
    .badge-red    { background: #fce4ec; color: #c62828; }
    .badge-blue   { background: #e3f2fd; color: #1565c0; }
    .badge-purple { background: #f3e5f5; color: #6a1b9a; }
    .badge-gray   { background: #f5f5f5; color: #616161; }

    /* ── Search ── */
    .search-wrap { position: relative; }
    .search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #b0a89e; }
    .search-input {
      width: 100%; background: #f0ede9; border: 1.5px solid transparent;
      border-radius: 10px; padding: 9px 14px 9px 36px; font-size: 13.5px;
      outline: none; transition: all .18s;
      font-family: 'Inter', sans-serif; color: #1a1a1a;
    }
    .search-input:focus { background: #fff; border-color: #1a1a1a; }
    .search-input::placeholder { color: #b0a89e; }

    /* ── Chat bubbles ── */
    .bubble-me {
      background: #1a1a1a; color: #fff;
      border-radius: 16px 4px 16px 16px;
      max-width: 62%; padding: 10px 14px;
      font-size: 13.5px; line-height: 1.55;
      align-self: flex-end; word-break: break-word;
    }
    .bubble-them {
      background: #fff; color: #1a1a1a;
      border: 1px solid #ede9e4;
      border-radius: 4px 16px 16px 16px;
      max-width: 62%; padding: 10px 14px;
      font-size: 13.5px; line-height: 1.55;
      align-self: flex-start; word-break: break-word;
    }

    /* ── Select ── */
    .field-select {
      background: #faf8f5; border: 1.5px solid #ede9e4;
      border-radius: 10px; padding: 10px 14px; font-size: 13.5px;
      outline: none; cursor: pointer;
      font-family: 'Inter', sans-serif; color: #1a1a1a;
    }
    .field-select:focus { border-color: #1a1a1a; }

    /* ── Toggle switch ── */
    .toggle-track {
      width: 40px; height: 22px; border-radius: 99px;
      border: none; cursor: pointer;
      position: relative; transition: background .2s; flex-shrink: 0;
    }
    .toggle-thumb {
      width: 16px; height: 16px; border-radius: 50%; background: #fff;
      position: absolute; top: 3px; transition: left .2s;
      box-shadow: 0 1px 4px rgba(0,0,0,.2);
    }

    /* ── Wave bars for voice ── */
    .wave-bar {
      width: 3px; border-radius: 2px;
      animation: waveBar var(--d,.5s) ease-in-out infinite;
    }
    .rec-dot { animation: pulse 1.2s infinite; }

    /* ── Compose pill ── */
    .compose-btn {
      width: 100%; background: #1a1a1a; color: #fff;
      border: none; border-radius: 12px; padding: 12px 18px;
      font-size: 13.5px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      font-family: 'Inter', sans-serif; transition: opacity .15s;
    }
    .compose-btn:hover { opacity: .82; }

    /* ── List row (email style) ── */
    .list-row {
      display: flex; align-items: center; gap: 14px;
      padding: 13px 18px; cursor: pointer;
      border-bottom: 1px solid #f5f2ee;
      transition: background .12s;
    }
    .list-row:hover { background: #faf8f5; }
    .list-row.active { background: #f5f2ee; }
    .list-row:last-child { border-bottom: none; }

    /* ── Section heading ── */
    .section-label {
      font-size: 10.5px; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; color: #b0a89e; padding: 8px 6px 4px;
    }

    /* ── Page title ── */
    .page-title {
      font-family: 'Inter', sans-serif;
      font-size: 26px; font-weight: 700;
      color: #1a1a1a; letter-spacing: -0.5px;
    }
  `}</style>
);

export default GlobalStyles;