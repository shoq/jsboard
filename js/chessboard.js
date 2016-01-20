var SquareType = {
    empty: 0,

    whitePawn: 1,
    whiteKnight: 2,
    whiteBishop: 3,
    whiteRook: 4,
    whiteQueen: 5,
    whiteKing: 6,

    blackPawn: 7,
    blackKnight: 8,
    blackBishop: 9,
    blackRook: 10,
    blackQueen: 11,
    blackKing: 12
};

var PlayerColor = {
    unspecified : 0,
    white : 1,
    black : 2
};

function Chessboard(initialSize) {

    var minSize = 2;
    var maxSize = 16;
    var standardSize = 8;
    var squares = [];
    
    for (var i = 0; i < initialSize; ++i) {
        squares.push(createEmptyRank(initialSize));
    }

    this.getSize = function() {
        // Returns the number of ranks which should be always the same as the number of files.
        return squares.length;
    };

    var sizeChanged = new DomainEvent('sizeChanged', this);
    var squareChanged = new DomainEvent('squareChanged', this);
    
    this.onSizeChanged = sizeChanged.subscribe;
    this.onSquareChanged = squareChanged.subscribe;

    this.canEnlarge = function() {
        return this.getSize() < maxSize;
    };

    this.canReduce = function() {
        return this.getSize() > minSize;
    };

    this.enlarge = function() {
        if (!this.canEnlarge()) {
            throw new Error('Cannot enlarge, because maximum size has been reached.');
        }
        
        squares.push(createEmptyRank(squares.length));
        for (var rank = 0; rank < squares.length; ++rank) {
            squares[rank].push(SquareType.empty);
        }

        sizeChanged.raise(null);
    };

    this.reduce = function() {
        if (!this.canReduce()) {
            throw new Error('Cannot reduce, because minimum size has been reached.');
        }
        
        squares.pop();
        for (var rank = 0; rank < squares.length; ++rank) {
            squares[rank].pop();
        }

        sizeChanged.raise(null);
    };

    this.resetToStandard = function() {
        if (squares.length != standardSize) {
            throw new Error('Chessboard must be of the standard 8x8 size.');
        }
        
        for (var rank = 2; rank < 6; ++rank) {
            for (var file = 0; file < 8; ++file) {
                changeSquare(rank, file, SquareType.empty);
            }
        }
        
        for (var file = 0; file < 8; ++file) {
            changeSquare(1, file, SquareType.blackPawn);
            changeSquare(6, file, SquareType.whitePawn);
        }
        
        changeSquare(0, 0, SquareType.blackRook);
        changeSquare(0, 1, SquareType.blackKnight);
        changeSquare(0, 2, SquareType.blackBishop);
        changeSquare(0, 3, SquareType.blackQueen);
        changeSquare(0, 4, SquareType.blackKing);
        changeSquare(0, 5, SquareType.blackBishop);
        changeSquare(0, 6, SquareType.blackKnight);
        changeSquare(0, 7, SquareType.blackRook);
        
        changeSquare(7, 0, SquareType.whiteRook);
        changeSquare(7, 1, SquareType.whiteKnight);
        changeSquare(7, 2, SquareType.whiteBishop);
        changeSquare(7, 3, SquareType.whiteQueen);
        changeSquare(7, 4, SquareType.whiteKing);
        changeSquare(7, 5, SquareType.whiteBishop);
        changeSquare(7, 6, SquareType.whiteKnight);
        changeSquare(7, 7, SquareType.whiteRook);
    };

    var getSquareType = this.getSquareType = function(rank, file) {
        return squares[rank][file];
    }
    
    this.getPlayerColor = function(rank, file) {
        switch (squares[rank][file]) {
            case SquareType.empty:
                return PlayerColor.unspecified;

            case SquareType.whitePawn:
            case SquareType.whiteKnight:
            case SquareType.whiteBishop:
            case SquareType.whiteRook:
            case SquareType.whiteQueen:
            case SquareType.whiteKing:
                return PlayerColor.white;

            case SquareType.blackPawn:
            case SquareType.blackKnight:
            case SquareType.blackBishop:
            case SquareType.blackRook:
            case SquareType.blackQueen:
            case SquareType.blackKing:
                return PlayerColor.black;
        };
    }
    
    this.tryToMove = function(sourceRank, sourceFile, destRank, destFile) {
        var sourceType = squares[sourceRank][sourceFile];
        if (sourceType == SquareType.empty) {
            return true;
        }
        
        if (!pieceAimsAt(sourceRank, sourceFile, destRank, destFile)) {
            return false;
        }

        changeSquare(sourceRank, sourceFile, SquareType.empty);
        changeSquare(destRank, destFile, sourceType);
        return true;
    };

    function changeSquare(rank, file, type) {
        squares[rank][file] = type;
        squareChanged.raise({ rank: rank, file: file, type: type});
    }

    function createEmptyRank(size) {
        var rank = [];
        for (j = 0; j < size; ++j) {
            rank.push(SquareType.empty);
        }

        return rank;
    }
    
    function pieceAimsAt(sourceRank, sourceFile, destRank, destFile) {

        var squareType = getSquareType(sourceRank, sourceFile);
        switch (squareType) {
            case SquareType.empty:
                return false;

            case SquareType.whiteKnight:
            case SquareType.blackKnight:
                return isJumpMove(sourceRank, sourceFile, destRank, destFile);

            case SquareType.whiteBishop:
            case SquareType.blackBishop:
                return isCrossMove(sourceRank, sourceFile, destRank, destFile);
                
            case SquareType.whiteRook:
            case SquareType.blackRook:
                return isLineMove(sourceRank, sourceFile, destRank, destFile);

            case SquareType.whiteQueen:
            case SquareType.blackQueen:
                return isCrossMove(sourceRank, sourceFile, destRank, destFile)
                    || isLineMove(sourceRank, sourceFile, destRank, destFile);

            default:
                return true;
        }
    }
    
    function isCrossMove(sourceRank, sourceFile, destRank, destFile) {
        return Math.abs(destRank - sourceRank) == Math.abs(destFile - sourceFile); 
    }
    
    function isLineMove(sourceRank, sourceFile, destRank, destFile) {
        return sourceRank == destRank || sourceFile == destFile;
    }
    
    function isJumpMove(sourceRank, sourceFile, destRank, destFile) {
        var distRank = Math.abs(destRank - sourceRank);
        var distFile = Math.abs(destFile - sourceFile);
        return (distRank == 2 && distFile == 1) || (distRank == 1 && distFile == 2);
    }
}