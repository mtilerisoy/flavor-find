import { getPublicRecipes, getAvailableTags } from '@/recipes/lib/api';
import { RecipeCard } from '@/recipes/ui/RecipeCard';
import { FilterPanel } from '@/recipes/ui/FilterPanel';

interface HomePageProps {
  searchParams: {
    maxTime?: string;
    maxIngredients?: string;
    tags?: string;
    search?: string;
    minProtein?: string;
    maxCarbs?: string;
  };
}

/**
 * The main home page, now with filtering capabilities.
 * It reads filters from searchParams and passes them to the API.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  // Await searchParams before using its properties
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search || undefined;
  const tags = resolvedSearchParams.tags?.split(',') || undefined;
  const maxTime = resolvedSearchParams.maxTime ? Number(resolvedSearchParams.maxTime) : undefined;
  const maxIngredients = resolvedSearchParams.maxIngredients
    ? Number(resolvedSearchParams.maxIngredients)
    : undefined;

  // Fetch data in parallel for better performance
  const [recipes, availableTags] = await Promise.all([
    getPublicRecipes({
      maxTime,
      maxIngredients,
      tags,
      search,
    }),
    getAvailableTags(),
  ]);

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

      <FilterPanel tags={availableTags} />

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>No recipes match your current filters.</p>
        </div>
      )}
    </main>
  );
}