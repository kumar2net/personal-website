# Troubleshooting missing commits on GitHub

If you have created commits locally but do not see them on GitHub, verify that the repository has a remote configured and that your push completed successfully.

## 1. Confirm a remote is configured

Run `git remote -v`. If the command prints nothing, the repository does not yet have an origin defined. Add one that points at your GitHub project:

```bash
git remote add origin git@github.com:<username>/<repo>.git
```

## 2. Push the branch explicitly

Once the remote exists, push your local branch:

```bash
git push -u origin <branch-name>
```

If the push fails, check the error output for authentication or permission issues.

## 3. Verify on GitHub

Open the GitHub repository in your browser and confirm that the branch and commit appear. You may need to refresh or switch to the branch you pushed.

Following these steps ensures your local commits are synced with GitHub.
