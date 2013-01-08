
/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var hsp=require("hsp/rt");
var json=require("hsp/json");


function content(label,value) {
	if (!content.ng) {
		var Ng=require("hsp/rt").NodeGenerator, n=Ng.nodes;
		content.ng=new Ng(n.$text({e1:[0,0,"label"],e2:[1,0,"value"]},["",1,": ",2]));
	}
	return content.ng.process(this,["label",label,"value",value]);
}
/***
# template content(label, value)
	{label}: {=value}
# /template
***/

// template function as it should be generated by the pre-processor
function test1(person) {
	if (!test1.ng) {
		var Ng=require("hsp/rt").NodeGenerator, n=Ng.nodes;
		test1.ng=new Ng([
			n.$text(0,["Before"]),
			n.$insert({e1:[1,"person","firstName"]},content,[0,"First Name",1,1]),
			n.$text(0,["After"])
		]);
	}
	return test1.ng.process(this,["person",person]);
}
/***
# template test1(person)
	Before
	# insert content("First Name",person.firstName)
	After
# /template
***/

function nameDetails(person) {
	if (!nameDetails.ng) {
		var Ng=require("hsp/rt").NodeGenerator, n=Ng.nodes;
		nameDetails.ng=new Ng([
			n.$insert({e1:[1,"person","lastName"]},content,[0,"Last Name",1,1]),
			n.$if(
				{e1:[1,"person","firstName"]},
				1,
				[	
					n.$text(0,[", "]),
					n.$insert({e1:[1,"person","firstName"]},content,[0,"First Name",1,1])
				]
			)
		]);
	}
	return nameDetails.ng.process(this,["person",person]);
}
/***
# template nameDetails(person)
	# insert content("Last Name",=person.lastName)
	# if (person.firstName)
		, 
		# insert content("First Name",=person.firstName)
	# if
# /template
***/

// template function as it should be generated by the pre-processor
function test2(p) {
	if (!test2.ng) {
		var Ng=require("hsp/rt").NodeGenerator, n=Ng.nodes;
		test2.ng=new Ng([
			n.$insert({e1:[1,0,"p"]},nameDetails,[1,1])
		]);
	}
	return test2.ng.process(this,["p",p]);
}
/***
# template test2(p)
	# insert nameDetails(p)
# /template
***/

function test3(person, label) {
	if (!test3.ng) {
		var Ng=require("hsp/rt").NodeGenerator, n=Ng.nodes;
		test3.ng=new Ng([
			n.$text({e1:[1,0,"label"]},["",1]),
			n.$insert({e1:[1,"person","firstName"],e2:[0,"person","lastName"]},content,[1,1,1,2])
		]);
	}
	return test3.ng.process(this,["person",person,"label",label]);
}
/***
# template test3(person, label)
	// inserted template also has a label argument
	{=label}
	# insert content(=person.firstName,person.lastName)
# /template
***/

describe("Insert statement", function () {
	var ELEMENT_NODE=1;
	var TEXT_NODE=3;
	var COMMENT_NODE=8;

	it("tests a simple insertion", function() {
		var dm={firstName:"Omer",lastName:"Simpson"};
		var n=test1(dm);
		var tn=n.childNodes[1].childNodes[0];

		expect(n.childNodes.length).toEqual(3);
		expect(n.node.childNodes.length).toEqual(3);
		expect(n.node.childNodes[1].nodeValue).toEqual("First Name: Omer");
		expect(tn.node.nodeValue).toEqual("First Name: Omer");

		n.$dispose();
		expect(tn.node).toEqual(null);
	});


	it("tests nested insertion with multiple template instances and data-model updates", function() {
		var dm={firstName:"Omer",lastName:"Simpson"};
		var n=test2(dm);

		expect(n.childNodes.length).toEqual(1);
		expect(n.node.childNodes.length).toEqual(5);
		expect(n.node.childNodes[0].nodeValue).toEqual("Last Name: Simpson");
		expect(n.node.childNodes[3].nodeValue).toEqual("First Name: Omer");

		// update the data model
		json.set(dm,"firstName","Marge");
		n.refresh();
		expect(n.node.childNodes[3].nodeValue).toEqual("First Name: Marge");

		json.set(dm,"firstName",null);
		n.refresh();
		expect(n.node.childNodes.length).toEqual(3);

		json.set(dm,"firstName","Mickey");
		json.set(dm,"lastName","Mouse");
		n.refresh();
		expect(n.node.childNodes.length).toEqual(5);
		expect(n.node.childNodes[0].nodeValue).toEqual("Last Name: Mouse");
		expect(n.node.childNodes[3].nodeValue).toEqual("First Name: Mickey");

		var n2=n.childNodes[0].childNodes[1].childNodes[1].childNodes[0];
		expect(n2.node.nodeValue).toEqual("First Name: Mickey");

		n.$dispose();
		expect(n2.node).toEqual(null);
	});

	it("tests that nested template scope is isolated from the parent's template scope", function() {
		var dm={firstName:"Omer",lastName:"Simpson"};
		var n=test3(dm,"Always look on the bright side of life"); 

		expect(n.node.childNodes.length).toEqual(2);
		expect(n.node.childNodes[0].nodeValue).toEqual("Always look on the bright side of life");
		expect(n.node.childNodes[1].nodeValue).toEqual("Omer: Simpson");

		n.$dispose();
	});

	it("tests template argument update", function() {
		var dm={firstName:"Omer",lastName:"Simpson"};
		var n=test3(dm,"answer is?"); 

		expect(n.node.childNodes[0].nodeValue).toEqual("answer is?");

		n.updateArgument(1,"answer is 42");
		n.refresh();

		expect(n.node.childNodes[0].nodeValue).toEqual("answer is 42");

		n.$dispose();
	});
});
