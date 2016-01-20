function setSquareSize(element, sizeInPx) {
    element.style.height = sizeInPx + 'px';
    element.style.width = sizeInPx + 'px';
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}