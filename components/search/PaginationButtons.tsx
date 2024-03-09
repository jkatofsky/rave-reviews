import { Button, Group } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

interface PaginationButtonsProps {
	page: number;
	setPage: any; //TODO: type properly
	hasNextPage: boolean;
}

// TODO: scroll-to?
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
				<IconArrowLeft />
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
				<IconArrowRight />
			</Button>
		</Group>
	);
}
