import '@mantine/core/styles.css';
import React from 'react';
import Link from 'next/link';
import { MantineProvider, ColorSchemeScript, mantineHtmlProps, Title, Center } from '@mantine/core';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SessionProvider } from 'next-auth/react';

import { ReactQueryProvider } from '@/components/contexts';

import { theme } from '../theme';

export const metadata = {
	title: 'Rave Reviews',
};

export default function RootLayout({ children }: { children: any }) {
	return (
		<html lang="en" {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
			</head>
			<body>
				<NuqsAdapter>
					<MantineProvider theme={theme}>
						<ReactQueryProvider>
							<SessionProvider>
								<Center p="md">
									<Link href="/" style={{ textDecoration: 'none' }}>
										<Title fw={300} c="black">
											rave reviews
										</Title>
									</Link>
								</Center>
								{children}
							</SessionProvider>
						</ReactQueryProvider>
					</MantineProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
