import Contentstack from "@contentstack/management";

// process.env is expected to be injected by Webpack DefinePlugin or similar bundler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;
const apiKey = process.env.REACT_APP_CONTENTSTACK_API_KEY || "";
const managementToken =
  process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN || "";

// Initialize the Contentstack management client
const contentstackClient = Contentstack.client();

// Get a stack instance
export const stack = contentstackClient.stack({
  api_key: apiKey,
  management_token: managementToken,
});

// Example: fetch entries of a content type
export async function fetchEntries(contentType: string) {
  return stack.contentType(contentType).entry().query().find();
}

// Example: update an entry
export async function updateEntry(
  contentType: string,
  entryUid: string,
  data: Record<string, unknown>
) {
  const entry = await stack.contentType(contentType).entry(entryUid).fetch();
  Object.assign(entry, data);
  return entry.update();
}
