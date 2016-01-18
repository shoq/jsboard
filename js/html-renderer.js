function HtmlRenderer(chessboard, boardControl) {

    var squareSize = 50;

    function sizeElement(element, sizeInPx) {
        element.style.height = sizeInPx + 'px';
        element.style.width = sizeInPx + 'px';
    }

    function createSquare(rank, file) {

        var newSquare = document.createElement('div');

        var isWhite = (rank + file) % 2;
        newSquare.className = isWhite == 1 ? 'white-square' : 'black-square';
        sizeElement(newSquare, squareSize);

        var piece = chessboard.getSquare(rank, file);
        assignPieceImage(newSquare, piece);

        return newSquare;
    }

    var assembleChessboard = this.assembleChessboard = function () {

        while (boardControl.firstChild) {
            boardControl.removeChild(boardControl.firstChild);
        }

        var newSize = chessboard.getSize();
        sizeElement(boardControl, squareSize * newSize);

        for (var i = 0; i < newSize * newSize; ++i) {
            var newSquare = createSquare(Math.floor(i / newSize), i % newSize);
            boardControl.appendChild(newSquare);
        }
    };

    function assignPieceImage(square, pieceType) {
        if(pieceType != 0) {
            var img = new Image();
            img.className = 'piece';
            img.src = pieceImages[pieceType];
            square.appendChild(img);
        }
    }

    var pieceImages = [
        "", // just for the sake of index compatibility
        "white-pawn",
        "white-knight",
        "white-bishop",
        "white-rook",
        "white-queen",
        "white-king",
        "black-pawn",
        "black-knight",
        "black-bishop",
        "black-rook",
        "black-queen",
        "black-king"
    ].map(function(name) {
            return  "./images/" + name + ".png";
        });

    chessboard.onFieldChanged(function (board, args) {
        assembleChessboard();
    });

    chessboard.onSizeChanged(function (board) {
        assembleChessboard();
    });

}