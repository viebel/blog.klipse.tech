// catalog.js
function addBookItem(catalogData, bookItemData) {
    var bookData = findOrCreateBook(catalogData, bookItemData.title);
    return addBookItemToBook(catalogData, bookData, bookItemData); // <1>
}

function addBookItemToBook(catalogData, bookData, bookItemData) {
    // will be implemented later
}
