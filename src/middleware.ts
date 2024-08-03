import { createMiddleware } from '@solidjs/start/middleware';
import { getCookie, setCookie, getHeader } from 'vinxi/http';
import { Session, User, verifyRequestOrigin } from 'lucia';
import { getLucia } from './lib/auth';

export default createMiddleware({
  onRequest: async (event) => {
    if (event.request.method !== 'GET') {
      const originHeader = getHeader(event.nativeEvent, 'Origin') ?? null;
      const hostHeader = getHeader(event.nativeEvent, 'Host') ?? null;
      if (
        !originHeader ||
        !hostHeader ||
        !verifyRequestOrigin(originHeader, [hostHeader])
      ) {
        event.nativeEvent.node.res.writeHead(403).end();
        return;
      }
    }
    const lucia = await getLucia();
    const cookie =
      getCookie(event.nativeEvent, lucia.sessionCookieName) ?? null;
    const sessionId = cookie ? lucia.readSessionCookie(cookie) : null;
    if (!sessionId) {
      event.locals.session = null;
      event.locals.user = null;
      return;
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      event.response.headers.set(
        lucia.sessionCookieName,
        lucia.createSessionCookie(session.id).serialize(),
      );
    }
    if (!session) {
      event.response.headers.set(
        lucia.sessionCookieName,
        lucia.createBlankSessionCookie().serialize(),
      );
    }

    event.locals.session = session;
    event.locals.user = user;
  },
});

// declare module "vinxi/server" {
//   interface H3EventContext {
//     user: User | null;
//     session: Session | null;
//   }
// }
