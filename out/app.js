"use strict";
/*
 *
 * app.ts
 *
 *
 * Description:
 *
 *
 *
 *
 *
 *
 *
 * Author: Brayden Devenport
 * Date: 12-02-2024
 * Version: 1.0
 *
 *
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const packageRoutes_1 = __importDefault(require("./routes/packageRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/packages', packageRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});
exports.default = app;
//# sourceMappingURL=app.js.map