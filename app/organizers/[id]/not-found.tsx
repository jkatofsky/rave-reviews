import { Button, Center, Group, Title } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
	return (
		<Center h="80%">
			<Group justify="center">
				<Title order={3}>this organizer does not exist :(</Title>
				<Button component={Link} href="/organizers" size="lg" variant="light">
					Go back to rave search
				</Button>
			</Group>
		</Center>
	);
}
