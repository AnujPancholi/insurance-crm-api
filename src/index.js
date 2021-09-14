"use strict";
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname,"../.env"),
})
const CONFIG = require('./config.js');
const app = require('./app.js');
const mongoLib = require('./lib/mongo.js');
const getLogger = require('./utils/logger.js');



const processExitCleanup = (deps) => {
    const {
        mongoLib,
    } = deps;

    return () => {
        const dbClientInstance = mongoLib.getClientInstance();
        if (
        dbClientInstance instanceof mongoLib.MongoClient &&
        dbClientInstance.isConnected()
        ) {
        dbClientInstance.close();
        }
    };
}

const startServer = (deps) => {

    const {
        app,
        getLogger,
        mongoLib,
        processExitCleanup,
    } = deps;

    const startupLogger = getLogger({
        tag: "startup",
    })

    const anomalyLogger = getLogger({
        tag: "anomaly",
    })

    const processCleanup = processExitCleanup({
        mongoLib,
    })

    return async () => {
        try {

            const mongoClient = await mongoLib.connectClientInstance({
                url: CONFIG.DB_URI,
            })

            const db = mongoClient.db(CONFIG.DB_NAME);
            
            app({
                getLogger,
                db,
            }).listen(CONFIG.PORT,() => {
                startupLogger.info(`${CONFIG.SERVICE_NAME} listening on port ${CONFIG.PORT}`);
            })


            process
            .on("unhandledRejection", (reason, p) => {
            anomalyLogger.error("Unhandled Rejection at Promise", p);
            })
            .on("uncaughtException", (err) => {
            anomalyLogger.error("Uncaught Exception thrown");
            processCleanup();
            process.exit(1);
            })
            .on("SIGINT", function () {
            anomalyLogger.info("SIGINT observed");
            processCleanup();
            process.exit(0);
            });

        } catch (e) {
            startupLogger.error(`Error in starting server: ${e.message}`);
            processCleanup();
            process.exit(1);
        }
    }
}

startServer({
    app,
    mongoLib,
    getLogger,
    processExitCleanup,
})();