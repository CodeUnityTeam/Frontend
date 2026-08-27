# Pull-request CI pipeline

The pull-request workflow in [`.github/workflows/pr-coverage.yml`](.github/workflows/pr-coverage.yml) provides an early quality gate: every PR must pass the unit suite before its coverage report is produced. This makes test failures visible before review or merge and keeps coverage evidence attached to the PR.

## How it works

The workflow runs on every `pull_request` with Node.js 22 and npm caching:

1. **Test (Node 22)** checks out the branch, installs the lockfile-defined dependencies with `npm ci`, then runs [`test:run`](package.json:14) (`vitest run`).
2. **Coverage (Node 22)** starts only after the test job succeeds (`needs: test`). It performs a fresh `npm ci`, runs [`test:coverage`](package.json:15) (`vitest run --coverage`), creates the summary, and uploads the report. Its summary and artifact steps still run when the coverage command fails, when files are available.

![PR pipeline instance](PR-pipeline-instance.png)

## Coverage summary and artifact

For PRs from branches in this repository, the workflow creates or updates one bot comment titled **Coverage report**. It reports **Lines**, **Statements**, **Functions**, and **Branches** as a percentage plus covered/total count. The comment includes a [Download the HTML and LCOV coverage artifact](../../actions/runs/<run-id>#artifacts) link for that workflow run. The uploaded artifact is named `pr-<PR-number>-coverage`, contains the HTML report and `lcov.info`, and is retained for 14 days.

![Pull Request комментарий](PR-comment.png)

## Q&A / known issues

**Why does `npm ci` fail because the lockfile is out of sync?**  `npm ci` intentionally requires [`package-lock.json`](package-lock.json) to exactly match [`package.json`](package.json). Regenerate and commit the lockfile with the dependency change; do not replace CI installation with `npm install`.

**Do legacy dependency `EBADENGINE` warnings fail CI?**  No. They are currently non-fatal compatibility warnings from transitive legacy dependencies. They should be tracked and resolved through dependency upgrades when possible.

**What happened to the former coverage-summary schema error?**  The summary no longer relies on a reporter schema. The workflow reads `coverage/coverage-final.json` and calculates line, statement, function, and branch totals itself, avoiding that error.

**Why is there no coverage comment on a PR from a fork?**  The comment step is deliberately skipped for fork PRs. This preserves the restricted permissions and avoids exposing a write-capable pull-request token to untrusted fork code; the workflow run and its artifact remain the source for the report.
