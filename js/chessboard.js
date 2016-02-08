var SquareType = {
    empty: 0,

    whitePawn: 1,
    whitePawnStarting: 2,
    whitePawnPassing: 3,
    whiteKnight: 4,
    whiteBishop: 5,
    whiteRook: 6,
    whiteRookStarting: 7,
    whiteQueen: 8,
    whiteKing: 9,
    whiteKingStarting: 10,

    blackPawn: 11,
    blackPawnStarting: 12,
    blackPawnPassing: 13,
    blackKnight: 14,
    blackBishop: 15,
    blackRook: 16,
    blackRookStarting: 17,
    blackQueen: 18,
    blackKing: 19,
    blackKingStarting: 20
};

var PlayerColor = {
    unspecified: 0,
    white: 1,
    black: 2
};

var GameEndType = {
    whiteWin: 0,
    blackWin: 1,
    draw: 2
};

function Position(rank, file) {
    this.rank = rank;
    this.file = file;
}

function MoveInfo(source, dest) {
    this.source = source;
    this.dest = dest;
}

function flipPlayerColor(playerColor) {
    return playerColor == PlayerColor.white ? PlayerColor.black : PlayerColor.white;
}

function isKing(squareType) {
    switch (squareType) {
        case SquareType.whiteKing:
        case SquareType.whiteKingStarting:
        case SquareType.blackKing:
        case SquareType.blackKingStarting:
            return true;
        default:
            return false;
    }
}

function Chessboard(initialSize) {

    var minSize = 2;
    var maxSize = 16;
    var standardSize = 8;
    var squares = [];
    var currentPlayerColor = PlayerColor.white;
    
    for (var i = 0; i < initialSize; ++i) {
        squares.push(createEmptyRank(initialSize));
    }

    var getSize = this.getSize = function() {
        // Returns the number of ranks which should be always the same as the number of files.
        return squares.length;
    };

    var sizeChanged = new DomainEvent('sizeChanged', this);
    var squareChanged = new DomainEvent('squareChanged', this);
    var gameEnded = new DomainEvent('gameEnded', this);

    this.onSizeChanged = sizeChanged.subscribe;
    this.onSquareChanged = squareChanged.subscribe;
    this.onGameEnded = gameEnded.subscribe;

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
            changeSquare(1, file, SquareType.blackPawnStarting);
            changeSquare(6, file, SquareType.whitePawnStarting);
        }
        
        changeSquare(0, 0, SquareType.blackRookStarting);
        changeSquare(0, 1, SquareType.blackKnight);
        changeSquare(0, 2, SquareType.blackBishop);
        changeSquare(0, 3, SquareType.blackQueen);
        changeSquare(0, 4, SquareType.blackKingStarting);
        changeSquare(0, 5, SquareType.blackBishop);
        changeSquare(0, 6, SquareType.blackKnight);
        changeSquare(0, 7, SquareType.blackRookStarting);
        
        changeSquare(7, 0, SquareType.whiteRookStarting);
        changeSquare(7, 1, SquareType.whiteKnight);
        changeSquare(7, 2, SquareType.whiteBishop);
        changeSquare(7, 3, SquareType.whiteQueen);
        changeSquare(7, 4, SquareType.whiteKingStarting);
        changeSquare(7, 5, SquareType.whiteBishop);
        changeSquare(7, 6, SquareType.whiteKnight);
        changeSquare(7, 7, SquareType.whiteRookStarting);
    };

    function createEmptyRank(size) {
        var rank = [];
        for (j = 0; j < size; ++j) {
            rank.push(SquareType.empty);
        }

        return rank;
    }
    
    var getSquare = this.getSquare = function(rank, file) {
        return squares[rank][file];
    };


    function toggleCurrentPlayer() {
        currentPlayerColor = flipPlayerColor(currentPlayerColor);
    }
    
    var getPlayerColor = this.getPlayerColor = function(rank, file) {
        switch (squares[rank][file]) {
            case SquareType.empty:
                return PlayerColor.unspecified;

            case SquareType.whitePawn:
            case SquareType.whitePawnStarting:
            case SquareType.whitePawnPassing:
            case SquareType.whiteKnight:
            case SquareType.whiteBishop:
            case SquareType.whiteRook:
            case SquareType.whiteRookStarting:
            case SquareType.whiteQueen:
            case SquareType.whiteKing:
            case SquareType.whiteKingStarting:
                return PlayerColor.white;

            case SquareType.blackPawn:
            case SquareType.blackPawnStarting:
            case SquareType.blackPawnPassing:
            case SquareType.blackKnight:
            case SquareType.blackBishop:
            case SquareType.blackRook:
            case SquareType.blackRookStarting:
            case SquareType.blackQueen:
            case SquareType.blackKing:
            case SquareType.blackKingStarting:
                return PlayerColor.black;
        }
    };
    
    this.tryToMove = function(sourceRank, sourceFile, destRank, destFile) {
        var sourceType = squares[sourceRank][sourceFile];
        if (sourceType == SquareType.empty) {
            return true;
        }

        if (currentPlayerColor !== getPlayerColor(sourceRank, sourceFile)) {
            return false;
        }
        
        if (tryToMove(sourceRank, sourceFile, destRank, destFile) == true) {
            //changeSquare(sourceRank, sourceFile, SquareType.empty);
            //changeSquare(destRank, destFile, sourceType);
            toggleCurrentPlayer();
            return true;
        }

        return false;
    };

    this.addPiece = function(rank, file, sourceType) {
        if (isSquareEmpty(rank, file)) {
            changeSquare(rank, file, sourceType);
        }
    };

    function changeSquare(rank, file, type) {
        squares[rank][file] = type;
        squareChanged.raise({ rank: rank, file: file, type: type});
    }
    
    function copyAllSquares() {
        var size = getSize();
        var copied = [];
        
        for (var rank = 0; rank < size; ++rank) {
            var rankSquares = [];
            for (var file = 0; file < size; ++file) {
                rankSquares.push(getSquare(rank, file));
            }
            
            copied.push(rankSquares);
        }
        
        return copied;
    }
    
    function tryToApplyMove(sourceRank, sourceFile, destRank, destFile, oldSquares) {
        return tryToApplyMoveAsType(sourceRank, sourceFile, destRank, destFile, getSquare(sourceRank, sourceFile), oldSquares);
    }
    
    function tryToApplyMoveAsType(sourceRank, sourceFile, destRank, destFile, destType, oldSquares) {
        //var oldSourceType = getSquare(sourceRank, sourceFile);
        //var oldDestType = getSquare(destRank, destFile);
        
        restorePawnsPassing();
        changeSquare(sourceRank, sourceFile, SquareType.empty);
        changeSquare(destRank, destFile, destType);
        
        //var opponentPiecePositions = getPiecePositionsByColor(flipPlayerColor(getPlayerColor(sourceRank, sourceFile)));
        //var attackedSquares = getAttackedSquaresForPositions(opponentPiecePositions);
        
        //changeSquare(sourceRank, sourceFile, SquareType.empty);
        //changeSquare(destRank, destFile, destType);
        return true;
    }

    function testSquare(rank, file, type) {
        return squares[rank][file] == type;
    }

    function isSquareEmpty(rank, file) {
        var size = getSize();
        if (rank >= 0 && file >= 0 && rank < size && file < size) {
            return squares[rank][file] == SquareType.empty;
        } else {
            return false;
        }
    }

    function restorePawnsPassing() {
        var size = getSize();
        for (var rank = 0; rank < size; ++rank) {
            for (var file = 0; file < size; ++file) {
                if (testSquare(rank, file, SquareType.whitePawnPassing)) {
                    changeSquare(rank, file, SquareType.whitePawn);
                }
                
                if (testSquare(rank, file, SquareType.blackPawnPassing)) {
                    changeSquare(rank, file, SquareType.blackPawn);
                }
            }
        }
    }
    
    function changeStartingPawnToPassingByPawn(destRank, destFile) {
        if (testSquare(destRank, destFile, SquareType.whitePawnStarting)) {
            changeSquare(destRank, destFile, SquareType.whitePawnPassing);
        }
        
        if (testSquare(destRank, destFile, SquareType.blackPawnStarting)) {
            changeSquare(destRank, destFile, SquareType.blackPawnPassing);
        }
    }
    
    function tryToMove(sourceRank, sourceFile, destRank, destFile) {

        var squareType = getSquare(sourceRank, sourceFile);
        switch (squareType) {
            case SquareType.empty:
                return false;
            
            case SquareType.whitePawn:
            case SquareType.whitePawnStarting:
            case SquareType.whitePawnPassing:
            case SquareType.blackPawn:
            case SquareType.blackPawnStarting:
            case SquareType.blackPawnPassing:
                return tryToMovePawn(sourceRank, sourceFile, destRank, destFile);

            case SquareType.whiteKnight:
            case SquareType.blackKnight:
                return tryToMoveKnight(sourceRank, sourceFile, destRank, destFile);

            case SquareType.whiteBishop:
            case SquareType.blackBishop:
                return tryToMoveBishop(sourceRank, sourceFile, destRank, destFile);
                
            case SquareType.whiteRook:
            case SquareType.whiteRookStarting:
            case SquareType.blackRook:
            case SquareType.blackRookStarting:
                return tryToMoveRook(sourceRank, sourceFile, destRank, destFile);

            case SquareType.whiteQueen:
            case SquareType.blackQueen:
                return tryToMoveQueen(sourceRank, sourceFile, destRank, destFile);

            case SquareType.whiteKing:
            case SquareType.whiteKingStarting:
            case SquareType.blackKing:
            case SquareType.blackKingStarting:
                return isOneSquareMove(sourceRank, sourceFile, destRank, destFile);
                    
            default:
                return false;
        }
    }
    
    function tryToMovePawn(sourceRank, sourceFile, destRank, destFile) {
        return tryToMovePawnNonAttacking(sourceRank, sourceFile, destRank, destFile)
            || tryToMovePawnAttacking(sourceRank, sourceFile, destRank, destFile);
    }
    
    function tryToMovePawnNonAttacking(sourceRank, sourceFile, destRank, destFile) {
        var maxMoveDistance = getPawnMaxMoveDistance(sourceRank, sourceFile);
        var allowedDirection = getPawnDirection(sourceRank, sourceFile);
        var playerColor = getPlayerColor(sourceRank, sourceFile);
        var playerQueenType = getQueenByColor(playerColor);
        var playerPawnPassingType = getPawnPassingByColor(playerColor);
        var finalRank = getFinalRankByColor(playerColor);
        
        if (getDirection(sourceRank, destRank) != allowedDirection) {
            return false;
        }
        
        var distRank = getDistance(sourceRank, destRank);
        if (distRank > maxMoveDistance) {
            return false;
        }
        
        if (sourceFile != destFile) {
            return false;
        }
        
        if (!isSquareEmpty(destRank, destFile)) {
            return false;
        }

        if (!isValidLineMove(sourceRank, sourceFile, destRank, destFile)) {
            return false;
        };
        
        // Pawn reaching the final rank.
        if (destRank == finalRank) {
            return tryToApplyMoveAsType(sourceRank, sourceFile, destRank, destFile, playerQueenType, copyAllSquares());

        // Pawn moving by only one square.
        } else if (distRank == 1) {
            return tryToApplyMove(sourceRank, sourceFile, destRank, destFile, copyAllSquares());
        
        // Pawn moving by more than one square.
        } else {
            return tryToApplyMoveAsType(sourceRank, sourceFile, destRank, destFile, playerPawnPassingType, copyAllSquares());
        }
    }
    
    function tryToMovePawnAttacking(sourceRank, sourceFile, destRank, destFile) {
        var allowedDirection = getPawnDirection(sourceRank, sourceFile);
        var playerColor = getPlayerColor(sourceRank, sourceFile);
        var playerQueenType = getQueenByColor(playerColor);
        var finalRank = getFinalRankByColor(playerColor);
        var opponentColor = getPlayerColor(destRank, destFile);
        var opponentPawnPassingType = getPawnPassingByColor(flipPlayerColor(playerColor));
        
        if (destRank - sourceRank != allowedDirection) {
            return false;
        }
        
        if (sourceFile != destFile - 1 && sourceFile != destFile + 1) {
            return false;
        }
        
        // Regular attack.
        if (!isSquareEmpty(destRank, destFile) && playerColor != opponentColor) {
            
            // Pawn reaching the final rank.
            if (destRank == finalRank) {
                return tryToApplyMoveAsType(sourceRank, sourceFile, destRank, destFile, playerQueenType, copyAllSquares());
                
            // Pawn not reaching the final rank.
            } else {
                return tryToApplyMove(sourceRank, sourceFile, destRank, destFile, copyAllSquares());
            }
        }

        // Attack in passing.
        if (isSquareEmpty(destRank, destFile) && testSquare(sourceRank, destFile, opponentPawnPassingType)) {
            var oldSquares = copyAllSquares();
            
            changeSquare(sourceRank, destFile, SquareType.empty);

            return tryToApplyMove(sourceRank, sourceFile, destRank, destFile, oldSquares);
        }
        
        return false;
    }
    
    function tryToMoveKnight(sourceRank, sourceFile, destRank, destFile) {
        if (isValidJumpMove(sourceRank, sourceFile, destRank, destFile)) {
            return tryToApplyMove(sourceRank, sourceFile, destRank, destFile, copyAllSquares());
        }
        
        return false;
    }
    
    function tryToMoveBishop(sourceRank, sourceFile, destRank, destFile) {
        if (isValidDiagonalMove(sourceRank, sourceFile, destRank, destFile)) {
            return tryToApplyMove(sourceRank, sourceFile, destRank, destFile, copyAllSquares());
        }
        
        return false;
    }
    
    function tryToMoveRook(sourceRank, sourceFile, destRank, destFile) {
        if (isValidLineMove(sourceRank, sourceFile, destRank, destFile)) {
            return tryToApplyMove(sourceRank, sourceFile, destRank, destFile, copyAllSquares());
        }
        
        return false;
    }
    
    function tryToMoveQueen(sourceRank, sourceFile, destRank, destFile) {
        if (isValidDiagonalMove(sourceRank, sourceFile, destRank, destFile) || isValidLineMove(sourceRank, sourceFile, destRank, destFile)) {
            return tryToApplyMove(sourceRank, sourceFile, destRank, destFile, copyAllSquares());
        }
        
        return false;
    }
    
    function isValidDiagonalMove(sourceRank, sourceFile, destRank, destFile) {
        return isDiagonalMove(sourceRank, sourceFile, destRank, destFile)
            && isDiagonalOpen(sourceRank, sourceFile, destRank, destFile);
    }
    
    function isValidLineMove(sourceRank, sourceFile, destRank, destFile) {
        return isLineMove(sourceRank, sourceFile, destRank, destFile)
            && isLineOpen(sourceRank, sourceFile, destRank, destFile);
    }
    
    function isValidJumpMove(sourceRank, sourceFile, destRank, destFile) {
        var distRank = getDistance(sourceRank, destRank);
        var distFile = getDistance(sourceFile, destFile);
        return (distRank == 2 && distFile == 1) || (distRank == 1 && distFile == 2);
    }
    
    function isOneSquareMove(sourceRank, sourceFile, destRank, destFile) {
        var distRank = getDistance(sourceRank, destRank);
        var distFile = getDistance(sourceFile, destFile);
        return distRank <= 1 && distFile <= 1;
    }
    
    function isDiagonalMove(sourceRank, sourceFile, destRank, destFile) {
        return getDistance(sourceRank, destRank) == getDistance(sourceFile, destFile);
    }

    function isDiagonalOpen(sourceRank, sourceFile, destRank, destFile) {
        var directionRank = getDirection(sourceRank, destRank);
        var directionFile = getDirection(sourceFile, destFile);
        
        var stepCount = getDistance(sourceRank, destRank) - 1;

        for (var step = 0; step < stepCount; ++step) {
            var rank = sourceRank + directionRank * (step + 1);
            var file = sourceFile + directionFile * (step + 1);

            if (getPlayerColor(rank, file) != PlayerColor.unspecified) {
                return false;
            }
        }

        return true;
    }
    
    function isLineMove(sourceRank, sourceFile, destRank, destFile) {
        return sourceRank == destRank || sourceFile == destFile;
    }
    
    function isLineOpen(sourceRank, sourceFile, destRank, destFile) {
        var minRank = Math.min(sourceRank, destRank);
        var maxRank = Math.max(sourceRank, destRank);
        var minFile = Math.min(sourceFile, destFile);
        var maxFile = Math.max(sourceFile, destFile);
        
        var distRank = maxRank - minRank;
        var distFile = maxFile - minFile;
        
        if (distFile == 0) {
            for (var i = 1; i < distRank; ++i) {
                if (getPlayerColor(minRank + i, minFile) != PlayerColor.unspecified) {
                    return false;
                }
            }
        } else {
            for (var i = 1; i < distFile; ++i) {
                if (getPlayerColor(minRank, minFile + i) != PlayerColor.unspecified) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /*function getKingPositionByColor(playerColor) {
        var size = getSize();
        
        for (var rank = 0; rank < size; ++rank) {
            for (var file = 0; file < size; ++file) {
                var squareType = getSquare(rank, file);
                //if (playerColor == PlayerColor.white && squareType == SquareType.king
                if (getSquareColor(rank, file) == playerColor) {
                    piecePositions.push(new Position(rank, file));
                }
            }
        }
        
        return new Position(-1, -1);
    }*/
    
    function getAttackedSquaresForPositions(positions) {
        var squares = [];

        for (var i = 0; i < positions.length; ++i) {
            getAttackedSquares(positions[i]).forEach(function(s) { squares.push(s); });
        }
        
        return squares;
    }
    
    function getAttackedLineSquares(rank, file) {
        var squares = [];
        
        for (var i = rank - 1; i >= 0; --i) {
            squares.push(new Position(i, file));
            
            if (!isSquareEmpty(i, file)) {
                break;
            }
        }
        
        for (var i = rank + 1; i < getSize(); ++i) {
            squares.push(new Position(i, file));
            
            if (!isSquareEmpty(i, file)) {
                break;
            }
        }
        
        for (var i = file - 1; i >= 0; --i) {
            squares.push(new Position(rank, i));
            
            if (!isSquareEmpty(rank, i)) {
                break;
            }
        }
        
        for (var i = file + 1; i < getSize(); ++i) {
            squares.push(new Position(rank, i));
            
            if (!isSquareEmpty(rank, i)) {
                break;
            }
        }
        
        return squares;
    }
    
    function getAttackedDiagonalSquares(rank, file) {
        var squares = [];
        var d = 0;
        
        do {
            ++d;
            squares.push(new Position(rank - d, file - d));
        } while (isSquareEmpty(rank - d, file - d));
        
        d = 0;
        
        do {
            ++d;
            squares.push(new Position(rank - d, file + d));
        } while (isSquareEmpty(rank - d, file + d));
        
        d = 0;
        
        do {
            ++d;
            squares.push(new Position(rank + d, file - d));
        } while (isSquareEmpty(rank + d, file - d));
        
        d = 0;
        
        do {
            ++d;
            squares.push(new Position(rank + d, file + d));
        } while (isSquareEmpty(rank + d, file + d));
        
        return squares;
    }
    
    function getAttackedSquares(rank, file) {
        var squareType = getSquare(sourceRank, sourceFile);
        switch (squareType) {
            case SquareType.empty:
                return [];
            
            case SquareType.whitePawn:
            case SquareType.whitePawnStarting:
            case SquareType.whitePawnPassing:
                return [new Position(rank - 1, file - 1), new Position(rank - 1, file + 1)];

            case SquareType.blackPawn:
            case SquareType.blackPawnStarting:
            case SquareType.blackPawnPassing:
                return [new Position(rank + 1, file - 1), new Position(rank + 1, file + 1)];

            case SquareType.whiteKnight:
            case SquareType.blackKnight:
                return [
                    new Position(rank - 2, file - 1),
                    new Position(rank - 2, file + 1),
                    new Position(rank + 2, file - 1),
                    new Position(rank + 2, file + 1),
                    new Position(rank - 1, file - 2),
                    new Position(rank + 1, file - 2),
                    new Position(rank - 1, file + 2),
                    new Position(rank + 1, file + 2)];

            case SquareType.whiteBishop:
            case SquareType.blackBishop:
                return getAttackedDiagonalSquares(rank, file);
                
            case SquareType.whiteRook:
            case SquareType.whiteRookStarting:
            case SquareType.blackRook:
            case SquareType.blackRookStarting:
                return getAttackedLineSquares(rank, file);

            case SquareType.whiteQueen:
            case SquareType.blackQueen:
                return getAttackedDiagonalSquares(rank, file).concat(getAttackedLineSquares(rank, file));

            case SquareType.whiteKing:
            case SquareType.whiteKingStarting:
            case SquareType.blackKing:
            case SquareType.blackKingStarting:
                return [
                    new Position(rank - 1, file - 1),
                    new Position(rank - 1, file),
                    new Position(rank - 1, file + 1),
                    new Position(rank, file - 1),
                    new Position(rank, file + 1),
                    new Position(rank + 1, file - 1),
                    new Position(rank + 1, file),
                    new Position(rank + 1, file + 1)];
                    
            default:
                return [];
        }
    }
    
    function getPiecePositionsByColor(playerColor) {
        var piecePositions = [];
        var size = getSize();
        
        for (var rank = 0; rank < size; ++rank) {
            for (var file = 0; file < size; ++file) {
                if (getSquareColor(rank, file) == playerColor) {
                    piecePositions.push(new Position(rank, file));
                }
            }
        }
        
        return piecePositions;
    }
    
    function getPawnMaxMoveDistance(rank, file) {
        switch (squares[rank][file]) {
            case SquareType.whitePawnStarting:
            case SquareType.blackPawnStarting:
                return 2;
            case SquareType.whitePawn:
            case SquareType.whitePawnPassing:
            case SquareType.blackPawn:
            case SquareType.blackPawnPassing:
                return 1;
            default:
                return 0;
        }
    }
    
    function getPawnDirection(rank, file) {
        switch (squares[rank][file]) {
            case SquareType.whitePawn:
            case SquareType.whitePawnStarting:
            case SquareType.whitePawnPassing:
                return -1;
            case SquareType.blackPawn:
            case SquareType.blackPawnStarting:
            case SquareType.blackPawnPassing:
                return 1;
            default:
                return 0;
        }
    }
    
    function getFinalRankByColor(playerColor) {
        if (playerColor == PlayerColor.white) {
            return 0;
        } else {
            return getSize() - 1;
        }
    }
    
    function getQueenByColor(playerColor) {
        return playerColor == PlayerColor.white
            ? SquareType.whiteQueen
            : SquareType.blackQueen;
    }
    
    function getPawnPassingByColor(playerColor) {
        return playerColor == PlayerColor.white
            ? SquareType.whitePawnPassing
            : SquareType.blackPawnPassing;
    }

    function getDirection(source, dest) {
        return source <= dest ? 1 : -1;
    }

    function getDistance(source, dest) {
        return Math.abs(dest - source)
    }
}
