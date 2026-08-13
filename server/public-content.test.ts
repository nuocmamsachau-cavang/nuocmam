import { describe, expect, it } from 'vitest';
import { filterApprovedReviews, filterPublishedPosts } from '../client/src/lib/publicContent.js';

describe('Public content visibility', () => {
  it('keeps only published blog posts', () => {
    const posts = [
      { id: 1, title: 'Published', isPublished: true },
      { id: 2, title: 'Draft', isPublished: false },
      { id: 3, title: 'Unknown', isPublished: null },
    ];
    expect(filterPublishedPosts(posts).map((post) => post.id)).toEqual([1]);
  });

  it('keeps only approved reviews', () => {
    const reviews = [
      { id: 1, title: 'Approved', isApproved: true },
      { id: 2, title: 'Pending', isApproved: false },
      { id: 3, title: 'Unknown', isApproved: null },
    ];
    expect(filterApprovedReviews(reviews).map((review) => review.id)).toEqual([1]);
  });
});
