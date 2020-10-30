class Library {
    static addBookItem(libraryData, userId, bookItemInfo) {
        if(UserManagement.isLibrarian(libraryData.users, userId)) {
            return Catalog.addBookItem(libraryData.catalog, bookItemInfo);
        } else {
            throw "Not allowed to add a book item"; // <1>
        }
    }
}

class UserManagement {
    static isLibrarian(userManagementData, userId) {
        // will be implemented later <2>
    }
}

class Catalog {
    static addBookItem(catalogData, bookItemInfo) {
        // will be implemented later <3>
    }
}
