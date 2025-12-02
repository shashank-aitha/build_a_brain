# Local Development Setup

This guide will help you run this project locally with Claude API integration.

## Prerequisites

1. **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
2. **Supabase CLI** - Install with:
   ```bash
   npm install -g supabase
   ```
   Or using Homebrew (macOS):
   ```bash
   brew install supabase/tap/supabase
   ```

3. **Docker Desktop** - Required for local Supabase instance
   - Download from: https://www.docker.com/products/docker-desktop

## Setup Steps

### 1. Install Dependencies

```bash
cd simple-site-builder
npm install
```

### 2. Start Supabase Locally

```bash
# Start Supabase (this will start Docker containers)
supabase start
```

This will output your local Supabase credentials. Look for:
- `API URL: http://127.0.0.1:54321`
- `anon key: <your-anon-key>`

### 3. Configure Environment Variables

Create a `.env` file in the `simple-site-builder` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your local Supabase credentials:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key-from-step-2>
```

### 4. Set Claude API Key in Supabase

Set the Anthropic API key as a Supabase secret:

```bash
supabase secrets set ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY
```

**Note**: Replace `YOUR_ANTHROPIC_API_KEY` with your actual Anthropic API key from https://console.anthropic.com/

### 5. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080` (or the port shown in the terminal).

## Running the Application

1. **Frontend**: The Vite dev server runs on `http://localhost:8080`
2. **Supabase Functions**: Available at `http://127.0.0.1:54321/functions/v1/`
3. **Supabase Dashboard**: Available at `http://127.0.0.1:54323`

## Troubleshooting

### Supabase won't start
- Make sure Docker Desktop is running
- Try: `supabase stop` then `supabase start`

### Function not working
- Check that the API key is set: `supabase secrets list`
- Check function logs: `supabase functions logs detect-objects`

### Port conflicts
- If port 8080 is taken, Vite will automatically use the next available port
- Check the terminal output for the actual port

## Stopping the Services

```bash
# Stop the dev server: Ctrl+C in the terminal

# Stop Supabase
supabase stop
```

## Useful Commands

```bash
# View Supabase logs
supabase functions logs detect-objects

# Restart Supabase
supabase stop && supabase start

# Check Supabase status
supabase status

# List secrets
supabase secrets list
```

