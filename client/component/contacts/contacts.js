var currentSort =  {
  key: '',
  dir: 1
};

Template.contacts.events({

  "click th": function(event){

    var order = $(event.target).attr('data-sort-key');
    Session.set('sortby', order);
    Session.set('sortts', new Date());

  },

  "click .toggle-checked": function(){

    var checked = Session.get('checked');
    var index = checked.indexOf(this._id);

    if(index > -1){
      checked.splice(index,  1);
    }
    else {
      checked.push(this._id);
    }

    Session.set('checked', checked);

  },

  "click .delete": function(){

    sweetAlert({
      title: "Are you sure?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true,
      html: false
    }, function(confirm){

      if(confirm){

        $.each(Session.get('checked'),  function(index, value){
          Contacts.remove(value);
        });
        Session.set('checked', []);

      }

    });


  },

  "keyup .searchbox": function(event){
    var query = event.target.value;
    Session.set('query', query);
  },

  "click .edit": function(event){

    var contact = Contacts.findOne(this._id);
    Session.set('edit', contact);
    $('#newContactModal').modal('show')

  }

})

Template.contacts.helpers({

  contacts: function(){

    var sortby = Session.get('sortby');
    Session.get('sortts');

    if(currentSort.key == sortby){
      currentSort.dir = (currentSort.dir === 1 ? -1 : 1);
    }
    else {
      currentSort = {
        key: sortby,
        dir: 1
      }
    }

    var filter = {sort: {}};
    filter.sort[currentSort.key] = currentSort.dir;
    var query = Session.get('query');
    return Contacts.find({name: new RegExp(query,  'i'), user_id: Meteor.userId()}, filter);
  },

  showDelete: function(){

    return !!Session.get('checked').length;

  },

  displaySortCaret: function(key){

    Session.get('sortts');
    return currentSort.key === key;


  },

  sortCaretDir: function(){

    Session.get('sortts');
    return currentSort.dir === -1 ? 'up' : 'down';

  }

})