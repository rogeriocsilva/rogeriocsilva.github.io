$(function () {
	replaceImgToSvg()

	const toggleButton = ".theme--switch"

	var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	if (storedTheme) {
		document.documentElement.setAttribute('data-theme', storedTheme)
		if (storedTheme === "dark") {
			$(toggleButton).prop("checked", true);
		}
	}

	$(toggleButton).click(e => {
		var currentTheme = document.documentElement.getAttribute("data-theme");
		var targetTheme = "light";
		if (currentTheme === "light") {
			targetTheme = "dark";
		}

		document.documentElement.setAttribute('data-theme', targetTheme)
		localStorage.setItem('theme', targetTheme);
	})
});

const replaceImgToSvg = () => {
	$('img.svg').each(function () {
		var $img = jQuery(this);
		var imgID = $img.attr('id');
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');

		$.get(imgURL, function (data) {
			// Get the SVG tag, ignore the rest
			var $svg = $(data).find('svg');

			// Add replaced image's ID to the new SVG
			if (typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if (typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass + ' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');

			// Replace image with new SVG
			$img.replaceWith($svg);

		}, 'xml');

	});
}
