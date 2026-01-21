type FetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  locale?: string;
};

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const ENV_ID = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || "master";
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN;
const PREVIEW_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN;

function graphqlUrl() {
  return `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENV_ID}`;
}

export async function contentfulFetch<T>({ query, variables, locale }: FetchOptions): Promise<T> {
  if (!SPACE_ID) {
    throw new Error("Missing NEXT_PUBLIC_CONTENTFUL_SPACE_ID in .env.local");
  }
  
  const res = await fetch(graphqlUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DELIVERY_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
      locale: locale ?? null
    }),
  });

  const json = await res.json();

  if (!res.ok || json.errors?.length) {
    throw new Error(
      `Contentful GraphQL error:\n${JSON.stringify(
        { status: res.status, errors: json.errors, data: json.data },
        null,
        2
      )}`
    );
  }
  return json.data as T;
}
