import { GoogleAuth } from 'google-auth-library';

const SITE_URL = 'https://kumar2net.com/';
const SITEMAP_URL = 'https://kumar2net.com/sitemap.xml';

async function submitSitemap() {
    console.log(`🚀 Starting sitemap submission for ${SITE_URL}...`);

    try {
        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/webmasters'],
        });

        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        const accessToken = tokenResponse.token;

        if (!accessToken) {
            throw new Error('Could not retrieve access token.');
        }

        const encodedSiteUrl = encodeURIComponent(SITE_URL);
        const encodedSitemapUrl = encodeURIComponent(SITEMAP_URL);
        const apiEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps/${encodedSitemapUrl}`;

        console.log(`📡 Submitting to: ${apiEndpoint}`);

        const response = await fetch(apiEndpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('✅ Sitemap submitted successfully to Google Search Console!');
        } else {
            const errorText = await response.text();
            console.error(`❌ Submission failed: ${response.status} ${response.statusText}`);
            console.error(`Details: ${errorText}`);

            if (response.status === 403 || response.status === 401) {
                console.log('\n💡 Tip: Ensure you have set GOOGLE_APPLICATION_CREDENTIALS to your service account key path.');
                console.log('   And that the service account has "Owner" or "Full" permission in Google Search Console.');
            }
        }

    } catch (error) {
        console.error('❌ Error during submission:', error.message);
        if (error.message.includes('Could not load the default credentials')) {
            console.log('\n⚠️  No credentials found.');
            console.log('To automate submission:');
            console.log('1. Create a Service Account in Google Cloud.');
            console.log('2. Download the JSON key file.');
            console.log('3. Add the Service Account email as an Owner in Google Search Console.');
            console.log('4. Run: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json" && node scripts/submit-sitemap.mjs');
        }
    }
}

submitSitemap();
