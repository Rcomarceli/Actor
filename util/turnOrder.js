const Discord = require('discord.js'); 

var itstimequotes = [
    "it's time!",
    "here we go!",
    "everyone's ready! here's the turn order",
    "presenting the turn order!"
  ]
  
  var eastereggquotes = [
    "everyone's ready! here's the victim list",
    "today's suspect list"
  ]

const actorCollections = new Discord.Collection();

class ActorCollection {
  constructor(guildId) { 
      this.readyCollection = new Discord.Collection();
      this.alwaysReadyCollection = new Discord.Collection();
      this.skipCollection = new Discord.Collection();
      this.alwaysSkipCollection = new Discord.Collection();
      this.rolesList = [];
      actorCollections.set(guildId, this);
  }
  
  // check if all voicechat members are ready. if so, we usually call turnOrder after
  readyCheck(vcList) {
    const botUsers = vcList.filter(vcUser => vcUser.user.bot === true); 
    const isEveryoneReady = (vcList.size <= this.readyCollection.size + this.skipCollection.size + botUsers.size);
    return isEveryoneReady;
  };

  // handler for shuffling, predetermined roles, blitz timer, and resetting. returns turnOrderList to display in chat
  turnOrder(vcList) {
    let actors = [];
    let turnOrderList;

    this.deleteBlitzTimer();

    //if rolesList exists, use that list instead
    if (this.rolesList.length) {
      actors.push(...this.rolesList);  //... is a spread operator. pushes in elements of rolesList instead of ENTIRE array
      this.rolesList.length = 0; //clears rolesList
    }
    else {
      actors = shuffle(this.readyCollection);
    };
    
    turnOrderList = getTurnOrderList(actors);
    resetCollections(this, vcList);
    return turnOrderList;
  };

  
  // toggle functions
  toggleReady(member) {
    if (!this.readyCollection.has(member.id)) {
      this.readyCollection.set(member.id, member.displayName); 
      this.skipCollection.delete(member.id);
      return true;
    }  
    else {
      this.readyCollection.delete(member.id);
      return false;
    };
  };

  toggleAlwaysReady(member) {
    if (!this.alwaysReadyCollection.has(member.id)) {
      this.alwaysSkipCollection.delete(member.id); 
      this.skipCollection.delete(member.id);

      this.alwaysReadyCollection.set(member.id, member.displayName);
      this.readyCollection.set(member.id, member.displayName);
      return true; 
    }
    else {
      this.alwaysReadyCollection.delete(member.id);
      this.readyCollection.delete(member.id);
      return false;
    };
  };

  toggleSkip(member) {
    if (!this.skipCollection.has(member.id)) {
      this.skipCollection.set(member.id, member.displayName); 
      this.readyCollection.delete(member.id);
      return true;
    }  
    else {
      this.skipCollection.delete(member.id);
      return false;
    };
  };

  toggleAlwaysSkip(member) {
    if (!this.alwaysSkipCollection.has(member.id)) {
      this.alwaysReadyCollection.delete(member.id); 
      this.readyCollection.delete(member.id);

      this.alwaysSkipCollection.set(member.id, member.displayName);
      this.skipCollection.set(member.id, member.displayName);
      return true; 
    }
    else {
      this.alwaysSkipCollection.delete(member.id);
      this.skipCollection.delete(member.id);
      return false;
    };
  };

  // pre-determines roles for a script. next turnOrderList will use those exact roles
  roles(vcList, additionalPeople) {
    vcList.sweep(vcUser => vcUser.user.bot === true || this.skipCollection.has(vcUser.user.id)); //removes all bots and skip people from vcList

    //add everyone to readyCollection
    vcList.each((member, id) => this.readyCollection.set(id, member.displayName))

    //convert collection to array, shuffle it
    this.rolesList = shuffle(this.readyCollection);
  
    //now add random people to the end of this array
    if (Number.isInteger(additionalPeople)) {
      for (let i = 0; i < additionalPeople; i++) {
          const vcUser = vcList.random();
          this.rolesList.push(vcUser.displayName);
      }
    };
  
    //pass turnOrderList back and reset
    const turnOrderList = getTurnOrderList(this.rolesList);
    resetCollections(this, vcList);
    return turnOrderList;
  };

  // blitz functions
  getBlitzTimer() {
    if (this.blitzTimer && !this.blitzTimer._destroyed) { //._destroyed checks if the timer has been cleared before
      return this.blitzTimer;
    }
    return false; 
  }

  setBlitzTimer(blitzTimer) {
    this.blitzTimer = blitzTimer;
  }

  deleteBlitzTimer() {
    clearTimeout(this.blitzTimer); 
  }

  blitz(vcList) {
    vcList.sweep(vcUser => vcUser.user.bot === true || this.skipCollection.has(vcUser.user.id)); //removes all bots and skip people from vcList
  
    for (let vcUser of vcList.values()) {
      this.readyCollection.set(vcUser.id, vcUser.displayName);
    };
    const turnOrderList = this.turnOrder(vcList);
    return turnOrderList;
  }

  // utility functions

  // get all currently ready users
  readyList() {
    return this.readyCollection.map((user, _) => user);
  };

  // used in edge case where everyone in voicechat is AlwaysReady
  isEveryoneAlwaysReady(vcList) {
    const botUsers = vcList.filter(vcUser => vcUser.user.bot === true); 
    const check = (vcList.size <= this.alwaysReadyCollection.size + this.skipCollection.size + botUsers.size);
    return check;
  };

  //reset blitz, roles, ready & skip collections
  clear(vcList) {
    this.deleteBlitzTimer();
    this.rolesList.length = 0; 
    resetCollections(this, vcList);
  };

};


// private functions

// shuffles collection ==> array of actors in random order
function shuffle(collection) {

  let actors = Array.from(collection.values());

  // While there remain elements to shuffle…
  for (var i = actors.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = actors[i];
    actors[i] = actors[j];
    actors[j] = temp;
  }
  return actors;
}

function resetCollections(turnOrderCollection, vcList) {
  const readyCollection = turnOrderCollection.readyCollection;
  const alwaysReadyCollection = turnOrderCollection.alwaysReadyCollection;
  const skipCollection = turnOrderCollection.skipCollection;
  const alwaysSkipCollection = turnOrderCollection.alwaysSkipCollection;

  readyCollection.clear();
  skipCollection.clear();

  //re-add "always ready" and "always skip" users in vc to the readylist
  const addToReady = vcList.intersect(alwaysReadyCollection);
  const addToSkip = vcList.intersect(alwaysSkipCollection);
  addToReady.each((displayName, id) => readyCollection.set(id, displayName));
  addToSkip.each((displayName, id) => skipCollection.set(id, displayName));
};

//returns formatted turn order list to display in channel
function getTurnOrderList(actors) {
  const victimlist = Math.floor(Math.random() * 31); //random integer between 0 and 30; used for victim list easter egg
  const rquote = Math.floor(Math.random() * itstimequotes.length);
  let turnOrderList;
      if (victimlist == 30) {
      const rquote2 = Math.floor(Math.random() * eastereggquotes.length)
      turnOrderList = `${eastereggquotes[rquote2]}: \r\n${actors.join('\r\n')}`;
      return turnOrderList;
        }
      else {
      turnOrderList = `${itstimequotes[rquote]}: \r\n${actors.join('\r\n')}`;
      return turnOrderList;
      }
};


module.exports = {  
  actorCollections,
  ActorCollection,
};
