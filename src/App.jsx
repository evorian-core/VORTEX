import { useEffect, useMemo, useState } from "react";
import "./App.css";

import {
  Sidebar,
  Topbar,
  MobileNavigation,
  Toast,
} from "./VortexComponents";

import VortexAuth from "./VortexAuth";

import {
  HomePage,
  MoviesPage,
  SeriesPage,
  SearchPage,
  ContinueWatchingPage,
  MyListPage,
  ReleasesPage,
  GenresPage,
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
  AboutPage,
  LicensesPage,
  HelpPage,
} from "./VortexPages";

import VortexLanding from "./VortexLanding";

import {
  initialMovies,
  initialSeries,
  getFeaturedMedia,
  normalizeMedia,
} from "./VortexData";

import {
  getTrendingMovies,
  normalizeTMDBMedia,
  getBackdropUrl,
} from "./VortexServices";


/* -----------------------------------------------------------------------
   STORAGE
------------------------------------------------------------------------ */

const STORAGE = {
  theme: "vortex-theme",
  language: "vortex-language",
  list: "vortex-list",
  history: "vortex-history",
  progress: "vortex-progress",
  profiles: "vortex-profiles",
  activeProfile: "vortex-active-profile",
};


/* -----------------------------------------------------------------------
   SAFE STORAGE
------------------------------------------------------------------------ */

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);

    return value === null
      ? fallback
      : JSON.parse(value);
  } catch {
    return fallback;
  }
};


const write = (key, value) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {}
};


/* -----------------------------------------------------------------------
   ROUTES
------------------------------------------------------------------------ */

const routeMap = {
  "/": "landing",

  "/login": "login",
  "/signup": "signup",

  "/home": "home",

  "/movies": "movies",
  "/series": "series",

  "/my-list": "my-list",
  "/continue-watching": "continue-watching",

  "/releases": "releases",
  "/genres": "genres",

  "/profiles": "profiles",
  "/profiles/edit": "account-profile",

  "/account": "account",
  "/settings": "settings",

  "/help": "help",

  "/appearance": "appearance",
  "/language": "language",

  "/privacy": "privacy",
  "/catalog-data": "catalog-data",

  "/documents": "documents",
  "/terms": "terms",
  "/licenses": "licenses",
  "/about": "about",
};


/* -----------------------------------------------------------------------
   ROUTE RESOLVER
------------------------------------------------------------------------ */

function resolveRoute(pathname) {
  if (routeMap[pathname]) {
    return {
      page: routeMap[pathname],
      id: null,
      seriesId: null,
      season: null,
      episode: null,
      mediaType: null,
    };
  }


  let match = pathname.match(
    /^\/movie\/([^/]+)$/
  );

  if (match) {
    return {
      page: "details",
      id: match[1],
      mediaType: "movie",
    };
  }


  match = pathname.match(
    /^\/series\/([^/]+)$/
  );

  if (match) {
    return {
      page: "details",
      id: match[1],
      mediaType: "series",
    };
  }


  match = pathname.match(
    /^\/watch\/series\/([^/]+)\/(\d+)\/(\d+)$/
  );

  if (match) {
    return {
      page: "player",
      id: match[1],
      season: Number(match[2]),
      episode: Number(match[3]),
      mediaType: "series",
    };
  }


  match = pathname.match(
    /^\/watch\/([^/]+)$/
  );

  if (match) {
    return {
      page: "player",
      id: match[1],
      mediaType: null,
    };
  }


  return {
    page: "landing",
    id: null,
    mediaType: null,
  };
}


/* -----------------------------------------------------------------------
   PAGE PATH
------------------------------------------------------------------------ */

const pagePath = (page) => {
  const paths = {
    landing: "/",

    login: "/login",
    signup: "/signup",

    home: "/home",

    movies: "/movies",
    series: "/series",

    "my-list": "/my-list",
    "continue-watching": "/continue-watching",

    releases: "/releases",
    genres: "/genres",

    profiles: "/profiles",
    "account-profile": "/profiles/edit",

    account: "/account",
    settings: "/settings",

    help: "/help",

    appearance: "/appearance",
    language: "/language",

    privacy: "/privacy",
    "catalog-data": "/catalog-data",

    documents: "/documents",
    terms: "/terms",
    licenses: "/licenses",
    about: "/about",
  };

  return paths[page] || "/";
};


/* -----------------------------------------------------------------------
   APP
------------------------------------------------------------------------ */

export default function App() {

  /* ---------------------------------------------------------------------
     CATALOG
  --------------------------------------------------------------------- */

  const normalizedMovies = useMemo(
    () =>
      initialMovies
        .map(normalizeMedia)
        .filter(Boolean),
    []
  );


  const normalizedSeries = useMemo(
    () =>
      initialSeries
        .map(normalizeMedia)
        .filter(Boolean),
    []
  );


  const catalog = useMemo(
    () => [
      ...normalizedMovies,
      ...normalizedSeries,
    ],
    [
      normalizedMovies,
      normalizedSeries,
    ]
  );


  const localFeatured = useMemo(
  () => getFeaturedMedia(catalog),
  [catalog]
);

const [tmdbFeatured, setTmdbFeatured] = useState(null);
const [tmdbHeroLoading, setTmdbHeroLoading] = useState(true);
const [tmdbHeroError, setTmdbHeroError] = useState(null);

const featured = useMemo(
  () => (tmdbFeatured ? [tmdbFeatured] : localFeatured),
  [tmdbFeatured, localFeatured]
);


  /* ---------------------------------------------------------------------
     INITIAL ROUTE
  --------------------------------------------------------------------- */

  const initialRoute = resolveRoute(
    window.location.pathname
  );


  /* ---------------------------------------------------------------------
     GLOBAL STATE
  --------------------------------------------------------------------- */

  const [activePage, setActivePage] =
    useState(initialRoute.page);


  const [authUser, setAuthUser] = useState(null);


  const [authChecking, setAuthChecking] = useState(true);


  const [selectedMedia, setSelectedMedia] =
    useState(null);


  const [playerMedia, setPlayerMedia] =
    useState(null);


  const [searchQuery, setSearchQuery] =
    useState(
      () =>
        new URLSearchParams(
          window.location.search
        ).get("q") || ""
    );


  const [theme, setTheme] =
    useState(() =>
      read(
        STORAGE.theme,
        "dark"
      )
    );


  const [language, setLanguage] =
    useState(() =>
      read(
        STORAGE.language,
        "pt-BR"
      )
    );


  const [myList, setMyList] =
    useState(() =>
      read(
        STORAGE.list,
        []
      )
    );


  const [watchHistory, setWatchHistory] =
    useState(() =>
      read(
        STORAGE.history,
        []
      )
    );


  const [watchProgress, setWatchProgress] =
    useState(() =>
      read(
        STORAGE.progress,
        {}
      )
    );


  const [profiles, setProfiles] =
    useState(() =>
      read(
        STORAGE.profiles,
        [
          {
            id: "main",
            name: "Principal",
          },
        ]
      )
    );


  const [activeProfileId, setActiveProfileId] =
    useState(() =>
      read(
        STORAGE.activeProfile,
        "main"
      )
    );


  const [toast, setToast] =
    useState(null);


  const [sidebarOpen, setSidebarOpen] =
    useState(false);


  const [routeMediaId, setRouteMediaId] =
    useState(initialRoute.id);


/* ---------------------------------------------------------------------
   AUTHENTICATION
--------------------------------------------------------------------- */

useEffect(() => {
  let cancelled = false;

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (cancelled) {
        return;
      }

      if (response.ok && result.authenticated && result.user) {
        setAuthUser(result.user);
      } else {
        setAuthUser(null);
      }
    } catch (error) {
      console.error("VORTEX authentication check error:", error);

      if (!cancelled) {
        setAuthUser(null);
      }
    } finally {
      if (!cancelled) {
        setAuthChecking(false);
      }
    }
  };

  checkAuthentication();

  return () => {
    cancelled = true;
  };
}, []);

/* ---------------------------------------------------------------------
   TMDB HERO
--------------------------------------------------------------------- */

useEffect(() => {
  let cancelled = false;

  const loadTMDBHero = async () => {
    setTmdbHeroLoading(true);
    setTmdbHeroError(null);

    try {
      const result = await getTrendingMovies({
        page: 1,
        timeWindow: "week",
      });

      const first = Array.isArray(result?.results)
        ? result.results.find(
            (item) => item?.backdrop_path || item?.poster_path
          )
        : null;

      if (!first) {
        throw new Error(
          "Nenhum filme válido retornado pelo TMDB."
        );
      }

      const normalized = normalizeTMDBMedia(
        first,
        "movie"
      );

      const hero = normalizeMedia({
        ...normalized,

        id: String(
          normalized?.id ??
            normalized?.tmdb_id ??
            first.id
        ),

        tmdb_id:
          normalized?.tmdb_id ??
          first.id,

        mediaType: "movie",

        backdrop: getBackdropUrl(
          first.backdrop_path
        ),

        poster: getBackdropUrl(
          first.poster_path
        ),
      });

      if (!cancelled) {
        setTmdbFeatured(hero);
      }
    } catch (error) {
      console.error(
        "VORTEX TMDB Hero error:",
        error
      );

      if (!cancelled) {
        setTmdbHeroError(error);
      }
    } finally {
      if (!cancelled) {
        setTmdbHeroLoading(false);
      }
    }
  };

  loadTMDBHero();

  return () => {
    cancelled = true;
  };
}, []);

  /* ---------------------------------------------------------------------
     ROUTE MEDIA SYNC
  --------------------------------------------------------------------- */

  useEffect(() => {
    if (!routeMediaId) {
      return;
    }

    const route = resolveRoute(
      window.location.pathname
    );


    const media = catalog.find(
      (item) =>
        String(item.id) ===
          String(routeMediaId) &&
        (
          !route.mediaType ||
          item.mediaType ===
            route.mediaType
        )
    );


    if (!media) {
      return;
    }


    setSelectedMedia(media);


    if (route.page === "player") {
      setPlayerMedia(media);
    }
  }, [
    routeMediaId,
    catalog,
  ]);


  /* ---------------------------------------------------------------------
     THEME
  --------------------------------------------------------------------- */

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    write(
      STORAGE.theme,
      theme
    );
  }, [theme]);


  /* ---------------------------------------------------------------------
     LANGUAGE
  --------------------------------------------------------------------- */

  useEffect(() => {
    document.documentElement.lang =
      language;

    write(
      STORAGE.language,
      language
    );
  }, [language]);


  /* ---------------------------------------------------------------------
     MY LIST STORAGE
  --------------------------------------------------------------------- */

  useEffect(() => {
    write(
      STORAGE.list,
      myList
    );
  }, [myList]);


  /* ---------------------------------------------------------------------
     HISTORY STORAGE
  --------------------------------------------------------------------- */

  useEffect(() => {
    write(
      STORAGE.history,
      watchHistory
    );
  }, [watchHistory]);


  /* ---------------------------------------------------------------------
     PROGRESS STORAGE
  --------------------------------------------------------------------- */

  useEffect(() => {
    write(
      STORAGE.progress,
      watchProgress
    );
  }, [watchProgress]);


  /* ---------------------------------------------------------------------
     PROFILE STORAGE
  --------------------------------------------------------------------- */

  useEffect(() => {
    write(
      STORAGE.profiles,
      profiles
    );

    write(
      STORAGE.activeProfile,
      activeProfileId
    );
  }, [
    profiles,
    activeProfileId,
  ]);


  /* ---------------------------------------------------------------------
     BROWSER BACK / FORWARD
  --------------------------------------------------------------------- */

  useEffect(() => {
    const handler = () => {
      const route = resolveRoute(
        window.location.pathname
      );


      setActivePage(
        route.page
      );


      setRouteMediaId(
        route.id
      );


      setSearchQuery(
        new URLSearchParams(
          window.location.search
        ).get("q") || ""
      );
    };


    window.addEventListener(
      "popstate",
      handler
    );


    return () => {
      window.removeEventListener(
        "popstate",
        handler
      );
    };
  }, []);


  /* ---------------------------------------------------------------------
     TOAST
  --------------------------------------------------------------------- */

  const showToast = (
    message,
    type = "default"
  ) => {
    setToast({
      id: Date.now(),
      message,
      type,
    });
  };


  /* ---------------------------------------------------------------------
     NAVIGATION
  --------------------------------------------------------------------- */

  const navigate = (
    page,
    value = ""
  ) => {

    let path;


    if (page === "search") {

      path =
        `/search${
          value
            ? `?q=${encodeURIComponent(
                value
              )}`
            : ""
        }`;

    } else if (
      page === "details" &&
      selectedMedia
    ) {

      path =
        `/${
          selectedMedia.mediaType ===
          "series"
            ? "series"
            : "movie"
        }/${selectedMedia.id}`;

    } else {

      path = pagePath(page);
    }


    window.history.pushState(
      {},
      "",
      path
    );


    setActivePage(page);


    setRouteMediaId(
      null
    );


    setSidebarOpen(
      false
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* ---------------------------------------------------------------------
   AUTHENTICATION GUARD
--------------------------------------------------------------------- */

useEffect(() => {
  if (authChecking) {
    return;
  }

  const isPublicPage =
    activePage === "landing" ||
    activePage === "login" ||
    activePage === "signup";

  if (!authUser && !isPublicPage) {
    window.history.replaceState({}, "", "/login");

    setActivePage("login");
    setRouteMediaId(null);

    return;
  }

  if (
    authUser &&
    (
      activePage === "landing" ||
      activePage === "login" ||
      activePage === "signup"
    )
  ) {
    window.history.replaceState({}, "", "/home");

    setActivePage("home");
    setRouteMediaId(null);
  }
}, [authUser, authChecking, activePage]);


  /* ---------------------------------------------------------------------
     OPEN DETAILS
  --------------------------------------------------------------------- */

  const openDetails = (
    media
  ) => {

    const normalized =
      normalizeMedia(media);


    if (!normalized) {
      return;
    }


    setSelectedMedia(
      normalized
    );


    setPlayerMedia(
      null
    );


    setRouteMediaId(
      normalized.id
    );


    const path =
      `/${
        normalized.mediaType ===
        "series"
          ? "series"
          : "movie"
      }/${normalized.id}`;


    window.history.pushState(
      {},
      "",
      path
    );


    setActivePage(
      "details"
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* ---------------------------------------------------------------------
     OPEN PLAYER
  --------------------------------------------------------------------- */

  const openPlayer = (
    media
  ) => {

    const normalized =
      normalizeMedia(media);


    if (!normalized) {
      return;
    }


    setPlayerMedia(
      normalized
    );


    setSelectedMedia(
      null
    );


    setRouteMediaId(
      normalized.id
    );


    window.history.pushState(
      {},
      "",
      `/watch/${normalized.id}`
    );


    setActivePage(
      "player"
    );


    registerWatch(
      normalized
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* ---------------------------------------------------------------------
     CLOSE PLAYER
  --------------------------------------------------------------------- */

  const closePlayer = () => {

    setPlayerMedia(
      null
    );


    navigate(
      selectedMedia
        ? "details"
        : "home"
    );
  };


  /* ---------------------------------------------------------------------
     MY LIST
  --------------------------------------------------------------------- */

  const isInMyList = (
    media
  ) =>
    myList.some(
      (item) =>
        String(item.id) ===
          String(media?.id) &&
        item.mediaType ===
          media?.mediaType
    );


  const toggleMyList = (
    media
  ) => {

    const normalized =
      normalizeMedia(media);


    if (!normalized) {
      return;
    }


    if (
      isInMyList(
        normalized
      )
    ) {

      setMyList(
        (items) =>
          items.filter(
            (item) =>
              !(
                String(item.id) ===
                  String(
                    normalized.id
                  ) &&
                item.mediaType ===
                  normalized.mediaType
              )
          )
      );


      showToast(
        `${normalized.title} foi removido da sua lista.`,
        "remove"
      );

    } else {

      setMyList(
        (items) => [
          ...items,
          normalized,
        ]
      );


      showToast(
        `${normalized.title} foi adicionado à sua lista.`,
        "success"
      );
    }
  };


  /* ---------------------------------------------------------------------
     WATCH HISTORY
  --------------------------------------------------------------------- */

  function registerWatch(
    media
  ) {

    if (!media) {
      return;
    }


    const normalized =
      normalizeMedia(media);


    if (!normalized) {
      return;
    }


    setWatchHistory(
      (items) => [
        {
          ...normalized,
          watchedAt:
            Date.now(),
        },

        ...items.filter(
          (item) =>
            !(
              String(item.id) ===
                String(
                  normalized.id
                ) &&
              item.mediaType ===
                normalized.mediaType
            )
        ),
      ].slice(0, 50)
    );
  }


  /* ---------------------------------------------------------------------
     PLAYER PROGRESS
  --------------------------------------------------------------------- */

  const saveProgress = (
    media,
    position,
    duration
  ) => {

    if (
      !media ||
      !Number.isFinite(
        position
      ) ||
      !Number.isFinite(
        duration
      ) ||
      duration <= 0
    ) {
      return;
    }


    setWatchProgress(
      (items) => ({
        ...items,

        [media.id]: {
          position,
          duration,

          percentage:
            Math.min(
              100,
              Math.max(
                0,
                (position /
                  duration) *
                  100
              )
            ),

          updatedAt:
            Date.now(),
        },
      })
    );
  };


  /* ---------------------------------------------------------------------
     CONTINUE WATCHING
  --------------------------------------------------------------------- */

  const continueWatching =
    useMemo(
      () =>
        watchHistory
          .map((media) => {

            const progress =
              watchProgress[
                media.id
              ];


            if (
              !progress ||
              progress.percentage <= 0 ||
              progress.percentage >= 95
            ) {
              return null;
            }


            return {
              ...normalizeMedia(
                media
              ),

              progress:
                progress.percentage,

              position:
                progress.position,

              duration:
                progress.duration,
            };
          })
          .filter(Boolean),

      [
        watchHistory,
        watchProgress,
      ]
    );


  /* ---------------------------------------------------------------------
     RECOMMENDATIONS
  --------------------------------------------------------------------- */

  const recommendations =
    useMemo(
      () =>
        catalog
          .filter(
            (media) =>
              !myList.some(
                (item) =>
                  item.id ===
                    media.id &&
                  item.mediaType ===
                    media.mediaType
              )
          )
          .sort(
            (a, b) =>
              (b.rating || 0) -
              (a.rating || 0)
          )
          .slice(0, 10),

      [
        catalog,
        myList,
      ]
    );


  /* ---------------------------------------------------------------------
     ACTIVE PROFILE
  --------------------------------------------------------------------- */

  const activeProfile =
    profiles.find(
      (profile) =>
        profile.id ===
        activeProfileId
    ) || profiles[0];


  /* ---------------------------------------------------------------------
     CLEAR HISTORY
  --------------------------------------------------------------------- */

  const clearHistory = () => {

    setWatchHistory(
      []
    );


    setWatchProgress(
      {}
    );


    showToast(
      "Histórico limpo.",
      "success"
    );
  };


  /* ---------------------------------------------------------------------
     CLEAR LOCAL DATA
  --------------------------------------------------------------------- */

  const clearLocalData = () => {

    Object.values(
      STORAGE
    ).forEach(
      (key) =>
        localStorage.removeItem(
          key
        )
    );


    window.location.reload();
  };


  /* ---------------------------------------------------------------------
     PAGE PROPS
  --------------------------------------------------------------------- */

  const pageProps = {

    authUser,

    catalog,

    movies:
      normalizedMovies,

    series:
      normalizedSeries,

    featured,

    tmdbHeroLoading,
    tmdbHeroError,

    continueWatching,

    myList,

    watchHistory,

    watchProgress,

    recommendations,

    searchQuery,

    selectedMedia,

    playerMedia,

    theme,

    language,

    profiles,

    activeProfile,


    onNavigate:
      navigate,

    onOpenDetails:
      openDetails,

    onOpenPlayer:
      openPlayer,

    onClosePlayer:
      closePlayer,


    onToggleMyList:
      toggleMyList,

    isInMyList,


    onSearch: (query) => {

      const value =
        String(
          query || ""
        ).trim();


      setSearchQuery(
        value
      );


      navigate(
        "search",
        value
      );
    },


    onSaveProgress:
      saveProgress,


    onThemeChange:
      setTheme,

    onLanguageChange:
      setLanguage,


    onClearHistory:
      clearHistory,

    onClearLocalData:
      clearLocalData,


    onSelectProfile:
      (profile) => {

        if (!profile) {
          return;
        }


        setActiveProfileId(
          profile.id
        );


        navigate(
          "home"
        );
      },


    onCreateProfile:
      () => {

        const id =
          `profile-${Date.now()}`;


        setProfiles(
          (items) => [
            ...items,

            {
              id,
              name:
                `Perfil ${
                  items.length + 1
                }`,
            },
          ]
        );
      },


    onEditProfile:
      () =>
        navigate(
          "account-profile"
        ),


    onSaveProfile:
      (profile) => {

        if (!profile) {
          return;
        }


        setProfiles(
          (items) =>
            items.map(
              (item) =>
                item.id ===
                profile.id
                  ? profile
                  : item
            )
        );


        navigate(
          "account"
        );
      },


    onShowToast:
      showToast,
  };


   if (authChecking) {
  return (
    <main className="vortex-auth-loading">
      <div className="vortex-auth-loading-core">
        <div className="vortex-auth-loading-logo">V</div>
        <span>VORTEX</span>
        <small>Verificando sessão...</small>
      </div>
    </main>
  );
}

  /* ---------------------------------------------------------------------
     PAGE RENDER
  --------------------------------------------------------------------- */

  let page;


  switch (
    activePage
  ) {

    case "landing":

      page = (
        <VortexLanding
          onNavigate={
            navigate
          }
        />
      );

      break;


    case "login":

      page = (
        <VortexAuth
           mode="login"
           onNavigate={navigate}
           onAuthSuccess={(user) => setAuthUser(user)}
    />
      );

      break;


    case "signup":

      page = (
        <VortexAuth
           mode="signup"
           onNavigate={navigate}
          onAuthSuccess={(user) => setAuthUser(user)}
      />
      );

      break;


    case "home":

      page = (
        <HomePage
          {...pageProps}
        />
      );

      break;


    case "movies":

      page = (
        <MoviesPage
          {...pageProps}
        />
      );

      break;


    case "series":

      page = (
        <SeriesPage
          {...pageProps}
        />
      );

      break;


    case "search":

      page = (
        <SearchPage
          {...pageProps}
        />
      );

      break;


    case "continue-watching":

      page = (
        <ContinueWatchingPage
          {...pageProps}
        />
      );

      break;


    case "my-list":

      page = (
        <MyListPage
          {...pageProps}
        />
      );

      break;


    case "releases":

      page = (
        <ReleasesPage
          {...pageProps}
        />
      );

      break;


    case "genres":

      page = (
        <GenresPage
          {...pageProps}
        />
      );

      break;


    case "details":

      page = (
        <DetailsPage
          {...pageProps}
        />
      );

      break;


    case "player":

      page = (
        <PlayerPage
          {...pageProps}
        />
      );

      break;


    case "profiles":

      page = (
        <ProfilesPage
          {...pageProps}
        />
      );

      break;


    case "account":

      page = (
        <AccountPage
          {...pageProps}
        />
      );

      break;


    case "account-profile":

      page = (
        <AccountProfilePage
          {...pageProps}
        />
      );

      break;


    case "settings":

      page = (
        <SettingsPage
          {...pageProps}
        />
      );

      break;


    case "appearance":

      page = (
        <AppearancePage
          {...pageProps}
        />
      );

      break;


    case "language":

      page = (
        <LanguagePage
          {...pageProps}
        />
      );

      break;


    case "privacy":

      page = (
        <PrivacyPage
          {...pageProps}
        />
      );

      break;


    case "catalog-data":

      page = (
        <CatalogDataPage
          {...pageProps}
        />
      );

      break;


    case "documents":

      page = (
        <DocumentsPage
          {...pageProps}
        />
      );

      break;


    case "terms":

      page = (
        <TermsPage
          {...pageProps}
        />
      );

      break;


    case "licenses":

      page = (
        <LicensesPage
          {...pageProps}
        />
      );

      break;


    case "about":

      page = (
        <AboutPage
          {...pageProps}
        />
      );

      break;


    case "help":

      page = (
        <HelpPage
          {...pageProps}
        />
      );

      break;


    default:

      page = (
        <VortexLanding
          onNavigate={
            navigate
          }
        />
      );

      break;
  }


  /* ---------------------------------------------------------------------
     PUBLIC PAGES
  --------------------------------------------------------------------- */

  const isPublicPage =
    activePage === "landing" ||
    activePage === "login" ||
    activePage === "signup";


  if (isPublicPage) {
    return page;
  }


  /* ---------------------------------------------------------------------
     IMMERSIVE PAGES
  --------------------------------------------------------------------- */

  const immersive =
    activePage === "details" ||
    activePage === "player";


  /* ---------------------------------------------------------------------
     APPLICATION LAYOUT
  --------------------------------------------------------------------- */

  return (
    <div
      className={[
        "vortex-app",
        `theme-${theme}`,
        immersive
          ? "is-immersive"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >

      <Sidebar
        activePage={
          activePage
        }

        onNavigate={
          navigate
        }

        isOpen={
          sidebarOpen
        }

        onClose={() =>
          setSidebarOpen(
            false
          )
        }
      />


      <main className="vortex-main">

        {activePage !==
          "player" && (
          <Topbar
            searchQuery={
              searchQuery
            }

            onSearch={(query) => {
              setSearchQuery(
                query
              );

              navigate(
                "search",
                query
              );
            }}

            onMenu={() =>
              setSidebarOpen(
                true
              )
            }

            onNavigate={
              navigate
            }
          />
        )}


        <div className="vortex-content">
          {page}
        </div>

      </main>


      {activePage !==
        "player" && (
        <MobileNavigation
          activePage={
            activePage
          }

          onNavigate={
            navigate
          }
        />
      )}


      {toast && (
        <Toast
          key={
            toast.id
          }

          message={
            toast.message
          }

          type={
            toast.type
          }

          onClose={() =>
            setToast(
              null
            )
          }
        />
      )}

    </div>
  );
}