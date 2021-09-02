exports.port = process.argv[2] || process.env.PORT;
exports.dbUrl = process.env.DB_URL;
exports.secret = process.env.JWT_SECRET;
exports.adminEmail = process.env.ADMIN_EMAIL;
exports.adminPassword = process.env.ADMIN_PASSWORD;
