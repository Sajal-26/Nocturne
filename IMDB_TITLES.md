# IMDb Media Metadata & Detail URLs

Use these URLs to capture network traffic for **Nocturne's** detail pages (Movies, TV Shows).

| Feature | URL | Burp Target Hint |
| :--- | :--- | :--- |
| **Main Detail Page** | `https://www.imdb.com/title/{tt_id}/` | Look for `GetTitleDetails` in GraphQL |
| **Full Cast & Crew** | `https://www.imdb.com/title/{tt_id}/fullcredits` | Look for `GetCastAndCrew` in GraphQL |
| **User Reviews** | `https://www.imdb.com/title/{tt_id}/reviews` | Search for `GetUserReviews` in JSON |
| **Awards & Ratings** | `https://www.imdb.com/title/{tt_id}/awards` | Look for `GetTitleAwards` in GraphQL |
| **Parents Guide** | `https://www.imdb.com/title/{tt_id}/parentalguide` | Look for content advisory details |
| **Keyword Tags** | `https://www.imdb.com/title/{tt_id}/keywords` | Look for plotting keywords |

---

### Tips for Capture:
- Filter your Burp history for `api.graphql.imdb.com`.
- Look for `POST` requests and check the **`operationName`** in the payload.
- This will let your backend deliver deep data for every media page.
