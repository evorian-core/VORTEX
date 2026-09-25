/*
 * VORTEX — Service Layer
 * EVORIAN / OMNIA
 *
 * Frontend never receives TMDB secrets.
 * TMDB access happens through the VORTEX BFF (/api/catalog),
 * which owns credentials and normalizes provider responses.
 */

const API_BASE = (
  import.meta.env.VITE_VORTEX_API_BASE || "/api"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `VORTEX API ${response.status}: ${response.statusText}`
    );
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/* TMDB NORMALIZATION                                                         */
/* -------------------------------------------------------------------------- */

export function normalizeTMDBMedia(item, mediaType = item?.media_type) {
  if (!item) return null;

  const resolvedType =
    mediaType === "tv" || mediaType === "series"
      ? "series"
      : "movie";

  return {
    id: String(item.id),
    tmdb_id: item.id,

    mediaType: resolvedType,
    media_type: resolvedType,

    title:
      item.title ||
      item.name ||
      "Sem título",

    original_title:
      item.original_title ||
      item.original_name ||
      "",

    overview: item.overview || "",

    poster_path: item.poster_path || null,
    backdrop_path: item.backdrop_path || null,

    rating: Number(item.vote_average || 0),

    release_date:
      item.release_date ||
      item.first_air_date ||
      "",

    genres:
      item.genres ||
      item.genre_ids ||
      [],

    original_language:
      item.original_language ||
      "",

    origin_country:
      item.origin_country ||
      item.production_countries?.map(
        (country) => country.iso_3166_1
      ) ||
      [],

    duration:
      item.runtime ||
      item.episode_run_time?.[0] ||
      0,

    certification:
      item.certification ||
      "",

    director:
      item.director ||
      "",

    cast:
      item.cast ||
      item.credits?.cast ||
      [],

    streaming_sources:
      item.streaming_sources ||
      [],

    /* Useful TMDB metadata */
    popularity:
      Number(item.popularity || 0),

    vote_count:
      Number(item.vote_count || 0),

    status:
      item.status ||
      "",

    tagline:
      item.tagline ||
      "",

    homepage:
      item.homepage ||
      "",

    videos:
      item.videos ||
      null,

    credits:
      item.credits ||
      null,

    images:
      item.images ||
      null,

    recommendations:
      item.recommendations ||
      null,

    similar:
      item.similar ||
      null,

    seasons:
      item.seasons ||
      [],

    number_of_seasons:
      item.number_of_seasons ||
      0,

    number_of_episodes:
      item.number_of_episodes ||
      0,

    ...item,
  };
}

export function normalizeTMDBList(items = [], mediaType) {
  return items
    .map((item) =>
      normalizeTMDBMedia(item, mediaType)
    )
    .filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/* TMDB CATALOG                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Trending movies
 *
 * /api/catalog?type=movie
 */
export async function getTrendingMovies({
  page = 1,
  timeWindow = "week",
} = {}) {
  const params = new URLSearchParams({
    type: "movie",
    page: String(page),
    timeWindow,
  });

  const data = await request(
    `/catalog?${params.toString()}`
  );

  return {
    ...data,
    results: normalizeTMDBList(
      data.results,
      "movie"
    ),
  };
}

/**
 * Trending series
 *
 * /api/catalog?type=series
 */
export async function getTrendingSeries({
  page = 1,
  timeWindow = "week",
} = {}) {
  const params = new URLSearchParams({
    type: "series",
    page: String(page),
    timeWindow,
  });

  const data = await request(
    `/catalog?${params.toString()}`
  );

  return {
    ...data,
    results: normalizeTMDBList(
      data.results,
      "series"
    ),
  };
}

/**
 * Trending all
 *
 * /api/catalog?type=all
 */
export async function getTrendingAll({
  page = 1,
  timeWindow = "week",
} = {}) {
  const params = new URLSearchParams({
    type: "all",
    page: String(page),
    timeWindow,
  });

  const data = await request(
    `/catalog?${params.toString()}`
  );

  return {
    ...data,
    results: normalizeTMDBList(
      data.results
    ),
  };
}

/**
 * Search movies, series and people.
 *
 * /api/catalog?type=search&q=...
 */
export async function searchTMDB(
  query,
  {
    page = 1,
  } = {}
) {
  const cleanQuery = String(query || "").trim();

  if (!cleanQuery) {
    return {
      ok: true,
      results: [],
      total_results: 0,
      total_pages: 0,
      page: 1,
    };
  }

  const params = new URLSearchParams({
    type: "search",
    q: cleanQuery,
    page: String(page),
  });

  const data = await request(
    `/catalog?${params.toString()}`
  );

  return {
    ...data,
    results: normalizeTMDBList(
      data.results
    ),
  };
}

/**
 * Movie details.
 *
 * /api/catalog?type=details&mediaType=movie&id=...
 */
export async function getTMDBMovie(id) {
  const params = new URLSearchParams({
    type: "details",
    mediaType: "movie",
    id: String(id),
  });

  const data = await request(
    `/catalog?${params.toString()}`
  );

  return {
    ...data,
    result: normalizeTMDBMedia(
      data.result,
      "movie"
    ),
  };
}

/**
 * Series details.
 *
 * /api/catalog?type=details&mediaType=series&id=...
 */
export async function getTMDBSeries(id) {
  const params = new URLSearchParams({
    type: "details",
    mediaType: "series",
    id: String(id),
  });

  const data = await request(
    `/catalog?${params.toString()}`
  );

  return {
    ...data,
    result: normalizeTMDBMedia(
      data.result,
      "series"
    ),
  };
}

/* -------------------------------------------------------------------------- */
/* LEGACY / INTERNAL VORTEX SERVICES                                          */
/* -------------------------------------------------------------------------- */

/*
 * These remain available so existing VORTEX pages do not immediately break.
 * They can later be redirected to dedicated BFF endpoints as the backend
 * grows.
 */

export async function getHome() {
  return request("/home");
}

export async function getMovies(params = "") {
  return request(
    `/movies${params ? `?${params}` : ""}`
  );
}

export async function getSeries(params = "") {
  return request(
    `/series${params ? `?${params}` : ""}`
  );
}

export async function getMovie(id) {
  return request(
    `/movies/${encodeURIComponent(id)}`
  );
}

export async function getSeriesDetails(id) {
  return request(
    `/series/${encodeURIComponent(id)}`
  );
}

export async function searchCatalog(
  query,
  params = ""
) {
  const search = new URLSearchParams({
    q: query,
    ...(params
      ? Object.fromEntries(
          new URLSearchParams(params)
        )
      : {}),
  });

  return request(
    `/search?${search.toString()}`
  );
}

export async function getGenres() {
  return request("/genres");
}

export async function getProviders() {
  return request("/providers");
}

export async function getHealth() {
  return request("/health");
}

export async function getConfig() {
  return request("/config");
}

/* -------------------------------------------------------------------------- */
/* IMAGE HELPERS                                                              */
/* -------------------------------------------------------------------------- */

const TMDB_IMAGE_BASE =
  "https://image.tmdb.org/t/p";

export function getTMDBImageUrl(
  path,
  size = "w500"
) {
  if (!path) return null;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getPosterUrl(path) {
  return getTMDBImageUrl(path, "w500");
}

export function getBackdropUrl(path) {
  return getTMDBImageUrl(path, "w1280");
}

export function getProfileUrl(path) {
  return getTMDBImageUrl(path, "w185");
}

/* -------------------------------------------------------------------------- */
/* SERVICE OBJECT                                                             */
/* -------------------------------------------------------------------------- */

export const vortexServices = {
  /* TMDB */
  getTrendingMovies,
  getTrendingSeries,
  getTrendingAll,
  searchTMDB,
  getTMDBMovie,
  getTMDBSeries,

  /* Existing VORTEX API */
  getHome,
  getMovies,
  getSeries,
  getMovie,
  getSeriesDetails,
  searchCatalog,
  getGenres,
  getProviders,
  getHealth,
  getConfig,

  /* Images */
  getTMDBImageUrl,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
};

export default vortexServices;