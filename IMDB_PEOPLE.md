# IMDb Person & Actor Metadata URLs

Use these URLs to capture network traffic for **Nocturne's** Actor, Director, and Person profiles.

| Feature | URL | Burp Target Hint |
| :--- | :--- | :--- |
| **Main Bio/Actor Detail** | `https://www.imdb.com/name/{nm_id}/` | Look for `GetNameDetails` in GraphQL |
| **Biography Details** | `https://www.imdb.com/name/{nm_id}/bio` | Search for `GetBiography` in JSON |
| **Personal Awards** | `https://www.imdb.com/name/{nm_id}/awards` | Look for `GetNameAwards` in GraphQL |

---

### Tips for Capture:
- Look for `POST` requests to `api.graphql.imdb.com`.
- The response will contain the actor's biography, birthday, and filmography.
- This data is perfect for the social side of your app!
