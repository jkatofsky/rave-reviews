import { Button, Center, Stack, Title } from '@mantine/core';
import Link from 'next/link';

export default function Home() {
	return (
		<Center w="100vw" h="80vh">
			<Stack p="lg">
				<Title order={1} fw={500} mb="xl">
					crowdsourced rave reviews - by dance music lovers, for dance music lovers
				</Title>
				<Button
					component={Link}
					href="/organizers"
					size="xl"
					variant="gradient"
					gradient={{ from: 'blue', to: 'purple' }}
				>
					<Title fw={500} order={1} fs="italic">
						find your next rave
					</Title>
				</Button>
			</Stack>
		</Center>
	);
}
