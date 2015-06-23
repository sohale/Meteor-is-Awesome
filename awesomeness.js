UsersDB = new Mongo.Collection("nusers");
MessagesTable = new Mongo.Collection("messages");

if (Meteor.isClient){
    Template.registerHelper('formatDate', function(date) {
      return moment(date).format('MM-DD-YYYY');
    });
}
function sync_logged_user(){
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

    if (Meteor.isClient) {
        alert(Meteor.user().username +' done');
    }

}

//    sync_logged_user();

if (Meteor.isClient) {
    //Initialisation


    Template.body.helpers(
    {
       users: function () {
          return UsersDB.find({});
       }
      ,
      msglist: function () {
          return MessagesTable.find({}, {sort: {createdAt: -1},limit: 5}); //Recent on top
      }
    }
    );

    //New:
    // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
    Template.body.events({
      "submit .new-message": function (event) {
        // This function is called when the new ... form is submitted

        //sync_you();


        orig_id = Meteor.userId(); //original "_id"
        //orig_uname: Meteor.user().username;     // username of logged in user
        //UsersDB.insert({orig_id:orig_id, uname:orig_uname});
        //username: Meteor.user().username


        var text = event.target.text.value;
        var receiver_uid = 30;
        var sender_uid = orig_id;

        MessagesTable.insert({
          touid: receiver_uid,
          fromuid: sender_uid,
          text: text,
          createdAt: new Date(), // current time
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


    // At the bottom of the client code
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });
}

/**************************\
**                        **
**    Server side code    **
**                        **
\**************************/

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
