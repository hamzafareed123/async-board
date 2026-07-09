import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border">
        <span className="text-lg font-semibold text-text-primary">sync-board</span>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-32">
        <span className="px-3 py-1 mb-6 text-xs font-medium text-primary bg-primary-light rounded-full">
          Real-time collaboration
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold text-text-primary max-w-2xl leading-tight">
          Build and draw together, in real time
        </h1>
        <p className="mt-4 text-lg text-text-secondary max-w-xl">
          sync-board is a collaborative whiteboard where your team can sketch, plan, and build ideas together — live.
        </p>

        <div className="flex items-center gap-4 mt-8">
          <Link
            to="/signup"
            className="px-6 py-3 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition"
          >
            Build your board
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 text-sm font-medium text-text-primary bg-surface border border-border hover:bg-surface-2 rounded-lg transition"
          >
            Start drawing
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage