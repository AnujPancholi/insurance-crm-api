const DATATYPE_UTILS = {
    "string": {
        convert: (val) => val ? String(val).trim() : null,
    },
    "number": {
        convert: (val) => {
            const numVal = Number(val);
            return !isNaN(numVal) ? numVal : null;
        }
    },
    "date": {
        convert: (val) => {
            const dateVal = new Date(val);
            return dateVal && !isNaN(dateVal.valueOf()) ? dateVal : null;
        }
    },
    "boolean": {
        convert: (val) => val==="false" ? false : !!val
    }
}

const DATA_INGESTION_SHEET_COLLECTIONS = [
   "agents",
   "policy_carriers",
   "policy_categories",
   "user_accounts",
   "users",
   "policies",
]

const DATA_INGESTION_SHEET_CONFIG = {
    "agent": [{
       "collection":"agents",
       "keyname":"_id",
       "type":"string"
    },{
        "collection": "policies",
        "keyname": "agent",
        "type": "string"
    }],
    "userType":[{
       "collection":"users",
       "keyname":"user_type",
       "type":"string"
    }],
    "policy_mode":[{
       "collection":"policies",
       "keyname":"policy_mode",
       "type":"string"
    }],
    "producer":[{
       "collection":"policies",
       "keyname":"producer",
       "type":"string"
    }],
    "policy_number": [{
       "collection":"policies",
       "keyname":"_id",
       "type":"string"
    }],
    "premium_amount": [{
       "collection":"policies",
       "keyname":"premium_amount",
       "type":"number"
    }],
    "policy_type":[{
       "collection":"policies",
       "keyname":"policy_type",
       "type":"string"
    }],
    "company_name": [{
       "collection":"policy_carriers",
       "keyname":"_id",
       "type":"string"
    },{
        "collection": "policies",
        "keyname": "policy_carrier",
        "type": "string",
    }],
    "category_name":[{
       "collection":"policy_categories",
       "keyname":"_id",
       "type":"string"
    },{
        "collection": "policies",
        "keyname": "policy_category",
        "type": "string"
    }],
    "policy_start_date":[{
       "collection": "policies",
       "keyname": "policy_start_date",
       "type": "date",
    }],
    "policy_end_date":[{
       "collection":"policies",
       "keyname":"policy_end_date",
       "type":"date"
    }],
    "account_name": [{
       "collection": "user_accounts",
       "keyname": "_id",
       "type": "string"
    },{
        "collection": "users",
        "keyname": "user_account_name",
        "type": "string"
    }],
    "email": [{
       "collection":"users",
       "keyname":"email",
       "type":"string"
    }],
    "firstname": [{     
       "collection":"users",
       "keyname":"_id",
       "type":"string"
    }],
    "city":[{
       "collection":"users",
       "keyname":"city",
       "type":"string"
    }],
    "account_type": [{
       "collection":"user_accounts",
       "keyname":"type",
       "type":"string"
    }],
    "phone":[{
       "collection":"users",
       "keyname":"phone",
       "type":"string"
    }],
    "address":[{
       "collection": "users",
       "keyname": "address",
       "type": "string"
    }],
    "state":[{
       "collection":"users",
       "keyname":"state",
       "type":"string"
    }],
    "zip": [{
       "collection":"users",
       "keyname":"zip",
       "type":"string"
    }],
    "dob":[{
       "collection": "users",
       "keyname": "dob",
       "type": "date"
    }]
 };


 const INGESTION_SHEET_MIMETYPE_CONFIG = {
    "text/csv": {
        "type" : "csv",
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        "type": "xlsx"
    }
};

module.exports = {
    DATATYPE_UTILS,
    DATA_INGESTION_SHEET_CONFIG,
    INGESTION_SHEET_MIMETYPE_CONFIG,
    DATA_INGESTION_SHEET_COLLECTIONS,
}