MAHADEV PROPERTIES — REBUILT WEBSITE

Open index.html to view the website. Upload all HTML pages, style.css, script.js, config.js, robots.txt, sitemap.xml and assets/ to the root of delhipropertybuyandsale.in. Enable HTTPS and redirect www and HTTP to https://delhipropertybuyandsale.in. Redirect /index.html to / on your host. Keep lead-capture.gs and this README outside the public upload.

CONTACT DETAILS
Shop No. 147, Kishan Ganj Market, Delhi–110007.
Atul Chauhan: +91 8920030789. Rakesh Chauhan: +91 9891486995.
Map searches the locality; it does not claim a verified shop pin.

GOOGLE SHEET LEAD CAPTURE — ACTIVATION REQUIRED
Destination: https://docs.google.com/spreadsheets/d/1Z8Z4W7idnLc5K5tWwfZVeIjwLFBtz5ADSNaU3T_1aZw/edit
The connected account received a permission denied response. No changes were made to the Sheet and no live lead write has been verified.
1. Open the destination Sheet as an account with edit permission.
2. Choose Extensions > Apps Script. Paste lead-capture.gs into the project.
3. Run setup once and approve the requested Google permissions. This creates a separate Website Leads tab without replacing existing tabs.
4. Deploy > New deployment > Web app. Execute as yourself; allow access to Anyone. If your Workspace administrator blocks anonymous web apps, use a server-side integration instead.
5. Copy the deployment URL ending /exec into leadEndpoint in config.js.
6. Submit a clearly labelled test enquiry, check that the row appears in Website Leads, and confirm the website shows a saved confirmation. Delete the test row afterwards.
7. When changing Apps Script code, update the deployment version.
Do not put Google passwords, tokens or service-account keys into client-side files.

The form uses a cross-origin iframe POST with an acknowledgement after the Sheet write. It never treats an opaque network response as success. Failed or unconfigured submissions provide an explicit WhatsApp alternative. The script checks required fields and consent, neutralizes spreadsheet formula injection, serializes writes, and deduplicates retries by Lead ID. Basic honeypot protection is included; for substantial traffic add server-side rate limits and CAPTCHA. The Sheet must remain private to the business team.

SEO AND LAUNCH
Content uses property dealer / Kishan Ganj / Delhi NCR naturally, with service explanations and visible FAQs. One H1, descriptive title and meta description, semantic headings, RealEstateAgent structured data, consistent address and phone numbers, local assets, lazy map, responsive layout and privacy notice are included. Unverified client/property statistics and invented listings are omitted.
Canonical URLs, page-specific Open Graph/X metadata, robots.txt and the sitemap now use https://delhipropertybuyandsale.in. Submit https://delhipropertybuyandsale.in/sitemap.xml in Google Search Console after uploading the site. Verify the business address and phone on Google Business Profile. Confirm service coverage, any claimed statistics and brokerage terms before adding them. SEO does not guarantee rankings.
Guidance: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
Apps Script deployment: https://developers.google.com/apps-script/guides/web

Supplied HEIC files could not be decoded with the available image libraries. They have not been used as unidentified property listings. The supplied business-card image is retained in assets for reference; the website uses the supplied logo optimized to WebP.

MULTI-PAGE STRUCTURE
index.html — Buy & Sell Property in Delhi | Mahadev Properties
about.html — About Mahadev Properties | Property Dealer in Kishan Ganj
services.html — Property Services in Delhi NCR | Sale, Purchase, Rent
property-guide.html — Buying & Selling Property: Enquiry Guide | Delhi
contact.html — Contact Mahadev Properties | Kishan Ganj, Delhi 110007
buy-property-delhi.html — Buy Property in Delhi | Mahadev Properties
sell-property-delhi.html — Sell Property in Delhi | Mahadev Properties
rent-property-delhi.html — Property Rental Enquiries in Delhi | Mahadev Properties
property-collaboration-delhi.html — Property Collaboration in Delhi | Mahadev Properties
privacy.html — Enquiry Privacy Notice | Mahadev Properties
Every page includes an enquiry form. Service forms default to the relevant requirement. The source URL is saved with each submitted lead once the Google integration is activated.
Homepage copy follows visitor problem, practical impact and proposed solution. Search intents are inferred from the business services, not measured keyword volumes.
This package is prepared for the domain but has not been uploaded or published.

VALIDATION
All ten HTML pages passed local link/anchor checks, one-H1 and form presence checks, unique canonical checks, schema parsing and sitemap validation. JavaScript syntax checks passed. Automated visual/browser testing could not run because the installed browser failed to launch in this environment. Live Google Sheet submissions remain unverified pending activation.

