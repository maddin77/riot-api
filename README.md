# RiotAPI
A node.js library for fetching League of Legends data from the [Riot API](https://developer.riotgames.com/).

Riot's API requires a API Key. More information about how to get a Key, Rate Limits and more can be found on their [official Site](https://developer.riotgames.com/docs/getting-started).

Game constants like queue types, maps, game types, game modes and rune slots are explained [here](https://developer.riotgames.com/docs/game-constants).

## Getting started
RiotAPI is designed to be simple.

```javascript
var RiotApi = require('riot-api');
var api = new RiotApi('YOUR_API_KEY_GOES_HERE');
```
Each Method takes an options object and a callback. The callback is always a json object, either a set of results or a status message if the call was invalid.

## Methods
### api.getChampions(options, callback)
Retrieve all champions currently in the game.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`.
 - `filter` - **object** - (Optional) Filter the result to only get Champions who match the specific options.
- `active` - **boolean** - Indicates if the champion is active.
- `rankedPlayEnabled` - **boolean** - Ranked play enabled flag.
- `botEnabled` - **boolean** - Bot enabled flag (for custom games).
- `botMmEnabled` - **boolean** - Bot Match Made enabled flag (for Co-op vs. AI games).
- `freeToPlay` - **boolean** - Indicates if the champion is free to play. Free to play champions are rotated periodically.
- `attackRank` - **int** - Champion attack rank.
- `defenseRank` - **int** - Champion defense rank.
- `difficultyRank` - **int** - Champion difficulty rank.
- `magicRank` - **int** - Champion magic rank.
- `id` - **int** - Champion ID.
- `name` - **string** - Champion name.

#### Result:

The Result is a array of objects containing information about the champion. An object might look like this:
```javascript
{
    "botMmEnabled": false,
    "defenseRank": 4,
    "attackRank": 8,
    "id": 266,
    "rankedPlayEnabled": true,
    "name": "Aatrox",
    "botEnabled": false,
    "difficultyRank": 6,
    "active": true,
    "freeToPlay": false,
    "magicRank": 3
}
```

#### Example:
```javascript
api.getChampions({
    'region': 'NA',
    'filter': {
        'freeToPlay': true
    }
}, function(data) {
    console.log('These champions are currently free to play:');
    data.forEach(function(champion) {
        console.log('Name: ' + champion.name + ', Difficulty: ' + champion.difficultyRank);
    });
});
```
### api.getRecentGames(options, callback)
Get the recent games for summoner.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`.
 - `summonerId` - **int** - Summoner ID*.
 - `summonerName` - **string** - Summoner Name*.

*Either Summoner ID or Name is required.

#### Result:

The Result is a object with informations about the recent games of the given summoner. The object is the exact same object given by the default API call, which can be tested [here](https://developer.riotgames.com/api/methods#!/292/1029).

#### Example:
```javascript
api.getChampions({
    'region': 'NA',
    'summonerName': 'TheOddOne'
    //-OR-
    //'summonerId': 60783
}, function(data) {
    //process data
});
```

### api.getLeagues(options, callback)
Retrieves leagues data for summoner, including leagues for all of summoner's teams.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`, `BR`, `TR`.
 - `summonerId` - **int** - Summoner ID*.
 - `summonerName` - **string** - Summoner Name*.
 - `queue` - **string** - (Optional) Only recive data for the given queue type. Legal values are: `RANKED_SOLO_5x5`, `RANKED_TEAM_3x3`, `RANKED_TEAM_5x5`.

*Either Summoner ID or Name is required.

#### Result:

The Result is a object with data about the leagues for the given summoner. The object is the exact same object given by the default API call (except if you only want to recieve a specific queue type), which can be tested [here](https://developer.riotgames.com/api/methods#!/254/959).

#### Example:
```javascript
api.getLeagues({
    'region': 'NA',
    'queue': 'RANKED_SOLO_5x5',
    'summonerName': 'TheOddOne'
    //-OR-
    //'summonerId': 60783
}, function(data) {
    //process data
});
```

### api.getStatsSummary(options, callback)
Get player stats summaries for summoner.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`.
 - `summonerId` - **int** - Summoner ID*.
 - `summonerName` - **string** - Summoner Name*.
 - `season` - **int** - (Optional) If specified, stats for the given season are returned. Otherwise, stats for the current season are returned.

*Either Summoner ID or Name is required.

#### Result:

The Result is a object with data about the stats of summoner. The object is the exact same object given by the default API call, which can be tested [here](https://developer.riotgames.com/api/methods#!/294/1035).

#### Example:
```javascript
api.getStatsSummary({
    'region': 'NA',
    'season': 3,
    'summonerName': 'TheOddOne'
    //-OR-
    //'summonerId': 60783
}, function(data) {
    //process data
});
```

### api.getRankedStats(options, callback)
Get ranked stats for summoner. Includes statistics for Twisted Treeline and Summoner's Rift

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`.
 - `summonerId` - **int** - Summoner ID*.
 - `summonerName` - **string** - Summoner Name*.
 - `season` - **int** - (Optional) If specified, stats for the given season are returned. Otherwise, stats for the current season are returned.

*Either Summoner ID or Name is required.

#### Result:

The Result is a object with data about the ranked stats of summoner. The object is the exact same object given by the default API call, which can be tested [here](https://developer.riotgames.com/api/methods#!/294/1035).

#### Example:
```javascript
api.getRankedStats({
    'region': 'NA',
    'season': 3,
    'summonerName': 'TheOddOne'
    //-OR-
    //'summonerId': 60783
}, function(data) {
    //process data
});
```

### api.getMasteries(options, callback)
Get mastery pages for summoner.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`.
 - `summonerId` - **int** - Summoner ID*.
 - `summonerName` - **string** - Summoner Name*.

*Either Summoner ID or Name is required.

#### Result:

The Result is a object with data about the mastery pages of summoner. The object is the exact same object given by the default API call, which can be tested [here](https://developer.riotgames.com/api/methods#!/293/1030).

#### Example:
```javascript
api.getMasteries({
    'region': 'NA',
    'summonerName': 'TheOddOne'
    //-OR-
    //'summonerId': 60783
}, function(data) {
    //process data
});
```

### api.getRunes(options, callback)
Get rune pages for summoner.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`.
 - `summonerId` - **int** - Summoner ID*.
 - `summonerName` - **string** - Summoner Name*.

*Either Summoner ID or Name is required.

#### Result:

The Result is a object with data about the rune pages of summoner. The object is the exact same object given by the default API call, which can be tested [here](https://developer.riotgames.com/api/methods#!/293/1033).

The `runeSlotId` fields are explained [here](https://s3-us-west-1.amazonaws.com/riot-api/img/rune-slot-ids.png).

#### Example:
```javascript
api.getRunes({
    'region': 'NA',
    'summonerName': 'TheOddOne'
    //-OR-
    //'summonerId': 60783
}, function(data) {
    //process data
});
```

### api.getSummonerNamesByIds(options, callback)
Get list of summoner names by summoner IDs.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`.
 - `summonerIds` - **array[int]** - Summoner ID's.

#### Result:

The Result is an array with objects containing name and id of a summoner. 
```javascript
[
    {
        "id": 60783,
        "name": "TheOddOne"
    },
    {
        "id": 5908,
        "name": "Dyrus"
    }
]
```
#### Example:
```javascript
api.getRunes({
    'region': 'NA',
    'summonerIds': [60783, 5908]
}, function(data) {
    //process data
});
```

### api.getSummoner(options, callback)
Get basic information about summoner.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`.
 - `summonerId` - **int** - Summoner ID*.
 - `summonerName` - **string** - Summoner Name*.

*Either Summoner ID or Name is required.

#### Result:

The Result is an object containing basic information of a summoner. 
```javascript
{
    "id": 60783,
    "name": "TheOddOne",
    "profileIconId": 558,
    "summonerLevel": 30,
    "revisionDate": 1386684611000,
    "revisionDateStr": "12/10/2013 02:10 PM UTC"
}
```
#### Example:
```javascript
api.getSummoner({
    'region': 'NA',
    'summonerName': 'TheOddOne'
    //-OR-
    //'summonerId': 60783
}, function(data) {
    //process data
});
```

### api.getTeams(options, callback)
Retrieves teams of summoner.

#### Options:

 - `region` - **string** - Region where to retrieve the data. If no region is given, `NA` will be used. Currently available regions are: `NA`, `EUW`, `EUNE`, `TR`, `BR`.
 - `summonerId` - **int** - Summoner ID*.
 - `summonerName` - **string** - Summoner Name*.

*Either Summoner ID or Name is required.

#### Result:

The Result is a object with data about the teams of summoner. The object is the exact same object given by the default API call, which can be tested [here](https://developer.riotgames.com/api/methods#!/256/961).

#### Example:
```javascript
api.getTeams({
    'region': 'NA',
    'summonerName': 'TheOddOne'
    //-OR-
    //'summonerId': 60783
}, function(data) {
    //process data
});
```
