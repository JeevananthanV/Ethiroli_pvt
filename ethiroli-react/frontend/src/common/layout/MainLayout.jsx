import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { globalSearch } from '../../services/api/searchApi.js';
import { useAppSelector, useAppDispatch } from '../../store/hooks.js';
import { getFeed, markRead } from '../../services/api/feedApi.js';
import { fetchFeedSuccess, markFeedItemRead } from '../../store/slices/feedSlice.js';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

export default function MainLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const feedItems = useAppSelector((state) => state.feed.items);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], leads: [] });

  // Load feed items on mount
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

  // Handle Ctrl+K shortcut
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

  // Handle search query changes
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

  return (
    <div className="layoutContainer">
      <Sidebar />
      
      <div className={`mainWrapper ${sidebarOpen ? 'sidebarOpen' : ''}`}>
        <Navbar 
          onSearchClick={() => setSearchOpen(true)} 
          onFeedToggle={() => setFeedOpen((prev) => !prev)}
        />
        
        <div className="contentArea">
          <div className="mainContent">
            <Outlet />
          </div>

          {/* Activity Feed Tray */}
          <div className="activityFeedTray">
            <div className="feedHeader">
              <h3>Activity Feed</h3>
            </div>
            <div className="feedBody">
              {feedItems.length === 0 ? (
                <p className="emptyFeed">No recent activity.</p>
              ) : (
                feedItems.map((item) => (
                  <div key={item.id} className={`feedItem ${!item.is_read ? 'unreadItem' : ''}`}>
                    <p className="feedText">{item.payload?.message || `Event: ${item.event_type}`}</p>
                    <span className="feedTime">{new Date(item.created_at).toLocaleTimeString()}</span>
                    {!item.is_read && (
                      <button className="readBtn" onClick={() => handleMarkAsRead(item.id)}>
                        Mark as read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
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