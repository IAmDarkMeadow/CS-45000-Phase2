"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPackage = void 0;
const s3Service_1 = require("../services/s3Service");
const downloadPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { packageName, packageVersion } = req.params;
        if (!packageName || !packageVersion) {
            res.status(400).json({ error: 'Package name and version are required.' });
            return;
        }
        const s3Key = `${packageName}/${packageVersion}/package.zip`;
        const fileStream = yield (0, s3Service_1.downloadFromS3)(s3Key);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${packageName}-${packageVersion}.zip`);
        fileStream.pipe(res);
    }
    catch (error) {
        console.error('Download Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.downloadPackage = downloadPackage;
//# sourceMappingURL=downloadController.js.map