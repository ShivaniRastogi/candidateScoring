const mysql = require("mysql");
const express = require("express");
const bodyParser = require('body-parser');
// const config_data = require('./config.json');

const app = express();
app.use(bodyParser.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shivani",
    database: "resultdb"
  });

app.post('/add_candidate', async (req, res) => {
	
    let name = req.body.name;
    let email = req.body.email;

    var sql = "INSERT INTO candidate(name,email) VALUES ?";
    var values = [[name,email]]
    con.query(sql,[values] , function (err, result) {
      if (err){
        res.status(400).send(err);
        throw err;
      } 
      res.status(200).send("Candidate added");
    
    });
});

app.post('/add_score', async (req, res) => {
    try {
        if (typeof req.body.first_round == 'number' && req.body.first_round <=10 && 
        typeof req.body.second_round == 'number' && req.body.second_round <=10
        && typeof req.body.third_round == 'number' && req.body.third_round <=10 ){
            var first = req.body.first_round;
            var second = req.body.second_round;
            var third = req.body.third_round;
            var email = req.body.email;
            var total = first+ second+third;

            con.query('SELECT email FROM candidate WHERE email ="' + email +'"', function (err, result) {
                if (err) console.log(err) ;
                console.log(result);
                //You will get an array. if no users found it will return.
                if(result.length === 0) {
                    res.send("Candidate does not exists");
                }
                else{  
                    con.query('SELECT email FROM test_score WHERE email ="' + email +'"', function (err, result) {
                        if (err) console.log(err) ;
                        console.log(result);
                        //You will get an array. if no users found it will return.
                        if(result.length !== 0) {
                            res.send("Score for this candidate already exists");
                        }
                        else{
                            var sql = "INSERT INTO test_score(email,first_round,second_round,third_round,total) VALUES ?";
                            var values = [[email,first,second,third,total]]
                            con.query(sql,[values] , function (err, result) {
                                if (err){
                                    res.status(400).send(err);
                                } 
                                res.status(200).send("score added");
                            });
                        }
                    });

                }
              });

        }
        else{
            res.send("Wrong JSON");
        }
    } catch (error) {
        console.log("error:",error);
        
    }

});

app.get('/maxscore', async (req, res) => {
    let sql = "select candidate.name, test_score.first_round, test_score.second_round, test_score.third_round, test_score.total from candidate inner join test_score on candidate.email = test_score.email order by test_score.total desc limit 1,1 "
    con.query(sql, function (err, result) {
        if (err){
            res.status(400).send(err);
            throw err;
        } 
        res.status(200).send(result);
    });

});

app.post('/avgscore', async (req, res) => {
    if(req.body.email){
        con.query('select candidate.name, test_score.total/3 as average from candidate inner join test_score on candidate.email = test_score.email where candidate.email="'+ req.body.email + '" ', function (err, result) {
            if (err){
                res.status(400).send(err);
                throw err;
            } 
            res.status(200).send(result);
        }); 
    }
    
    // let sql = "select candidate.name, avg(test_score.first_round) as first_round, avg(test_score.second_round) as second_round, avg(test_score.third_round) as thrid_round from candidate inner join test_score on candidate.email = test_score.email order by test_score.total"
    else{
        let sql = "select avg(first_round) as first_round, avg(second_round) as second_round, avg(third_round) as third_round from test_score;"
        con.query(sql, function (err, result) {
            if (err){
                res.status(400).send(err);
                throw err;
            } 
            res.status(200).send(result);
        });
    }


});

const port = 3000
app.listen(port,()=>{
  console.log(`Server is listenting at localhost:${port}`)
});

