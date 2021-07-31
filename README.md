![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
# 🌲Trie Suite
This is a custom-built trie backend + CLI for Slingshot. Each aspect of the project are separated into their own folders.

The suite is consisted of two projects
**trie Server** - Backend server that manages a backend trie
**trie CLI** - Interacts with the trie Server to modify and query the trie

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

## 🖥️ Backend Server
The backend server that handles REST API requests that modifies and queries a backend trie. More about the project can be found [here](https://github.com/PikeNote/pike-trie/tree/main/trie-server).
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
## 📜 Trie CLI
Interfaces with the backend trie server to send out API requests. More about the project can be found [here](https://github.com/PikeNote/pike-trie/tree/main/trie-cli).
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
## 🖱️ Testing
The backend server is tested through the [trie.test.js](https://github.com/PikeNote/pike-trie/blob/main/test/trie.test.js "trie.test.js") script. This script tests a various amount of scenarios mainly involving with the server.

Testing is done through a npm module called [tap](https://www.npmjs.com/package/tap). On top of this, fastify which is what the backend server runs on can directly interface with the testing and inject mock requests which is what is used here.

Below are the scenarios tested.

**Testing of the main root directory**  
Requests a simple root directory of the backend API to see if it returns a successful request.

**Testing clear of the trie**  
Clearing of the entirety of the trie to see if that process works properly.

**Testing adding/removing words to the trie**  
Adds and removes 1 word from the trie to see if the removal and adding process works. After each request, a search is done to ensure the word is added.

**Adding/removing duplicate entries**  
Tests if doing duplicate request of adding and removing words would return the proper response to the client.

**Rapid 200 word adds/removes**  
Stress test to see if a rapid removal/adding of 200 words would successfully execute and log.

**Not including parameter in request**  
Tests specifically `/addTrie` and `/removeTrie` requests that are parameterless. This should return the proper response for parameterless requests.

**Query non-existant words**  
Tries to query for nonexistent words from the API to see if any errors would occur. 

**Executing in the correct order**  
Async function executing two requests (add and delete) to the API at once. After this is done, check if the requests properly went through without any error.

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
## 📜 License
This project is licensed under the MIT License.

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

