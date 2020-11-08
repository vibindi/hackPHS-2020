# Reprofile
## Submission for HackPHS 2020

Automating GitHub resume building.
Written by vibindi, scott-22, and iWolf22.

### How to run locally

1. Clone the repository
2. Navigate to the repository using your terminal
3. Install all dependencies
```bash
npm install
```
4. Set up a DataStax database, and change the name of the connect bundle in database.js.
5. Set the properties.js module export object to the following format:  
    ```javascript
    {
      username: "Your database username",
      password: "Your database password",
      cookiesecret: "Secret for signing cookies",
      clientId: "Client ID of your GitHub Oauth app",
      clientSecret: "Client secret of your GitHub Oauth app"
    }
    ```
6. Run the application
```bash
npm start
```
7. In your browser, go to http://localhost:3000/
