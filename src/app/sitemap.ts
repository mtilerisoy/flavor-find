import { MetadataRoute } from 'next';
import { getPublicRecipes } from '@/recipes/lib/api';

// IMPORTANT: Replace this with your actual production domain
const BASE_URL = 'https://flavor-find.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getPublicRecipes({});

  const recipeEntries: MetadataRoute.Sitemap = recipes.map((recipe) => ({
    url: `${BASE_URL}/recipes/${recipe.id}`,
    lastModified: new Date(), // In a real app, you'd use a recipe's `updated_at` field
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...recipeEntries,
  ];
}