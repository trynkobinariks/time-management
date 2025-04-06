#!/bin/bash

# Format all TypeScript and JavaScript files
prettier --write "src/**/*.{ts,tsx,js,jsx}"

# Run ESLint with auto-fix option
npx eslint "src/**/*.{ts,tsx,js,jsx}" --fix

echo "✅ Formatting completed successfully!" 