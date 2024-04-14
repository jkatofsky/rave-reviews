'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider, keepPreviousData } from '@tanstack/react-query';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						placeholderData: keepPreviousData,
					},
				},
			})
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
