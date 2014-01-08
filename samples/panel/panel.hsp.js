// ################################################################ 
//  This file has been generated by the hashspace compiler          
//  Direct MODIFICATIONS WILL BE LOST when the file is recompiled!  
// ################################################################ 

var hsp=require("hsp/rt");
var klass=require("hsp/klass"), $set=require("hsp/$set");
    
var PanelController = klass({ 
  attributes: {
    "head":{type:"template"}, 
    "body":{type:"template",defaultContent:true}
  }
});

// sample panel template

var panel = require("hsp/rt").template({ctl:[PanelController,"PanelController"],ref:"c"}, function(n){
  var _c;try {_c=c} catch(e) {};
  return [n.elt("div",0,{"class":"panel"},0,[n.$if({e1:[1,2,"c","head"]},1,[n.elt("div",0,{"class":"head"},0,[n.$text(0,[" "]),n.cpt([_c,"c","head"],0,0,0),n.$text(0,[" "])])]),n.elt("div",0,{"class":"body"},0,[n.cpt([_c,"c","body"],0,0,0)])])];
});



var test = require("hsp/rt").template(["m"], function(n){
  var _panel,_head,_body;try {_panel=panel} catch(e) {};try {_head=head} catch(e) {};try {_body=body} catch(e) {};
  return [n.cpt([_panel,"panel"],{e1:[1,2,"m","text"]},{"body":["Panel A (headless): ",1]},0),n.$text(0,[" "]),n.cpt([_panel,"panel"],{e1:[1,2,"m","text"]},{"head":["Panel B (",1,"!)"]},0,[n.$text({e1:[1,2,"m","text"]},["",1,"! "]),n.elt("a",{e1:[4,1,update,0,1]},0,{"click":1},[n.$text(0,["Update model"])])]),n.$text(0,[" "]),n.cpt([_panel,"panel"],0,0,0,[n.cpt([_head,"head"],0,0,0,[n.$text(0,["Panel C: "]),n.elt("a",{e1:[4,1,update,0,10]},0,{"click":1},[n.$text(0,["Update model"])])]),n.cpt([_body,"body"],0,0,0,[n.$text({e1:[1,2,"m","text"]},["",1,"! "]),n.elt("a",{e1:[4,1,update,0,100]},0,{"click":1},[n.$text(0,["Update model"])])])])];
});


var model={text:"Hello World"}, count=0;

function update(incr) {
  count+=incr;
  $set(model,"text","Hello World ("+count+")");
}

// display the test template in the #output div
test(model).render("output");

