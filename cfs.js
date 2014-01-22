ContactsFS = new CollectionFS('contacts');

if(Meteor.isClient){
  Template.queueControl.events({
      'change .fileUploader': function (e) {
          var files = e.target.files;
          for (var i = 0, f; f = files[i]; i++) {
              ContactsFS.storeFile(f);
          }
      }
  });

  Template.queueControl.helpers({
    files: function () {
      // ...
      return ContactsFS.find()
    }
  });

  Template.image.helpers({
    src: function () {
      var src = '';
      var srcDep = new Deps.Dependency;

      var getSrc = function(){
        srcDep.depend();
        return src;
      }
      
      ContactsFS.retrieveBlob(this._id, function(fileItem){
        src = URL.createObjectURL(fileItem.blob || fileItem.file);
        srcDep.changed();
      });

      return getSrc();
    }
  });
}

if(Meteor.isServer){
  var handler = {
        "default1": function (options) {
            return {
                blob: options.blob,
                fileRecord: options.fileRecord
            };
        }
    }
  
  ContactsFS.fileHandlers(handler);
}