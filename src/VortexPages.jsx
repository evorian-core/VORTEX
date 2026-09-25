import { useMemo, useState } from "react";

import {

  Icon,

  Button,

  MediaCard,

  MediaRow,

  MediaHero,

  SectionHeader,

  EmptyState,

  DetailsHero,

  Player,

  SettingsItem,

  BackButton,

} from "./VortexComponents";





/* =========================================================

   SHARED

========================================================= */



export function PageContainer({ children, className = "" }) {

  return (

    <main className={`page-container ${className}`.trim()}>

      {children}

    </main>

  );

}



export function Section({ children, className = "" }) {

  return <section className={`vortex-section ${className}`.trim()}>{children}</section>;

}



export function MediaGrid({

  items = [],

  onOpenDetails,

  onOpenPlayer,

  onToggleMyList,

  isInMyList,

}) {

  if (!items.length) {

    return (

      <EmptyState

        icon="film"

        title="Nenhum título encontrado"

        description="Não encontramos títulos para esta seleção."

      />

    );

  }



  return (

    <div className="media-grid">

      {items.map((media) => (

        <MediaCard

          key={`${media.mediaType}-${media.id}`}

          media={media}

          onClick={() => onOpenDetails?.(media)}

          onPlay={() => onOpenPlayer?.(media)}

          onToggleList={() => onToggleMyList?.(media)}

          isInMyList={isInMyList?.(media)}

        />

      ))}

    </div>

  );

}



/* =========================================================

   HOME

========================================================= */



export function HomePage({

  movies = [],

  series = [],

  featured,

  continueWatching = [],

  recommendations = [],

  onNavigate,

  onOpenDetails,

  onOpenPlayer,

  onToggleMyList,

  isInMyList,

}) {

  const trendingMovies = movies.slice(0, 10);

  const popularSeries = series.slice(0, 10);



  const newReleases = [...movies, ...series]

    .filter((media) => media?.releaseDate)

    .sort(

      (a, b) =>

        new Date(b.releaseDate).getTime() -

        new Date(a.releaseDate).getTime()

    )

    .slice(0, 10);



  return (

    <PageContainer className="home-page">

      {featured && (

        <MediaHero

          media={featured}

          onPlay={() => onOpenPlayer?.(featured)}

          onDetails={() => onOpenDetails?.(featured)}

          onToggleList={() => onToggleMyList?.(featured)}

          isInMyList={isInMyList?.(featured)}

        />

      )}



      {continueWatching.length > 0 && (

        <Section>

          <SectionHeader

            eyebrow="CONTINUE"

            title="Continue assistindo"

            actionLabel="Ver tudo"

            onAction={() => onNavigate?.("continue-watching")}

          />



          <MediaRow

            items={continueWatching}

            variant="continue"

            onOpenDetails={onOpenDetails}

            onOpenPlayer={onOpenPlayer}

          />

        </Section>

      )}



      <Section>

        <SectionHeader

          eyebrow="TRENDING"

          title="Em alta agora"

          actionLabel="Ver filmes"

          onAction={() => onNavigate?.("movies")}

        />



        <MediaRow

          items={trendingMovies}

          onOpenDetails={onOpenDetails}

          onOpenPlayer={onOpenPlayer}

          onToggleMyList={onToggleMyList}

          isInMyList={isInMyList}

        />

      </Section>



      <Section>

        <SectionHeader

          eyebrow="SERIES"

          title="Séries populares"

          actionLabel="Ver séries"

          onAction={() => onNavigate?.("series")}

        />



        <MediaRow

          items={popularSeries}

          onOpenDetails={onOpenDetails}

          onOpenPlayer={onOpenPlayer}

          onToggleMyList={onToggleMyList}

          isInMyList={isInMyList}

        />

      </Section>



      {newReleases.length > 0 && (

        <Section>

          <SectionHeader

            eyebrow="NEW"

            title="Lançamentos"

            actionLabel="Explorar"

            onAction={() => onNavigate?.("movies")}

          />



          <MediaRow

            items={newReleases}

            onOpenDetails={onOpenDetails}

            onOpenPlayer={onOpenPlayer}

            onToggleMyList={onToggleMyList}

            isInMyList={isInMyList}

          />

        </Section>

      )}



      {recommendations.length > 0 && (

        <Section>

          <SectionHeader

            eyebrow="FOR YOU"

            title="Recomendados para você"

            actionLabel="Ver mais"

            onAction={() => onNavigate?.("my-list")}

          />



          <MediaRow

            items={recommendations}

            onOpenDetails={onOpenDetails}

            onOpenPlayer={onOpenPlayer}

            onToggleMyList={onToggleMyList}

            isInMyList={isInMyList}

          />

        </Section>

      )}



      <Section className="vortex-feature-strip">

        <div className="feature-strip">

          <div className="feature-strip-item">

            <Icon name="refresh" size={22} />

            <div>

              <strong>Catálogo preparado</strong>

              <span>Estrutura pronta para dados externos.</span>

            </div>

          </div>



          <div className="feature-strip-item">

            <Icon name="sparkles" size={22} />

            <div>

              <strong>Descoberta inteligente</strong>

              <span>Recomendações organizadas para você.</span>

            </div>

          </div>



          <div className="feature-strip-item">

            <Icon name="play" size={22} />

            <div>

              <strong>Experiência cinematográfica</strong>

              <span>Filmes e séries em uma interface única.</span>

            </div>

          </div>

        </div>

      </Section>

    </PageContainer>

  );

}



/* =========================================================

   MOVIES

========================================================= */



export function MoviesPage({

  movies = [],

  onOpenDetails,

  onOpenPlayer,

  onToggleMyList,

  isInMyList,

}) {

  const [sort, setSort] = useState("popular");



  const sortedMovies = useMemo(() => {

    const result = [...movies];



    if (sort === "rating") {

      return result.sort(

        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)

      );

    }



    if (sort === "recent") {

      return result.sort(

        (a, b) =>

          new Date(b.releaseDate || 0).getTime() -

          new Date(a.releaseDate || 0).getTime()

      );

    }



    return result.sort(

      (a, b) => Number(b.popularity || 0) - Number(a.popularity || 0)

    );

  }, [movies, sort]);



  return (

    <PageContainer>

      <div className="catalog-heading">

        <div>

          <span className="page-eyebrow">VORTEX / MOVIES</span>

          <h1>Filmes</h1>

          <p>Explore o catálogo de filmes disponível no VORTEX.</p>

        </div>



        <div className="catalog-filter">

          <button

            className={sort === "popular" ? "active" : ""}

            onClick={() => setSort("popular")}

          >

            Popular

          </button>



          <button

            className={sort === "rating" ? "active" : ""}

            onClick={() => setSort("rating")}

          >

            Avaliação

          </button>



          <button

            className={sort === "recent" ? "active" : ""}

            onClick={() => setSort("recent")}

          >

            Recentes

          </button>

        </div>

      </div>



      <MediaGrid

        items={sortedMovies}

        onOpenDetails={onOpenDetails}

        onOpenPlayer={onOpenPlayer}

        onToggleMyList={onToggleMyList}

        isInMyList={isInMyList}

      />

    </PageContainer>

  );

}



/* =========================================================

   SERIES

========================================================= */



export function SeriesPage({

  series = [],

  onOpenDetails,

  onOpenPlayer,

  onToggleMyList,

  isInMyList,

}) {

  const [sort, setSort] = useState("popular");



  const sortedSeries = useMemo(() => {

    const result = [...series];



    if (sort === "rating") {

      return result.sort(

        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)

      );

    }



    if (sort === "recent") {

      return result.sort(

        (a, b) =>

          new Date(b.releaseDate || 0).getTime() -

          new Date(a.releaseDate || 0).getTime()

      );

    }



    return result.sort(

      (a, b) => Number(b.popularity || 0) - Number(a.popularity || 0)

    );

  }, [series, sort]);



  return (

    <PageContainer>

      <div className="catalog-heading">

        <div>

          <span className="page-eyebrow">VORTEX / SERIES</span>

          <h1>Séries</h1>

          <p>Explore séries e produções episódicas do catálogo.</p>

        </div>



        <div className="catalog-filter">

          <button

            className={sort === "popular" ? "active" : ""}

            onClick={() => setSort("popular")}

          >

            Popular

          </button>



          <button

            className={sort === "rating" ? "active" : ""}

            onClick={() => setSort("rating")}

          >

            Avaliação

          </button>



          <button

            className={sort === "recent" ? "active" : ""}

            onClick={() => setSort("recent")}

          >

            Recentes

          </button>

        </div>

      </div>



      <MediaGrid

        items={sortedSeries}

        onOpenDetails={onOpenDetails}

        onOpenPlayer={onOpenPlayer}

        onToggleMyList={onToggleMyList}

        isInMyList={isInMyList}

      />

    </PageContainer>

  );

}



/* =========================================================

   SEARCH

========================================================= */



export function SearchPage({

  catalog = [],

  onSearch,

  onOpenDetails,

  onOpenPlayer,

  onToggleMyList,

  isInMyList,

}) {

  const [query, setQuery] = useState("");

  const [submittedQuery, setSubmittedQuery] = useState("");



  const filteredCatalog = useMemo(() => {

    const normalized = submittedQuery.trim().toLowerCase();



    if (!normalized) return catalog;



    return catalog.filter((media) => {

      const title = String(media.title || "").toLowerCase();

      const originalTitle = String(media.originalTitle || "").toLowerCase();

      const overview = String(media.overview || "").toLowerCase();

      const genres = Array.isArray(media.genres)

        ? media.genres.join(" ").toLowerCase()

        : "";



      return (

        title.includes(normalized) ||

        originalTitle.includes(normalized) ||

        overview.includes(normalized) ||

        genres.includes(normalized)

      );

    });

  }, [catalog, submittedQuery]);



  const movies = filteredCatalog.filter(

    (media) => media.mediaType === "movie"

  );



  const series = filteredCatalog.filter(

    (media) => media.mediaType === "series"

  );



  function handleSubmit(event) {

    event.preventDefault();



    const value = query.trim();

    setSubmittedQuery(value);



    onSearch?.(value);

  }



  return (

    <PageContainer className="search-page">

      <div className="search-header">

        <span className="page-eyebrow">VORTEX SEARCH</span>

        <h1>Pesquisar</h1>

        <p>Encontre filmes, séries e outros títulos do catálogo.</p>



        <form className="large-search" onSubmit={handleSubmit}>

          <Icon name="search" size={22} />



          <input

            value={query}

            onChange={(event) => setQuery(event.target.value)}

            placeholder="Buscar filmes, séries, atores, diretores..."

            aria-label="Buscar no VORTEX"

          />



          <Button type="submit">Buscar</Button>

        </form>

      </div>



      {submittedQuery && (

        <div className="search-results-summary">

          <span>

            Resultados para <strong>“{submittedQuery}”</strong>

          </span>



          <span>{filteredCatalog.length} títulos</span>

        </div>

      )}



      {movies.length > 0 && (

        <Section>

          <SectionHeader eyebrow="RESULTADOS" title="Filmes" />



          <MediaGrid

            items={movies}

            onOpenDetails={onOpenDetails}

            onOpenPlayer={onOpenPlayer}

            onToggleMyList={onToggleMyList}

            isInMyList={isInMyList}

          />

        </Section>

      )}



      {series.length > 0 && (

        <Section>

          <SectionHeader eyebrow="RESULTADOS" title="Séries" />



          <MediaGrid

            items={series}

            onOpenDetails={onOpenDetails}

            onOpenPlayer={onOpenPlayer}

            onToggleMyList={onToggleMyList}

            isInMyList={isInMyList}

          />

        </Section>

      )}



      {submittedQuery && filteredCatalog.length === 0 && (

        <EmptyState

          icon="search"

          title="Nenhum resultado"

          description={`Não encontramos títulos correspondentes a “${submittedQuery}”.`}

        />

      )}

    </PageContainer>

  );

}



/* =========================================================

   CONTINUE WATCHING

========================================================= */



export function ContinueWatchingPage({

  items = [],

  onOpenDetails,

  onOpenPlayer,

}) {

  return (

    <PageContainer>

      <div className="catalog-heading">

        <div>

          <span className="page-eyebrow">YOUR VORTEX</span>

          <h1>Continue assistindo</h1>

          <p>Retome os títulos que você ainda não terminou.</p>

        </div>

      </div>



      {items.length > 0 ? (

        <MediaGrid

          items={items}

          onOpenDetails={onOpenDetails}

          onOpenPlayer={onOpenPlayer}

        />

      ) : (

        <EmptyState

          icon="play"

          title="Nada para continuar"

          description="Quando você começar a assistir algum título, ele aparecerá aqui."

        />

      )}

    </PageContainer>

  );

}



/* =========================================================

   MY LIST

========================================================= */



export function MyListPage({

  myList = [],

  onOpenDetails,

  onOpenPlayer,

  onToggleMyList,

  isInMyList,

}) {

  const movies = myList.filter(

    (media) => media.mediaType === "movie"

  );



  const series = myList.filter(

    (media) => media.mediaType === "series"

  );



  return (

    <PageContainer>

      <div className="catalog-heading">

        <div>

          <span className="page-eyebrow">YOUR VORTEX</span>

          <h1>Minha Lista</h1>

          <p>Seus títulos salvos para assistir depois.</p>

        </div>

      </div>



      {myList.length === 0 && (

        <EmptyState

          icon="bookmark"

          title="Sua lista está vazia"

          description="Adicione filmes e séries para encontrá-los rapidamente depois."

        />

      )}



      {movies.length > 0 && (

        <Section>

          <SectionHeader eyebrow="SAVED" title="Filmes" />



          <MediaGrid

            items={movies}

            onOpenDetails={onOpenDetails}

            onOpenPlayer={onOpenPlayer}

            onToggleMyList={onToggleMyList}

            isInMyList={isInMyList}

          />

        </Section>

      )}



      {series.length > 0 && (

        <Section>

          <SectionHeader eyebrow="SAVED" title="Séries" />



          <MediaGrid

            items={series}

            onOpenDetails={onOpenDetails}

            onOpenPlayer={onOpenPlayer}

            onToggleMyList={onToggleMyList}

            isInMyList={isInMyList}

          />

        </Section>

      )}

    </PageContainer>

  );

}



/* =========================================================

   DETAILS

========================================================= */



export function DetailsPage({

  selectedMedia,

  onNavigate,

  onOpenPlayer,

  onToggleMyList,

  isInMyList,

  recommendations = [],

  onOpenDetails,

}) {

  if (!selectedMedia) {

    return (

      <PageContainer>

        <EmptyState

          icon="film"

          title="Título não encontrado"

          description="Não foi possível carregar as informações deste título."

          actionLabel="Voltar ao início"

          onAction={() => onNavigate?.("home")}

        />

      </PageContainer>

    );

  }



  const related = recommendations

    .filter(

      (media) =>

        `${media.mediaType}-${media.id}` !==

        `${selectedMedia.mediaType}-${selectedMedia.id}`

    )

    .slice(0, 6);



  const cast = Array.isArray(selectedMedia.cast)

    ? selectedMedia.cast

    : [];



  const crew = Array.isArray(selectedMedia.crew)

    ? selectedMedia.crew

    : [];



  return (

    <PageContainer className="details-page">

      <BackButton onClick={() => onNavigate?.("home")} />



      <DetailsHero

        media={selectedMedia}

        onPlay={() => onOpenPlayer?.(selectedMedia)}

        onToggleList={() => onToggleMyList?.(selectedMedia)}

        isInMyList={isInMyList?.(selectedMedia)}

      />



      <Section className="details-overview">

        <SectionHeader eyebrow="OVERVIEW" title="Sinopse" />



        <p className="details-description">

          {selectedMedia.overview ||

            "Nenhuma sinopse disponível para este título."}

        </p>



        <div className="details-information-grid">

          <div className="information-item">

            <span>Título original</span>

            <strong>

              {selectedMedia.originalTitle || selectedMedia.title || "—"}

            </strong>

          </div>



          <div className="information-item">

            <span>Tipo</span>

            <strong>

              {selectedMedia.mediaType === "series"

                ? "Série"

                : "Filme"}

            </strong>

          </div>



          <div className="information-item">

            <span>Idioma original</span>

            <strong>

              {selectedMedia.originalLanguage || "—"}

            </strong>

          </div>



          <div className="information-item">

            <span>Popularidade</span>

            <strong>

              {selectedMedia.popularity != null

                ? Number(selectedMedia.popularity).toFixed(1)

                : "—"}

            </strong>

          </div>

        </div>

      </Section>



      {cast.length > 0 && (

        <Section>

          <SectionHeader eyebrow="CAST" title="Elenco" />



          <div className="people-grid">

            {cast.map((person, index) => (

              <div

                className="person-card"

                key={`${person.id || person.name}-${index}`}

              >

                {person.profile ? (

                  <img

                    src={person.profile}

                    alt={person.name || "Pessoa"}

                    loading="lazy"

                  />

                ) : (

                  <div className="person-placeholder">

                    <Icon name="user" size={24} />

                  </div>

                )}



                <div>

                  <strong>{person.name || "Desconhecido"}</strong>

                  {person.character && (

                    <span>{person.character}</span>

                  )}

                </div>

              </div>

            ))}

          </div>

        </Section>

      )}



      {crew.length > 0 && (

        <Section>

          <SectionHeader eyebrow="CREW" title="Equipe" />



          <div className="credits-list">

            {crew.map((person, index) => (

              <div

                className="credit-item"

                key={`${person.id || person.name}-${index}`}

              >

                <strong>{person.name || "Desconhecido"}</strong>

                <span>{person.job || person.department || "Equipe"}</span>

              </div>

            ))}

          </div>

        </Section>

      )}



      {related.length > 0 && (

        <Section>

          <SectionHeader eyebrow="YOU MAY ALSO LIKE" title="Relacionados" />



          <MediaRow

            items={related}

            onOpenDetails={onOpenDetails}

            onOpenPlayer={onOpenPlayer}

            onToggleMyList={onToggleMyList}

            isInMyList={isInMyList}

          />

        </Section>

      )}

    </PageContainer>

  );

}



/* =========================================================

   PLAYER

========================================================= */



export function PlayerPage({

  playerMedia,

  watchProgress = {},

  onClosePlayer,

  onSaveProgress,

  onShowToast,

}) {

  if (!playerMedia) {

    return (

      <PageContainer>

        <EmptyState

          icon="play"

          title="Nenhum título selecionado"

          description="Selecione um filme ou série para iniciar a reprodução."

          actionLabel="Voltar"

          onAction={onClosePlayer}

        />

      </PageContainer>

    );

  }



  const progressKey = `${playerMedia.mediaType}-${playerMedia.id}`;



  const initialProgress =

    watchProgress?.[progressKey] ??

    watchProgress?.[playerMedia.id] ??

    0;



  return (

    <div className="player-page">

      <Player

        media={playerMedia}

        initialProgress={initialProgress}

        onClose={onClosePlayer}

        onSaveProgress={(progress) =>

          onSaveProgress?.({

            mediaId: playerMedia.id,

            mediaType: playerMedia.mediaType,

            position: progress.position,

            duration: progress.duration,

          })

        }

        onShowToast={onShowToast}

      />

    </div>

  );

}



/* =========================================================

   ACCOUNT

========================================================= */



const PROFILE_STORAGE_KEY = "vortex_active_profile";



const PROFILE_AVATARS = [

  { id: "fox", label: "Raposa", emoji: "🦊" },

  { id: "panda", label: "Panda", emoji: "🐼" },

  { id: "tiger", label: "Tigre", emoji: "🐯" },

  { id: "frog", label: "Sapo", emoji: "🐸" },

  { id: "koala", label: "Coala", emoji: "🐨" },

  { id: "wolf", label: "Lobo", emoji: "🐺" },

  { id: "cat", label: "Gato", emoji: "🐱" },

  { id: "owl", label: "Coruja", emoji: "🦉" },

];



function getStoredProfile() {

  if (typeof window === "undefined") {

    return { name: "Willian", avatar: "fox" };

  }



  try {

    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!stored) {

      return { name: "Willian", avatar: "fox" };

    }



    const parsed = JSON.parse(stored);

    const name =

      typeof parsed?.name === "string" && parsed.name.trim()

        ? parsed.name.trim()

        : "Willian";

    const avatar = PROFILE_AVATARS.some((item) => item.id === parsed?.avatar)

      ? parsed.avatar

      : "fox";



    return { name, avatar };

  } catch {

    return { name: "Willian", avatar: "fox" };

  }

}



function saveStoredProfile(profile) {

  if (typeof window === "undefined") return;



  try {

    window.localStorage.setItem(

      PROFILE_STORAGE_KEY,

      JSON.stringify({

        name: profile.name.trim() || "Willian",

        avatar: profile.avatar,

      })

    );

  } catch {

    // Local storage may be unavailable in private or restricted contexts.

  }

}



function getProfileAvatar(avatarId) {

  return (

    PROFILE_AVATARS.find((item) => item.id === avatarId) || PROFILE_AVATARS[0]

  );

}



/* =========================================================

   ACCOUNT

========================================================= */



export function AccountPage({

  onNavigate,

  myList = [],

  watchHistory = [],

}) {

  const [profile, setProfile] = useState(getStoredProfile);

  const [loggingOut, setLoggingOut] = useState(false);



  const avatar = getProfileAvatar(profile.avatar);



  const handleLogout = async () => {

    if (loggingOut) return;



    setLoggingOut(true);



    try {

      await fetch("/api/auth/logout", {

        method: "POST",

        credentials: "include",

      });

    } catch (error) {

      console.error("VORTEX logout error:", error);

    } finally {

      // Reload the app so App.jsx re-checks /api/auth/me and clears auth state.

      window.location.replace("/login");

    }

  };



  return (

    <PageContainer className="account-page">

      <div className="account-header">

        <div className="account-avatar" aria-label={`Avatar de ${profile.name}`}>

          {avatar.emoji}

        </div>



        <div>

          <span className="page-eyebrow">MY VORTEX</span>

          <h1>{profile.name}</h1>

          <p>Perfil Premium</p>

        </div>

      </div>



      <div className="account-stats">

        <div>

          <strong>{watchHistory.length}</strong>

          <span>Assistidos</span>

        </div>



        <div>

          <strong>{myList.length}</strong>

          <span>Na lista</span>

        </div>



        <div>

          <strong>1</strong>

          <span>Perfil ativo</span>

        </div>

      </div>



      <Section>

        <SectionHeader eyebrow="ACCOUNT" title="Conta" />



        <div className="settings-list">

          <SettingsItem

            icon="user"

            title="Perfil"

            description="Renomeie seu perfil e escolha seu personagem."

            onClick={() => onNavigate?.("account-profile")}

          />



          <SettingsItem

            icon="settings"

            title="Configurações"

            description="Personalize sua experiência no VORTEX."

            onClick={() => onNavigate?.("settings")}

          />



          <SettingsItem

            icon="shield"

            title="Privacidade"

            description="Controle informações e preferências de privacidade."

            onClick={() => onNavigate?.("privacy")}

          />



          <SettingsItem

            icon="lock"

            title={loggingOut ? "Saindo..." : "Sair"}

            description="Encerrar sua sessão no VORTEX."

            danger

            onClick={handleLogout}

          />

        </div>

      </Section>

    </PageContainer>

  );

}



/* =========================================================

   SETTINGS

========================================================= */

/* =========================================================

   SETTINGS

========================================================= */



export function SettingsPage({ onNavigate }) {

  return (

    <PageContainer>

      <div className="settings-header">

        <span className="page-eyebrow">VORTEX / SETTINGS</span>

        <h1>Configurações</h1>

        <p>Personalize e conheça a estrutura do VORTEX.</p>

      </div>



      <div className="settings-list">

        <SettingsItem

          icon="sun"

          title="Aparência"

          description="Escolha como o VORTEX deve aparecer."

          onClick={() => onNavigate?.("appearance")}

        />



        <SettingsItem

          icon="globe"

          title="Idioma"

          description="Defina o idioma da interface."

          onClick={() => onNavigate?.("language")}

        />



        <SettingsItem

          icon="database"

          title="Dados do Catálogo"

          description="Origem, sincronização e funcionamento dos dados."

          onClick={() => onNavigate?.("catalog-data")}

        />



        <SettingsItem

          icon="file"

          title="Documentos"

          description="Documentação, atribuições e políticas do catálogo."

          onClick={() => onNavigate?.("documents")}

        />



        <SettingsItem

          icon="shield"

          title="Política de Privacidade"

          description="Veja como os dados são tratados."

          onClick={() => onNavigate?.("privacy")}

        />



        <SettingsItem

          icon="file-text"

          title="Termos de Uso"

          description="Condições de utilização do VORTEX."

          onClick={() => onNavigate?.("terms")}

        />



        <SettingsItem

          icon="info"

          title="Sobre o VORTEX"

          description="Informações sobre o produto e o ecossistema EVORIAN."

          onClick={() => onNavigate?.("about")}

        />

      </div>

    </PageContainer>

  );

}



/* =========================================================

   APPEARANCE

========================================================= */



export function AppearancePage({

  appearance = "dark",

  onAppearanceChange,

  onNavigate,

}) {

  const options = [

    {

      id: "dark",

      title: "Escuro",

      description: "Interface cinematográfica em tons escuros.",

    },

    {

      id: "light",

      title: "Claro",

      description: "Interface clara para ambientes iluminados.",

    },

  ];



  return (

    <PageContainer>

      <BackButton onClick={() => onNavigate?.("settings")} />



      <div className="settings-header">

        <span className="page-eyebrow">SETTINGS / APPEARANCE</span>

        <h1>Aparência</h1>

        <p>Escolha a aparência da interface do VORTEX.</p>

      </div>



      <div className="settings-choice-grid">

        {options.map((option) => (

          <button

            key={option.id}

            className={`settings-choice ${

              appearance === option.id ? "selected" : ""

            }`}

            onClick={() => onAppearanceChange?.(option.id)}

          >

            <div className="settings-choice-preview">

              <div className={`preview-${option.id}`}>

                <span />

                <span />

                <span />

              </div>

            </div>



            <div className="settings-choice-copy">

              <strong>{option.title}</strong>

              <span>{option.description}</span>

            </div>



            {appearance === option.id && (

              <Icon name="check" size={18} />

            )}

          </button>

        ))}

      </div>

    </PageContainer>

  );

}



/* =========================================================

   LANGUAGE

========================================================= */



export function LanguagePage({

  language = "pt-BR",

  onLanguageChange,

  onNavigate,

}) {

  const languages = [

    {

      id: "pt-BR",

      title: "Português (Brasil)",

      short: "Português-BR",

    },

    {

      id: "en-US",

      title: "English (United States)",

      short: "English-US",

    },

    {

      id: "es-ES",

      title: "Español",

      short: "Español-ES",

    },

  ];



  return (

    <PageContainer>

      <BackButton onClick={() => onNavigate?.("settings")} />



      <div className="settings-header">

        <span className="page-eyebrow">SETTINGS / LANGUAGE</span>

        <h1>Idioma</h1>

        <p>Escolha o idioma da interface do VORTEX.</p>

      </div>



      <div className="settings-list">

        {languages.map((item) => (

          <button

            className={`language-item ${

              language === item.id ? "active" : ""

            }`}

            key={item.id}

            onClick={() => onLanguageChange?.(item.id)}

          >

            <div>

              <strong>{item.title}</strong>

              <span>{item.short}</span>

            </div>



            {language === item.id && (

              <Icon name="check" size={20} />

            )}

          </button>

        ))}

      </div>

    </PageContainer>

  );

}



/* =========================================================

   PRIVACY

========================================================= */



export function PrivacyPage({ onNavigate }) {

  return (

    <PageContainer className="document-page">

      <BackButton onClick={() => onNavigate?.("settings")} />



      <div className="document-header">

        <span className="page-eyebrow">VORTEX / LEGAL</span>

        <h1>Política de Privacidade</h1>

        <p>Informações sobre privacidade e tratamento de dados.</p>

      </div>



      <article className="document-content">

        <section>

          <h2>1. Visão geral</h2>

          <p>

            O VORTEX é uma plataforma de descoberta e organização de

            entretenimento desenvolvida pela EVORIAN / OMNIA.

          </p>

        </section>



        <section>

          <h2>2. Dados utilizados</h2>

          <p>

            Dependendo das funcionalidades utilizadas, o sistema poderá

            trabalhar com informações de conta, preferências, lista pessoal,

            progresso de reprodução e dados necessários para funcionamento

            da plataforma.

          </p>

        </section>



        <section>

          <h2>3. Dados de catálogo</h2>

          <p>

            Informações de filmes e séries podem ser obtidas por serviços

            externos de catálogo. A fonte utilizada na arquitetura atual é

            o TMDB.

          </p>

        </section>



        <section>

          <h2>4. Serviços externos</h2>

          <p>

            Quando integrações externas estiverem habilitadas, o VORTEX

            poderá enviar somente os dados necessários para que essas

            integrações funcionem.

          </p>

        </section>



        <section>

          <h2>5. Segurança</h2>

          <p>

            Credenciais e chaves de serviços externos devem permanecer no

            backend. O frontend não deve expor chaves privadas de APIs.

          </p>

        </section>



        <section>

          <h2>6. Atualizações</h2>

          <p>

            Este documento poderá ser atualizado conforme a arquitetura e

            as funcionalidades do VORTEX evoluírem.

          </p>

        </section>

      </article>

    </PageContainer>

  );

}



/* =========================================================

   CATALOG DATA

========================================================= */



export function CatalogDataPage({ onNavigate }) {

  return (

    <PageContainer className="document-page">

      <BackButton onClick={() => onNavigate?.("settings")} />



      <div className="document-header">

        <span className="page-eyebrow">VORTEX / DATA</span>

        <h1>Dados do Catálogo</h1>

        <p>

          Como o VORTEX estrutura, recebe e organiza informações de

          filmes e séries.

        </p>

      </div>



      <div className="data-status-grid">

        <div className="data-status-card">

          <div className="data-status-icon">

            <Icon name="database" size={22} />

          </div>



          <div>

            <span>Fonte de catálogo</span>

            <strong>TMDB</strong>

          </div>



          <span className="status-badge ready">Preparado</span>

        </div>



        <div className="data-status-card">

          <div className="data-status-icon">

            <Icon name="refresh" size={22} />

          </div>



          <div>

            <span>Sincronização</span>

            <strong>Backend VORTEX</strong>

          </div>



          <span className="status-badge planned">Planejado</span>

        </div>



        <div className="data-status-card">

          <div className="data-status-icon">

            <Icon name="database" size={22} />

          </div>



          <div>

            <span>Cache</span>

            <strong>Arquitetura preparada</strong>

          </div>



          <span className="status-badge planned">Planejado</span>

        </div>

      </div>



      <article className="document-content">

        <section>

          <h2>Estrutura preparada</h2>

          <p>

            O VORTEX separa os dados de catálogo da interface. Isso permite

            que filmes e séries recebidos posteriormente sejam normalizados

            antes de chegar aos componentes visuais.

          </p>

        </section>



        <section>

          <h2>Fonte externa</h2>

          <p>

            O TMDB será utilizado como fonte de informações de catálogo.

            A chave da API deve permanecer exclusivamente no backend.

          </p>

        </section>



        <section>

          <h2>Documentos</h2>

          <p>

            Informações sobre origem, atribuições, políticas e integração

            devem permanecer disponíveis na seção Documentos.

          </p>

        </section>

      </article>

    </PageContainer>

  );

}



/* =========================================================

   DOCUMENTS

========================================================= */



export function DocumentsPage({ onNavigate }) {

  const documents = [

    {

      icon: "database",

      title: "TMDB",

      description:

        "Informações sobre a fonte externa de dados utilizada para o catálogo.",

    },

    {

      icon: "file",

      title: "Créditos e atribuições",

      description:

        "Informações sobre serviços, fontes e tecnologias utilizadas.",

    },

    {

      icon: "shield",

      title: "Política do catálogo",

      description:

        "Diretrizes para utilização e organização dos dados de entretenimento.",

    },

  ];



  return (

    <PageContainer>

      <BackButton onClick={() => onNavigate?.("settings")} />



      <div className="settings-header">

        <span className="page-eyebrow">VORTEX / DOCUMENTS</span>

        <h1>Documentos</h1>

        <p>Documentação pública relacionada ao VORTEX.</p>

      </div>



      <div className="document-cards">

        {documents.map((document) => (

          <div className="document-card" key={document.title}>

            <div className="document-card-icon">

              <Icon name={document.icon} size={22} />

            </div>



            <div>

              <h3>{document.title}</h3>

              <p>{document.description}</p>

            </div>



            <Icon name="arrow-right" size={18} />

          </div>

        ))}

      </div>

    </PageContainer>

  );

}



/* =========================================================

   TERMS

========================================================= */



export function TermsPage({ onNavigate }) {

  return (

    <PageContainer className="document-page">

      <BackButton onClick={() => onNavigate?.("settings")} />



      <div className="document-header">

        <span className="page-eyebrow">VORTEX / LEGAL</span>

        <h1>Termos de Uso</h1>

        <p>Condições gerais para utilização do VORTEX.</p>

      </div>



      <article className="document-content">

        <section>

          <h2>1. Utilização</h2>

          <p>

            O VORTEX foi desenvolvido para descoberta, organização e

            apresentação de informações sobre entretenimento.

          </p>

        </section>



        <section>

          <h2>2. Conteúdo de terceiros</h2>

          <p>

            Informações provenientes de serviços externos permanecem sujeitas

            às respectivas condições e direitos de seus fornecedores.

          </p>

        </section>



        <section>

          <h2>3. Reprodução</h2>

          <p>

            O VORTEX somente deverá reproduzir conteúdo quando existir uma

            fonte autorizada e integrada para essa finalidade.

          </p>

        </section>



        <section>

          <h2>4. Alterações</h2>

          <p>

            Funcionalidades e condições podem ser modificadas conforme o

            desenvolvimento do produto.

          </p>

        </section>

      </article>

    </PageContainer>

  );

}



/* =========================================================

   ABOUT

========================================================= */



export function AboutPage({ onNavigate }) {

  return (

    <PageContainer className="about-page">

      <BackButton onClick={() => onNavigate?.("settings")} />



      <div className="about-hero">

        <div className="about-mark">

          <span>V</span>

        </div>



        <span className="page-eyebrow">EVORIAN / OMNIA</span>



        <h1>VORTEX</h1>



        <p className="about-version">VORTEX 2.0</p>



        <p className="about-description">

          Uma plataforma cinematográfica para descobrir, organizar e

          explorar filmes e séries em um único espaço.

        </p>

      </div>



      <div className="about-grid">

        <div className="about-card">

          <span>PRODUCT</span>

          <strong>VORTEX</strong>

          <p>Entertainment discovery platform.</p>

        </div>



        <div className="about-card">

          <span>DIVISION</span>

          <strong>OMNIA</strong>

          <p>AI, applications and digital experiences.</p>

        </div>



        <div className="about-card">

          <span>ECOSYSTEM</span>

          <strong>EVORIAN</strong>

          <p>Creativity. Innovation. The Future.</p>

        </div>

      </div>



      <div className="about-footer">

        <span>VORTEX by EVORIAN</span>

        <span>Built inside OMNIA</span>

      </div>

    </PageContainer>

  );

}



/* =========================================================

   OPTIONAL PROFILE PAGE

========================================================= */



export function AccountProfilePage({ onNavigate }) {

  const [profile, setProfile] = useState(getStoredProfile);

  const [draftName, setDraftName] = useState(profile.name);

  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);

  const [saved, setSaved] = useState(false);



  const saveProfile = () => {

    const cleanName = draftName.trim();



    if (!cleanName) {

      setDraftName(profile.name);

      return;

    }



    const nextProfile = {

      name: cleanName.slice(0, 40),

      avatar: selectedAvatar,

    };



    saveStoredProfile(nextProfile);

    setProfile(nextProfile);

    setDraftName(nextProfile.name);

    setSelectedAvatar(nextProfile.avatar);

    setSaved(true);



    window.setTimeout(() => setSaved(false), 2200);

  };



  const avatar = getProfileAvatar(selectedAvatar);



  return (

    <PageContainer className="account-profile-page">

      <BackButton onClick={() => onNavigate?.("account")} />



      <div className="settings-header">

        <span className="page-eyebrow">ACCOUNT / PROFILE</span>

        <h1>Perfil</h1>

        <p>Personalize o nome e o personagem que representam seu perfil.</p>

      </div>



      <div

        className="profile-panel"

        style={{

          display: "grid",

          gap: "28px",

        }}

      >

        <div

          style={{

            display: "flex",

            alignItems: "center",

            gap: "20px",

            flexWrap: "wrap",

          }}

        >

          <div

            className="account-avatar large"

            aria-label={`Avatar selecionado: ${avatar.label}`}

            style={{

              display: "grid",

              placeItems: "center",

              fontSize: "3rem",

              lineHeight: 1,

            }}

          >

            {avatar.emoji}

          </div>



          <div className="profile-fields" style={{ flex: "1 1 260px" }}>

            <div>

              <span>Nome atual</span>

              <strong>{profile.name}</strong>

            </div>



            <div>

              <span>Plano</span>

              <strong>Premium</strong>

            </div>



            <div>

              <span>Perfil</span>

              <strong>Principal</strong>

            </div>

          </div>

        </div>



        <div

          style={{

            display: "grid",

            gap: "10px",

          }}

        >

          <label

            htmlFor="vortex-profile-name"

            style={{

              fontSize: "0.82rem",

              fontWeight: 700,

              letterSpacing: "0.04em",

            }}

          >

            Nome do perfil

          </label>



          <input

            id="vortex-profile-name"

            type="text"

            value={draftName}

            maxLength={40}

            onChange={(event) => setDraftName(event.target.value)}

            onKeyDown={(event) => {

              if (event.key === "Enter") {

                event.preventDefault();

                saveProfile();

              }

            }}

            placeholder="Digite o nome do perfil"

            style={{

              width: "100%",

              minHeight: "48px",

              padding: "0 16px",

              borderRadius: "14px",

              border: "1px solid rgba(255,255,255,0.12)",

              background: "rgba(255,255,255,0.045)",

              color: "inherit",

              outline: "none",

              boxSizing: "border-box",

            }}

          />

        </div>



        <div style={{ display: "grid", gap: "14px" }}>

          <div>

            <span

              style={{

                display: "block",

                fontSize: "0.82rem",

                fontWeight: 700,

                letterSpacing: "0.04em",

                marginBottom: "5px",

              }}

            >

              Personagem do perfil

            </span>

            <span style={{ opacity: 0.68, fontSize: "0.9rem" }}>

              Escolha a imagem que aparece na sua conta.

            </span>

          </div>



          <div

            role="radiogroup"

            aria-label="Escolher personagem do perfil"

            style={{

              display: "grid",

              gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))",

              gap: "12px",

            }}

          >

            {PROFILE_AVATARS.map((item) => {

              const active = selectedAvatar === item.id;



              return (

                <button

                  type="button"

                  key={item.id}

                  role="radio"

                  aria-checked={active}

                  aria-label={`Selecionar ${item.label}`}

                  onClick={() => {

                    setSelectedAvatar(item.id);

                    setSaved(false);

                  }}

                  style={{

                    minHeight: "92px",

                    borderRadius: "18px",

                    border: active

                      ? "2px solid currentColor"

                      : "1px solid rgba(255,255,255,0.10)",

                    background: active

                      ? "rgba(255,255,255,0.10)"

                      : "rgba(255,255,255,0.035)",

                    color: "inherit",

                    cursor: "pointer",

                    display: "grid",

                    placeItems: "center",

                    gap: "4px",

                    padding: "10px",

                    transition: "transform 160ms ease, background 160ms ease",

                  }}

                >

                  <span style={{ fontSize: "2rem", lineHeight: 1 }}>

                    {item.emoji}

                  </span>

                  <small style={{ opacity: 0.72 }}>{item.label}</small>

                  {active && <Icon name="check" size={15} />}

                </button>

              );

            })}

          </div>

        </div>



        <div

          style={{

            display: "flex",

            alignItems: "center",

            gap: "14px",

            flexWrap: "wrap",

          }}

        >

          <Button onClick={saveProfile}>

            {saved ? "Perfil salvo" : "Salvar alterações"}

          </Button>



          <button

            type="button"

            onClick={() => {

              setDraftName(profile.name);

              setSelectedAvatar(profile.avatar);

              setSaved(false);

            }}

            style={{

              minHeight: "44px",

              padding: "0 16px",

              borderRadius: "12px",

              border: "1px solid rgba(255,255,255,0.10)",

              background: "transparent",

              color: "inherit",

              cursor: "pointer",

            }}

          >

            Desfazer

          </button>

        </div>

      </div>

    </PageContainer>

  );

}



/* =========================================================

   GENRES

========================================================= */



export function GenresPage({

  catalog = [],

  onOpenDetails,

  onOpenPlayer,

  onToggleMyList,

  isInMyList,

}) {

  const genres = useMemo(() => {

    const map = new Map();



    catalog.forEach((media) => {

      if (!Array.isArray(media?.genres)) return;



      media.genres.forEach((genre) => {

        const name = String(genre || "").trim();

        if (!name) return;



        if (!map.has(name)) map.set(name, []);

        map.get(name).push(media);

      });

    });



    return Array.from(map.entries())

      .sort((a, b) => a[0].localeCompare(b[0], "pt-BR"))

      .map(([name, items]) => ({ name, items }));

  }, [catalog]);



  return (

    <PageContainer className="genres-page">

      <div className="catalog-heading">

        <div>

          <span className="page-eyebrow">EXPLORE</span>

          <h1>Gêneros</h1>

          <p>Explore filmes e séries organizados por gênero.</p>

        </div>

      </div>



      {genres.length === 0 ? (

        <EmptyState

          icon="grid"

          title="Nenhum gênero disponível"

          description="Ainda não existem títulos suficientes para organizar por gênero."

        />

      ) : (

        genres.map((genre) => (

          <Section key={genre.name}>

            <SectionHeader eyebrow="GENRE" title={genre.name} />

            <MediaRow

              items={genre.items.slice(0, 10)}

              onOpenDetails={onOpenDetails}

              onOpenPlayer={onOpenPlayer}

              onToggleMyList={onToggleMyList}

              isInMyList={isInMyList}

            />

          </Section>

        ))

      )}

    </PageContainer>

  );

}



/* =========================================================

   RELEASES

========================================================= */

/* =========================================================

   PROFILES

========================================================= */



export function ProfilesPage({ onNavigate }) {

  const [profile] = useState(getStoredProfile);



  const avatar = getProfileAvatar(profile.avatar);



  return (

    <PageContainer className="profiles-page">

      <div className="settings-header">

        <span className="page-eyebrow">VORTEX / PROFILES</span>

        <h1>Perfis</h1>

        <p>Gerencie os perfis usados para personalizar sua experiência.</p>

      </div>



      <div className="profiles-grid">

        <button

          type="button"

          className="profile-card active"

          onClick={() => onNavigate?.("account-profile")}

        >

          <div className="account-avatar large profile-card-avatar">

            {avatar.emoji}

          </div>



          <div className="profile-card-copy">

            <strong>{profile.name}</strong>

            <span>Perfil principal</span>

          </div>



          <Icon name="arrow-right" size={18} />

        </button>



        <button

          type="button"

          className="profile-card profile-card-add"

          onClick={() => onNavigate?.("account-profile")}

        >

          <div className="profile-add-icon">

            <Icon name="plus" size={22} />

          </div>

          <div className="profile-card-copy">

            <strong>Personalizar perfil</strong>

            <span>Nome e personagem</span>

          </div>

          <Icon name="arrow-right" size={18} />

        </button>

      </div>



      <div className="profiles-note">

        <Icon name="info" size={18} />

        <span>

          O VORTEX suporta até cinco perfis por conta na arquitetura do produto.

        </span>

      </div>



      <div style={{ marginTop: "24px" }}>

        <Button onClick={() => onNavigate?.("account")}>Voltar à conta</Button>

      </div>

    </PageContainer>

  );

}



/* =========================================================

   LICENSES

========================================================= */



export function LicensesPage({ onNavigate }) {

  return (

    <PageContainer className="document-page licenses-page">

      <BackButton onClick={() => onNavigate?.("documents")} />



      <div className="document-header">

        <span className="page-eyebrow">VORTEX / LEGAL</span>

        <h1>Licenças e atribuições</h1>

        <p>

          Informações sobre tecnologias, serviços e fontes utilizadas pelo

          VORTEX.

        </p>

      </div>



      <article className="document-content">

        <section>

          <h2>1. VORTEX</h2>

          <p>

            O VORTEX é um produto desenvolvido dentro do ecossistema EVORIAN,

            na divisão OMNIA.

          </p>

        </section>



        <section>

          <h2>2. TMDB</h2>

          <p>

            O catálogo do VORTEX pode utilizar dados fornecidos pelo TMDB. A

            utilização desses dados deve respeitar os termos e atribuições

            exigidos pelo respectivo serviço.

          </p>

        </section>



        <section>

          <h2>3. Tecnologias</h2>

          <p>

            A aplicação utiliza tecnologias de desenvolvimento web e serviços

            de infraestrutura de terceiros. Cada dependência permanece sujeita

            à sua própria licença e condições de uso.

          </p>

        </section>



        <section>

          <h2>4. Conteúdo audiovisual</h2>

          <p>

            Dados de catálogo não representam, por si só, direitos de

            reprodução. Qualquer reprodução deve utilizar uma fonte autorizada

            e integrada ao VORTEX.

          </p>

        </section>

      </article>

    </PageContainer>

  );

}



/* =========================================================

   HELP

========================================================= */



export function HelpPage({ onNavigate }) {

  return (

    <PageContainer>

      <div className="settings-header">

        <span className="page-eyebrow">VORTEX / HELP</span>

        <h1>Ajuda</h1>

        <p>Encontre informações e orientações sobre o VORTEX.</p>

      </div>



      <div className="settings-list">

        <SettingsItem

          icon="info"

          title="Sobre o VORTEX"

          description="Conheça o produto e o ecossistema EVORIAN."

          onClick={() => onNavigate?.("about")}

        />

        <SettingsItem

          icon="shield"

          title="Privacidade"

          description="Consulte informações sobre seus dados e privacidade."

          onClick={() => onNavigate?.("privacy")}

        />

        <SettingsItem

          icon="file-text"

          title="Termos de uso"

          description="Leia os termos de utilização do VORTEX."

          onClick={() => onNavigate?.("terms")}

        />

        <SettingsItem

          icon="file"

          title="Licenças e atribuições"

          description="Consulte as tecnologias e fontes utilizadas pelo VORTEX."

          onClick={() => onNavigate?.("licenses")}

        />

      </div>

    </PageContainer>

  );

}



/* =========================================================
   RELEASES
========================================================= */

export function ReleasesPage({
  catalog = [],
  movies = [],
  series = [],
  onNavigate,
  onOpenDetails,
  onOpenPlayer,
  onToggleMyList,
  isInMyList,
}) {
  const releaseItems = useMemo(() => {
    const combined = catalog.length > 0 ? catalog : [...movies, ...series];

    return [...combined]
      .filter((media) => media?.releaseDate)
      .sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() -
          new Date(a.releaseDate).getTime()
      );
  }, [catalog, movies, series]);

  return (
    <PageContainer className="releases-page">
      <BackButton onClick={() => onNavigate?.("home")} />

      <div className="catalog-heading">
        <div>
          <span className="page-eyebrow">VORTEX / RELEASES</span>
          <h1>Lançamentos</h1>
          <p>Explore os títulos mais recentes disponíveis no catálogo.</p>
        </div>
      </div>

      <MediaGrid
        items={releaseItems}
        onOpenDetails={onOpenDetails}
        onOpenPlayer={onOpenPlayer}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
    </PageContainer>
  );
}

/* =========================================================

   DEFAULT EXPORT

========================================================= */



const VortexPages = {

  PageContainer,

  Section,

  MediaGrid,

  HomePage,

  MoviesPage,

  SeriesPage,

  GenresPage,

  ReleasesPage,

  SearchPage,

  ContinueWatchingPage,

  MyListPage,

  DetailsPage,

  PlayerPage,

  ProfilesPage,

  AccountPage,

  AccountProfilePage,

  SettingsPage,

  AppearancePage,

  LanguagePage,

  PrivacyPage,

  CatalogDataPage,

  DocumentsPage,

  TermsPage,

  LicensesPage,

  AboutPage,

  HelpPage,

};



export default VortexPages;