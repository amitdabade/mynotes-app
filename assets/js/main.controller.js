var app = angular.module('myNotes', ['ngCookies','ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "welcome.html"
    })
    .when("/login", {
        templateUrl : "login.html"
    })
    .when("/trash", {
        templateUrl : "trash.html"
    })
    .when("/shared-notes", {
        templateUrl : "share.html"
    })
    .when("/tags", {
        templateUrl : "tags.html"
    })
    .when("/welcome", {
        templateUrl : "welcome.html",
    });
});
app.controller('mainCtrl', function($scope,$http,$cookies,$cookieStore) {
    
    $scope.noteid=0;
    $scope.ndata={};
    $scope.sdata={};
    $scope.newdata={};
    $scope.allusers=[];
    
    if(!$cookies.get('uid')){
        window.location = '#!/login';
    }else{
        $scope.userid=$cookies.get('uid');
        $scope.username=$cookies.get('uname');
        $scope.isAuth=true;
        $scope.newdata.uid=$scope.userid;
        getnotes($scope.userid);
        gettrashnotes($scope.userid);
        getallusers($scope.userid);
        getsharednotes($scope.userid);
        getalltagswithnotes();
    }
    
    $scope.login = function(data){
        // console.log(data);
        $http.post("api/v1/login",data)
          .then(function(response) {
            $scope.data = response.data;
            // console.log($scope.data);
            
            if($scope.data.data==true){
                // console.log($cookies.get('uid'));
                $scope.userid=$cookies.get('uid');
                $scope.username=$cookies.get('uname');
                $scope.isAuth=true;
                window.location = '#!/welcome';
                location.reload();
            }else if($scope.data.data==false){
                alert('Invalid password');
            }else{
                alert('Invalid email id');
            }         
            
          }).catch(function(response){
            console.log(response);
        });  
    } 
    
    $scope.logout = function(){
        $cookies.remove('uid');
        $cookies.remove('uname');
        $scope.isAuth=false;
        location.reload();
    }
    function getallusers(uid){
        var api = "api/v1/getallusers/"+uid;
        $http.get(api)
          .then(function(response) {
            $scope.data = response.data;
            $scope.allusers=$scope.data.data;
            // console.log($scope.data);
          }).catch(function(response){
            console.log(response);
        });  
    }
    
    function getnotes(uid){
        var api = "api/v1/getnotes/"+uid;
        $http.get(api)
          .then(function(response) {
            $scope.data = response.data;
            $scope.allnotes=$scope.data.data;
            // console.log($scope.data);
          }).catch(function(response){
            console.log(response);
        });  
    } 
    function gettrashnotes(uid){
        var api = "api/v1/gettrashnotes/"+uid;
        $http.get(api)
          .then(function(response) {
            $scope.data = response.data;
            $scope.alltrashnotes=$scope.data.data;
            // console.log($scope.data); 
          }).catch(function(response){
            console.log(response);
        });  
    } 
    
    
    $(document).on("click", "#deletenotebutton", function () {         
        $scope.noteid = $(this).data('note-id');
        // console.log($scope.noteid);     
        $("#detetenote").modal('show');
    });

    $scope.detetenote = function(){

        var api = "api/v1/deletenote/"+$scope.noteid;
        $http.get(api)
          .then(function(response) {
            $scope.data = response.data;
            // console.log($scope.data);
 
          }).catch(function(response){
            console.log(response);
        }); 
        location.reload();
    }
    
    $(document).on("click", "#restorenotebutton", function () {
           
        $scope.noteid = $(this).data('note-id');
        // console.log($scope.noteid);  
        
        var api = "api/v1/restorenote/"+$scope.noteid;
        $http.get(api)
          .then(function(response) {
            $scope.data = response.data;
            // console.log($scope.data);
 
          }).catch(function(response){
            console.log(response);
        }); 
        location.reload();

    });
    
    $(document).on("click", "#editnotebutton", function () {         
        $scope.notedata = $(this).data('note-data');
        document.getElementById('noteid').value=$scope.notedata.id;
        $scope.ndata.id=$scope.notedata.id;
        document.getElementById('notetitle').value=$scope.notedata.title;
        $scope.ndata.title=$scope.notedata.title;
        document.getElementById('notedescription').value=$scope.notedata.body;
        $scope.ndata.description=$scope.notedata.body; 
        
        $("#editnote").modal('show');
    });
    
    $scope.updatenote = function(ndata){
        // console.log(ndata);
        var api = "api/v1/updatenote";
        $http.post(api,ndata)
          .then(function(response) {
            $scope.data = response.data;
            // console.log($scope.data);
 
          }).catch(function(response){
            console.log(response);
        }); 
        location.reload();
    }
    
    $scope.newnote = function(ndata){
        // console.log(ndata);
        var api = "api/v1/newnote";
        $http.post(api,ndata)
          .then(function(response) {
            $scope.data = response.data;
            // console.log($scope.data);
 
          }).catch(function(response){
            console.log(response);
        }); 
        location.reload();
    }
    
    $scope.addnewtag = function(tdata){
        // console.log(tdata);
        var api = "api/v1/addnewtag";
        $http.post(api,tdata)
          .then(function(response) {
            $scope.data = response.data;
            // console.log($scope.data);
 
          }).catch(function(response){
            console.log(response);
        }); 
        location.reload();
    }
    
    $(document).on("click", "#sharenotebutton", function () {         
        $scope.notedata1 = $(this).data('note-data');
        document.getElementById('noteid1').value=$scope.notedata1.id;
        $scope.sdata.noteid=$scope.notedata1.id;
        document.getElementById('owerid').value=$scope.notedata1.ower;
        $scope.sdata.owerid=$scope.notedata1.ower;
        document.getElementById('sharebyid').value=$scope.userid;
        $scope.sdata.sharebyid=$scope.userid;

        
        $("#sharenote").modal('show');
    });
    
    $scope.sharenote = function(sdata){
        // console.log(sdata);
        var api = "api/v1/sharenote";
        $http.post(api,sdata)
          .then(function(response) {
            $scope.data = response.data;
            // console.log($scope.data);
 
          }).catch(function(response){
            console.log(response);
        }); 
        location.reload();
    }
    
    function getsharednotes(uid){

        var api = "api/v1/getsharednotes/"+uid;
        $http.get(api)
          .then(function(response) {
            $scope.data = response.data;
            $scope.sharednotes = $scope.data.data;
            // console.log($scope.sharednotes);
 
          }).catch(function(response){
            console.log(response);
        }); 
    }

    function getalltagswithnotes(){

        var api = "api/v1/getalltagswithnotes";
        $http.get(api)
          .then(function(response) {
            $scope.data = response.data;
            $scope.alltagswithnotes = $scope.data.data;
            // console.log($scope.alltagswithnotes);
 
          }).catch(function(response){
            console.log(response);
        }); 
    }


    
    $(document).on("click", "#revokeaccess", function () {
        $scope.sharednote = $(this).data('sharednote');
        var api = "api/v1/revokenoteaccess/"+$scope.sharednote.id+"/"+$scope.sharednote.note_id+"/"+$scope.sharednote.sharewith_id;
        $http.get(api)
          .then(function(response) {
            $scope.data = response.data;
            $scope.sharednotes = $scope.data.data;
            // console.log($scope.sharednotes);
 
          }).catch(function(response){
            console.log(response);
        });
        location.reload();
    });
    
    
    
});





