# Contributing to Startup Hub

First off, thank you for considering contributing to Startup Hub! It's people like you that make Startup Hub such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow our coding conventions
* Document new code
* End all files with a newline

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

* Use TypeScript for all new code
* Prefer interfaces over type aliases
* Use explicit type annotations when necessary
* Follow the existing code style

### Documentation Styleguide

* Use [Markdown](https://guides.github.com/features/mastering-markdown/)
* Reference methods and classes in markdown with backticks
* Use code blocks for examples

## Development Process

1. Fork the repo and create your branch from `main`
2. Run `npm install`
3. Make your changes
4. Run the test suite with `npm test`
5. Make sure your code lints with `npm run lint`
6. Issue that pull request!

### Setting Up Your Development Environment

1. Install Node.js (v18 or later)
2. Install PostgreSQL
3. Clone your fork
4. Install dependencies:
   ```bash
   npm install
   ```
5. Copy `.env.example` to `.env.local` and fill in your values
6. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

We use Vitest and React Testing Library for testing. Please write tests for new code you create.

### Running Tests

```bash
# Run all tests
npm test

# Run specific tests
npm test auth.test.ts

# Run tests in watch mode
npm test -- --watch
```

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `question` - Further information is requested
* `wontfix` - This will not be worked on

## Recognition

Contributors who have made significant contributions will be recognized in our README.md.

Thank you for contributing to Startup Hub! 🚀
