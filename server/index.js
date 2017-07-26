const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const CRONS_PATH = process.env.CRONS_PATH || '/usr/src/cron/schedules'
const CRON_CONFIG = "cron.conf";
const CRON_SERVICE = "service.sh"

const app = express();

function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

function cronDirectories() {
    return new Promise((accept, reject) => {
        fs.readdir(CRONS_PATH, (err, files) => {
            if (err) {
                console.log('faile to read directory:', CRONS_PATH);
                resp.statusCode = 500;
                resp.send({ 'success': false, 'error': 'failed to read cron directory' });
                reject(err);
                return;
            }
            const directories = files.filter(file => {
                const stats = fs.statSync(path.join(CRONS_PATH, file));
                return stats.isDirectory();
            })
            accept(directories);
        });
    });
}

// Response header middleware
app.use((req, resp, next) => {
    resp.setHeader('Content-Type', 'application/json');
    next();
});

app.get('/jobs', (req, resp, next) => {
    cronDirectories().then(directories => {
        const jobPromises = directories.map(dir => {
            return new Promise((resolve, reject) => {
                const job = {
                    name: path.basename(dir),
                    cron: '',
                    script: ''
                };
                Promise.all([
                    readFilePromise(path.join(CRONS_PATH, dir, CRON_CONFIG)),
                    readFilePromise(path.join(CRONS_PATH, dir, CRON_SERVICE))
                ]).then(([cron, script]) => {
                    job.cron = cron.toString();
                    job.script = script.toString();
                }).catch(err => {
                    job.cron = "Unable to find cron data";
                    job.script = "Unable to find cron data";
                }).then(() => {
                    resolve(job);
                });
            });
        });
        Promise.all(jobPromises).then(jobs => {
            resp.statusCode = 200;
            resp.send(jobs);
        });
    });
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
