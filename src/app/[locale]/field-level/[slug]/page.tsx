import { notFound } from 'next/navigation'
import styles from "../../../page.module.css";
import { contentfulFetch } from "@/lib/httpClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES, Document } from "@contentful/rich-text-types";

const query = `
  query PreviewDemoPageBySlug($slug:String!, $locale: String!) {
    fieldLevelLocalisationDemoPageCollection(
      where: {slug :$slug}
      limit: 1, 
      locale: $locale) {
      items {
        internalName
        title
        slug
        description{
          json
        }
      }
    }
}

`;

type LocalisationDemoItem = {
  fieldLevelLocalisationDemoPageCollection: {
    items: Array<{
      internalName?: string | null;
      title?: string | null;
      slug?: string | null;
      description: any | null;
    } | null>;
  };

  title?: string | null;
  slug?: string | null;
}

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
  const foundPages = data.fieldLevelLocalisationDemoPageCollection.items;
  if (foundPages.length == 0) {
    notFound();
  }
  const page = foundPages[0];
  const richText = page?.description?.json as Document | undefined;

  // console.log("Data from contentful Graph", page);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.content}>
          <h2 >{page?.title}</h2>
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
