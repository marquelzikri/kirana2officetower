import { handleApiRequest } from "../src/api/routes";

export const onRequest: PagesFunction = async (context) => {
  const apiResponse = await handleApiRequest(context.request);
  if (apiResponse) {
    return apiResponse;
  }
  return context.next();
};
