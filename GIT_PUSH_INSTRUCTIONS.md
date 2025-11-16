# How to push Anti-Teleology monorepo to GitHub

These are the commands to run **from your terminal**, inside the root of the Anti-Teleology repo.

> Root should contain: `src/`, `docs/`, `SpinOAI-Clean/`, `Honestra/`, `README.md`, `.gitignore`.

## 1. Make sure there is only one git repo (at the root)

If you previously had separate repos for `SpinOAI-Clean` or `Honestra`, you may still have nested `.git` folders.

**⚠️ IMPORTANT:** In your file explorer or terminal, delete these if they exist:

- `SpinOAI-Clean/.git`
- `Honestra/.git`

You should have **only one** `.git` folder at the Anti-Teleology root.

**To delete nested .git folders in PowerShell:**
```powershell
# From the repo root:
Remove-Item -Path "SpinOAI-Clean\.git" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "Honestra\.git" -Recurse -Force -ErrorAction SilentlyContinue
```

**Or manually:** Navigate to each folder in File Explorer, show hidden files, and delete the `.git` folder.

## 2. Initialize git (if not already)

In the terminal:

```bash
cd path/to/Anti-Teleology
```

**Only if there's no .git folder yet:**

```bash
git init
```

If `git status` already works and shows this repo, you can skip `git init`.

## 3. Add all files and commit

From the Anti-Teleology root:

```bash
git status
git add .
git commit -m "Initial Anti-Teleology monorepo with SpinOAI-Clean, Honestra and shared teleology engine"
```

If some files were already committed and you only added structure changes (README, docs, teleologyEngine), you can use a different message, e.g.:

```bash
git add .
git commit -m "Normalize Anti-Teleology monorepo structure"
```

## 4. Connect to GitHub remote

On GitHub you created the repo:

**https://github.com/Erezul77/Anti-Teleology**

In the terminal, run (once):

```bash
git remote add origin https://github.com/Erezul77/Anti-Teleology.git
git branch -M main
```

If origin already exists and points to this URL, you can skip this step.

**To check existing remotes:**
```bash
git remote -v
```

**To update an existing remote:**
```bash
git remote set-url origin https://github.com/Erezul77/Anti-Teleology.git
```

## 5. Push to GitHub

Finally:

```bash
git push -u origin main
```

After this, your Anti-Teleology repo on GitHub should show:

- `src/`
- `docs/`
- `SpinOAI-Clean/`
- `Honestra/`
- `README.md`
- `.gitignore`

And both apps (SpiñO and Honestra) will share the same `src/lib/teleologyEngine.ts`.

## Troubleshooting

### If you get "fatal: not a git repository"
- Make sure you're in the root directory (where `README.md` is)
- Run `git init` first

### If you get "remote origin already exists"
- Check with `git remote -v`
- If it points to the wrong URL, update it with `git remote set-url origin https://github.com/Erezul77/Anti-Teleology.git`

### If you get "failed to push some refs"
- You might need to pull first: `git pull origin main --allow-unrelated-histories`
- Or force push (only if you're sure): `git push -u origin main --force`

### If nested .git folders cause issues
- Make sure you deleted `SpinOAI-Clean/.git` and `Honestra/.git` before pushing
- Git should only track from the root

