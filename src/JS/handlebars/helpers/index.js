const Handlebars = require("handlebars/runtime");
Handlebars.registerHelper("loud", function (aString) {
	// return aString.toUpperCase();
	return aString;
});
module.exports = Handlebars;
