-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text DEFAULT ''::text,
  last_name text DEFAULT ''::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_catalogs (
  id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  service USER-DEFINED NOT NULL,
  CONSTRAINT user_catalogs_pkey PRIMARY KEY (id),
  CONSTRAINT user_catalogs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_genres (
  id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  genre USER-DEFINED NOT NULL,
  CONSTRAINT user_genres_pkey PRIMARY KEY (id),
  CONSTRAINT user_genres_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_history (
  id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  transcript text NOT NULL,
  user_id uuid DEFAULT gen_random_uuid(),
  moods ARRAY,
  CONSTRAINT user_history_pkey PRIMARY KEY (id),
  CONSTRAINT user_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_watchlist (
  id smallint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  id_streaming text,
  id_imdb text UNIQUE,
  id_tmdb integer UNIQUE,
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT user_watchlist_pkey PRIMARY KEY (id),
  CONSTRAINT user_watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);