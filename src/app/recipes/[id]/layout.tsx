import React from "react";
import { notFound } from 'next/navigation';
import { getRecipeById } from '@/recipes/lib/api';
import { RecipeStructuredData } from '@/recipes/ui/RecipeStructuredData';

interface RecipeLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export default async function RecipeLayout({
  children,
  params,
}: RecipeLayoutProps) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <>
      <RecipeStructuredData recipe={recipe} />
      {children}
    </>
  );
}