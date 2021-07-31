![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
# 🌲Trie CLI
This is custom-built trie command line interface to interact with a customized trie backend. This project is intended as a takehome project for Slingshot.

This CLI tool has the ability to add, remove, query, list, and search words in a trie.

[![NPM](https://nodei.co/npm/@pikenote/pike-trie-cli.png)](https://nodei.co/npm/@pikenote/pike-trie-cli/)

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png) 

## 📖 Table of Contents
* [➤ Installing the CLI](#-installing-the-cli-)
* [➤ Using the CLI](#%EF%B8%8F-using-the-cli)
	* [trie-cli add](#-trie-cli-add)
	* [trie-cli remove]
	* [trie-cli query]
	* [trie-cli search]
	* [trie-cli list]
	* [trie-cli clear]
* [➤ License](#-license)

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

## 🔽 Installing the CLI []
The CLI can be installed through a package manager called npm. This is included by installing NodeJS. You can find it [here](https://nodejs.org/en/).

Once you have NodeJS installed, run the command below to install the CLI.
`npm i @pikenote/pike-trie-cli`

## 🖱️ Using the CLI
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

General commands/usage 
```
Usage: trie-cli [command] [input?]

Options:
-V, --version output the version number
-h, --help display help for command

Commands:
add <input> Adds the selected input into the backend trie
remove <input> Removes the selected input into the backend trie
query <input> Queries for autofill sugestions based on the input
search <input> Searches for the input to see if the word exsits in the trie
list Lists all words in the trie
clear Clears the entire trie
help [command] display help for command
```
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.pn
g)
### ➕ trie-cli add
The `trie-cli add` command adds a new word to the trie on the server. The command requires an input to be executed.

Examples:
Adding "Google" to the trie
`trie-cli add Google`
  ![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

### ➖ trie-cli remove
The `trie-cli remove` command attempts to remove a word from the trie. The command requires an input to be executed.

Examples:
Removing "Google" from the trie
`trie-cli remove Google`
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

### 🔎 trie-cli query
The `trie-cli remove` command attempts to search through the trie for all words matching/beginning with what you input. . The command requires an input to be executed.

The result returned will be in a list format like this:
`["a","aa","aaa"]`

Examples:
Querying "Go" to try to find Google
`trie-cli query Go`
Output:
`Success || ["Google"]`

  ![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

### 🔎 trie-cli search
The `trie-cli search` command tries to search for a word in the trie. Unlike the `trie-cli query` command, it is explicitly searching for if the word exists. . The command requires an input to be executed.

Examples:
Finding "Google"
`trie-cli search Google`
Output:
`Success || Successfully found Google in the trie`

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

### 📜 trie-cli list
The `trie-cli list` command goes through the entire trie and tries to find and list all words in the trie.

The result returned will be in a list format like this:
`["a","aa","aaa"]`

Examples:
`trie-cli list`

Output:
`Success || ["Google"]`

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

### 🗑️ trie-cli clear
The `trie-cli clear` command clears the entirety of the trie on the backend.

Examples:
`trie-cli clear`

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

## 📜 License
This project is licensed under the MIT License

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
