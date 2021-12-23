//create tag
function renderTag(type, attributes = {}, options = {}) {
	if (!type) {
		alert('Type must be exist');
		return;
	}

	// craete element
	const element = document.createElement(type);
	if (attributes && typeof attributes === 'object' && !Array.isArray(attributes)) {
		// only obj
		for (const keyAttribute in attributes) {
			if (keyAttribute === 'innerHTML') {
				element.innerHTML = attributes[keyAttribute]
			} else {
				element.setAttribute(keyAttribute, attributes[keyAttribute]);
			}
		}
	}

	return element;
}