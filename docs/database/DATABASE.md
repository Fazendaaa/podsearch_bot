# Database
<h3 align="center">

[![English DATABASE](https://img.shields.io/badge/Language-EN-blue.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/database/DATABASE.md)
[![Portuguese DATABASE](https://img.shields.io/badge/Linguagem-PT-green.svg?longCache=true&style=for-the-badge)](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/database/DATABASE_PT.md)

</h3>
> Working on it

As I wanted to learn even more, I've decided to unplug the storage in two databases with three entities at total; that way I can learn even more about other languages and DB's services. Being that the notification system and user management will be handled as NoSQL("Non" Structured Query Language) and the recommendation will be handle as SQL.

_"Why broke in two DBs?"_ To make it in a way that have an recommendation system independence and that way improving performance.

<h1 align="center">
    <br>
    <img src="https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/docs/database/EN/storage.png" alt="storage"/>
	<br>
	<br>
</h1>

# Notifications
The notification system still going to run in the main bot process, just like I've used in a similar project, the [ANILISTbot](https://github.com/Fazendaaa/Anilist-bot), and didn't ran into major problems of any sort. It will be process running each half hour.

As a large podcasts numbers doesn't post any episode in a pattern way this way there's no way of knowing when the next episode will be released; which become a problem once a queue could be implemented to solve this, only seeing the first elements until all released episodes been notified, running this each half an hour. With that in mind, it will be necessary that a list of subscribed podcast be verified all of it's elements to see which one released any new episode.

I intend to give some kind of analysis to improve this, like a log of days/hours that each podcast usually release it's episodes, there are podcasts which release in given period, this would allow the system to improve notification.

Besides that, the user has to be given the right to choose whether or not be notified when a new episode is released or be notified only once per day about all the new daily episodes. Someone who listen just a little could not understand this, but if you stop and think properly will see that some other person whom consumes like five podcasts each week and all of those episodes are released upon the same week day, this could make things a little troublesome if each new episode a new notification pop up, making the person to disable the bot notifications and forgetting all together. The idea is an bot reminder not a spam, making the user less productive in the rest of the day.

# Users

Entity easy to understand, it will have user basic information, podcasts that he listen to and podcasts recommendation group reference...

_"But... The recommendations will be stored in another different DB?"_ Yes!

What happens is that a given user could listen to more or less podcast than most, besides that he could subscribe or unsubscribe at any moment, this means that it will better to relate it to the notification system; once an user requests to see all the podcasts that he listen to one way to do it is running through all the podcasts seeing whether or not the user is subscribed to them and this approach would mean a more difficult way to remove a user from the system -- it's not impossible and this approach could not be "unreasonable" to think, but it isn't the best one and could be better and that's why the user will have a link to the podcasts also.

The recommendation system will address the user to given groups, so attaching the user to it is not a great idea also and if the podcast recommendations were a relation between "entities" -- given recommendation will be another DB completely different could be related, in a macro system vision, as another entity --, this wouldn't improve the recommendations through time, would be a brute force approach to the problem that would classify the user as random as possible, not relating to how his taste for podcast change it through time, this would also mean that the recommendation algorithm would not improve. That's why this project won't follow this path.

Another important point is to emphasize the transitions, stop to listen to given podcast or start to listen to a given kind of it could not mean a major change to his podcasts preferences given it's not something to drastic like listen to a lot of podcast of the same type. This is because a user is not strict related to stop listen to a given podcast because don't "enjoy it", could mean other things completely different like not having time to listen or the podcast stop releasing new episodes could also mean the unsubscribing.

# Recommendations
One podcast only is never going to classify a user. Like a user usually listen to more than one, the set of it is needed it to give a recommendation to what to listen to, besides that, like the user could ask for trending podcasts given a podcast kind, this would mean improving a lot the user experience.

One of my concerns was that all of the data doesn't show in which language the podcast is spoken, so a portuguese fluent speaker could be receiving a recommendation to only english listeners given the podcast kind, like RPGs as example. A filter could infer the language type through an algorithm that reads the RSS feed and spill an language probability of being.

_"Why run it in a different DB?"_ To improve performance.

Asides from learning, unplugging the recommendations engine from the bot process is a matter of performance also. Since the bot process handle the searches requests -- a responsive task -- and notifications -- a appointed task --, it will be not overload from it through time; if the recommendations engine was attached it to the main process the difficulty of scaling an running without missteping into a major trouble would mean a higher maintainability cost as if was a unplugged process. This is one of the benefits of micro services instead of a monolith.

As the thirsty to learn something new still moves me, since Google presented the world with [Tensor Flow](https://www.tensorflow.org/) I wanted to do something with it, even more after the bindings being released to JavaScript. But, aside from that, I've decided to use a _Google approach_, using Go and Google hosting system; that way I could learn more about it.

So when the user wants a recommendation the bot will make a request through an API to the recommendation engine asking for it.

# A step even futher
The structures of notifications plus users will be presented in [NOSQL.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/database/NOSQL.md) likewise recommendations structures in [SQL.md](https://github.com/Fazendaaa/podsearch_bot/blob/master/docs/database/SQL.md).
