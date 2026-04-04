const IMDB_GQL_URL = "https://caching.graphql.imdb.com/";

const HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
    "Origin": "https://www.imdb.com",
    "Referer": "https://www.imdb.com/chart/bottom/",
    "Accept": "application/json"
};

const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const formatVotes = (n) => {
    if (!n) return "0";
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
};

export const getBottomMovies = async () => {
    const query = `
    query {
      chartTitles(first: 100, chart: { chartType: LIST_EVERYTHING }) {

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
            const text = await response.text();
            throw new Error(`IMDb API Error ${response.status}: ${text}`);
        }

        const json = await response.json();
        if (!json.data || !json.data.chartTitles) return [];

        return json.data.chartTitles.edges.map((item, index) => {
            const node = item.node;
            const voteCount = node.ratingsSummary?.voteCount || 0;

            return {
                rank: index + 1,
                imdb_id: node.id,
                title: node.titleText?.text || "Unknown",
                year: node.releaseYear?.year || null,
                rating: node.ratingsSummary?.aggregateRating || null,
                votes: formatVotes(voteCount),
                certificate: node.certificate?.rating || "N/A",
                duration: formatDuration(node.runtime?.seconds),
                poster: node.primaryImage?.url || null
            };
        });

    } catch (err) {
        console.error("Top 250 Fetch Failed:", err.message);
        return [];
    }
};

(async () => {
    console.log("Fetching IMDb Bottom Movies...\n");

    const start = Date.now();
    const shows = await getBottomMovies();
    const end = Date.now();



    console.log("-----------------------------------------");
    console.log(`Fetch Time: ${((end - start) / 1000).toFixed(3)}s`);
    console.log(`Total Shows: ${shows.length}`);
    console.log("-----------------------------------------\n");

    shows.slice(0, 15).forEach((show) => {
        console.log(`[${show.rank}] ${show.title} (${show.year})`);
        console.log(`⭐ ${show.rating} (${show.votes}) | ${show.certificate} | ${show.duration}`);
        console.log("-".repeat(40));
    });
})();