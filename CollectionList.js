function Filter(){

    let matchingBookmarks = [];
    if ('sort' in params) {
        switch (params.sort.replace(/"/g, '')) {
            case "name":
                matchingBookmarks = this.bookmarksRepository.SortByName();
                break;
            case "category":
                matchingBookmarks = this.bookmarksRepository.SortByCategory();
                break;
        }  
    } 
}