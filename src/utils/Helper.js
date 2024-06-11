export default class Helper {
	static formatNumber(number) {
		// Convert number to string
		let strNumber = number.toString();

		// Split the number into integer and decimal parts (if any)
		let parts = strNumber.split('.');

		// Regular expression to match digits in groups of three from the end
		let regExp = /\B(?=(\d{3})+(?!\d))/g;

		// Add separators for thousands
		parts[0] = parts[0].replace(regExp, ',');

		// Join integer and decimal parts (if any)
		return parts.join('.');
	}

	static toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	static isValidEmail(str) {
		const emailRegEx =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return emailRegEx.test(str);
	}
}
