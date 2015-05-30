# Introduction to Meteor JS

##### Hassanin Ahmed

##### 30 May 2015

This is an introductory tutorial into Meteor JS. We will build a simple contact book application that will cover CRUD, searching, filtering, user accounts and a mobile app.

##### Note: Commands that start with `$` are command line specific.

## 1\. Installation

1.  Go to https://www.meteor.com/install
2.  *   If you are on Linux or OS X curl https://install.meteor.com/ | sh
    *   If you are on Windows, download and install the windows installer.

## 2\. Creating our first app (Address Book)

To create a new project, we'll get to the terminal first.

    $ meteor create contactbook

`cd` into the directory.

`ls` to list the files in the current directory.

    1\. contactbook.css
    2\. contactbook.html
    3\. contactbook.js

To start the webserver

    $ meteor 

The app will be served at `http://localhost:3000`

## 3\. Static contacts

##### contactbook.html

    <head>
      <title>Contacts</title>
    </head>

    <body>
      <div class="container">
        <header>
          <h1>Contacts</h1>
        </header>
        <ul>
          {{#each contacts}}
            {{> contact}}
          {{/each}}
        </ul>
      </div>
    </body>

    <template name="contact">
      <li>{{name}}</li>
    </template>

##### contactbook.js

    if (Meteor.isClient) {
      // This code only runs on the client
      Template.body.helpers({
        contacts: [
          { name: "George Carlin" },
          { name: "Bill Burr" },
          { name: "Louis C.K." }
        ]
      });
    }

## 4\. Mongo DB Collections

To get contact values from the database, we'll need to setup a collection. A collection in Mongo DB is the almost the equivalent of a table in a relational database.

On the very top of contactbook.js write a new Mongo DB collection declaration.

##### contactbook.js

    Contacts = new Mongo.Collection('contacts');

We also need to tell the helper to pull the contacts from the collection. Replace the array with this function.

    if (Meteor.isClient) {
      Template.body.helpers({
        contacts: function(){
            return Contacts.find({});
        }
      });
    }

## 5\. Meteor Console

Since we do not have any records in our collection right now, the pages should come back empty. We can insert some new records into our collections through the Meteor Mongo console.

To access the Meteor Mongo console

    $ meteor mongo

To insert our first record, type the following.

    $ db.contacts.insert({ name: "Daniel Tosh", createdAt: new Date() });

Meteor should immediately display the new records on the web page!

## 6\. Twitter Bootstrap

Let's go ahead and start creating a layout that is more user friendly. We're going to use Twitter Bootstrap to get up to speed really quickly.

This will also be our first introduction to Meteor Packages.

https://atmospherejs.com/twbs/bootstrap

To add a new package, all we need to do is to add it through the command line.

    $ meteor add twbs:bootstrap

There are advanced options that you could use with this such as adding the LESS and SASS syntax. For this tutorial, we'll go with neither.

##### Template: Navbar

    <template name="navbar">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Contact Book</a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Contacts</a></li>
            <li><a href="#">Appointments</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Login</a></li>
          </ul>
        </div>
      </div>
    </nav>
    </template>

##### Template: Contacts

    <template name="contacts">
    <div class="panel panel-default">
      <div class="panel-heading">Contacts</div>
      <table class="table table-striped">
        <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th>Email</th>
          <th>Address</th>
        </tr>
        </thead>
        <tbody>
        {{#each contacts}}
          {{> contact}}
        {{/each}}
        </tbody>
      </table>
    </div>
    </template>

##### Template: contact

    <template name="contact">
    <tr>
      <td>{{name}}</td>
      <td>{{number}}</td>
      <td>{{email}}</td>
      <td>{{address}}</td>
    </tr>
    </template>

##### Body tag

    <body>
      {{> navbar }}
      <div class="container">
        <header>
          <h1>Contacts</h1>
        </header>
      {{> contacts}}
      </div>
    </body>

##### Template helpers

Now that we've changed up our template, we no longer see our records. This is because the helper no longer corresponds to the same template. We'll need to move our contacts helper into our contacts template.

      Template.contacts.helpers({
        contacts: function(){
            return Contacts.find({});
        }
      });

## 7\. Forms

Add a button to launch our form modal in the contacts panel heading.

##### Template: navbar

      <div class="panel-heading">
        <div class="row text-right">
          <div class="col-md-12 text-right">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#newContactModal">
              Add New Contact
            </button>
          </div>
        </div>
      </div>

Create a new modal with a form that we can use to add new contacts

    <template name="new_contact">
    <div class="modal fade" id="newContactModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">New Contact</h4>
          </div>
          <form class="contactForm">
            <div class="modal-body">
              <div class="form-group">
                <input class="form-control" name="name" type="text" placeholder="Name">
              </div>
              <div class="form-group">
                <input class="form-control" name="number" type="text" placeholder="Number">
              </div>
              <div class="form-group">
                <input class="form-control" name="email" type="text" placeholder="Email">
              </div>
              <div class="form-group">
                <input class="form-control" name="address" type="text" placeholder="Address">
              </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Save Contact</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </template>

Reminder: Do not use dashes in the name of your templates, Meteor freaks out.

##### Events

    Template.new_contact.events({
      "submit .contactForm": function(event){
        console.log('form submitted!');
        return false;
      }
    });

At the bottom of this function, we've returned false to avoid the form from submitting it's default behaviour and refreshing the page. We could also use `event.preventDefault();` but we'll stick to the Meteor way.

To get the values, we can query the form by the name of it's fields.

    console.log(event.target.name.value);

Let's take all the values and store them into our collection.

    Contacts.insert({
      name: event.target.name.value,
      number: event.target.number.value,
      email: event.target.email.value,
      address: event.target.address.value,
      createdAt: new Date()
    });

After we're done saving the details, let's reset the form and close the modal.

    event.target.name.value = "";
    event.target.number.value = "";
    event.target.email.value = "";
    event.target.address.value = "";

For the task of closing the modal, we'll simply use a twitter bootstrap function and toggle the visibility of the modal.

    $("#newContactModal").modal('toggle');

#### Exercises

1.  Edit and update!
2.  Validation

## 8\. Sessions sorting

Now that we have a table, it would be very helpful if we were able to sort the fields. Let's add a click handler when we click on the headers.

    Template.contacts.events({
      "click th": function(event){
        console.log($(event.target).text());
      }
    });

We'll use a jQuery selector to get the value for the header to be used in sorting.

Now let's add the value of the header into a session variable.

    var order = $(event.target).text().toLowerCase();
    Session.set('sortby', order);

We'll use `toLowerCase()` convert it from the caption to the key that is in our database.

##### Template.contacts.helper

Now let's read the session variable from the contacts template.

    Template.contacts.helpers({
      contacts: function(){
        var filter = {sort: {}};
        filter.sort[Session.get('sortby')] = 1;
        return Contacts.find({}, filter);
      }
    });

#### Exercises

1.  Repeat the same for sort order. You can use either `asc & desc` or `1 & -1`. The tricky part is to make sure that the sort order changes when you click on the same header twice.
2.  Add a caret indiciating the sort direction and sorted column.

## 9\. Deleting Contacts

We're going to add a feature to be able to delete contacts by bulk. We'll first add a checkbox to each contact so we can target the ones that are checked.

##### Contact Template

    <td><input type="checkbox" class="toggle-checked" /></td>

Don't forget to add an extra empty header in at the begining of the table.

##### Contacts Template

    <th></th>

Let's also add a button in our top sub navigation.

    <button type="button" class="btn btn-danger delete">Delete</button>

We'll start by adding a click handler for our toggle-checked class.

On the top of the page, let's add an array that we can access from the template helper and events handlers.

    var checked = [];

This will serve as the array that keeps track of the checked events.

    Template.contact.events({
      "click .toggle-checked": function () {
        var index = checked.indexOf(this._id);
        if (index > -1) {
          checked.splice(index, 1);
        }else{
          checked.push(this._id);
        }
      }
    });

We want to be sure that we are not inserting variables into our array. We also want to remove an id if it's already in the array signaling that it has been checked off.

Now let's add a handler for the click event.

##### Template.contacts.events

    Template.contacts.events({
      "click th": function(event){
        var order = $(event.target).text().toLowerCase();
        Session.set('sortby', order);
      },
      "click .delete": function () {
        $.each(checked, function(index, value) {
          Contacts.remove(value);
        });
        checked = [];
      }
    });

We loop over our checked array and remove each item that has been checked. We'll also set the array to an empty state again.

#### Exercise

1.  Hide the delete button and only display it if there is a contact that has been selected.
2.  Display a confirmation alert box to confirm that the user wants to delete the specific contact.
3.  Add a `select all` button at the top of the table.

## 10\. Search

A contact book wouldn't be so helpful if we couldn't search it easily. Let's add a search form that helps us search through the book and filter accordingly.

We'll start by moving the search form into the subnavigation of our contacts page.

    <div class="panel-heading">
      <div class="row text-right">
        <div class="col-md-6">
          <form class="navbar-form navbar-left" role="search">
            <div class="form-group">
              <input type="text" class="form-control searchbox" name="query" placeholder="Search">
            </div>
          </form>
        </div>
        <div class="col-md-6 text-right">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#newContactModal">
            Add New Contact
          </button>
          <button type="button" class="btn btn-danger delete">Delete</button>
        </div>
      </div>
    </div>

Let's also add another handler for `keyup` events so the page updates itself as soon as we click. Just like the filter, we'll save the query in a session variable.

    "keyup .searchbox": function(event){
      var query = event.target.value;
      Session.set('query', query);
    },

As for the last part, let's put the query into our `.find` method. We'll also apply a regular expression to make sure that the search is "fuzzy."

##### Template.contacts.helpers

    Template.contacts.helpers({
      contacts: function(){
        var filter = {sort: {}};
        var query = Session.get('query');
        filter.sort[Session.get('sortby')] = 1;

        return Contacts.find({ name: new RegExp(query, 'i') }, filter);
      }
    });

## 11\. User Accounts

User login is a very common feature in most web apps. Meteor comes with a very strong user accounts package than handles login and registration.

Let's add the packages through the command line.

    $ meteor add ian:accounts-ui-bootstrap-3 accounts-password

Once we've installed both packages, let's add the login buttons in our navbar on the right handside.

##### Template: navbar

    <ul class="nav navbar-nav navbar-right">
      {{> loginButtons}}
    </ul>

Just like that we've added login and registration capabilites.

To restrict the user from accessing the contacts before login we'll go ahead and check if a user is currently logged in. Let's make some changes to our main body.

##### Body

    <body>
    {{> navbar }}
    {{#if currentUser}}
      <div class="container">
        <header>
          <h1>Contacts</h1>
        </header>
        {{> contacts}}
        {{> new_contact}}
      </div>
    {{else}}
      {{> logged_out}}
    {{/if}}
    </body>

Let's also create a new `logged_out` template.

    <template name="logged_out">
    <div class="jumbotron text-center">
      <h1>Welcome to our Contact Book</h1>
    </div>
    </template>

Now that we have a `current_user`, let's go and include that whenever we create a contact so we different users only see their contacts.

We can do that by updating our insert method to include our `userId`.

    Contacts.insert({
      name: event.target.name.value,
      number: event.target.number.value,
      email: event.target.email.value,
      address: event.target.address.value,
      user_id: Meteor.userId(),
      createdAt: new Date()
    });

We'll also now need to filter the records based on our own userId.

    return Contacts.find({ name: new RegExp(query, 'i'), user_id: Meteor.userId() }, filter);

Now we will only be returned contacts from the current logged in user.

#### Exercise

1.  Add Facebook login.

## 12\. Deployment

Deployment with Meteor is incredibly simple. There are a choice of hosting options but we're going to host directly on the Meteor platform.

    $ meteor deploy contacts-hassanin.meteor.com

Now go to the selected url. The meteor magic continues.

## 13\. Mobile App

We'er almost at the end of the tutorial! We're going to test the cordova integration that's built in to Meteor.

To prep for our mobile app, we'll need to first set the viewport on our application inside the `header` tag.

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

### Android

Let's also go ahead and add the SDK.

    $ meteor install-sdk android

This will help you install all the necessary SDK to run an Android app.

    $ meteor add-platform android

Finally, to run the Android simulator just run the follwing;

    $ meteor run android

### iOS (Mac only, sorry :P)

    $ meteor install-sdk ios

This will run you through the setup necessary to build an iOS app from your project.

    $ meteor add-platform ios

This will add iOS as a platform for your app, it's possible to have 2 mobile app platforms at the same time.

    $ meteor run ios

## 14\. What's next?

1.  https://github.com/matteodem/meteor-boilerplate
2.  https://github.com/aldeed/meteor-autoform
3.  https://github.com/iron-meteor/iron-router
4.  http://meteortips.com/first-meteor-tutorial/structure/
5.  https://crater.io/
6.  https://atmospherejs.com/
7.  https://atmospherejs.com/msavin/mongol
8.  https://atmospherejs.com/sanjo/jasmine
9.  https://atmospherejs.com/mike/mocha
10.  http://lmgtfy.com/?q=meteor+js+resources
