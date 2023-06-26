"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
//import morgain from 'morgan';
//import cors from 'cors';
require("dotenv/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//app.use(morgan('tiny'));
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.get('/', (req, res) => {
    res.send('runnin express');
});
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log('server is running in port ' + PORT);
});
//# sourceMappingURL=index.js.map