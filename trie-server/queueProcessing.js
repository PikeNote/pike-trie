/*jshint esversion: 6 */ 
var fs = require('fs-extra');
var fstorm  = require('fstorm');
var path = require('path');

/* Copied from stackoverflow(https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value)
Remove array item by content
*/
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

module.exports = {
  /* Export Queue 
  Queue used to line up the tasks the computer needs to do.
  This makes sure it maintains order of the tasks when it is recieved.
  */
  
  queue: class {
    constructor() {
      this.localQueue = [];
      this.queueProcessing = false;
    }

    addQueue(word, operation) {
      try{

      // Queue check system
      /*
        Checks if the wanted operation already is in queue/is processing and/or in the tree.

        Counter operation system:
        Under the hood, the program checks if the opposite operation is already listed and cancels it out so that no operation is done to saving on processing.
      */
      var flipOption;

      switch(operation) {
        case "add":
          flipOption = "remove";

          // Ensure word is not already in the trie
          if (this.checkTrie(word)) {
            return ["102x","Word is already in the trie!"];
          }
          break;
        case "remove":
          flipOption = "add";

          if (!this.checkTrie(word)) {
            return ["102x","Word does not exist in the trie!"];
          }

          break;
      }

      // Check for any previous existing/opposite operations
      var wordFilter = this.localQueue.filter(queueItem => {
        queueItem[1] == word && (queueItem[0] == operation || queueItem[0] == flipOption);
      });

      if (wordFilter.length > 0) {
        if (wordFilter[wordFilter.length-1][0] == operation) {
          return ["102x","Operation already exists in queue!"];
        } else {
          this.localQueue.remove(wordFilter[wordFilter.length-1]);
          return ["100x","Counter option in queue is now removed."];
        }
      } else {
        this.localQueue.push([operation, word]);
        if (!this.queueProcessing) {
          this.moveQueue();
        }

        return ["100x","Operation added to queue!"];
      }
    } catch (err) {
      throw err;
    }
  }

    // Checks if the trie has the inputted words
    checkTrie(word) {
      return searchTrie(word, true)[0];
    }

    // Loop to move queue if any items still exists
    moveQueue() {
      if (this.localQueue.length > 0) {
        
        const currentEntry = this.localQueue[0];

        switch (currentEntry[0]) {
          case "add":
            addTrie(currentEntry[1]);
            break;
          case "remove":
            removeTrie(currentEntry[1]);
            break;
        }

        this.localQueue.shift();
        this.moveQueue();
      } else {
        this.queueProcessing = false;
      }
    }
  },
  resetNode() {
    trie = new trieNode();
    saveTrie();
  },
  queryTrie,
  searchTrie
};

class trieNode {
    // Adds a node to itself as a child
    addNode(letter,eod=false) {
      this[letter] = new trieNode(eod);
    }
  
    // Used at the beginning to set the class of each node/subnode
    setChildren() {
      var children = Object.keys(this).filter(t=>t!="endOfWord");

      children.forEach(entry => {
        if (!trieNode.prototype.isPrototypeOf(this[entry])) {
          this[entry] = Object.setPrototypeOf(this[entry], trieNode.prototype);
        }
        this[entry].setChildren();
      });
    }
}

var trie = new trieNode();

/* Main functions to modify the trie  */
function addTrie(word) {
  const splitWord = word.split('');

  // Loop to dig through the JSON object
  var tempTrieProgress = trie;
  for (i=0; i<splitWord.length; i++) {
    if (!(splitWord[i] in tempTrieProgress)) {
      tempTrieProgress.addNode(splitWord[i]);
    }
    tempTrieProgress = tempTrieProgress[splitWord[i]];
  }

  tempTrieProgress.endOfWord = true;

  saveTrie();
}

/* Removes a said word from the trie
 Recursively removes each item from the last letter in the trie
 Cleans up the trie for all the nodes unused after a word is removed
 */
function removeTrie(word) {
  const splitWord = word.split('');

  var tempIndecie = 0;
  function recursiveRemoval(tempTrie) {
    var currentIndecie = tempIndecie;
    if (tempIndecie < splitWord.length - 1) {
      if(splitWord[tempIndecie] in tempTrie){
        tempIndecie+=1;
        recursiveRemoval(tempTrie[splitWord[tempIndecie-1]]);
      }

      var currentTrieChildren = Object.keys(tempTrie[splitWord[currentIndecie]]).filter(t=>t!="endOfWord");

      if(currentTrieChildren.length == 0) {
        delete tempTrie[splitWord[currentIndecie]];
      }
    } else {
      if(tempTrie.length > 1) {
        delete tempTrie[splitWord[currentIndecie]][endOfWord];
      } else {
        delete tempTrie[splitWord[currentIndecie]];
      }
    }
    saveTrie();
  }

  recursiveRemoval(trie);

  /*
  if(recursiveRemoval(trie)) {
    return ["100x","Successful deletion"];
  } else {
    return ["102x","Word does not exist!"];
  }
  */
}


// General function to search/navigate through the trie
/* Parameters
  needEnd = Does it need to make sure the word is the trie
  needTemp = Does it need to return the last node it was on
*/
function searchTrie(word,needEnd = false,needTemp = false) {
  const splitWord = word.split('');

  // Loop to dig through the JSON object
  var tempTrieProgress = trie;

  for (i=0; i<splitWord.length; i++) {
    if (splitWord[i] in tempTrieProgress) {
      tempTrieProgress = tempTrieProgress[splitWord[i]];
    } else {
      return [false];
    }
  }

  var returnList = [];

  if(needEnd) {
    returnList.push(tempTrieProgress.endOfWord ? true : false);
  } else {
    returnList.push(true);
  }

  if(needTemp) {
    returnList.push(tempTrieProgress);
  }

  return returnList;
}


// Recursively query the trie through every branch from the input
function queryTrie(word) {
  // Loop to dig through the JSON object

  var searchResults = searchTrie(word, false, true);

  // Checks if the pathing exists in the trie, if not return empty
  var tempTrieProgress = searchResults[1];
  if(!searchResults[0]) {
     return ["100x",[]];
  }

  // Arrays to store the words constructed and the list building the words
  var wordList = [];
  var wordBuildingList = [];

  if (tempTrieProgress.endOfWord) {
    wordList.push(word);
  } else {
    wordBuildingList.push(word);
  }

  // Recursive function to construct letters and work backwards to set up to construct the next letter
  function queryList(tempTrie) {

    var sideBranches = Object.keys(tempTrie).filter(t=>t!="endOfWord");

    sideBranches.forEach(branch=> {
      wordBuildingList.push(branch);
      if ("endOfWord" in tempTrie[branch]) {
        wordList.push(wordBuildingList.join(""));
      }
      queryList(tempTrie[branch]);
      wordBuildingList.pop();
    });
  }

  queryList(tempTrieProgress);
  return  ["100x",wordList];
}

// Saves the trie locally to be loaded for next start
function saveTrie() {
  var writer = fstorm(path.join(__dirname, './trie.json'));

  writer.write(JSON.stringify(trie), function(err, status){
    //console.log(status) 
  });
}

// Reads the trie on startup to load all datan eeded
function readTrie() {
  var triePath = path.join(__dirname, './trie.json');
  if (fs.existsSync(triePath)) {
    // Read trie data from file (stored in case server restarts)
    const data = fs.readFileSync(triePath);
    var fileDataTrie = JSON.parse(data);
    trie = Object.setPrototypeOf(fileDataTrie, trieNode.prototype);
    console.log("Loading of previous trie done.");
  } else {
    saveTrie();
  }
}

// Setup the trie
readTrie();
trie.setChildren();