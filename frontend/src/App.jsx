import { useState, useEffect, useRef } from 'react'
import './App.css'
import Login from './components/Login'
import UploadToast from './components/UploadToast'

function App() {
  const [user, setUser] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [ws, setWs] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const reconnectAttempt = useRef(0)
  const reconnectTimeout = useRef(null)
  const userCredentials = useRef(null)

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploads, setUploads] = useState([]); // Track multiple uploads
  const fileInputRef = useRef(null);
  const activeUploads = useRef(new Map()); // Track XHR objects for cancellation

  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // Changed default to list
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // Changed default to date
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('js_name');
    const savedPin = localStorage.getItem('js_pin');
    const savedCollapsed = localStorage.getItem('sidebar_collapsed');

    if (savedCollapsed !== null) {
      setSidebarCollapsed(savedCollapsed === 'true');
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Prevent default drag/drop behavior globally to avoid about:blank navigation
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      document.addEventListener(eventName, preventDefaults, false);
    });

    if (savedName && savedPin) {
      handleLogin(savedName, savedPin);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.removeEventListener(eventName, preventDefaults, false);
      });
    };
  }, []);

  const handleLogin = (name, pin) => {
    userCredentials.current = { name, pin };
    reconnectAttempt.current = 0;
    setConnectionStatus('connecting');
    connectWebSocket(name, pin);
  };

  const getDeviceIcon = (deviceType) => {
    if (!deviceType) return '💻';
    if (deviceType.includes('Mobile')) return '📱';
    if (deviceType.includes('Tablet')) return '📱';
    return '💻';
  };

  const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Tablet";
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "Mobile";
    }
    return "Desktop";
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      'pdf': '📕',
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'webp': '🖼️',
      'mp4': '🎬', 'mkv': '🎬', 'avi': '🎬', 'mov': '🎬',
      'mp3': '🎵', 'wav': '🎵', 'flac': '🎵',
      'zip': '📦', 'rar': '📦', '7z': '📦', 'tar': '📦',
      'txt': '📝', 'doc': '📝', 'docx': '📝', 'md': '📝'
    };
    return iconMap[ext] || '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const getShortIP = (fullIP) => {
    if (!fullIP) return '';
    const parts = fullIP.split('.');
    return parts.length === 4 ? `.${parts[3]}` : fullIP;
  };

  const connectWebSocket = (name, pin) => {
    // Clear any pending reconnection timeout
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const device = getDeviceType();

    const wsUrl = process.env.NODE_ENV === 'development'
      ? `ws://localhost:1111/ws?name=${encodeURIComponent(name)}&pin=${pin}&device=${device}`
      : `${protocol}//${host}/ws?name=${encodeURIComponent(name)}&pin=${pin}&device=${device}`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
      localStorage.setItem('js_name', name);
      localStorage.setItem('js_pin', pin);
      setUser({ name, pin });
      setConnectionStatus('connected');
      setWs(socket);
      reconnectAttempt.current = 0; // Reset on successful connection
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'users') {
          setOnlineUsers(msg.data);
        } else if (msg.type === 'files') {
          setFiles(msg.data);
        }
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };

    socket.onclose = (event) => {
      console.log('Disconnected from WebSocket');
      setWs(null);

      // Attempt to reconnect if we have credentials
      if (userCredentials.current) {
        setConnectionStatus('reconnecting');
        const delay = Math.min(30000, Math.pow(2, reconnectAttempt.current) * 1000);
        console.log(`Reconnecting in ${delay / 1000}s (attempt ${reconnectAttempt.current + 1})`);

        reconnectTimeout.current = setTimeout(() => {
          reconnectAttempt.current++;
          connectWebSocket(userCredentials.current.name, userCredentials.current.pin);
        }, delay);
      } else {
        setConnectionStatus('disconnected');
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket Error', err);
      // onclose will handle reconnection
    };
  };

  const fetchFiles = async () => {
    try {
      const port = process.env.NODE_ENV === 'development' ? 1111 : window.location.port;
      const res = await fetch(`http://${window.location.hostname}:${port}/files`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (e) {
      console.error("Failed to fetch files", e);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const cancelUpload = (uploadId) => {
    const xhr = activeUploads.current.get(uploadId);
    if (xhr) {
      xhr.abort();
      activeUploads.current.delete(uploadId);
    }
    setUploads(prev => prev.filter(u => u.id !== uploadId));
  };

  const uploadFiles = async (selectedFiles) => {
    const port = process.env.NODE_ENV === 'development' ? 1111 : window.location.port;
    const url = `http://${window.location.hostname}:${port}/upload`;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const uploadId = Date.now() + i;

      setUploads(prev => [...prev, {
        id: uploadId,
        filename: file.name,
        progress: 0,
        speed: null
      }]);

      const formData = new FormData();
      formData.append('file', file);

      try {
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          activeUploads.current.set(uploadId, xhr);

          let lastLoaded = 0;
          let lastTime = Date.now();

          xhr.open('POST', url);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);

              const now = Date.now();
              const timeDiff = (now - lastTime) / 1000;
              const bytesDiff = event.loaded - lastLoaded;
              const speed = timeDiff > 0 ? formatFileSize(bytesDiff / timeDiff) + '/s' : null;

              lastLoaded = event.loaded;
              lastTime = now;

              setUploads(prev => prev.map(u =>
                u.id === uploadId
                  ? { ...u, progress: percent, speed }
                  : u
              ));
            }
          };

          xhr.onload = () => {
            activeUploads.current.delete(uploadId);
            if (xhr.status === 200) {
              setTimeout(() => {
                setUploads(prev => prev.filter(u => u.id !== uploadId));
              }, 1000);
              resolve();
            } else {
              reject(new Error('Upload failed'));
            }
          };

          xhr.onerror = () => {
            activeUploads.current.delete(uploadId);
            setUploads(prev => prev.filter(u => u.id !== uploadId));
            reject(new Error('Network error'));
          };

          xhr.onabort = () => {
            activeUploads.current.delete(uploadId);
            setUploads(prev => prev.filter(u => u.id !== uploadId));
            reject(new Error('Upload canceled'));
          };

          xhr.send(formData);
        });
        console.log(`Uploaded ${file.name}`);
      } catch (error) {
        if (error.message !== 'Upload canceled') {
          console.error('Upload failed', error);
          alert(`Failed to upload ${file.name}`);
        }
      }
    }

    fetchFiles();
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', newState.toString());
  };

  const getFilteredFiles = () => {
    let filtered = files.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'size') {
      filtered.sort((a, b) => b.size - a.size);
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    return filtered;
  };

  if (!user || connectionStatus === 'error') {
    return <Login onLogin={handleLogin} error={connectionStatus === 'error'} />;
  }

  const filteredFiles = getFilteredFiles();

  return (
    <div className="app-container" onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <UploadToast uploads={uploads} onCancel={cancelUpload} />

      {isMobile && (
        <header className="mobile-header">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="app-title">Bee</h1>
          <button className="mobile-upload-btn" onClick={handleUploadClick}>
            📤
          </button>
        </header>
      )}

      {isMobile && !sidebarCollapsed && (
        <div className="sidebar-backdrop" onClick={toggleSidebar}></div>
      )}

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'} ${isMobile ? 'mobile' : ''}`}>
        {!isMobile && (
          <div className="sidebar-header">
            {!sidebarCollapsed && <h2>Bee</h2>}
            <button className="btn-icon" onClick={toggleSidebar} title={sidebarCollapsed ? 'Expand' : 'Collapse'}>
              {sidebarCollapsed ? '☰' : '×'}
            </button>
          </div>
        )}

        {isMobile && (
          <div className="sidebar-header mobile">
            <h2>Bee</h2>
            <button className="btn-icon" onClick={toggleSidebar}>
              ×
            </button>
          </div>
        )}

        <div className="users-section">
          {!sidebarCollapsed && <h3 className="section-title">Online Users ({onlineUsers.length})</h3>}
          <ul className="user-list">
            {onlineUsers.map((u, i) => (
              <li
                key={i}
                className={`user-item ${u.name === user.name ? 'active-user' : ''}`}
                title={sidebarCollapsed ? `${u.name} (${u.ip})` : ''}
              >
                <div className="user-icon-wrapper">
                  <span className="device-icon">{getDeviceIcon(u.device)}</span>
                  {sidebarCollapsed && <div className="user-ip-short">{getShortIP(u.ip)}</div>}
                </div>
                {!sidebarCollapsed && (
                  <div className="user-info">
                    <div className="user-name">{u.name}</div>
                    <div className="user-ip">{u.ip}</div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div>PIN: {user.pin}</div>
            <div className="connection-status">
              <span className={`status-dot ${connectionStatus}`}></span>
              <span className="status-text">
                {connectionStatus === 'connected' && 'Connected'}
                {connectionStatus === 'connecting' && 'Connecting...'}
                {connectionStatus === 'reconnecting' && 'Reconnecting...'}
                {connectionStatus === 'disconnected' && 'Disconnected'}
              </span>
            </div>
          </div>
        )}
      </aside>

      <main className="main-panel">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="date">Date</option>
          </select>
          {!isMobile && (
            <button className="btn-upload" onClick={handleUploadClick}>
              📤 Upload
            </button>
          )}
          <div className="view-toggle">
            <button
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ≡
            </button>
          </div>
        </div>

        {isDragging && (
          <div className="dropzone-overlay" onDrop={handleDrop}>
            <div className="dropzone-content">
              <div className="dropzone-icon">📁</div>
              <div className="dropzone-text">Drop files here to upload</div>
            </div>
          </div>
        )}

        <div className="file-area">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          {filteredFiles.length === 0 && files.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📂</div>
              <div>NO FILES YET</div>
              <button className="btn-bold" onClick={handleUploadClick} style={{ marginTop: '20px' }}>
                📤 Upload Files
              </button>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '2rem' }}>🔍</div>
              No files match "{searchQuery}"
            </div>
          ) : (
            <div className={`file-list ${viewMode}`}>
              {viewMode === 'grid' && filteredFiles.map((f, i) => (
                <div key={i} className="file-card" title={f.name}>
                  <div className="file-icon">{getFileIcon(f.name)}</div>
                  <div className="file-name">
                    <div>{f.name}</div>
                    {isMobile && <div className="file-date">{formatDate(f.time)}</div>}
                  </div>
                  <div className="file-size">{formatFileSize(f.size)}</div>
                  <a
                    href={`http://${window.location.hostname}:${process.env.NODE_ENV === 'development' ? 1111 : window.location.port}/upload/${f.name}`}
                    download
                    className="btn-download"
                  >
                    ⬇ DOWNLOAD
                  </a>
                </div>
              ))}

              {viewMode === 'list' && filteredFiles.map((f, i) => (
                <div key={i} className="file-row" title={f.name}>
                  <span className="file-icon">{getFileIcon(f.name)}</span>
                  <span className="file-name">{f.name}</span>
                  <span className="file-size">{formatFileSize(f.size)}</span>
                  <span className="file-date">{formatDate(f.time)}</span>
                  <a
                    href={`http://${window.location.hostname}:${process.env.NODE_ENV === 'development' ? 1111 : window.location.port}/upload/${f.name}`}
                    download
                    className="btn-download-small"
                  >
                    ⬇
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
