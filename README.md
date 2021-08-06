# candidateScoring
Node.js application for adding candidate and scores for that candidate.

for running Application run this command: node script.js

http://localhost:3000/add_candidate: A post request for inserting a candidate into database with the given JSON format.
  {
    "name":"Adi",
    "email":"adi@gmail.com"
}

http://localhost:3000/add_score: A post request for assigning score for a candidate with the given JSON format
{
    "first_round":9,
    "second_round":10,
    "third_round":8,
    "email":"adi@gmail.com"
}

http://localhost:3000/maxscore: Get Api to get highest scoring candidate.

http://localhost:3000/avgscore: Post request for getting average scores per round for all candidates with the given JSON format
{}

http://localhost:3000/avgscore: Post request for getting average scores of all three rounds for a particular candidate with the given JSON format
  {
    "email":"adi@gmail.com"
}
