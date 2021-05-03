// BUILD YOUR SERVER HERE
const express = require("express");
const User = require("./users/model.js");
const server = express();

server.use(express.json());

server.get("/api/users", (req, res) => {
  User.find()
    .then((users) => {
      console.log(users);
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({
        error: "cant fetch all users ",
        message: err.message,
        stack: err.stack,
      });
    });
});
server.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: `cannont find the dog with user ${req.params.id}`,
      });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({
      error: "something went bad getting the user",
      message: err.message,
      stack: err.stack,
    });
  }
});
server.post("/api/user", async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.name || !userData.bio) {
      res.status(422).json({
        message: "Invalid Formatting Of Request",
      });
    } else {
      const newUser = await User.insert(req.body);
      res.status(200).json({
        message: "user created succesfully",
        payload: newUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "something went bad getting user",
      message: err.message,
      stack: err.stack,
    });
  }
});
server.put("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userToPut = req.body;
    if (!req.body.name || !req.body.bio) {
      res.status(422).json({
        message: "name and bio are required",
      });
    } else {
      const updateUser = User.update(id, userToPut);
      if (!updateUser) {
        res.status(404).json({
          message: `dog with id of ${req.params.id} does nto exist`,
        });
      } else {
        console.log(updateUser);
        res.json(updateUser);
      }
    }
  } catch (err) {
    res.status(500).json({
      error: "something went bad getting user",
      message: err.message,
      stack: err.stack,
    });
  }
});
server.delete("/api/user/:id", (req, res) => {
  User.remove(req.params.id)
    .then((stuff) => {
      console.log("deleted", stuff);
      res.json(stuff);
    })
    .catch((err) => {
      res.status(500).json({
        error: "something went bad deleting new user",
        message: err.message,
        stack: err.stack,
      });
    });
});
module.exports = server; // EXPORT YOUR SERVER instead of {}
