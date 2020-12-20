UserManagement.addMember = function(userManagement, member) {
    var email = _.get(member, "email");
    var infoPath = ["membersByEmail", email];
    if(_.has(userManagement, infoPath)) {
        throw "Member already exists.";
    }
    var nextUserManagement =  _.set(userManagement,
                                    infoPath,
                                    member);
    return nextUserManagement;
}

Library.addMember = function(library, member) {
    var currentUserManagement = _.get(library, "userManagement");
    var nextUserManagement = UserManagement.addMember(currentUserManagement, member);
    var nextLibrary = _.set(library, "userManagement", nextUserManagement);
    return nextLibrary;
}
