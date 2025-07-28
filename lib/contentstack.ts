import Contentstack from "contentstack";
import contentstackManagement from "@contentstack/management";

const apiKey = process.env.CONTENTSTACK_API_KEY!;
const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN!;
const environment = process.env.CONTENTSTACK_ENVIRONMENT!;
const regionEnv = process.env.CONTENTSTACK_REGION || "us";
const branch = process.env.CONTENTSTACK_BRANCH || "main";

// Map region string to Contentstack.Region enum
const region =
  regionEnv === "eu"
    ? Contentstack.Region.EU
    : regionEnv === "azure-na"
    ? Contentstack.Region.AZURE_NA
    : Contentstack.Region.US;

export const stack = Contentstack.Stack({
  api_key: apiKey,
  delivery_token: deliveryToken,
  environment,
  region,
  branch,
});

export const managementClient = contentstackManagement.client({
  authtoken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
});
