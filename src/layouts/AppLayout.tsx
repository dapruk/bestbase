interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <strong>Bestbase</strong>
        <nav>
          <a href="/">Beranda</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
