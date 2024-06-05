/*
    Simple handler, fires off when the bot is logged in.
*/

export function OnReady({ Client }){
    console.log(`Logged in as ${Client.user.tag}!`);
}