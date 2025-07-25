import Contentstack from "@contentstack/management";
import contentstack from "contentstack";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

const apiKey = process.env.REACT_APP_CONTENT_STACK_API_KEY || "";
const managementToken =
  process.env.REACT_APP_CONTENT_STACK_MANAGEMENT_TOKEN || "";
const environment = process.env.CONTENT_STACK_ENVIRONMENT || "development";
const region = process.env.CONTENT_STACK_REGION || "us";
const language = process.env.CONTENT_STACK_LANGUAGE || "en-us";
export { environment, region, language };

// Delivery API setup
const deliveryApiKey =
  process.env.REACT_APP_CONTENT_STACK_DELIVERY_API_KEY || "";
const deliveryToken = process.env.REACT_APP_CONTENT_STACK_DELIVERY_TOKEN || "";
export const deliveryStack = contentstack.Stack({
  api_key: deliveryApiKey,
  delivery_token: deliveryToken,
  environment,
  region,
});

// Initialize the Contentstack management client
const contentstackClient = Contentstack.client();

// Get a stack instance
export const stack = contentstackClient.stack({
  api_key: apiKey,
  management_token: managementToken,
});

// Example: fetch entries of a content type
export async function fetchEntries(contentType: string) {
  // Use environment if needed in queries
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
