
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
# 🌲Trie Server
This is a custom-built trie backend that the trie CLI interfaces with.

This server manages a local trie that exposes a set of backend API endpoints that can be used by the client to modify and query the trie.

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png) 

## 📖 Table of Contents
* [➤ Backend Server](#%EF%B8%8F-backend-server)
	* [Storage](#-storage)
	* [Queue](#-queue)
	* [CLI Interaction](#cli-interaction)
* [➤ Custom endpoint status codes](#%EF%B8%8F-custom-endpoint-status-codes)
* [➤ Backend Accessible Endpoints](#-backend-accessible-endpoints)
	* [Submitting a payload](#%EF%B8%8F-submitting-a-payload)
	* [/addTrie](#addTrie)
	* [/addTrie](#-/addTrie)
	* [/removeTrie](#-/removeTrie)
	* [/queryTrie](#-/queryTrie)
	* [/searchTrie](#-/searchTrie)
	* [/resetTrie](#-%EF%B8%8FresetTrie)
* [➤ License](#-license)
  
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
  
## 🖥️ Backend Server
The backend server is hosted [here](https://trie-server.pikenote.repl.co) on repl.it. This site has an interactive and easy to use online IDE. The server has a mode to keep it always online + dedicated more resources using the hacker plan I have on the platform.

The server is built on top of NodeJS and uses [fastify](https://github.com/fastify/fastify) to help serve the API.

**All responses/words going into the server are lowercased by default.**
  
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
  
### 💾 Storage
The data of the trie is stored in a JSON structure. This JSON is stored in a file locally after every modification. A version of this is always kept in memory. The file is used to load back. To help ensure frequent writes are successful to the backend trie file, a module named [fstorm](https://www.npmjs.com/package/fstorm) is used.  The module uses native fs functions + backend to allow frequent writes which may happen on the server to not fail and overwrite each other.
    
An example of a JSON structure for the word "hello"
```
{
  "h":{
    "e":{
      "l":{
        "l":{
          "o":{
            "endOfWord":true
          }
        }
      }
    }
  }
}

```
Using the `endOfWord` key, this helps indicate the pathing taken to this last letter is a whole word.  Each letter is stored as a key and each key contains nested JSON objects directing to other letters.
  
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
  
### 📜 Queue
The backend uses a system of a queue. Each request is processed and added into queue to be executed. This queue is an array. When a new request comes in, it is added and the queue would start recursively executing all instructions until there are none.

One special feature of the queue is that when opposite instructions are queued at the same time, no operation would be executed. The instruction that was on the queue would be removed and the instruction that was requested would not be added. This is to save on processing and cut out unnecessary modification.

**For example**:
Computer A requests adding the word "Hello"
Computer B requests deleting the word "Hello"

Once Computer B's request comes through, it would see that Computer A's request is on the queue is for the opposite operation. This would then proceed to remove Computer A's request and Computer B's request would not be added. This effective cancels out any operation being done.

The request returned when this happens will be
```
{
	"status":"100x",
	"result":"Counter option in queue is now removed."
}
```
  
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
  
### 🖥️ CLI Interaction
The CLI interacts with the backend server through a series of `GET` and `POST` requests. These requests are made to the endpoints as listed below.

One major thing to note is that when the CLI lists all words, an empty payload is sent to the `/queryTrie` endpoint. This queries every word in the trie and returns all words.
  
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
  
## ⌨️ Custom endpoint status codes
At all times, the server is guaranteed to return a status code with the returned JSON. This status code can determine if anything had gone wrong or could not be executed on the server side. This code will be stored in the `status` key of the JSON.

The status codes means the following:
```
100x - Success
101x - Failed (unknown cause)
102x - Failed (with cause)
103x - Maintaince
```
  
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
  
## 🌐 Backend Accessible Endpoints
Below are a list of all the endpoints exposed by the server.
  
|Endpoint|Parameters|Request type|Paramter Required|Usage|
|--|--|--|--|--|
| /addTrie | input (string) | POST | Yes |Used for adding a word to the trie
| /removeTrie| input (string) | POST | Yes | Used for removing a word from the trie
| /queryTrie| input (string) | POST | No | Used to query the trie for any words that start with the inputted string
| /searchTrie| input (string) | POST | Yes | Used to search the trie for an exact word
| /resetTrie|  | GET| No | Used to clear the entire trie
  
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
### 🖱️ Submitting a payload
When parameters are required on the POST request endpoints, a payload must be submitted as a JSON string. The key required is listed on the parameter section of the table above along with what type of variable the server is expecting.

`{"input":"stringHere"}`
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
### ➕ /addTrie
**Request Type**: POST
**URL**: https://trie-server.pikenote.repl.co/addTrie
**Parameter**: input (string) (required)
The `/addTrie` endpoint adds a new word onto the trie.  You can call a POST request to this endpoint with the payload format like below.

Example: Trying to insert the word "Hello"
`{"input":"Hello"}`

Once submitted, the server will check if the word is either already in queue or in the trie. If the check passes, the following response would be given back.
```
{
	"status":"100x",
	"result":"Operation added to queue!"
}
```
If it does already exist in the queue or trie, one of the following responses would be given back.
```
{
	"status":"102x",
	"result":"Word is already in the trie!"
}
```

```
{
	"status":"102x",
	"result":"Operation already exists in queue!"
}
```
If the counter queue option (where it would remove a pending queue since the two requests would cancel each other out) triggers, the following would be given back.
```
{
	"status":"100x",
	"result":"Counter option in queue is now removed."
}
```
**CURL Request Example**:
`curl -XPOST -d '{"input":"Hello"}' 'https://trie-server.pikenote.repl.co/addTrie'`
(Adds the word "Hello" to the trie)
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
### ➖ /removeTrie
**Request Type**: POST
**URL**: https://trie-server.pikenote.repl.co/removeTrie
**Parameter**: input (string) (required)
The `/removeTrie` endpoint tries to remove a word from the trie.  You can call a POST request to this endpoint with the payload format like below.

Example: Trying to remove the word "Hello"
`{"input":"Hello"}`

Once submitted, the server will check if the word is either already in queue or if it exists in the trie. If the check passes, the following response would be given back.
```
{
	"status":"100x",
	"result":"Operation added to queue!"
}
```
If it does already exist in the queue or does not eixst in the trie, one of the following responses would be given back.
```
{
	"status":"102x",
	"result":"Word does not exist in the trie!"
}
```

```
{
	"status":"102x",
	"result":"Operation already exists in queue!"
}
```
If the counter queue option (where it would remove a pending queue since the two requests would cancel each other out) triggers, the following would be given back.
```
{
	"status":"100x",
	"result":"Counter option in queue is now removed."
}
```
**CURL Request Example**:
`curl -XPOST -d '{"input":"Hello"}' 'https://trie-server.pikenote.repl.co/removeTrie'`
(Removes the word "Hello" from the trie)
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
### 🔎 /queryTrie
**Request Type**: POST
**URL**: https://trie-server.pikenote.repl.co/queryTrie
**Parameter**: input (string)
The `/queryTrie` endpoint tries to search/query the entire trie with words that begin with the input.  You can call a POST request to this endpoint with the payload format like below.

Example: Querying for the word "Hello" by using "H"
`{"input":"H"}`

This payload is not required as without it or an empty input, it would query all words and send back a list of them.

Once the query is submitted, the server tries to find the words starting with the inputted word. A list is returned to the `result` key of the JSON returned. There is no other error codes/other responses other than `100x` usually. If nothing is found or if it does not exist, the list returned would be empty.

Below is an example response if I try to query for "H" in the trie that has the words "Hello" and "Hi".
```
{
	"status":"100x",
	"result":["Hello","Hi"]
}
```
**CURL Request Example**:
`curl -XPOST -d '{"input":"H"}' 'https://trie-server.pikenote.repl.co/queryTrie'`
(Queries for "H" in the trie)
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
### 🔎 /searchTrie
**Request Type**: POST
**URL**: https://trie-server.pikenote.repl.co/searchTrie
**Parameter**: input (string) (required)
The `/searchTrie` endpoint tries to search the trie specifically for the word inputted. The response will be a `true` or `false` in the `result` key.  You can call a POST request to this endpoint with the payload format like below.

Example: Trying to find the word "Hello"
`{"input":"Hello"}`

Once the query is submitted, the server tries to find the word and returns the following. There is no other error codes/other responses other than `100x` usually. If nothing is found or if it does not exist, the result returned would be `false`.

Below is an example response if I try to find "Hello" in the trie that contains that word.
```
{
	"status":"100x",
	"result":true
}
```

**CURL Request Example**:
`curl -XPOST -d '{"input":"Hello"}' 'https://trie-server.pikenote.repl.co/searchTrie'`
(Tries to find "Hello" in the trie)
![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)
### 🗑️ /resetTrie
**Request Type**: GET
**URL**: https://trie-server.pikenote.repl.co/resetTrie
**Parameter**: None
The `/resetTrie` endpoint clears everything in the trie and resets it back to an empty state.

If the request succeeds, the following would return
```
{
	"status":"100x",
	"result":"Trie cleared!"
}
```

**CURL Request Example**:
`curl -XGET 'https://trie-server.pikenote.repl.co/resetTrie'`
(Clears the trie)


![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

## 📜 License
This project is licensed under the MIT License.

![-----------------------------------------------------](https://user-images.githubusercontent.com/56088716/103312593-8a37ff80-49eb-11eb-91d3-75488e21a0a9.png)

