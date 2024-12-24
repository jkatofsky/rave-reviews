import { signIn } from '@/actions/auth';
import { Button } from '@mantine/core';

export function LoginForm() {
	return (
		<form
			action={async () => {
				'use server';
				await signIn('google');
			}}
		>
			<Button type="submit">Signin with Google</Button>
		</form>
	);
}
