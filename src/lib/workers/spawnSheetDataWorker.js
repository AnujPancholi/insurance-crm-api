const {
    Worker,
} = require('worker_threads');
const path = require('path');
const {
    ingestParsedRowData,
} = require('../sheets/sheetDataIngestion.js');



const spawnSheetDataWorker = (deps) => {

    const {
        logger,
        db,
    } = deps;

    const ingestRowData = ingestParsedRowData({
        db,
    })

    return async (data) => {
        
        const filepath = data.filePath || "";
        const filename = data.filePath.split('/').slice(-1)[0];
        const filetype = filename.split('.')[1];

        logger.info(`Filename:${filename}:Spawning worker`);
        const worker = new Worker(path.resolve(__dirname,'./sheetDataWorker.js'), {
            workerData: {
                filepath,
                filetype,
            },
        });
    
        worker.on('message',async (data) => {
            logger.info({
                msg: `Filename:${filename}:Worker returned data`,
                data: data,
            });
            const rowIngestionResult = await ingestRowData(data);

            logger[['error','info'][Number(rowIngestionResult.isSuccessful)]]({
                msg: `Row ingestion result`,
                result: rowIngestionResult,
            })
        })
    
        worker.on('error',(err) => {
            logger.error({
                msg: `Filename:${filename}:Worker returned error`,
                error: {
                    message: err.message,
                },
            });
        })
    
        worker.on('exit',(exitCode) => {
            logger.info({
                msg: `Filename:${filename}:Worker exited with exit code ${exitCode}`,
            });
        })
    
    }
}  

module.exports = spawnSheetDataWorker;

