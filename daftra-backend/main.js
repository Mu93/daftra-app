import express from "express";
import fs from "fs/promises"; // Use async versions of file operations
import cors from "cors";

const PORT = process.env.PORT || 8081;
const ERROR_CHANCE = parseFloat(process.env.ERROR_CHANCE) || 0.1; // Configurable error chance

const app = express();
app.use(cors());
app.use(express.json());

// Simulated Random Failure Middleware
app.use((req, res, next) => {
  if (Math.random() <= ERROR_CHANCE) return res.sendStatus(500);
  next();
});

// Tracking Endpoint
app.post("/track", (req, res) => {
  const { id, from, to } = req.body;
  if (!id || from === undefined || to === undefined) {
    return res.status(400).json({ error: "Bad Request" });
  }
  res.sendStatus(204);
});

// Get Navigation Data
app.get("/nav", async (req, res, next) => {
  try {
    const data = await fs.readFile("nav.json", "utf8").catch(() => null);
    if (data) return res.json(JSON.parse(data));

    // Default navigation data if file doesn't exist
    return res.json([
      { id: 1, title: "Dashboard", target: "/" },
      {
        id: 2,
        title: "Job Applications",
        target: "/applications",
        children: [
          { id: 7, title: "John Doe", target: "/applications/john-doe" },
          { id: 10, title: "James Bond", target: "/applications/james-bond" },
          {
            id: 20,
            title: "Scarlett Johansson",
            target: "/applications/scarlett-johansson",
            visible: false,
          },
        ],
      },
      {
        id: 3,
        title: "Companies",
        target: "/companies",
        visible: false,
        children: [
          { id: 8, title: "Tanqeeb", target: "/companies/1" },
          { id: 9, title: "Daftra", target: "/companies/2" },
          { id: 11, title: "TBD", target: "/companies/14" },
        ],
      },
      {
        id: 4,
        title: "Qualifications",
        children: [
          { id: 14, title: "Q1", target: "/q1" },
          { id: 15, title: "Q2", target: "/q2" },
        ],
      },
      { id: 5, title: "About", target: "/about" },
      { id: 6, title: "Contact", target: "/contact" },
    ]);
  } catch (error) {
    next(error);
  }
});

// Update Navigation Data
app.post("/nav", async (req, res, next) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).send("Bad Request");

    await fs.writeFile("nav.json", JSON.stringify(items, null, 2));
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
