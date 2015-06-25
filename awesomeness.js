Neighbourship = new Mongo.Collection("neighb");
MessagesTable = new Mongo.Collection("messages");

/**************************\
**                        **
**    Client side code    **
**                        **
\**************************/

if (Meteor.isClient){
    Template.registerHelper('formatDate', function(date) {
      return moment(date).format('MM-DD-YYYY');
    });
}

if (Meteor.isClient) {
    //Initialisation

    Template.body.helpers(
    {
       allPublicUsers: function () {
          return Meteor.users.find({});
       },
       allNeighbours: function () {
        /*
          var your_id = Meteor.userId();
          var you = Neighbourship.find({'orig_id':your_id}).fetch()[0];
          //alert(JSON.stringify( [you,you['neighbours']] ))
          return Meteor.users.find({username: {$in: you.neighbours}})
          */
          var your_id = Meteor.userId();
          var neighbours = Neighbourship.find({'who':your_id},{'friend':1}).fetch();
          //alert(JSON.stringify( neighbours[0] ))
          //return Meteor.users.find({username: {$in: neighbours}})
          arr=_.pluck(neighbours,'friend')
          console.log(JSON.stringify( arr ))
          c=Meteor.users.find({_id: {$in: arr}})
          console.log(JSON.stringify(c.fetch()))
          return Meteor.users.find({_id: {$in: arr}})

       },
       allMessagesView: function () {
          //todo: lookup target username and report it back.
          return MessagesTable.find({}, {sort: {createdAt: -1},limit: 5}); //Recent on top
       }

    }
    );

    //New:
    // Inside the if (Meteor.isClient) block, right after Template.body.helpers:
    Template.body.events({
      "submit .new-message": function (event) {
        // This function is called when the new ... form is submitted
        event.preventDefault();

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


    Template.oneNeighbour.events({
      'click .removeNeighbour': function () {
          <!-- How to pass the properties of each user?-->
          var your_id = Meteor.userId();
          var friend_id = this._id; //clicked to-be-friend person

          var neighbours = Neighbourship.find({'who':your_id, 'friend':friend_id},{}).fetch();
          
          var friendship_id = neighbours[0]._id;
          console.log(friendship_id);
          Neighbourship.remove({'_id':friendship_id});
          //event.target.text.value

      },
      'click .pokeNeighbour': function (event) {
          // this.* comes from the herlper['allNeighbours'] -> function.
          alert(this.username+" was poked."); <!-- How to pass the properties of each user?-->
      }
    });

    Template.onePublicUser.events({
      'click .addPublicAsNeighbour': function (event) {
          <!-- Add a publicUser as a neighbour-->
          event.preventDefault();
          console.log(JSON.stringify(this._id));

          var your_id = Meteor.userId();
          var friend_id = this._id; //clicked the to-be-friend person
          Neighbourship.insert({'who':your_id,'friend':friend_id});
          //event.target.text.value
          console.log("Neighbour added.");
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
