#!/bin/bash
# Vercel build script that ensures only production dependencies are deployed

# First, install only production dependencies (for runtime)
pnpm install --prod --ignore-scripts

# Then install dev dependencies (for build), but in a way that they're not bundled
pnpm install --ignore-scripts

# Run the build
pnpm build

# Remove devDependencies from node_modules to prevent them from being deployed
# This keeps only production dependencies in the final node_modules
rm -rf node_modules/.pnpm/@vitejs*
rm -rf node_modules/.pnpm/vite*
rm -rf node_modules/.pnpm/@tailwindcss*
rm -rf node_modules/.pnpm/lightningcss*
rm -rf node_modules/.pnpm/esbuild*
rm -rf node_modules/.pnpm/@builder.io*
rm -rf node_modules/.pnpm/tsx*
rm -rf node_modules/.pnpm/typescript*
rm -rf node_modules/.pnpm/vitest*
rm -rf node_modules/.pnpm/@vitest*
rm -rf node_modules/.pnpm/d*
