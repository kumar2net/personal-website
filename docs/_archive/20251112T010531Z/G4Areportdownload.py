I want to perform the following end-to-end GA4 → BigQuery ingest workflow agentically:

1. **Authenticate** to my Google account (kumar2net@gmail.com), with access to the GA4 property for my production site. Use OAuth 2.0 flow with `https://www.googleapis.com/auth/analytics.readonly` scope.

2. **Fetch my GA4 Property ID** associated with Measurement ID `G-PZ37S6E5BL` (my production property). If needed, list all properties and select the right one.

3. **Query GA4 Data API** for:
   - Dimension(s): `pagePath`, `pageTitle`, `screenName`, `eventName`
   - Metric(s): `screenPageViews`, `totalUsers`, `engagedSessions`, `averageSessionDuration`
   - Date range: **last 14 days** (today minus 14 days through today)

4. **Export the full result as a CSV file** (use headers).

5. **Connect to my GCP project**: `gen-lang-client-0261683563`

6. In BigQuery:
   - If a dataset named `manual_ga4_imports` does **not** exist, create it in region `US`.
   - Upload the CSV as a table named `ga4_pages_screens_past2weeks`.
   - Autodetect schema, use headers, set proper column types for strings and integers.

7. **Send me a confirmation:** Including
   - First 5 rows of imported BigQuery table
   - The table schema used
   - Note any errors, permission issues, or authentication steps required

**Pre-conditions:**  
- You may generate any temporary OAuth credential or ask for a local interactive authorization if necessary.
- If a step requires a download/upload, handle it through your browser’s automation workflow.

---

**If any step fails, report the error in context, and suggest a manual fix or next step.**

---

### **[End Prompt]**

---

**How to use:**  
Paste this prompt directly into Cursor AI (or any modern browser agent platform with web+CLI+cloud automation capabilities).

**What will happen:**  
The agent will step through GA4 authentication, query, download, prepare the CSV, authenticate to your GCP project, create the dataset/table in BigQuery, upload, and summarize output/errors.

---

Let me know if you want a more minimal version, or want to add other custom metrics/dimensions!
