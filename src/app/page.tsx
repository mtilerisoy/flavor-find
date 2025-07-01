import { getPublicRecipes } from '@/recipes/lib/api';
import { RecipeCard } from '@/recipes/ui/RecipeCard';

/**
 * The main home page, displaying a gallery of all available recipes.
 * This is a React Server Component, so it can fetch data directly.
 */
export default async function HomePage() {
  // We call our API to get the recipe data from the local JSON file.
  const recipes = await getPublicRecipes({});

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Flavor-Find
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover your next favorite meal in 60 seconds.
        </p>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>No recipes found. Try adding some to `src/data/recipes.json`!</p>
        </div>
      )}
    </main>
  );
}