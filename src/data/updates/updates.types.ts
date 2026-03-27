export type UpdateItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  version: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicUpdateListItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  version: string | null;
  publishedAt: string | null;
};
