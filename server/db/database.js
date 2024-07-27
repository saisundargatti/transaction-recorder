import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "database.sqlite");

export const initDB = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        amount REAL,
        description TEXT,
        date TEXT,
        running_balance REAL
      )
    `);

    console.log("Connected to the SQLite database.");
  } catch (err) {
    console.error("Error initializing database:", err.message);
  }
};

const updateRunningBalances = async (db) => {
  const transactions = await db.all(
    "SELECT * FROM transactions ORDER BY id ASC"
  );

  let runningBalance = 0;
  for (const transaction of transactions) {
    const adjustment =
      transaction.type === "Income"
        ? parseFloat(transaction.amount)
        : -parseFloat(transaction.amount);
    runningBalance += adjustment;

    await db.run("UPDATE transactions SET running_balance = ? WHERE id = ?", [
      runningBalance,
      transaction.id,
    ]);
  }
};

export const addTransaction = async (transaction) => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  try {
    await db.run(
      "INSERT INTO transactions (type, amount, description, date) VALUES (?, ?, ?, ?)",
      [
        transaction.type,
        transaction.amount,
        transaction.description,
        transaction.date,
      ]
    );

    await updateRunningBalances(db);

    return { message: "Transaction added successfully" };
  } catch (error) {
    console.error("Error adding transaction:", error.message);
    throw error;
  } finally {
    await db.close();
  }
};

export const getTransactions = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  const transactions = await db.all("SELECT * FROM transactions");
  return transactions;
};

export const updateTransaction = async (
  id,
  { type, amount, description, date }
) => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  try {
    await db.run(
      "UPDATE transactions SET type = ?, amount = ?, description = ?, date = ? WHERE id = ?",
      [type, amount, description, date, id]
    );

    await updateRunningBalances(db);

    const updatedTransaction = await db.get(
      "SELECT * FROM transactions WHERE id = ?",
      [id]
    );
    return updatedTransaction;
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    throw error;
  } finally {
    await db.close();
  }
};

export const deleteTransaction = async (id) => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  try {
    const transaction = await db.get(
      "SELECT * FROM transactions WHERE id = ?",
      [id]
    );

    if (!transaction) {
      console.error(`Transaction with id ${id} not found`);
      throw new Error("Transaction Not Found");
    }

    await db.run("DELETE FROM transactions WHERE id = ?", [id]);

    await updateRunningBalances(db);

    console.log(`Transaction with id ${id} deleted successfully`);
    return { message: "Transaction deleted successfully" };
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    throw error;
  } finally {
    await db.close();
  }
};
