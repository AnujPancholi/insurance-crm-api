const {
    workerData,
    parentPort,
} = require('worker_threads');
const Exceljs = require('exceljs');
const getLogger = require('../../utils/logger.js');
const {
    readRowWise,
} = require("../sheets/sheetDataIngestion.js");



const runWorker = async() => {

    const {
        filepath,
        filetype,
    } = workerData;
    
    await readRowWise({
        Exceljs,
        logger: getLogger({
            tag: "sheet-data-worker",
        }),
        parentPort,
    })(filepath,filetype);
}

runWorker();

