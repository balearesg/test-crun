// Import the mysql2 library for connecting to MySQL.
// Ensure you have installed it: npm install mysql2
import * as mysql from 'mysql2/promise';

export /*bundle*/ function routes(app) {
	/**
	 * @route GET /users
	 * @description Fetches all users from the MySQL database.
	 * Connects to the database using environment variables for credentials.
	 */
	app.get('/users', async (req, res) => {
		let connection; // Declare connection outside try-catch for finally block access

		try {
			// 1. Retrieve database credentials from environment variables.
			//    It is crucial to set these variables in your deployment environment
			//    (e.g., .env file in development, or your hosting provider's config).
			//    Example .env file content:
			//    DB_HOST=localhost
			//    DB_USER=root
			//    DB_PASSWORD=mysecretpassword
			//    DB_NAME=mydatabase
			const dbHost = process.env.DB_HOST;
			const dbUser = process.env.DB_USER;
			const dbPassword = process.env.DB_PASS;
			const dbName = process.env.DB_NAME;

			// Basic validation for environment variables
			if (!dbHost || !dbUser || !dbPassword || !dbName) {
				console.error('Missing database environment variables.');
				return res.status(500).json({
					message:
						'Database configuration error: Missing environment variables.',
				});
			}

			// 2. Establish a connection to the MySQL database.
			//    The 'promise' version of mysql2 is used for async/await syntax.
			connection = await mysql.createConnection({
				host: dbHost,
				user: dbUser,
				password: dbPassword,
				database: dbName,
			});

			console.log('Successfully connected to the MySQL database.');

			// 3. Execute a query to fetch all records from the 'users' table.
			//    The result is an array where the first element contains the rows.
			const [rows] = await connection.execute('SELECT * FROM users');

			// 4. Send the fetched data as a JSON response.
			res.status(200).json(rows);
		} catch (error) {
			// 5. Handle any errors that occur during the database operation.
			console.error('Error fetching users from database:', error.message);
			// Send a 500 Internal Server Error response with a descriptive message.
			res.status(500).json({
				message: 'Failed to retrieve users.',
				error: error.message,
			});
		} finally {
			// 6. Ensure the database connection is closed, regardless of success or failure.
			if (connection) {
				await connection.end();
				console.log('MySQL connection closed.');
			}
		}
	});

	// The original root endpoint remains
	app.get('/', (req, res) => {
		res.send('Express page with BeyondJS');
	});
}
