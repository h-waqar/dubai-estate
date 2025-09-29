export interface CreatePostInput {
    title: string;
    content: string;
    authorId?: number;       // optional, posts may have no author yet
    slug?: string;           // optional, will be auto-generated
    excerpt?: string;        // optional summary
    coverImage?: string;     // optional banner image
    category?: string;       // optional, e.g., "Luxury", "Market Insights"
}
