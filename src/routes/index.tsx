import { A } from '@solidjs/router';
import { Title } from '@solidjs/meta';

export default function MainPage() {
  return (
    <>
      <Title>Waves</Title>
      <main class="text-center mx-auto text-gray-700 p-4">
        <A href="/login">Log In here</A>
      </main>
    </>
  );
}
