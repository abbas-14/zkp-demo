var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { runForProof } from './zok.js';
import cors from 'cors';
//const express = require('express');
import bodyParser from 'body-parser';
import express from 'express';
const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(cors());
let dataStore = {};
let status = 'No data received';
app.post('/api/prove', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    console.log('prove: ', data);
    if (data) {
        if (data instanceof Array) {
            const proof = yield runForProof(data);
            if (proof == null) {
                return res.status(200).json({ msg: 'proof-err' });
            }
            res.status(200).json({ proof });
        }
        else {
            res.status(200).json({ msg: 'data-arr' });
        }
    }
    else {
        res.status(200).json({ msg: 'data-none' });
    }
}));
app.get('/', (req, res) => {
    res.status(200).json({ status });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
