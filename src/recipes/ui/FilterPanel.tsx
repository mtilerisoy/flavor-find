'use client';

import React from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Tag } from '@/recipes/lib/api';

interface FilterPanelProps {
  tags: Tag[];
}

/**
 * A client component that renders filter controls and updates the URL
 * query parameters when the user interacts with them.
 */
export function FilterPanel({ tags }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current active tags from URL for styling
  const activeTags = searchParams.get('tags')?.split(',') || [];

  const handleFilterChange = (
    key: string,
    value: string | number | null
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTags = params.get('tags')?.split(',') || [];
    
    let newTags;
    if (currentTags.includes(tagName)) {
      // Deselect tag
      newTags = currentTags.filter((t) => t !== tagName);
    } else {
      // Select tag
      newTags = [...currentTags, tagName];
    }

    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="search"
            id="search"
            placeholder="Pasta, chicken, etc."
            defaultValue={searchParams.get('search') || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Total Time Filter */}
        <div>
          <label htmlFor="maxTime" className="block text-sm font-medium text-gray-700">
            Total Time
          </label>
          <select
            id="maxTime"
            value={searchParams.get('maxTime') || ''}
            onChange={(e) => handleFilterChange('maxTime', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Any</option>
            <option value="15">&lt; 15 min</option>
            <option value="30">&lt; 30 min</option>
            <option value="60">&lt; 60 min</option>
          </select>
        </div>

        {/* Max Ingredients Filter */}
        <div>
          <label htmlFor="maxIngredients" className="block text-sm font-medium text-gray-700">
            Max Ingredients
          </label>
          <select
            id="maxIngredients"
            value={searchParams.get('maxIngredients') || ''}
            onChange={(e) => handleFilterChange('maxIngredients', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Any</option>
            <option value="5">&lt; 5 ingredients</option>
            <option value="7">&lt; 7 ingredients</option>
            <option value="10">&lt; 10 ingredients</option>
          </select>
        </div>
      </div>
      
      {/* Tag Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700">Tags</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagClick(tag.name)}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${
                activeTags.includes(tag.name)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}