#!/usr/bin/env node

const {
  Command
} = require('commander'); // CLI handler (help menu, parameters, etc.)
const axios = require("axios"); // Request module
const chalk = require('chalk'); // Color for the console


const program = new Command();
program.version('1.0.0');
program.usage("[command] [input?]");

// List of commands + their uses filled in
var commands = [
  ["add", "Adds the selected input into the backend trie"],
  ["remove", "Removes the selected input into the backend trie"],
  ["query", "Queries for autofill sugestions based on the input"],
  ["search", "Searches for the input to see if the word exsits in the trie"]
]

// Build all the commands common with one function
for (i = 0; i < commands.length; i++) {
  program
      .command(`${commands[i][0]} <input>`)
      .description(commands[i][1])
      .action((input, options, command) => {
          handleRequests(input, command.name());
      });
}

// List all words in a trie
// Uses the pre-existing queryTrie to query all words from the start
program
  .command('list')
  .description('Lists all words in the trie')
  .action(() => {
      if (checkServers()) {
          queryTrie("");
      } else {
          console.log(`${chalk.red('Error')} || Please try again later. The server seems to be down and/or under maintaince.`)
      }
  });

// Clear the trie
program
  .command('clear')
  .description('Clears the entire trie')
  .action(() => {
      if (checkServers()) {
        axios.get('https://trie-server.pikenote.repl.co/resetTrie')
        .then(function(response) {
            response = response.data;
            if (response.status == "100x") {
                console.log(`${chalk.green("Success")} || ${response.result}`);
            } else {
                console.log(`${chalk.red('Error')} || An unexpected response has been received.\nResponse: ${response}`);
            }
        })
        .catch(function(error) {
            console.log(`${chalk.red('Error')} || An unexpected error has occured!\nError: ${error}`)
        })
      } else {
          console.log(`${chalk.red('Error')} || Please try again later. The server seems to be down and/or under maintaince.`)
      }
  });


// Check the server status before request to make sure it is not in maintaiance mode
async function checkServers() {
  await axios.get('https://trie-server.pikenote.repl.co')
      .then(function(response) {
          response = response.data;
          if (response.status == "100x") {
              return true
          } else {
              return false
          }
      })
      .catch(function(error) {
          return false;
          //console.log(`Unknown error has occured: ${error}`);
      })
}

/* 
Internal Response Codes
100x - Success
101x - Failed (unknown cause)
102x - Failed (with cause)
103x - Maintaince
*/

/* Main handler for four types of requests
Remove - https://trie-server.pikenote.repl.co/removeTrie
Add - https://trie-server.pikenote.repl.co/addTrie
Search - https://trie-server.pikenote.repl.co/searchTrie
Query - https://trie-server.pikenote.repl.co/queryTrie
*/
function handleRequests(input, type) {
  input = input.trim();
  if (checkServers()) {
      switch (type) {
          case "remove":
          case "add":
              axios.post(`https://trie-server.pikenote.repl.co/${type=="add"? "addTrie" : "removeTrie"}`, {
                      input: input
                  })
                  .then(function(response) {
                      response = response.data;
                      // Handle response codes
                      switch (response.status) {
                          case "100x":
                              console.log(`${chalk.green("Success")} || Successfully ${type=="add"? "added" : "removed"} ${chalk.green(input)} ${type=="add"? "from the" : "in the"} trie!`);
                              break;
                          case "102x":
                              console.log(`${chalk.yellow("Failed")} || ${response.reason}`);
                              break;
                          default:
                              console.log(`${chalk.red('Error')} || An unexpected response has been received.\nResponse: ${response}`);
                              break;
                      }
                  })
                  .catch(function(error) {
                      console.log(`${chalk.red('Error')} || An unexpected error has occured!\nError: ${error}`)
                  });
              break;

          case "search":
              axios.post(`https://trie-server.pikenote.repl.co/searchTrie`, {
                      input: input
                  })
                  .then(function(response) {
                      response = response.data;

                      if (response.result) {
                          console.log(`${chalk.green("Success")} || Successfully found ${chalk.green(input)} in the trie!`)
                      } else if (response.result == false) {
                          console.log(`${chalk.red("Success")} || Failed to find ${chalk.red(input)} in the trie!`)
                      } else {
                          console.log(`${chalk.red('Error')} || An unexpected response has been received.\nResponse: ${response}`)
                      }
                  })
                  .catch(function(error) {
                      console.log(`${chalk.red('Error')} || An unexpected error has occured!\nError: ${error}`)
                  });
                  break;
          case "query":
              queryTrie(input);
              break;
          default:
              break;
      }
  } else {
      console.log(`${chalk.red('Error')} || Please try again later. The server seems to be down and/or under maintaince.`)
  }
}

// Queries the trie from the api and responds with the list
// Usually does not return 102x
function queryTrie(input = "") {
  axios.post(`https://trie-server.pikenote.repl.co/queryTrie`, {
          input: input
      })
      .then(function(response) {
          response = response.data;
          if (response.result != null) {
              console.log(`${chalk.green("Success")} || ${JSON.stringify(response.result)}`)
          } else if (response.status == "102x") {
              console.log(`${chalk.red('Error')} || ${response.reason}`);
          } else {
              console.log(`${chalk.red('Error')} || An unexpected response has been received.\nResponse: ${response}`)
          }
      })
      .catch(function(error) {
          console.log(`${chalk.red('Error')} || An unexpected error has occured!\nError: ${error}`)
      });
}

program.parse();