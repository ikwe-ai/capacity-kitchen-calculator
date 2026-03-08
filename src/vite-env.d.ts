/// <reference types="vite/client" />

declare module 'netlify-identity-widget' {
  interface User {
    id: string;
    email: string;
    user_metadata: Record<string, unknown>;
    app_metadata: Record<string, unknown>;
    token: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      expires_at: number;
    };
  }

  function init(opts?: { container?: string; APIUrl?: string; logo?: boolean }): void;
  function open(tab?: 'login' | 'signup'): void;
  function close(): void;
  function logout(): void;
  function currentUser(): User | null;
  function on(event: 'init', cb: (user: User | null) => void): void;
  function on(event: 'login', cb: (user: User) => void): void;
  function on(event: 'logout', cb: () => void): void;
  function on(event: 'error', cb: (err: Error) => void): void;
  function on(event: 'open' | 'close', cb: () => void): void;
  function off(event: string): void;

  const netlifyIdentity: {
    init: typeof init;
    open: typeof open;
    close: typeof close;
    logout: typeof logout;
    currentUser: typeof currentUser;
    on: typeof on;
    off: typeof off;
  };

  export default netlifyIdentity;
  export type { User };
}
