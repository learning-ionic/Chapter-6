// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('BookStoreApp', ['ionic', 'BookStoreApp.controllers', 'BookStoreApp.factory'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
}).run(['$rootScope', 'AuthFactory',
    function($rootScope, AuthFactory) {

        $rootScope.isAuthenticated = AuthFactory.isLoggedIn();

        // utility method to convert number to an array of elements
        $rootScope.getNumber = function(num) {
            return new Array(num);
        }

    }
]).config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {

        // setup the token interceptor
        $httpProvider.interceptors.push('TokenInterceptor');

        $stateProvider

            .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('app.browse', {
            url: "/browse",
            views: {
                'menuContent': {
                    templateUrl: "templates/browse.html",
                    controller: 'BrowseCtrl'
                }
            }
        })

        .state('app.book', {
            url: "/book/:bookId",
            views: {
                'menuContent': {
                    templateUrl: "templates/book.html",
                    controller: 'BookCtrl'
                }
            }
        })

        .state('app.cart', {
            url: "/cart",
            views: {
                'menuContent': {
                    templateUrl: "templates/cart.html",
                    controller: 'CartCtrl'
                }
            }
        })


        .state('app.purchases', {
            url: "/purchases",
            views: {
                'menuContent': {
                    templateUrl: "templates/purchases.html",
                    controller: 'PurchasesCtrl'
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/browse');
    }
])

