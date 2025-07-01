import path from 'path';
import { promises as fs } from 'fs';
import { cache } from 'react';

export interface Tag {
  id: string;
  name: string;
}

// Define the types for our data structures to ensure type safety
// These should match the structure of your JSON files.

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  source_url?: string;
  image_url?: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  total_time_minutes: number;
  servings_yield: number;
  instructions: string[];
  tags: string[];
  calculated_macros: {
    protein_grams: number;
    carbs_grams: number;
    fat_grams: number;
  };
  ingredients: RecipeIngredient[];
}

// --- Data Fetching Functions ---

/**
 * Reads and parses the recipes.json file.
 * `cache` ensures this file is read only once per request, even if called multiple times.
 */
const getRecipes = cache(async (): Promise<Recipe[]> => {
  const filePath = path.join(process.cwd(), 'src/data/recipes.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    // In a real app, you'd add Zod parsing here for validation
    return JSON.parse(fileContents) as Recipe[];
  } catch (error) {
    console.error('Failed to read or parse recipes.json:', error);
    return []; // Return an empty array on error
  }
});

/**
 * Fetches all public recipes and applies filters.
 * In this file-based system, we fetch all recipes and then filter in-memory.
 */
export async function getPublicRecipes(filters: {
  maxTime?: number;
  maxIngredients?: number;
  minProtein?: number;
  maxCarbs?: number;
  tags?: string[];
  search?: string;
}): Promise<Recipe[]> {
  let recipes = await getRecipes();

  if (!recipes) {
    return [];
  }

  // Apply filters
  if (filters.maxTime) {
    recipes = recipes.filter(
      (recipe) => recipe.total_time_minutes <= filters.maxTime!
    );
  }

  if (filters.maxIngredients) {
    recipes = recipes.filter(
      (recipe) => recipe.ingredients.length <= filters.maxIngredients!
    );
  }

  if (filters.minProtein) {
    recipes = recipes.filter(
      (recipe) => recipe.calculated_macros.protein_grams >= filters.minProtein!
    );
  }

  if (filters.maxCarbs) {
    recipes = recipes.filter(
      (recipe) => recipe.calculated_macros.carbs_grams <= filters.maxCarbs!
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    recipes = recipes.filter((recipe) =>
      filters.tags!.every((tag) => recipe.tags.includes(tag))
    );
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    recipes = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm))
    );
  }

  return recipes;
}

/**
 * Finds a single recipe by its ID.
 */
export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const recipes = await getRecipes();
  return recipes.find((recipe) => recipe.id === id);
}

export async function getAvailableTags(): Promise<Tag[]> {
  const filePath = path.join(process.cwd(), 'src/data/tags.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as Tag[];
  } catch (error) {
    console.error('Failed to read or parse tags.json:', error);
    return [];
  }
}