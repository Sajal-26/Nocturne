const IMDB_GQL_URL = "https://caching.graphql.imdb.com/";

const HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
    "Origin": "https://www.imdb.com",
    "Referer": "https://www.imdb.com/chart/moviemeter/",
    "Accept": "application/json"
};

const normalizeCertificate = (cert) => {
    if (!cert) return "NR";
    const mapping = {
        'Approved': 'U',
        'Passed': 'U',
        'TV-G': 'U',
        'G': 'U',
        'TV-PG': 'UA',
        'PG': 'UA',
        'TV-14': 'UA',
        'PG-13': 'UA',
        'TV-MA': 'A',
        'R': 'A',
        'NC-17': 'A',
        'X': 'A'
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

export const getTrendingMovies = async () => {
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

        if (!response.ok) {
            throw new Error(`IMDb API Error Status: ${response.status}`);
        }

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
        console.error("IMDb Movies Fetch Failed:", err.message);
        return [];
    }
};

export const getTrendingTVShows = async () => {
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
            primaryImage { url }
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

        if (!response.ok) {
            throw new Error(`IMDb API Error Status: ${response.status}`);
        }

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
                duration: node.titleType?.text || "TV Series"
            };
        });
    } catch (err) {
        console.error("IMDb TV Fetch Failed:", err.message);
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

        if (!response.ok) {
            throw new Error(`IMDb API Error Status: ${response.status}`);
        }

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
        console.error("IMDb Top Rated Fetch Failed:", err.message);
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

        if (!response.ok) {
            throw new Error(`IMDb API Error Status: ${response.status}`);
        }

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
                duration: "TV Series"
            };
        });
    } catch (err) {
        console.error("IMDb Top TV Fetch Failed:", err.message);
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

        if (!response.ok) {
            throw new Error(`IMDb API Error Status: ${response.status}`);
        }

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
        console.error("IMDb Top English Movies Fetch Failed:", err.message);
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

        if (!response.ok) {
            throw new Error(`IMDb API Error Status: ${response.status}`);
        }

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
        console.error("IMDb Bottom Movies Fetch Failed:", err.message);
        return [];
    }
};