const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04a74f4419f5259aa6f95b0f1b4f4c5c5fff07374ffe959e8b6faa89129eb33d3f9e7a02b647fcb586ed8c0d3a17b9510500106b9354d463f834cf330a1b1e286a": 100,
  "04b1e7f5da1fd8fd5e84f3bfc85fcf05b05f91d823e3ba9a92f27553d7007cb6ee10da6090744823a2a23968a41fe8d02b252ca2b6337dd819f3b4d0910e3d2127": 50,
  "04cef751905ca8022145d82210fc15cc7d251c6aa7578374ecc0e8613936b1b4dc284bce1e632eb3c67700c2df4d142c0bfd0313c414343c28eca968eb7b017811": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
