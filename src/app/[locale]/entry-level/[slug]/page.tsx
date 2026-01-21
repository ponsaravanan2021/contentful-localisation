import { notFound } from 'next/navigation'
import styles from "../../../page.module.css";
import { contentfulFetch } from "@/lib/httpClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES, Document } from "@contentful/rich-text-types";

const query = `
 query EntryLevelGlobalDemoBySlug(
  $slug: String!
  $locale: String!
) {
  entryLevelGlobalDemoPageCollection(
    where: { slug: $slug }
    limit: 1
  ) {
    items {
      internalName
      slug

      localisedContent(locale: $locale) {
        sys { id }
        __typename
        ... on EntryLevelLocalisationDemoPage {
          internalName
          title
          description {
            json
          }
        }
      }
    }
  }
}


`;
export type EntryLevelLocalisedContent = {
  sys: {
    id: string;
  };
  __typename: "EntryLevelLocalisedDemoPage";
  internalName?: string | null;
  title?: string | null;
  description?: {
    json: Document;
  } | null;
};

export type EntryLevelGlobalDemoPage = {
  internalName?: string | null;
  slug?: string | null;
  localisedContent?: EntryLevelLocalisedContent | null;
};

export type LocalisationDemoItem = {
  entryLevelGlobalDemoPageCollection: {
    items: Array<EntryLevelGlobalDemoPage | null>;
  };
};

export default async function Home({ params }: { params: { locale:string, slug: string } }) {
  const urlParams = await params;

  // `params` will be { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(urlParams.slug);
  var slug = urlParams.slug;
  var locale= urlParams.locale;
  const data = await contentfulFetch<LocalisationDemoItem>({
    query: query,
    variables: { slug, locale },
  });
  const foundPages = data.entryLevelGlobalDemoPageCollection.items;
  if (foundPages.length == 0) {
    notFound();
  }
  const page = foundPages[0];
  const richText = page?.localisedContent!.description?.json as Document | undefined;

  // console.log("Data from contentful Graph", page);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.content}>
          <h2 >{page?.localisedContent?.title}</h2>
          <section className={styles.section}>
            {richText ? (
              <div className={styles.richText}>
                {documentToReactComponents(richText)}
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}
