<div align="center">

<img width="100%" alt="Bee Banner" src="https://github.com/user-attachments/assets/2db2d0eb-30c1-4cd2-9ec3-f42d68bbd39d" />

# 🐝 Bee
### **Local File Sharing, Simplified.**

<a href="https://github.com/srsoumyax11/bee/releases">
  <img src="https://img.shields.io/github/v/release/srsoumyax11/bee?style=for-the-badge&color=FFD700&labelColor=000000" alt="Latest Release">
</a>
<img src="https://img.shields.io/badge/Go-Latest-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go Version">
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Platform-Win%20|%20Linux%20|%20Mac-FFD700?style=for-the-badge" alt="Platform">

</div>

---

## 🚀 The Problem & The Solution

**The Problem:**  
Sharing files between your phone and laptop usually means emailing yourself, dealing with slow Bluetooth, or uploading to the cloud—which requires Internet and eats up your data.

**The Solution:**  
**Bee** creates a high-speed tunnel between your devices over your own Wi-Fi. No Internet required. No cables. Just run Bee, and your device becomes a secure file-sharing hub.

---

## 🌟 Why Use Bee?

- **⚡ Blazing Fast**: Transfers happen over LAN. Gigabit speeds are common.
- **🔒 Private & Secure**: Files never leave your local network. No cloud, no tracking.
- **📱 Works Everywhere**: If it has a browser, it works. PC, Mac, Android, iOS.
- **🌐 Offline Capable**: Works perfectly without an Internet connection.

---

## 📥 Quick Start

1.  **Download**: Get the latest `bee` executable for your OS from **[Releases](https://github.com/srsoumyax11/bee/releases)**.
2.  **Run**: Double-click `bee.exe` (Windows) or run `./bee` (Linux/Mac) in your terminal.
3.  **Connect**:
    *   Open `http://localhost:1111` on your computer.
    *   Share the displayed **Local IP URL** (e.g., `http://192.168.1.5:1111`) with others on your Wi-Fi.
    *   Enter the PIN: **111111** (default).

---

## 🧩 How It Works & Storage

Bee acts as a **Local Web Server** on your device.

1.  **Storage**: When you run Bee, it creates an **`uploads`** folder in the same directory as the executable.

> [!WARNING]
> **⚠️ Important Storage Notice**
> 
> The device running Bee acts as the **central storage**.
> *   **Persistent**: All uploaded files are saved to the `uploads` folder on this computer.
> *   **Access**: Even if a user uploads a file and disconnects, the file **remains on the server** and can be downloaded by anyone else with the PIN.
> *   **Privacy**: Share the PIN (`111111`) only with trusted people on your network.

---

## ✅ Features & Roadmap

Here is what Bee can do now, and what's coming soon.

- [x] **⚡ Zero Config** — Just run and share
- [x] **🔒 PIN Security** — Simple 6-digit access control
- [x] **📤 Drag & Drop** — Intuitive file uploads
- [x] **💻 Multi-Device** — Desktop, tablet, mobile support
- [x] **👥 Live Presence** — See who's online in real-time
- [x] **⚙️ Cancelable Uploads** — Stop transfers mid-way
- [ ] **🚀 Speed Improvements** — Optimize for Gigabit performance
- [ ] **💬 Public Chat Area** — Text chat for connected users
- [ ] **📂 Folder Uploads** — Drag and drop entire folders
- [ ] **📦 Batch Actions** — Select and download multiple files
- [ ] **🌑 Dark/Light Mode** — Customizable themes
- [ ] **📱 QR Code Connect** — Scan to join instantly
- [ ] **📋 Clipboard Sharing** — Copy on PC, paste on Phone
- [ ] **🔐 Custom Passwords** — Set unique PINs per session

---

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <b>Desktop View</b><br>
        <img src="https://placehold.co/600x400/222/FFD700?text=Desktop-Grid-View" alt="Desktop Screenshot" />
      </td>
      <td align="center">
        <b>Mobile View</b><br>
        <img src="https://placehold.co/300x600/222/FFD700?text=Mobile-Experience" alt="Mobile Screenshot" />
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ Developer Guide

Want to build Bee from source?

### 1️⃣ Clone & Setup

```bash
git clone https://github.com/srsoumyax11/bee.git
cd bee
go mod download
```

### 2️⃣ Development (Hot Reload)

**Terminal 1: Go Backend**
```bash
go run . -port 1111
```

**Terminal 2: React Frontend**
```bash
cd frontend
npm install 
npm run dev
```
*Open `http://localhost:5173` for the frontend dev server.*

### 3️⃣ Build for Production (Single Executable)

First, build the frontend:
```bash
cd frontend
npm run build
cd ..
```

Then, compile the binary for your platform (PowerShell):

**🪟 Windows:**
```powershell
$env:GOOS="windows"; $env:GOARCH="amd64"; go build -o bee.exe
```

**🐧 Linux:**
```powershell
$env:GOOS="linux"; $env:GOARCH="amd64"; go build -o bee-linux
```

**🍎 macOS:**
```powershell
$env:GOOS="darwin"; $env:GOARCH="arm64"; go build -o bee-mac
```

---

## 🤝 Contributing

1.  **Fork** the repo & create a branch (`git checkout -b feature/amazing-idea`).
2.  **Commit** your changes (`git commit -m 'Add amazing idea'`).
3.  **Push** to the branch (`git push origin feature/amazing-idea`).
4.  **Open a Pull Request**!

---

## 📄 License

This project is licensed under the **MIT License**.

<div align="center">
  <p>Made with 💛 and Go</p>
</div>
