# Prime Reliability Group website

A responsive, static website for equipment reliability assessments, maintenance programs, failure investigations, and corrective-action support. Compatible with the existing GitHub Pages repository at https://github.com/Lukel321/primereliabilitygroup.

## Files and hosting

Publish the contents of this folder at the root of the existing GitHub Pages publishing source. Preserve the existing `CNAME` file and Pages custom-domain configuration. No package installation, build command, database, or server-side runtime is required.

- `index.html`: consulting homepage, services, deliverable examples, approach, FAQs, and inquiry tool.
- `tools.html`: existing software product offerings, retained as a secondary page.
- `privacy.html`: website privacy information.
- `styles.css`, `site.js`: responsive styling and accessible interactions.
- `assets/`: existing company logo/product image, original technical illustration, and local font.
- `robots.txt`, `sitemap.xml`, `.nojekyll`, `favicon.png`: hosting and discovery support.

## Contact behavior

The inquiry form prepares a visible email draft addressed to `Sales@PrimeReliabilityGroup.com`. It does not send automatically, post to a database, or claim a successful submission. The visitor can open the draft in an email app, copy its contents, or use the direct phone and email links. A direct web-form delivery service can be integrated later if desired.

## Update the existing GitHub Pages site

The website uses the existing GitHub Pages hosting and custom domain. Publish updates through a review branch and pull request into the current Pages publishing branch.

1. Extract `prime-reliability-group-website.zip` and review `index.html` in a browser.
2. In the existing repository, create a review branch from the branch currently used by GitHub Pages. Use **Add file → Upload files** to upload the extracted contents at the repository root, including the `assets` directory. Upload the contents rather than a surrounding folder.
3. Replace `index.html` and `styles.css`; add the new pages, script, assets, and discovery files. Retain the existing `images` directory and keep `CNAME` exactly `primereliabilitygroup.com`.
4. Review the changes, merge into the current Pages publishing branch, and check the resulting Pages deployment. The existing custom-domain configuration should be preserved.
5. Verify the homepage, service sections, phone/email links, inquiry drafting, and Digital Tools page at the live domain.

Future updates should preserve the custom domain, relative asset paths, and the explicit email-draft behavior of the inquiry tool.

## Content

Company name, Louisiana location, phone, email, logo, and software product information were taken from the existing public website. Service copy reflects the requested equipment-assessment, maintenance-planning, RCA, and corrective-action consulting offer. The sample deliverables are clearly illustrative. No customer testimonials, performance statistics, certifications, customer names, or guaranteed outcomes have been invented.

## Preview

Serve this folder using a static HTTP server, for example `python -m http.server 8080 --bind 127.0.0.1`, then open http://127.0.0.1:8080.

## Asset provenance

- Company logo, favicon, and product image: existing Prime Reliability Group site/repository.
- `assets/reliability-system.svg`: original illustration created for this website.
- Manrope font: Google Fonts / Manrope project, distributed under the SIL Open Font License; see `assets/OFL-Manrope.txt`.
