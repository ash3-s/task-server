require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 8000; 

// Middleware to parse JSON and form data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Start the server

const { MongoClient, ObjectId } = require("mongodb");
const e = require("express");

const uri = `mongodb+srv://fifa14gamer2016:${process.env.MONGO_PASS}@leetcluster.wxjnof1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToDB();

// Endpoint to add a task
app.post("/addTask", async (req, res) => {
  const { name, description } = req.body;
  const task = { id: `task-${Date.now()}`, name, description };
  const db = client.db("123");
  const collection = db.collection("tasks");
  collection
    .updateOne(
      { _id: "taskinfo" },
      {
        $push: { todo: task },
      }
    )
    .then((err) => {
      res.status(201).json(`Task added successfully`);
    })
    .catch((e) => {
      res.status(400).send("Unable to add task");
    });
});

//Endpoint to get all tasks
app.get("/getTasks", async (req, res) => {
  try {
    const db = client.db("123");
    const collection = db.collection("tasks");
    const document = await collection.findOne({ _id: "taskinfo" });
    if (document) {
      res.status(200).json(document);
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

//Endpoint to update tasks
app.post("/updateTasks", async (req, res) => {
  const { tasks } = req.body; // tasks is an object with arrays for todo, inProgress, done
  const db = client.db("123");
  const collection = db.collection("tasks");
  collection
    .updateOne(
      { _id: "taskinfo" },
      {
        $set: {
          todo: tasks.todo,
          inProgress: tasks.inProgress,
          done: tasks.done,
        },
      }
    )
    .then((err) => {
      res.status(200).send({ message: "Tasks updated successfully" });
    })
    .catch((error) => {
      res.status(500).send({ message: "Failed to update tasks", error });
    });
});

// Endpoint to delete a task
app.post("/deleteTask", async (req, res) => {
  const { column, taskId } = req.body;
  const db = client.db("123");
  const collection = db.collection("tasks");
  collection
    .updateOne({ _id: "taskinfo" }, { $pull: { [column]: { id: taskId } } })
    .then((err) => {
      res.status(200).send({ message: "Tasks deleted successfully" });
    })
    .catch((error) => {
      res.status(500).send({ message: "Failed to delete tasks", error });
    });
});

//Endpoint to edit a task
app.post("/editTask", async (req, res) => {
  const { column, taskId, name, description } = req.body;
  const db = client.db("123");
  const collection = db.collection("tasks");
  collection
    .updateOne(
      { _id: "taskinfo", [`${column}.id`]: taskId },
      {
        $set: {
          [`${column}.$.name`]: name,
          [`${column}.$.description`]: description,
        },
      }
    )
    .then((err) => {
      res.status(200).send({ message: "Tasks updated successfully" });
    })
    .catch((error) => {
      res.status(500).send({ message: "Failed to update tasks", error });
    });
});
