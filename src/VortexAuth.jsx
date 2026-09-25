import { useState } from "react";

export default function VortexAuth({ mode = "login", onNavigate }) {
  const [authMode, setAuthMode] = useState(
    mode === "signup" ? "signup" : "login"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = authMode === "signup";

  const switchMode = () => {
    setGoogleMessage("");
    setErrorMessage("");
    setSuccessMessage("");
    setShowPassword(false);

    setAuthMode((current) => (current === "login" ? "signup" : "login"));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setGoogleMessage("");
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") || "");

    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";

    const payload = isSignup
      ? {
          name,
          email,
          password,
        }
      : {
          email,
          password,
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Não foi possível concluir a autenticação."
        );
      }

      const sessionResponse = await fetch("/api/auth/me", {
  method: "GET",
  credentials: "include",
});

const sessionResult = await sessionResponse.json().catch(() => ({}));

if (
  !sessionResponse.ok ||
  !sessionResult.authenticated ||
  !sessionResult.user
) {
  throw new Error(
    "A autenticação foi concluída, mas a sessão não pôde ser confirmada."
  );
}

if (typeof onAuthSuccess === "function") {
  onAuthSuccess(sessionResult.user);
}

setSuccessMessage(
  isSignup
    ? "Conta criada com sucesso. Redirecionando..."
    : "Login realizado com sucesso. Redirecionando..."
);

if (typeof onNavigate === "function") {
  window.setTimeout(() => {
    onNavigate("home");
  }, 650);
}

    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setGoogleMessage(
      "O login com Google será conectado em uma próxima etapa."
    );
  };

  const handleForgotPassword = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setGoogleMessage(
      "A recuperação de senha será conectada em uma próxima etapa."
    );
  };

  const handleBack = () => {
    if (typeof onNavigate === "function") {
      onNavigate("landing");
    }
  };

  return (
    <main className="vortex-auth">
      <div className="vortex-auth-background">
        <div className="vortex-auth-orbit vortex-auth-orbit-one" />
        <div className="vortex-auth-orbit vortex-auth-orbit-two" />
        <div className="vortex-auth-glow vortex-auth-glow-one" />
        <div className="vortex-auth-glow vortex-auth-glow-two" />
      </div>

      <button
        type="button"
        className="vortex-auth-back"
        onClick={handleBack}
        aria-label="Voltar para a página inicial"
      >
        <span className="vortex-auth-back-icon">←</span>
        <span>Voltar</span>
      </button>

      <section className="vortex-auth-shell">
        <div className="vortex-auth-brand">
          <div className="vortex-auth-logo" aria-hidden="true">
            V
          </div>

          <div className="vortex-auth-brand-name">VORTEX</div>

          <div className="vortex-auth-brand-subtitle">by EVORIAN</div>
        </div>

        <div className="vortex-auth-card">
          <div className="vortex-auth-heading">
            <span className="vortex-auth-eyebrow">
              {isSignup ? "WELCOME TO VORTEX" : "WELCOME BACK"}
            </span>

            <h1>{isSignup ? "Crie sua conta." : "Entre no VORTEX."}</h1>

            <p>
              {isSignup
                ? "Crie seu perfil e comece a explorar."
                : "Continue sua jornada pelo universo do cinema."}
            </p>
          </div>

          <form className="vortex-auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="vortex-auth-field">
                <span>Nome</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                  disabled={isLoading}
                />
              </label>
            )}

            <label className="vortex-auth-field">
              <span>E-mail</span>

              <input
                type="email"
                name="email"
                placeholder="voce@email.com"
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </label>

            <label className="vortex-auth-field">
              <span>Senha</span>

              <div className="vortex-auth-password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Sua senha"
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  minLength={6}
                  required
                  disabled={isLoading}
                />

                <button
                  type="button"
                  className="vortex-auth-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                  disabled={isLoading}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>

            {!isSignup && (
              <div className="vortex-auth-options">
                <label className="vortex-auth-checkbox">
                  <input
                    type="checkbox"
                    name="remember"
                    disabled={isLoading}
                  />

                  <span>Lembrar de mim</span>
                </label>

                <button
                  type="button"
                  className="vortex-auth-link-button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            <button
              type="submit"
              className="vortex-auth-primary"
              disabled={isLoading}
            >
              <span>
                {isLoading
                  ? "Processando..."
                  : isSignup
                    ? "Criar conta"
                    : "Entrar"}
              </span>

              <span className="vortex-auth-primary-arrow">
                {isLoading ? "…" : "→"}
              </span>
            </button>

            {errorMessage && (
              <div className="vortex-auth-notice vortex-auth-notice-error">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="vortex-auth-notice vortex-auth-notice-success">
                {successMessage}
              </div>
            )}
          </form>

          <div className="vortex-auth-divider">
            <span />
            <small>OU</small>
            <span />
          </div>

          <button
            type="button"
            className="vortex-auth-google"
            onClick={handleGoogle}
            disabled={isLoading}
          >
            <span className="vortex-auth-google-icon">G</span>

            <span>Continuar com Google</span>
          </button>

          {googleMessage && (
            <div className="vortex-auth-notice">{googleMessage}</div>
          )}

          <div className="vortex-auth-switch">
            <span>
              {isSignup
                ? "Já possui uma conta?"
                : "Ainda não possui uma conta?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
              disabled={isLoading}
            >
              {isSignup ? "Entrar" : "Criar conta"}
            </button>
          </div>
        </div>

        <p className="vortex-auth-footer">
          Ao continuar, você concorda com os Termos de Uso e a Política de
          Privacidade do VORTEX.
        </p>
      </section>
    </main>
  );
}