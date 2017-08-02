const FS = require('fs');

FS.readFilePromise = (filePath) => {
    return new Promise((resolve, reject) => {
        FS.readFile(filePath, (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

FS.writeFilePromise = (filePath, data) => {
    return new Promise((resolve, reject) => {
        FS.writeFile(filePath, data, (err) => {
            if (err) { reject(err); }
            else { resolve(); }
        });
    });
};

module.exports = FS;
