# Barometer

The Barometer web application grants users the ability to quantitatively measure the general population’s 
emotional view of events and subjects on Twitter in real-time. Through combining Twitter's tweet search API 
endpoint and IBM’s natural language processing emotion endpoint, the results are aggregated into 6 defined
emotional sentiment categories (%): sadness, joy, fear, disgust, anger, and overall positive vs. negative
outlook. 

Graphical bar graphs and a tweet content pane offers insight into the emotional spectrum and sentiment
revolving any search query. Communicating with a PostgreSQL database enables the application to access and display
what other users have historically searched.

Use cases may include gathering research that will inform corporate messaging strategy, helping an individual
consumer decide whether to attend a certain event, or indexing a user's feelings against the rest of other Twitter
users. The application is effectively a user-driven online social perception survey.

### Live Demo: https://robs-barometer.now.sh/

![Search query with tweet results and emotion charts](https://github.com/RobertWiggins/barometer-client/blob/master/public/static/search_home.png)

![Both emotion and sentiment charts](https://github.com/RobertWiggins/barometer-client/blob/master/public/static/sentiment_charts.png)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and
testing purposes. See deployment for notes on how to deploy the project on a live system. This server runs locally
in conjunction with the barometer-client front-end built with React, which can be found at (https://github.com/RobertWiggins/barometer-client). Please pay specific attention to the required environment variables and API access credentials detailed within the pre-requisites.

# Express setup instructions

## Set up

Complete the following steps to get the server running.

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Create a .env file and supply the required environment variables described below
4. Make a fresh start of the git history for this project with `rm -rf .git && git init`
5. Install the node dependencies `npm install`

## Set up local database

Create a new database titled barometer. \
Create new table 'queries', or enter `npm run migrate` in the terminal while inside the project directory.

```SQL
CREATE TABLE IF NOT EXISTS queries (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    query TEXT NOT NULL,
    interval TIMESTAMP NOT NULL DEFAULT now()
);
```
## Running locally

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

### Required local environment API credentials
Apply for a twitter developer account and get your oauth 1.0 tweet search endpoint credentials here: \
https://developer.twitter.com/en.html

Twitter API .env variables: \
OAUTH_CONSUMER_KEY= \
OAUTH_CONSUMER_SECRET_KEY= \
OAUTH_ACCESS_TOKEN= \
OAUTH_ACCESS_TOKEN_SECRET=

IBM Watson Natural Language Understanding API credentials and service account: \
https://cloud.ibm.com/catalog/services/natural-language-understanding \
https://cloud.ibm.com/apidocs/natural-language-understanding

IBM Watson API credentials: \
API_KEY= \
URL=

Other required .env variables: \
NODE_ENV=development \
PORT=8000 \
MIGRATION_DB_HOST=localhost \
MIGRATION_DB_PORT=5432 \
MIGRATION_DB_NAME=barometer \
MIGRATION_DB_USER= \
MIGRATION_DB_PASS= \
DB_URL="postgresql://[username]:[password]@localhost/barometer" \
TEST_DB_URL="postgresql://[username]:[password]@localhost/barometer_test" \
PROD_MIGRATION_DB_HOST= \
PROD_MIGRATION_DB_PORT=5432 \
PROD_MIGRATION_DB_NAME= \
PROD_MIGRATION_DB_USER= \
PROD_MIGRATION_DB_PASS=

## Server Address
https://calm-badlands-84231.herokuapp.com/

### Analyze tweets endpoint
``GET https://calm-badlands-84231.herokuapp.com/tweets/queries/:query``

Returns a list of up to 30 tweets and the tweets' IBM Watson natural language analyzed emotion results on the document \
and target keyword level.

Example Response:
```javascript
{
    watsonEmotionResults: {
        usage: {
            text_units: 1,
            text_characters: 3461,
            features: 2
        },
        sentiment: {
            document: {
                score: -0.315338,
                label: "negative"
            }
        },
        language: "en",
        emotion: {
            targets: [ {
                text: "dogs",
                emotion: {
                    sadness: 0.181938,
                    joy: 0.593554,
                    fear: 0.557933,
                    disgust: 0.621653,
                    anger: 0.427955
                }
            } ],
        document: {
            emotion: {
                sadness: 0.213302,
                joy: 0.561363,
                fear: 0.107125,
                disgust: 0.548322,
                anger: 0.444964
            }
        }
    }},
    duplicatesFiltered: [
        "Hey guys I’m currently looking for a home for these two 😭❤️ They have all their shots and are super sweet dogs. Please message me if you’re interested. Please retweet this pic 💓 they need a home 😭🐶 https://t.co/iQBWGbqBel",
        "It’s “National Get Out of the Dog House Day” &amp; while that typically means to apologize, one of our staffers    decided to take Watson (A346606) out of his dog house (aka his kennel.) 😂 Watson enjoys belly rubs. He is potty trained, has lived with kids, has lived with other dogs. https://t.co/2qpDicby81",
        "I’d much rather save dogs than humans cause people suck",
        "Summer 3 yr old female Staffie cross, she's looking for an adult only pet free home where she will get all the attention she deserves as she has not had the best start in life https://t.co/Szdzw2bOyi #TeamZay #rehomehour https://t.co/ZoQRcR0hhv",
        "Democrats make the Rules On Capitol Hill, most republicans follow them like puppy dogs. Not Trump. If we could only have a senate and a house full of Trumps. Then things would change for the better. Men and women that would stand up to the Democrats.",
        "Under assessment Maisie is a lovely two year old staffy/boxer x who has come to us from the pound. She is good with other dogs and children but not met a cat yet. She loves her walks 😊 https://t.co/H6d75WZbEE",
        "One of my dogs was scared of the toy and the other one was not. https://t.co/KIHTlNEYGi",
        "Sled dogs tread through melting ice sheet in #Greenland https://t.co/WCshzHAMAU",
    ],
    currentQuery: "dogs"
}
```

### Query history endpoint
``GET https://calm-badlands-84231.herokuapp.com/queries/history``

Returns the total search query history among all users.

Example response: 

```javascript
{
    queries: [ 
        {
            id: 15,
            query: "special search",
            interval: "2019-07-12T19:24:16.685Z"
        },
        {
            id: 16,
            query: "mariana trench",
            interval: "2019-07-12T19:34:40.766Z"
        },
        {
            id: 17,
            query: "scary ghosts",
            interval: "2019-07-12T19:37:26.312Z"
        },
        {
            id: 18,
            query: "leonard clippers",
            interval: "2019-07-12T19:39:15.691Z"
        },
        {
            id: 19,
            query: "border wall",
            interval: "2019-07-12T19:40:34.760Z"
        },
    ]
}
```

### Add query to history endpoint
``POST https://calm-badlands-84231.herokuapp.com/queries/history``

Adds a search query to the total query search history. Returns a 201 status response on successful post.

Pass in options:

```javascript
const body = JSON.stringify({
    query: newQuery,
});
    
const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
};
    
fetch(`https://calm-badlands-84231.herokuapp.com/queries/history`, options)
```


## React Front End
https://github.com/RobertWiggins/barometer-client

## Built With

Express \
Node.js \
PostgreSQL

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
