// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from "@astrojs/node";
import clerk from "@clerk/astro";

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), vue()],
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    }
  }),
  output: "server",
  vite: {
    plugins: [tailwindcss()]
  },
  env: {
    schema: {
      SUPABASE_URL: envField.string({ context: 'client', access: 'public' }),
      SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public' }),
    }
  }
});