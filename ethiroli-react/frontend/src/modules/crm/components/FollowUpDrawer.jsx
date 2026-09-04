import React from 'react';

export default function FollowUpDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="drawerOverlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
          <h3>Follow-ups Schedule</h3>
          <button className="closeBtn" onClick={onClose}>&times;</button>
        </div>
        <div className="drawerBody">
          <p>Upcoming follow-ups will be listed here.</p>
        </div>
      </div>
    </div>
  );
}