# Build System Overview

## 🎯 How It Works

Bee now uses **Go's embed package** to create truly standalone executables. The frontend is embedded directly into the binary at compile time.

## 📁 File Structure

```
Bee/
├── main.go                    # Entry point, injects embedded frontend
├── embed.go                   # Handles frontend embedding
├── internal/
│   └── server/
│       └── server.go          # Server logic with embed support
└── frontend/
    └── dist/                  # Built frontend files (embedded at compile time)
```

## 🔧 How Embedding Works

### 1. `embed.go` (Project Root)
- Uses `//go:embed frontend/dist` directive
- Embeds all files from `frontend/dist` into the binary
- Provides `GetFrontendFS()` function to access embedded files

### 2. `main.go`  
- Calls `GetFrontendFS()` to get embedded frontend
- Wraps it with `http.FS()` for HTTP serving
- Injects it into the Server via `srv.FrontendFS`

### 3. `server.go`
- Accepts optional `FrontendFS` parameter
- **Production**: Serves embedded files if `FrontendFS` is set
- **Development**: Falls back to serving from `./frontend/dist` directory

## 🏗️ Build Process

### Local Development
```bash
# Build frontend
cd frontend
npm run build
cd ..

# Run Go server (serves from disk)
go run .

# Build standalone binary (embeds frontend)
go build -o justshare.exe .
```

### Cross-Platform Builds
```powershell
# Windows
$env:GOOS="windows"; $env:GOARCH="amd64"; go build -ldflags="-s -w" -o justshare-windows-amd64.exe .

# Linux
$env:GOOS="linux"; $env:GOARCH="amd64"; go build -ldflags="-s -w" -o justshare-linux-amd64 .

# macOS (Intel)
$env:GOOS="darwin"; $env:GOARCH="amd64"; go build -ldflags="-s -w" -o justshare-macos-amd64 .

# macOS (Apple Silicon)
$env:GOOS="darwin"; $env:GOARCH="arm64"; go build -ldflags="-s -w" -o justshare-macos-arm64 .
```

## 🤖 GitHub Actions Workflow

The workflow in `.github/workflows/release.yml` automates this process:

1. **Build Frontend Once**: `npm run build` in the `frontend/` directory
2. **Build for All Platforms**: Builds 7 different platform/architecture combinations
3. **Embed Frontend**: Each binary includes the frontend via `//go:embed`
4. **Create Release**: Uploads all binaries to GitHub Releases

### Workflow Triggers
- Triggered by pushing a tag starting with `v` (e.g., `v1.0.0`)
- Automatically extracts version from tag name
- Embeds version in binary filename and via ldflags

## 📦 Release Artifacts

Each tag push creates:
- `justshare-v1.0.0-windows-amd64.exe`
- `justshare-v1.0.0-windows-arm64.exe`
- `justshare-v1.0.0-macos-amd64`
- `justshare-v1.0.0-macos-arm64`
- `justshare-v1.0.0-linux-amd64`
- `justshare-v1.0.0-linux-arm64`
- `justshare-v1.0.0-linux-386`

**All binaries are completely standalone** - no external dependencies required!

## 🎨 Build Flags Explained

### `-ldflags="-s -w"`
- `-s`: Strip symbol table (reduces size)
- `-w`: Strip DWARF debug info (further reduces size)
- Result: ~50% smaller binaries

### `-ldflags="-X main.version=v1.0.0"`
- Embeds version string into the binary
- Can be retrieved at runtime via `main.version` variable

### `CGO_ENABLED=0`
- Disables CGO (C bindings)
- Ensures fully static binaries
- No external C library dependencies

## 🔍 How the Embed Directive Works

```go
//go:embed frontend/dist
var frontendFS embed.FS
```

This directive:
1. Runs at compile time
2. Reads all files matching the pattern `frontend/dist`
3. Embeds them into the `frontendFS` variable
4. Path is relative to the file containing the directive

**Important**: The path must be relative to the source file, and cannot use `..` (parent directory references).

## 🚀 Why This Approach?

### Benefits
✅ **Single File Distribution**: Just one executable per platform  
✅ **No Installation**: Users download and run  
✅ **No Dependencies**: Frontend is embedded, nothing to install  
✅ **Version Control**: Frontend version matches backend version  
✅ **Fast Deployment**: Copy one file and go

### Development Mode
- During development, run `go run .` 
- Server serves frontend from `./frontend/dist` (disk)
- No need to rebuild binary after frontend changes
- Just rebuild frontend with `npm run build`

### Production Mode  
- `go build` creates standalone binary
- Frontend is embedded at compile time
- Binary includes snapshot of frontend at build time
- No external files needed

## 📚 Additional Resources

- [Go embed package](https://pkg.go.dev/embed)
- [Go build modes](https://go.dev/doc/install/source#environment)
- [Cross-compilation guide](https://www.digitalocean.com/community/tutorials/building-go-applications-for-different-operating-systems-and-architectures)
