# Building

<h3 align="center">

[![English BUILDING](https://img.shields.io/badge/Language-EN-blue.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/building/BUILDING.md)
[![Portuguese BUILDING](https://img.shields.io/badge/Linguagem-PT-green.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/building/BUILDING_PT.md)

</h3>

## Prerequisites
Since I've made all of it in a Linux environment I just know how to do in it. Mac and Windows users must seek help for each particularity of attempting to do on those environments.

### First things first...

You will need to generate a Telegram bot API key and that it's easy, just follow [this](https://core.telegram.org/bots#3-how-do-i-create-a-bot) step-by-step. Since I've shortened the RSS and iTunes links, you will be needing a Google URL Shortener API key, which it is easy to get, more about it [here](https://developers.google.com/url-shortener/v1/getting_started).

### Now the environment part...

Install [npm](https://www.npmjs.com/) and [Node.js](https://nodejs.org/en/) on your machine, since Linux has many package manager, each one with it's particularity set up you must seek how to do you it. But once you have set this up, open a terminal then navigate to the folder where you want your project to be then run this command:
```bash
git clone https://github.com/Fazendaaa/podsearch_bot
```
You should see something like this:
```bash
Cloning into 'podsearch_bot'...
remote: Counting objects: 98, done.
remote: Compressing objects: 100% (56/56), done.
remote: Total 98 (delta 36), reused 88 (delta 32), pack-reused 0
Unpacking objects: 100% (98/98), done.
```
## Installing
Just run the following command at your root project folder:
```bash
npm install
```
After some time a folder named "node_modules" should be appear in your root project folder. If you have any problem like errors or warnings from now on must be the libraries dependencies or API changes, since I've wrote using, at the time of this writing, the latest version of each one some changes must have occurred to give you those problems. 

Once you finalized all of this first setting up, run:
```bash
npm run build
```
And you should be presented with no warnings or any message in your terminal at all. no it is a good time to create your environment variables file to save the API keys that was granted to you at the [Prerequisites](https://github.com/Fazendaaa/podsearch_bot#Prerequisites) part, if you did not got one go check it out or no progress can be achieved any further. To create the file just run still at the root project folder:
```bash
touch .env
```
Once the file is created, just open it and past the following environment variables with their respective values that you own, just remember that those keys are related to you and must not be shared with anyone else, remember to always have this file in your [.gitignore](https://github.com/Fazendaaa/podsearch_bot/blob/master/.gitignore) so that way you do not push it accidentally. Your .env file must be something like this:
```bash
BOT_KEY="YourTelegramBotAPIKey"
GOOGLE_KEY="YourGoogleURLShortenerAPIKey"
```
# Running
After all of this setting up, just run your bot with:
```bash
npm run start
```
All of your bot's requests will be logged in your terminal. Have fun :3
# Running tests
Like I've mentioned, this is my first contact with TDD, that being said all of the code is being test as TS code still thanks to [jest-ts](https://github.com/kulshekhar/ts-jest) there's no need to transpiled to JS to run the tests.
## Breaking down
Since, right at the time of this writing, there's only test file and it's the only one that is running. You can find more about at [test](https://github.com/Fazendaaa/podsearch_bot/tree/master/test) folder. To run the test just type the following code at the root project folder:
```bash
npm test
```
And then the status of testing will be printed, something like:
```bash
 PASS  __test__/utils.test.ts
  Testing removeCmd function
    ✓ Searching "/search Nerdcast". (4ms)
    ...
    ✓ Has no number of episodes.

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |     67.5 |       52 |    60.71 |     67.5 |                   |
 utils.ts |     67.5 |       52 |    60.71 |     67.5 |... 98,299,302,307 |
----------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        1.773s
Ran all test suites.
```
More about the testing environment can be found at [jest.config.js](https://github.com/Fazendaaa/podsearch_bot/blob/master/jest.config.js).
## Coding styles
Since the TS language can be lintered with [ESlint](https://eslint.org/) or [TSLint](https://palantir.github.io/tslint/), I've choose the last one just because of the TS ecosystem, but the ESlint works fine as well. For more about it, see [tslint.config](https://github.com/Fazendaaa/podsearch_bot/blob/master/tslint.json).

In the case that you came from a JavaScript background and want to know how this magic of "compiling" -- I've used those quote marks because I still think that the right word for it is _transpiling_, but the interned know days uses compiling instead -- TS to JS is made, which setting I've set or not, see [tsconfig.json](https://github.com/Fazendaaa/podsearch_bot/blob/master/tsconfig.json).
