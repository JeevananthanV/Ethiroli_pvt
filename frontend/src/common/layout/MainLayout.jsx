import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { globalSearch } from '../../services/api/searchApi.js';
import { useAppSelector, useAppDispatch } from '../../store/hooks.js';
import { getFeed, markRead } from '../../services/api/feedApi.js';
import { fetchFeedSuccess, markFeedItemRead } from '../../store/slices/feedSlice.js';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';
import FeedItemDetail from './FeedItemDetail.jsx';

export default function MainLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const feedItems = useAppSelector((state) => state.feed.items);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], leads: [] });

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await getFeed();
        dispatch(fetchFeedSuccess(data));
      } catch (err) {
        console.error('Failed to load feed:', err);
      }
    };
    loadFeed();
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ users: [], leads: [] });
        return;
      }
      try {
        const data = await globalSearch(searchQuery);
        setSearchResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, searchQuery.trim() ? 300 : 0);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleMarkAsRead = async (id) => {
    try {
      await markRead(id);
      dispatch(markFeedItemRead(id));
    } catch (err) {
      console.error(err);
    }
  };

  const [feedOpen, setFeedOpen] = useState(false);
  const unreadFeedCount = feedItems.filter((item) => !item.is_read).length;

  /**
   * The feed row whose full record is open, or null.
   *
   * Scoped to the EMPLOYEE role on purpose. The Activity Feed tray is shared by
   * every portal, and the request was to make clicking a notification open the
   * message - for the employee portal only. Gating on the active role keeps every
   * other portal's tray byte-for-byte identical in behaviour: their rows stay
   * plain text with no click handler and no dialog.
   */
  const [selectedFeedItem, setSelectedFeedItem] = useState(null);

  const isEmployeePortal = (() => {
    try {
      const storedRole = localStorage.getItem('active_role');
      if (storedRole) return String(storedRole).toUpperCase() === 'EMPLOYEE';
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return false;
      return String(JSON.parse(storedUser)?.role || '').toUpperCase() === 'EMPLOYEE';
    } catch {
      return false;
    }
  })();

  const openFeedItem = useCallback(
    (item) => {
      if (!isEmployeePortal) return;
      setSelectedFeedItem(item);
    },
    [isEmployeePortal]
  );

  return (
    <div className="layoutContainer">
      <Sidebar />

      <div className={`mainWrapper ${sidebarOpen ? 'sidebarOpen' : ''}`}>
        <Navbar
          onSearchClick={() => setSearchOpen(true)}
          onToggleFeed={() => setFeedOpen((prev) => !prev)}
          unreadFeedCount={unreadFeedCount}
        />

        <div className="contentArea">
          <main className="mainContent" role="main">
            <Outlet />
          </main>
        </div>
      </div>

      {feedOpen && (
        <div 
          className="feedBackdrop" 
          onClick={() => setFeedOpen(false)} 
          aria-hidden="true" 
        />
      )}

      <aside className={`activityFeedTray ${feedOpen ? 'open' : ''}`} aria-label="Activity Feed">
        <div className="feedHeader">
          <div className="d-flex align-items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-bell-fill" style={{ color: 'var(--color-primary)' }}></i>
            <h3 style={{ margin: 0 }}>Activity Feed</h3>
            {unreadFeedCount > 0 && (
              <span className="badge" style={{ backgroundColor: 'var(--color-secondary)', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>
                {unreadFeedCount} new
              </span>
            )}
          </div>
          <button 
            type="button" 
            className="closeBtn" 
            onClick={() => setFeedOpen(false)}
            aria-label="Close activity feed"
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            &times;
          </button>
        </div>
        <div className="feedBody">
          {feedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-muted)' }}>
              <i className="bi bi-inbox" style={{ fontSize: '2rem', opacity: 0.5, display: 'block', marginBottom: '8px' }}></i>
              <p className="emptyFeed" style={{ margin: 0 }}>No recent activity.</p>
            </div>
          ) : (
            feedItems.map((item) => (
              // For the employee portal the whole row opens the full record; for
              // every other role this renders exactly as it did before.
              <div
                key={item.id}
                className={`feedItem ${!item.is_read ? 'unreadItem' : ''}${isEmployeePortal ? ' feedItem--clickable' : ''}`}
                {...(isEmployeePortal
                  ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': `Open notification: ${item.payload?.message || item.event_type}`,
                    onClick: () => openFeedItem(item),
                    onKeyDown: (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openFeedItem(item);
                      }
                    },
                  }
                  : {})}
              >
                <p className="feedText">{item.payload?.message || `Event: ${item.event_type}`}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span className="feedTime">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {!item.is_read && (
                    <button
                      className="readBtn"
                      onClick={(e) => {
                        // Otherwise the row's own click handler also fires and the
                        // detail dialog opens behind the "mark as read" intent.
                        e.stopPropagation();
                        handleMarkAsRead(item.id);
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {isEmployeePortal && (
        <FeedItemDetail
          item={selectedFeedItem}
          onClose={() => setSelectedFeedItem(null)}
          onMarkRead={handleMarkAsRead}
        />
      )}

      {searchOpen && (
        <div className="overlay" onClick={() => setSearchOpen(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Global Search</h3>
              <button className="closeBtn" onClick={() => setSearchOpen(false)}>&times;</button>
            </div>
            <div className="modalBody">
              <input
                type="text"
                placeholder="Search users or leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="inputField"
                autoFocus
              />
              <div className="searchResults">
                {searchResults.users.length > 0 && (
                  <div className="resultGroup">
                    <h4>Users</h4>
                    {searchResults.users.map((u) => (
                      <div key={u.id} className="resultItem" onClick={() => { setSearchOpen(false); navigate('/users'); }}>
                        <span>{u.full_name} ({u.role})</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.leads.length > 0 && (
                  <div className="resultGroup">
                    <h4>Leads</h4>
                    {searchResults.leads.map((l) => (
                      <div key={l.id} className="resultItem" onClick={() => { setSearchOpen(false); navigate('/leads'); }}>
                        <span>{l.name} - {l.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.users.length === 0 && searchResults.leads.length === 0 && (
                  <p className="noResults">No matches found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}