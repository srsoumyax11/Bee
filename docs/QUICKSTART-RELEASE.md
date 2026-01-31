# Quick Start: Creating Your First Release

Follow these simple steps to create your first automated release:

## 1️⃣ Commit and Push Your Workflow

```bash
# Add the workflow files
git add .github/workflows/release.yml docs/

# Commit
git commit -m "feat: add automated build and release workflow"

# Push to GitHub
git push origin main
```

## 2️⃣ Create Your First Release

```bash
# Create a version tag
git tag v1.0.0

# Push the tag to trigger the workflow
git push origin v1.0.0
```

## 3️⃣ Monitor the Build

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Watch the "Build and Release" workflow run
4. Build time: approximately 5-10 minutes

## 4️⃣ Check Your Release

1. Go to the **Releases** section (right sidebar on your repo homepage)
2. You'll see your new release with 7 **fully standalone executables**:
   - `justshare-v1.0.0-windows-amd64.exe`
   - `justshare-v1.0.0-windows-arm64.exe`
   - `justshare-v1.0.0-macos-amd64`
   - `justshare-v1.0.0-macos-arm64`
   - `justshare-v1.0.0-linux-amd64`
   - `justshare-v1.0.0-linux-arm64`
   - `justshare-v1.0.0-linux-386`

## 🎉 That's It!

Your users can now download and run the executable directly - **no installation, no dependencies, just download and run!**

The frontend is embedded using Go's `embed` package, making each binary completely self-contained.

---

## 🚀 For Your Next Release

```bash
# Make your changes
git add .
git commit -m "Your changes"
git push origin main

# Create new version tag
git tag v1.1.0
git push origin v1.1.0
```

**That's all!** The workflow handles everything else automatically.

## 💡 Pro Tip

The version number is automatically embedded in both:
- The filename (e.g., `justshare-v1.0.0-windows-amd64.exe`)
- The binary itself (via `-X main.version` ldflags)

