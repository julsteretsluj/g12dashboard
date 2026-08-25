import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function AccountBar() {
  const {
    configured,
    ready,
    user,
    sync,
    message,
    signInGoogle,
    signInEmail,
    createEmail,
    logOut,
  } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!configured) {
    return (
      <div className="account">
        <strong>Save across devices</strong>
        <p>
          Add a free Firebase project, drop the keys in <code>.env.local</code>, then restart{' '}
          <code>npm run dev</code>. Enable Google and Email sign-in, and paste the rules from{' '}
          <code>firestore.rules</code>.
        </p>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="account">
        <p className="meta">Checking sign-in…</p>
      </div>
    )
  }

  if (user) {
    return (
      <div className="account">
        <strong>{user.displayName || user.email}</strong>
        <p className="sync-line">
          {sync === 'saving' ? 'Saving…' : sync === 'error' ? 'Cloud save failed' : 'Saved to your account'}
        </p>
        {message && <p className="account-error">{message}</p>}
        <button className="btn ghost" type="button" onClick={() => void logOut()}>
          Sign out
        </button>
        <p className="meta" style={{ marginTop: 8 }}>
          Uploaded files stay on this device.
        </p>
      </div>
    )
  }

  return (
    <div className="account">
      <strong>Sign in to save</strong>
      <p>Notes, units, tests, and home to-dos follow this account. This browser still keeps a copy.</p>
      <button className="btn" type="button" onClick={() => void signInGoogle()}>
        Continue with Google
      </button>
      <form
        className="account-form"
        onSubmit={(e) => {
          e.preventDefault()
          void signInEmail(email, password)
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
        />
        <div className="account-actions">
          <button className="btn" type="submit">
            Sign in
          </button>
          <button className="btn ghost" type="button" onClick={() => void createEmail(email, password)}>
            Create
          </button>
        </div>
      </form>
      {message && <p className="account-error">{message}</p>}
    </div>
  )
}
