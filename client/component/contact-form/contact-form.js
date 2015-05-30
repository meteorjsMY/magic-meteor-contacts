Template.contact_form.events({

  "hide.bs.modal #newContactModal": function(e) {

    Session.set('edit', undefined);

  },

  "submit .contactForm": function(event){

    if(Session.get('edit')){

      Contacts.update(
        {
          _id: Session.get('edit')._id
        },
        {
          name: event.target.name.value,
          number: event.target.number.value,
          email: event.target.email.value,
          address: event.target.address.value,
          user_id: Meteor.userId(),
          createdAt: new Date()
        }
      );

    }
    else {

      Contacts.insert({
        name: event.target.name.value,
        number: event.target.number.value,
        email: event.target.email.value,
        address: event.target.address.value,
        user_id: Meteor.userId(),
        createdAt: new Date()
      });

    }

    event.target.name.value = "";
    event.target.number.value = "";
    event.target.email.value = "";
    event.target.address.value = "";

    $("#newContactModal").modal('toggle');

    return false;
  }

});

Template.contact_form.helpers({

  mode: function(){

    return Session.get('edit') ? 'Update' : 'Create';

  },

  contact: function(){

    return Session.get('edit');

  }

})