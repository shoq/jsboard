function HtmlRenderer(chessboard, boardControl, pieceImageFileNames) {

    var squareSize = 50;

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

        removeAllChildren(boardControl);

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
            img.src = pieceImageFileNames[pieceType];
            square.appendChild(img);
        }
    }

    chessboard.onFieldChanged(function (board, args) {
        assembleChessboard();
    });

    chessboard.onSizeChanged(function (board) {
        assembleChessboard();
    });

}