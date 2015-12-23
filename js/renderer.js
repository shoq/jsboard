function Renderer(canvas, whiteSquareColor, blackSquareColor) {

    this.drawChessboard = function(chessboard) {

        var context = canvas.getContext("2d");

        var squareCount = chessboard.getSquareCount();
        var boardSize = canvas.width;
        var squareSize = boardSize / squareCount;

        console.log(squareSize);

        for(var x = 0; x < squareCount; ++x)
        {
            for(var y = 0; y < squareCount; ++y)
            {
                context.fillStyle = ((x + y) % 2) ? blackSquareColor : whiteSquareColor;
                context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
            }
        }
    }

}