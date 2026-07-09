import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { selectSidebarOpen, toggleSidebar, setSidebar } from '@/features/ui/uiSlice';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const { pathname } = useLocation();

  // Auto-close the mobile drawer on navigation
  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      dispatch(setSidebar(false));
    }
  }, [pathname, dispatch]);

  // Lock body scroll only when the drawer is open on mobile/tablet
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (sidebarOpen && isMobile) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [sidebarOpen]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-ink-50/60 via-white to-brand-50/30">
      {/* Subtle decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 -z-10 h-[360px] w-full bg-[radial-gradient(circle_at_30%_0%,rgba(31,68,245,0.06),transparent_60%)]"
      />

      <AdminSidebar open={sidebarOpen} />

      {sidebarOpen && (
        <button
          onClick={() => dispatch(setSidebar(false))}
          className="fixed inset-0 z-20 bg-ink-900/40 backdrop-blur-sm lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <div className="lg:pl-64">
        <AdminTopbar onToggleSidebar={() => dispatch(toggleSidebar())} />
        <main className="p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
