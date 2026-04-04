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

const MOVIE_FIELDS = `
    id
    titleText { text }
    releaseDate { day month year }
    releaseYear { year }
    ratingsSummary { aggregateRating voteCount }
    primaryImage { url }
    runtime { seconds }
    certificate { rating }
    titleType { text id }
    genres { genres { text } }
    principalCredits {
        role { text }
        credits { name { nameText { text } id } }
    }
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


export const getTrendingMovies = async () => {
    const query = `
    query {
      chartTitles(first: 100, chart: { chartType: MOST_POPULAR_MOVIES }) {
        edges {
          node {
            ${MOVIE_FIELDS}
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

export const getTopRatedByCountry = async (countryCode = "IN") => {
    // If India, use the curated Top 250 Indian Movies chart for maximum accuracy with IMDb's official list
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
            console.error("IMDb Indian Chart Failed, falling back to Search:", err.message);
        }
    }

    // Default: Use Persisted Search Hash for all other countries
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
        if (!response.ok) {
            throw new Error(`IMDb Search API Error: ${response.status}`);
        }

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
        console.error(`IMDb Country Search (${countryCode}) Failed:`, err.message);
        return [];
    }
};

export const searchMovies = async (query) => {
    if (!query) return [];
    
    const firstChar = query.charAt(0).toLowerCase();
    const url = `https://v3.sg.media-imdb.com/suggestion/${firstChar}/${encodeURIComponent(query)}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`IMDb Suggestion API Error: ${response.status}`);
        
        const json = await response.json();
        const results = json.d || [];

        return results.map((item, index) => {
            const isPerson = item.id.startsWith('nm');
            const isCompany = item.id.startsWith('co');
            
            return {
                rank: index + 1,
                imdb_id: item.id,
                title: item.l,
                year: item.y || null,
                rating: null,
                rating_count: 0,
                rating_count_formatted: isCompany ? "ENTITY" : "0",
                certificate: isPerson ? "PERSON" : (isCompany ? "COMPANY" : (item.q || "UNKNOWN").toUpperCase()),
                poster: item.i?.imageUrl || null,
                duration: item.s || "N/A"
            };
        });
    } catch (err) {
        console.error("IMDb Search Failed:", err.message);
        return [];
    }
};

export const getAdvancedSearch = async (filters) => {
    const hash = "0a6de8896f4199e62945d43355755eb9ee4155d6b0d7923b0018d7068e33ccb7";
    
    const variables = {
        "first": 50,
        "locale": "en-US",
        "sortBy": filters.sortBy || "POPULARITY",
        "sortOrder": "ASC"
    };

    if (filters.genres?.length) variables.genreConstraint = { allGenreIds: filters.genres };
    if (filters.languages?.length) variables.languageConstraint = { allLanguages: filters.languages };
    if (filters.countries?.length) variables.originCountryConstraint = { allCountries: filters.countries };
    
    if (filters.ratingMin || filters.ratingMax) {
        variables.userRatingsConstraint = {
            aggregateRatingRange: {
                min: parseFloat(filters.ratingMin) || 1.0,
                max: parseFloat(filters.ratingMax) || 10.0
            }
        };
    }

    if (filters.votesMin) {
        if (!variables.userRatingsConstraint) variables.userRatingsConstraint = {};
        variables.userRatingsConstraint.ratingsCountRange = { min: parseInt(filters.votesMin) };
    }

    if (filters.yearStart || filters.yearEnd) {
        variables.releaseDateConstraint = {
            releaseDateRange: {
                start: filters.yearStart ? `${filters.yearStart}-01-01` : "1900-01-01",
                end: filters.yearEnd ? `${filters.yearEnd}-12-31` : new Date().toISOString().split('T')[0]
            }
        };
    }

    if (filters.runtimeMin || filters.runtimeMax) {
        variables.runtimeConstraint = {
            runtimeRangeMinutes: {
                min: parseInt(filters.runtimeMin) || 0,
                max: parseInt(filters.runtimeMax) || 999
            }
        };
    }

    if (filters.titleType) {
        variables.titleTypeConstraint = { anyTitleTypeIds: [filters.titleType] };
    }

    if (filters.adult === 'INCLUDE') {
        variables.adultSearchConstraint = { isAdult: "INCLUDE" };
    } else if (filters.adult === 'ONLY') {
        variables.adultSearchConstraint = { isAdult: "ONLY" };
    }

    const url = `${IMDB_GQL_URL}?operationName=AdvancedTitleSearch&variables=${encodeURIComponent(JSON.stringify(variables))}&extensions=${encodeURIComponent(JSON.stringify({
        persistedQuery: { version: 1, sha256Hash: hash }
    }))}`;

    try {
        const response = await fetch(url, { method: "GET", headers: HEADERS });
        const json = await response.json();
        if (!json.data?.advancedTitleSearch) return [];

        return json.data.advancedTitleSearch.edges.map((item, index) => {
            const node = item.node.title;
            const credits = node.principalCredits || [];
            const director = credits.find(c => c.role.text === "Director")?.credits[0]?.name?.nameText?.text || "N/A";
            
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
                duration: formatDuration(node.runtime?.seconds),
                genres: node.genres?.genres?.map(g => g.text) || [],
                description: director !== "N/A" ? `${director} | ${node.titleType?.text || 'Title'}` : (node.titleType?.text || 'Title')
            };
        });
    } catch (err) {
        console.error("Advanced Search Failed:", err.message);
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
        console.error("Person Search Failed:", err.message);
        return [];
    }
};