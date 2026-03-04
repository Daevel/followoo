interface InstagramUser {
  title?: string;
  media_list_data?: string[];
  string_list_data?: {
    href: string;
    value: string;
    timestamp: number;
  }[];
}

export interface RelationshipsData {
  relationships_following: InstagramUser[];
}
