const FS = require('./fs');
const Path = require('path');
const ChildProcess = require('child_process');

const CRONS_PATH = process.env.CRONS_PATH || '/usr/src/cron/schedules';
const RELOAD_CRONTAB_CWD = '..';
const RELOAD_CRONTAB_SCRIPT = "setup-cron.sh";
const CRON_CONFIG = "cron.conf";
const CRON_SERVICE = "service.sh";

class Cron {
    cronDirectories() {
        return new Promise((accept, reject) => {
            FS.readdir(CRONS_PATH, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                const directories = files.filter(file => {
                    const stats = FS.statSync(Path.join(CRONS_PATH, file));
                    return stats.isDirectory();
                });
                accept(directories);
            });
        });
    }

    getJobs() {
        return new Promise((resolve, reject) => {
            this.cronDirectories().then(directories => {
                const jobPromises = directories.map(dir =>
                    new Promise((resolve, reject) => {
                        const job = {
                            name: Path.basename(dir),
                            cron: '',
                            script: ''
                        };
                        const basePath = Path.join(CRONS_PATH, dir);
                        const config = Path.join(basePath, CRON_CONFIG);
                        const service = Path.join(basePath, CRON_SERVICE);
                        Promise.all([
                            FS.readFilePromise(config),
                            FS.readFilePromise(service)
                        ]).then(([cron, script]) => {
                            job.cron = cron.toString();
                            job.script = script.toString();
                        }).catch(err => {
                            job.cron = "Unable to find cron data";
                            job.script = "Unable to find cron data";
                        }).then(() => {
                            resolve(job);
                        });
                    })
                );
                Promise.all(jobPromises)
                    .then(results => {
                        resolve(results.reduce((prev, cur) => {
                            prev[cur.name] = cur;
                            return prev;
                        }, {}));
                    }).catch(reject);
            });
        });
    }

    updateJob(job, create = true) {
        return new Promise((resolve, reject) => {
            const jobPath = Path.join(CRONS_PATH, job.name);
            const EEXIST = -17;
            FS.mkdir(jobPath, (err) => {
                if (err && (create || err.errno !== EEXIST)) { reject(err); }
                const config = Path.join(jobPath, CRON_CONFIG);
                const service = Path.join(jobPath, CRON_SERVICE);
                const script = job.script.replace(/\r\n|\r|\n/g, '\n');
                Promise.all([
                    FS.writeFilePromise(config, job.cronExpr),
                    FS.writeFilePromise(service, script, {mode: '755'})
                ]).then(() =>
                    this.updateCrontab().then(() =>
                        resolve({
                            name: job.name,
                            cron: job.cronExpr,
                            script: job.script
                        })
                    ).catch(reject)
                ).catch(reject);
            });
        });
    }

    deleteJob(job) {
        const jobPath = Path.join(CRONS_PATH, job);
        return FS.remove(jobPath);
    }

    updateCrontab() {
        return new Promise((resolve, reject) => {
            const options = {
                cwd: RELOAD_CRONTAB_CWD
            };
            const command = '/bin/bash ' + RELOAD_CRONTAB_SCRIPT;
            ChildProcess.exec(command, options, (err, stdout, stderr) => {
                console.log(stdout);
                console.error(stderr);
                if (err) { reject(err); }
                else { resolve(true); }
            });
        });
    }
}

module.exports = new Cron();
