"use strict";
/*
 * Install.ts
 *
 * Description:
 * This file will download all necessary packages to the machine being used to run the master program
 *
 * Author: Grayson DeHerdt
 * Date: 9-29-2024
 * Version: 2.0
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
function installPak(packageName) {
    const installCommand = `npm install ${packageName}`;
    try {
        (0, node_child_process_1.execSync)(installCommand, { stdio: 'inherit' });
        console.log(`Successfully installed ${packageName}`);
    }
    catch (error) {
        console.error(`Failed to install ${packageName}`);
    }
}
installPak('multer');
installPak('multer-s3');
installPak('express');
installPak('express-validator');
installPak('fs');
installPak('path');
installPak('adm-zip');
installPak('dotenv');
installPak('winston');
installPak('node-ssh');
installPak('@aws-sdk/client-s3');
installPak('fs');
installPak('stream');
installPak('@aws-sdk/credential-provider-env');
installPak('@smithy/types');
installPak('adm-zip');
installPak('crypto');
installPak('aws-sdk');
installPak('mongoose');
installPak('semver');
installPak('archiver');
installPak('uuid');
process.exit(0);
//# sourceMappingURL=Install.js.map