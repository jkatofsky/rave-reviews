export type PaginatedResponse<T> = {
	hasNextPage: boolean;
	value: T[];
};
