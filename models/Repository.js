const fs = require("fs");
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports = class Repository {
  constructor(objectsName) {
    this.objectsList = [];
    this.objectsFile = `./data/${objectsName}.json`;
    this.read();
  }
  read() {
    try {
      // Here we use the synchronus version readFile in order
      // to avoid concurrency problems
      let rawdata = fs.readFileSync(this.objectsFile);
      // we assume here that the json data is formatted correctly
      this.objectsList = JSON.parse(rawdata);
    } catch (error) {
      if (error.code === "ENOENT") {
        // file does not exist, it will be created on demand
        this.objectsList = [];
      }
    }
  }
  write() {
    // Here we use the synchronus version writeFile in order
    // to avoid concurrency problems
    fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
    this.read();
  }
  nextId() {
    let maxId = 0;
    for (let object of this.objectsList) {
      if (object.Id > maxId) {
        maxId = object.Id;
      }
    }
    return maxId + 1;
  }
  add(object) {
    try {
      object.Id = this.nextId();
      this.objectsList.push(object);
      this.write();
      return object;
    } catch (error) {
      return null;
    }
  }

  getByName(searchValue) {
    try {
      let listBookmark = [];
      for (let object of this.objectsList) {
        if (this.valueMatch(object.Name, searchValue)) {
          listBookmark.push(object);
        }
      }
      return listBookmark;
    } catch (error) {
      return null;
    }
  }
  valueMatch(value, searchValue) {
    return new RegExp(
      "^" + searchValue.toLowerCase().replace(/\*/g, ".*") + "$"
    ).test(value.toLowerCase());
  }

  getByCategory(searchValue) {
    try {
      let listBookmark = [];
      for (let object of this.objectsList) {
        if (this.valueMatch(object.Category, searchValue)) {
          listBookmark.push(object);
        }
      }
      return listBookmark;
    } catch (error) {
      return null;
    }
  }

  SortByName() {
    for (let i = 0; i < this.objectsList.length - 1; i++)
      for (let j = 0; j < this.objectsList.length - i - 1; j++)
        if (
          this.objectsList[j].Name.toLowerCase() >
          this.objectsList[j + 1].Name.toLowerCase()
        ) {
          let temp = this.objectsList[j];
          this.objectsList[j] = this.objectsList[j + 1];
          this.objectsList[j + 1] = temp;
        }
    return this.objectsList.sort();
  }

  SortByCategory() {
    for (let i = 0; i < this.objectsList.length - 1; i++)
      for (let j = 0; j < this.objectsList.length - i - 1; j++)
        if (
          this.objectsList[j].Category.toLowerCase() >
          this.objectsList[j + 1].Category.toLowerCase()
        ) {
          let temp = this.objectsList[j];
          this.objectsList[j] = this.objectsList[j + 1];
          this.objectsList[j + 1] = temp;
        }
    return this.objectsList;
  }

  getAll() {
    return this.objectsList;
  }
  get(id) {
    for (let object of this.objectsList) {
      if (object.Id === id) {
        return object;
      }
    }
    return null;
  }
  remove(id) {
    let index = 0;
    for (let object of this.objectsList) {
      if (object.Id === id) {
        this.objectsList.splice(index, 1);
        this.write();
        return true;
      }
      index++;
    }
    return false;
  }
  update(objectToModify) {
    let index = 0;
    for (let object of this.objectsList) {
      if (object.Id === objectToModify.Id) {
        this.objectsList[index] = objectToModify;
        this.write();
        return true;
      }
      index++;
    }
    return false;
  }
};
