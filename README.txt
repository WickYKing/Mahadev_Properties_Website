MAHADEV PROPERTIES WEBSITE (REBUILT, 10 OCTOBER 2026)

WHAT TO UPLOAD
Upload these to the root of delhipropertybuyandsale.in:
  all 11 .html pages, style.css, script.js, gallery.js, instagram-reels.js, config.js, robots.txt, sitemap.xml and the assets folder.
Do NOT upload: README.txt, CONNECT-GOOGLE-SHEET.txt, lead-capture.gs, OPEN-WEBSITE.cmd.
Turn on HTTPS on your hosting and redirect http:// and www to https://delhipropertybuyandsale.in

PREVIEW ON YOUR COMPUTER
Extract the ZIP, open the mahadev-properties folder and double-click OPEN-WEBSITE.cmd (or open index.html in Chrome/Edge).

GOOGLE SHEET LEAD CAPTURE
Already connected. config.js contains your live Apps Script address and the form sends the same fields as before,
so nothing needs to change in Google Apps Script. Enquiries go to the "Website Leads" tab.
After uploading, send one test enquiry named TEST, check the row appears, then delete it.

ADDING YOUR INSTAGRAM REELS TO THE GALLERY
1. In Instagram, open a reel > tap the share arrow or ... > Copy link.
2. Open instagram-reels.js in Notepad and paste each link inside quotes, followed by a comma:
     window.MAHADEV_REELS = [
       'https://www.instagram.com/reel/ABC123xyz/',
       'https://www.instagram.com/reel/DEF456uvw/',
     ];
3. Save and upload instagram-reels.js again. The reels play on the Gallery page through Instagram's official embed.
12 reels from @mahadevproperties247 are already added. The page shows 6, then a Show more button.
Optional: to host your own videos, put .mp4 files in assets/videos/ and list them in MAHADEV_VIDEOS in the same file.

THIS VERSION
- Original navy and orange colours.
- Homepage hero shows the office portrait photo; Atul's photo and contact panel on Home and About.
- Only Atul Chauhan's number is used anywhere on the site.
- Google Map on the homepage and the Contact page.
- New Gallery page (property-gallery.html) linked in the menu, homepage and footer.
- Mobile menu and fixed Call / Enquire / WhatsApp bar.

CONTACT DETAILS USED
Shop No. 147, Kishan Ganj Market, Delhi 110007
Atul Chauhan +91 89200 30789 (also WhatsApp)
Instagram: https://www.instagram.com/mahadevproperties247/
