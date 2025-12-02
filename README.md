# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9d5daa3b-dedd-4954-8173-6f093e3c4bc3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9d5daa3b-dedd-4954-8173-6f093e3c4bc3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Local Development with Claude API

This project uses Claude API (Anthropic) for object detection via Supabase Edge Functions. Supabase is used **only for serverless functions** (no database needed).

**Quick Start:**

1. Install dependencies: `npm install`
2. Install Supabase CLI: `npm install -g supabase` (or `brew install supabase/tap/supabase` on macOS)
3. Start Supabase: `supabase start`
4. Set your Claude API key: `supabase secrets set ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY`
5. Create `.env` file with your local Supabase credentials (from `supabase start` output)
6. Start dev server: `npm run dev`

**For detailed setup instructions, see [LOCAL_SETUP.md](./LOCAL_SETUP.md)**

## Publishing/Deployment

**Supabase Free Tier** is perfect for this app! It includes:
- ✅ **500,000 Edge Function invocations/month** (plenty for occasional use)
- ✅ **5 GB bandwidth/month**
- ✅ Free hosting for Edge Functions

**To publish:**

1. **Deploy Edge Function to Supabase Cloud:**
   ```bash
   # Link to your Supabase project (create one at supabase.com)
   supabase link --project-ref your-project-ref
   
   # Deploy the function
   supabase functions deploy detect-objects
   
   # Set the API key in production
   supabase secrets set ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY
   ```

2. **Deploy Frontend** (Vercel, Netlify, etc.):
   ```bash
   npm run build
   ```
   Then deploy the `dist` folder and set environment variables:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = Your Supabase anon key

The free tier easily handles occasional requests - you're all set! 🚀

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Edge Functions)
- Claude API (Anthropic) for vision/object detection

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9d5daa3b-dedd-4954-8173-6f093e3c4bc3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
