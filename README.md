# Audio Player

A five-track web player that logs every interaction (play, pause, seek, skip, mute) and shows the log on a second page.

Live: https://ard-audioplayer.vercel.app

## Stack

Next.js 14 (App Router), React 18, TypeScript strict, Tailwind CSS, tsParticles, Supabase (Postgres) for the action log, Vercel.

## Run locally

```bash
pnpm install
cp .env.example .env.local   # fill in the two Supabase values
pnpm dev
```

Open http://localhost:3000.

## Structure

```
src/
  app/            routes: / (player), /actions (server-rendered log), /api/useractions
  components/     Player, Controls, NowPlaying, Particles, ActionsList, Navbar, Footer
  hooks/          useAudioPlayer (all <audio> state, MediaSession, keyboard), useReducedMotion
  lib/            tracks, actions (Supabase queries), format, icons, supabase client
  assets/         posters and logo (optimised by next/image)
public/audio/     mp3 files, served static with immutable caching
```

## Keyboard

Space play/pause · ← → seek 5s · N / P next / previous · M mute

## Database

Table `audio_actions(id, user_action, song_title, created_at)` with row-level security allowing anonymous insert and select. Migration lives in Supabase; there is no ORM.
