import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript, Title, Center } from '@mantine/core';

import { theme } from '../theme';
import Link from 'next/link';

export const metadata = {
	title: 'Rave Reviews',
};

export default function RootLayout({ children }: { children: any }) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
			</head>
			<body>
				{/* TODO: colour theme */}
				<MantineProvider theme={theme}>
					<Center p="md">
						<Link href="/" style={{ textDecoration: 'none' }}>
							<Title fw={300} c="black">
								rave reviews
							</Title>
						</Link>
					</Center>
					{children}
				</MantineProvider>
			</body>
		</html>
	);
}
