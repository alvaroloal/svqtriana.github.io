- **Auto-merge is forbidden.** Never run `gh pr merge --auto`, never enable
  "Auto-merge" in the GitHub UI, and keep the repo setting `allow_auto_merge=false`.
  Auto-merge lands a PR the instant CI goes green, bypassing the human review gate.
- Every PR merges deliberately, after review and with CI green. Merge is a supervised
  action, never a queued automatic one. An agent merges only when the user has
  authorized merging that specific PR.

## Cutover is a separate decision

Merging this repository is not the same as publishing it. `.github/workflows/deploy.yml`
publishes on push to `main`, and the Pages source has to be `GitHub Actions` before the
first Astro commit lands or the legacy Jekyll build serves a 404 for every route. That
flip is a manual operation with an outage window; it is never bundled into a PR merge
without the user saying so for that merge.
