"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Determine if we're inside EC2 (for example by checking an EC2-specific environment variable or IP)
const isEC2 = process.env.EC2_INSTANCE === 'true';
const connection = mysql2_1.default.createConnection({
    host: isEC2 ? 'registry.c9iuei0e04va.us-east-2.rds.amazonaws.com' : process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    connectTimeout: 30000,
});
// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
});
// Example of querying the database
connection.query('SELECT * FROM registry LIMIT 10', (err, results, fields) => {
    if (err) {
        console.error('Error executing query:', err);
        return;
    }
    console.log('Results:', results);
});
// Close the connection when done
connection.end();
//# sourceMappingURL=TestUploadToDatabase.js.map