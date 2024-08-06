import Login from '~/components/login/Login';
import { Title } from '@solidjs/meta';

export default function LoginPage() {
  return (
    <>
      <Title>Login | Waves</Title>
      <main class="bg-background p-5 h-dvh">
        <Login />
      </main>
    </>
  );
}
