const Repository = require("../models/Repository.js");

module.exports = class BookmarksController extends require("./Controller") {
  constructor(req, res) {
    super(req, res);
    this.bookmarksRepository = new Repository("Bookmarks");
  }
  getAll() {
    this.response.JSON(this.bookmarksRepository.getAll());
  }

  /*
                getName(params){
                    if(params.name.includes("*")){
                        let text = params.name.slice(0, -1)
                        Bookmarks.array.forEach(bookmark => {
                          if(bookmark.name.indexOf(text) !== -1)
                            bookmarksReturn.push(bookmark)
                        }) 
                    }
                    else{
                        bookmark.array.forEach(bookmark => {
                            if(bookmark.name === params.name){
                                bookmarksReturn.push(bookmark);
                            }
                        });
                    }
                }
        */
  /*get(id) {
            let params = this.getQueryStringParams();
            console.log(params.name);
            console.log(params.category);
            if (!isNaN(id))
                this.response.JSON(this.bookmarksRepository.get(id));
            else {
                if (this.checkParam(params)) {
                    if ("category" in params) {
                        this.response.JSON(this.bookmarksRepository.getByCategory(params.category))
                    }
                    if ("name" in params) {
                        this.response.JSON(this.bookmarksRepository.getByName(params.name))
                    }
                }
                    
                this.response.JSON(this.bookmarksRepository.getAll());
            }

        }*/

  get(id) {
    let params = this.getQueryStringParams();

    if (!isNaN(id)) this.response.JSON(this.bookmarksRepository.get(id));
    else if (params != null) {
      if (Object.keys(params).length === 0) this.help();
      else {
        let matchingBookmarks = [];
        if ("sort" in params) {
          switch (params.sort) {
            case "name":
              matchingBookmarks = this.bookmarksRepository.SortByName();
              break;
            case "category":
              matchingBookmarks = this.bookmarksRepository.SortByCategory();
              break;
          }
        }
        if ("name" in params)
          matchingBookmarks = this.bookmarksRepository.getByName(params.name);
        if ("category" in params) {
          matchingBookmarks = this.bookmarksRepository.getByCategory(
            params.category,
            matchingBookmarks
          );
        }

        this.response.JSON(matchingBookmarks);
      }
    } else {
      this.response.JSON(this.bookmarksRepository.getAll());
    }
  }

  post(bookmark) {
    // todo : validate contact before insertion
    // todo : avoid duplicates
    let newBookmark = this.bookmarksRepository.add(bookmark);
    if (newBookmark) this.response.created(JSON.stringify(newBookmark));
    else this.response.internalError();
  }
  put(bookmark) {
    // todo : validate contact before updating
    if (this.bookmarksRepository.update(bookmark)) this.response.ok();
    else this.response.notFound();
  }
  remove(id) {
    if (this.bookmarksRepository.remove(id)) this.response.accepted();
    else this.response.notFound();
  }

  checkParams(params) {
    console.log("check le gros ca civic va vite en criss");
    if ("sort" in params) {
      if (params.sort !== "name") {
        return this.error(params, "you can't sort this way");
      } else if (params.sort === "category") {
        return this.error(params, "you can't sort this way");
      }
    }
    if ("name" in params) {
      if (params.name.lenght === 0) {
        return this.error(params, "you cant sort this way");
      }
    }
    if ("category" in params) {
      if (params.category.length === 0) {
        return this.error(params, "category your trying to fin doesnt exist");
      }
    }

    return true;
  }

  doOperation(params) {
    console.log("operation la capital vendu");
    if ("category" in params) {
      bookmark.array.forEach((bookmark) => {
        if (bookmark.category === params.category) {
          bookmarksReturn.push(bookmark);
        }
      });
    } else if ("name" in params) {
      if (params.name.includes("*")) {
        let text = params.name.slice(0, -1);
        bookmark.array.forEach((bookmark) => {
          if (bookmark.name.indexOf(text) !== -1)
            bookmarksReturn.push(bookmark);
        });
      } else {
        bookmark.array.forEach((bookmark) => {
          if (bookmark.name === params.name) {
            bookmarksReturn.push(bookmark);
          }
        });
      }
    } else if ("sort" in params) {
      if (params.sort.includes("name")) {
        bookmark.name.sort();
        bookmarksReturn.push(bookmark);
      } else if (params.sort.includes("category")) {
        bookmark.category.sort();
        bookmarksReturn.push(bookmark);
      }
    }
    return bookmarksReturn;
  }
};
