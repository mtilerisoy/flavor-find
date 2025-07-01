import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/recipes/lib/api';

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * A compact card component to display a recipe's summary.
 * Links to the full recipe detail page.
 */
export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-40 w-full">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={`Image of ${recipe.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-sm text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate text-lg font-bold leading-tight text-gray-800">
          {recipe.title}
        </h3>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span>{`Total: ${recipe.total_time_minutes} min`}</span>
          <span>{`Servings: ${recipe.servings_yield}`}</span>
        </div>
      </div>
    </Link>
  );
}