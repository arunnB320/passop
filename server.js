import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'pass-manager';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors())

async function main() {
  await client.connect();
  const db = client.db(dbName);

  app.get('/', async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  });

  app.post('/', async (req, res) => {
    const password = req.body
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult });
  });

  // delete password
  app.delete('/', async (req, res) => {
    const { id } = req.body;   // frontend se id mil rahi hai
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ id: id }); // uuid ke basis par delete
    res.send({ success: true, result });
  });
  

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main().catch(console.error);
