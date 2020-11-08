const {Client} = require('cassandra-driver');
const appinfo = require('./properties');

async function connect() {
    const client = new Client({
      cloud: { secureConnectBundle: 'secure-connect-hackphs.zip' },
      credentials: { username: appinfo.username, password: appinfo.password }
    });
  
    await client.connect();
  
    // Execute a query
    const rs = await client.execute('SELECT * FROM system.local');
    console.log(`Hello from cluster: ${rs.first()['cluster_name']}`);


    await client.execute('USE users;');
    await client.execute('CREATE TABLE IF NOT EXISTS users (username text PRIMARY KEY, githubtoken text);').
      then(res => {console.log("\n\nMade table\n\n");}).catch(res => console.log(res));
  
    return client;
  }
  
  module.exports = connect;