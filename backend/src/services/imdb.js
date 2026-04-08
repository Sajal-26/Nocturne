const IMDB_GQL_URL = "https://caching.graphql.imdb.com/";
const TMDB_BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNDc3NmUyMmY3OGQ3ZjY2MGJhZDFmNWFiNDRhZGI2ZSIsIm5iZiI6MTczMzEzOTQ1NS44NTc5OTk4LCJzdWIiOiI2NzRkOWJmZjc1Y2QwMTcwNmE3Y2U0YTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Kx_uKM8l5kDMjkKJYrklxWVg7DwLO93EvnksuP5kgCw";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const searchCompanies = async (query) => {
    if (!query) return [];
    try {
        const url = `https://api.themoviedb.org/3/search/company?query=${encodeURIComponent(query)}&page=1`;
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
                'accept': 'application/json'
            }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return (data.results || []).slice(0, 5).map((c, idx) => ({
            rank: idx + 1,
            imdb_id: `co_tmdb_${c.id}`,
            title: c.name,
            year: null,
            rating: null,
            rating_count: 0,
            rating_count_formatted: 'COMPANY',
            certificate: 'COMPANY',
            poster: c.logo_path ? `${TMDB_IMAGE_BASE}${c.logo_path}` : null,
            duration: c.origin_country || 'Production Company',
            titleType: 'company',
            description: `Production Company - ${c.origin_country || 'International'}`
        }));
    } catch (err) {
        console.error('[TMDb Company Search Error]', err.message);
        return [];
    }
};

const enrichWithTMDb = async (imdbId) => {
    if (!imdbId) return {};
    try {
        const findUrl = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`;
        const findRes = await fetch(findUrl, {
            headers: { 'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`, 'accept': 'application/json' }
        });
        if (!findRes.ok) {
            return {};
        }
        const findData = await findRes.json();
        const movieResult = findData.movie_results?.[0];
        const tvResult = findData.tv_results?.[0];
        const tmdbEntry = movieResult || tvResult;
        if (!tmdbEntry) {
            return {};
        }
        const mediaType = movieResult ? 'movie' : 'tv';
        const tmdbId = tmdbEntry.id;
        const imagesUrl = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/images?include_image_language=en,null`;
        const imagesRes = await fetch(imagesUrl, {
            headers: { 'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`, 'accept': 'application/json' }
        });
        if (!imagesRes.ok) {
            return {};
        }
        const images = await imagesRes.json();
        const backdropPath = images.backdrops?.[0]?.file_path;
        const backdrop = backdropPath
            ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
            : null;
        const logoEntry = (images.logos || []).find(l => l.iso_639_1 === 'en') || images.logos?.[0];
        const logo = logoEntry?.file_path
            ? `https://image.tmdb.org/t/p/w500${logoEntry.file_path}`
            : null;
        

        return { backdrop, logo };
    } catch (e) {
        return {};
    }
};

export const calculateSimilarity = (s1, s2) => {
    s1 = (s1 || "").toLowerCase().trim();
    s2 = (s2 || "").toLowerCase().trim();
    if (s1 === s2) return 1.0;
    if (s2.includes(s1) || s1.includes(s2)) {
        if (s2.startsWith(s1) || s1.startsWith(s2)) return 0.90;
        const ratio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
        if (ratio >= 0.4) return Math.max(0.85, ratio);
    }
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    const maxLength = Math.max(s1.length, s2.length);
    if (maxLength === 0) return 1.0;
    return (maxLength - costs[s2.length]) / maxLength;
};

const HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
    "Origin": "https://www.imdb.com",
    "Referer": "https://www.imdb.com/chart/moviemeter/",
    "Accept": "application/json"
};

const originalFetch = globalThis.fetch;
const GLOBAL_CACHE = new Map();
const CACHE_TTL = 6 * 3600 * 1000;

const PROXY_GENERATORS = [
    (url) => url,
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

let lastWorkingProxyIndex = 0;

const fetchWithProxy = async (url, options = {}) => {
    let lastError;
    const order = [
        lastWorkingProxyIndex,
        ...Array.from({ length: PROXY_GENERATORS.length }, (_, i) => i).filter(i => i !== lastWorkingProxyIndex)
    ];
    for (const i of order) {
        const isDirect = i === 0;
        const proxyUrl = PROXY_GENERATORS[i](url);
        const timeout = isDirect ? 4000 : 8000;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await originalFetch(proxyUrl, { ...options, signal: controller.signal });
            clearTimeout(timer);
            if (res.ok) {
                if (i !== lastWorkingProxyIndex) {
                    lastWorkingProxyIndex = i;
                }
                return res;
            }
            if (res.status === 401 || res.status === 403 || res.status === 404) return res;
        } catch (err) {
            clearTimeout(timer);
            lastError = err;
        }
    }
    throw lastError || new Error('[PROXY] All proxy attempts exhausted.');
};

const fetch = async (url, options) => {
    const bodyStr = options?.body || "";
    const cacheKey = `${url}|${bodyStr}`;
    const hit = GLOBAL_CACHE.get(cacheKey);
    if (hit && hit.expiry > Date.now()) {
        return { ok: true, status: 200, json: async () => hit.data };
    }
    const method = (options?.method || 'GET').toUpperCase();
    const isProxyCandidate = url.includes('imdb') || url.includes('themoviedb.org');
    const shouldProxy = isProxyCandidate && method === 'GET';
    try {
        const response = shouldProxy ? await fetchWithProxy(url, options) : await originalFetch(url, options);
        if (response.ok) {
            const responseClone = response.clone();
            const data = await responseClone.json();
            if (data && !data.errors) {
                GLOBAL_CACHE.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL });
            }
        }

        return response;
    } catch (err) {
        throw err;
    }
};

const normalizeCertificate = (cert) => {
    if (!cert || cert === 'Not Rated' || cert === 'Unrated' || cert === 'NOT RATED') return "NR";
    const mapping = {
        'Approved': 'U',
        'Passed': 'U',
        'TV-G': 'U',
        'G': 'U',
        'TV-PG': 'UA',
        'PG': 'UA',
        'TV-14': 'UA',
        'PG-13': 'UA',
        'NC-17': 'A',
        'X': 'A',
        'Adult': 'A',
        'Restricted': 'A'
    };
    return mapping[cert] || cert;
};

const formatDuration = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const formatVotes = (n) => {
    if (!n) return null;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
};

const IMDB_GENRE_ID_MAP = {
    action: 'Action',
    adventure: 'Adventure',
    animation: 'Animation',
    biography: 'Biography',
    comedy: 'Comedy',
    crime: 'Crime',
    documentary: 'Documentary',
    drama: 'Drama',
    family: 'Family',
    fantasy: 'Fantasy',
    'film-noir': 'Film-Noir',
    filmnoir: 'Film-Noir',
    'game-show': 'Game-Show',
    gameshow: 'Game-Show',
    history: 'History',
    horror: 'Horror',
    music: 'Music',
    musical: 'Musical',
    mystery: 'Mystery',
    news: 'News',
    'reality-tv': 'Reality-TV',
    realitytv: 'Reality-TV',
    romance: 'Romance',
    'sci-fi': 'Sci-Fi',
    scifi: 'Sci-Fi',
    short: 'Short',
    sport: 'Sport',
    'talk-show': 'Talk-Show',
    talkshow: 'Talk-Show',
    thriller: 'Thriller',
    war: 'War',
    western: 'Western'
};

const normalizeImdbGenreIds = (genres = []) =>
    genres
        .map((genre) => {
            if (!genre) return null;
            const trimmed = String(genre).trim();
            const key = trimmed.toLowerCase().replace(/[\s_]+/g, '-');
            return IMDB_GENRE_ID_MAP[key] || trimmed;
        })
        .filter(Boolean);

const MOVIE_FIELDS = `
    id
    titleText { text }
    releaseYear { year }
    ratingsSummary { aggregateRating voteCount }
    primaryImage { url }
    runtime { seconds }
    certificate { rating }
    titleType { text id }
    genres { genres { text } }
`;

const PERSON_FIELDS = `
    id
    nameText { text }
    primaryImage { url }
    birthDate { date }
    deathDate { date }
    primaryProfession { category { text } }
    knownForTitles {
        edges {
            node {
                titleText { text }
                id
            }
        }
    }
`;

export const getBackdropsBatch = async (ids) => {
    if (!ids || ids.length === 0) return [];
    const richBackdrops = await Promise.all(ids.map(async (id) => {
        const query = `
        query {
          title(id: "${id}") {
            images(first: 5, filter: { imageType: STILL_FRAME }) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
        `;
        try {
            const response = await fetch(IMDB_GQL_URL, {
                method: "POST",
                headers: HEADERS,
                body: JSON.stringify({ query })
            });
            const json = await response.json();
            const firstStill = json.data?.title?.images?.edges?.[0]?.node?.url;
            return { imdb_id: id, backdrop: firstStill || null };
        } catch (e) { return null; }
    }));
    return richBackdrops.filter(Boolean);
};

export const getTrendingMovies = async (enrich = false) => {
    const query = `
    query {
      chartTitles(first: 100, chart: { chartType: MOST_POPULAR_MOVIES }) {
        edges {
          node {
            id
            titleText { text }
            releaseYear { year }
            ratingsSummary { aggregateRating voteCount }
            primaryImage { url }
            runtime { seconds }
            certificate { rating }
            titleType { text id }
            genres { genres { text } }
            countriesOfOrigin { countries { id text } }
            spokenLanguages { spokenLanguages { id text } }
            plot { plotText { plainText } }
          }
        }
      }
    }
    `;
    try {
        const response = await fetch(IMDB_GQL_URL, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const json = await response.json();
        if (!json.data) return [];
        const movies = json.data.chartTitles.edges.map((item, index) => {
            const node = item.node;
            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                rating_count: node.ratingsSummary?.voteCount || 0,
                rating_count_formatted: formatVotes(node.ratingsSummary?.voteCount || 0),
                certificate: normalizeCertificate(node.certificate?.rating),
                poster: node.primaryImage?.url || null,
                backdrop: null,
                logo: null,
                duration: formatDuration(node.runtime?.seconds),
                titleType: node.id.startsWith('nm') ? 'person' : (node.id.startsWith('co') ? 'company' : (node.titleType?.id || 'movie')),
                genres: node.genres?.genres?.map(g => g.text) || [],
                countries: node.countriesOfOrigin?.countries?.map(c => c.id) || [],
                languages: node.spokenLanguages?.spokenLanguages?.map(l => l.id) || [],
                description: node.plot?.plotText?.plainText || null
            };
        });
        if (!enrich) return movies;
        
        {/* Force fresh data for enrichment to avoid cached nulls */}
        const bodyStr = JSON.stringify({ query });
        const cacheKey = `${IMDB_GQL_URL}|${bodyStr}`;
        GLOBAL_CACHE.delete(cacheKey);

        const heroMovies = movies.slice(0, 5);
        const enrichments = await Promise.all(heroMovies.map(m => enrichWithTMDb(m.imdb_id)));
        
        const finalResults = movies.map((movie, idx) =>
            idx < 5 ? { ...movie, ...enrichments[idx] } : movie
        );


        return finalResults;
    } catch (err) {
        return [];
    }
};

export const getTitlesBatch = async (ids) => {
    if (!ids || ids.length === 0) return [];
    const queries = ids.map((id, index) => {
        return `t${index}: title(id: "${id}") {
            id
            titleText { text }
            releaseYear { year }
            ratingsSummary { aggregateRating voteCount }
            primaryImage { url }
            runtime { seconds }
            certificate { rating }
            isAdult
            titleType { text id }
            genres { genres { text } }
            countriesOfOrigin { countries { id text } }
            spokenLanguages { spokenLanguages { id text } }
            plot { plotText { plainText } }
        }`;
    }).join('\n');
    const query = `query {\n${queries}\n}`;
    try {
        const response = await fetch(IMDB_GQL_URL, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({ query })
        });
        const json = await response.json();
        if (!json.data) return [];
        return Object.values(json.data).filter(node => node !== null).map((node, index) => ({
            rank: index + 1,
            imdb_id: node.id,
            title: node.titleText?.text || "Unknown",
            year: node.releaseYear?.year || null,
            rating: node.ratingsSummary?.aggregateRating || null,
            rating_count: node.ratingsSummary?.voteCount || 0,
            rating_count_formatted: formatVotes(node.ratingsSummary?.voteCount || 0),
            certificate: normalizeCertificate(node.certificate?.rating),
            isAdult: node.isAdult || false,
            poster: node.primaryImage?.url || null,
            duration: formatDuration(node.runtime?.seconds),
            runtime_minutes: node.runtime?.seconds ? Math.floor(node.runtime.seconds / 60) : null,
            titleType: node.id.startsWith('nm') ? 'person' : (node.id.startsWith('co') ? 'company' : (node.titleType?.id || 'movie')),
            genres: node.genres?.genres?.map(g => g.text) || [],
            countries: node.countriesOfOrigin?.countries?.map(c => c.id) || [],
            languages: node.spokenLanguages?.spokenLanguages?.map(l => l.id) || [],
            description: node.plot?.plotText?.plainText || null
        }));
    } catch (err) { return []; }
};

export const getTrendingTVShows = async (enrich = false) => {
    const query = `
    query {
      chartTitles(first: 100, chart: { chartType: MOST_POPULAR_TV_SHOWS }) {
        edges {
          node {
            id
            titleText { text }
            releaseYear { year }
            ratingsSummary { aggregateRating voteCount }
            certificate { rating }
            titleType { text }
            runtime { seconds }
            primaryImage { url }
            genres { genres { text } }
            countriesOfOrigin { countries { id text } }
            spokenLanguages { spokenLanguages { id text } }
            plot { plotText { plainText } }
          }
        }
      }
    }
    `;
    try {
        const response = await fetch(IMDB_GQL_URL, {
            method: "POST",
            headers: { ...HEADERS, Referer: "https://www.imdb.com/chart/tvmeter/" },
            body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const json = await response.json();
        if (!json.data) return [];
        const tvShows = json.data.chartTitles.edges.map((item, index) => {
            const node = item.node;
            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                rating_count: node.ratingsSummary?.voteCount || 0,
                rating_count_formatted: formatVotes(node.ratingsSummary?.voteCount || 0),
                certificate: normalizeCertificate(node.certificate?.rating),
                poster: node.primaryImage?.url || null,
                backdrop: null,
                logo: null,
                duration: formatDuration(node.runtime?.seconds) || node.titleType?.text || "TV Series",
                titleType: node.id.startsWith('nm') ? 'person' : (node.id.startsWith('co') ? 'company' : (node.titleType?.id || 'tvSeries')),
                genres: node.genres?.genres?.map(g => g.text) || [],
                countries: node.countriesOfOrigin?.countries?.map(c => c.id) || [],
                languages: node.spokenLanguages?.spokenLanguages?.map(l => l.id) || [],
                description: node.plot?.plotText?.plainText || null
            };
        });
        if (!enrich) return tvShows;

        const bodyStr = JSON.stringify({ query });
        const cacheKey = `${IMDB_GQL_URL}|${bodyStr}`;
        GLOBAL_CACHE.delete(cacheKey);

        const heroShows = tvShows.slice(0, 5);
        const enrichments = await Promise.all(heroShows.map(s => enrichWithTMDb(s.imdb_id)));
        
        const finalResults = tvShows.map((show, idx) =>
            idx < 5 ? { ...show, ...enrichments[idx] } : show
        );


        return finalResults;
    } catch (err) {
        return [];
    }
};

export const getTopRatedMovies = async () => {
    const query = `
    query {
      chartTitles(first: 100, chart: { chartType: TOP_RATED_MOVIES }) {
        edges {
          node {
            id
            titleText { text }
            releaseYear { year }
            ratingsSummary { aggregateRating voteCount }
            certificate { rating }
            runtime { seconds }
            primaryImage { url }
          }
        }
      }
    }
    `;
    try {
        const response = await fetch(IMDB_GQL_URL, {
            method: "POST",
            headers: { ...HEADERS, Referer: "https://www.imdb.com/chart/top/" },
            body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const json = await response.json();
        if (!json.data) return [];
        return json.data.chartTitles.edges.map((item, index) => {
            const node = item.node;
            const seconds = node.runtime?.seconds || null;
            const voteCount = node.ratingsSummary?.voteCount || 0;
            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                rating_count: voteCount,
                rating_count_formatted: formatVotes(voteCount),
                certificate: normalizeCertificate(node.certificate?.rating),
                poster: node.primaryImage?.url || null,
                duration: formatDuration(seconds)
            };
        });
    } catch (err) {
        return [];
    }
};

export const getTopRatedTVShows = async () => {
    const query = `
    query {
      chartTitles(first: 250, chart: { chartType: TOP_RATED_TV_SHOWS }) {
        edges {
          node {
            id
            titleText { text }
            releaseYear { year }
            ratingsSummary { aggregateRating voteCount }
            certificate { rating }
            runtime { seconds }
            primaryImage { url }
          }
        }
      }
    }
    `;
    try {
        const response = await fetch(IMDB_GQL_URL, {
            method: "POST",
            headers: { ...HEADERS, Referer: "https://www.imdb.com/chart/toptv/" },
            body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const json = await response.json();
        if (!json.data) return [];
        return json.data.chartTitles.edges.map((item, index) => {
            const node = item.node;
            const voteCount = node.ratingsSummary?.voteCount || 0;
            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                rating_count: voteCount,
                rating_count_formatted: formatVotes(voteCount),
                certificate: normalizeCertificate(node.certificate?.rating),
                poster: node.primaryImage?.url || null,
                duration: "TV Series"
            };
        });
    } catch (err) {
        return [];
    }
};

export const getTopEnglishMovies = async () => {
    const query = `
    query {
      chartTitles(first: 250, chart: { chartType: TOP_RATED_ENGLISH_MOVIES }) {
        edges {
          node {
            id
            titleText { text }
            releaseYear { year }
            ratingsSummary { aggregateRating voteCount }
            certificate { rating }
            runtime { seconds }
            primaryImage { url }
          }
        }
      }
    }
    `;
    try {
        const response = await fetch(IMDB_GQL_URL, {
            method: "POST",
            headers: { ...HEADERS, Referer: "https://www.imdb.com/chart/top-english-movies/" },
            body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const json = await response.json();
        if (!json.data) return [];
        return json.data.chartTitles.edges.map((item, index) => {
            const node = item.node;
            const voteCount = node.ratingsSummary?.voteCount || 0;
            const seconds = node.runtime?.seconds || null;
            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                rating_count: voteCount,
                rating_count_formatted: formatVotes(voteCount),
                certificate: normalizeCertificate(node.certificate?.rating),
                poster: node.primaryImage?.url || null,
                duration: formatDuration(seconds)
            };
        });
    } catch (err) {
        return [];
    }
};

export const getBottomMovies = async () => {
    const query = `
    query {
      chartTitles(first: 100, chart: { chartType: LOWEST_RATED_MOVIES }) {
        edges {
          node {
            id
            titleText { text }
            releaseYear { year }
            ratingsSummary { aggregateRating voteCount }
            certificate { rating }
            runtime { seconds }
            primaryImage { url }
          }
        }
      }
    }
    `;
    try {
        const response = await fetch(IMDB_GQL_URL, {
            method: "POST",
            headers: { ...HEADERS, Referer: "https://www.imdb.com/chart/bottom/" },
            body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const json = await response.json();
        if (!json.data) return [];
        return json.data.chartTitles.edges.map((item, index) => {
            const node = item.node;
            const voteCount = node.ratingsSummary?.voteCount || 0;
            const seconds = node.runtime?.seconds || null;
            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                rating_count: voteCount,
                rating_count_formatted: formatVotes(voteCount),
                certificate: normalizeCertificate(node.certificate?.rating),
                poster: node.primaryImage?.url || null,
                duration: formatDuration(seconds)
            };
        });
    } catch (err) {
        return [];
    }
};

export const getTopRatedByCountry = async (countryCode = "IN") => {
    if (countryCode === "IN") {
        const query = `
        query {
          chartTitles(first: 250, chart: { chartType: TOP_RATED_INDIAN_MOVIES }) {
            edges {
              node {
                id
                titleText { text }
                releaseYear { year }
                ratingsSummary { aggregateRating voteCount }
                primaryImage { url }
                certificate { rating }
                runtime { seconds }
              }
            }
          }
        }
        `;
        try {
            const response = await fetch(IMDB_GQL_URL, {
                method: "POST",
                headers: { ...HEADERS, Referer: "https://www.imdb.com/india/top-rated-indian-movies/" },
                body: JSON.stringify({ query })
            });
            const json = await response.json();
            if (json.data?.chartTitles) {
                return json.data.chartTitles.edges.map((item, index) => {
                    const node = item.node;
                    return {
                        rank: index + 1,
                        imdb_id: node.id,
                        title: node.titleText?.text || "Unknown",
                        year: node.releaseYear?.year || null,
                        rating: node.ratingsSummary?.aggregateRating || null,
                        rating_count: node.ratingsSummary?.voteCount || 0,
                        rating_count_formatted: formatVotes(node.ratingsSummary?.voteCount || 0),
                        certificate: normalizeCertificate(node.certificate?.rating),
                        poster: node.primaryImage?.url || null,
                        duration: formatDuration(node.runtime?.seconds)
                    };
                });
            }
        } catch (err) {
            return [];
        }
    }
    const hash = "0a6de8896f4199e62945d43355755eb9ee4155d6b0d7923b0018d7068e33ccb7";
    const variables = {
        "first": 50,
        "locale": "en-US",
        "originCountryConstraint": { "allCountries": [countryCode] },
        "titleTypeConstraint": { "anyTitleTypeIds": ["movie"] },
        "sortBy": "USER_RATING",
        "sortOrder": "DESC"
    };
    const url = `${IMDB_GQL_URL}?operationName=AdvancedTitleSearch&variables=${encodeURIComponent(JSON.stringify(variables))}&extensions=${encodeURIComponent(JSON.stringify({
        persistedQuery: { version: 1, sha256Hash: hash }
    }))}`;
    try {
        const response = await fetch(url, { method: "GET", headers: HEADERS });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const json = await response.json();
        if (!json.data?.advancedTitleSearch) return [];
        return json.data.advancedTitleSearch.edges.map((item, index) => {
            const node = item.node.title;
            const voteCount = node.ratingsSummary?.voteCount || 0;
            const seconds = node.runtime?.seconds || null;
            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                rating_count: voteCount,
                rating_count_formatted: formatVotes(voteCount),
                certificate: normalizeCertificate(node.certificate?.rating),
                poster: node.primaryImage?.url || null,
                duration: formatDuration(seconds)
            };
        });
    } catch (err) {
        return [];
    }
};

export const searchImdbPure = async (query) => {
    if (!query) return [];
    const firstChar = query.charAt(0).toLowerCase();
    const imdbUrl = `https://v3.sg.media-imdb.com/suggestion/${firstChar}/${encodeURIComponent(query)}.json`;
    try {
        const response = await fetch(imdbUrl);
        if (!response.ok) return [];
        const data = await response.json();
        const imdbResults = data?.d || [];
        const IMDB_TYPE_LABELS = {
            'feature': 'MOVIE',
            'tv series': 'TV SERIES',
            'tv mini-series': 'MINI SERIES',
            'tv movie': 'TV MOVIE',
            'tv special': 'TV SPECIAL',
            'tv short': 'SHORT',
            'short': 'SHORT',
            'video': 'VIDEO',
            'video game': 'GAME',
            'podcast series': 'PODCAST',
            'music video': 'MUSIC VIDEO',
        };
        const imdbMapped = imdbResults.map((item, index) => {
            const isPerson = item.id.startsWith('nm');
            const isCompany = item.id.startsWith('co');
            const rawType = (item.q || '').toLowerCase();
            const friendlyLabel = IMDB_TYPE_LABELS[rawType] || (item.q || 'UNKNOWN').toUpperCase();
            return {
                rank: index + 1,
                imdb_id: item.id,
                title: item.l,
                year: item.y || null,
                rating: null,
                rating_count: 0,
                rating_count_formatted: isCompany ? "ENTITY" : "0",
                certificate: isPerson ? "PERSON" : (isCompany ? "COMPANY" : friendlyLabel),
                poster: item.i?.imageUrl || null,
                duration: item.s || "N/A",
                titleType: isPerson ? 'person' : (isCompany ? 'company' : (rawType.includes('tv') ? 'tv' : 'movie'))
            };
        });
        const all = imdbMapped.map(item => ({
            ...item,
            _score: calculateSimilarity(query, item.title || '')
        }));
        all.sort((a, b) => b._score - a._score);
        return all.slice(0, 5).map((item, idx) => {
            const { _score, ...rest } = item;
            return { ...rest, rank: idx + 1 };
        });
    } catch (err) {
        return [];
    }
};

export const searchMovies = async (query) => {
    if (!query) return [];
    const firstChar = query.charAt(0).toLowerCase();
    const imdbUrl = `https://v3.sg.media-imdb.com/suggestion/${firstChar}/${encodeURIComponent(query)}.json`;
    const [imdbRes, tmdbCompanies] = await Promise.allSettled([
        fetch(imdbUrl).then(r => r.ok ? r.json() : { d: [] }).catch(() => ({ d: [] })),
        searchCompanies(query)
    ]);
    const imdbResults = (imdbRes.status === 'fulfilled' ? imdbRes.value?.d : null) || [];
    const companyResults = (tmdbCompanies.status === 'fulfilled' ? tmdbCompanies.value : null) || [];
    const IMDB_TYPE_LABELS = {
        'feature': 'MOVIE',
        'tv series': 'TV SERIES',
        'tv mini-series': 'MINI SERIES',
        'tv movie': 'TV MOVIE',
        'tv special': 'TV SPECIAL',
        'tv short': 'SHORT',
        'short': 'SHORT',
        'video': 'VIDEO',
        'video game': 'GAME',
        'podcast series': 'PODCAST',
        'music video': 'MUSIC VIDEO',
    };
    const imdbMapped = imdbResults.map((item, index) => {
        const isPerson = item.id.startsWith('nm');
        const isCompany = item.id.startsWith('co');
        const rawType = (item.q || '').toLowerCase();
        const friendlyLabel = IMDB_TYPE_LABELS[rawType] || (item.q || 'UNKNOWN').toUpperCase();
        return {
            rank: index + 1,
            imdb_id: item.id,
            title: item.l,
            year: item.y || null,
            rating: null,
            rating_count: 0,
            rating_count_formatted: isCompany ? "ENTITY" : "0",
            certificate: isPerson ? "PERSON" : (isCompany ? "COMPANY" : friendlyLabel),
            poster: item.i?.imageUrl || null,
            duration: item.s || "N/A",
            titleType: isPerson ? 'person' : (isCompany ? 'company' : 'movie')
        };
    });
    const seen = new Set(imdbMapped.map(i => i.imdb_id));
    const mergedCompanies = companyResults.filter(c => !seen.has(c.imdb_id));
    const all = [...imdbMapped, ...mergedCompanies].map(item => ({
        ...item,
        _score: calculateSimilarity(query, item.title || '')
    }));
    all.sort((a, b) => b._score - a._score);
    return all.slice(0, 8).map((item, idx) => {
        const { _score, ...rest } = item;
        return { ...rest, rank: idx + 1 };
    });
};

export const getAdvancedSearch = async (filters, options = {}) => {
    const page = Math.max(parseInt(options.page, 10) || 1, 1);
    const perPage = Math.min(Math.max(parseInt(options.perPage, 10) || 50, 1), 50);
    const fetchCount = Math.min(page * perPage, 250);
    const sliceStart = (page - 1) * perPage;
    const sliceEnd = sliceStart + perPage;

    if (filters.query) {
        let items = await searchMovies(filters.query);
        const validItems = items.filter(i => {
            const matchScore = calculateSimilarity(filters.query, i.title);
            return matchScore >= 0.80;
        });
        const movieItems = validItems.filter(i => !i.imdb_id.startsWith('nm') && !i.imdb_id.startsWith('co')).slice(0, 15);
        const personItems = validItems.filter(i => i.imdb_id.startsWith('nm')).slice(0, 5);
        const companyItems = validItems.filter(i => i.imdb_id.startsWith('co')).slice(0, 3);
        const tmdbCompanies = await searchCompanies(filters.query);
        const hybridCompanyItems = [...tmdbCompanies, ...companyItems]
            .filter((v, i, a) => a.findIndex(t => t.imdb_id === v.imdb_id) === i)
            .slice(0, 5);
        let enriched = await getTitlesBatch(movieItems.map(i => i.imdb_id));
        const peopleList = personItems.map((p) => ({
            ...p,
            titleType: 'person',
            description: p.duration !== 'N/A' ? p.duration : 'Actor / Director'
        }));
        const companyList = hybridCompanyItems.map((c) => ({
            ...c,
            titleType: 'company',
            description: c.description || 'Production Company'
        }));
        const allResults = [...peopleList, ...companyList, ...enriched].map(item => ({
            ...item,
            _matchScore: calculateSimilarity(filters.query, item.title || '')
        }));
        allResults.sort((a, b) => b._matchScore - a._matchScore);
        const ranked = allResults.map((item, idx) => {
            const { _matchScore, ...rest } = item;
            return { ...rest, rank: idx + 1 };
        });
        return ranked;
    }
    const hash = "0a6de8896f4199e62945d43355755eb9ee4155d6b0d7923b0018d7068e33ccb7";
    const variables = {
        "first": fetchCount,
        "locale": "en-US",
        "sortBy": filters.sortBy || "POPULARITY",
        "sortOrder": "ASC"
    };
    if (filters.query) variables.searchText = filters.query;
    if (filters.genres?.length) {
        variables.genreConstraint = { allGenreIds: normalizeImdbGenreIds(filters.genres) };
    }
    if (filters.languages?.length) variables.languageConstraint = { allLanguages: filters.languages };
    if (filters.countries?.length) variables.originCountryConstraint = { allCountries: filters.countries };
    if ((filters.ratingMin ?? 0) > 0 || (filters.ratingMax ?? 10) < 10) {
        variables.userRatingsConstraint = {
            aggregateRatingRange: {
                min: parseFloat(filters.ratingMin ?? 0),
                max: parseFloat(filters.ratingMax ?? 10)
            }
        };
    }
    if (filters.votesMin) {
        if (!variables.userRatingsConstraint) variables.userRatingsConstraint = {};
        variables.userRatingsConstraint.ratingsCountRange = { min: parseInt(filters.votesMin) };
    }
    if ((filters.yearStart ?? 1900) > 1900 || (filters.yearEnd ?? 2030) < 2030) {
        variables.releaseDateConstraint = {
            releaseDateRange: {
                start: filters.yearStart ? `${filters.yearStart}-01-01` : "1900-01-01",
                end: filters.yearEnd ? `${filters.yearEnd}-12-31` : "2030-12-31"
            }
        };
    }
    if ((filters.runtimeMin ?? 0) > 0 || (filters.runtimeMax ?? 300) < 300) {
        variables.runtimeConstraint = {
            runtimeRangeMinutes: {
                min: parseInt(filters.runtimeMin) || 0,
                max: parseInt(filters.runtimeMax) || 300
            }
        };
    }
    if (filters.titleType && filters.titleType !== 'ALL') {
        variables.titleTypeConstraint = { anyTitleTypeIds: [filters.titleType] };
    }
    if (filters.adult === 'ONLY') {
        variables.adultSearchConstraint = { isAdult: "ONLY" };
    }
    const body = {
        operationName: "AdvancedTitleSearch",
        variables,
        extensions: {
            persistedQuery: { version: 1, sha256Hash: hash }
        }
    };
    try {
        const response = await fetch(IMDB_GQL_URL, {
            method: "POST",
            headers: {
                ...HEADERS,
                Referer: "https://www.imdb.com/search/title/"
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error(`IMDb AdvancedTitleSearch HTTP ${response.status}`);
        }
        const json = await response.json();
        if (json.errors?.length) {
            throw new Error(`IMDb AdvancedTitleSearch GraphQL Error: ${json.errors[0]?.message || 'Unknown error'}`);
        }
        if (!json.data?.advancedTitleSearch) {
            console.warn('[IMDb Advanced Search] Empty payload:', JSON.stringify({ variables, json }, null, 2));
            return [];
        }
        const edges = json.data.advancedTitleSearch.edges || [];
        return edges.slice(sliceStart, sliceEnd).map((item, index) => {
            const node = item.node.title;
            const credits = node.principalCredits || [];
            const director = credits.find(c => c.role.text === "Director")?.credits[0]?.name?.nameText?.text || "N/A";
            return {
                rank: sliceStart + index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                rating_count: node.ratingsSummary?.voteCount || 0,
                rating_count_formatted: formatVotes(node.ratingsSummary?.voteCount || 0),
                certificate: normalizeCertificate(node.certificate?.rating),
                isAdult: node.isAdult || false,
                poster: node.primaryImage?.url || null,
                duration: formatDuration(node.runtime?.seconds),
                genres: node.genres?.genres?.map(g => g.text) || [],
                description: director !== "N/A" ? `${director} | ${node.titleType?.text || 'Title'}` : (node.titleType?.text || 'Title')
            };
        });
    } catch (err) {
        console.error('[IMDb Advanced Search Error]', {
            filters,
            variables,
            body,
            message: err.message
        });
        return [];
    }
};

export const getPersonSearch = async (filters) => {
    const hash = "f98165e8c40113514d50ebc39de628e057dd7646883cecd38dba7f0d2d0e28c3";
    const variables = {
        "first": 50,
        "locale": "en-US",
        "sortBy": "POPULARITY",
        "sortOrder": "ASC"
    };
    if (filters.birthStart || filters.birthEnd) {
        variables.birthDateConstraint = {
            birthDateRange: {
                start: filters.birthStart ? `${filters.birthStart}-01-01` : "1900-01-01",
                end: filters.birthEnd ? `${filters.birthEnd}-12-31` : new Date().toISOString().split('T')[0]
            }
        };
    }
    if (filters.gender) {
        variables.genderIdentityConstraint = { anyGender: [filters.gender.toUpperCase()] };
    }
    if (filters.topic) {
        variables.biographyConstraint = { searchText: filters.topic };
    }
    const url = `${IMDB_GQL_URL}?operationName=AdvancedNameSearch&variables=${encodeURIComponent(JSON.stringify(variables))}&extensions=${encodeURIComponent(JSON.stringify({
        persistedQuery: { version: 1, sha256Hash: hash }
    }))}`;
    try {
        const response = await fetch(url, { method: "GET", headers: HEADERS });
        const json = await response.json();
        if (!json.data?.advancedNameSearch) return [];
        return json.data.advancedNameSearch.edges.map((item, index) => {
            const node = item.node.name;
            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.nameText?.text || "Unknown",
                year: node.birthDate?.date || "N/A",
                rating: null,
                rating_count: 0,
                rating_count_formatted: "CELEB",
                certificate: "PERSON",
                poster: node.primaryImage?.url || null,
                duration: node.primaryProfession?.category?.text || "Talent",
                genres: node.knownForTitles?.edges?.map(e => e.node.titleText?.text) || []
            };
        });
    } catch (err) {
        return [];
    }
};
