const path = require('path');
const fs = require('fs-extra');
const ejs = require('ejs');

const createLogin = async ({ authUrl }) => {
    return await new Promise((resolve, reject) => {
        ejs.renderFile(path.resolve(__dirname, '../src/pages/login.ejs'), {
                basePath: authUrl,
            }, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }
        );
    });
};

module.exports = createLogin;