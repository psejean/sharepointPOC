const oracledb = require('oracledb');

module.exports = async function (context, req) {
    const username = process.env.DB_USERNAME;  // Read from environment variable
    const password = process.env.DB_PASSWORD;  // Read from environment variable
    let connection;

    try {
        // Connect to the Oracle DB
        connection = await oracledb.getConnection({
            user: username,
            password: password,
            connectString: "your-oracle-db-connect-string"  // Replace with your Oracle connection string
        });

        context.log("Connected to the Oracle Database!");

        // Execute a simple query
        const result = await connection.execute(`SELECT 'Hello World from Oracle' FROM dual`);
        context.res = {
            status: 200,
            body: result.rows
        };
        
    } catch (err) {
        context.log.error("Oracle DB Error: ", err);
        context.res = {
            status: 500,
            body: "Error connecting to Oracle DB"
        };
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                context.log.error("Error closing the connection: ", err);
            }
        }
    }
};
