# Quick Start: Creating Your First Release

Follow these simple steps to create your first automated release:

## 1️⃣ Commit and Push Your Workflow

```bash
# Add the workflow files
git add .github/workflows/release.yml docs/RELEASE.md

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
2. You'll see your new release with 7 distribution files:
   - 2 Windows builds (.zip)
   - 2 macOS builds (.tar.gz)
   - 3 Linux builds (.tar.gz)

## 🎉 That's It!

Your users can now download Just-Share for their platform directly from the Releases page.

---

## What Gets Built

Each release archive contains:
- ✅ Compiled binary (ready to run)
- ✅ Frontend build (static files)
- ✅ README.md

## For Your Next Release

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
