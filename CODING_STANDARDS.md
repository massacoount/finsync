# Coding Standards and Design Patterns

This document outlines the coding standards and design patterns followed in the Fin Sync repository. Adhering to these standards ensures consistency, readability, and maintainability of the codebase.

## Table of Contents

1. General Guidelines
2. File and Folder Structure
3. Naming Conventions
4. Vue.js Specific Guidelines
5. Pinia Store Guidelines
6. API Service Guidelines
7. Design Patterns
8. Styling Guidelines

## General Guidelines

- **Consistency**: Ensure that the code is consistent throughout the codebase.
- **Readability**: Write code that is easy to read and understand.
- **Maintainability**: Write code that is easy to maintain and extend.
- **Comments**: Use comments to explain the purpose of complex code blocks.

## File and Folder Structure

- **Components**: All Vue components are stored in the components directory.
- **Pages**: All Vue pages are stored in the pages directory.
- **Layouts**: All layout components are stored in the layouts directory.
- **Composables**: All reusable logic is stored in the composables directory.
- **Stores**: All Pinia stores are stored in the store directory.
- **API Services**: All API service files are stored in the api directory.
- **Assets**: All static assets (images, styles, etc.) are stored in the assets directory.

## Naming Conventions

- **Files**: Use kebab-case for file names (e.g., `my-component.vue`).
- **Components**: Use PascalCase for component names (e.g., `MyComponent`).
- **Variables**: Use camelCase for variable names (e.g., `myVariable`).
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., `MY_CONSTANT`).
- **Functions**: Use camelCase for function names (e.g., `myFunction`).

## Vue.js Specific Guidelines

- **Single File Components**: Use single file components (`.vue` files) for Vue components.
- **Template**: Use the `<template>` section for HTML markup.
- **Script**: Use the `<script>` section for JavaScript logic.
- **Style**: Use the `<style scoped>` section for component-specific styles.
- **Props**: Define props with proper types and default values.
- **Events**: Use `$emit` to emit events from child components to parent components.
- **Lifecycle Hooks**: Use Vue lifecycle hooks (`onMounted`, `onUpdated`, etc.) for component lifecycle management.

## Pinia Store Guidelines

- **Store Definition**: Define stores using the `defineStore` function from Pinia.
- **State**: Use `ref` or `reactive` to define state variables.
- **Actions**: Define actions for asynchronous operations and state mutations.
- **Getters**: Define getters for computed properties based on the state.

## API Service Guidelines

- **Service Factory**: Use a service factory pattern to create instances of API services.
- **Base Service**: Define a base service class with common methods.
- **Specific Services**: Extend the base service class for specific API services (e.g., `AppwriteFinanceService`).
- **Environment Variables**: Use environment variables for configuration (e.g., API endpoints, project IDs).

## Design Patterns

- **Factory Pattern**: Used for creating instances of API services (e.g., `AuthFactory`, `FinanceServiceFactory`).
- **Singleton Pattern**: Used for managing single instances of stores and services.
- **Composition API**: Used for defining reactive state and lifecycle hooks in Vue components.
- **Composable Functions**: Used for encapsulating reusable logic (e.g., `useAuth`, `useFinance`).

## Styling Guidelines

- **Tailwind CSS**: Use Tailwind CSS for styling components.
- **CSS Variables**: Define CSS variables in variables.css for consistent theming.
- **Scoped Styles**: Use scoped styles in Vue components to avoid style conflicts.
- **Utility Classes**: Use Tailwind utility classes for common styles (e.g., padding, margin, text color).

