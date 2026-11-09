import React, { useState } from 'react';
import { Navigate, Outlet, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Yoga Classes', path: '/admin/classes', icon: Calendar },
    { label: 'Blog Posts', path: '/admin/blogs', icon: FileText },
    { label: 'Gallery Photos', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-dark/50 flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-forest text-cream px-4 py-3.5 flex items-center justify-between">
        <span className="font-serif text-xl font-bold tracking-wide">Yog Drishti Admin</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-forest-light"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:flex lg:flex-col w-full lg:w-64 bg-forest-dark text-cream shrink-0 lg:min-h-screen justify-between`}
      >
        <div>
          <div className="hidden lg:block p-6 border-b border-forest-light/30">
            <h1 className="font-serif text-2xl font-bold text-cream">Yog Drishti</h1>
            <p className="text-[11px] uppercase tracking-widest text-gold mt-0.5">
              Management Portal
            </p>
          </div>

          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gold text-forest-dark font-semibold shadow-sm'
                        : 'text-cream/75 hover:bg-forest hover:text-cream'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-forest-light/30 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-cream/75 hover:bg-forest hover:text-cream transition-all"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-red-300 hover:bg-red-950/50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out ({user.email})</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};