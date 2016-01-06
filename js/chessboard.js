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

    var self = this;

    minSize = 2;
    maxSize = 16;
    standardSize = 8;
    size = initialSize;
    fields = [];
    
    for (i = 0; i < size; ++i) {
        file = [];
        for (j = 0; j < size; ++j) {
            file.push(FieldType.empty);
        }
        fields.push(file);
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
    
    this.resetToStandard = function() {
        if (size != standardSize) {
            throw new Error('Chessboard must be of the standard 8x8 size.');
        };
        
        for (rank = 2; rank < 6; ++rank) {
            for (file = 0; file < 8; ++file) {
                this.changeField(rank, file, FieldType.empty);
            }
        }
        
        for (file = 0; file < 8; ++file) {
            this.changeField(1, file, FieldType.blackPawn);
            this.changeField(6, file, FieldType.whitePawn);
        }
        
        this.changeField(0, 0, FieldType.blackRook);
        this.changeField(0, 1, FieldType.blackKnight);
        this.changeField(0, 2, FieldType.blackBishop);
        this.changeField(0, 3, FieldType.blackQueen);
        this.changeField(0, 4, FieldType.blackKing);
        this.changeField(0, 5, FieldType.blackBishop);
        this.changeField(0, 6, FieldType.blackKnight);
        this.changeField(0, 7, FieldType.blackRook);
        
        this.changeField(7, 0, FieldType.whiteRook);
        this.changeField(7, 1, FieldType.whiteKnight);
        this.changeField(7, 2, FieldType.whiteBishop);
        this.changeField(7, 3, FieldType.whiteQueen);
        this.changeField(7, 4, FieldType.whiteKing);
        this.changeField(7, 5, FieldType.whiteBishop);
        this.changeField(7, 6, FieldType.whiteKnight);
        this.changeField(7, 7, FieldType.whiteRook);
    };
    
    this.move = function(sourceRank, sourceFile, destRank, destFile) {
        sourceType = fields[sourceRank][sourceFile];
        this.changeField(sourceRank, sourceFile, FieldType.empty);
        this.changeField(destRank, destFile, sourceType);
    };
    
    this.changeField = function(rank, file, type) {
        fields[rank][file] = type;
        fieldChanged.raise({ rank: rank, file: file, type: type});
    };
}