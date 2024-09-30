const oracledb = require('oracledb');

module.exports = async function (context, req) {
    const username = process.env.DB_USERNAME;  // Read from environment variable
    const password = process.env.DB_PASSWORD;  // Read from environment variable
    const connectString = process.env.DB_CONNECTION_STRING;  // Read connection string from environment
    let connection;

    const { studentId } = req.body;  // Extract studentId from the request body
    
    if (!studentId) {
        context.res = {
            status: 400,
            body: 'Missing studentId in request'
        };
        return;
    }

    try {
        // Connect to the Oracle DB
        connection = await oracledb.getConnection({
            user: username,
            password: password,
            connectString: connectString
        });

        context.log("Connected to the Oracle Database!");

        // Call the stored procedure with the studentId parameter
        const result = await connection.execute(
            `BEGIN SAY_HELLO_WORLD(:studentId, :out_param); END;`,
            {
                studentId: studentId,  // Passing studentId from the request body
                out_param: { dir: oracledb.BIND_OUT, type: oracledb.STRING }  // Out parameter to hold the result
            }
        );

        // Return the result from the stored procedure
        context.res = {
            status: 200,
            body: { output: result.outBinds.out_param }
        };

    } catch (err) {
        context.log.error("Oracle DB Error: ", err);
        context.res = {
            status: 500,
            body: `Database error: ${err.message}`
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
