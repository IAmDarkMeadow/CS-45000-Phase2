"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// download.ts
const express_1 = __importDefault(require("express"));
const downloadController_1 = require("../controllers/downloadController");
const router = express_1.default.Router();
// Download endpoint
router.get('/download/:packageName/:packageVersion', downloadController_1.downloadPackage);
exports.default = router;
//# sourceMappingURL=download.js.map