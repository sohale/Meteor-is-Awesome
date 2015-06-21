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
          alert( Object.keys(Template.infobox) );
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

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
