# Chapter Garden contributor rules

Read [README.md](README.md) before changing story content. It defines the bilingual file format and contribution workflow.

## Content

- Keep one stable book ID in `src/content/books/<book-id>/`. Put Chinese content in `zh/` and English content in `en/` beneath that same ID.
- Give every language version its own localized `book.json` and at least one Markdown chapter. Publish only real chapters; a translation can arrive later.
- When translating a chapter, preserve its filename and `order` so the site can link the two versions. Translate the title and body in the target file. Set `author` to the original writer when known and `translator` to the actual translator.
- Continue an existing story consistently with its published chapters. Keep contributions original or properly authorized, and preserve contributor attribution.

## Changes

- Work on a branch and submit a pull request to `main`. Keep one story or one site change per pull request when practical.
- Run `npm run check` and `npm run build` before submitting. Check the generated Chinese and English routes when changing content loading, URLs, or language switching.
- Update both Chinese and English README sections when changing contributor instructions or content format.
