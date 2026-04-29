"use server";

import { SearchService } from "@/modules/search/services/search.service";
import { globalSearchSchema } from "@/validators/search";
import { SearchResult, SearchPurpose } from "@/modules/search/types/search.types";

export async function globalSearchAction(input: unknown): Promise<{ data?: SearchResult[], error?: string }> {
  const validation = globalSearchSchema.safeParse(input);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const results = await SearchService.search(validation.data);
    return { data: results };
  } catch (error) {
    console.error("Global Search Error:", error);
    return { error: "An error occurred while performing search." };
  }
}

export async function getSearchSuggestionsAction(purpose?: SearchPurpose): Promise<{ data?: SearchResult[], error?: string }> {
  try {
    const results = await SearchService.getSuggestions(purpose);
    return { data: results };
  } catch (error) {
    console.error("Search Suggestions Error:", error);
    return { error: "An error occurred while fetching suggestions." };
  }
}
