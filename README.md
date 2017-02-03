Bacchus
=====

Note: this project is WIP. 


## How to run it:

Open 4 tabs:

### start redis

`redis-server /usr/local/etc/redis.conf`

### start mongodb

`sudo mongod`

### start express

`npm run nodemon`


### start rollup

`npm run rollup`



Check kue on: http://localhost:8080/


### Milestones

- follow specific user's followers ✅
- queue manager to delay requests - Done, but implement it everywhere!
- add Pinterest, Twitter, Facebook and Tumblr API
- hashtag crawler like location


### Nice to have
- scheduler: add image + text in a folder and then post every day automatically: w/o GUI, just node script.