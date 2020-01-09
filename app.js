const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({path: '/home/vikrant/Documents/node/task/config.env'});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.staticProvider('/home/vikrant/Documents/node/public'));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    next();
  });
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'webprog',
  password: 'webprog',
  database: 'webprog'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.use(express.static(__dirname + '/public/taskApp/'));

app.get('/tasklist',function(req,res) {
  res.sendFile(__dirname + '/public/taskApp/index.html');
});
// create task
app.post('/createTask', (req, res, next) => {
  if(req.body.task_id && req.body.due_date && req.body. description ){
  var task_id = req.body.task_id;
  var due_date = req.body.due_date;
  var description = req.body.description;
  var findQuery = `SELECT task_id FROM task_details WHERE TASK_ID = ${task_id}`
  connection.query(findQuery, (err, result) => {
    console.log(result.length);
    if(err){
      res.status(201).json({
        message: err,
        duplicate: false,
        body: []
        })
    }else{
      if(result.length > 0){
        console.log(result);
        res.status(200).json({
        message: 'please select different task_id',
        duplicate: true,
        body: [req.body]
        });
      }else{
        var query = `INSERT INTO task_details (task_id, due_date, description) VALUES ( ${task_id}, '${due_date}', '${description}')`;
        connection.query(query, (err, result) =>{
          if(err)
          res.status(201).json({
            message: err,
            duplicate: false,
            body: []
            });
          else{
            res.status(200).json({
            message: 'task created successfully',
            duplicate: false,
            body: [req.body]
          });
          }
        })
      }
    }
  })
}else{
  res.status(200).json({
    message: 'fill all fields',
    duplicate: false,
    body: [req.body]
});
}
})
// getTask api
app.get('/getTask', (req, res,next) => {
  findQuery = `SELECT * FROM task_details`;
  connection.query(findQuery, (err, result) => {
    if(err){
      res.status(201).json({message: err})
    }else{
      if(result.length > 0){
      res.status(200).json({message: result});
      }else{
        res.status(200).json({message: []})
      }
    }
  })
})
// edit api
app.post('/editTask', (req, res, next) => {
  if(req.body.task_id && req.body.due_date){
var task_id = req.body.task_id;
var due_date = req.body.due_date;
var description = req.body.description;
var findQuery = `SELECT task_id FROM task_details WHERE TASK_ID = ${task_id}`;
var updateQuery = `UPDATE task_details SET due_date = '${due_date}', description = '${description}' WHERE task_id = ${task_id}`;
connection.query(findQuery, (err, result) => {
  if(err){
    res.status.json({message: err});
  }else{
    if(result.length > 0){
      connection.query(updateQuery, (err, result) => {
        if(err)
        res.status(201).json({message: err});
        else
        res.status(200).json({message: 'due_date updated successfully', body: req.body});
      })
    }else{
      res.status(200).json({message: 'task not found'})
    }
  }
})
  }else{
    res.status(200).json({message: 'fill all fileds'});
  }
})
//delete api
app.post('/deleteTask', (req, res, next) => {
  if(req.body.task_id){
  var task_id = req.body.task_id;
  var findQuery = `SELECT task_id FROM task_details WHERE TASK_ID = ${task_id}`
  var deleteQuery = `DELETE FROM task_details WHERE task_id = ${task_id}`;
  connection.query(findQuery, (err, result) =>{
    if(err){
      res.status(201).json({message: err})
    }else{
      if(result.length <= 0){
        res.status(200).json({message: 'task not find with this task_id'});
      }else{
        connection.query(deleteQuery, (err, result) =>{
          if(err){
            res.status(201).json({message: err})
          }else{
            res.status(200).json({message: 'task deleted successfully'});
          }
        })
      }
    }
  })
}else{
  res.status(200).json({message: 'provide task_id'})
}
})

module.exports = app;
