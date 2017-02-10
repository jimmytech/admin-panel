app.controller('homeController', ['Upload', '$routeParams', '$scope', '$rootScope', '$location', '$http', 'toasty', 'toastyService',
    'ngDialog',
    function(Upload, $routeParams, $scope, $rootScope, $location, $http, toasty, toastyService, ngDialog) {
        $scope.userMenu  = [
            {text: "Profile"},
            {text: "Change Password"},
            {text: "Logout"}
        ];
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false
        };
        $scope.collapseAll = function(data) {
            for (var i in $scope.accordianData) {
                if ($scope.accordianData[i] != data) {
                    $scope.accordianData[i].expanded = false;
                }
            }
            data.expanded = !data.expanded;
        };
        $scope.updateProfile = true;
        $scope.posts = function() {
            var url = $location.path().split("/").pop();
            if (url == 'success-stories') {
                $scope.title = "Success Stories";
            } else if (url == 'blog') {
                $scope.title = "Blog";
            }
        };
        $scope.updateAdminProfile = function(user) {
            $http.post('/admin//update-profile', user).success(function(response) {
                toastyService.notification(response.success, response.msg);
            });
        };

        $scope.profileSectionMode = function(m) {
            if (m == 't') {
                $scope.updateProfile = false;
            } else {
                $scope.updateProfile = true;
            }
        };
        $scope.adminProfileInfo = function() {
            $http.get('/admin/profile-info').success(function(response) {
                $scope.user = response.info;
            });
        };
        $scope.libraryFeaturePopUp = function() {
            var id = $location.path().split("/").pop();
            if (id == 'libraries-list') {
                $scope.selectPopUpDiv = 'lib';
            } else if (id == 'category-list') {
                $scope.selectPopUpDiv = 'lib-cat';
            } else if (id == 'posts') {
                $location.path('/admin/library-features/post/add-new');
                return;
            } else if (id == 'label') {
                $scope.selectPopUpDiv = 'label';
            } else if (id == 'sub-category-list') {
                $scope.selectPopUpDiv = 'add-sub-cat';
            }
            ngDialog.open({
                template: 'html/admin/ng_dialog/pop_up.html',
                scope: $scope
            });
        };
        $('#text').addClass('cursor-default');
        $scope.libraryFeatureList = function(key) {
            var id = $location.path().split("/").pop();
            if (id == "posts") {
                $scope.activePageName = 'Posts';
            }
            if (id == 'libraries-list') {
                $scope.activePageName = 'Libraries List';
                $http.get('/admin/getlibraryFeatureData?type=' + 'lib').success(function(response) {
                    $scope.libraryFeatureData = response.list[0].library;
                });
            } else if (id == 'category-list' && key === undefined) {
                $scope.activePageName = 'Category List';
                $http.get('/admin/getlibraryFeatureData?type=' + 'cat').success(function(response) {
                    $scope.libraryFeatureData = response.list[0].category;
                });
            } else if (id == 'posts') {
                $scope.activePageName = 'Posts';
                $http.get('/admin/getlibraryFeatureData?type=' + 'post').success(function(response) {
                    $scope.libraryFeatureData = response.list;
                });
            } else if (id == 'label') {
                $scope.activePageName = 'Labels';
                $http.get('/admin/getlibraryFeatureData?type=' + 'libLabel').success(function(response) {
                    $scope.libraryFeatureData = response.list[0].label;
                });
            } else if (id == 'sub-category-list' || key == 'subCat') {
                $http.get('/admin/getlibraryFeatureData?type=' + 'subCat').success(function(response) {
                    if (key == 'subCat') {
                        // $scope.subCatDropDown = [];
                        $scope.subCatDropDown = response.list[0].sub_category;
                    } else {
                        $scope.activePageName = 'Sub Category List';
                        $scope.libraryFeatureData = response.list[0].sub_category;
                    }
                });
            }
        };
        $scope.selectedToppings = [];
        $scope.printSelectedSubCategory = function printSelectedSubCategory() {
            var numberOfToppings = this.selectedToppings.length;
            if (numberOfToppings > 1) {
                var needsOxfordComma = numberOfToppings > 2;
                var lastToppingConjunction = (needsOxfordComma ? ',' : '') + '';
                var lastTopping = lastToppingConjunction +
                    this.selectedToppings[this.selectedToppings.length - 1];
                return this.selectedToppings.slice(0, -1).join(', ') + lastTopping;
            }
            return this.selectedToppings.join('');
        };
        $scope.addLibary = function(l) {
            $http.post('/admin/addLib', l).success(function(response) {
                toastyService.notification(response.success, response.msg);
                if (response.success === true) {
                    $scope.libraryFeatureList();
                    ngDialog.closeAll();
                }
            });
        };
        $scope.removeLibraryData = function(id, sub) {
            var url = $location.path().split("/").pop();
            var find;
            if (url == "sub-category-list") {
                find = sub;
            } else {
                find = "o";
            }
            $http.get('/admin/deleteLibraryData?id=' + id + "&&type=" + url + "&&find=" + find).success(function(response) {
                toastyService.notification(response.success, response.msg);
                if (response.success === true) {
                    for (var i = 0; i < $scope.libraryFeatureData.length; i++) {
                        if ($scope.libraryFeatureData[i]._id == id) {
                            $scope.libraryFeatureData.splice(i, 1);
                            break;
                        }
                    }
                }
            });
        };
        $scope.addLibaryCategory = function(cat) {
            $http.post('/admin/addLibCat', cat).success(function(response) {
                toastyService.notification(response.success, response.msg);
                $scope.libraryFeatureList();
                ngDialog.closeAll();
            });
        };
        $scope.addLibaryLabel = function(lab) {
            $http.post('/admin/addLibLab', lab).success(function(response) {
                toastyService.notification(response.success, response.msg);
                $scope.libraryFeatureList();
                ngDialog.closeAll();
            });
        };
        $scope.libraryFeaturesDiv = function(select) {
            if (select == 'lib') {
                $scope.ActiveDiv = 'lib';
            } else if (select == 'cat') {
                $scope.ActiveDiv = 'cat';
            } else if (select == 'post') {
                $scope.ActiveDiv = 'post';
            }
        };
        $scope.spanToInput = function(l, key) {
            if (key == 'addSub') {
                $scope.showAssignCatForm = l._id;
            } else if (key == 'edit') {
                $scope.showForm = l._id;
                $scope.newLibfeat = l.lib || l.cat || l.lab || l.sub;
            }
        };
        $scope.editAndSaveLibraryData = function(updatedInput, id) {
            if (id) {
                var type = $location.path().split("/").pop().substring(0, 2);
                $http.get('/admin/updateLibraryData?updated=' + updatedInput + "&&id=" + id + "&&type=" + type).success(function(response) {
                    toastyService.notification(response.success, response.msg);
                    if (response.success === true) {
                        $scope.showForm = null;
                        $scope.libraryFeatureList();
                    }
                });
            } else {
                $scope.showForm = null;
                $scope.showSubCatUl = null;
                $scope.showAssignCatForm = null;
            }
        };
        $scope.viewSubCategory = function(id) {
            $scope.showSubCatUl = id;
            $http.get('/admin/showSubCategory?id=' + id).success(function(response) {
                $scope.catToSubCat = response.data;
            });
        };
        $scope.closeEditForm = function() {
            $scope.editAndSaveLibraryData();
        };
        $scope.assignSubCategory = function(sub, id) {
            var obj = {
                subCat: sub,
                catId: id
            };
            $http.post('/admin/assignSubCat', obj).success(function(response) {
                toastyService.notification(response.success, response.msg);
                if (response.success === true) {
                    $scope.showAssignCatForm = null;
                }
            });
        };
        $scope.addSubCategory = function(sub) {
            $http.post('/admin/addSubCat', sub).success(function(response) {
                toastyService.notification(response.success, response.msg);
                $scope.libraryFeatureList();
            });
        };
        $scope.getLibDropDownList = function() {
            $http.get('/admin/libDropDownList').success(function(response) {
                alert("data");
            });
        };
        $scope.addUpdateLibCat = function(post) {
            var url = $location.path().split("/").pop();
            var url1 = $location.path().split("/").slice(-2)[0];
            var ck = angular.element(post.content).text().replace(/[\s]/g, '');
            var type;
            if (ck.length === 0) {
                toastyService.notification(false, "Please fill page content");
                return;
            }
            if ($scope.page._id) {
                $http.post('/admin/updateLibRecord', $scope.page).success(function(response) {
                    toastyService.notification(response.success, response.msg);
                });
            } else {
                if (url1 == "new-sub-category") {
                    post.type = "subCat";
                    post.cat_id = url;
                    $http.post('/admin/addUpdateLibCat', post).success(function(response) {
                        toastyService.notification(response.success, response.msg);
                        if (response.success === true) {
                            $location.path('/admin/library-features/sub-category-list/' + url);
                        }
                    });
                } else if (url1 == "new-post") {
                    post.type = "post";
                    post.sub_cat_id = url;
                    $http.post('/admin/addUpdateLibCat', post).success(function(response) {
                        toastyService.notification(response.success, response.msg);
                        if (response.success === true) {
                            $location.path('/admin/library-features/posts/' + url);
                        }
                    });
                } else if (url1 == "libraries-list") {
                    post.type = "cat";
                    $http.post('/admin/addUpdateLibCat', post).success(function(response) {
                        toastyService.notification(response.success, response.msg);
                        if (response.success === true) {
                            $location.path('/admin/library-features/libraries-list');
                        }
                    });
                }
            }
        };
        $scope.libraryRecords = function() {
            $scope.pageHeading = "Libraries";
            $http.get('/admin/libRecord').success(function(response) {
                if (response.success === true) {
                    $scope.libData = response.data;
                } else {
                    $scope.libData = [];
                }
            });
        };
        $scope.librarySubCatRecord = function() {
            $scope.pageHeading = "Sub Categories";
            var url = $location.path().split("/").pop();
            $http.get('/admin/libSubCatRecord?id=' + url).success(function(response) {
                $scope.libData = response.data;
            });
        };
        $scope.libraryPostsRecord = function() {
            $scope.pageHeading = "Posts";
            var url = $location.path().split("/").pop();
            $http.get('/admin/libPostRecord?id=' + url).success(function(response) {
                $scope.libData = response.data;
            });
        };
        $scope.managePageHeading = function() {
            var secondLastParms = $location.path().split("/").slice(-2)[0];
            var url = $location.path().split("/").pop();
            if (secondLastParms == "new-sub-category") {
                $scope.pageHeading = "Add New Sub Category";
            } else if (secondLastParms == "new-post") {
                $scope.pageHeading = "Add New Post";
            } else if (secondLastParms == "cat") {
                $scope.pageHeading = "Edit Category";
            } else if (secondLastParms == "subCat") {
                $scope.pageHeading = "Edit Sub Category";
            } else if (secondLastParms == "post") {
                $scope.pageHeading = "Edit Post";
            } else if (secondLastParms == "libraries-list") {
                $scope.pageHeading = "Add Category";
            } else if (url == "success-stories") {
                $scope.pageHeading = "Success Stories";
            } else if (url == "blog") {
                $scope.pageHeading = "Blog";
            }
        };
        $scope.receiveLibDataToEdit = function() {
            var url = $location.path().split("/").pop();
            var secondLastParms = $location.path().split("/").slice(-2)[0];
            if (secondLastParms == "cat" || secondLastParms == "subCat" || secondLastParms == "post") {
                $http.get('/admin/getLibdataToEdit?id=' + url).success(function(response) {
                    $scope.page = response.data[0];
                });
            }
        };
        $scope.changePassword = function(p) {
            var obj = {
                password: p.cpassword
            };
            if (p.cpassword == p.password) {
                $http.post('/admin/changePassword', obj).success(function(response) {
                    toastyService.notification(response.success, response.msg);
                });
            } else {
                toastyService.notification(false, "New password and confirm password is not equal.");
            }
        };
        /*start testimonial controller*/
        $scope.testimonialDataToEdit = function() {
            var id = $location.path().split("/").pop();
            if (id == 'add-new-testimonial') {
                $scope.testoPageTittle = "Add New Testimonial";
            } else {
                $scope.testoPageTittle = "Edit Page";
                $http.get('/admin/getTestimonialById?id=' + id).success(function(response) {
                    $scope.testo = response.testimonial;
                });
            }
        };
        $scope.testimonialCategory = function() {
            $http.get('/admin/testimonialCategory').success(function(response) {
                $scope.testiCat = response.cat[0].category;
            });
        };
        $scope.testimonialData = function() {
            $http.get('/admin/get-testimonial-data').success(function(response) {
                $scope.pages = response.data;
            });
        };
        $scope.categoriesAndRecordDiv = function(p) {
            if (p == 'categories') {
                $scope.testimonialCat = true;
                $scope.faqData = [{
                    question: "question1"
                }];
            } else if (p == 'testimonial') {
                $scope.testimonialCat = false;
            }
        };
        $scope.deleteTestimonial = function(id, index) {
            $http.get('/admin/deleteTestimonial?id=' + id).success(function(response) {
                $scope.testimonialData();
                toastyService.notification(response.success, response.msg);
            });
        };
        $scope.addTestimonialCategoryPopUp = function(u) {
            $scope.selectPopUpDiv = u;
            ngDialog.open({
                template: 'view/admin/ng_dialog/pop_up.html',
                scope: $scope
            });
        };
        $scope.insertUpdateTestimonail = function(file) {
            if ($scope.testo.content) {
                    Upload.upload({
                        url: '/admin/insert-update-testimonail',
                        data: {
                            file: file,
                            detail: $scope.testo
                        }
                    }).then(function(response) {
                        toastyService.notification(response.data.success, response.data.msg);
                        if (response.data.success) {
                            $location.path('/admin/testimonial');
                        }
                    });                
                }else{
                    toastyService.notification(false, "Please fill all required flield");
                }


        };
        $scope.addTestimonialCategory = function(cat) {
            $http.post('/admin/add-testimonial-category', cat).success(function(response) {
                toastyService.notification(response.success, response.msg);
                $scope.testimonialCategory();
            });
        };
        $scope.viewDetailPage = function(id) {
            $location.path('/admin/testimonial/detail/' + id);
        };
        $scope.viewDetail = function() {
            $http.get('/admin/getTestimonialById?id=' + $routeParams.id).success(function(response) {
                $scope.testo = response.testimonial;
            });
        };
        /*end testiminial controller*/

        var data = {"xData": ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],"yData":[{
            "name": "Users",
            "data": [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            "name": "Properties",
            "data": [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            "name": "Sold Properties",
            "data": [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }]};
        
        $scope.lineChartYData=data.yData;
        $scope.lineChartXData=data.xData;
    }
]);