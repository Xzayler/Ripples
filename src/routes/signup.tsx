import SignUp from '~/components/login/SignUp';
import { Title } from '@solidjs/meta';

export default function LoginPage() {
  return (
    <>
      <Title>Sign Up | Waves</Title>
      <main class="bg-background p-5 h-dvh">
        <SignUp />
      </main>
    </>
  );
}
