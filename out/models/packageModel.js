"use strict";
/*
 * packageModel.ts
 *
 * Description:
 * This file contains the TypeScript interface for module metadata used in the master program.
 *
 * Author: Jacob Esparza, Brayden Devenport
 * Date: 12-02-2024
 * Version: 2.0
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipDirectory = void 0;
const archiver_1 = __importDefault(require("archiver"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const zipDirectory = (sourceDir, outPath) => __awaiter(void 0, void 0, void 0, function* () {
    const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
    const stream = fs_extra_1.default.createWriteStream(outPath);
    return new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', (err) => reject(err))
            .pipe(stream);
        stream.on('close', () => resolve());
        archive.finalize();
    });
});
exports.zipDirectory = zipDirectory;
//# sourceMappingURL=packageModel.js.map