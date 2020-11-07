const {Client} = require('cassandra-driver');
const databaseinfo = require('./properties.json');

async function run() {
    const client = new Client({
      cloud: { secureConnectBundle: 'secure-connect-hackphs.zip' },
      credentials: { username: databaseinfo.username, password: databaseinfo.password }
    });
  
    await client.connect();
  
    // Execute a query
    const rs = await client.execute('SELECT * FROM system.local');
    console.log(`Hello from cluster: ${rs.first()['cluster_name']}`);
  
    await client.shutdown();
  }
  
  // Run the async function
  run();