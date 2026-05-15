import { useState } from 'react';

import { useAuth } from '@/core/auth/use-auth';

export function LoginPage() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <section>
      <h1>Login</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void auth.login({ email, password });
        }}
      >
        <label>
          Email
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>
        <button disabled={auth.status === 'checking'} type="submit">
          Masuk
        </button>
      </form>
      {auth.error ? <p role="alert">{auth.error}</p> : null}
    </section>
  );
}
