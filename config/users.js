// conf.js
// ----------
// Put all the users and configurations

// NOTEs:
// No more than 100 likes per hour

const users = [
  {
    id: process.env.INSTAGRAM_0_ID,
    username: process.env.INSTAGRAM_0_USERNAME,
    password: process.env.INSTAGRAM_0_PASSWORD
  },
  {
    id: process.env.INSTAGRAM_1_ID,
    username: process.env.INSTAGRAM_1_USERNAME,
    password: process.env.INSTAGRAM_1_PASSWORD
  }
];


module.exports = {
  user: users[ 0 ],
  unfollowLimit: 97,
  analyzeUsersLimit: 50,
  goodCandidateRatio: 0.85,
  limitLocations: 1,
  limitLikePages: 5
};


// ratio: followings >> followers
// in theory s/he will follow you back :)