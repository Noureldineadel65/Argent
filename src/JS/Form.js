export function validatePass(pass) {
	const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	const passError =
		"Password must be minimum eight characters, at least one letter and one number";
	const testRes = passRegex.test(pass);
	return testRes;
}
