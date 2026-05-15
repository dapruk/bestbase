import { Link, Outlet } from '@tanstack/react-router';

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <strong>Bestbase</strong>
        <nav>
          <Link to="/">Beranda</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
