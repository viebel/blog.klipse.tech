UserManagement.addBookLending = function(userManagement, memberId,
                                         bookIsbn, bookItemId) {
    var bookLending = {
        "bookItemId": bookItemId,
        "bookIsbn": bookIsbn
    };
    var bookLendings = _.get(userManagement, ["members", memberId, "bookLendings"]);
    var nextBookLendings = _.concat(bookLendings, bookLending);

    var nextUserManagement = _.set(userManagement,
                                       ["members", memberId, "bookLendings"],
                                       nextBookLendings);
    return nextUserManagement;
}
