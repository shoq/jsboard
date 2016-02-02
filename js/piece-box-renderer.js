function PieceBoxRenderer(pieceBoxControl, mouseDriver) {

    var piecesToDisplay = [
        SquareType.whitePawn,
        SquareType.whiteKnight,
        SquareType.whiteBishop,
        SquareType.whiteRook,
        SquareType.whiteQueen,

        SquareType.blackPawn,
        SquareType.blackKnight,
        SquareType.blackBishop,
        SquareType.blackRook,
        SquareType.blackQueen
    ];

    function createElement() {
        return new Image();
    }

    function setImage(element, pieceType) {
        element.src = SquareImageUrls[pieceType];
    }

    function wireUpEvents(element, pieceType) {
        element.onclick = function() {
            mouseDriver.selectPieceFromBox(pieceType);
        }
    }

    piecesToDisplay.forEach(function(pieceType) {
        var element = createElement();
        setImage(element, pieceType);
        wireUpEvents(element, pieceType);
        pieceBoxControl.appendChild(element);
    });

}

