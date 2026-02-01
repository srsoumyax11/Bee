# Release Workflow Guide

This document explains how to use the automated build and release workflow for Bee.

## 🚀 How It Works

The workflow automatically builds and releases Bee for multiple platforms when you push a new version tag to GitHub.

### Supported Platforms and Architectures

- **Windows**: AMD64, ARM64
- **macOS**: AMD64 (Intel), ARM64 (Apple Silicon)  
- **Linux**: AMD64, ARM64, 386

## 📦 Creating a Release

### 1. Prepare Your Code

Make sure all your changes are committed and pushed to the `main` (or `master`) branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### 2. Create and Push a Version Tag

Create a version tag following [Semantic Versioning](https://semver.org/):

```bash
# Create a tag (e.g., v1.0.0, v2.1.3, etc.)
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

### 3. Watch the Workflow Run

- Go to your GitHub repository
- Click on the **Actions** tab
- You'll see the "Build and Release" workflow running
- The workflow will:
  - Build the frontend (React/Vite)
  - Build the Go backend for all platforms and architectures
  - Create standalone executables with version numbers in filenames
  - Create a GitHub Release with all the binaries

### 4. Release Assets

Once complete, your release will include **fully standalone executables** with the frontend embedded:

- `justshare-v1.0.0-windows-amd64.exe` - Windows 64-bit (Intel/AMD)
- `justshare-v1.0.0-windows-arm64.exe` - Windows ARM64
- `justshare-v1.0.0-macos-amd64` - macOS Intel
- `justshare-v1.0.0-macos-arm64` - macOS Apple Silicon
- `justshare-v1.0.0-linux-amd64` - Linux 64-bit
- `justshare-v1.0.0-linux-arm64` - Linux ARM64
- `justshare-v1.0.0-linux-386` - Linux 32-bit

**✨ These are truly standalone binaries!** The frontend is embedded using Go's `embed` package, so users only need to download and run the executable - no additional files required.

## 🔧 Workflow Details

### Build Process

1. **Frontend Build**: Builds the React app using Vite (`npm run build`)
2. **Backend Build**: Compiles the Go binary for each platform/architecture with version info
3. **Release Creation**: Creates a GitHub release with all executables

### Build Optimizations

- **CGO_ENABLED=0**: Ensures fully static binaries (no external dependencies)
- **-ldflags="-s -w"**: Reduces binary size by stripping debug info
- **-X main.version=...**: Embeds version information into the binary

## 📝 Version Tag Examples

```bash
# Major release
git tag v1.0.0 && git push origin v1.0.0

# Minor release (new features)
git tag v1.1.0 && git push origin v1.1.0

# Patch release (bug fixes)
git tag v1.1.1 && git push origin v1.1.1

# Pre-release
git tag v2.0.0-beta.1 && git push origin v2.0.0-beta.1
```

## 🛠️ Local Build Testing

To test building for different platforms locally:

### Windows (PowerShell)
```powershell
# Build for Windows
$env:GOOS="windows"; $env:GOARCH="amd64"; go build -ldflags="-s -w" -o justshare-windows-amd64.exe .

# Build for Linux
$env:GOOS="linux"; $env:GOARCH="amd64"; go build -ldflags="-s -w" -o justshare-linux-amd64 .

# Build for macOS (Intel)
$env:GOOS="darwin"; $env:GOARCH="amd64"; go build -ldflags="-s -w" -o justshare-macos-amd64 .

# Build for macOS (Apple Silicon)
$env:GOOS="darwin"; $env:GOARCH="arm64"; go build -ldflags="-s -w" -o justshare-macos-arm64 .
```

### Linux/macOS (Bash)
```bash
# Build for current platform
go build -ldflags="-s -w" -o justshare .

# Cross-compile for Windows
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o justshare.exe .

# Cross-compile for Linux ARM64
GOOS=linux GOARCH=arm64 go build -ldflags="-s -w" -o justshare-linux-arm64 .
```

## 🐛 Troubleshooting

### Workflow Fails

1. Check the **Actions** tab in GitHub to see detailed logs
2. Common issues:
   - Frontend build errors: Check `frontend/package.json` and dependencies
   - Go build errors: Check `go.mod` and code compilation
   - Permission issues: Ensure GitHub Actions has write permissions

### Deleting a Tag

If you need to delete a tag and redo a release:

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin :refs/tags/v1.0.0

# Delete the release from GitHub UI
# Go to Releases → Click on the release → Delete release
```

## 🔐 Permissions

The workflow requires:
- **contents: write** - To create releases and upload assets

These permissions are already configured in the workflow file.

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Go Cross Compilation](https://go.dev/doc/install/source#environment)

