# IMDb Charts & Discovery URLs

Use these URLs to capture network traffic for **Nocturne's** discovery features (Trending, Top 250, etc.).

| Feature | URL | Burp Target Hint |
| :--- | :--- | :--- |
| **Most Popular Movies** | `https://www.imdb.com/chart/moviemeter` | Look for `moviemeter` GraphQL queries |
| **Most Popular TV** | `https://www.imdb.com/chart/tvmeter` | Look for `tvmeter` GraphQL queries |
| **Top 250 Movies** | `https://www.imdb.com/chart/top` | Search for `top250` in JSON responses |
| **Top 250 TV Shows** | `https://www.imdb.com/chart/toptv` | Search for `top250tv` in JSON responses |
| **Box Office** | `https://www.imdb.com/chart/boxoffice` | Look for `boxoffice` metadata |

---

### Tips for Capture:
- Filter Burp history for `api.graphql.imdb.com`.
- Look for `POST` requests with a JSON body.
- The response will contain an array of **`ttxxxxxxx`** (IMDb IDs) and basic metadata.
