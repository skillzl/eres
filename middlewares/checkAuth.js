/**
 * Middleware function to check if the user is authenticated.
 * If the user is authenticated, call the next middleware function.
 * If the user is not authenticated, save the current URL in the session and redirect to the login page.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
module.exports = async (req, res, next) => {
	// Check if the user is authenticated
	if (req.isAuthenticated()) {
		// If authenticated, call the next middleware function
		return next();
	}

	// If not authenticated, save the current URL in the session
	req.session.backURL = req.url;

	// Redirect to the login page
	res.redirect('/login');
};
