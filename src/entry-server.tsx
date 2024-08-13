import { createHandler, StartServer } from '@solidjs/start/server';
import { initDb } from './lib/database';
initDb();

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body class="min-h-dvh bg-background">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
