var request = require('request');

var RiotApi = module.exports = function(API_KEY) {
    this.API_KEY = API_KEY;
    this._cache = {};
    this.BASE_PATH = 'http://prod.api.pvp.net/api/lol/';
};

RiotApi.prototype.getCachedJSONRequest = function(url, callback) {
    if(this._cache.hasOwnProperty(url)) {
        callback(this._cache[url]);
    }
    else {
        var self = this;
        request({
            'uri': url,
            'json': true
        }, function(error, response, json) {
            if(!error && response.statusCode === 200) {
                self._cache[url] = json;
            }
            if(response.statusCode === 404) {
                callback({
                    "status": {
                        "message": "Not Found", 
                        "status_code": 404
                    }
                });
            }
            else {
                callback(json);
            }
        });
    }
};
// prod.api.pvp.net/api/lol/'+region+'/v1.3/summoner/by-name/'+name+'?api_key=' + auth.leagueoflegend.key/;
RiotApi.prototype.getChampions = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.1/champion?api_key='+this.API_KEY, function(json) {
        if(json.hasOwnProperty('status')) callback(json);
        else if(options.hasOwnProperty('filter')) {
            var filtered = [];
            json.champions.forEach(function(champion) {
                var add = true;
                for (var filter in options.filter) {
                    if(!champion.hasOwnProperty(filter) || champion[filter] !== options.filter[filter]) {
                        add = false;
                    }
                }
                if(add) filtered.push(champion);
            });
            callback(filtered);
        }
        else {
            callback(json.champions);
        }
    });
};

RiotApi.prototype.getRecentGames = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    if(options.hasOwnProperty('summonerId')) {
        this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.3/game/by-summoner/' + options.summonerId + '/recent?api_key='+this.API_KEY, callback);
    }
    else if(options.hasOwnProperty('summonerName')) {
        var self = this;
        this.getSummoner(options, function(json) {
            if(json.hasOwnProperty('status')) callback(json);
            else {
                self.getCachedJSONRequest(self.BASE_PATH + region + '/v1.3/game/by-summoner/' + json.id + '/recent?api_key='+self.API_KEY, callback);
            }
        });
    }
    else {
        callback({});
    }
};

RiotApi.prototype.getSummoner = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    if(options.hasOwnProperty('summonerId')) {
        this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.3/summoner/' + options.summonerId + '?api_key='+this.API_KEY, callback);
    }
    else if(options.hasOwnProperty('summonerName')) {
       this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.3/summoner/by-name/' + options.summonerName + '?api_key='+this.API_KEY, callback);
   }
   else {
    callback({});
}
};

RiotApi.prototype.getLeagues = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    if(options.hasOwnProperty('summonerId')) {
        this.getCachedJSONRequest(this.BASE_PATH + region + '/v2.3/league/by-summoner/' + options.summonerId + '?api_key='+this.API_KEY, function(json) {
            if(json.hasOwnProperty('status')) callback(json);
            else if(options.hasOwnProperty('queue')) {
                for(var type in json) {
                    if(json[type].queue === options.queue) {
                        return callback(json[type]);
                    }
                }
                return callback({});
            }
            else {
                callback(json);
            }
        });
    }
    else if(options.hasOwnProperty('summonerName')) {
        var self = this;
        this.getSummoner(options, function(json) {
            if(json.hasOwnProperty('status')) callback(json);
            else {
                self.getCachedJSONRequest(self.BASE_PATH + region + '/v2.3/league/by-summoner/' + json.id + '?api_key='+self.API_KEY, function(json) {
                    if(error || json.hasOwnProperty('status')) callback(json);
                    else if(options.hasOwnProperty('queue')) {
                        for(var type in json) {
                            if(json[type].queue === options.queue) {
                                return callback(json[type]);
                            }
                        }
                        return callback({});
                    }
                    else {
                        callback(json);
                    }
                });
            }
        });
    }
    else {
        callback({});
    }
};

RiotApi.prototype.getStatsSummary = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    var season = options.season ? ('SEASON'+options.season) : '';
    if(options.hasOwnProperty('summonerId')) {
        this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.2/stats/by-summoner/' + options.summonerId + '/summary?season=' + season + '&api_key='+this.API_KEY, callback);
    }
    else if(options.hasOwnProperty('summonerName')) {
        var self = this;
        this.getSummoner(options, function(json) {
            self.getCachedJSONRequest(self.BASE_PATH + region + '/v1.2/stats/by-summoner/' + json.id + '/summary?season=' + season + '&api_key='+self.API_KEY, callback);
        });
    }
    else {
        callback({});
    }
};

RiotApi.prototype.getRankedStats = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    var season = options.season ? ('SEASON'+options.season) : '';
    if(options.hasOwnProperty('summonerId')) {
        this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.2/stats/by-summoner/' + options.summonerId + '/ranked?season=' + season + '&api_key='+this.API_KEY, callback);
    }
    else if(options.hasOwnProperty('summonerName')) {
        var self = this;
        this.getSummoner(options, function(json) {
            self.getCachedJSONRequest(self.BASE_PATH + region + '/v1.2/stats/by-summoner/' + json.id + '/ranked?season=' + season + '&api_key='+self.API_KEY, callback);
        });
    }
    else {
        callback({});
    }
};

RiotApi.prototype.getMasteries = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    if(options.hasOwnProperty('summonerId')) {
        this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.3/summoner/' + options.summonerId + '/masteries?api_key='+this.API_KEY, callback);
    }
    else if(options.hasOwnProperty('summonerName')) {
        var self = this;
        this.getSummoner(options, function(json) {
            self.getCachedJSONRequest(self.BASE_PATH + region + '/v1.3/summoner/' + json.id + '/masteries?api_key='+self.API_KEY, callback);
        });
    }
    else {
        callback({});
    }
};

RiotApi.prototype.getRunes = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    if(options.hasOwnProperty('summonerId')) {
        this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.3/summoner/' + options.summonerId + '/runes?api_key='+this.API_KEY, callback);
    }
    else if(options.hasOwnProperty('summonerName')) {
        var self = this;
        this.getSummoner(options, function(json) {
            self.getCachedJSONRequest(self.BASE_PATH + region + '/v1.3/summoner/' + json.id + '/runes?api_key='+self.API_KEY, callback);
        });
    }
    else {
        callback({});
    }
};

RiotApi.prototype.getSummonerNamesByIds = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    var summonerIds = (options.summonerIds||[]).join(',');
    this.getCachedJSONRequest(this.BASE_PATH + region + '/v1.3/summoner/' + summonerIds + '/name?api_key='+this.API_KEY, function(json) {
        if(json.hasOwnProperty('status')) callback(json);
        else {
            callback(json.summoners);
        }
    });
};

RiotApi.prototype.getTeams = function(options, callback) {
    var region = (options.region||'NA').toLowerCase();
    if(options.hasOwnProperty('summonerId')) {
        this.getCachedJSONRequest(this.BASE_PATH + region + '/v2.2/team/by-summoner/' + options.summonerId + '?api_key='+this.API_KEY, callback);
    }
    else if(options.hasOwnProperty('summonerName')) {
        var self = this;
        this.getSummoner(options, function(json) {
            self.getCachedJSONRequest(self.BASE_PATH + region + '/v2.2/team/by-summoner/' + json.id + '?api_key='+self.API_KEY, callback);
        });
    }
    else {
        callback({});
    }
};
