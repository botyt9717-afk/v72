const { spawn } = require("child_process");
const express = require('express');
const path = require('path');
const logger = require("./utils/log");

const app = express();
const port = process.env.PORT || 8080;

app.get('/', function (req, res) {
    if (path.extname(__dirname) === '') {
        res.send("🤖 BELAL BOTX666 IS ALIVE AND RUNNING!");
    } else {
        res.sendFile(path.join(__dirname, '/index.html'));
    }
});

app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    logger(`Server error: ${err.message}`, "[ Error ]");
});

global.countRestart = global.countRestart || 0;

function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Main.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 && global.countRestart < 5) {
            global.countRestart += 1;
            logger(`Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ Restarting ]");
            startBot();
        } else {
            logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
        }
    });

    child.on("error", (error) => {
        logger(`An error occurred: ${JSON.stringify(error)}`, "[ Error ]");
    });
};

startBot("BELAL BOTX666 Engine initialisi
    ng...");
