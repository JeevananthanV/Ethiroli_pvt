import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function InternMessages() {
  const [conversations, setConversations] = useState([
    {
      id: 'mentor',
      name: 'Arun Kumar',
      role: 'Senior Full Stack Mentor',
      avatar: 'AK',
      online: true,
      lastMessage: 'Please submit before 5 PM.',
      time: '11:42 AM',
      unreadCount: 1,
      messages: [
        { id: 1, sender: 'mentor', text: 'Hi Jeeva, have you completed the API integration for the login module?', time: '11:30 AM' },
        { id: 2, sender: 'me', text: 'Yes Arun sir, almost done! Just finishing the token refresh handler.', time: '11:35 AM' },
        { id: 3, sender: 'mentor', text: 'Great. Please submit your pull request before 5 PM so we can review it together in today\'s 4:00 PM session.', time: '11:42 AM' }
      ]
    },
    {
      id: 'hr',
      name: 'Priya Sharma',
      role: 'HR Talent Operations',
      avatar: 'PS',
      online: false,
      lastMessage: 'Your stipend invoice has been processed.',
      time: 'Yesterday',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'hr', text: 'Hello Jeeva, please upload your signed bank details document.', time: 'Yesterday 10:15 AM' },
        { id: 2, sender: 'me', text: 'Uploaded yesterday in the Documents section!', time: 'Yesterday 11:00 AM' },
        { id: 3, sender: 'hr', text: 'Verified! Your stipend invoice has been processed.', time: 'Yesterday 02:30 PM' }
      ]
    },
    {
      id: 'pm',
      name: 'Karthik Raja',
      role: 'Project Manager (E-Commerce)',
      avatar: 'KR',
      online: true,
      lastMessage: 'Sprint 2 demo is scheduled for Friday.',
      time: 'Sep 20',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'pm', text: 'Sprint 2 demo is scheduled for Friday at 3:00 PM. Be ready with your checkout component demo.', time: 'Sep 20' }
      ]
    },
    {
      id: 'training',
      name: 'Ethiroli LMS Team',
      role: 'Learning & Curriculum Support',
      avatar: 'LT',
      online: true,
      lastMessage: 'New quiz on Redux Toolkit is live.',
      time: 'Sep 19',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'training', text: 'New quiz on Redux Toolkit is live. Please attempt before Sunday.', time: 'Sep 19' }
      ]
    }
  ]);

  const [activeId, setActiveId] = useState('mentor');
  const [inputText, setInputText] = useState('');

  const activeChat = conversations.find((c) => c.id === activeId) || conversations[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: inputText.trim(),
              time: 'Just now'
            }
          : c
      )
    );

    setInputText('');
  };

  return (
    <AdminPage
      title="Messages & Communication"
      subtitle="Direct chat with your assigned mentor, project manager, HR, and training coordinators"
    >
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white" style={{ minHeight: '620px' }}>
        <div className="row g-0 h-100">
          {/* Conversation List Sidebar */}
          <div className="col-12 col-md-4 border-end" style={{ maxHeight: '620px', overflowY: 'auto' }}>
            <div className="p-3 border-bottom bg-light">
              <h6 className="mb-0 fw-bold text-dark">Conversations</h6>
            </div>
            <div className="list-group list-group-flush">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`list-group-item list-group-item-action p-3 text-start border-0 border-bottom ${
                    c.id === activeId ? 'bg-primary bg-opacity-10' : ''
                  }`}
                  onClick={() => setActiveId(c.id)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="position-relative">
                      <div className="avatar-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center rounded-circle" style={{ width: 42, height: 42 }}>
                        {c.avatar}
                      </div>
                      {c.online && (
                        <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
                      )}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-baseline mb-1">
                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.9rem' }}>{c.name}</div>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>{c.time}</small>
                      </div>
                      <div className="text-muted small text-truncate" style={{ fontSize: '0.8rem' }}>{c.lastMessage}</div>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="badge bg-primary rounded-pill">{c.unreadCount}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Pane */}
          <div className="col-12 col-md-8 d-flex flex-column" style={{ height: '620px' }}>
            {/* Chat Header */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
              <div className="d-flex align-items-center gap-2">
                <div className="avatar-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center rounded-circle" style={{ width: 38, height: 38 }}>
                  {activeChat.avatar}
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">{activeChat.name}</h6>
                  <small className="text-muted">
                    {activeChat.role} • {activeChat.online ? <span className="text-success">● Online</span> : 'Offline'}
                  </small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" title="Start video session">
                  <i className="bi bi-camera-video-fill me-1"></i> Meet
                </button>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3" style={{ background: '#f8fafc' }}>
              {activeChat.messages.map((m) => {
                const isMe = m.sender === 'me';
                return (
                  <div key={m.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className={`p-3 rounded-3 shadow-sm ${
                        isMe ? 'bg-primary text-white' : 'bg-white text-dark border'
                      }`}
                      style={{ maxWidth: '75%', fontSize: '0.9rem' }}
                    >
                      <div>{m.text}</div>
                      <div
                        className={`text-end mt-1 ${isMe ? 'text-white-50' : 'text-muted'}`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Composer */}
            <form onSubmit={handleSendMessage} className="p-3 border-top bg-white d-flex gap-2 align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder={`Message ${activeChat.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-1 px-3">
                <i className="bi bi-send-fill"></i> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
