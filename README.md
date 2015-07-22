# Chapter 6 - Building a Bookstore App

## About this chapter

So far, we have looked at all the key elements of Ionic. In this chapter, we will build a Bookstore application using that knowledge. The main purpose of this chapter is to consolidate your understanding of Ionic and, at the same time, get a sense of integrating an Ionic app with an existing RESTful service.

The Bookstore app we are going to build is a simple multi-page Ionic client that lets a user browse through the books without any authentication. Only when the user wants to add a book to his cart or view his purchase history do we ask the user to login. This approach provides a better user experience by not forcing the user to login to see content, but rather allowing him to login only when needed. 

Once the user is logged in, he/she can add books to the cart, view the cart, checkout the cart, and view purchases. A secure REST server will manage all the data for this application using JSON Web Tokens.

During the development process, we will work on the following topics:
 * Understanding the end-to-end application architecture
 * Setting up a server on a local machine or consume a hosted server
 * Analyzing different views, controllers, and factories needed for the app and
building these components
 * Visually testing the application

## Purchase Book

You can buy **Learning Ionic** from
* [Packt Publishing](https://www.packtpub.com/application-development/learning-ionic)
* [Amazon - US](http://www.amazon.com/gp/product/B010BEEIF2)
* [Amazon - India](http://www.amazon.in/gp/product/B010BEEIF2)

## Change Log

### 1.0.0 (2015-07-22)

Change(s):
 * First release 