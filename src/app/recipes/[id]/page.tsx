import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById } from '@/recipes/lib/api';

interface RecipePageProps {
  params: {
    id: string;
  };
}

/**
 * A dynamic page to display the full details of a single recipe.
 * Fetches data using the ID from the URL.
 */
export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = params;
  const recipe = await getRecipeById(id);

  // If no recipe is found for the given ID, render the 404 page.
  if (!recipe) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Recipes
        </Link>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {recipe.title}
        </h1>
        <p className="mt-4 text-lg text-gray-600">{recipe.description}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          <span>{`Prep: ${recipe.prep_time_minutes} min`}</span>
          <span>{`Cook: ${recipe.cook_time_minutes} min`}</span>
          <span>{`Total: ${recipe.total_time_minutes} min`}</span>
          <span>{`Servings: ${recipe.servings_yield}`}</span>
        </div>
      </div>

      {recipe.image_url && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg sm:h-80">
          <Image
            src={recipe.image_url}
            alt={`Image of ${recipe.title}`}
            fill
            className="object-cover"
            priority // Prioritize loading the main image on the page
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Ingredients Section */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold text-gray-800">Ingredients</h2>
          <ul className="mt-4 space-y-2">
            {recipe.ingredients.map((ing) => (
              <li key={ing.name} className="flex items-start">
                <span className="mr-2 mt-1 block h-1.5 w-1.5 rounded-full bg-gray-400" />
                <span>
                  {ing.quantity} {ing.unit} <strong>{ing.name}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800">Instructions</h2>
          <ol className="mt-4 space-y-4">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex">
                <span className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-gray-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}