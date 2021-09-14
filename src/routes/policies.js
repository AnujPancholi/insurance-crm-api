const CONFIG = require('../config.js');
const express = require('express');
const multer = require('multer');
const {
    getResponseObj,
} = require('../utils/responseUtils.js');

const uploadToDisk = multer({
    dest: "./sheets/"
})

const getPoliciesRouter = (deps) => {
    const {
        logger,
    } = deps;

    const policiesRouter = express.Router();

    policiesRouter.post('/sheet/upload', uploadToDisk.single('sheet'), async(req,res,next) => {
        logger.info(req.file.path);
        console.log(req.file);
        res.locals.responseObj = getResponseObj(200,{
            message: "Upload accepted",
            filename: req.file.filename,
        })

        next();
    })

    return policiesRouter;
}

module.exports = getPoliciesRouter;