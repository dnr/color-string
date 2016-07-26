/* MIT license */

module.exports = {
	getRgba: getRgba,
	getRgb: getRgb,

	rgbaString: rgbaString,
};

function getRgba(string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-fA-F0-9]{3})$/;
	var hex = /^#([a-fA-F0-9]{6})$/;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;

	var rgb = [0, 0, 0];
	var a = 1;
	var match = string.match(abbr);
	var i;

	if (match) {
		match = match[1];

		for (i = 0; i < rgb.length; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}
	} else if (match = string.match(hex)) {
		match = match[1];

		for (i = 0; i < rgb.length; i++) {
			rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < rgb.length; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		a = parseFloat(match[4]);
	} else if (match = string.match(per)) {
		for (i = 0; i < rgb.length; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		a = parseFloat(match[4]);
	}

	for (i = 0; i < rgb.length; i++) {
		rgb[i] = scale(rgb[i], 0, 255);
	}

	if (!a && a !== 0) {
		a = 1;
	} else {
		a = scale(a, 0, 1);
	}

	rgb[3] = a;
	return rgb;
}

function getRgb(string) {
	var rgba = getRgba(string);
	return rgba && rgba.slice(0, 3);
}

// generators
function rgbaString(rgba, alpha) {
	if (alpha === undefined) {
		alpha = (rgba[3] === undefined ? 1 : rgba[3]);
	}

	return 'rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', ' + alpha + ')';
}

// helpers
function scale(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}
