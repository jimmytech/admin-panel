app.controller('propertyManagementCtrl', ['validationError', '$window', '$routeParams', '$http', 'AlertService', '$location', 'RestSvr', '$scope', 'PostcodeSvr', '$mdConstant',
    function(validationError, $window, $routeParams, $http, AlertService, $location, RestSvr, $scope, PostcodeSvr, $mdConstant) {
        
        var user = JSON.parse(localStorage.getItem('user')).user;
        var myDropzone;
        var semicolon = 186;
        $scope.chips = {};        
        $scope.chips.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, semicolon];
        $scope.selected = [];
        $scope.property = {};
        $scope.property.features = [];
        $scope.propertyRecord = [1];
        $scope.property.under_offer = false;
        $scope.property.sold_stc = false;
        $scope.property.reserved = false;

        $scope.validate = function() {
           validationError.alert();
        };
        /*select property for sale/rent and show html for the same */
        $scope.propertyFor = function(type) {
            $scope.propertyType = type;
        };

        /*redirect to new property page*/
        $scope.newPropertyPage = function() {
            $location.path('/property-management/new-property/for');
        };

        /**
         * https://ideal-postcodes.co.uk/documentation
         */
        $scope.findByPostcode = function() {

            // Clear all the fields
            $scope.property.address.address1 = null;
            $scope.property.address.address2 = null;
            $scope.property.address.county = null;
            $scope.property.address.town = null;
            $scope.property.address.latitude = null;
            $scope.property.address.longitude = null;
            postCodeLookUp();
        };

        function postCodeLookUp() {
            if (angular.isUndefined($scope.property.address)) {
                $scope.postcodeinvalid = true;
                $scope.postcodeResults = [];
                return;
            }
            var postcode = $scope.property.address.postcode;
            PostcodeSvr.lookup(postcode, true).then(function(response) {
                $scope.postcodeResults = response.data.result;
                $scope.postcodeinvalid = false;
            }, function(err) {
                $scope.postcodeinvalid = true;
                $scope.postcode_response_message = err.data.message;
                $scope.postcodeResults = [];
                    AlertService.popUp({
                        title: "Warning! ",
                        message: $scope.postcode_response_message,
                        type: 'warning'
                    });                

            });
        }


        /*check property detail having images or not*/
        $scope.uploadProperty = function(property) {
            var adminId = JSON.parse(localStorage.getItem('user')).user._id;
            $scope.userId = $routeParams.id === undefined ? adminId : $routeParams.id;
            property.paid_services = $scope.selected;
            property.upload_by = 'admin';
            property.admin_id = adminId;
            $scope.propertyData = property;
            if (myDropzone.getQueuedFiles().length > 0) {
                myDropzone.processQueue(); // Process the queue
            } else {
                processData(); // Process data without files
            }
        };

        /* Process/Save the data without images 
         * This function will only execute if user has not uplaod any files
         * getQueuedFiles length is zero
         */
        function processData() {
            var property = Object.assign($scope.propertyData, {
                'user_id': $scope.userId
            });
            RestSvr.post('property', property).then(response);
        }

        $scope.dropzoneConfig = {
            'options': { // passed into the Dropzone constructor
                url: 'property',
                paramName: 'file',
                autoProcessQueue: false,
                maxFilesize: 2, // MB
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                acceptedFiles: "image/*",
                addRemoveLinks: true,
                uploadMultiple: true,
                dictRemoveFile: 'x',
                dictCancelUpload: 'x',
                parallelUploads: 10,
                maxFiles: 10,
                // previewTemplate: document.getElementById('preview-template').innerHTML,
                dictFileTooBig: 'File size must be small from {{maxFilesize}} MB',
                dictMaxFilesExceeded: 'You can only upload {{maxFiles}} files at once',

                init: function() {
                    myDropzone = this;
                }
            },
            'eventHandlers': {
                addedfile: function(file) {},
                sendingmultiple: function(file, xhr, formData) {
                    var property = Object.assign($scope.propertyData, {
                        'user_id': $scope.userId
                    });
                    formData.append("property", angular.toJson(property));
                },
                'successmultiple': function(file, res) {
                    response(res);
                }
            }
        };

        /*manage property upload response*/
        function response(response) {
            if (response.errors) {
                angular.forEach(response.errors, function(error, index) {
                    AlertService.popUp({
                        title: "Error! ",
                        message: error.message,
                        type: 'danger'
                    });
                });
            } else {
                $location.path('/property-management/view-property/admin');
                AlertService.popUp({
                    title: "Success",
                    message: response.message,
                    type: 'success'
                });
            }
        }

        /**
         * Get the index of selected address
         */
        $scope.getIndex = function(index) {
            addressIndex = index || 0;
            $scope.property.address.latitude = $scope.postcodeResults[addressIndex].latitude;
            $scope.property.address.longitude = $scope.postcodeResults[addressIndex].longitude;
        };


        $scope.paging = {
            page:1
        };
        /*get property record to show in table*/
        $scope.propertyListing = function(sort){
            $scope.forceEllipses = true;
            $scope.maxSize = 5;            
            loadProperty(sort);         

        };

        function loadProperty (sort){
            $scope.pageHeader = 'Property Management';
            var orderBy = sort === undefined || sort == 'desc' ? 'desc' : 'asc';
            sortIcon(orderBy, sort);
            var filter = $routeParams.type == 'admin' ? JSON.parse(localStorage.getItem('user')).user._id : 0;
           $http.get('/admin/getPropertyListing?paginate='+$scope.paging.page+ '&type='+$routeParams.type + '&find='+filter + '&sort='+orderBy).then(function(response){
            $scope.propertyList = response.data.list;
             $scope.paging = response.data.paging;
             $scope.searchBar = response.data.searchBar;
           });  
        }

        /*show hide sort icon*/
        var sortIcon = function(orderBy, sort){
            if(sort===undefined){
                $scope.sort = 'desc1';
            }else if (orderBy=='desc') {
                $scope.sort = 'asc';
            }else if (orderBy=='asc') {
                $scope.sort = 'desc';
            }            
        };

        /*get next record by pagination*/
        $scope.pageChanged = function(){
            loadProperty();
        };

        /*redirect to edit page*/
        $scope.redirectToEditPage = function(slug){
            $location.path('/property-management/edit/'+slug);
        };

        /*show selected property on property edit page*/
        $scope.propertyInfo = function(){
            $http.get('/admin/getPropertyInfo?key=' +$routeParams.slug).then(function(response){
                $scope.postcodeResults = [];
                $scope.property = response.data.list;
                $scope.selected = response.data.list.paid_services;
                 $scope.property.available_date = new Date($scope.property.available_date);
                 $scope.property.viewing_date = new Date($scope.property.viewing_date);
                var obj = {
                    line_1: response.data.list.address.address1,
                    line_2: response.data.list.address.address2,
                    county: response.data.list.address.county,
                    post_town: response.data.list.address.town,
                };
                $scope.postcodeResults.push(obj);
            });
        };

        $scope.searchProperty = function (find){
            $http.get('/admin/searchProperty?find='+find).then(function(response){
                $scope.propertyList = response.data.list;
                $scope.searchBar = response.data.searchBar;
            });
        };

        $scope.refreshPropertyList = function(keyword){
            if(keyword===undefined){
                $scope.propertyListing();
            }
        };

        /*delete property if upload by him*/
        $scope.deletePropertyInfo = function(slug, index){
            $http.delete('/admin/deleteProperty/'+slug).then(function(response){
                if(response.data.success===true){
                     $scope.propertyList.splice(index, 1);
                    AlertService.popUp({
                        title: "Success",
                        message: 'Deleted successfully',
                        type: 'success'
                    }); 
                }else{
                    AlertService.popUp({
                        title: "Error! ",
                        message: "Try again",
                        type: 'danger'
                    });      
                }
            });
        };

        /*update property detail*/
        $scope.updateProperty = function(property){            
            property.paid_services = $scope.selected;
            $http.post('/admin/updatePropertyDetail', property).then(function(response){
                if(response.data.success===true){
                    $scope.back();
                    console.log(response.data);
                    AlertService.popUp({
                    title: "Success",
                    message: 'Property detail has been updated successfully',
                    type: 'success'
                });
                }else{
                    AlertService.popUp({
                        title: "Error! ",
                        message: "Some error occurred",
                        type: 'danger'
                    });  
                }
            });
        };

        $scope.uploadForMe = function(){
            $location.path('/property-management/new-property/for/me');
        };

        $scope.uploadForOther = function(){
            $location.path('/property-management/new-property/for/others');
        };

        $scope.userList = function(){
            $http.get('/admin/userRecords').then(function(response){
                $scope.users = response.data.list;
            });
        };

        $scope.searchUser = function(keyword){
            $http.get('/admin/find?find='+keyword).then(function(response){
                $scope.users = response.data.list;
            });
        }; 

        $scope.reloadUser = function (keyword){
            if(keyword===undefined){
                $scope.userList(); 
            }           
        }; 
        $scope.back = function(){
            $window.history.back();
        };        
        $scope.selectUser = function(id){
            $location.path('/property-management/new-property/for/other/'+id);
        };


        $scope.exclusion = [{
            text: 'Restrict student enquires',
            name: 'restrict_student_enquires',
            value: 'No'
        }, {
            text: 'Only Students Accepted',
            name: 'only_students_accepted',
            value: 'No'
        }, {
            text: 'Restrict DSS (Housing Benefits) Enquires',
            name: 'restrict_dss_enquires',
            value: 'No'
        }, {
            text: 'Restrict tenants with pets',
            name: 'restrict_tenants_with_pets',
            value: 'No'
        }, {
            text: 'Restrict Children – Families',
            name: 'restrict_children_Families',
            value: 'No'
        }, {
            text: 'Bills included in the rent',
            name: 'bills_included_in_the_rent',
            value: 'No'
        }, {
            text: 'Has Garden Access',
            name: 'has_garden_access',
            value: 'No',
            sale: true
        }, {
            text: 'Has Parking',
            name: 'has_parking',
            value: 'No',
            sale: true
        }, {
            text: 'Has Fireplace',
            name: 'has_fireplace',
            value: 'No',
            sale: true
        }];

        $scope.paid_services_info = [{
            text: 'Floorplan',
            name: 'floorplan',
            tooltip_text: null
        }, {
            text: 'Photography *',
            name: 'photography',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use. '
        }, {
            text: 'Photography & Floorplan *',
            name: 'photography_floorplan',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use.'
        }, {
            text: 'Gas safety certificate',
            name: 'gas_safety_certificate',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use. '
        }, {
            text: 'EPC (Energy Perfomance Certificate )',
            name: 'energy_perfomance_certificate',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use. '
        }, {
            text: 'Commercial EPC',
            name: 'commercial_epc',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use. '
        }, {
            text: 'Tenant Sign-up service',
            name: 'tenant_Signup_service',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use. '
        }, {
            text: 'Inventories',
            name: 'inventories',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use. '
        }, {
            text: 'Multiple Advertising Pack',
            name: 'multiple_advertising_pack',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use. '
        }, {
            text: 'Rent Protection - 12 Month Cover',
            name: 'rent_protection_cover',
            tooltip_text: '@ £85.00 tick to odd to your basket "Professional photos can improve your tenancy viewing and help you achieve a higher rental income. You will keep the 8 photos for future use. '
        }];
        $scope.min_price = ['100', '500', '1000', '5000', '10000', '20000', '50000'];
        $scope.max_price = ['100', '500', '1000', '5000', '10000', '20000', '50000'];
        $scope.property_rental = [
            'Room in shared property',
            'Room in shared house',
            'Room in shared Flat',
            'Terraced House',
            'Detached House',
            'Semi-detached House',
            'Bungalow',
            'Flat',
            'Maisonette',
            'Bedsit',
            'Mobile Home',
            'House Boat',
            'Penthouse',
            'Serviced Apartment'
        ];
        $scope.bedroomBathroomDropdown = [1, 2, 3, 4, 5, 6, 7, 8];
        $scope.epcRating = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        $scope.myDate = new Date();

        $scope.minDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth(),
            $scope.myDate.getDate());
        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };

        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };
        $scope.paidService = $scope.paid_services_info.map(function(r) {
            return r.name;
        });
    }
]);