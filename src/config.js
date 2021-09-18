module.exports = {
  SERVICE_NAME: "insurance-crm-api",
  PORT: parseInt(process.env.PORT || 3004),
  DB_URI: process.env.DB_URI || "",
  DB_NAME: process.env.DB_NAME || "",
};
