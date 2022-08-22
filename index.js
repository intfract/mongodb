const MongoClient = require('mongodb').MongoClient
const mongo_username = process.env.USER
const mongo_password = process.env.TOKEN

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@mevn.qa2myza.mongodb.net/crmdb?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true })

const express = require('express')
let app = express()
const bodyParser = require('body-parser')
const http = require('http').Server(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.sendFile('/index.html', {root:'.'})
})

app.get('/create', function (req, res) {
  res.sendFile('/create.html', {root:'.'})
})

app.post('/create', function (req, res, next) {
  client.connect(err => {
    const customers = client.db("crmdb").collection("users")

    let customer = {
      username: req.body.username, password: req.body.password
    }
    
    customers.insertOne(customer, function (err, res) {
      if (err) throw err
      console.log("1 customer inserted")
    })
  })
  res.send('Customer created')
})

app.set('port', 8080)

http.listen(app.get('port'), function() {
  console.log('listening on port', app.get('port'))
})