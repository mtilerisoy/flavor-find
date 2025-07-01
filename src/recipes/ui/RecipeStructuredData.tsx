import React from "react";
import type { Recipe } from '@/recipes/lib/api';

interface RecipeStructuredDataProps {
  recipe: Recipe;
}

/**
 * Renders the JSON-LD structured data for a recipe.
 * This is crucial for SEO and enabling Rich Snippets in Google Search.
 */
export function RecipeStructuredData({ recipe }: RecipeStructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.image_url,
    prepTime: `PT${recipe.prep_time_minutes}M`,
    cookTime: `PT${recipe.cook_time_minutes}M`,
    totalTime: `PT${recipe.total_time_minutes}M`,
    recipeYield: `${recipe.servings_yield}`,
    recipeIngredient: recipe.ingredients.map(
      (ing) => `${ing.quantity} ${ing.unit} ${ing.name}`
    ),
    recipeInstructions: recipe.instructions.map((step, index) => ({
      '@type': 'HowToStep',
      text: step,
      position: index + 1,
    })),
    // You can add more fields like author, ratings etc. later
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}