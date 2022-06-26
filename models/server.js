const express = require("express");
const fs = require("fs");

const courses = require("../courses");

class Server {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.static("public"));
    this.app.use(express.json());
  }

  listen() {
    this.app.listen(this.port, () => console.log(`Listening on port ${3000}`));
  }

  routes() {
    // === GET COURSES ===
    this.app.get("/api/courses", (req, res) => {
      res.json({
        courses,
      });
    });

    // === GET SINGLE COURSE===
    this.app.get("/api/course/:id", (req, res) => {
      const id = req.params.id;
      const [course] = courses.filter((c) => c.code === id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      const { code, name, credits, instructor } = course;

      res.json({
        code,
        name,
        credits,
        instructor,
      });
    });

    // === POST ===
    this.app.post("/api/courses", (req, res) => {
      // Save in db
      courses.push(req.body);
      fs.writeFile("courses.json", JSON.stringify(courses), (err) => {
        if (err) throw err;
      });

      // Return response
      const { code, name, credits, instructor } = req.body;
      const createdAt = new Date();

      res.status(201).json({
        code,
        name,
        credits,
        instructor,
        createdAt,
      });
    });

    // === PUT ===
    this.app.put("/api/course/:id", (req, res) => {
      const id = req.params.id;
      const { code, name, credits, instructor } = req.body;

      const updated = courses.map((c) => {
        c.code === id ? { id, code, name, credits, instructor } : c;
      });

      fs.writeFile("courses.json", JSON.stringify(updated), (err) => {
        if (err) throw err;
      });

      const updatedAt = new Date();

      res.json({
        code,
        name,
        credits,
        instructor,
        updatedAt,
      });
    });

    // === DELETE ===
    this.app.delete("/api/course/:id", (req, res) => {
      const id = req.params.id;

      const updated = courses.filter((c) => c.code !== id);
      fs.writeFile("courses.json", JSON.stringify(updated), (err) => {
        if (err) throw err;
      });

      res.json({
        message: `Course with code ${id} deleted`,
      });
    });
  }
}

module.exports = Server;
