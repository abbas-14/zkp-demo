import {runForProof} from './zok.js'
import cors from 'cors'
//const express = require('express');
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let dataStore = {};
let status = 'No data received';

app.post('/api/prove', async (req: Request, res: Response) => {
  const { data } = req.body;
  console.log('prove: ', data)
  if (data) {
    if(data instanceof Array) {
      const proof = await runForProof(data)
      if(proof == null) {
        return res.status(200).json({ msg: 'proof-err' })
      }
      res.status(200).json({ proof });
    } else {
      res.status(200).json({ msg: 'data-arr' });
    }
  } else {
    res.status(200).json({ msg: 'data-none' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
