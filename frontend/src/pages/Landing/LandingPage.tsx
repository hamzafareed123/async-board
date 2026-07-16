import { Link } from "react-router-dom";
import heroImage from "../../assets/heroImage.png";
import Logo from "../dashboard/DashboardLayout/Sidebar/Logo";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border">
        <span className="text-lg font-semibold text-text-primary">
          sync-board
        </span>
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

      <main className="mx-auto grid w-full max-w-7xl gap-16 px-6 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
        <section className="space-y-8">
          <div className="inline-flex rounded-full bg-primary-light px-4 py-1.5 text-sm font-semibold text-primary">
            Real-time collaboration platform
          </div>
          <div className="space-y-6">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl">
              Build, sketch, and collaborate in one shared board.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
              sync-board helps teams capture ideas, organize projects, and stay
              aligned with live drawing, board management, and instant feedback.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Start your free board
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-surface-2"
            >
              Explore features
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm font-semibold text-text-primary">
                Live collaboration
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Work together in real time with instant updates.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm font-semibold text-text-primary">
                Unlimited boards
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Create as many spaces as your team needs.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm font-semibold text-text-primary">
                Secure sharing
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Share boards with your team safely and easily.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center">
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-surface shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <img
              src={heroImage}
              alt="Sync board collaboration"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
          </div>
        </section>
      </main>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[32px] border border-border bg-surface p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Why SyncBoard
              </p>
              <h2 className="text-2xl font-semibold text-text-primary">
                Everything your team needs to plan, design, and deliver
                together.
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-sm leading-7 text-text-secondary">
                Whiteboard-style drawing, board organization, and instant
                sharing means teams move faster and stay aligned.
              </p>
              <p className="text-sm leading-7 text-text-secondary">
                Invite teammates, create shared spaces, and keep ideas flowing
                from concept to completion.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Link
                to="/signup"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo size={120} />

          <div className="flex gap-6">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <p className="text-sm text-text-secondary">© 2026 SyncBoard</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
