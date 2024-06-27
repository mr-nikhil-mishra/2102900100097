const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const windowSize = 10;
let windowNumbers = [];

const types = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand",
};

app.get("/numbers/:numberid", async (req, res) => {
  const numberid = req.params.numberid;
  const validIds = ["p", "f", "e", "r"];

  if (!validIds.includes(numberid)) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const bearerToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE5NDgzOTI2LCJpYXQiOjE3MTk0ODM2MjYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjJmYjgxYjkzLThmZmEtNDJlZS04ZWQ2LTc3YmQzMGJjODkyNyIsInN1YiI6Im5pa2hpbDIwMjFjczEwOEBhYmVzaXQuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiQUJFU0lUIiwiY2xpZW50SUQiOiIyZmI4MWI5My04ZmZhLTQyZWUtOGVkNi03N2JkMzBiYzg5MjciLCJjbGllbnRTZWNyZXQiOiJNTUNqU0ZrS21JSk1HYVJvIiwib3duZXJOYW1lIjoiTmlraGlsIE1pc2hyYSIsIm93bmVyRW1haWwiOiJuaWtoaWwyMDIxY3MxMDhAYWJlc2l0LmVkdS5pbiIsInJvbGxObyI6IjIxMDI5MDAxMDAwOTcifQ.3BuYwb_8TmGgpbNjrQYgyBrHiao-FpcPmhj8eF-xHgU";

  try {
    const response = await axios.get(
      `http://20.244.56.144/test/${types[numberid]}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        timeout: 500,
      }
    );

    const fetchedNumbers = response.data.numbers;

    // Making numbers unique
    const uniqueNumbers = [...new Set(fetchedNumbers)];

    // Storing previous state of the window
    const previousState = [...windowNumbers];

    // Adding unique numbers to the window and maintaining the window size
    uniqueNumbers.forEach((number) => {
      if (!windowNumbers.includes(number)) {
        if (windowNumbers.length >= windowSize) {
          windowNumbers.shift();
        }
        windowNumbers.push(number);
      }
    });

    // Calculate the average
    const average =
      windowNumbers.reduce((sum, num) => sum + num, 0) / windowNumbers.length;

    res.status(200).json({
      windowPrevState: previousState,
      windowCurrState: windowNumbers,
      numbers: uniqueNumbers,
      avg: average.toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch numbers from the third-party server" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
