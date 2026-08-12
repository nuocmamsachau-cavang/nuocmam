export interface PublicBlogPost {
  isPublished?: boolean | null;
}

export interface PublicReview {
  isApproved?: boolean | null;
}

export function filterPublishedPosts<T extends PublicBlogPost>(posts: T[]): T[] {
  return posts.filter((post) => post.isPublished === true);
}

export function filterApprovedReviews<T extends PublicReview>(reviews: T[]): T[] {
  return reviews.filter((review) => review.isApproved === true);
}
