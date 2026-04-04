# IMDb Search & Suggestions URLs

Use these URLs to capture network traffic for **Nocturne's** search features (Autocomplete, Search results).

| Feature | URL | Burp Target Hint |
| :--- | :--- | :--- |
| **Main Search Page** | `https://www.imdb.com/find` | Look for `suggestion` API calls |
| **Advanced Title Search** | `https://www.imdb.com/search/title/` | Intercept when you click "Search" |
| **Advanced Person Search** | `https://www.imdb.com/search/name/` | Intercept when you click "Search" |
| **Autocomplete Results** | Use any page and **type in search bar** | Captures to `v3.sg.media-imdb.com` |

---

### Tips for Capture:
- Type slowly in the IMDb search bar to trigger the suggestion API.
- Look for `GET` requests to `v3.sg.media-imdb.com`.
- This is the fastest way to implement search in your backend.
