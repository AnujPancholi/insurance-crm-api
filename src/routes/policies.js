const CONFIG = require('../config.js');
const express = require('express');
const multer = require('multer');
const ExtendedError = require('../lib/errors/extendedError.js');
const {
    getRandomHexStr,
} = require('../utils/randomizer.js');
const {
    getResponseObj,
} = require('../utils/responseUtils.js');
const {
    INGESTION_SHEET_MIMETYPE_CONFIG,
} = require('../lib/sheets/ingestionSheetConfig.js');
const spawnSheetWorker = require('../lib/workers/spawnSheetDataWorker.js');

const uploadSheetToDisk = (deps) => {
    const {
        multer,
        sheetMimetypeConfig,
    } = deps;
    
    return multer({
    storage: multer.diskStorage({
        filename: (req,file,cbFn) => {
            const mimetypeConfig = sheetMimetypeConfig[file.mimetype];
            if(!mimetypeConfig || !mimetypeConfig.type){
                return cbFn(new ExtendedError(`Sheet type not found for mimetype ${file.mimetype}`,400));
            }
            cbFn(null,`${getRandomHexStr()}.${mimetypeConfig.type}`);
        }
    }),
    fileFilter: (req,file,cbFn) => {
        const mimetypeConfig = sheetMimetypeConfig[file.mimetype] || null;
        if(!mimetypeConfig){
            return cbFn(new ExtendedError(`Invalid file mimetype: ${file.mimetype}`,400));
        }
        cbFn(null, true);
    },
})

}

const getPoliciesRouter = (deps) => {
    const {
        getLogger,
    } = deps;

    const logger = getLogger({
        tag: "policies",
    })

    const sheetWorkerLogger = getLogger({
        tag: 'spawn-sheet-worker',
    })

    const policiesRouter = express.Router();

    policiesRouter.post('/sheet/upload', uploadSheetToDisk({
        multer,
        sheetMimetypeConfig: INGESTION_SHEET_MIMETYPE_CONFIG,
    }).single('sheet'), async(req,res,next) => {
        logger.info({
            msg: "File upload received",
            file: req.file,
        });

        spawnSheetWorker({
            logger: sheetWorkerLogger,
            db: req.db,
        })({
            filePath: req.file.path,
        });

        res.locals.responseObj = getResponseObj(200,{
            message: "Upload accepted",
            filename: req.file.filename,
        })

        next();
    })

    policiesRouter.post('/test',async(req,res,next) => {
        await req.db.collection('test').insertOne({
            "foo": "bar",
        })
        res.locals.responseObj = getResponseObj(200,{
            message: "written",
        });

        next();
    })

    return policiesRouter;
}

module.exports = getPoliciesRouter;