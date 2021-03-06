import "./App.css";
import React, { Component } from "react";
import SearchBar from "./Components/SearchBar/SearchBar";
import Reports from "./Components/Reports/Reports";
import DATA from "./Data/Data";

class App extends Component {
  state = {
    library: [],
    search: "",
    searchResults: DATA,
    excludedWords: "",
    isSearchOptionsDisplay: false,
    isDisplayTxtFile: false,
    idToPass: 0,
    isDisplayTable: true,
    tags: {
      goodreport: [1, 2, 3, 4],
      conditionpresent: [0, 4],
    },
  };
  componentDidMount() {
    this.createDictionary();
  }

  createDictionary = () => {
    let tempState = [];
    for (let i = 0; i < DATA.length; i++) {
      let fileContents = DATA[i].location;
      let fileId = DATA[i].id;
      let test = fileContents
        .toLowerCase()
        .replace(/[^A-Za-z' ;]/g, "")
        .split(" ");

      let hash = {};
      for (let j = 0; j < test.length; j++) {
        if (!hash[test[j]]) {
          hash[test[j]] = 1;
        } else {
          hash[test[j]]++;
        }
      }
      let currentStorage = {
        dictionary: hash,
        id: fileId,
        location: fileContents,
      };
      tempState.push(currentStorage);
    }
    this.setState({ library: tempState });
  };
  searchData = () => {
    const { library } = this.state;
    const { search } = this.state;
    const { excludedWords } = this.state;

    let searchItems = search.toLowerCase().split(" ");
    let excludedItems = excludedWords.toLowerCase().split(" ");
    let searchResultsItems = [];
    for (let data in library) {
      let wordChecker = true;
      for (let k = 0; k < searchItems.length; k++) {
        if (!library[data].dictionary[searchItems[k]]) {
          wordChecker = false;
        }
      }
      if (excludedWords.length > 0) {
        for (let l = 0; l < excludedItems.length; l++) {
          if (library[data].dictionary[excludedItems[l]]) {
            wordChecker = false;
          }
        }
      }
      if (wordChecker === true) {
        searchResultsItems.push(library[data]);
      }
    }
    this.setState(
      {
        ...this.state,
        searchResults: searchResultsItems,
        isDisplayTable: true,
        isDisplayTxtFile: false,
      },
      () => console.log(this.state.searchResults)
    );
  };
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.searchData();
    }
  };

  onClickDataRow = (data) => {
    this.setState({
      ...this.state,
      isDisplayTxtFile: true,
      idToPass: data.id,
      isDisplayTable: false,
    });
  };

  onClickSearchDropDown = () => {
    this.setState({
      isSearchOptionsDisplay: !this.state.isSearchOptionsDisplay,
    });
  };
  onChangeSearchInput = (e) => {
    this.setState({ search: e.target.value });
  };
  onChangeExcludeInput = (e) => {
    this.setState({ excludedWords: e.target.value });
  };

  displayTagResult = (item) => {
    const { tags } = this.state;
    let tempState = [];
    let currentTag = tags[item];
    for (let data in DATA) {
      for (let i = 0; i < currentTag.length; i++) {
        if (DATA[data].id === currentTag[i]) {
          tempState.push(DATA[data]);
        }
      }
    }
    console.log(tempState);
    this.setState(
      {
        ...this.state,
        searchResults: tempState,
        isDisplayTable: true,
        isDisplayTxtFile: false,
      },
      () => console.log(this.state.searchResults)
    );
  };

  displayInbox = () => {
    this.setState({
      ...this.state,
      searchResults: DATA,
      isDisplayTable: true,
      isDisplayTxtFile: false,
    });
  };

  addTag = (item, id) => {
    const { tags } = this.state;
    let currentTag = tags[item];
    if (!currentTag.includes(id)) {
      currentTag.push(id);
    }
    this.setState({ ...this.state, tags: { ...tags, item: currentTag } });
  };
  removeTag = (item, id) => {
    const { tags } = this.state;
    let currentTag = tags[item];
    let newArr = [];
    if (currentTag.includes(id)) {
      newArr = currentTag.filter((word) => word !== id);
    }
    if (item === "goodreport") {
      this.setState({ ...this.state, tags: { ...tags, goodreport: newArr } });
    } else if (item === "conditionpresent") {
      this.setState({
        ...this.state,
        tags: { ...tags, conditionpresent: newArr },
      });
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Medical Reports</h1>
        </header>
        <div className="searchBar">
          <SearchBar
            isSearchOptionsDisplay={this.state.isSearchOptionsDisplay}
            onClickSearchDropDown={this.onClickSearchDropDown}
            onClickSearchBtn={this.searchData}
            onChangeSearchInput={this.onChangeSearchInput}
            onChangeExcludeInput={this.onChangeExcludeInput}
            handleKeyDown={this.handleKeyDown}
          />
        </div>
        <div className="row">
          <div className="col col-md-2 leftcol no-gutters">
            <div className="tags" onClick={() => this.displayInbox()}>
              <i className="fas fa-inbox tags"></i> Inbox
            </div>
            <div
              className="tags"
              onClick={() => this.displayTagResult("goodreport")}
            >
              <i className="fas fa-smile"></i> goodreport
            </div>
            <div
              className="tags"
              onClick={() => this.displayTagResult("conditionpresent")}
            >
              <i className="far fa-frown"></i> conditionpresent
            </div>
          </div>
          <div className="col">
            <div className="reports">
              <Reports
                isDisplayTable={this.state.isDisplayTable}
                searchResults={this.state.searchResults}
                isDisplayTxtFile={this.state.isDisplayTxtFile}
                idToPass={this.state.idToPass}
                onClick={this.onClickDataRow}
                tags={this.state.tags}
                addTag={this.addTag}
                removeTag={this.removeTag}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
