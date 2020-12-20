UserManagement.addBookLending = function(userManagement, memberId,
                                         bookIsbn, bookItemId) {
    var bookLending = {
        "bookItemId": bookItemId,
        "bookIsbn": bookIsbn
    };

    var infoPath = ["members", memberId, "bookLendings"];
    return _.update(userManagement,
                    infoPath,
                    function(currentBookLendings) {
                        return _.concat(bookLendings,
                                        bookLending);
                    });
}
