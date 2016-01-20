var SquareImageUrls = [
    "empty",
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
    
function HtmlRenderer(chessboard, boardControl) {

    var selectedRank = -1;
    var selectedFile = -1;
    
    rebuildSquareDivs();

    function rebuildSquareDivs() {
        removeAllChildren(boardControl);

        var newChessboardSize = chessboard.getSize();

        for (var rank = 0; rank < newChessboardSize; ++rank) {
            var rankDiv = createRankDiv();
            for (var file = 0; file < newChessboardSize; ++file) {
                rankDiv.appendChild(createSquareDiv(rank, file));
            }

            boardControl.appendChild(rankDiv);
        }
    };
    
    function selectSquareDiv(rank, file) {

        // If a square is clicked again, then it is deselected.
        if (selectedRank == rank && selectedFile == file) {
            selectedRank = -1;
            selectedFile = -1;
            getSquareImage(rank, file).className = 'square-unselected';
        } else {
            // If a different square was selected before, then it must be deselected and a move must be made.
            if (selectedRank != -1 && selectedFile != -1) {
                if (chessboard.getPlayerColor(selectedRank, selectedFile) != chessboard.getPlayerColor(rank, file)) {
                    if (chessboard.tryToMove(selectedRank, selectedFile, rank, file)) {
                        getSquareImage(selectedRank, selectedFile).className = 'square-unselected';
                        selectedRank = -1;
                        selectedFile = -1;
                    }
                } else {
                    getSquareImage(selectedRank, selectedFile).className = 'square-unselected';
                    getSquareImage(rank, file).className = 'square-selected';
                    selectedRank = rank;
                    selectedFile = file;
                }
            // A newly clicked square must be selected.
            } else {
                getSquareImage(rank, file).className = 'square-selected';
                selectedRank = rank;
                selectedFile = file;
            }
        }
    }
    
    function createRankDiv() {
        var rankDiv = document.createElement('div');
        rankDiv.className = 'rank';
        return rankDiv;
    }

    function createSquareDiv(rank, file) {

        var squareType = chessboard.getSquareType(rank, file);
        var squareImage = new Image();
        var squareDiv = document.createElement('div');
                
        squareImage.id = getSquareImageId(rank, file);
        squareImage.className = 'square-unselected';
        squareDiv.onclick = function() { selectSquareDiv(rank, file); };
        squareDiv.className = isSquareWhite(rank, file) ? 'white-square' : 'black-square';
        squareDiv.appendChild(squareImage);
        
        setSquareImageUrlBasedOnType(squareImage, squareType);

        return squareDiv;
    }

    function setSquareImageUrlBasedOnType(squareImage, squareType) {
        squareImage.src = SquareImageUrls[squareType];
    }
    
    function getSquareImage(rank, file) {
        return document.getElementById(getSquareImageId(rank, file));
    }
    
    function getSquareImageId(rank, file) {
        return 'img#' + rank + '#' + file;
    }
    
    function isSquareWhite(rank, file) {
        return (rank + file) % 2 == 0;
    }

    chessboard.onSquareChanged(function (board, args) {
        setSquareImageUrlBasedOnType(getSquareImage(args.rank, args.file), args.type);
    });

    chessboard.onSizeChanged(function (board, args) {
        rebuildSquareDivs();
    });

};