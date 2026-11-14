# Contributing to SourceWiki

Thank you for your interest in contributing to SourceWiki! This guide outlines
the workflow for finding tasks, branching, committing changes, and testing
locally.

---

## 1. Finding and Claiming a Task

All tasks and bug reports for SourceWiki are tracked on Wikimedia Phabricator:

- **SourceWiki Workboard**: [https://phabricator.wikimedia.org/tag/sourcewiki/](https://phabricator.wikimedia.org/tag/sourcewiki/)

### Claiming a Task
1. Look for open tasks without an active assignee or existing pull request.
2. Filter by "good first task" or beginner-friendly tags if you are new.
3. Leave a comment on the Phabricator task indicating you are working on it, or claim the task if you have appropriate permissions.
4. Avoid working on tasks that are already assigned or actively in progress by others.

---

## 2. Branch Naming

Always create a new branch from `main` using the Phabricator task ID:

```bash
git checkout main
git pull origin main
git checkout -b T<task-id>-short-description
```

**Examples:**
- `T444769-add-contributing-guide`
- `T444778-unit-tests-apperror`
- `T444771-pin-node-version`

---

## 3. Commit and Pull Request Guidelines

### Commit Messages
Follow standard Wikimedia commit conventions:
- **Subject line**: Imperative mood (e.g. `Add ...`, `Fix ...`, `Update ...`), maximum 72 characters, no trailing period, and no task IDs in the subject.
- **Body**: Hard-wrapped at 72 characters. Clearly explain what changed and why.
- **Footer**: Include `Bug: T<task-id>` at the end of the commit message.

```text
Add CONTRIBUTING.md for Phabricator and GitHub workflow

Provide newcomer guidance on discovering and claiming tasks on the
SourceWiki Phabricator board, creating task branches, writing commit
messages with bug references, and running local tests.

Bug: T444769
```

### Pull Requests
- Open your pull request against `main` (or the branch specified in the task).
- Reference the Phabricator task ID in the PR title and description (e.g. `[T444769] Add CONTRIBUTING.md`).
- Fill out all sections in the pull request template.

---

## 4. Local Development and Testing

### Prerequisites
- **Node.js**: Version 24 is recommended (`.nvmrc` pins `24`).
- **npm**: Included with Node.js.

```bash
nvm use 24
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server (runs on port 5000 by default):
   ```bash
   npm run dev
   ```
5. Run backend tests:
   ```bash
   npm test
   # Or run unit tests only:
   npm run test:unit
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Verify production build:
   ```bash
   npm run build
   ```

---

## 5. Community Guidelines

SourceWiki is part of the Wikimedia technical ecosystem. All contributors are
expected to adhere to the [Wikimedia Friendly Space Policy](https://foundation.wikimedia.org/wiki/Policy:Friendly_space_policy)
and the [Universal Code of Conduct](https://foundation.wikimedia.org/wiki/Policy:Universal_Code_of_Conduct).
