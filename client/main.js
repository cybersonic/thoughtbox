import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Boxes } from '../imports/api/boxes.js';

import './main.html';



Template.body.onCreated(function helloOnCreated() {
  // counter starts at 0
  console.log(Boxes);
});

box_flash = {}; //Placeholder for saving the location
Template.body.helpers({
	"boxes": function(){
		// return [
		// 	{_id:1, title:"Hello1", x:100, y:100},
		// 	{_id:2, title:"Hello2", x:300, y:300},
		// 	{_id:3, title:"Hello3", x:400, y:500},

		// ];
		return Boxes.find({});
	},
	"box_title"(){
		return "Title";
	},
	"box_body"(){
		return "body";
	}
});

Template.body.events({
  'dblclick .container'(event,instance){
  	//ignore if we are a box
  
  	if($(event.target).hasClass("box")){
  		return;
  	}
  	
	box_flash =  {
			x:event.clientY, y:event.clientX
		};
	
	$(".modal").modal('show');
  },
  'click #formSubmit'(event,instance){

  	//get the vars:

  	let title = $("#box_title").html();
  	let body = $("#box_body").html();


  	let content = $.extend({}, box_flash);

  		content['title'] = title;
  		content['body'] = body;

  		Boxes.insert(content);

  		$("#box_title").html("Title");
		$("#box_body").html("body");
		box_flash = {};
  		$(".modal").modal('hide');
  }
});


Template.box.events({
	'drag .box': function(event, instance){
		 if (event.drag.type === 'dragstart') {
		      console.log('You start dragging!')
		    } else if (event.drag.type === 'dragend') {
		      	const pos = $(event.target).position();
				
				Boxes.update(this._id,{ $set:{x:pos.top, y:pos.left}});
				
		    } else if (event.drag.type === 'dragging') {
		      console.log('You are dragging!')
		    }

		$(event.target).animate({
			left: '+=' + event.drag.dx,
			 top: '+=' + event.drag.dy,
		},1);

	}

});
