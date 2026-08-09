# Contributing to PrivacyAnalyzer

First off, thank you for considering contributing to PrivacyAnalyzer! 🎉

PrivacyAnalyzer is an open-source project that aims to make privacy policies understandable for everyone. We welcome contributions from developers, designers, privacy experts, and anyone passionate about digital privacy.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. By participating, you are expected to uphold this commitment.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari, Firefox]
 - Version: [e.g. 22]

**Additional context**
Any other context about the problem.
```

### ✨ Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### 💻 Code Contributions

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if you're adding functionality
4. **Update documentation** as needed
5. **Submit a pull request**

### 📝 Documentation

Help us improve our documentation:
- Fix typos and grammar
- Add examples and use cases
- Clarify confusing sections
- Translate documentation to other languages

### 🎨 Design Contributions

- UI/UX improvements
- Logo and graphic design
- Accessibility enhancements
- Mobile responsiveness improvements

---

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- OpenRouter API key
- Firecrawl API key (optional, but recommended)

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/privacyanalyzer.git
   cd privacyanalyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials (see README for details)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Testing Your Changes

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] All tests pass (`npm run build`)
- [ ] Documentation is updated (if needed)
- [ ] Commits follow the commit convention
- [ ] PR description clearly describes the changes

### PR Title Format

Use conventional commit format:
```
<type>(<scope>): <subject>
```

Examples:
- `feat(analyzer): add multi-language support`
- `fix(api): handle rate limit edge cases`
- `docs(readme): update installation instructions`

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran.

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
```

### Review Process

1. **Automated checks** run on your PR (linting, build)
2. **Code review** by maintainers
3. **Feedback and iterations** (if needed)
4. **Approval and merge**

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

```typescript
// Good
interface AnalysisResult {
  score: number;
  grade: string;
  riskLevel: string;
}

// Bad
const result: any = { ... };
```

### React Components

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components small and focused
- Use proper prop types

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export function Button({ onClick, label, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `PrivacyAnalyzer.tsx`)
- Utilities: `kebab-case.ts` (e.g., `rate-limiter.ts`)
- Hooks: `use-kebab-case.ts` (e.g., `use-analysis.ts`)

### Code Style

- Use ESLint and Prettier (auto-formatted on save)
- 2 spaces for indentation
- Single quotes for strings
- Semicolons at the end of statements
- Trailing commas in multi-line objects/arrays

### Comments

- Write comments for complex logic
- Use JSDoc for functions and components
- Keep comments up-to-date with code changes

```typescript
/**
 * Validates and sanitizes a URL to prevent SSRF attacks
 * @param url - The URL to validate
 * @returns Validation result with sanitized URL
 */
export function validateUrl(url: string): ValidationResult {
  // Implementation
}
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc)
- **refactor**: Code refactoring (neither fixes a bug nor adds a feature)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Scope (Optional)

The scope should be the name of the affected module:
- `analyzer`
- `api`
- `ui`
- `security`
- `database`

### Examples

```bash
feat(analyzer): add PDF export functionality

- Add PDF generation library
- Create export button in UI
- Implement PDF template

Closes #123
```

```bash
fix(api): handle rate limit edge cases

Fixed an issue where rate limiter wasn't properly
resetting after the time window expired.

Fixes #456
```

```bash
docs(readme): update installation instructions

- Clarify environment variables
- Add troubleshooting section
- Update deployment guide
```

---

## Issue Guidelines

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if the issue is already fixed in `main` branch
- Gather as much information as possible

### Issue Types

#### Bug Report
- Use the bug report template
- Include steps to reproduce
- Add screenshots if applicable
- Specify your environment

#### Feature Request
- Use the feature request template
- Explain the use case
- Describe the proposed solution
- List any alternatives considered

#### Question/Discussion
- Use GitHub Discussions for questions
- Be clear and specific
- Search for similar discussions first

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issue
- `priority: medium`: Medium priority issue
- `priority: low`: Low priority issue

---

## Getting Help

### Resources

- 📖 **Documentation**: [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/alokemajumder/privacyanalyzer/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/alokemajumder/privacyanalyzer/issues)

### Contact Maintainers

If you need help or have questions:
1. Check existing documentation first
2. Search GitHub Discussions
3. Create a new discussion thread
4. Tag maintainers if urgent (use sparingly)

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (coming soon)

---

## License

By contributing to PrivacyAnalyzer, you agree that your contributions will be licensed under the Apache License 2.0.

---

**Thank you for contributing to PrivacyAnalyzer! Together, we can make privacy policies more transparent and understandable for everyone.** 🎉

[⬆ Back to Top](#contributing-to-privacyanalyzer)
