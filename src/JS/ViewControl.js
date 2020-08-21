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
			console.log(optionalData);
			if (!optionalData.photoURL) {
				optionalData.photoURL =
					"https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.onlinewebfonts.com%2Fsvg%2Fimg_24787.png&f=1&nofb=1";
			}
			body.after(appPage(optionalData));
			break;
	}
}
