import { useEffect, useRef, useState } from "react";

const noop = () => {};

const icons = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),

  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 4 3 4M14 4l3 4M7 20l3-4M14 20l3-4M3 9h18M3 15h18" />
    </>
  ),

  tv: (
    <>
      <rect x="3" y="5" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 18v3M9 2l3 3 3-3" />
    </>
  ),

  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),

  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M16 2v5M8 2v5M3 9h18" />
    </>
  ),

  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),

  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
    </>
  ),

  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 20c.7-3.5 2.5-5.5 5.5-5.5s4.8 2 5.5 5.5M14 15c2.8-.2 4.7 1.4 5.5 4" />
    </>
  ),

  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.05.05-1.9 1.9-.05-.05a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.65V21h-2.7v-.8a1.8 1.8 0 0 0-1.1-1.65 1.8 1.8 0 0 0-2 .36l-.05.05-1.9-1.9.05-.05a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.65-1.1H5v-2.7h.8a1.8 1.8 0 0 0 1.65-1.1 1.8 1.8 0 0 0-.36-2l-.05-.05 1.9-1.9.05.05a1.8 1.8 0 0 0 2 .36 1.8 1.8 0 0 0 1.1-1.65V5h2.7v.8a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 2-.36l.05-.05 1.9 1.9-.05.05a1.8 1.8 0 0 0-.36 2 1.8 1.8 0 0 0 1.65 1.1h.8v2.7h-.8A1.8 1.8 0 0 0 19.4 15Z" />
    </>
  ),

  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.8 9a2.4 2.4 0 1 1 4.1 1.7c-.9.9-1.9 1.2-1.9 2.8M12 17h.01" />
    </>
  ),

  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" />
    </>
  ),

  star: (
    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
  ),

  plus: (
    <path d="M12 5v14M5 12h14" />
  ),

  check: (
    <path d="m5 12 4 4L19 6" />
  ),

  x: (
    <path d="m6 6 12 12M18 6 6 18" />
  ),

  arrowLeft: (
    <path d="M19 12H5M11 6l-6 6 6 6" />
  ),

  arrowRight: (
    <path d="M5 12h14M13 6l6 6-6 6" />
  ),

  chevronDown: (
    <path d="m6 9 6 6 6-6" />
  ),

  chevronRight: (
    <path d="m9 18 6-6-6-6" />
  ),

  play: (
    <path d="m9 6 10 6-10 6V6Z" />
  ),

  pause: (
    <path d="M9 6v12M15 6v12" />
  ),

  playCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4V8Z" />
    </>
  ),

  volume: (
    <>
      <path d="M4 10v4h3l4 3V7l-4 3H4Z" />
      <path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11" />
    </>
  ),

  volumeOff: (
    <>
      <path d="m4 10 4 4h3l4 3V7l-4 3H8L4 14" />
      <path d="m18 9 4 6M22 9l-4 6" />
    </>
  ),

  fullscreen: (
    <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" />
  ),

  fullscreenExit: (
    <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M21 15h-6v6" />
  ),

  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),

  moon: (
    <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />
  ),

  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z" />
    </>
  ),

  shield: (
    <path d="M12 3 20 6v6c0 5-3.3 8-8 9-4.7-1-8-4-8-9V6l8-3Z" />
  ),

  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" />
    </>
  ),

  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
    </>
  ),

  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14-4L4 9" />
      <path d="M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2" />
      <path d="M20 20v-5h-5" />
    </>
  ),

  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5" />
    </>
  ),

  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className = "",
}) {
  return (
    <svg
      className={`vortex-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.info}
    </svg>
  );
}

export function VortexBrand() {
  return (
    <div className="vortex-brand">
      <div className="vortex-brand-mark">V</div>

      <div className="vortex-brand-copy">
        <strong>VORTEX</strong>
        <span>EVORIAN / OMNIA</span>
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  icon,
  onClick = noop,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`vortex-button vortex-button-${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  );
}

export function BackButton({
  children = "Voltar",
  onClick = noop,
}) {
  return (
    <button
      type="button"
      className="vortex-back-button"
      onClick={onClick}
    >
      <Icon name="arrowLeft" size={18} />
      <span>{children}</span>
    </button>
  );
}

export function Sidebar({
  activePage,
  onNavigate,
  isOpen = false,
  onClose = noop,
}) {
  const primary = [
    ["home", "Início", "home"],
    ["movies", "Filmes", "film"],
    ["series", "Séries", "tv"],
    ["my-list", "Minha Lista", "list"],
    ["continue-watching", "Continuar", "clock"],
    ["releases", "Lançamentos", "calendar"],
    ["genres", "Gêneros", "grid"],
  ];

  const secondary = [
    ["profiles", "Perfis", "users"],
    ["account", "Minha Conta", "user"],
    ["settings", "Configurações", "settings"],
    ["help", "Ajuda", "help"],
  ];

  const renderItem = ([id, label, icon]) => (
    <button
      key={id}
      type="button"
      className={`vortex-nav-item ${
        activePage === id ? "active" : ""
      }`}
      onClick={() => {
        onNavigate(id);
        onClose();
      }}
    >
      <Icon name={icon} size={19} />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <div
        className={`vortex-sidebar-backdrop ${
          isOpen ? "is-open" : ""
        }`}
        onClick={onClose}
      />

      <aside className={`vortex-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="vortex-sidebar-top">
          <VortexBrand />

          <button
            type="button"
            className="vortex-sidebar-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <nav className="vortex-sidebar-nav">
          {primary.map(renderItem)}
        </nav>

        <div className="vortex-sidebar-divider" />

        <nav className="vortex-sidebar-nav vortex-sidebar-secondary">
          {secondary.map(renderItem)}
        </nav>

        <div className="vortex-sidebar-footer">
          <span>VORTEX</span>
          <small>by EVORIAN</small>
        </div>
      </aside>
    </>
  );
}

export function Topbar({
  searchQuery = "",
  onSearch = noop,
  onMenu = noop,
  onNavigate = noop,
}) {
  const [value, setValue] = useState(searchQuery);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  const submit = (event) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <header className="vortex-topbar">
      <button
        type="button"
        className="vortex-topbar-menu"
        onClick={onMenu}
        aria-label="Abrir menu"
      >
        <Icon name="grid" size={21} />
      </button>

      <form className="vortex-search" onSubmit={submit}>
        <Icon name="search" size={19} />

        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Pesquisar filmes, séries..."
          aria-label="Pesquisar"
        />
      </form>

      <div className="vortex-topbar-actions">
        <button
          type="button"
          className="vortex-topbar-icon"
          onClick={() => onNavigate("profiles")}
          aria-label="Perfis"
        >
          <Icon name="users" size={20} />
        </button>

        <button
          type="button"
          className="vortex-profile-button"
          onClick={() => onNavigate("account")}
          aria-label="Conta"
        >
          <span className="vortex-avatar">V</span>
          <span>Perfil</span>
        </button>
      </div>
    </header>
  );
}

export function MobileNavigation({
  activePage,
  onNavigate,
}) {
  const items = [
    ["home", "Início", "home"],
    ["movies", "Filmes", "film"],
    ["series", "Séries", "tv"],
    ["my-list", "Lista", "list"],
    ["account", "Conta", "user"],
  ];

  return (
    <nav className="vortex-mobile-navigation">
      {items.map(([id, label, icon]) => (
        <button
          key={id}
          type="button"
          className={activePage === id ? "active" : ""}
          onClick={() => onNavigate(id)}
        >
          <Icon name={icon} size={19} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function MediaImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`vortex-media-image-fallback ${className}`.trim()}
      >
        <Icon name="film" size={28} />
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}

export function MediaMeta({ media }) {
  const year =
    media?.year ||
    media?.releaseDate?.slice?.(0, 4) ||
    media?.release_date?.slice?.(0, 4) ||
    media?.first_air_date?.slice?.(0, 4);

  return (
    <div className="vortex-media-meta">
      {year && <span>{year}</span>}

      {media?.rating > 0 && (
        <span>
          <Icon name="star" size={13} />
          {Number(media.rating).toFixed(1)}
        </span>
      )}

      {media?.certification && (
        <span>{media.certification}</span>
      )}
    </div>
  );
}

export function MediaCard({
  media,
  onClick = noop,
  onPlay = noop,
  onToggleList = noop,
  isInMyList = false,
  progress,
}) {
  const mediaType =
    media?.mediaType ||
    media?.media_type ||
    "movie";

  const percentage = Math.max(
    0,
    Math.min(100, Number(progress) || 0)
  );

  return (
    <article className="vortex-media-card">
      <button
        type="button"
        className="vortex-media-poster"
        onClick={onClick}
        aria-label={`Abrir ${media?.title || "título"}`}
      >
        <MediaImage
          src={media?.poster}
          alt={media?.title}
        />

        <span className="vortex-card-type">
          {mediaType === "series" || mediaType === "tv"
            ? "SÉRIE"
            : "FILME"}
        </span>

        {percentage > 0 && (
          <span className="vortex-card-progress">
            <i style={{ width: `${percentage}%` }} />
          </span>
        )}

        <span
          className="vortex-card-play"
          onClick={(event) => {
            event.stopPropagation();
            onPlay();
          }}
        >
          <Icon name="play" size={18} />
        </span>
      </button>

      <div className="vortex-media-card-info">
        <div>
          <button
            type="button"
            className="vortex-media-card-title"
            onClick={onClick}
          >
            {media?.title || "Sem título"}
          </button>

          <MediaMeta media={media} />
        </div>

        <button
          type="button"
          className={`vortex-card-list ${
            isInMyList ? "active" : ""
          }`}
          onClick={onToggleList}
          aria-label={
            isInMyList
              ? "Remover da lista"
              : "Adicionar à lista"
          }
        >
          <Icon
            name={isInMyList ? "check" : "plus"}
            size={17}
          />
        </button>
      </div>
    </article>
  );
}

export function MediaRow({
  items = [],
  variant = "default",
  onOpenDetails = noop,
  onOpenPlayer = noop,
  onToggleMyList = noop,
  isInMyList = () => false,
  progressMap = {},
}) {
  return (
    <div
      className={`vortex-media-row ${
        variant === "continue"
          ? "vortex-media-row-continue"
          : ""
      }`}
    >
      {items.map((media) => (
        <MediaCard
          key={`${media?.mediaType || media?.media_type || "media"}-${media?.id}`}
          media={media}
          progress={
            media?.progress ??
            progressMap?.[media?.id]?.percentage ??
            0
          }
          onClick={() => onOpenDetails(media)}
          onPlay={() => onOpenPlayer(media)}
          onToggleList={() => onToggleMyList(media)}
          isInMyList={isInMyList(media)}
        />
      ))}
    </div>
  );
}

export function MediaHero({
  media,
  onPlay = noop,
  onDetails = noop,
  onToggleList = noop,
  isInMyList = false,
}) {
  return (
    <section className="vortex-hero">
      <MediaImage
        src={media?.backdrop || media?.poster}
        alt=""
        loading="eager"
        className="vortex-hero-background"
      />

      <div className="vortex-hero-overlay" />

      <div className="vortex-hero-content">
        <span className="vortex-hero-eyebrow">
          VORTEX ORIGINAL DISCOVERY
        </span>

        <h1>{media?.title || "VORTEX"}</h1>

        <MediaMeta media={media} />

        <p>
          {media?.overview ||
            "Explore um catálogo cinematográfico em constante expansão."}
        </p>

        <div className="vortex-hero-actions">
          <Button
            icon="play"
            onClick={() => onPlay(media)}
          >
            Assistir
          </Button>

          <Button
            icon="info"
            variant="secondary"
            onClick={() => onDetails(media)}
          >
            Detalhes
          </Button>

          <button
            type="button"
            className={`vortex-icon-button ${
              isInMyList ? "active" : ""
            }`}
            onClick={() => onToggleList(media)}
            aria-label="Minha lista"
          >
            <Icon
              name={isInMyList ? "check" : "plus"}
              size={20}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  onAction = noop,
}) {
  return (
    <div className="vortex-section-header">
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h2>{title}</h2>
      </div>

      {actionLabel && (
        <button
          type="button"
          className="vortex-see-all"
          onClick={onAction}
        >
          {actionLabel}
          <Icon name="arrowRight" size={16} />
        </button>
      )}
    </div>
  );
}

export function Section({
  children,
  eyebrow,
  title,
  actionLabel,
  onAction = noop,
  className = "",
}) {
  return (
    <section
      className={`vortex-section ${className}`.trim()}
    >
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        actionLabel={actionLabel}
        onAction={onAction}
      />

      {children}
    </section>
  );
}

export function DetailsHero({
  media,
  onBack = noop,
  onPlay = noop,
  onAddToList = noop,
  isInList = false,
}) {
  const mediaType =
    media?.mediaType ||
    media?.media_type ||
    "movie";

  return (
    <section className="vortex-details-hero">
      <MediaImage
        src={media?.backdrop || media?.poster}
        alt=""
        className="vortex-details-background"
      />

      <div className="vortex-details-overlay" />

      <div className="vortex-details-content">
        <BackButton onClick={onBack} />

        <div className="vortex-details-layout">
          <div className="vortex-details-poster">
            <MediaImage
              src={media?.poster}
              alt={media?.title}
            />
          </div>

          <div className="vortex-details-copy">
            <span className="vortex-hero-eyebrow">
              {mediaType === "series" || mediaType === "tv"
                ? "SÉRIE"
                : "FILME"}
            </span>

            <h1>{media?.title}</h1>

            <MediaMeta media={media} />

            {media?.genres?.length > 0 && (
              <div className="vortex-details-genres">
                {media.genres
                  .slice(0, 5)
                  .map((genre) => (
                    <span
                      key={
                        typeof genre === "object"
                          ? genre.id || genre.name
                          : genre
                      }
                    >
                      {typeof genre === "object"
                        ? genre.name
                        : genre}
                    </span>
                  ))}
              </div>
            )}

            <p className="vortex-details-description">
              {media?.overview}
            </p>

            <div className="vortex-details-actions">
              <Button
                icon="play"
                onClick={() => onPlay(media)}
              >
                Assistir
              </Button>

              <Button
                icon={isInList ? "check" : "plus"}
                variant="secondary"
                onClick={() => onAddToList(media)}
              >
                {isInList
                  ? "Na Minha Lista"
                  : "Minha Lista"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EmptyState({
  icon = "film",
  title = "Nada encontrado",
  description = "",
  actionLabel = "",
  onAction = noop,
}) {
  return (
    <div className="vortex-empty-state">
      <div className="vortex-empty-icon">
        <Icon name={icon} size={28} />
      </div>

      <h3>{title}</h3>

      {description && <p>{description}</p>}

      {actionLabel && (
        <Button
          variant="secondary"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function SkeletonRow({ count = 6 }) {
  return (
    <div className="vortex-media-grid vortex-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="vortex-skeleton-card"
          key={index}
        >
          <div className="vortex-skeleton-poster" />
          <div className="vortex-skeleton-line vortex-skeleton-line-lg" />
          <div className="vortex-skeleton-line vortex-skeleton-line-sm" />
        </div>
      ))}
    </div>
  );
}

export function SettingsItem({
  icon,
  title,
  description = "",
  value = "",
  onClick = noop,
  danger = false,
}) {
  return (
    <button
      type="button"
      className={`vortex-settings-item ${
        danger ? "danger" : ""
      }`}
      onClick={onClick}
    >
      <div className="vortex-settings-icon">
        <Icon name={icon} size={20} />
      </div>

      <div className="vortex-settings-copy">
        <strong>{title}</strong>

        {description && <span>{description}</span>}
      </div>

      {value && (
        <span className="vortex-settings-value">
          {value}
        </span>
      )}

      <Icon
        name="chevronRight"
        size={17}
        className="vortex-settings-chevron"
      />
    </button>
  );
}

function formatTime(value) {
  const seconds = Math.max(
    0,
    Math.floor(value || 0)
  );

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export function Player({
  media,
  initialProgress = null,
  onClose = noop,
  onSaveProgress = noop,
}) {
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(
    Number(initialProgress?.position) || 0
  );

  const [duration, setDuration] = useState(
    Number(initialProgress?.duration) || 0
  );

  const [volume, setVolume] = useState(1);

  const [muted, setMuted] = useState(false);

  const src =
    media?.video?.url ||
    media?.playback?.url ||
    media?.streaming_sources?.[0]?.url ||
    null;

  useEffect(() => {
    if (!videoRef.current || !src) return;

    videoRef.current.currentTime = currentTime;
  }, [src]);

  useEffect(() => {
    return () => {
      if (duration > 0) {
        onSaveProgress({
          position: currentTime,
          duration,
        });
      }
    };
  }, [
    currentTime,
    duration,
    onSaveProgress,
  ]);

  const toggle = async () => {
    if (!videoRef.current || !src) return;

    if (videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const seek = (delta) => {
    if (!videoRef.current) return;

    const max =
      duration > 0
        ? duration
        : Number.POSITIVE_INFINITY;

    videoRef.current.currentTime = Math.max(
      0,
      Math.min(
        max,
        videoRef.current.currentTime + delta
      )
    );
  };

  const handleMute = () => {
    const nextMuted = !muted;

    setMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  return (
    <div className="vortex-player">
      <div className="vortex-player-video-wrap">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={
              media?.backdrop ||
              media?.poster ||
              undefined
            }
            onLoadedMetadata={(event) => {
              const nextDuration =
                event.currentTarget.duration;

              setDuration(
                Number.isFinite(nextDuration)
                  ? nextDuration
                  : 0
              );
            }}
            onTimeUpdate={(event) => {
              setCurrentTime(
                event.currentTarget.currentTime
              );
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);

              onSaveProgress({
                position: duration,
                duration,
              });
            }}
          />
        ) : (
          <div className="vortex-player-unavailable">
            <div className="vortex-player-unavailable-icon">
              <Icon name="playCircle" size={48} />
            </div>

            <h2>
              Fonte de reprodução não configurada
            </h2>

            <p>
              O título está no catálogo, mas nenhuma
              fonte licenciada foi fornecida ao player.
            </p>
          </div>
        )}

        <div className="vortex-player-vignette" />

        <button
          type="button"
          className="vortex-player-back"
          onClick={onClose}
          aria-label="Voltar"
        >
          <Icon name="arrowLeft" size={22} />
        </button>

        <div className="vortex-player-controls">
          <div className="vortex-player-progress">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(
                currentTime,
                duration || currentTime
              )}
              onChange={(event) => {
                const value = Number(
                  event.target.value
                );

                if (videoRef.current) {
                  videoRef.current.currentTime =
                    value;
                }

                setCurrentTime(value);
              }}
              disabled={!src || !duration}
            />
          </div>

          <div className="vortex-player-control-row">
            <div className="vortex-player-control-left">
              <button
                type="button"
                className="vortex-player-control"
                onClick={toggle}
                disabled={!src}
                aria-label={
                  playing ? "Pausar" : "Reproduzir"
                }
              >
                <Icon
                  name={playing ? "pause" : "play"}
                  size={20}
                />
              </button>

              <button
                type="button"
                className="vortex-player-control"
                onClick={() => seek(-10)}
                disabled={!src}
                aria-label="Voltar 10 segundos"
              >
                −10
              </button>

              <button
                type="button"
                className="vortex-player-control"
                onClick={() => seek(10)}
                disabled={!src}
                aria-label="Avançar 10 segundos"
              >
                +10
              </button>

              <button
                type="button"
                className="vortex-player-control"
                onClick={handleMute}
                aria-label={
                  muted
                    ? "Ativar som"
                    : "Silenciar"
                }
              >
                <Icon
                  name={
                    muted
                      ? "volumeOff"
                      : "volume"
                  }
                  size={20}
                />
              </button>

              <input
                className="vortex-player-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={muted ? 0 : volume}
                onChange={(event) => {
                  const value = Number(
                    event.target.value
                  );

                  setVolume(value);
                  setMuted(value === 0);

                  if (videoRef.current) {
                    videoRef.current.volume =
                      value;
                    videoRef.current.muted =
                      value === 0;
                  }
                }}
                aria-label="Volume"
              />

              <span className="vortex-player-time">
                {formatTime(currentTime)} /{" "}
                {formatTime(duration)}
              </span>
            </div>

            <div className="vortex-player-control-right">
              <span className="vortex-player-title">
                {media?.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlayerSettings() {
  return null;
}

export function Toast({
  message,
  type = "default",
  onClose = noop,
}) {
  useEffect(() => {
    const timer = setTimeout(
      onClose,
      2600
    );

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`vortex-toast ${type}`}>
      <Icon
        name={
          type === "success"
            ? "check"
            : "info"
        }
        size={18}
      />

      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}