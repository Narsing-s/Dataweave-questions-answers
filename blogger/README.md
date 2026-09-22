# Blogger publishing package

This folder contains a polished Blogger-ready public DataWeave Q&A learning experience.

## Live Blogger site

https://mulenarsi-dataweave.blogspot.com/

## How to publish

1. Create a Blogger blog.
2. In Blogger, open Layout → Add a Gadget → HTML/JavaScript.
3. Copy the complete contents of `blogger/dataweave-lab-widget.html`.
4. Paste it into the gadget's Content field and save.
5. Move the gadget to the main content area if your theme allows it.
6. For a full-width learning page, create a Blogger Page, switch to HTML view, and paste the widget there.

The widget loads the public `dataset/questions-10000.json` directly from this repository's main branch. It does not require an API key, login, backend, or token.

## UI features

- Modern responsive DataWeave learning interface
- Hero section with GitHub and Blog Home links
- Practice statistics for total, Easy, Medium and Advanced records
- Search across question, topic, code, ID, input, output and explanation
- Difficulty filtering
- Topic filtering
- One-click category/topic browsing
- Responsive question cards
- Input, Expected Output, DataWeave and Explanation panels
- Copy DataWeave action
- Mobile-friendly layout
- GitHub source link
- No account or login required

## Repository coverage

The repository also contains curated Medium-level material outside the generated 10,000-record dataset. The array cross-check added dedicated Medium questions for previously underrepresented array operations such as `take`, `drop`, range selection, `takeWhile`, `dropWhile`, `zip`, `unzip`, `findIndex`, `some`, and `every`.

See:

- `REAL-QA/NEW-MEDIUM-ARRAY-DEEP-226-235.md`

## Important

Blogger is the presentation/hosting layer. GitHub remains the source of truth for the dataset and application code.

Google's official Blogger documentation confirms that HTML/JavaScript gadgets can be added through the Blogger Layout flow.
