This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Data Persistence

This application uses Zustand with persistence middleware to automatically save user data to localStorage. This means:

-   **Form data is automatically saved** as users fill out the resume forms
-   **Data persists across page refreshes** and browser sessions
-   **Date objects are properly handled** - they're converted to ISO strings for storage and back to Date objects when loaded
-   **Step progress is maintained** - users return to the same step they were on
-   **Active step is synchronized** - the StepsBar component automatically shows the correct step when data is loaded from storage

### Storage Details

-   **Storage Key**: `resume-data-store`
-   **Storage Method**: localStorage
-   **Persisted Data**: User form data and current step
-   **Version Control**: Includes migration support for future updates

### Clearing Stored Data

To clear all stored data, you can use the browser's developer tools:

1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Find localStorage
4. Delete the `user-data-store` entry

Or programmatically call `clearStorage()` from the store.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
