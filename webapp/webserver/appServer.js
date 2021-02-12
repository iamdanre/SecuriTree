// this script spins up an express server to serve static files generated by "ng build --prod"
const express = require('express');
const path = require('path');
 
const server = express();
 
// middleware to serve static content
server.use(express.static(path.join(__dirname, '../dist')));
 
// all get requests will point to angular's index.html in dist folder
server.get('/*', async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});
 
server.listen(8081, () => console.log('SecuriTree app is running on port 8081'));