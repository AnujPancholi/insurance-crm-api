const {
   DATATYPE_UTILS,
   DATA_INGESTION_SHEET_CONFIG,
   DATA_INGESTION_SHEET_COLLECTIONS,
} = require('./ingestionSheetConfig.js');
const SCHEMAS = require('../schemas/index.js');
const schemas = require('../schemas/index.js');

const readRowWise = (deps) => {
   const {
      Exceljs,
      parentPort,
      logger,
   } = deps;

   return async(filePath, fileType) => {
       const workbook = new Exceljs.Workbook();

       logger.info(`Reading ${fileType} file ${filePath}`);
   
      const worksheet = fileType==="csv" ? await workbook.csv.readFile(filePath) : ((await workbook.xlsx.readFile(filePath)).worksheets || [])[0]
      
      let rowNum = 1;

      const cols = [];
      worksheet.getRow(rowNum).eachCell((cell,colNo) => {
         cols.push(cell.value);
      })
      
      ++rowNum;
      while(rowNum<=worksheet.actualRowCount){
         
         const docObjs = {
            rowNum,
         };
         worksheet.getRow(rowNum).eachCell((cell,colNo) => {
            const insertConfig = DATA_INGESTION_SHEET_CONFIG[cols[colNo-1]]
            if(insertConfig){
               insertConfig.forEach(cfg => {
                  if(!docObjs[cfg.collection]){
                     docObjs[cfg.collection] = {};
                  }
                  docObjs[cfg.collection][cfg.keyname] = DATATYPE_UTILS[cfg.type].convert(cell.value);
               });
            }
         })
         ++rowNum;
         parentPort.postMessage(docObjs);
         
      }   
   }
}

const ingestParsedRowData = (deps) => {
   const {
      db,
      logger,
   } = deps;
   return async(rowData) => {
      const upsertResults = {};
      try {
         for(const collectionName of DATA_INGESTION_SHEET_COLLECTIONS){
            const collectionData = rowData[collectionName];
            await schemas[collectionName].validateAsync(collectionData);

            logger.info(`Upsert triggered: Rownum:${rowData.rowNum},collection:${collectionName}`)
            upsertResults[collectionName] = await db.collection(collectionName).updateOne({
               _id: collectionData._id,
            },{
               $set: collectionData
            },{
               upsert: true,
            })

            logger.info(`Upsert complete: Rownum:${rowData.rowNum},collection:${collectionName}`);
         }
   
      } catch(e){
         logger.error(`Error in ingesting rowdata: RowNum:${rowData.rowNum} : ${e.message}`);
         return {
            rowNum: rowData.rowNum,
            isSuccessful: false,
            error: e,
            errMsg: e.message,
         }
      }

      return {
         isSuccessful: true,
         upsertResults,
      }
   }

}

module.exports = {
   readRowWise,
   ingestParsedRowData,
};