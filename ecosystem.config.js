module.exports = {
  apps : [{
    name   : "ins-crm-api",
    script : "./src/index.js",
    env_production: {
      NODE_ENV: "production",
    },
    env_develop: {
      NODE_ENV: "develop",
    }
  }]
};
