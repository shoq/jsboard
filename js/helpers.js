function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function position(rank, file) {
    return {
        rank: rank,
        file: file
    };
}