# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ListingAI is a Next.js web app for cross-border e-commerce sellers. Users input Chinese product info, and AI generates Amazon/Shopify-compliant English titles, bullet points, and descriptions. Uses DeepSeek API via Vercel AI SDK for generation, Supabase for auth + database.

## Build & Deploy

- **Dev**: `npm run dev` (Next.js dev server)
- **Build**: `npm run build` (Next.js production build)
- **Deploy**: Push to `main` branch -> Vercel auto-deploys

## Architecture

### Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Vercel AI SDK + DeepSeek API
- Supabase (Auth + PostgreSQL with RLS)

### Key Files

src/app/api/generate/route.ts - AI generation (streaming POST)
src/app/api/credits/route.ts - Fetch credits
src/app/dashboard/layout.tsx - Sidebar + credits
src/app/dashboard/new/page.tsx - Generation form
src/lib/supabase/server.ts - Server-side Supabase client
src/lib/ai.ts - DeepSeek config
src/middleware.ts - Route protection

### Data Flow

1. User input -> /api/generate -> auth check -> credit check
2. streamText() -> DeepSeek -> plain text stream to client
3. After stream: extract JSON, save to DB, deduct credits

### Database

profiles (credits, plan), projects, generations, feedbacks
All RLS: auth.uid() = user_id
Trigger: handle_new_user creates profile with 10 credits

## Env Variables

NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_API_KEY
