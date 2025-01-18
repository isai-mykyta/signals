export interface Market {
  id: number;
  name: string;
  url: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SearchMarketsOptions {
  ids?: number[];
  names?: string[];
  url?: string;
  from?: Date | string;
  limit?: number;
  offset?: number;
  to?: Date | string;
  order?: "ASC" | "DESC"
}

export interface CreateMarketOptions {
  name: string;
  url: string;
}

export interface UpdateMarketOptions {
  name?: string;
  url?: string;
}

export interface SearchQuery {
  where: Record<string, any>;
}
