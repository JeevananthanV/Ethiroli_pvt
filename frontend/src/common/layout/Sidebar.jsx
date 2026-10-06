import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getNavigationForRole } from './navigationConfig.js';
import { useAppSelector, useAppDispatch } from '../../store/hooks.js';
import { toggleSidebar } from '../../store/slices/uiSlice.js';
import RoleAvatar, { ROLE_LOGO_SRC } from '../components/RoleAvatar/RoleAvatar.jsx';

export default function Sidebar({ role, navItems }) {
  const { user, activeRole } = useAuth();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  const urlRole = useMemo(() => {
    const parts = location.pathname.split('/');
    if (parts[1] === 'app' && parts[2]) {
      const seg = parts[2].toLowerCase();
      if (seg === 'tutor') return 'TUTOR';
      if (seg === 'student') return 'STUDENT';
      if (seg === 'hr') return 'HR';
      if (seg === 'pm') return 'PROJECT_MANAGER';
      if (seg === 'finance') return 'FINANCE';
      if (seg === 'sales') return 'SALES';
      if (seg === 'reception') return 'RECEPTION';
      if (seg === 'intern') return 'INTERN';
      if (seg === 'employee') return 'EMPLOYEE';
      if (seg === 'super-admin') return 'SUPER_ADMIN';
      if (seg === 'admin') return 'ADMIN';
    }
    return null;
  }, [location.pathname]);

  const effectiveRole = role || activeRole || urlRole || user?.role || 'TUTOR';
  const navData = useMemo(() => navItems || getNavigationForRole(effectiveRole), [navItems, effectiveRole]);

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const [expandedGroups, setExpandedGroups] = useState({});

  // Auto-expand group if current path is in that group
  useEffect(() => {
    if (!navData) return;
    const initialOpen = {};
    navData.forEach((item, index) => {
      if (item.children && item.children.some(child => isActive(child.path))) {
        initialOpen[item.label || index] = true;
      }
    });
    setExpandedGroups(prev => {
      const hasNewKeys = Object.keys(initialOpen).some(k => !prev[k]);
      return hasNewKeys ? { ...prev, ...initialOpen } : prev;
    });
  }, [location.pathname, navData]);

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const ICON_MAP = {
    dashboard: 'bi-speedometer2',
    domain: 'bi-building',
    group: 'bi-people',
    admin_panel_settings: 'bi-shield-lock',
    subscriptions: 'bi-card-checklist',
    payments: 'bi-credit-card-2-front',
    contact_mail: 'bi-funnel',
    calendar_month: 'bi-calendar3',
    verified: 'bi-patch-check',
    notifications: 'bi-bell',
    forum: 'bi-chat-dots',
    smart_toy: 'bi-robot',
    hub: 'bi-diagram-3',
    sms: 'bi-chat-left-text',
    code: 'bi-code-slash',
    storefront: 'bi-shop',
    bar_chart: 'bi-bar-chart-line',
    analytics: 'bi-cpu',
    emoji_events: 'bi-trophy',
    monitor_heart: 'bi-activity',
    search: 'bi-search',
    toggle_on: 'bi-toggles',
    tune: 'bi-sliders2',
    storage: 'bi-database',
    backup: 'bi-cloud-arrow-up',
    security: 'bi-shield-shaded',
    history: 'bi-clock-history',
    settings: 'bi-gear',
    person: 'bi-person-circle',
    badge: 'bi-person-badge',
    school: 'bi-mortarboard',
    menu_book: 'bi-book',
    library_books: 'bi-journal-code',
    groups: 'bi-people-fill',
    checklist: 'bi-check2-square',
    schedule: 'bi-clock',
    event_busy: 'bi-calendar-x',
    trending_up: 'bi-graph-up-arrow',
    trending_down: 'bi-graph-down-arrow',
    receipt_long: 'bi-receipt',
    paid: 'bi-cash-coin',
    deal: 'bi-currency-exchange',
    notification_important: 'bi-exclamation-circle',
    folder: 'bi-folder2-open',
    route: 'bi-signpost',
    assignment: 'bi-clipboard-check',
    edit_note: 'bi-pencil-square',
    rate_review: 'bi-star-half',
    work: 'bi-briefcase',
    person_add: 'bi-person-plus',
    exit_to_app: 'bi-box-arrow-right',
    campaign: 'bi-megaphone',
    record_voice_over: 'bi-person-video3',
    description: 'bi-file-earmark-text',
    workspace_premium: 'bi-award',
  };

  const getIconClass = (icon) => {
    if (!icon) return '';
    if (ICON_MAP[icon]) return `bi ${ICON_MAP[icon]}`;
    return icon.startsWith('bi-') ? `bi ${icon}` : `bi bi-${icon}`;
  };

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 992 && sidebarOpen) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="portalSidebarBackdrop d-md-none" 
          onClick={() => dispatch(toggleSidebar())} 
          aria-hidden="true"
        />
      )}

      <nav 
        role="navigation"
        aria-label="Main Navigation"
        className={`portalSidebar ${!sidebarOpen ? 'closed' : ''} ${sidebarOpen ? 'mobileOpen' : ''}`} 
      >
        <div className="portalSidebarHeader">
          <Link to="/" className="portalBrandBox" aria-label="Dashboard Home">
            {/* The employee portal shows the real Ethiroli brand asset used by the
                public site, and the PM portal uses the same lockup as its brand
                tile. Other portals keep their existing icon tile. */}
            {effectiveRole === 'EMPLOYEE' || effectiveRole === 'PROJECT_MANAGER' ? (
              <img
                src={ROLE_LOGO_SRC}
                className="portalBrandLogo"
                alt="Ethiroli"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="portalLogoIcon">
                <i className="bi bi-layers-fill" aria-hidden="true"></i>
              </div>
            )}
            <div>
              <div className="portalBrandName">
                {String(effectiveRole || 'ETHIROLI').replace(/_/g, ' ')}
              </div>
              <span className="portalBrandSubtitle">Enterprise Portal</span>
            </div>
          </Link>
        </div>

        <ul className="portalNavMenu">
          {navData.map((item, index) => {
            const groupKey = item.label || index;
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isGroupOpen = Boolean(expandedGroups[groupKey]);
            const childActive = hasChildren && item.children.some(c => isActive(c.path));
            const subMenuId = `nav-subgroup-${index}`;
            const groupBtnId = `nav-group-btn-${index}`;

            if (hasChildren) {
              return (
                <li key={groupKey} className="nav-item">
                  <button
                    type="button"
                    id={groupBtnId}
                    aria-expanded={isGroupOpen}
                    aria-controls={subMenuId}
                    aria-haspopup="true"
                    onClick={() => toggleGroup(groupKey)}
                    className={`portalNavGroupBtn ${childActive ? 'childActive' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.icon && <i className={`${getIconClass(item.icon)}`} aria-hidden="true"></i>}
                      <span>{item.label}</span>
                    </div>
                    <i 
                      className={`bi bi-chevron-${isGroupOpen ? 'down' : 'right'}`}
                      style={{ fontSize: '0.75rem', opacity: 0.7 }}
                      aria-hidden="true"
                    ></i>
                  </button>

                  {isGroupOpen && (
                    <ul 
                      id={subMenuId}
                      role="group"
                      aria-labelledby={groupBtnId}
                      className="portalNavSubMenu"
                    >
                      {item.children.map((child) => {
                        const active = isActive(child.path);
                        return (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              onClick={handleNavClick}
                              aria-current={active ? 'page' : undefined}
                              className={`portalNavLink ${active ? 'active' : ''}`}
                            >
                              {child.icon && <i className={`${getIconClass(child.icon)}`} style={{ fontSize: '0.85rem' }} aria-hidden="true"></i>}
                              <span>{child.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const singleActive = isActive(item.path);
            return (
              <li key={item.path || index} className="nav-item">
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  aria-current={singleActive ? 'page' : undefined}
                  className={`portalNavLink ${singleActive ? 'active' : ''}`}
                >
                  {item.icon && <i className={`${getIconClass(item.icon)}`} aria-hidden="true"></i>}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User profile footer */}
        {user && (
          <div className="portalSidebarFooter">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RoleAvatar
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--base-olive), var(--base-gold))',
                  color: 'var(--base-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}
                src={user.avatar_url}
                role={effectiveRole}
                name={user.full_name}
                email={user.email}
              />
              <div style={{ overflow: 'hidden', lineHeight: '1.2' }}>
                <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {user.full_name || 'Authenticated User'}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}