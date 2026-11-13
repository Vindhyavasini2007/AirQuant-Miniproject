import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  MapPin,
  TrendingUp,
  History,
  GitCompare,
  HeartPulse,
  Bell,
  Info,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Monitoring', path: '/live', icon: Activity, badge: 'Live' },
    { label: 'India Air Map', path: '/map', icon: MapPin },
    { label: 'AI Predictions', path: '/predictions', icon: TrendingUp, badge: 'ML' },
    { label: 'Historical Analysis', path: '/historical', icon: History },
    { label: 'City Comparison', path: '/compare', icon: GitCompare },
    { label: 'Health Insights', path: '/health', icon: HeartPulse },
    { label: 'Alerts', path: '/alerts', icon: Bell },
    { label: 'About AirQuant', path: '/about', icon: Info },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 bg-white border-r border-charcoal-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Branding */}
        <div className="p-4 border-b border-charcoal-100 flex items-center justify-between">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:bg-forest-900 transition-colors">
              <span className="font-extrabold text-lg text-emerald-400">AQ</span>
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-extrabold text-base tracking-tight text-forest-800 block">
                  AirQuant
                </span>
                <span className="text-[10px] text-charcoal-400 font-semibold tracking-wider uppercase block">
                  India AQ Intelligence
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-charcoal-400 hover:text-forest-800 hover:bg-forest-50 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-2">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                Monitoring Suite
              </span>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                    isActive
                      ? 'bg-forest-800 text-white shadow-sm font-semibold'
                      : 'text-charcoal-600 hover:bg-forest-50 hover:text-forest-800'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-emerald-400'
                          : 'text-charcoal-500 group-hover:text-forest-700'
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-400/20 text-emerald-300'
                            : 'bg-forest-100 text-forest-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                Public Gateway
              </span>
            )}
          </div>

          <NavLink
            to="/"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-charcoal-500 hover:text-forest-800 hover:bg-forest-50 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Return to Landing Page"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-charcoal-400" />
            {!collapsed && <span>Landing Page View</span>}
          </NavLink>
        </div>

        {/* Bottom Platform Status Pill */}
        <div className="p-3 border-t border-charcoal-100 bg-[#F8FAF9]/80">
          {!collapsed ? (
            <div className="p-3 rounded-xl bg-white border border-charcoal-200/80 shadow-subtle">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-bold text-charcoal-800">
                  Telemetry Active
                </span>
              </div>
              <p className="text-[10px] text-charcoal-500 leading-tight">
                Simulated feed for 15 Indian metro CAAQMS stations.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="Telemetry Feed Active">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

