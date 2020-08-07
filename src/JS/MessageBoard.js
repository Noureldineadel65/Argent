const messageBoard = $(".messageBoard");
const content = messageBoard.find(".content");
const types = {
	success: function (name) {
		return `<h1>Account Generated Successfully, ${name}!🙌</h1>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
        <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10"
            cx="65.1" cy="65.1" r="62.1" />
        <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round"
            stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
    </svg>`;
	},
	error: function (error) {
		return `<h1 class="error">An Error Occurred, Try Again Later😢</h1>
        <p class="error">${error}</p>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                <circle class="path circle" fill="none" stroke="#ef233c" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                <line class="path line" fill="none" stroke="#ef233c" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                <line class="path line" fill="none" stroke="#ef233c" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
              </svg>`;
	},
	welcome: function (name) {
		return `<h1>Welcome Back, ${name}!👋</h1><p>Hope you've been doing well :)</p>`;
	},
};
export function showBoard(type, msg, cb) {
	content.html(types[type](msg));
	$("html").css("overflow", "hidden");
	$("body").css("overflow", "hidden");

	messageBoard.removeAttr("hidden");
	setTimeout(() => {
		messageBoard.addClass("opened");
	}, 0);
	typeof cb === "function" && setTimeout(cb, 500);
}
export function hideBoard() {
	messageBoard.removeClass("opened");
	setTimeout(() => {
		messageBoard.prop("hidden", true);
		$("html").css("overflow", "auto");
		$("body").css("overflow", "auto");
		content.html("");
	}, 500);
}
$("#close-icon").on("click", hideBoard);
