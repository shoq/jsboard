function PieceBoxRenderer(pieceBoxControl, mouseDriver) {

    var piecesToDisplay = [
        [
            SquareType.whitePawn,
            SquareType.whiteKnight,
            SquareType.whiteBishop,
            SquareType.whiteRook,
            SquareType.whiteQueen
        ], [
            SquareType.blackPawn,
            SquareType.blackKnight,
            SquareType.blackBishop,
            SquareType.blackRook,
            SquareType.blackQueen
        ]
    ];

    var selectedElement = null;

    function createElement() {
        return new Image();
    }

    function setImage(element, pieceType) {
        element.src = SquareImageUrls[pieceType];
        element.className = "square-unselected";
    }

    function wireUpEvents(element, pieceType) {
        element.onclick = function() {
            element.className = "square-selected";
            mouseDriver.selectPieceFromBox(pieceType);
            selectedElement = element;
        }
    }

    mouseDriver.onPieceBoxUnselected(function(pieceType) {
        selectedElement.className = "square-unselected";
    });

    piecesToDisplay.forEach(function(row) {

        var rankDiv = document.createElement('div');
        rankDiv.className = 'rank';
        pieceBoxControl.appendChild(rankDiv);

        row.forEach(function (pieceType) {
            var element = createElement();
            setImage(element, pieceType);
            wireUpEvents(element, pieceType);
            rankDiv.appendChild(element);
        });
    });

}

