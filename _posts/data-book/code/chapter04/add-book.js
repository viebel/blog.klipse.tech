Catalog.addBook = function(catalog, book) {
    var isbn = _.get(book, "isbn");
    var authors = _.get(book, "authors");
    var catalogWithAuthors = _.reduce(catalog, authors, function(author) { // maybe assume single author to avoid explaining about reduce
        return Catalog.addBookToAuthor(catalog, author, book);
    });
    return _.set(catalogWithAuthors, ["booksByIsbn", isbn], book);
}

Author.id = function(author) {
    var name = _.get(author, "name");
    return name.toLowerCase().replaceAll(" ", "-");
}

Catalog.ensureAuthorExists = function(catalog, author) {
    var id = Author.id(author);
    if(_.get(authorData, ["authorsById", id])) {
        return catalog;
    }
    var authorData = {
        "id": id,
        "name": _.get(author, "name"),
        "bookIsbns": []
    };
    return _.set(catalog, ["authorsById", id], authorData);
}

Catalog.addBookToAuthor = function(catalog, author, book) {
    var catalogWithAuthor = Catalog.ensureAuthorExists(catalog, author);
    var id = Author.id(author);
    var isbn = _.get(book, "isbn");
    return _.set(catalogWithAuthor, ["authorsById", author, "bookIsbns", isbn], book);
}

Library.addAuthor = function(library, author) {
    var nextCatalog = Catalog.addAuthor(_.get(library, "catalog"), author);
    return _.set(library, "catalog", nextCatalog);
}

System.addAuthor = function (author) {
    var library = SystemData.get();
    var nextLibary = Library.addAuthor(author);
    System.data.update(library, nextLibrary);
}
