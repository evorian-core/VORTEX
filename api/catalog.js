const TMDB_BASE = "https://api.themoviedb.org/3";

function sendError(res, status, message) {
  res.status(status).json({
    ok: false,
    error: message,
  });
}

function normalizeMediaType(type) {
  if (type === "series" || type === "tv") {
    return "tv";
  }

  return "movie";
}

function normalizeResults(results = []) {
  return results.map((item) => {
    const mediaType =
      item.media_type ||
      (item.first_air_date !== undefined ? "tv" : "movie");

    return {
      ...item,
      media_type: mediaType === "tv" ? "series" : mediaType,
    };
  });
}

async function tmdbRequest(token, path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data?.status_message || "TMDB request failed."
    );

    error.status = response.status;
    throw error;
  }

  return data;
}

export default async function handler(req, res) {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

  if (!token) {
    return sendError(
      res,
      503,
      "TMDB backend credential is not configured."
    );
  }

  const query = req.query || {};

  const type = query.type || "movie";
  const page = Math.max(1, Number(query.page || 1));
  const language = query.language || "pt-BR";
  const timeWindow =
    query.timeWindow === "day" ? "day" : "week";

  try {
    /*
     * ---------------------------------------------------------
     * TRENDING
     * /api/catalog?type=movie
     * /api/catalog?type=series
     * /api/catalog?type=all
     * ---------------------------------------------------------
     */

    if (type === "movie" || type === "series" || type === "tv") {
      const mediaType = normalizeMediaType(type);

      const data = await tmdbRequest(
        token,
        `/trending/${mediaType}/${timeWindow}`,
        {
          language,
          page,
        }
      );

      return res.status(200).json({
        ok: true,
        source: "tmdb",
        type: mediaType === "tv" ? "series" : "movie",
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
        results: normalizeResults(data.results),
      });
    }

    if (type === "all") {
      const data = await tmdbRequest(
        token,
        `/trending/all/${timeWindow}`,
        {
          language,
          page,
        }
      );

      return res.status(200).json({
        ok: true,
        source: "tmdb",
        type: "all",
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
        results: normalizeResults(data.results),
      });
    }

    /*
     * ---------------------------------------------------------
     * SEARCH
     *
     * /api/catalog?type=search&q=batman
     * ---------------------------------------------------------
     */

    if (type === "search") {
      const searchQuery = String(query.q || "").trim();

      if (!searchQuery) {
        return sendError(
          res,
          400,
          "Search query is required."
        );
      }

      const data = await tmdbRequest(
        token,
        "/search/multi",
        {
          query: searchQuery,
          language,
          page,
          include_adult: false,
        }
      );

      return res.status(200).json({
        ok: true,
        source: "tmdb",
        type: "search",
        query: searchQuery,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
        results: normalizeResults(data.results),
      });
    }

    /*
     * ---------------------------------------------------------
     * DETAILS
     *
     * /api/catalog?type=details&mediaType=movie&id=123
     *
     * /api/catalog?type=details&mediaType=series&id=123
     * ---------------------------------------------------------
     */

    if (type === "details") {
      const id = Number(query.id);

      if (!Number.isInteger(id) || id <= 0) {
        return sendError(
          res,
          400,
          "A valid TMDB id is required."
        );
      }

      const mediaType = normalizeMediaType(
        query.mediaType || "movie"
      );

      const data = await tmdbRequest(
        token,
        `/${mediaType}/${id}`,
        {
          language,
          append_to_response:
            "videos,credits,images,recommendations,similar",
          include_image_language: "pt-BR,en,null",
        }
      );

      return res.status(200).json({
        ok: true,
        source: "tmdb",
        type: mediaType === "tv" ? "series" : "movie",
        result: {
          ...data,
          media_type:
            mediaType === "tv" ? "series" : "movie",
        },
      });
    }

    return sendError(
      res,
      400,
      `Unsupported catalog type: ${type}`
    );
  } catch (error) {
    console.error("TMDB catalog error:", error);

    return sendError(
      res,
      Number(error.status) || 500,
      error.message || "Catalog provider request failed."
    );
  }
}