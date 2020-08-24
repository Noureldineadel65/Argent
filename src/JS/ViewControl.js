import $ from "jquery";
import Modal from "./Modal";
import formPage from "./handlebars/formPage.hbs";
import appPage from "./handlebars/appPage.hbs";
const body = $(".messageBoard");
export default function (page, optionalData) {
	switch (page) {
		case "form":
			$("#loggedIn").remove();
			body.after(formPage());
			Modal();
			break;
		case "app":
			$("#loggedOut").remove();
			body.after(appPage(optionalData));
			break;
	}
}
