var FieldType = {
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

function Chessboard(initialSize) {

    var minSize = 2;
    var maxSize = 16;
    var standardSize = 8;
    var fields = [];
    
    for (var i = 0; i < initialSize; ++i) {
        fields.push(createEmptyRank(initialSize));
    }

    this.getSize = function() {
        // Returns the number of ranks which should be always the same as the number of files.
        return fields.length;
    };

    var sizeChanged = new DomainEvent('sizeChanged', this);
    var fieldChanged = new DomainEvent('fieldChanged', this);
    
    this.onSizeChanged = sizeChanged.subscribe;
    this.onFieldChanged = fieldChanged.subscribe;

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
        
        fields.push(createEmptyRank(fields.length));
        for (var rank = 0; rank < fields.length; ++rank) {
            fields[rank].push(FieldType.empty);
        }

        sizeChanged.raise(null);
    };

    this.reduce = function() {
        if (!this.canReduce()) {
            throw new Error('Cannot reduce, because minimum size has been reached.');
        }
        
        fields.pop();
        for (var rank = 0; rank < fields.length; ++rank) {
            fields[rank].pop();
        }

        sizeChanged.raise(null);
    };

    this.resetToStandard = function() {
        if (fields.length != standardSize) {
            throw new Error('Chessboard must be of the standard 8x8 size.');
        }
        
        for (var rank = 2; rank < 6; ++rank) {
            for (var file = 0; file < 8; ++file) {
                changeField(rank, file, FieldType.empty);
            }
        }
        
        for (var file = 0; file < 8; ++file) {
            changeField(1, file, FieldType.blackPawn);
            changeField(6, file, FieldType.whitePawn);
        }
        
        changeField(0, 0, FieldType.blackRook);
        changeField(0, 1, FieldType.blackKnight);
        changeField(0, 2, FieldType.blackBishop);
        changeField(0, 3, FieldType.blackQueen);
        changeField(0, 4, FieldType.blackKing);
        changeField(0, 5, FieldType.blackBishop);
        changeField(0, 6, FieldType.blackKnight);
        changeField(0, 7, FieldType.blackRook);
        
        changeField(7, 0, FieldType.whiteRook);
        changeField(7, 1, FieldType.whiteKnight);
        changeField(7, 2, FieldType.whiteBishop);
        changeField(7, 3, FieldType.whiteQueen);
        changeField(7, 4, FieldType.whiteKing);
        changeField(7, 5, FieldType.whiteBishop);
        changeField(7, 6, FieldType.whiteKnight);
        changeField(7, 7, FieldType.whiteRook);
    };

    this.getFieldType = function(rank, file) {
        return fields[rank][file];
    }
    
    this.tryToMove = function(sourceRank, sourceFile, destRank, destFile) {
        var sourceType = fields[sourceRank][sourceFile];
        if (sourceType == FieldType.empty) {
            return true;
        }

        changeField(sourceRank, sourceFile, FieldType.empty);
        changeField(destRank, destFile, sourceType);
        return true;
    };

    function changeField(rank, file, type) {
        fields[rank][file] = type;
        fieldChanged.raise({ rank: rank, file: file, type: type});
    }

    function createEmptyRank(size) {
        var rank = [];
        for (j = 0; j < size; ++j) {
            rank.push(FieldType.empty);
        }

        return rank;
    }

}