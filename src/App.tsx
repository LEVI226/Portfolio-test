import { useEffect, useState } from "react";
import SignalArtwork from "./components/SignalArtwork";
import { portfolio } from "./content/portfolio";
import {
  messages,
  readPreference,
  savePreference,
  type Locale,
} from "./content/i18n";
export default function App({
  initialLocale = "en",
}: {
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [clean, setClean] = useState(false);
  const t = messages[locale];
  const biography = portfolio.biography?.[locale];
  useEffect(() => {
    const stored = readPreference("signal-locale");
    if (stored === "en" || stored === "fr") setLocale(stored);
    setClean(readPreference("signal-clean") === "true");
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t.description);
  }, [locale, t]);
  function changeLocale(next: Locale) {
    setLocale(next);
    savePreference("signal-locale", next);
  }
  function changeMode() {
    setClean(!clean);
    savePreference("signal-clean", String(!clean));
  }
  return (
    <div className={clean ? "site clean-mode" : "site"}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header>
        <a className="wordmark" href="#intro">
          SIGNAL<span> / </span>OUAGA
          <span className="brand-dot" aria-hidden="true">
            ●
          </span>
        </a>
        <nav aria-label={t.navigation}>
          <a href="#work">
            {t.work} <sup aria-hidden="true">01</sup>
          </a>
          <a href="#about">
            {t.about} <sup aria-hidden="true">02</sup>
          </a>
          <a href="#contact">
            {t.contact} <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <div className="preferences">
          <div role="group" aria-label={t.language} className="languages">
            <button
              lang="en"
              aria-pressed={locale === "en"}
              onClick={() => changeLocale("en")}
            >
              EN
            </button>
            <span aria-hidden="true">/</span>
            <button
              lang="fr"
              aria-pressed={locale === "fr"}
              onClick={() => changeLocale("fr")}
            >
              FR
            </button>
          </div>
          <button
            className="mode-button"
            aria-pressed={clean}
            onClick={changeMode}
          >
            {t.clean}
            <span aria-hidden="true">{clean ? " ●" : " ○"}</span>
          </button>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <section id="intro" className="hero">
          <p className="eyebrow">{t.intro}</p>
          <h1>
            SIGNAL<span className="slash">/</span>
            <br />
            <span className="outline">OUAGA</span>
            <span className="title-dot">.</span>
          </h1>
          {!clean && <SignalArtwork copy={t} />}
          <p className="hero-name">{portfolio.name}</p>
          <div className="hero-footer">
            <a href="#work" className="explore">
              {t.explore}
              <span aria-hidden="true">↓</span>
            </a>
            <p className="hero-note">
              {t.personal}
              <br />
              {t.making}
            </p>
          </div>
        </section>
        <section id="work" className="section">
          <div className="section-heading">
            <p className="eyebrow">01 / {t.selected}</p>
            <span className="micro">{t.archive}</span>
          </div>
          <h2>
            {t.nextA}
            <br />
            {t.nextB}
          </h2>
          {portfolio.projects.length ? (
            portfolio.projects.map((project) => (
              <a
                className="empty-work project-link"
                key={project.url}
                href={project.url}
              >
                <span className="work-index" aria-hidden="true">
                  ↗
                </span>
                <div>
                  <h3>{project.title[locale]}</h3>
                  <p>{project.description[locale]}</p>
                </div>
              </a>
            ))
          ) : (
            <div className="empty-work">
              <span className="work-index" aria-hidden="true">
                —
              </span>
              <div>
                <h3>{t.workPending}</h3>
                <p>{t.workDescription}</p>
              </div>
              <span className="pending">{t.forthcoming}</span>
            </div>
          )}
        </section>
        <section id="about" className="section about">
          <p className="eyebrow">02 / {t.behind}</p>
          <div>
            <h2>
              Yannick Ulrich Levi
              <br />
              <span>OUEDRAOGO</span>
            </h2>
            <p className="body-copy">{biography ?? t.bioPending}</p>
            {!biography && <p className="micro">{t.bioStatus}</p>}
          </div>
        </section>
        <section id="contact" className="section contact">
          <p className="eyebrow">03 / {t.conversation}</p>
          <h2>
            {t.connectA}
            <br />
            {t.connectB}
            <span>.</span>
          </h2>
          {portfolio.email ? (
            <a className="contact-link" href={`mailto:${portfolio.email}`}>
              {portfolio.email} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <p className="body-copy">{t.contactPending}</p>
          )}
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#intro">
          SIGNAL / OUAGA
        </a>
        <p>{t.footer}</p>
        <a href="#intro">
          {t.top} <span aria-hidden="true">↑</span>
        </a>
      </footer>
      <article className="print-cv" aria-label={t.cv}>
        <p>{t.cv}</p>
        <h2>{portfolio.name}</h2>
        <p>{t.cvPending}</p>
        <section>
          <h3>{t.profile}</h3>
          <p>{biography ?? t.bioPending}</p>
        </section>
        <section>
          <h3>{t.selected}</h3>
          {portfolio.projects.length ? (
            portfolio.projects.map((p) => (
              <div key={p.url}>
                <strong>{p.title[locale]}</strong>
                <p>{p.description[locale]}</p>
                <p>{p.url}</p>
              </div>
            ))
          ) : (
            <p>{t.workPending}</p>
          )}
        </section>
        <section>
          <h3>{t.contact}</h3>
          <p>{portfolio.email ?? t.contactPending}</p>
        </section>
      </article>
    </div>
  );
}
