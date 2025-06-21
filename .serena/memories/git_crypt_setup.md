# Git-Crypt Setup

The repository uses git-crypt to securely encrypt sensitive files while still keeping them in version control.

## Encrypted Files

- `.env` - Contains environment variables and secrets

## Workflow Integration

The Gitea CI workflow has a git-crypt unlock step that uses the `GIT_CRYPT_KEY` secret to decrypt the files during CI runs:

```yaml
- name: Unlock git-crypt
  uses: sliteteam/github-action-git-crypt-unlock@1.3.0
  env:
    GIT_CRYPT_KEY: ${{ secrets.GIT_CRYPT_KEY }}
```

## Key Management

- For team members: GPG keys can be added to git-crypt using `git-crypt add-gpg-user`
- For CI: The symmetric key is stored as a base64-encoded secret in the Gitea repository

## Related Files

- `.gitattributes` - Specifies which files should be encrypted
- `.gitea/workflows/run-tests.yml` - Contains the unlock step for CI
- `README.md` - Contains documentation on the git-crypt setup