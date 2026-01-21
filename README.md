## Introduction
The code in this repo is not production ready It is to help me explain how to setup entry level and field level localisation in a simple way. Please refer to the below reference for more information

References
- Manage Locales : https://www.contentful.com/help/localization/manage-locales/
- Differnt Patterns : https://www.contentful.com/help/localization/field-and-entry-localization/
- Locale based publishing: https://www.contentful.com/help/localization/locale-based-publishing/

This example will help understand how to setup and use simple field type and entry type patterns to achieve similar outcomes. In order for to visualise the strategies without too much code changes in the repo, follow the content type setup and content entry guidelines in this document.

## Field Level

### Content Type Setup
- Content type ID: fieldLevelLocalisationDemoPage — Demonstrates field-level localisation
- Display field: title — Editor-facing label, localised
- Internal Name (internalName): Symbol · Not localised · Required · Unique — Stable internal identifier
- Title (title): Symbol · Localised — Locale-specific page title
- Slug (slug): Symbol · Not localised · Required — Shared routing identifier across locales
- Description (description): Rich Text · Localised — Main per-locale content body
- Localisation model: Single entry · Field-level translation · Same entry ID across locales — Best for shared structure

Ensure the ID is (fieldLevelLocalisationDemoPage <== Field Level Localisation Demo Page) or adjust the code as necessary. Your graphQl query wont work if it isn't aligned to the actual content setup


### Content Entries
Create an entry of type fieldLevelLocalisationDemoPage. 
Ensure slug is supplied properly in the url in the links. The format for urls based on the code is http://localhost:3000/[locale]/field-level/[slug]

## Entry Level
This pattern needs one container type, and then referenced locales. In our case we are using en-US, and de. So there will be two localised components and one container component lets call it as Global.

### Container: Entry Level Global Component
- Content type ID: entryLevelGlobalDemoPage — Global container for entry-level localisation
- Display field: internalName — Non-localised editorial identifier
- Internal Name (internalName): Symbol · Not localised · Required · Unique — Identifies the global container entry
- Slug (slug): Symbol · Not localised · Required — Shared routing identifier across all locales
- Localised Content (localisedContent): Entry reference · ### Container: Entry Level Global Demo Page — Points to a locale-specific entry per language

Ensure ID is (entryLevelGlobalDemoPage <== Entry Level Global Demo Page) or adjust the code as needed. Your graphql query wont work if it isnt aligned to the type.
Localised Content must be localised otherwise the GraphQl query wont fetch the data.

### Container: Entry Level Localised Component
- Internal Name (internalName): Symbol · Not localised · Required · Unique — Stable internal identifier
- Title (title): Symbol · not localised — Locale-specific page title
- Description (description): Rich Text · not localised — Main per-locale content body

Notice there is no slug here as thats delegated to the container.

All entries are specific to the locale so there must not be any localisation setup at this level.

### Content Entries
Create entry for Global compoent ensure the referenced languages are setup. The locales can be referenced as they are ready to release. This allows staggering releases by entry.
Ensure slug is supplied properly in the url in the links.
The format for urls based on the code is http://localhost:3000/[locale]/entry-level/[slug]

## Code Setup
### Project Setup
Go to  the project folder and create the Next js app OR Clone this repo and npm install. it should work


```bash
npx create-next-app@latest  contentful-localisation --typescript --app
```
√ Which linter would you like to use? » ESLint

√ Would you like to use React Compiler? ... No 

√ Would you like to use Tailwind CSS? ... No 

√ Would you like your code inside a `src/` directory? ... Yes

√ Would you like to customize the import alias (`@/*` by default)? ... No 

Or adjust the code if you choose different options

OR

```bash
npm install
```

```bash
cd contentful-localisation
```

**Install Rich Text Renderer**

```bash
npm install contentful @contentful/rich-text-react-renderer @contentful/rich-text-types
```

### Folder Structure

Inside the src/app folder look for the respective pages.

[locale]/field-level/[slug]/page.tsx
[locale]/entry-level/[slug]/page.tsx

Edit env.local file with the keys from contentful
- NEXT_PUBLIC_CONTENTFUL_SPACE_ID=[Space id here]
- NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID=master
- NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN=[delivery token here]
- NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN=[preview token here]

Since we are calling the GraphQl endpoints from two different places, the logic is abstracted to src\lib\httpClient.ts

Run the app and follow the instructions

```bash
npm run dev
```

### Verification
## Field Level

```bash
http://localhost:3000/en-US/field-level/simple-field-level-localisation-demo
http://localhost:3000/de/field-level/simple-field-level-localisation-demo
```

## Entry Level

```bash
http://localhost:3000/en-US/entry-level/entry-level-localisation-demo
http://localhost:3000/de/entry-level/entry-level-localisation-demo
```