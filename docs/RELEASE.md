# Release Workflow Guide

This document explains how to use the automated build and release workflow for Just-Share.

## 🚀 How It Works

The workflow automatically builds and releases Just-Share for multiple platforms when you push a new version tag to GitHub.

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
  - Create distribution archives (.tar.gz for Unix, .zip for Windows)
  - Create a GitHub Release with all the binaries

### 4. Release Assets

Once complete, your release will include:

- `justshare-windows-amd64.zip` - Windows 64-bit (Intel/AMD)
- `justshare-windows-arm64.zip` - Windows ARM64
- `justshare-macos-amd64.tar.gz` - macOS Intel
- `justshare-macos-arm64.tar.gz` - macOS Apple Silicon
- `justshare-linux-amd64.tar.gz` - Linux 64-bit
- `justshare-linux-arm64.tar.gz` - Linux ARM64
- `justshare-linux-386.tar.gz` - Linux 32-bit

Each archive contains:
- The compiled binary (`justshare` or `justshare.exe`)
- The frontend build (`frontend/` directory)
- README.md

## 🔧 Workflow Details

### Build Process

1. **Frontend Build**: Builds the React app using Vite (`npm run build`)
2. **Backend Build**: Compiles the Go binary for each platform/architecture
3. **Archive Creation**: Packages everything into distribution archives
4. **Release Creation**: Creates a GitHub release with all archives attached

### Build Optimizations

- **CGO_ENABLED=0**: Ensures fully static binaries (no external dependencies)
- **-ldflags="-s -w"**: Reduces binary size by stripping debug info

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

## 🛠️ Troubleshooting

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
```

### Testing Before Release

To test the build process locally:

```bash
# Build frontend
cd frontend
npm install
npm run build

# Build for different platforms
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o justshare.exe .
GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o justshare .
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o justshare .
```

## 🔐 Permissions

The workflow requires:
- **contents: write** - To create releases and upload assets

These permissions are already configured in the workflow file.

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Go Cross Compilation](https://go.dev/doc/install/source#environment)
