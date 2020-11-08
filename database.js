const {Client} = require('cassandra-driver');
const appinfo = require('./properties');

function connect() {
  const client = new Client({
    cloud: { secureConnectBundle: 'secure-connect-hackphs.zip' },
    credentials: { username: appinfo.username, password: appinfo.password }
  });

  client.connect().
    then(res => client.execute('USE users;')).
    then(res => client.execute('CREATE TABLE IF NOT EXISTS users (username text PRIMARY KEY, githubtoken text);')).
    catch(res => console.log(res));

  return client;
}

module.exports = connect;