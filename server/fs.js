const FS = require('fs-extra');

FS.readFilePromise = (filePath) => {
    return new Promise((resolve, reject) => {
        FS.readFile(filePath, (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

FS.writeFilePromise = (filePath, data, options) => {
    return new Promise((resolve, reject) => {
        FS.writeFile(filePath, data, options, (err) => {
            if (err) { reject(err); }
            else { resolve(); }
        });
    });
};

FS.unlinkFilePromise = (filePath) => {
    return new Promise((resolve, reject) => {
        FS.unlink(filePath, (err) => {
            if (err) { reject(err); }
            else { resolve(); }
        });
    });
};

module.exports = FS;
