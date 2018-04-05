# Podsearch
<h1 align="center">
    <br>
    <img width="260" src="https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png" alt="Podsearch"/>
	<br>
	<br>
</h1>

<h3 align="center">

[![English README](https://img.shields.io/badge/Language-EN-blue.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/README.md)
[![Portuguese README](https://img.shields.io/badge/Linguagem-PT-green.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/readme/README_PT.md)

</h3>

<h4 align="center">

[![bitHound Overall Score](https://www.bithound.io/github/Fazendaaa/podsearch_bot/badges/score.svg?style=flat-square)](https://www.bithound.io/github/Fazendaaa/podsearch_bot)
[![Dependencies](https://david-dm.org/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/blob/master/package.json)
[![Build Status](https://travis-ci.org/Fazendaaa/podsearch_bot.svg?branch=master&style=flat-square)](https://travis-ci.org/Fazendaaa/podsearch_bot)
[![Coverage Status](https://coveralls.io/repos/github/Fazendaaa/podsearch_bot/badge.svg?branch=master&style=flat-square)](https://coveralls.io/github/Fazendaaa/podsearch_bot?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/fazendaaa/podsearch_bot/badge.svg?style=flat-squaretargetFile=package.json)](https://snyk.io/test/github/fazendaaa/podsearch_bot?targetFile=package.json)
[![GitHub issues](https://img.shields.io/github/issues/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/issues)
[![GitHub forks](https://img.shields.io/github/forks/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/network)
[![GitHub stars](https://img.shields.io/github/stars/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/stargazers)
[![GitHub license](https://img.shields.io/github/license/Fazendaaa/podsearch_bot.svg?style=flat-square)](https://github.com/Fazendaaa/podsearch_bot/blob/master/LICENSE)

</h4>

> The solution that you need to share with your friends your love for podcast :3

[Telegram](https://www.telegram.org/) bot that searches podcast info in [iTunes](https://www.apple.com/lae/itunes/) store.

## About
This is a bot made using [TypeScript](http://typescriptlang.org/)(TS) because I want something to test the my new coding skill. And, like so, also the [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)(TDD), the first time that I've done anything with TDD.

Two new things in one project? Yes, and a third one is [Continuos Integration](https://en.wikipedia.org/wiki/Continuous_integration)(CI) just to be able to push running code at a master branch to be running at the server. And, a fourth one, is making a bot that supports it multiple languages.

Like so, once I've "finished" this code I intend to write an article at [Medium](https://medium.com/) talking about it. All the knowledge that I've got it because some one laid a trail so that I can build my own on it.
## How to use it
First of all, talk to [@podsearchbot](https://telegram.me/podsearchbot).
### Disclaimer
By default all the commands are in English, but you can see if que same command is available in your language.
### Search
There're three ways of doing that:

#### Inline mode
The inline mode works both in the Podsearchbot chat or any other chat:
```
@podsearchbot podcast name
```
Example:
```
@podsearchbot B9
```
<h1 align="center">
    <img src="https://gph.is/2JhL0cy" width="650" height="720" />
</h1>

#### Button
Just press search button available, it will ask you for podcast name and then does the search.
<h1 align="center">
    <img src="https://gph.is/2q6kf2P" width="650" height="720" />
</h1>

#### ```/search```
Just open it a chat with Podsearchbot and then use it like this:
```
/search podcast name
```
Example:
```
/search The Mission
```
<h1 align="center">
    <img src="https://gph.is/2q5QT4z" width="650" height="720" />
</h1>

##### Help
If you have any other questions about it just use it the help command:
```
/help
```
# How does it work?
You can build yourself a bot just like this one, just follow the procedures listed in [BUILDING.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/building/BUILDING.md).
# Deployment
This bot is up and running at [Heroku](http://heroku.com/) through the Github integration, that means that each new push to the ```master``` branch means that is the code serving the bot. You can see more about how does it run at the server by looking at the [Procfile](https://github.com/Fazendaaa/podsearch_bot/blob/master/Procfile). You can also deploy yourself this bot into Heroku through:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Fazendaaa/podsearch_bot)

There's also a [Travis CI](http://travis-ci.org/) integration.
# Build with
* [Wallaby.j](http://wallabyjs.com/) - Live [Visual Studio Code](https://code.visualstudio.com/) test runner plug-in;
* [Jest](https://facebook.github.io/jest/) - Test runner;
* [Telegraf.js](http://telegraf.js.org/) - Library that handles it the Telegram connection;
* [Telegraf-i18n](https://github.com/telegraf/telegraf-i18n) - Library that handles language integration;
* [moment.js](https://momentjs.com/) - Library that handles it the date and time formating;
* [i18n-yaml](https://github.com/martinheidegger/i18n-node-yaml) - Since Telegraf-i18n only handles Telegraf context, there's a need to parse other kinds of context;
* [dotenv](https://github.com/motdotla/dotenv) - Library that imports environment variables;
* [goo.gl](https://github.com/kaimallea/node-googl) - Library that handles it the Google shorten API requests;
* [itunes-search](https://github.com/connor/itunes-node) - One of many libraries that does the fetching from iTunes API, but this one is the only one that does it right.
# Contributing
Please, I'm not a native/fluent english speaker, so whether you see a variable name wrote the wrong way or even some comment where I've wrote something with the wrong "past perfect way of life" or something like that, please let me know it. Not always is just about the code, but rather making it more clear to other people to learn from it.

So, whether is code or not you can help me out making this code more accessible by reading the [CONTRIBUTING.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/contributing/CONTRIBUTING.md). 
# Versioning
I would love to say that [SemVer](https://semver.org/) or anything like that is used but, in my personal experience, this kind of approach doesn't work very well with me, the guy who could be committing in this project for two weeks in a roll and leave it for almost one year with no simple ```npm update```. So, no versioning system is used. 
# TODO
Since I will be keeping this README up to date with any major change and I don't use any versioning system to log all the fixed bugs or previous projects updates, you can still have a taste of what comes next right here:

* Writing a notification system, so that upon a new episode release the user will be notified -- making it available this notification at user timezone;
* Adding podcasts recommendations thanks to [_lowhigh_](https://www.reddit.com/r/TelegramBots/comments/875tsz/podsearchbot/dwao2qj/) feedback on Reddit;
* Integration with [wit.ia](https://wit.ai/);
* Change URL shortener since Goo.gl will be shut down.
# Authors
* Only [me](https://github.com/Fazendaaa) for now.

Consider buy me a coffee:

[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/Fazenda)

Or even becoming a patron:

[![Patreon](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/Fazenda/overview)

# License
Like many Open-Source Software (OSS) the MIT license is used, more about it in [LICENSE](https://github.com/Fazendaaa/podsearch_bot/blob/master/LICENSE).
# Acknowledgments
* Thanks to [PurpleBooth](https://gist.github.com/PurpleBooth) and this great [README](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) template and hers [CONTRIBUTING](https://gist.github.com/PurpleBooth/b24679402957c63ec426) template also;
* [Mattias Petter Johansson](https://twitter.com/mpjme) and his channel [FunFunFunction](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q), where I've learnt so many important coding best practices; please don't think that this is a channel that will give any kind of "lazy-intro-tutorial" or anything like that, this channel open your eyes to how you can improve your existing skills and learn some more new ones;
* Since Jest mocking documentation left me with a lot of doubts, [this](https://hackernoon.com/api-testing-with-jest-d1ab74005c0a) tutorial helped me out a little, still have some issues to understand how to correct mock data. I highly think that is because of my testing logic, once I figure out how to do it correctly I will rewrite all testing code; for now is "working" the best way I came up to; even being that horrible is not that much compared to having an API request all the time;
* I highly recommend checking it out my [**ytlofi**](https://github.com/Fazendaaa/ytlofi) project whether you ran through some issues trying to get any CI integration or even project badges.
