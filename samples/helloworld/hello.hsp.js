// ################################################################ 
//  This file has been generated by the hashspace compiler          
//  Direct MODIFICATIONS WILL BE LOST when the file is recompiled!  
// ################################################################ 

var hsp=require("hsp/rt");


var hello = require("hsp/rt").template(["name"], function(n){
  return [n.elt("div",0,{"class":"msg"},0,[n.$text({e1:[1,1,"name"]},["Hello ",1,"! "])])];
});


// display the template in the #output div
hello("World").render("output");
