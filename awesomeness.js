UsersDB = new Mongo.Collection("users");
MessagesTable = new Mongo.Collection("messages");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);


  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.body.helpers({
    tasks: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]
  });

  Template.infobox.events({
    'click button': function () {
          var keys = Object.keys(Template.infobox);
          alert( JSON.stringify(keys) );
    }
  });



  Template.pokert.events({
    'click button': function () {
        alert( "You poked ");// + Template.pokert.get('getuname') );
    }
  });
  Template.pokert.helpers({
    user: function () {
      return "person 1";
    }
  });


  Template.body.helpers({
    users: function () {
        return UsersDB.find({});
    }
    //users: [
    //  { uid: 121, uname: "sebastian" },
    //  { uid: 122, uname: "joe" },
    //  { uid: 124, uname: "julia" }
    //]
    ,
    msglist: function () {
        //return MessagesTable.find({});
        return MessagesTable.find({}, {sort: {createdAt: +1}});
        //todo: read https://www.meteor.com/try/4   "Attaching events to templates"
    }
 
  });

//New:
// Inside the if (Meteor.isClient) block, right after Template.body.helpers:
Template.body.events({
  "submit .new-message": function (event) {
    // This function is called when the new task form is submitted

    var text = event.target.text.value;
    var receiver_uid = 30;
    var sender_uid = 5;

    MessagesTable.insert({
      touid: receiver_uid,
      fromuid: sender_uid,
      text: text,
      createdAt: new Date() // current time
    });

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;
  }
});


  Template.auser.events({
    'click button': function () {
        alert("poke done"); <!-- How to pass the properties of each user?-->
    }
  });

/*
  //Message operations
  Template.amessage.events({
    'click button': function () {
        alert("forward message (broadcast to neighbours)");
    }
  });
*/
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
