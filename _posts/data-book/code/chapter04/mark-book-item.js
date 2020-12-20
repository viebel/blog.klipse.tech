Catalog.markBookItemAsLent = function(catalog, isbn, bookItemId) {
    var infoPath = ["booksByIsbn", isbn, "bookItems", bookItemId, "isLent"];
    if(_.has(catalog, infoPath)) {
        throw "The book copy is already lent!"
    }
    return _.set(catalog, infoPath, true);
}
