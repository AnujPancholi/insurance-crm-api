const CONFIG = require("../config.js");
const express = require("express");
const multer = require("multer");
const ExtendedError = require("../lib/errors/extendedError.js");
const { getRandomHexStr } = require("../utils/randomizer.js");
const { getResponseObj } = require("../utils/responseUtils.js");
const {
  INGESTION_SHEET_MIMETYPE_CONFIG,
} = require("../lib/sheets/ingestionSheetConfig.js");
const spawnSheetWorker = require("../lib/workers/spawnSheetDataWorker.js");
const Joi = require("joi");

const uploadSheetToDisk = (deps) => {
  const { multer, sheetMimetypeConfig } = deps;

  return multer({
    storage: multer.diskStorage({
      filename: (req, file, cbFn) => {
        const mimetypeConfig = sheetMimetypeConfig[file.mimetype];
        if (!mimetypeConfig || !mimetypeConfig.type) {
          return cbFn(
            new ExtendedError(
              `Sheet type not found for mimetype ${file.mimetype}`,
              400
            )
          );
        }
        cbFn(null, `${getRandomHexStr()}.${mimetypeConfig.type}`);
      },
    }),
    fileFilter: (req, file, cbFn) => {
      const mimetypeConfig = sheetMimetypeConfig[file.mimetype] || null;
      if (!mimetypeConfig) {
        return cbFn(
          new ExtendedError(`Invalid file mimetype: ${file.mimetype}`, 400)
        );
      }
      cbFn(null, true);
    },
  });
};

const getPoliciesRouter = (deps) => {
  const { getLogger } = deps;

  const paginationParamsSchema = Joi.object({
    pageno: Joi.number().min(1),
    pagesize: Joi.number().min(1).max(2000),
  }).unknown(true);

  const logger = getLogger({
    tag: "policies",
  });

  const sheetWorkerLogger = getLogger({
    tag: "spawn-sheet-worker",
  });

  const policiesRouter = express.Router();

  policiesRouter.post(
    "/sheet/upload",
    uploadSheetToDisk({
      multer,
      sheetMimetypeConfig: INGESTION_SHEET_MIMETYPE_CONFIG,
    }).single("sheet"),
    async (req, res, next) => {
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

      res.locals.responseObj = getResponseObj(200, {
        message: "Upload accepted",
        filename: req.file.filename,
      });

      next();
    }
  );

  policiesRouter.get("/aggregate/users", async (req, res, next) => {
    try {
      const queryParamsValidationResult = paginationParamsSchema.validate(
        req.query
      );

      if (queryParamsValidationResult.error) {
        throw new ExtendedError(
          `Invalid query params: ${queryParamsValidationResult.error.message}`,
          400
        );
      }

      const pageno = parseInt(req.query.pageno) || 1;
      const pagesize = parseInt(req.query.pagesize) || 2000;

      const aggregationResult = await req.db
        .collection("policies")
        .aggregate([
          {
            $group: {
              _id: "$user_name",
              policies: {
                $push: "$$ROOT",
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
          {
            $project: {
              user_name: "$_id",
              policies: 1,
            },
          },
          {
            $skip: (pageno - 1) * pagesize,
          },
          {
            $limit: pagesize,
          },
        ])
        .toArray();

      res.locals.responseObj = getResponseObj(200, {
        aggregationResult,
      });

      next();
    } catch (e) {
      logger.error(`Error: ${e.message}`);
      next(e);
    }
  });

  return policiesRouter;
};

module.exports = getPoliciesRouter;
