import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { DocumenuService } from "./documenu.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d61ee9e1/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize Documenu service
const getDocumenuService = () => {
  const apiKey = Deno.env.get("DOCUMENU_API_KEY");
  if (!apiKey) {
    throw new Error("DOCUMENU_API_KEY environment variable is not set");
  }
  return new DocumenuService(apiKey);
};

// Search restaurants by geo location
app.get("/make-server-d61ee9e1/restaurants/search", async (c) => {
  try {
    const lat = c.req.query("lat");
    const lon = c.req.query("lon");
    const distance = c.req.query("distance") || "5";
    const cuisine = c.req.query("cuisine");
    const size = c.req.query("size") || "25";
    const page = c.req.query("page") || "1";
    const fullmenu = c.req.query("fullmenu") === "true";

    if (!lat || !lon) {
      return c.json({ error: "lat and lon are required" }, 400);
    }

    const documenu = getDocumenuService();
    const result = await documenu.searchRestaurantsByGeo({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      distance: parseFloat(distance),
      cuisine,
      size: parseInt(size),
      page: parseInt(page),
      fullmenu,
    });

    // Transform restaurants to GreenLight format
    const transformedRestaurants = result.data?.map((r: any) => 
      documenu.transformRestaurant(r)
    ) || [];

    return c.json({
      restaurants: transformedRestaurants,
      total: result.total_results || 0,
      page: parseInt(page),
    });
  } catch (error) {
    console.error("Error searching restaurants:", error);
    return c.json({ error: `Failed to search restaurants: ${error.message}` }, 500);
  }
});

// Search restaurants by state
app.get("/make-server-d61ee9e1/restaurants/state/:state", async (c) => {
  try {
    const state = c.req.param("state");
    const cuisine = c.req.query("cuisine");
    const size = c.req.query("size") || "25";
    const page = c.req.query("page") || "1";
    const fullmenu = c.req.query("fullmenu") === "true";

    const documenu = getDocumenuService();
    const result = await documenu.getRestaurantsByState(state, {
      cuisine,
      size: parseInt(size),
      page: parseInt(page),
      fullmenu,
    });

    // Transform restaurants to GreenLight format
    const transformedRestaurants = result.data?.map((r: any) => 
      documenu.transformRestaurant(r)
    ) || [];

    return c.json({
      restaurants: transformedRestaurants,
      total: result.total_results || 0,
      page: parseInt(page),
    });
  } catch (error) {
    console.error("Error getting restaurants by state:", error);
    return c.json({ error: `Failed to get restaurants: ${error.message}` }, 500);
  }
});

// Search restaurants by zip code
app.get("/make-server-d61ee9e1/restaurants/zip/:zipCode", async (c) => {
  try {
    const zipCode = c.req.param("zipCode");
    const cuisine = c.req.query("cuisine");
    const size = c.req.query("size") || "25";
    const page = c.req.query("page") || "1";
    const fullmenu = c.req.query("fullmenu") === "true";

    const documenu = getDocumenuService();
    const result = await documenu.getRestaurantsByZipCode(zipCode, {
      cuisine,
      size: parseInt(size),
      page: parseInt(page),
      fullmenu,
    });

    // Transform restaurants to GreenLight format
    const transformedRestaurants = result.data?.map((r: any) => 
      documenu.transformRestaurant(r)
    ) || [];

    return c.json({
      restaurants: transformedRestaurants,
      total: result.total_results || 0,
      page: parseInt(page),
    });
  } catch (error) {
    console.error("Error getting restaurants by zip:", error);
    return c.json({ error: `Failed to get restaurants: ${error.message}` }, 500);
  }
});

// Get single restaurant with full menu
app.get("/make-server-d61ee9e1/restaurant/:id", async (c) => {
  try {
    const restaurantId = c.req.param("id");

    const documenu = getDocumenuService();
    const result = await documenu.getRestaurant(restaurantId);

    // Transform restaurant and menu items
    const restaurant = documenu.transformRestaurant(result);
    const menuItems = documenu.transformMenuItems(result);

    return c.json({
      restaurant,
      menuItems,
    });
  } catch (error) {
    console.error("Error getting restaurant:", error);
    return c.json({ error: `Failed to get restaurant: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);