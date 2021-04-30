# actor
Supports voice acting communities with the ability to fetch scripts from a google drive, as well as other commands to help facilitate voice acting sessions including tracking "ready" statuses and auto-determining roles!

## Try it out!
The bot is running with a sample set of scripts and can be added via this url: 
https://discord.com/api/oauth2/authorize?client_id=835939527196803103&permissions=1110731840&scope=bot

Copy and paste this into your browser and add it to your desired channel.

## Quick-Start
Actor allows for the facilitation of voice acting sessions, from fetching certain genres of scripts, to keeping track of who has read/practiced the script and is ready to start a read. To sample how the bot works, we can go ahead and try out the bot by copying and pasting the link above into a browser, and assigning the bot to a server.

#### Fetching a script
Let's start off by fetching a voice acting script for everyone to read. We can either use the commands `!random`, or `!list`, in order to populate acting scripts in the chat for everyone to select.

#### Readying up
Once a script has been chosen, make sure everyone is inside a voice channel in discord. Once done, everyone in the voice channel can follow the link, and read/practice/go over the script until they feel ready to act. Once ready, actors can type `!ready`, and the bot will keep track of everyone who has readied up and will signal the chat once everyone is ready.

#### Starting the Read
Once everyone is ready, the bot automatically outputs a randomized list of actors. We can either ignore this and use this as a starting signal if roles have been predetermined, or it can be useful to indicate who starts first, or even help determine who does what role if everyone is familiar with the entire script. 

#### Rinse and Repeat
Once everyone is done with the read, we can simply rinse and repeat, and use the `!random` or `!list` commands to find a new script to work on!

## Cheatsheet of commands
**Readying Up**
`!ready` - puts you as "ready". bot decides turn order when everyone is readies up

`!itstime` - instantly decides turn order even if some people aren't ready
`!skip` - skips your turn if you're just sitting out this round
`!readylist` - shows who is currently ready
`!clear` - clears the ready list
`!alwaysready` - puts you as "ready" every round!
`!alwaysskip` - skips you every round! (use if just observing)
`!blitz` - sets a time limit. forces everyone to ready upon time running out (ex: `!blitz 45` to set a 45 second timer)

**Scripts**
`!random` - give you a random script! put tags after the command to search for a random script that has those tags (ex: `!random 2person romance` will give you a random 2 person, romance script!)
`!list` - put tags after this command to list all the scripts that match those tags! (ex: `!list funny`)
`!listtags` - list all the tags you can use for the above commands!

**Utility**
`!roll` - get a random number from 1 to a number you put in (ex: `!roll 10`), useful for indecisive people
`!roles [#]` - assign roles randomly! useful for long scripts. add a # to add random person to the list for uneven pairs
`!refresh` - refreshes the script database if you add scripts in the gdrive
`!nemesis` - chooses a random person in voice chat (useful for nemesis theme)

notes:
- `!roles [#]` is limited to adding 4 additional random people
