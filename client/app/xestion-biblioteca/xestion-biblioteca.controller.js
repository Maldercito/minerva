'use strict';

angular.module('minervaApp')
        .controller('XestionBibliotecaCtrl', XestionBibliotecaCtrl);

function XestionBibliotecaCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, dataBooks, googleBooks) {
    $scope.book = new Object;
    $scope.books = [];
    $scope.editingBook = false;
    $scope.newBook = function () {
        $scope.book = new Object;
        $scope.book.created_At = new Date();
        $scope.book.image = "/assets/images/logo.png";
        $scope.editingBook = true;
        
    };

    $scope.editBook = function (book) {
        $scope.book = book;
        $scope.editingBook = true;
    };
    
    $scope.cancelEditingBook = function(){
        $scope.book = new Object;
        $scope.editingBook = false;
    };

    $scope.checkIsbn = function (isbn) {

        if (isbn !== "") {
            googleBooks.getBookISBN(isbn).then(function (datos) {
                if (datos.totalItems > 0) {
                    var searchedBook = datos.items[0].volumeInfo;
                    $scope.book.title = searchedBook.title;
                    $scope.book.author = searchedBook.authors[0];
                    $scope.book.isbn13 = searchedBook.industryIdentifiers[1].identifier;
                    $scope.book.image = searchedBook.imageLinks.thumbnail;
                    $scope.book.synopsis = searchedBook.description;
                    $scope.book.language = searchedBook.language;
                    $scope.book.pages = searchedBook.pageCount;
                    $scope.book.editorial = searchedBook.publisher;
                    $scope.book.rating = searchedBook.averageRating;
                    console.log(searchedBook);
                }
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            $scope.book = new Object;
        }

    };
    

    $scope.saveBook = function (book) {
        console.log(book);
        $scope.book = new Object;
    };

    // var books = [];
    // $scope.books = books;

    dataBooks.getBooks()
            .then(function (books) {
                $scope.books = books;
            })
            .catch(function (err) {
                console.log(err);
            });

    (function () {
        var opcionesTablaLibros = new Object;

        opcionesTablaLibros.dtOptions = DTOptionsBuilder
                .newOptions().withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withLanguageSource('//cdn.datatables.net/plug-ins/1.10.11/i18n/Galician.json');


        opcionesTablaLibros.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4)

        ];

        $scope.opcionesTablaLibros = opcionesTablaLibros;
    })();
}
