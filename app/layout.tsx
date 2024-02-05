import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript, Title, Center } from '@mantine/core';

import { theme } from '../theme';

export const metadata = {
	title: 'Rave Reviews',
};

// TODO: what to do about the fact that mantine does another render of its Mantine-y theme stuff on the client?
// the server-rendered CSS looks godawful - won't that mess up link previews?
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
				<MantineProvider theme={theme}>
					<Center mb="sm" p="md">
						<Title fw={300}>rave reviews</Title>
					</Center>
					{children}
				</MantineProvider>
			</body>
		</html>
	);
}
