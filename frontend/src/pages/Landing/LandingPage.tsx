import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Circle, Download, Eye, History, MousePointer2, Pencil, Plus, Share2, Square, Users, WandSparkles } from "lucide-react";
import heroImage from "../../assets/heroImage.png";
import Logo from "../dashboard/DashboardLayout/Sidebar/Logo";

const tools = [
  { name: "Select", icon: MousePointer2 },
  { name: "Pen", icon: Pencil },
  { name: "Rectangle", icon: Square },
  { name: "Circle", icon: Circle },
];

const LandingPage = () => {
  const [activeTool, setActiveTool] = useState("Pen");
  const [showNote, setShowNote] = useState(true);

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <a href="#home" aria-label="SyncBoard home"><Logo size={136} /></a>
        <nav className="landing-nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>
        <div className="landing-nav-actions">
          <Link to="/login" className="nav-login">Log in</Link>
          <Link to="/signup" className="button button-dark button-small">Start a board <ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <main id="home">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> A shared space for good ideas</div>
            <h1>Make space for<br /><span>better ideas.</span></h1>
            <p className="hero-description">SyncBoard is a live canvas for teams to think out loud. Sketch a plan, map a workflow, or bring a half-formed idea to life together.</p>
            <div className="hero-actions">
              <Link to="/signup" className="button button-dark">Create your first board <ArrowRight size={17} /></Link>
              <a className="button button-quiet" href="#features">See how it works <ArrowDown size={16} /></a>
            </div>
            <p className="cold-start-note"><span aria-hidden="true">i</span><strong>Free-tier hosting</strong> — the app may take up to a minute to start after an idle period.</p>
            <div className="hero-proof"><div className="avatar-stack" aria-label="Team members"><img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team member" /><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team member" /><img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Team member" /></div><span>One canvas. Your whole team.</span></div>
          </div>

          <div className="preview-wrap" aria-label="Interactive SyncBoard preview">
            <div className="preview-glow" />
            <div className="board-preview">
              <div className="board-topbar">
              <div className="board-title"><span className="board-mark"><WandSparkles size={14} /></span><span>Product launch</span><span className="board-private">Demo board</span></div>
                <div className="board-people"><span className="mini-avatar peach">M</span><span className="mini-avatar lilac">J</span><span className="mini-avatar mint">A</span><button aria-label="Share board" className="share-button"><Share2 size={14} /></button></div>
              </div>
              <div className="board-toolbar" aria-label="Choose a drawing tool">
                {tools.map(({ name, icon: Icon }) => <button key={name} title={name} aria-label={name} aria-pressed={activeTool === name} onClick={() => setActiveTool(name)} className={activeTool === name ? "tool-active" : ""}><Icon size={16} /></button>)}
                <span className="toolbar-divider" /><button aria-label="Add an item" onClick={() => setShowNote((visible) => !visible)}><Plus size={16} /></button>
              </div>
              <div className="board-canvas" onClick={() => setShowNote(true)}>
                <div className="canvas-grid" />
                <div className="board-label label-start">THE BIG IDEA <span>01</span></div>
                <div className="idea-card card-start"><span className="idea-icon idea-purple"><WandSparkles size={16} /></span><strong>Make it simple</strong><small>Start with the why</small></div>
                <svg className="connector connector-one" viewBox="0 0 170 84" fill="none" aria-hidden="true"><path d="M4 6C48 5 35 70 87 66c33-3 31-53 77-45" stroke="#b9aae8" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round" /></svg>
                <div className="idea-card card-middle"><span className="idea-icon idea-yellow"><Pencil size={16} /></span><strong>Build together</strong><small>Everyone adds a piece</small></div>
                <svg className="connector connector-two" viewBox="0 0 170 84" fill="none" aria-hidden="true"><path d="M4 74c48 1 35-64 87-60 33 3 31 53 77 45" stroke="#91c9b0" strokeWidth="2.5" strokeDasharray="5 6" strokeLinecap="round" /></svg>
                <div className="idea-card card-end"><span className="idea-icon idea-green"><Check size={16} /></span><strong>Ship with clarity</strong><small>Turn notes into action</small></div>
                {showNote && <div className="collab-note"><span className="note-avatar">J</span><span>Love this direction!</span><span className="note-cursor"><MousePointer2 size={13} /></span></div>}
                <div className="cursor-tag"><span /> Maya is here</div>
                <div className="active-tool-hint">{activeTool} tool selected</div>
              </div>
              <div className="board-status"><span><span className="live-dot" /> Interactive preview</span><span><Users size={14} /> Team workspace</span></div>
            </div>
            <div className="floating-pill"><span className="floating-spark">✳</span> Ideas move better together</div>
          </div>
        </section>

        <section id="features" className="features-section section-shell">
          <div className="section-heading"><div><span className="section-kicker">A canvas that keeps up</span><h2>From first thought<br />to shared momentum.</h2></div><p>Less tab-hopping, more making. SyncBoard keeps the conversation and the work in the same place.</p></div>
          <div className="feature-grid">
            <article className="feature-card feature-collab"><div className="feature-icon icon-lilac"><Users size={20} /></div><span className="feature-number">01 / TOGETHER</span><h3>Think in real time</h3><p>See teammates join the board, follow their cursors, and build on ideas while they’re still fresh.</p><div className="feature-visual people-visual"><span className="person-dot person-one">M</span><span className="person-dot person-two">J</span><span className="person-dot person-three">A</span><span className="people-line" /></div></article>
            <article className="feature-card feature-tools"><div className="feature-icon icon-peach"><Pencil size={20} /></div><span className="feature-number">02 / MAKE</span><h3>Get it out of your head</h3><p>Draw, add shapes, and arrange thoughts on a flexible board that feels natural to use.</p><div className="feature-visual tool-visual"><span><MousePointer2 size={17} /></span><span><Pencil size={17} /></span><span><Square size={17} /></span><span><Circle size={17} /></span><span><Plus size={17} /></span></div></article>
            <article className="feature-card feature-share"><div className="feature-icon icon-mint"><Share2 size={20} /></div><span className="feature-number">03 / ORGANIZE</span><h3>Give each project its space</h3><p>Create boards for different projects and keep your team’s work together in one workspace.</p><div className="feature-visual saved-visual"><div><span className="saved-check"><Check size={12} /></span><span>Planning board</span><ArrowUpRight size={14} /></div><div><span className="saved-check"><Check size={12} /></span><span>Workshop notes</span><ArrowUpRight size={14} /></div></div></article>
            <article className="feature-card"><div className="feature-icon icon-mint"><Eye size={20} /></div><span className="feature-number">04 / ACCESS</span><h3>Invite with confidence</h3><p>Share a view-only link or give collaborators the tools to edit. Board owners stay in control.</p><div className="feature-visual access-visual"><span><Eye size={14} /> Viewer <Check size={13} /></span><span><Pencil size={14} /> Editor <Check size={13} /></span></div></article>
            <article className="feature-card"><div className="feature-icon icon-lilac"><History size={20} /></div><span className="feature-number">05 / REVISIT</span><h3>Return to a clear moment</h3><p>Save board snapshots as your ideas evolve, then restore an earlier version when you need it.</p><div className="feature-visual snapshot-visual"><span className="snapshot-line" /><span className="snapshot-point point-one" /><span className="snapshot-point point-two" /><span className="snapshot-point point-three" /><span className="snapshot-caption">Captured along the way</span></div></article>
            <article className="feature-card"><div className="feature-icon icon-peach"><Download size={20} /></div><span className="feature-number">06 / TAKE IT WITH YOU</span><h3>Make the outcome portable</h3><p>Export the current canvas view as a crisp PNG to share with your team or add to a project update.</p><div className="feature-visual export-visual"><span className="export-file"><span className="export-file-icon"><Download size={15} /></span><span><strong>product-launch.png</strong><small>PNG · ready to share</small></span><Check size={15} /></span></div></article>
          </div>
        </section>

        <section id="about" className="about-section section-shell">
          <div className="about-image"><img src={heroImage} alt="A team sharing ideas on a collaborative board" /><div className="about-image-caption"><span className="live-dot" /> Made for the messy middle of making things</div></div>
          <div className="about-copy"><span className="section-kicker">A little about SyncBoard</span><h2>Good work starts with a place to think.</h2><p>SyncBoard brings the ease of a whiteboard to the way teams work online. It gives people one shared space to sketch, plan, and make sense of ideas as they happen.</p><p>Whether you’re mapping a project or running a quick brainstorm, everyone can contribute, see what’s changing, and leave with a clearer next step.</p><Link to="/signup" className="text-link">Make your first board <ArrowRight size={16} /></Link></div>
        </section>

        <section className="cta-section section-shell"><div className="cta-card"><div className="cta-decoration cta-decoration-one" /><div className="cta-decoration cta-decoration-two" /><span className="section-kicker">Your next idea starts here</span><h2>Bring the team.<br />We’ll bring the canvas.</h2><p>Create a board and see where the conversation goes.</p><Link to="/signup" className="button button-light">Start a free board <ArrowUpRight size={17} /></Link><span className="cta-spark">✳</span></div></section>
      </main>

      <footer className="landing-footer"><div className="footer-inner"><Logo size={130} /><span>Make room for ideas.</span><div className="footer-links"><a href="#features">Features</a><a href="#about">About</a><Link to="/login">Log in</Link></div><small>© 2026 SyncBoard</small></div></footer>
    </div>
  );
};

export default LandingPage;
