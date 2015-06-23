//UsersDB = new Mongo.Collection("users"); //we simply cannot access this table, so we use another one.
UsersDB = new Mongo.Collection("nusers");
MessagesTable = new Mongo.Collection("messages");

function sync_you(){
    //Error: Meteor.userId can only be invoked in method calls. Use this.userId in publish functions.
    if (Meteor.isClient){
    //alert(Meteor.user().username);
    }

    orig_id = Meteor.userId(); //original "_id"
    orig_uname: Meteor.user().username;
    //z=UsersDB.find({orig_id:orig_id});
    //Stores public info only:
    //manually
    //db.neighbour_users.insert({orig_id:'pkfsZatWwSdYpuebc', uname:'sosi', neighbours:{}});
    //cannot be done on the client side
    //if (Meteor.isServer){
    //UsersDB.insert({orig_id:orig_id, uname:orig_uname});
    //}
    if (Meteor.isClient){
    //UsersDB.insert({orig_id:orig_id, uname:orig_uname});
    }
    //if (Meteor.isClient){
    ////alert(); //(JSON.stringify(z));
    //}

/* upsert causes a silent error:
//http://stackoverflow.com/questions/19555473/how-to-use-meteor-upsert
UsersDB.upsert(
{
  // Selector
    u_id: Meteor.userId(), //original "_id"
    //uname: Meteor.user().username,
},
{
  // Modifier
  $set: {
    u_id: Meteor.userId(), //original "_id"
    uname: Meteor.user().username,

      neighbs:{},
      lastsynctime: Date.now()
  }
}

);
*/
    if (Meteor.isClient){
    alert(Meteor.user().username +' done');
}

/*

upsert({
    u_id: Meteor.userId(), //original "_id"
    uname: Meteor.user().username,
    neighbs:{}
});
*/
}

//    callme();

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

  /*
  Template.body.helpers({
    tasks: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]
  });
  */

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
    userpp: function () {
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
        return MessagesTable.find({}, {sort: {createdAt: -1},limit: 5}); //Recent on top
        //todo: read https://www.meteor.com/try/4   "Attaching events to templates"
    }
 
  });

//New:
// Inside the if (Meteor.isClient) block, right after Template.body.helpers:
Template.body.events({
  "submit .new-message": function (event) {
    // This function is called when the new ... form is submitted

    //sync_you();


    orig_id = Meteor.userId(); //original "_id"
    //orig_uname: Meteor.user().username;
    //UsersDB.insert({orig_id:orig_id, uname:orig_uname});

    var text = event.target.text.value;
    var receiver_uid = 30;
    var sender_uid = orig_id;



    MessagesTable.insert({
      touid: receiver_uid,
      fromuid: sender_uid,
      text: text,
      createdAt: new Date(), // current time

      //The "you" user
      //owner: Meteor.userId(),           // _id of logged in user
      //username: Meteor.user().username  // username of logged in user
      //Who owns it, who has visibnility, who can ref to as tracker (everyone)
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
  //todo: chekcbox: only received messages. Only original messages. (ref: original from whom to whom: messages PK)
*/

    // At the bottom of the client code
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


//mutating the [[Prototype]] of an object will cause your code to run very slowly; instead create the object with the correct initial [[Prototype]] value using Object.create

//todo: Don't show