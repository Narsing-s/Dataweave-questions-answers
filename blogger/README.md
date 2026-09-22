# Blogger publishing package

This folder contains a Blogger-ready public DataWeave Q&A widget.

## How to publish

1. Create a Blogger blog.
2. In Blogger, open Layout → Add a Gadget → HTML/JavaScript.
3. Copy the complete contents of blogger/dataweave-lab-widget.html.
4. Paste it into the gadget's Content field and save.
5. Move the gadget to the main content area if your theme allows it.
6. For a full-width learning page, create a Blogger Page, switch to HTML view, and paste the widget there.

The widget loads the public dataset/questions-10000.json directly from this repository's main branch. It does not require an API key, login, backend, or token.

## What it provides

- Public searchable DataWeave practice bank
- Question, input, expected output, DataWeave 2.x and explanation
- Easy / Medium / Advanced filters
- Topic filter
- Pagination
- Copy DataWeave
- Responsive mobile layout
- GitHub source link

## Important

Blogger is the presentation/hosting layer. GitHub remains the source of truth for the dataset and application code.

Google's official Blogger documentation confirms that HTML/CSS can be edited through Theme → Edit HTML and HTML/JavaScript can be added through Layout → Add a Gadget.
