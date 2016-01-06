function Renderer(chessboard, canvas, whiteSquareColor, blackSquareColor) {

    var context = canvas.getContext("2d");

    var squareCount, boardSize, squareSize;

    function updateDimensions() {
        squareCount = chessboard.getSize();
        boardSize = canvas.width;
        squareSize = boardSize / squareCount;
    }
    updateDimensions();

    function drawRawSquare(file, rank) {
        context.fillStyle = ((file + rank) % 2) ? blackSquareColor : whiteSquareColor;
        context.fillRect(file * squareSize, rank * squareSize, squareSize, squareSize);
    }

    var drawChessboard = this.drawChessboard = function () {

        updateDimensions();

        for(var file = 0; file < squareCount; ++file)
        {
            for(var rank = 0; rank < squareCount; ++rank) {
                drawRawSquare(file, rank);
            }
        }
    }

    function drawField(rank, file, type) {
        var x = file * squareSize;
        var y = rank * squareSize;

        context.fillStyle = ((file + rank) % 2) ? blackSquareColor : whiteSquareColor;
        context.fillRect(x, y, squareSize, squareSize);

        if (type == 0) {
            return;
        }

        var img = new Image();
        img.src = pieceImages[type];
        img.onload = function () {
            context.drawImage(img, x, y);
        };
    };

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

    chessboard.onSizeChanged(function (board) {
        drawChessboard(board);
    });

    chessboard.onFieldChanged(function (board, args) {
        drawField(args.rank, args.file, args.type);
    });


}