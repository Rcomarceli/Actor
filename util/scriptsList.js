// const Logger = require('./logger')
//const { info, error } = require('./msgs')
const { MessageEmbed, Collection } = require('discord.js')

const listMsgs = new Collection(); //collection used for guild and scriptList separation

const MAX_PAGE_SIZE = 10 //changed from 40

class ScriptsList {

    constructor(files, senderMsg, page) { //need to pass in an array of files, maybe we can query the db with plain: true?
        return new Promise((resolve, reject) => {
            this.files = files //list of scripts
            this.senderMsg = senderMsg //set sender message
            this.currPage = page ? page : 0 //if page isn't sent in, the current page is 0. if page is sent in, use that page as currpage
            this.pages = Math.ceil(this.files.length / MAX_PAGE_SIZE) //+ 1 //figure out amount of pages
    
            this.senderMsg.channel.send('', this.parse()) //send embed through this.parse
                .then(m => {
                    m.react("\👈")
                    setTimeout(() => m.react("\👉"), 100)
                    this.msg = m //attached this embed's msg from the user's message to itself. this takes care of the initial case, and following parses. clever
                    listMsgs.set(this.senderMsg.member.guild.id, this) //assigns this scriptlist to listMsgs
                    resolve(this) //resolve promise
                })
                .catch(err => {
                    // error(this.senderMsg.channel, 'An error occured creating list message.')
                    // Logger.error('An error occured creating list message:\n' + err)
                    reject(err)
                })
        })
    }

    parse() {
        return new MessageEmbed() 
            .setTitle(`${this.files.length} Scripts (${this.currPage + 1} / ${this.pages})`)
            .setColor(0x03A9F4)
            .setDescription(
                this.files 
                    .slice(this.currPage * MAX_PAGE_SIZE, this.currPage * MAX_PAGE_SIZE + MAX_PAGE_SIZE) //displays 'slices' of files based on the page number. pretty clever 
                    .map(i => `[${i.name}](${i.webViewLink}) - [${i.description}]`)
                    .join('\n') //join with new lines
            )
    }

    swap(forward) { //defines swap method for our ScriptsList object
        let d = forward ? 1 : -1 // did we pass "forward" in? if so, we go forward "1". if not, we go backward "1"
        if (this.currPage == 0 && !forward) //if we are on the first page and hit back, circle back to the last page
            this.currPage = this.pages - 1
        else if (this.currPage == this.pages - 1 && forward) //if we are at the end page, and we hit forward, go to the first pace
            this.currPage = 0
        else
            this.currPage += d //if neither, go back or forward one
        this.msg.edit('', this.parse()) //edit the embed to go to the next 
    }

}


module.exports = {
    listMsgs,
    ScriptsList
}