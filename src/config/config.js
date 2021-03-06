const dotenv = require("dotenv");

dotenv.config();

export const CLIENTS = process.env.CLIENTS.split(",");
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const vcap = {
  services: {
    cloudantNoSQLDB: {
      credentials: {
        apikey: "rrscKXpKW-Dr6NG9_HHLHyculZNwbBWRCM8z2NJjpJXd",
        host:
          "c3df4b40-a34d-4da3-aa68-5ed519fb1dad-bluemix.cloudantnosqldb.appdomain.cloud",
        iam_apikey_description:
          "Auto-generated for key 27e66758-3b3b-4fd5-a1c6-47828d3b853a",
        iam_apikey_name: "Service credentials-1",
        iam_role_crn: "crn:v1:bluemix:public:iam::::serviceRole:Manager",
        iam_serviceid_crn:
          "crn:v1:bluemix:public:iam-identity::a/92ea09760f3243a386d2f2387d87b7a6::serviceid:ServiceId-cdce295b-d72f-45df-8adf-48d9773c84c8",
        url:
          "https://c3df4b40-a34d-4da3-aa68-5ed519fb1dad-bluemix.cloudantnosqldb.appdomain.cloud",
        username: "c3df4b40-a34d-4da3-aa68-5ed519fb1dad-bluemix",
      },
      label: "cloudantNoSQLDB",
    },
  },
};
