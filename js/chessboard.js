var FieldType = {
    none: 0,

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

    var self = this;

    minSize = 2;
    maxSize = 16;
    size = initialSize;
    ranks = [];
    
    for (i = 0; i < size; ++i) {
        file = [];
        for (j = 0; j < size; ++j) {
            file.push(FieldType.none);
        }
        ranks.push(file);
    }

    this.getSize = function() {
        return size;
    };

    var sizeChanged = new DomainEvent('sizeChanged', this);
    var fieldChanged = new DomainEvent('fieldChanged', this);
    
    this.onSizeChanged = sizeChanged.subscribe;
    this.onFieldChanged = fieldChanged.subscribe;

    this.canEnlarge = function() {
        return size < maxSize;
    };

    this.canReduce = function() {
        return size > minSize;
    };

    this.enlarge = function() {
        if (!this.canEnlarge()) {
            throw new Error('Cannot enlarge, because maximum size has been reached.');
        }
        ++size;
        sizeChanged.raise(null);
    };

    this.reduce = function() {
        if (!this.canReduce()) {
            throw new Error('Cannot reduce, because minimum size has been reached.');
        }
        --size;
        sizeChanged.raise(null);
    };
    
    this.move = function(sourceRank, sourceFile, destRank, destFile) {
        fieldType = ranks[sourceRank][sourceFile];
        fieldChanged({ rank: sourceRank, file: sourceFile, type: FieldType.none});
        fieldChanged({ rank: destRank, file: destFile, type: fieldType});
    };
}