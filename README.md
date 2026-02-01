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
Sharing files between your phone and laptop (or between friends) usually means emailing yourself, dealing with slow Bluetooth, or uploading to the cloud—which requires Internet and eats up your data.

**The Solution:**  
**Bee** creates a high-speed tunnel between your devices over your own Wi-Fi. No Internet required. No cables. No setup. Just run Bee, and your device becomes a secure file-sharing hub.

---

## 🌟 Why Use Bee?

- **⚡ Blazing Fast**: Transfers happen over LAN. Gigabit speeds are common.
- **🔒 Private & Secure**: Files never leave your local network. No cloud, no tracking.
- **📱 Works Everywhere**: If it has a browser, it works. PC, Mac, Android, iPhone, Tablet.
- **💾 No Limits**: Share files of any size. 10GB movie? Done in seconds.
- **🌐 Offline Capable**: Works perfectly without an active Internet connection.

---

## 📥 For Users: How to Download & Run

1.  **Download**: Go to the [Releases Page](https://github.com/srsoumyax11/bee/releases) and download the file for your OS:
    *   🪟 Windows: `bee.exe` (or `bee-windows-amd64.exe`)
    *   🐧 Linux: `bee-linux-amd64`
    *   🍎 macOS: `bee-darwin-amd64`

2.  **Run**: Double-click the file (or run from terminal).
    *   *Note: On Windows, you might need to "Run anyway" if SmartScreen pops up (since this is a community app).*
    *   *On Linux/Mac:* `chmod +x bee && ./bee`

3.  **Connect**:
    *   Open your browser to `http://localhost:1111`.
    *   Share the displayed **Local IP URL** (e.g., `http://192.168.1.5:1111`) with others on your Wi-Fi.
    *   Enter the PIN shown in the terminal (Default: `111111`).

---

## 🧩 How It Works

Bee acts as a **Local Web Server** on your device.

1.  **Server (You)**: When you run `bee.exe`, it starts a tiny web server on port `1111` and creates a secure WebSocket tunnel.
2.  **Clients (Others)**: When other devices (phones, laptops) connect to your IP, they load the Bee interface directly from your computer.
3.  **Transfer**: Files are streamed directly from device to device over your Wi-Fi, never touching the internet or any cloud server.

---

## � Future Roadmap

We have big plans for Bee! Here's what's coming next:

- [ ] **Folder Uploads** — Drag and drop entire folders
- [ ] **Batch Actions** — Select and download multiple files
- [ ] **Dark/Light Mode** — Customizable themes
- [ ] **QR Code Connect** — Scan to join instant
- [ ] **Clipboard Sharing** — Copy on PC, paste on Phone
- [ ] **Password Protection** — Set custom PINs per session
- [ ] **Resume Uploads** — Pause and continue large transfers

---

## �📸 Screenshots & Demos

<!-- 
PLACEHOLDER FOR GALLERY
Add your screenshots or GIFs here showing:
1. The Login Screen
2. Grid View of files
3. Mobile Uploading in action
-->

<div align="center">
  <table>
    <tr>
      <td align="center">
        <b>Desktop View</b><br>
        <img src="https://placehold.co/600x400/222/FFD700?text=Desktop+Grid+View" alt="Desktop Screenshot" />
      </td>
      <td align="center">
        <b>Mobile View</b><br>
        <img src="https://placehold.co/300x600/222/FFD700?text=Mobile+Experience" alt="Mobile Screenshot" />
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ For Developers: Contribute to Bee

We love contributions! Whether you're fixing a bug or adding a cool new feature, here's how to get started.

### 1️⃣ Clone & Setup

```bash
# Clone the repository
git clone https://github.com/srsoumyax11/bee.git
cd bee

# Install Go dependencies
go mod download
```

### 2️⃣ Development Workflow

Bee has two parts: a **Go backend** and a **React frontend**. For development, we run them separately for hot-reloading.

**Terminal 1: Go Backend (API)**
```bash
# Run the backend server on port 1111
go run . -port 1111
```

**Terminal 2: React Frontend (UI)**
```bash
cd frontend
npm install  # Install dependencies (first time only)
npm run dev  # Starts Vite dev server at http://localhost:5173
```

👉 **Open `http://localhost:5173` to see your changes live!**

### 3️⃣ Building the Application

When you're ready to create a single executable file, you can cross-compile for different systems.

**First, build the frontend:**
```bash
cd frontend
npm run build # Creates files in frontend/dist
cd ..
```

**Then, choose your platform (PowerShell):**

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

> **Revert to default:**  
> To switch back to your system's default OS targeting, run:
> ```powershell
> Remove-Item Env:\GOOS; Remove-Item Env:\GOARCH
> ```

---

## 🤝 Contributing

**We want your help to make Bee better!** 🐝

1.  Look for open **[Issues](https://github.com/srsoumyax11/bee/issues)** (or open a new one!).
2.  Fork the repo and create your branch: `git checkout -b my-new-feature`.
3.  Commit your changes: `git commit -m 'Add some feature'`.
4.  Push to the branch: `git push origin my-new-feature`.
5.  Submit a **Pull Request**!

**Happy Coding!** Let's build the best local sharing tool together. 💛

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it!

---

<div align="center">
  <p>Made with 💛 and Go</p>
</div>
