/*
|--------------------------------------------------------------------------
| VORTEX — Data Layer
|--------------------------------------------------------------------------
|
| Responsabilidades:
| - dados iniciais do catálogo
| - normalização de mídia
| - gêneros
| - plataformas
| - destaque
| - busca
| - recomendações
| - compatibilidade futura com TMDB
|
| Padrão de mediaType:
| - "movie"  → filme
| - "series" → série
|
|--------------------------------------------------------------------------
*/

export const MEDIA_TYPES = {
  MOVIE: "movie",
  SERIES: "series",
};

/*
|--------------------------------------------------------------------------
| GENRES
|--------------------------------------------------------------------------
*/

export const GENRES = [
  {
    id: 28,
    name: "Ação",
    slug: "acao",
  },
  {
    id: 12,
    name: "Aventura",
    slug: "aventura",
  },
  {
    id: 16,
    name: "Animação",
    slug: "animacao",
  },
  {
    id: 35,
    name: "Comédia",
    slug: "comedia",
  },
  {
    id: 80,
    name: "Crime",
    slug: "crime",
  },
  {
    id: 99,
    name: "Documentário",
    slug: "documentario",
  },
  {
    id: 18,
    name: "Drama",
    slug: "drama",
  },
  {
    id: 14,
    name: "Fantasia",
    slug: "fantasia",
  },
  {
    id: 27,
    name: "Terror",
    slug: "terror",
  },
  {
    id: 9648,
    name: "Mistério",
    slug: "misterio",
  },
  {
    id: 10749,
    name: "Romance",
    slug: "romance",
  },
  {
    id: 878,
    name: "Ficção científica",
    slug: "ficcao-cientifica",
  },
  {
    id: 53,
    name: "Thriller",
    slug: "thriller",
  },
];

/*
|--------------------------------------------------------------------------
| PROVIDERS
|--------------------------------------------------------------------------
*/

export const PROVIDERS = [
  {
    id: 8,
    name: "Netflix",
    slug: "netflix",
    logo: null,
  },
  {
    id: 119,
    name: "Prime Video",
    slug: "prime-video",
    logo: null,
  },
  {
    id: 337,
    name: "Disney+",
    slug: "disney-plus",
    logo: null,
  },
  {
    id: 1899,
    name: "Max",
    slug: "max",
    logo: null,
  },
  {
    id: 350,
    name: "Apple TV+",
    slug: "apple-tv-plus",
    logo: null,
  },
  {
    id: 531,
    name: "Paramount+",
    slug: "paramount-plus",
    logo: null,
  },
  {
    id: 307,
    name: "Globoplay",
    slug: "globoplay",
    logo: null,
  },
];

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function safeNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeMediaType(value) {
  if (value === "movie") {
    return MEDIA_TYPES.MOVIE;
  }

  if (
    value === "series" ||
    value === "tv" ||
    value === "show"
  ) {
    return MEDIA_TYPES.SERIES;
  }

  return MEDIA_TYPES.MOVIE;
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  return String(value).slice(0, 10);
}

/*
|--------------------------------------------------------------------------
| CREATE MEDIA
|--------------------------------------------------------------------------
*/

export function createMedia(data = {}) {
  const mediaType = normalizeMediaType(
    data.mediaType ||
      data.type ||
      data.media_type
  );

  const title =
    data.title ||
    data.name ||
    data.originalTitle ||
    data.original_name ||
    "Título desconhecido";

  const originalTitle =
    data.originalTitle ||
    data.original_name ||
    data.originalName ||
    title;

  const releaseDate =
    normalizeDate(
      data.releaseDate ||
        data.release_date ||
        data.firstAirDate ||
        data.first_air_date
    );

  return {
    id: data.id ?? `${mediaType}-${Math.random()}`,

    mediaType,

    title,
    originalTitle,

    overview:
      data.overview ||
      data.description ||
      "Nenhuma descrição disponível.",

    poster:
      data.poster ||
      data.posterPath ||
      data.poster_path ||
      null,

    backdrop:
      data.backdrop ||
      data.backdropPath ||
      data.backdrop_path ||
      null,

    rating: safeNumber(
      data.rating ??
        data.voteAverage ??
        data.vote_average,
      0
    ),

    voteCount: safeNumber(
      data.voteCount ??
        data.vote_count,
      0
    ),

    popularity: safeNumber(
      data.popularity,
      0
    ),

    releaseDate,

    year:
      data.year ||
      (releaseDate
        ? releaseDate.slice(0, 4)
        : null),

    genres: safeArray(data.genres),

    genreIds: safeArray(
      data.genreIds ||
        data.genre_ids
    ),

    runtime:
      data.runtime ??
      data.episodeRuntime ??
      data.episode_run_time?.[0] ??
      null,

    seasons:
      data.seasons ??
      data.numberOfSeasons ??
      data.number_of_seasons ??
      null,

    episodes:
      data.episodes ??
      data.numberOfEpisodes ??
      data.number_of_episodes ??
      null,

    status:
      data.status ||
      "Em exibição",

    tagline:
      data.tagline ||
      "",

    certification:
      data.certification ||
      data.ratingCertification ||
      null,

    language:
      data.language ||
      data.originalLanguage ||
      data.original_language ||
      "pt-BR",

    providers: safeArray(
      data.providers
    ),

    cast: safeArray(
      data.cast
    ),

    crew: safeArray(
      data.crew
    ),

    trailer:
      data.trailer ||
      data.trailerUrl ||
      data.trailer_url ||
      null,

    video:
      data.video ||
      null,

    progress:
      typeof data.progress === "number"
        ? data.progress
        : null,

    position:
      typeof data.position === "number"
        ? data.position
        : null,

    duration:
      typeof data.duration === "number"
        ? data.duration
        : null,

    watchedAt:
      data.watchedAt ||
      null,

    featured:
      Boolean(data.featured),

    isNew:
      Boolean(data.isNew),

    isPopular:
      Boolean(data.isPopular),

    isTrending:
      Boolean(data.isTrending),
  };
}

/*
|--------------------------------------------------------------------------
| NORMALIZE MEDIA
|--------------------------------------------------------------------------
*/

export function normalizeMedia(media) {
  if (!media) {
    return null;
  }

  return createMedia(media);
}

/*
|--------------------------------------------------------------------------
| MOCK MEDIA
|--------------------------------------------------------------------------
|
| Estas imagens são placeholders estruturais.
| Quando o TMDB entrar, o backend fornecerá URLs reais.
|
|--------------------------------------------------------------------------
*/

const MOCK_POSTER_BASE =
  "https://image.tmdb.org/t/p/w500";

const MOCK_BACKDROP_BASE =
  "https://image.tmdb.org/t/p/w1280";

/*
|--------------------------------------------------------------------------
| MOVIES
|--------------------------------------------------------------------------
*/

export const MOVIES = [
  createMedia({
    id: 101,
    mediaType: "movie",
    title: "Horizonte Final",
    originalTitle: "Final Horizon",
    overview:
      "Uma equipe embarca em uma missão além das fronteiras conhecidas para descobrir o que existe depois do horizonte.",
    poster: `${MOCK_POSTER_BASE}/example-horizon-final.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-horizon-final-backdrop.jpg`,
    rating: 8.7,
    voteCount: 8421,
    popularity: 98,
    releaseDate: "2026-06-18",
    genres: ["Ficção científica", "Aventura", "Drama"],
    genreIds: [878, 12, 18],
    runtime: 142,
    status: "Lançado",
    tagline: "O desconhecido começa onde o mapa termina.",
    certification: "12",
    language: "en",
    providers: [8, 119],
    trailer: null,
    featured: true,
    isPopular: true,
    isTrending: true,
  }),

  createMedia({
    id: 102,
    mediaType: "movie",
    title: "A Última Expedição",
    originalTitle: "The Last Expedition",
    overview:
      "Uma expedição desaparecida deixa para trás apenas uma mensagem que pode mudar o destino de todos.",
    poster: `${MOCK_POSTER_BASE}/example-last-expedition.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-last-expedition-backdrop.jpg`,
    rating: 8.3,
    voteCount: 5920,
    popularity: 91,
    releaseDate: "2026-05-22",
    genres: ["Aventura", "Mistério", "Drama"],
    genreIds: [12, 9648, 18],
    runtime: 128,
    status: "Lançado",
    tagline: "Algumas descobertas deveriam permanecer enterradas.",
    certification: "14",
    language: "en",
    providers: [119, 350],
    isPopular: true,
    isTrending: true,
  }),

  createMedia({
    id: 103,
    mediaType: "movie",
    title: "Cidade de Vidro",
    originalTitle: "Glass City",
    overview:
      "Em uma cidade onde tudo é monitorado, uma jovem descobre uma região que não aparece em nenhum mapa.",
    poster: `${MOCK_POSTER_BASE}/example-glass-city.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-glass-city-backdrop.jpg`,
    rating: 8.1,
    voteCount: 4310,
    popularity: 84,
    releaseDate: "2026-04-11",
    genres: ["Ficção científica", "Thriller", "Mistério"],
    genreIds: [878, 53, 9648],
    runtime: 119,
    status: "Lançado",
    tagline: "Toda cidade guarda um segredo.",
    certification: "14",
    language: "en",
    providers: [8, 1899],
    isPopular: true,
  }),

  createMedia({
    id: 104,
    mediaType: "movie",
    title: "Além das Estrelas",
    originalTitle: "Beyond the Stars",
    overview:
      "Uma jornada espacial transforma uma missão científica em uma busca por respostas sobre a humanidade.",
    poster: `${MOCK_POSTER_BASE}/example-beyond-stars.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-beyond-stars-backdrop.jpg`,
    rating: 8.5,
    voteCount: 7210,
    popularity: 88,
    releaseDate: "2026-03-27",
    genres: ["Ficção científica", "Drama", "Aventura"],
    genreIds: [878, 18, 12],
    runtime: 136,
    status: "Lançado",
    tagline: "O universo é maior do que imaginávamos.",
    certification: "10",
    language: "en",
    providers: [337, 350],
    isTrending: true,
  }),

  createMedia({
    id: 105,
    mediaType: "movie",
    title: "O Código Perdido",
    originalTitle: "The Lost Code",
    overview:
      "Um código antigo reaparece no presente e coloca pesquisadores no centro de uma conspiração internacional.",
    poster: `${MOCK_POSTER_BASE}/example-lost-code.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-lost-code-backdrop.jpg`,
    rating: 7.9,
    voteCount: 3810,
    popularity: 77,
    releaseDate: "2026-02-14",
    genres: ["Mistério", "Thriller", "Aventura"],
    genreIds: [9648, 53, 12],
    runtime: 121,
    status: "Lançado",
    certification: "12",
    language: "en",
    providers: [119, 531],
  }),

  createMedia({
    id: 106,
    mediaType: "movie",
    title: "Depois da Tempestade",
    originalTitle: "After the Storm",
    overview:
      "Uma família precisa reconstruir sua vida depois de uma grande transformação em sua cidade.",
    poster: `${MOCK_POSTER_BASE}/example-after-storm.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-after-storm-backdrop.jpg`,
    rating: 8.0,
    voteCount: 2940,
    popularity: 69,
    releaseDate: "2026-01-30",
    genres: ["Drama"],
    genreIds: [18],
    runtime: 114,
    status: "Lançado",
    certification: "10",
    language: "pt-BR",
    providers: [307],
  }),

  createMedia({
    id: 107,
    mediaType: "movie",
    title: "Operação Eclipse",
    originalTitle: "Operation Eclipse",
    overview:
      "Uma equipe especializada precisa impedir uma operação que pode provocar uma crise internacional.",
    poster: `${MOCK_POSTER_BASE}/example-operation-eclipse.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-operation-eclipse-backdrop.jpg`,
    rating: 8.2,
    voteCount: 5100,
    popularity: 86,
    releaseDate: "2025-12-12",
    genres: ["Ação", "Thriller", "Crime"],
    genreIds: [28, 53, 80],
    runtime: 127,
    status: "Lançado",
    certification: "14",
    language: "en",
    providers: [8, 119],
    isPopular: true,
  }),

  createMedia({
    id: 108,
    mediaType: "movie",
    title: "O Reino Esquecido",
    originalTitle: "The Forgotten Kingdom",
    overview:
      "Uma antiga lenda desperta e uma nova geração precisa descobrir a verdade escondida por séculos.",
    poster: `${MOCK_POSTER_BASE}/example-forgotten-kingdom.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-forgotten-kingdom-backdrop.jpg`,
    rating: 8.6,
    voteCount: 6730,
    popularity: 93,
    releaseDate: "2025-11-21",
    genres: ["Fantasia", "Aventura", "Drama"],
    genreIds: [14, 12, 18],
    runtime: 149,
    status: "Lançado",
    certification: "12",
    language: "en",
    providers: [337, 1899],
    isTrending: true,
  }),
];

/*
|--------------------------------------------------------------------------
| SERIES
|--------------------------------------------------------------------------
*/

export const SERIES = [
  createMedia({
    id: 201,
    mediaType: "series",
    title: "A Ordem",
    originalTitle: "The Order",
    overview:
      "Uma sociedade secreta atravessa gerações enquanto seus membros tentam impedir que um antigo poder retorne.",
    poster: `${MOCK_POSTER_BASE}/example-the-order.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-the-order-backdrop.jpg`,
    rating: 9.0,
    voteCount: 12400,
    popularity: 99,
    releaseDate: "2026-07-03",
    genres: ["Fantasia", "Drama", "Mistério"],
    genreIds: [14, 18, 9648],
    seasons: 2,
    episodes: 18,
    status: "Em exibição",
    tagline: "Toda era tem seus guardiões.",
    certification: "14",
    language: "en",
    providers: [8],
    isPopular: true,
    isTrending: true,
    featured: true,
  }),

  createMedia({
    id: 202,
    mediaType: "series",
    title: "Horizonte Zero",
    originalTitle: "Zero Horizon",
    overview:
      "Após um evento inexplicável, um pequeno grupo tenta compreender um novo mundo.",
    poster: `${MOCK_POSTER_BASE}/example-zero-horizon.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-zero-horizon-backdrop.jpg`,
    rating: 8.8,
    voteCount: 9820,
    popularity: 94,
    releaseDate: "2026-05-15",
    genres: ["Ficção científica", "Drama", "Mistério"],
    genreIds: [878, 18, 9648],
    seasons: 1,
    episodes: 10,
    status: "Em exibição",
    tagline: "O fim de um mundo pode ser o começo de outro.",
    certification: "14",
    language: "en",
    providers: [119, 350],
    isPopular: true,
    isTrending: true,
  }),

  createMedia({
    id: 203,
    mediaType: "series",
    title: "Arquivo 27",
    originalTitle: "File 27",
    overview:
      "Uma equipe investiga arquivos classificados que revelam conexões entre acontecimentos aparentemente isolados.",
    poster: `${MOCK_POSTER_BASE}/example-file-27.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-file-27-backdrop.jpg`,
    rating: 8.4,
    voteCount: 6530,
    popularity: 82,
    releaseDate: "2026-04-04",
    genres: ["Mistério", "Crime", "Thriller"],
    genreIds: [9648, 80, 53],
    seasons: 3,
    episodes: 24,
    status: "Em exibição",
    certification: "16",
    language: "en",
    providers: [1899],
  }),

  createMedia({
    id: 204,
    mediaType: "series",
    title: "Entre Mundos",
    originalTitle: "Between Worlds",
    overview:
      "Uma série de fantasia sobre pessoas capazes de atravessar fronteiras entre realidades.",
    poster: `${MOCK_POSTER_BASE}/example-between-worlds.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-between-worlds-backdrop.jpg`,
    rating: 8.7,
    voteCount: 8120,
    popularity: 89,
    releaseDate: "2026-02-20",
    genres: ["Fantasia", "Aventura", "Drama"],
    genreIds: [14, 12, 18],
    seasons: 2,
    episodes: 16,
    status: "Em exibição",
    certification: "12",
    language: "en",
    providers: [337],
    isPopular: true,
  }),

  createMedia({
    id: 205,
    mediaType: "series",
    title: "Linha de Fogo",
    originalTitle: "Line of Fire",
    overview:
      "Uma equipe precisa lidar com uma ameaça que cresce a cada episódio.",
    poster: `${MOCK_POSTER_BASE}/example-line-of-fire.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-line-of-fire-backdrop.jpg`,
    rating: 8.1,
    voteCount: 4930,
    popularity: 78,
    releaseDate: "2025-12-05",
    genres: ["Ação", "Crime", "Drama"],
    genreIds: [28, 80, 18],
    seasons: 4,
    episodes: 38,
    status: "Em exibição",
    certification: "16",
    language: "en",
    providers: [8, 119],
  }),

  createMedia({
    id: 206,
    mediaType: "series",
    title: "As Crônicas do Norte",
    originalTitle: "Chronicles of the North",
    overview:
      "Reinos rivais precisam formar uma aliança diante de uma ameaça que ninguém esperava.",
    poster: `${MOCK_POSTER_BASE}/example-chronicles-north.jpg`,
    backdrop: `${MOCK_BACKDROP_BASE}/example-chronicles-north-backdrop.jpg`,
    rating: 8.9,
    voteCount: 11020,
    popularity: 96,
    releaseDate: "2025-10-17",
    genres: ["Fantasia", "Drama", "Aventura"],
    genreIds: [14, 18, 12],
    seasons: 3,
    episodes: 27,
    status: "Em exibição",
    certification: "14",
    language: "en",
    providers: [119, 337],
    isTrending: true,
  }),
];

/*
|--------------------------------------------------------------------------
| FEATURED
|--------------------------------------------------------------------------
*/

export const FEATURED_MEDIA = MOVIES.find(
  (media) => media.featured
) || MOVIES[0];

/*
|--------------------------------------------------------------------------
| DERIVED COLLECTIONS
|--------------------------------------------------------------------------
*/

export const TRENDING = [
  ...MOVIES,
  ...SERIES,
]
  .filter((media) => media.isTrending)
  .sort((a, b) => b.popularity - a.popularity);

export const POPULAR_MOVIES = [...MOVIES]
  .sort((a, b) => {
    return (
      b.popularity - a.popularity ||
      b.rating - a.rating
    );
  });

export const POPULAR_SERIES = [...SERIES]
  .sort((a, b) => {
    return (
      b.popularity - a.popularity ||
      b.rating - a.rating
    );
  });

export const NEW_RELEASES = [
  ...MOVIES,
  ...SERIES,
]
  .filter((media) => media.releaseDate)
  .sort((a, b) => {
    return (
      new Date(b.releaseDate) -
      new Date(a.releaseDate)
    );
  });

export const RECOMMENDATIONS = [
  ...MOVIES,
  ...SERIES,
]
  .sort((a, b) => {
    return b.rating - a.rating;
  })
  .slice(0, 10);

/*
|--------------------------------------------------------------------------
| CONTINUE WATCHING
|--------------------------------------------------------------------------
*/

export const CONTINUE_WATCHING = [
  {
    ...MOVIES[0],
    progress: 62,
    position: 88 * 60,
    duration: 142 * 60,
  },
  {
    ...SERIES[1],
    progress: 37,
    position: 18 * 60,
    duration: 49 * 60,
  },
];

/*
|--------------------------------------------------------------------------
| INITIAL MY LIST
|--------------------------------------------------------------------------
*/

export const INITIAL_MY_LIST = [
  MOVIES[2],
  SERIES[0],
];

/*
|--------------------------------------------------------------------------
| COMPATIBILITY EXPORTS
|--------------------------------------------------------------------------
|
| O App.jsx atual utiliza estes nomes.
| Mantemos os nomes em lowercase para evitar quebra de import.
|
|--------------------------------------------------------------------------
*/

export const initialMovies = [...MOVIES];

export const initialSeries = [...SERIES];

export const initialMyList = [
  ...INITIAL_MY_LIST,
];

export const initialContinueWatching = [
  ...CONTINUE_WATCHING,
];

export const initialRecommendations = [
  ...RECOMMENDATIONS,
];

/*
|--------------------------------------------------------------------------
| CATALOG
|--------------------------------------------------------------------------
*/

export const CATALOG = [
  ...MOVIES,
  ...SERIES,
];

export const HOME_DATA = {
  featured: FEATURED_MEDIA,
  trending: TRENDING,
  popularMovies: POPULAR_MOVIES,
  popularSeries: POPULAR_SERIES,
  newReleases: NEW_RELEASES,
  recommendations: RECOMMENDATIONS,
  continueWatching: CONTINUE_WATCHING,
};

/*
|--------------------------------------------------------------------------
| GETTERS
|--------------------------------------------------------------------------
*/

export function getMovies() {
  return [...MOVIES];
}

export function getSeries() {
  return [...SERIES];
}

export function getCatalog() {
  return [...CATALOG];
}

export function getTrending() {
  return [...TRENDING];
}

export function getPopularMovies() {
  return [...POPULAR_MOVIES];
}

export function getPopularSeries() {
  return [...POPULAR_SERIES];
}

export function getNewReleases() {
  return [...NEW_RELEASES];
}

export function getRecommendations() {
  return [...RECOMMENDATIONS];
}

export function getContinueWatching() {
  return [...CONTINUE_WATCHING];
}

export function getFeaturedMedia(catalog = CATALOG) {
  if (!Array.isArray(catalog)) {
    return FEATURED_MEDIA;
  }

  return (
    catalog.find(
      (media) => media.featured === true
    ) ||
    catalog.find(
      (media) => media.mediaType === "movie"
    ) ||
    catalog[0] ||
    null
  );
}

/*
|--------------------------------------------------------------------------
| MEDIA LOOKUP
|--------------------------------------------------------------------------
*/

export function getMediaById(id, mediaType = null) {
  const numericId = Number(id);

  return (
    CATALOG.find((media) => {
      const sameId =
        media.id === id ||
        media.id === numericId;

      if (!sameId) {
        return false;
      }

      if (!mediaType) {
        return true;
      }

      return (
        media.mediaType ===
        normalizeMediaType(mediaType)
      );
    }) || null
  );
}

/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
*/

export function searchMedia(
  query,
  catalog = CATALOG
) {
  const value = String(query || "")
    .trim()
    .toLowerCase();

  if (!value) {
    return [...catalog];
  }

  return catalog.filter((media) => {
    const title = String(
      media.title || ""
    ).toLowerCase();

    const originalTitle = String(
      media.originalTitle || ""
    ).toLowerCase();

    const overview = String(
      media.overview || ""
    ).toLowerCase();

    const genres = safeArray(
      media.genres
    )
      .join(" ")
      .toLowerCase();

    return (
      title.includes(value) ||
      originalTitle.includes(value) ||
      overview.includes(value) ||
      genres.includes(value)
    );
  });
}

export function searchMovies(
  query
) {
  return searchMedia(query, MOVIES);
}

export function searchSeries(
  query
) {
  return searchMedia(query, SERIES);
}

/*
|--------------------------------------------------------------------------
| GENRE HELPERS
|--------------------------------------------------------------------------
*/

export function getGenreById(id) {
  const numericId = Number(id);

  return (
    GENRES.find(
      (genre) => genre.id === numericId
    ) || null
  );
}

export function getGenreBySlug(slug) {
  return (
    GENRES.find(
      (genre) => genre.slug === slug
    ) || null
  );
}

export function getMediaByGenre(
  genreId,
  catalog = CATALOG
) {
  const numericGenreId = Number(
    genreId
  );

  return catalog.filter((media) => {
    return (
      safeArray(media.genreIds).includes(
        numericGenreId
      ) ||
      safeArray(media.genres).some(
        (genre) => {
          const normalizedGenre =
            String(genre).toLowerCase();

          const target =
            getGenreById(numericGenreId);

          return (
            target &&
            normalizedGenre ===
              target.name.toLowerCase()
          );
        }
      )
    );
  });
}

/*
|--------------------------------------------------------------------------
| MEDIA TYPE HELPERS
|--------------------------------------------------------------------------
*/

export function isMovie(media) {
  return (
    Boolean(media) &&
    normalizeMediaType(
      media.mediaType
    ) === MEDIA_TYPES.MOVIE
  );
}

export function isSeries(media) {
  return (
    Boolean(media) &&
    normalizeMediaType(
      media.mediaType
    ) === MEDIA_TYPES.SERIES
  );
}

/*
|--------------------------------------------------------------------------
| PROVIDER HELPERS
|--------------------------------------------------------------------------
*/

export function getProviderById(id) {
  const numericId = Number(id);

  return (
    PROVIDERS.find(
      (provider) =>
        provider.id === numericId
    ) || null
  );
}

export function getProvidersForMedia(
  media
) {
  if (!media) {
    return [];
  }

  return safeArray(media.providers)
    .map((provider) => {
      if (
        typeof provider === "object"
      ) {
        return provider;
      }

      return getProviderById(provider);
    })
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| TMDB NORMALIZATION
|--------------------------------------------------------------------------
|
| O frontend não precisa conhecer a estrutura
| original retornada pela API do TMDB.
|
|--------------------------------------------------------------------------
*/

export function normalizeTMDBMedia(
  media,
  forcedMediaType = null
) {
  if (!media) {
    return null;
  }

  const mediaType = forcedMediaType
    ? normalizeMediaType(
        forcedMediaType
      )
    : media.media_type
      ? normalizeMediaType(
          media.media_type
        )
      : media.first_air_date ||
          media.firstAirDate
        ? MEDIA_TYPES.SERIES
        : MEDIA_TYPES.MOVIE;

  const title =
    media.title ||
    media.name ||
    "Título desconhecido";

  const originalTitle =
    media.original_title ||
    media.original_name ||
    title;

  const releaseDate =
    media.release_date ||
    media.first_air_date ||
    null;

  return createMedia({
    id: media.id,

    mediaType,

    title,

    originalTitle,

    overview:
      media.overview || "",

    poster:
      media.poster_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
        : null,

    backdrop:
      media.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path}`
        : null,

    rating:
      media.vote_average,

    voteCount:
      media.vote_count,

    popularity:
      media.popularity,

    releaseDate,

    genres:
      media.genres
        ? media.genres.map(
            (genre) =>
              genre.name
          )
        : [],

    genreIds:
      media.genre_ids ||
      media.genreIds ||
      [],

    runtime:
      media.runtime ||
      media.episode_run_time?.[0] ||
      null,

    seasons:
      media.number_of_seasons ||
      null,

    episodes:
      media.number_of_episodes ||
      null,

    status:
      media.status ||
      null,

    tagline:
      media.tagline ||
      "",

    language:
      media.original_language ||
      null,

    certification:
      media.certification ||
      null,
  });
}

export function normalizeTMDBList(
  response,
  forcedMediaType = null
) {
  const results = Array.isArray(
    response
  )
    ? response
    : response?.results;

  if (!Array.isArray(results)) {
    return [];
  }

  return results
    .map((media) =>
      normalizeTMDBMedia(
        media,
        forcedMediaType
      )
    )
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| MERGE MEDIA
|--------------------------------------------------------------------------
*/

export function mergeMedia(
  currentMedia,
  incomingMedia
) {
  if (!incomingMedia) {
    return currentMedia;
  }

  if (!currentMedia) {
    return normalizeMedia(
      incomingMedia
    );
  }

  return normalizeMedia({
    ...currentMedia,
    ...incomingMedia,

    genres:
      incomingMedia.genres?.length
        ? incomingMedia.genres
        : currentMedia.genres,

    genreIds:
      incomingMedia.genreIds?.length
        ? incomingMedia.genreIds
        : currentMedia.genreIds,

    providers:
      incomingMedia.providers?.length
        ? incomingMedia.providers
        : currentMedia.providers,

    cast:
      incomingMedia.cast?.length
        ? incomingMedia.cast
        : currentMedia.cast,

    crew:
      incomingMedia.crew?.length
        ? incomingMedia.crew
        : currentMedia.crew,
  });
}

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

const VortexData = {
  MEDIA_TYPES,

  GENRES,
  PROVIDERS,

  MOVIES,
  SERIES,

  initialMovies,
  initialSeries,
  initialMyList,
  initialContinueWatching,
  initialRecommendations,

  FEATURED_MEDIA,

  TRENDING,
  POPULAR_MOVIES,
  POPULAR_SERIES,
  NEW_RELEASES,
  RECOMMENDATIONS,
  CONTINUE_WATCHING,
  INITIAL_MY_LIST,

  CATALOG,
  HOME_DATA,

  createMedia,
  normalizeMedia,

  getMovies,
  getSeries,
  getCatalog,
  getTrending,
  getPopularMovies,
  getPopularSeries,
  getNewReleases,
  getRecommendations,
  getContinueWatching,
  getFeaturedMedia,

  getMediaById,

  searchMedia,
  searchMovies,
  searchSeries,

  getGenreById,
  getGenreBySlug,
  getMediaByGenre,

  isMovie,
  isSeries,

  getProviderById,
  getProvidersForMedia,

  normalizeTMDBMedia,
  normalizeTMDBList,
  mergeMedia,
};

export default VortexData;