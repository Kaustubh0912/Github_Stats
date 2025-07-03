# GitFrame - GitHub Stats Dashboard

A modern, responsive dashboard for visualizing your GitHub statistics and activity. This project is built with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- GitHub OAuth authentication
- Personal dashboard with GitHub stats
- Language usage visualization
- Activity tracking
- Contribution insights
- Dark/light mode support

### Prerequisites

- Node.js 18+ and npm/yarn
- A GitHub account

### GitHub OAuth Configuration

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - **Application name**: GitFrame (or your preferred name)
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Click "Register application"
5. On the next screen, note your Client ID
6. Generate a new Client Secret and note it down (you won't be able to see it again)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# GitHub OAuth credentials
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Public environment variables (accessible in browser)
NEXT_PUBLIC_GITHUB_ID=your_github_client_id
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
```

Replace `your_github_client_id` and `your_github_client_secret` with the values from your GitHub OAuth App.

For `NEXTAUTH_SECRET`, you can generate a random string using:

```bash
openssl rand -base64 32
```

### Running the Application

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

When deploying to production:

1. Update the `NEXTAUTH_URL` to your production URL
2. Update the Authorization callback URL in your GitHub OAuth App settings to match your production URL
3. Set all environment variables in your hosting platform

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

### "The redirect_uri is not associated with this application"

This error occurs when the callback URL in your GitHub OAuth App settings doesn't match the one used by the application.

**Solution:**
1. Check that your GitHub OAuth App's "Authorization callback URL" exactly matches: `{NEXTAUTH_URL}/api/auth/callback/github`
2. Ensure your `.env.local` file has the correct `NEXTAUTH_URL` value
3. For local development, this should be `http://localhost:3000`

### Authentication Error Handling

The application includes comprehensive error handling for GitHub authentication issues:

- User-friendly error messages for common OAuth errors
- Detailed troubleshooting information
- Easy retry options

**Common Authentication Errors:**

| Error Code | Description | Solution |
|------------|-------------|----------|
| `AccessDenied` | User denied permission | Grant the necessary permissions when prompted |
| `Configuration` | OAuth setup issue | Check environment variables and GitHub OAuth settings |
| `OAuthSignin` | Sign-in process error | Verify GitHub credentials and network connection |
| `OAuthCallback` | Callback handling error | Check callback URL configuration |
| `OAuthAccountNotLinked` | Email already in use | Use a different authentication method or email |

If you encounter authentication errors, the application will display a helpful error screen with options to retry or return to the home page.

## License

MIT
