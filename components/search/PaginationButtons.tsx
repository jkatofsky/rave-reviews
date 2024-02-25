import { Button, Group } from '@mantine/core';

interface PaginationButtonsProps {
	page: number;
	setPage: any; //TODO: type properly
	hasNextPage: boolean;
}

export function PaginationButtons({ page, setPage, hasNextPage }: PaginationButtonsProps) {
	return (
		<Group>
			<Button
				variant="outline"
				disabled={page === 0}
				onClick={() =>
					setPage(({ page }: { page: number }) => ({
						page: page - 1,
					}))
				}
			>
				&larr;&nbsp;Previous page
			</Button>
			<Button
				variant="outline"
				disabled={!hasNextPage}
				onClick={() =>
					setPage(({ page }: { page: number }) => ({
						page: page + 1,
					}))
				}
			>
				Next page&nbsp;&rarr;
			</Button>
		</Group>
	);
}
