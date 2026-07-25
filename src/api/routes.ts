import { allProperties } from "../data/mockData";

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // GET /api/properties
  if (pathname === "/api/properties" && request.method === "GET") {
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
  }

  // GET /api/properties/:id
  const propMatch = pathname.match(/^\/api\/properties\/([^/]+)$/);
  if (propMatch && request.method === "GET") {
    const id = propMatch[1];
    const property = allProperties.find((p) => p.id === id);
    if (!property) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }
    return Response.json(property);
  }

  // Not an API route managed here
  return null;
}
