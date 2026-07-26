import { handleApiRequest } from "./api/routes";

export interface Env {
  DB?: any;
  MEDIA_BUCKET?: any;
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env, _ctx: unknown): Promise<Response> {
    // 1. Check if the request matches an API endpoint
    const apiResponse = await handleApiRequest(request, env);
    if (apiResponse) {
      return apiResponse;
    }

    // 2. Fall back to serving static assets / SPA frontend via Cloudflare Workers Assets
    return env.ASSETS.fetch(request);
  },
};
