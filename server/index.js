const HTTP = require('http');
const BodyParser = require('body-parser');
const Express = require('express');
const CronParser = require('cron-parser');
const Cron = require('./cron');

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || 'DEVELOPMENT';

const app = Express();

app.use(BodyParser.urlencoded({
    extended: true
}));
app.use(BodyParser.json());

app.use(Express.static('public'));

// Response header middleware
app.use((req, resp, next) => {
    resp.setHeader('Content-Type', 'application/json');
    next();
});

function developmentOnly(req, resp, next) {
    if (ENVIRONMENT.includes('PROD')) {
        resp.statusCode = 405;
        resp.send({
            error: "Operation not permitted in production"
        });
    } else {
        next();
    }
}

function parseJobRequest(req, resp, next) {
    const name = req.body.name.replace(' ', '-');
    const script = req.body.script;
    const cronExpr = req.body.cron;
    let cron = null;
    try {
        cron = CronParser.parseExpression(cronExpr);
    } catch (err) {
        resp.statusCode = 400;
        resp.send({
            error: err.message
        });
        return;
    }
    req.job = {
        name: name,
        cronExpr: cronExpr,
        cron: cron,
        script: script
    };
    next();
}

app.delete('/jobs', developmentOnly, (req, resp, next) => {
    Cron.deleteJob(req.query.name).then(() => {
        resp.send({success: true});
    }).catch(err => {
        resp.statusCode = 500;
        resp.send({success: false});
    });
});

app.get('/jobs', (req, resp, next) => {
    Cron.getJobs().then(jobs => {
        resp.send(jobs);
    }).catch(err => {
        resp.statusCode = 500;
        resp.send({error: err.message});
    });
});

app.post('/jobs', developmentOnly, parseJobRequest, (req, resp, next) => {
    Cron.updateJob(req.job, false)
        .then(response => resp.send(response))
        .catch(err => {
            resp.statusCode = 500;
            resp.send({error: err.message});
        });
});

app.put('/jobs', developmentOnly, parseJobRequest, (req, resp, next) => {
    Cron.getJobs().then(existingJobs => {
        if (existingJobs[req.job.name]) {
            resp.statusCode = 403;
            resp.send({
                error: "Job already exists"
            });
        } else {
            Cron.updateJob(req.job)
                .then(response => resp.send(response))
                .catch(err => {
                    resp.statusCode = 500;
                    resp.send({error: err.message});
                });
        }
    }).catch(err => {
        console.log('deu ruim no getJobs:', JSON.stringify(err));
        resp.statusCode = 500;
        resp.send({error: err.message});
    });
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log('changed');
});
