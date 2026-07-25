import { serve } from "bun";
import index from "./index.html";
import { allProperties } from "./data/mockData";

const server = serve({
  routes: {
    "/api/properties": {
      async GET(req) {
        const url = new URL(req.url);
        const searchQuery = url.searchParams.get("search") || "";
        const zone = url.searchParams.get("zone") || "all";
        const condition = url.searchParams.get("condition") || "all";
        const type = url.searchParams.get("type") || "all";
        const sizeRange = url.searchParams.get("sizeRange") || "all";
        const sortBy = url.searchParams.get("sortBy") || "default";

        const filtered = allProperties.filter((property) => {
          if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            const matchesQuery =
              property.title.toLowerCase().includes(q) ||
              property.unitCode.toLowerCase().includes(q) ||
              property.location.toLowerCase().includes(q) ||
              property.floor.toString().includes(q) ||
              (property.description && property.description.toLowerCase().includes(q));

            if (!matchesQuery) return false;
          }

          if (zone !== "all" && property.zone !== zone) return false;
          if (condition !== "all" && property.condition !== condition) return false;
          if (type !== "all" && property.type !== type) return false;

          if (sizeRange !== "all") {
            const size = property.sizeSqm;
            if (sizeRange === "small" && size >= 150) return false;
            if (sizeRange === "medium" && (size < 150 || size > 300)) return false;
            if (sizeRange === "large" && (size <= 300 || size > 600)) return false;
            if (sizeRange === "whole" && size <= 600) return false;
          }

          return true;
        });

        if (sortBy === "price-asc") {
          filtered.sort((a, b) => a.numericPrice - b.numericPrice);
        } else if (sortBy === "price-desc") {
          filtered.sort((a, b) => b.numericPrice - a.numericPrice);
        } else if (sortBy === "size-desc") {
          filtered.sort((a, b) => b.sizeSqm - a.sizeSqm);
        } else if (sortBy === "size-asc") {
          filtered.sort((a, b) => a.sizeSqm - b.sizeSqm);
        } else if (sortBy === "floor-desc") {
          filtered.sort((a, b) => b.floor - a.floor);
        }

        return Response.json({
          properties: filtered,
          totalCount: filtered.length,
        });
      },
    },

    "/api/properties/:id": async (req) => {
      const id = req.params.id;
      const property = allProperties.find((p) => p.id === id);
      if (!property) {
        return Response.json({ error: "Property not found" }, { status: 404 });
      }
      return Response.json(property);
    },

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    // Serve index.html for all unmatched routes.
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

