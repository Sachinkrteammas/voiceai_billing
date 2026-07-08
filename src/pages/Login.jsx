import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Waves, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { login } from "../services/authApi";


export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('billing@acmecorp.in')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Enter your email and password.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await login(email, password);

    onLogin?.(res.data.user);

    navigate("/");
  } catch (err) {
    setError(
      err.response?.data?.detail || "Invalid email or password."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white mb-3">
            <Waves size={21} strokeWidth={2.3} />
          </div>
          <p className="text-[15.5px] font-semibold text-ink-900">VoiceAI</p>
          <p className="text-[12.5px] text-ink-400">Billing Portal</p>
        </div>

        <div className="bg-white border border-ink-300/20 rounded-xl shadow-card p-7">
          <h1 className="text-[18px] font-semibold text-ink-900">Sign in</h1>
          <p className="text-[13px] text-ink-400 mt-1 mb-6">Access your wallet, usage and invoices</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[12.5px] font-medium text-ink-500">Email Address</label>
              <div className="relative mt-1.5">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-ink-300/40 pl-9 pr-3 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[12.5px] font-medium text-ink-500">Password</label>
                <button type="button" className="text-[12px] font-medium text-brand-600 hover:text-brand-700">
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-ink-300/40 pl-9 pr-9 py-2.5 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[12.5px] text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <label className="flex items-center gap-2 text-[12.5px] text-ink-500">
              <input type="checkbox" className="rounded border-ink-300/60 text-brand-500 focus:ring-brand-200" />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-[13.5px] font-medium rounded-lg py-2.5 transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>

        <p className="text-center text-[12.5px] text-ink-400 mt-5">
          Need access?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">
            Contact your account admin
          </Link>
        </p>
      </div>
    </div>
  )
}
