import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  initDB,
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "./db/database.js";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Initialize SQLite database
initDB();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Transactions API!");
});

app.post("/transactions", async (req, res) => {
  try {
    const { type, amount, description, date } = req.body;
    const transaction = await addTransaction({
      type,
      amount,
      description,
      date,
    });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await getTransactions();
    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, date } = req.body;
    const transaction = await updateTransaction(id, {
      type,
      amount,
      description,
      date,
    });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteTransaction(id);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting transaction:", error.message);

    // Handle specific error types for better error handling
    if (error.message === "Transaction Not Found") {
      res.status(404).json({ message: "Transaction not found" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
