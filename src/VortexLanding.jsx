import { useState } from "react";

export default function VortexLanding({ onNavigate }) {
  const [googleMessage, setGoogleMessage] = useState(false);

  const goTo = (page) => {
    if (typeof onNavigate === "function") {
      onNavigate(page);
    }
  };

  const handleGoogle = () => {
    setGoogleMessage(true);

    window.setTimeout(() => {
      setGoogleMessage(false);
    }, 2800);
  };

  return (
    <main className="vortex-landing">
      <header className="vortex-landing-header">
        <button
          className="vortex-landing-logo"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="VORTEX"
        >
          VORTEX
        </button>

        <button
          className="vortex-landing-login"
          type="button"
          onClick={() => goTo("login")}
        >
          Entrar
        </button>
      </header>

      <section className="vortex-landing-content">
        <div className="vortex-landing-orbit" aria-hidden="true">
          <div className="vortex-landing-orbit-ring vortex-landing-orbit-ring-one" />
          <div className="vortex-landing-orbit-ring vortex-landing-orbit-ring-two" />

          <div className="vortex-landing-core">
            <span>V</span>
          </div>
        </div>

        <div className="vortex-landing-copy">
          <p className="vortex-landing-eyebrow">
            VORTEX BY EVORIAN
          </p>

          <h1>
            Seu próximo
            <span>universo começa aqui.</span>
          </h1>

          <p className="vortex-landing-description">
            Descubra filmes, séries e histórias que podem se tornar
            parte da sua próxima jornada.
          </p>
        </div>

        <div className="vortex-landing-actions">
          <button
            className="vortex-landing-primary"
            type="button"
            onClick={() => goTo("signup")}
          >
            <span>Criar minha conta</span>
            <span className="vortex-landing-arrow" aria-hidden="true">
              →
            </span>
          </button>

          <button
            className="vortex-landing-google"
            type="button"
            onClick={handleGoogle}
          >
            <span className="vortex-google-icon" aria-hidden="true">
              G
            </span>

            <span>Continuar com Google</span>
          </button>
        </div>

        <p className="vortex-landing-existing">
          Já possui uma conta?{" "}
          <button
            type="button"
            onClick={() => goTo("login")}
          >
            Entrar
          </button>
        </p>

        {googleMessage && (
          <div
            className="vortex-landing-google-message"
            role="status"
          >
            O login com Google será conectado na próxima etapa.
          </div>
        )}
      </section>

      <footer className="vortex-landing-footer">
        <span>Explore.</span>
        <span>Descubra.</span>
        <span>Assista.</span>
      </footer>
    </main>
  );
}