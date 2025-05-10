// This function takes another function (fn) as an argument and returns a new function
// It's used to wrap async route handlers to handle errors automatically
function wrapAsync(fn) {
    // Returns a new function that takes Express request, response and next middleware
    return function(req, res, next) {
        // Executes the original function and catches any errors
        // If an error occurs, it passes it to Express error handling middleware
        fn(req, res, next).catch(next)
    }
}

// Export the wrapper function to be used in other files
module.exports = wrapAsync

/* Example usage:
app.get('/route', wrapAsync(async (req, res) => {
    // Your async code here
    // If this throws an error, it will be caught automatically
}));
*/