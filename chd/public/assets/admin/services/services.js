'use strict';
app.factory('AuthenticationService', function () {
	var auth = {
        isLogged: false
    };
    return auth;
});

app.factory('userManagementService', function () {
     var userData = {
         result: 'blank',
         count: 'blank',
         countToExport:'blank',
         sort:'blank',
         userlistTitle: 'blank'
     };
    return userData;
});

app.factory('subscriptionPlanService', function () {
     var plan = {
     	   result: 'blank',
     };
    return plan;
});

app.factory("AlertService", ['$alert','$timeout', function($alert, $timeout){
	var service={};
	service.popUp = function(data){
		var alert = $alert({
		    title: data.title,
		    content: data.message,
		    placement: 'top-right',
		    type:data.type,
		    container: 'body',
		    animation: 'mat-grow-top-right',
		    duration: 5
	  	});
		$timeout(function(){
			alert.show();
		},500)
	}
	return service;
}]);

app.factory('colorService', function() {

  function brand_primary(variation) {
    return get_color(get_color_name('brand-primary'), variation);
  }
  function brand_success(variation) {
    return get_color(get_color_name('brand-success'), variation);
  }
  function brand_info(variation) {
    return get_color(get_color_name('brand-info'), variation);
  }
  function brand_warning(variation) {
    return get_color(get_color_name('brand-warning'), variation);
  }
  function brand_danger(variation) {
    return get_color(get_color_name('brand-danger'), variation);
  }

  function theme(variation) {
    variation = ( variation ? variation : 'base' );
    return get_color(get_color_name('theme'), variation);
  }
  function theme_secondary(variation) {
    variation = ( variation ? variation : 'base' );
    return get_color(get_color_name('theme-secondary'));
  }

  function get_color_name(name) {
    if(theme_colors[name] !== undefined){
      return theme_colors[name];
    }

    return global_colors[name];
  }

  function get_color(color, variation) {
    variation = ( variation ? variation : 'base' );

    return global_colors[color][variation];
  }

  function get_colors(){

  }

  return {
    brand_primary: brand_primary,
    brand_success: brand_success,
    brand_info: brand_info,
    brand_warning: brand_warning,
    brand_danger: brand_danger,
    theme: theme,
    theme_secondary: theme_secondary,
    get_color: get_color
  };
});

app.factory('todoService', ['localStorageService', '$rootScope', '$filter', function (localStorageService, $rootScope, $filter) {
  function Todo ($scope) {
    this.$scope = $scope;
    this.todoFilter = {};
    this.activeFilter = 0;
    this.input = angular.element('#todo-title');
    this.filters = [
      {
        'title': 'All',
        'method': 'all'
      },
      {
        'title': 'Active',
        'method': 'active'
      },
      {
        'title': 'Completed',
        'method': 'completed'
      }
    ];

    this.newTodo = {
      title: '',
      done: false,
      editing: false
    };

    this.restore();

    if ( !localStorageService.get('todos') ) {
      var todos = [];
      todos[0] = { title: 'Grow my mailing list', done: true };
      todos[1] = { title: 'Create a killer SAAS business', done: false };
      todos[2] = { title: 'Write autoresponder sequence', done: false };

      localStorageService.set('todos', todos);
    }
    localStorageService.bind(this.$scope, 'todos');

    this.completedTodos = function() {
      return $filter('filter')(this.$scope.todos, { done: !true });
    };

    this.addTodo = function() {
      if (this.todo.title !== '' && this.todo.title !== undefined) {
        this.$scope.todos.push(this.todo);
        $rootScope.$broadcast('todos:count', this.count());
        this.restore();
      }
    };

    this.updateTodo = function() {
      this.restore();
    };
  }

  Todo.prototype.saveTodo = function(todo) {
    if ( this.todo.editing ) {
      this.updateTodo();
    } else {
      this.addTodo();
    }
  };

  Todo.prototype.editTodo = function(todo) {
    this.todo = todo;
    this.todo.editing = true;
    this.input.focus();
  };

  Todo.prototype.toggleDone = function(todo) {
    $rootScope.$broadcast('todos:count', this.count());
  };

  Todo.prototype.clearCompleted = function() {
    this.$scope.todos = this.completedTodos();
    this.restore();
  };

  Todo.prototype.count = function() {
    var c = this.completedTodos();
    return c.length;
  };

  Todo.prototype.restore = function(focus) {
    focus = typeof focus !== 'undefined' ? focus : true;

    this.todo = angular.copy(this.newTodo);
    this.input.val('');

    if ( focus === true )
      this.input.focus();
  };

  Todo.prototype.filter = function(filter) {
    if ( filter === 'active' ) {
      this.activeFilter = 1;
      this.todoFilter = { done: false };
    } else if ( filter === 'completed' ) {
      this.activeFilter = 2;
      this.todoFilter = { done: true };
    } else {
      this.activeFilter = 0;
      this.todoFilter = {};
    }
  };

  return Todo;
}]);