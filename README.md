<div align="center">

# 📁 Just-Share

### ⚡ Lightning-Fast LAN File Sharing Made Simple

<img src="https://img.shields.io/badge/Go-1.20+-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go Version">
<img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/WebSocket-Real--time-FFD700?style=for-the-badge&logo=socket.io&logoColor=black" alt="WebSocket">
<img src="https://img.shields.io/badge/Platform-Windows%20|%20Linux%20|%20macOS-FFD700?style=for-the-badge" alt="Platform">

**Share files across your local network instantly — no internet, no cloud, no tracking.**

[Features](#-features) • [Quick Start](#-quick-start-for-end-users) • [Developer Guide](#-developer-guide) • [Screenshots](#-screenshots)

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🚀 For End Users

- **⚡ Zero Configuration** — Just run and share
- **🔒 PIN Security** — Simple 6-digit access control
- **📤 Drag & Drop** — Intuitive file uploads
- **💻 Multi-Device** — Desktop, tablet, mobile support
- **🌐 Offline First** — Works without internet
- **👥 Live Presence** — See who's online in real-time
- **📊 Smart Sorting** — By name, size, or date
- **🎨 Grid & List Views** — Choose your preference
- **📱 Mobile Optimized** — Responsive overlay sidebar
- **⚙️ Cancelable Uploads** — Stop uploads mid-transfer

</td>
<td width="50%">

### 🛠️ For Developers

- **🏗️ Clean Architecture** — Go backend + React frontend
- **⚡ WebSocket Sync** — Real-time file & user updates
- **🎯 Single Binary** — Embed frontend into Go executable
- **🔧 Hot Reload** — Vite dev server for rapid iteration
- **📦 Minimal Dependencies** — Gorilla WebSocket + React
- **🎨 Custom CSS** — No UI frameworks, pure control
- **🌍 Local Network** — Automatic IP detection
- **🔐 Stateless Auth** — PIN-based WebSocket handshake
- **📂 File Streaming** — Efficient XHR upload with progress
- **🧩 Modular Design** — Easy to extend and customize

</td>
</tr>
</table>

---

## 📥 Quick Start for End Users

### 🪟 Windows

1. **Download** the latest `just-share.exe` from [Releases](https://github.com/srsoumyax11/just-share/releases)
2. **Run** the executable:
   ```cmd
   just-share.exe
   ```
3. **Open browser** at `http://localhost:8080`
4. **Enter PIN**: `111111` (default)
5. **Start sharing!** 🎉

### 🐧 Linux / 🍎 macOS

```bash
# Download and run
chmod +x just-share
./just-share -port 8080

# Open browser
http://localhost:8080
```

### 🔑 Default Settings

| Setting | Value |
|---------|-------|
| 🌐 Default Port | `8080` |
| 🔐 Default PIN | `111111` |
| 📁 Upload Directory | `./uploads` |

> **💡 Tip:** Others on your network can connect using your local IP (shown in terminal on startup)

---

## 🎯 Usage Guide

### 📤 Uploading Files

**Three Easy Ways:**

1. **📎 Drag & Drop** — Drag files anywhere on the app
2. **📤 Upload Button** — Click the yellow upload button
3. **📁 Click to Browse** — Traditional file picker

### 📊 Viewing Files

- **⊞ Grid View** — Visual cards with file icons
- **≡ List View** — Compact table with dates (default)
- **🔍 Search** — Filter files by name
- **📅 Sort** — By name, size, or date (newest first)

### 👥 User Presence

- See all connected users in the sidebar
- View device types (💻 Desktop, 📱 Mobile)
- IP addresses displayed for each user
- **Yellow highlight** = You

### 📱 Mobile Experience

- **☰ Hamburger Menu** — Toggle sidebar overlay
- **📤 Quick Upload** — Button always accessible
- **👆 Touch Optimized** — 44px minimum touch targets
- **📅 Smart Dates** — "5m ago" format on mobile

---

## 🛠️ Developer Guide

### 📋 Prerequisites

- **Go** 1.20+ ([download](https://go.dev/dl/))
- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** or **pnpm**

### 🔧 Project Structure

```
just-share/
├── main.go                 # Entry point
├── internal/
│   ├── server/            # HTTP & WebSocket handlers
│   │   └── server.go
│   └── hub/               # WebSocket hub (user management)
│       └── hub.go
├── frontend/              # React SPA
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── App.css        # Styling (yellow theme)
│   │   ├── components/
│   │   │   ├── Login.jsx  # PIN auth
│   │   │   └── UploadToast.jsx  # Upload notifications
│   │   └── main.jsx       # React entry
│   ├── package.json
│   └── vite.config.js
└── uploads/               # File storage (gitignored)
```

### 🚀 Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/srsoumyax11/just-share.git
cd just-share

# 2. Install Go dependencies
go mod download

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Run backend (Terminal 1)
go run main.go -port 8081

# 5. Run frontend dev server (Terminal 2)
cd frontend
npm run dev
```

**Frontend dev server:** `http://localhost:5173`  
**Backend API:** `http://localhost:8081`

### 🏗️ Building for Production

```bash
# 1. Build frontend
cd frontend
npm run build
cd ..

# 2. Build Go binary (with embedded frontend)
# Option A: Current platform
go build

# Option B: Cross-compile for Windows
GOOS=windows GOARCH=amd64 go build -o just-share.exe

# Option C: Linux
GOOS=linux GOARCH=amd64 go build -o just-share-linux
```

To **embed the frontend** into the Go binary, use `embed` in `main.go`:

```go
//go:embed frontend/dist
var frontendFS embed.FS
```

### 🔌 API Reference

#### WebSocket Connection

```
ws://localhost:8081/ws?name=YourName&pin=111111&device=Desktop
```

**Messages:**
- `{"type": "users", "data": [...]}` — User list update
- `{"type": "files", "data": [...]}` — File list update

#### HTTP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/files` | List all uploaded files |
| `POST` | `/upload` | Upload file (multipart/form-data) |
| `GET` | `/upload/{filename}` | Download file |

### 🎨 Customization

#### Change PIN

Edit `internal/server/server.go`:

```go
const requiredPIN = "your-new-pin" // Line ~15
```

#### Change Color Theme

Edit `frontend/src/index.css`:

```css
:root {
  --accent: #FFD700; /* Change to any color */
  --accent-hover: #FFC700;
}
```

#### Modify Port

```bash
go run main.go -port 3000
```

### 🧪 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Go 1.20+ |
| **WebSocket** | Gorilla WebSocket |
| **Frontend** | React 18, Vite |
| **Styling** | Vanilla CSS (Yellow theme) |
| **Icons** | Emoji-based (no dependencies) |
| **Upload** | XMLHttpRequest with progress tracking |

---

## 📸 Screenshots

### 🖥️ Desktop View

**Grid View**  
*Visual file cards with drag-drop support*

**List View**  
*Compact table with date column*

### 📱 Mobile View

**Overlay Sidebar**  
*Slide-in navigation with user list*

**Upload Toast**  
*Cancelable progress notifications*

---

## 🎯 Key Features Explained

### 🔄 Real-Time Sync

- **WebSocket Hub** broadcasts user joins/leaves
- **File updates** pushed to all connected clients
- **Live presence** shows active users with IP addresses

### 📤 Smart Upload System

- **Drag & drop** anywhere, even when file area is full
- **Progress tracking** — Shows percentage & transfer speed
- **Cancelable** — Stop uploads mid-transfer via XHR abort
- **Toast notifications** — Top-right corner, auto-dismiss

### 🎨 Responsive Design

- **Desktop**: Collapsible sidebar (70px collapsed, 280px expanded)
- **Mobile**: Overlay sidebar with backdrop
- **Tablet**: Optimized touch targets (≥44px)
- **Grid**: 2-5 columns (responsive)

### 🔐 Security

- **PIN-based auth** — 6-digit access control
- **Local network only** — No external connections
- **No data tracking** — Completely offline
- **No cloud** — Files stay on your device

---

## 🚧 Roadmap

- [ ] 📦 Batch file operations (select multiple)
- [ ] 🗂️ Folder upload support
- [ ] ⏸️ Pause/resume uploads
- [ ] 🎨 Theme customization (dark/light modes)
- [ ] 🔍 Advanced search filters
- [ ] 📊 Storage analytics
- [ ] 🌐 QR code for mobile connection
- [ ] 🔔 Desktop notifications

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### 📝 Development Guidelines

- **Go code**: Follow `gofmt` standards
- **React code**: Use functional components with hooks
- **CSS**: Maintain yellow theme (`#FFD700`)
- **Commits**: Use conventional commits format

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Gorilla WebSocket** — Reliable WebSocket library
- **Vite** — Lightning-fast frontend tooling
- **React** — UI component library
- **You!** — For using Just-Share 💛

---

<div align="center">

### ⭐ If you find this useful, give it a star!

**Made with 💛 by [Your Name](https://github.com/srsoumyax11)**

[Report Bug](https://github.com/srsoumyax11/just-share/issues) • [Request Feature](https://github.com/srsoumyax11/just-share/issues)

</div>
