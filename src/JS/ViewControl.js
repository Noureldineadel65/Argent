import $ from "jquery";
import formPage from "./handlebars/formPage.hbs";
import appPage from "./handlebars/appPage.hbs";
const body = $(".messageBoard");
export default function (page, optionalData) {
	switch (page) {
		case "form":
			$("#loggedIn").remove();
			body.after(formPage());
			break;
		case "app":
			$("#loggedOut").remove();
			body.after(appPage(optionalData));
			break;
	}
}
