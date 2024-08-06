import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';
import WavesIcon from './components/shared/icons/WavesIcon';
import { MetaProvider } from '@solidjs/meta';

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Suspense
            fallback={
              <div class="w-full h-dvh bg-background flex items-center justify-center  ">
                <WavesIcon />
              </div>
            }
          >
            {props.children}
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
