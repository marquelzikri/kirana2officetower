import { serve } from "bun";

import { handleApiRequest } from "./api/routes";
import index from "./index.html";

const server = serve({
  routes: {
    "/api/*": async (req) => {
      const apiResponse = await handleApiRequest(req as unknown as Request);
      return apiResponse ?? Response.json({ error: "API Route not found" }, { status: 404 });
    },
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
