// Astro content collections — declares the per-version changelog
// collection used by the sidebar/changelog pages.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const changelog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
    schema: z.object({
        version: z.string(),
        date: z.string(), // ISO YYYY-MM-DD; sort by string compare
        title: z.string().optional(),
    }),
});

export const collections = { changelog };
