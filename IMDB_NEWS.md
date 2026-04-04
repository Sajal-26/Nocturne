# IMDb News, Media & Assets URLs

Use these URLs to capture network traffic for **Nocturne's** visual media and latest entertainment news.

| Feature | URL | Burp Target Hint |
| :--- | :--- | :--- |
| **Latest Movie News** | `https://www.imdb.com/news/movie/` | Look for `GetNews` GraphQL |
| **High-Res Gallery** | `https://www.imdb.com/title/{tt_id}/mediaindex` | Captures to `m.media-imdb.com` |
| **Trailers & Videos** | `https://www.imdb.com/trailers/` | Search for `GetVideos` in JSON |

---

### Tips for Capture:
- Filter your Burp history for `m.media-imdb.com` to see the high-quality poster URLs.
- The news section is great for the "Social Lounge" feed in your app.
