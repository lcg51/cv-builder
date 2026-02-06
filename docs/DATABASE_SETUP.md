# Database Setup Guide

## Overview

This guide will help you set up Vercel Postgres with Drizzle ORM for your CV Builder application with Google OAuth authentication.

## Prerequisites

-   Node.js >= 20.11.0 (you currently have v16.14.0 - needs upgrade)
-   Vercel account
-   Google OAuth credentials

## Step 1: Update Node.js

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Or using Homebrew on macOS
brew install node@20
```

## Step 2: Install Dependencies

```bash
pnpm add drizzle-orm @auth/drizzle-adapter
pnpm add -D drizzle-kit
```

## Step 3: Environment Variables

Add these to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (you should already have these)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Vercel Postgres Database
POSTGRES_URL=your-postgres-connection-string
POSTGRES_PRISMA_URL=your-postgres-prisma-connection-string
POSTGRES_URL_NON_POOLING=your-postgres-non-pooling-connection-string
POSTGRES_USER=your-postgres-user
POSTGRES_HOST=your-postgres-host
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DATABASE=your-postgres-database
```

## Step 4: Set up Vercel Postgres

### Option A: Using Vercel Dashboard

1. Go to your Vercel dashboard
2. Select your project
3. Go to Storage tab
4. Create a new Postgres database
5. Copy the connection strings to your `.env.local`

### Option B: Using Vercel CLI

```bash
vercel storage create postgres
```

## Step 5: Generate and Run Migrations

```bash
# Generate migration files
pnpm db:generate

# Push schema to database
pnpm db:push

# Or run migrations (if you prefer migration files)
pnpm db:migrate
```

## Step 6: Verify Setup

```bash
# Open Drizzle Studio to view your database
pnpm db:studio
```

## Database Schema

The setup includes these tables:

### NextAuth Tables

-   `user` - User authentication data
-   `account` - OAuth account information
-   `session` - User sessions
-   `verificationToken` - Email verification tokens

### CV Builder Tables

-   `user_profile` - User profile information (name, contact, etc.)
-   `user_education` - Education history
-   `user_work_experience` - Work experience
-   `user_skills` - Skills and proficiency levels

## Usage Examples

### Get User Data

```typescript
import { UserService } from '@/lib/db/user-service';

// Get complete user CV data
const userData = await UserService.getCompleteUserData(userId);

// Get specific sections
const profile = await UserService.getUserProfile(userId);
const education = await UserService.getUserEducation(userId);
const workExperience = await UserService.getUserWorkExperience(userId);
const skills = await UserService.getUserSkills(userId);
```

### Save User Data

```typescript
import { UserService } from '@/lib/db/user-service';
import type { UserDataType } from '@/app/models/user';

const userData: UserDataType = {
	firstName: 'John',
	lastName: 'Doe'
	// ... other fields
};

await UserService.saveCompleteUserData(userId, userData);
```

## Integration with Your Forms

You can now update your CV forms to save data to the database instead of just local state:

```typescript
// In your form components
import { UserService } from '@/lib/db/user-service';
import { useSession } from 'next-auth/react';

const { data: session } = useSession();

const handleSave = async (formData: UserDataType) => {
	if (session?.user?.id) {
		await UserService.saveCompleteUserData(session.user.id, formData);
	}
};
```

## Troubleshooting

### Common Issues

1. **Node.js Version Error**: Upgrade to Node.js 20+
2. **Connection Issues**: Verify your `POSTGRES_URL` is correct
3. **Migration Errors**: Ensure database is accessible and credentials are correct

### Useful Commands

```bash
# Check database connection
pnpm db:studio

# Reset database (careful!)
pnpm db:push --force

# Generate new migration
pnpm db:generate

# View database schema
pnpm db:studio
```

## Next Steps

1. Update your existing forms to use the database
2. Add data validation and error handling
3. Implement data caching for better performance
4. Add backup and recovery procedures

## Security Considerations

-   Always use environment variables for sensitive data
-   Implement proper user authorization
-   Consider row-level security for multi-tenant scenarios
-   Regular database backups
-   Monitor database performance and usage
