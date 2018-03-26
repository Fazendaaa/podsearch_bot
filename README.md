# Podsearchbot
<h1 align="center">
    <br>
    <img width="260" src="https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png" alt="Podsearchbot"/>
	<br>
	<br>
	<br>
</h1>

> The solution that you need to share with your friends your love for podcast :3

[![bitHound Overall Score](https://www.bithound.io/github/Fazendaaa/podsearch_bot/badges/score.svg?style=flat-square)](https://www.bithound.io/github/Fazendaaa/podsearch_bot)
[![Dependecies](https://david-dm.org/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/blob/master/package.json)
[![Build Status](https://travis-ci.org/Fazendaaa/podsearch_bot.svg?branch=master&style=flat-square)](https://travis-ci.org/Fazendaaa/podsearch_bot)
[![Coverage Status](https://coveralls.io/repos/github/Fazendaaa/podsearch_bot/badge.svg?branch=master&style=flat-square)](https://coveralls.io/github/Fazendaaa/podsearch_bot?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/fazendaaa/podsearch_bot/badge.svg?style=flat-squaretargetFile=package.json)](https://snyk.io/test/github/fazendaaa/podsearch_bot?targetFile=package.json)
[![GitHub issues](https://img.shields.io/github/issues/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/issues)
[![GitHub forks](https://img.shields.io/github/forks/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/network)
[![GitHub stars](https://img.shields.io/github/stars/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/stargazers)
[![GitHub license](https://img.shields.io/github/license/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/blob/master/LICENSE)

[Telegram](https://www.telegram.org/) bot that searches podcast info in [iTunes](https://www.apple.com/lae/itunes/) store.

## About
This is a bot made using [TypeScript](http://typescriptlang.org/)(TS) because I want something to test the my new coding skill. And, like so, also the [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)(TDD), the first time that I've done anything with TDD.

Two new things in one project? Yes, and a third one is [Continuos Integration](https://en.wikipedia.org/wiki/Continuous_integration)(CI) just to be able to push running code at a master branch to be running at the server. And, a fourth one, is making a bot that supports it multiple languages.

Like so, once I've "finished" this code I intend to write an article at [Medium](https://medium.com/) talking about it. All the knowledge that I've got it because some one laid a trail so that I can build my own on it.
## How to use it
First of all, talk to [@podsearchbot](https://telegram.me/podsearchbot).
### Search
There're two ways of doing that:
#### ```/search```
Just open it a chat with Podsearchbot and then use it like this:
```
/search podcast name
```
Example:
```
/search The Story by The Mission
```
<h1 align="center">
    <img src="https://media.giphy.com/media/6C6NusTKMkC8UCsM0d/giphy.gif" width="500" height="550" />
</h1>

#### Inline mode
The inline mode works both in the Podsearchbot chat or any other chat:
```
@podsearchbot podcast name
```
Example:
```
@podsearchbot The Story by The Mission
```
<h1 align="center">
    <img src="https://media.giphy.com/media/3CVtxjnZ9HKGhjeeiD/giphy.gif" width="500" height="550" />
</h1>

##### Help
If you have any other questions about it just use it the help commanad:
```
/help
```
# How does it work?
You can build yourself a bot just like this one, just tag along with the following procedures.
## Prerequisites
Since I've made all of it in a Linux enviroment I just know how to do in it. Mac and Windows users must seek help for each particularity of attempting to do on those enviroments.

First things first...

You will need to generate a Telegram bot API key and that it's easy, just follow [this](https://core.telegram.org/bots#3-how-do-i-create-a-bot) step-by-step. Since I've shortened the RSS and iTunes links, you will be neding a Google URL Shortener API key, wich it is easy to get, more about it [here](https://developers.google.com/url-shortener/v1/getting_started).

Now the enviroment part...

Install [npm](https://www.npmjs.com/) and [Node.js](https://nodejs.org/en/) on your machine, since Linux has many package manager, each one with it's particularity settup you must seek how to do you it. But once you have set this up, open a terminal then navigate to the folder where you want your project to be then run this command:
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
Just run the following comand at your root project folder:
```bash
npm install
```
After some time a folder named "node_modules" should be appear in your root project folder. If you have any problem like errors or warnings from now on must be the libraries dependecies or API changes, since I've wrote using, at the time of this writing, the latest version of each one some changes must have occured to give you those problems. 

Once you finalized all of this first setting up, run:
```bash
npm run build
```
And you should be presented with no warnings or any message in your terminal at all. no it is a good time to create your enviroment variables file to save the API keys that was granted to you at the [Prerequisites](https://github.com/Fazendaaa/podsearch_bot#Prerequisites) part, if you did not got one go check it out or no progress can be achived any further. To create the file just run still at the root project folder:
```bash
touch .env
```
Once the file is created, just open it and past the following enviroment variables with thier respective values that you own, just remeber that those keys are related to you and must not be shared with anyone else, rember to always have this file in your [.gitignore](https://github.com/Fazendaaa/podsearch_bot/blob/master/.gitignore) so that way you do not push it accidentally. Your .env file must be something like this:
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
More about the testing enviroment can be found at [jest.config.js](https://github.com/Fazendaaa/podsearch_bot/blob/master/jest.config.js).
## Coding styles
Since the TS language can be lintered with [ESlint](https://eslint.org/) or [TSLint](https://palantir.github.io/tslint/), I've choose the last one just because of the TS ecosystem, but the ESlint works fine as well. For more about it, see [tslint.config](https://github.com/Fazendaaa/podsearch_bot/blob/master/tslint.json).

In the case that you came from a JavaScript background and want to know how this magic of "compiling" -- I've used those quotmarks because I still think that the right word for it is _transpiling_, but the internetd know days uses compiling instead -- TS to JS is made, wich setting I've setted or not, see [tsconfig.json](https://github.com/Fazendaaa/podsearch_bot/blob/master/tsconfig.json).
# Deployment
This bot is up and running at [Heroku](http://heroku.com/) through the Github integration, that means that each new push to the ```master``` branch means that is the code serving the bot. You can see more about how does it run at the server by looking at the [Procfile](https://github.com/Fazendaaa/podsearch_bot/blob/master/Procfile). You can also deploy yourself this bot into Heroku through:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Fazendaaa/podsearch_bot)

There's also a [Travis CI](http://travis-ci.org/) integration.
# Build with
* [Wallaby.j](http://wallabyjs.com/) - Live [Visual Studio Code](https://code.visualstudio.com/) test runner pluging;
* [Jest](https://facebook.github.io/jest/) - Test runner;
* [Telegraf.js](http://telegraf.js.org/) - Library that handles it the Telegram connection;
* [Telegraf-i18n](https://github.com/telegraf/telegraf-i18n) - Library that handles language integration;
* [moment.js](https://momentjs.com/) - Library that handles it the date and time formating;
* [i18n-yaml](https://github.com/martinheidegger/i18n-node-yaml) - Since Telegraf-i18n only handles Telegraf context, there's a need to parse other kinds of context;
* [dotenv](https://github.com/motdotla/dotenv) - Library that imports enviroment variables;
* [goo.gl](https://github.com/kaimallea/node-googl) - Library that hanles it the Google shorten API requests;
* [itunes-search](https://github.com/connor/itunes-node) - One of many libraries that does the fetching from iTunes API, but this one is the only one that does it right;
# Contributing
Please, I'm not a native/fluent english speaker, so whether you see a variable name wrote the wrong way or even some comment where I've wrote something with the wrong "past perfect way of life" or something like that, please let me know it. Not always is just about the code, but rather making it more clear to other people to learn from it.

So, whether is code or not you can help me out making this code more accessible by reading the [CONTRIBUTING.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/CONTRIBUTING.md). 
# Versoning
I would love to say that [SemVer](https://semver.org/) or anything like that is used but, in my personal experience, this kind of approach doesn't work very well with me, the guy who could be commiting in this project for two weeks in a roll and leave it for almost one year with no simple ```npm update```. So, no versoning system is used. 
# TODO
Since I will be keeping this README up to date with any major change and I don't use any versoning system to log all the fixed bugs or previous projects updates, you can still have a taste of what comes next right here:

* Translate this README in the following languages -- still don't know how to do it but I know that is possible:
    * English
    * Portuguese
* Write a CONTRIBUTING and making it possible so anyone can help even those who don't know coding just by translating the bot texts to the user native language;
* Improving code coverage;
* Integration with wit.ai.
# Authors
* Only [me](https://github.com/Fazendaaa) for now.
# License
Like many Open-Source Software (OSS) the MIT lincense is used, more about it in [LICENSE](https://github.com/Fazendaaa/podsearch_bot/blob/master/LICENSE).
# Acknowledgments
* Thanks to [PurpleBooth](https://gist.github.com/PurpleBooth) and this great [README](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) template and hers [CONTRIBUTING](https://gist.github.com/PurpleBooth/b24679402957c63ec426) template also;
* [Mattias Petter Johansson](https://twitter.com/mpjme) and his channel [FunFunFunction](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q), where I've learnt so many important coding best pratices; please don't think that this is a channel that will give any kind of "lazy-intro-tutorial" or anything like that, this channel open your eyes to how you can improve your existing skills and learn some more new ones;
* Since Jest mocking documentation left me with a lot of doubts, [this](https://hackernoon.com/api-testing-with-jest-d1ab74005c0a) tutorial helped me out a little, still have some issues to understand how to correct mock data. I highly tink that is because of my testing logic, once I figure out how to do it correctly I will rewrite all testing code; for now is "working" the best way I came up to; even being that horrible is not that much compared to having an API request all the time;
* I highly recommend checking it out my [**ytlofi**](https://github.com/Fazendaaa/ytlofi) project whether you ran through some issues trying to get any CI integration or even project badges.
