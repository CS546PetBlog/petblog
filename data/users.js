const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
let exportedMethods = {

  async checkUser(username, password) {
    const userCollection = await users();
    if(!typeof password === 'string' ||password.trim().length === 0 ||password.length < 6) throw 'password does not meet field requirements';
    if(!typeof username === 'string' ||username.trim().length === 0 ||username.length < 4) throw 'username does not meet field requirements';
    const lowerusername = username.toLowerCase();
    const user = await userCollection.findOne({username: lowerusername});
    console.log(user)
    if (!user) throw 'Either the username or password is invalid';
    //bcrypt to compare the hashed password in the database with the password input parameter.
      if (user.username === username) {
          const validPassword = await bcrypt.compare(password,user.password);
          console.log(validPassword)
          if (validPassword === true) {
              return {authenticated: true};
          }
          else 
            throw 'Either the username or password is invalid';
      }
  },
  async createUser(username, password) {
    if(!username || !password) throw 'error: empty username or password'
    if(!typeof username === 'string' ||username.trim().length === 0 ||username.length < 4 || username.indexOf(' ') >= 0) throw 'invalid USERNAME'
    // userName = userName.trim();
    if(!typeof password === 'string' ||password.trim().length === 0 ||password.length < 6 || password.indexOf(' ') >= 0 )throw 'invalid PASSWORD'

    const salt = await bcrypt.genSalt(16);
    const userCollection = await users();
    hashedPassword = await bcrypt.hash(password, salt);
    const lowerusername = username.toLowerCase();

    const user = await userCollection.findOne({username: lowerusername});
    // console.log(user)
    if (user === null) {
    let newUser = {
      username: lowerusername,
      password: hashedPassword
    };
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return {userInserted: true};
  }
else {
  return {userInserted: false};
}
  }
};

module.exports = exportedMethods;