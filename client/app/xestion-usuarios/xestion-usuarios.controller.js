'use strict';

app.controller('XestionUsuariosCtrl', XestionUsuariosCtrl);

function XestionUsuariosCtrl($scope, $rootScope, auth, DTOptionsBuilder, DTColumnDefBuilder, borrowersFactory, loansFactory, booksFactory, mapsFactory, SweetAlert, configurationFactory) {
    $scope.borrowers = [];
    $scope.borrower = new Object;
    $scope.loan = new Object;
    $scope.editingBorrower = false;
    $scope.creatingLoan = false;
    var user = auth.get_user();

    console.log(user);

    configurationFactory.getConfiguration(user._id)
            .then(function (config) {
                $scope.types = config.borrower_types;
            }).catch(function (err) {
        console.log(err);
    });
    
    borrowersFactory.getBorrowers()
            //get a list of all borrowers
            .then(function (borrowers) {
                $scope.borrowers = borrowers;
            })
            .catch(function (err) {
                console.log(err);
            });

    $scope.saveBorrower = function (borrower) {


        if (typeof borrower._id !== 'undefined') {
            //updates the actual user
            borrowersFactory.saveBorrower(borrower)
                    .then(function (modifiedBorrower) {
                        $scope.editingBorrower = false;
                        SweetAlert.swal("Prestatario modificado correctamente", null, "success");
                    })
                    .catch(function (err) {
                        console.log(err);
                        SweetAlert.swal("Ocurriu un erro inesperado", null, "error");
                    });
        } else {
            // create user
            borrower.parent = auth.get_user()._id;
            borrowersFactory.addBorrower(borrower)
                    .then(function (newBorrower) {
                        $scope.editingBorrower = false;
                        $scope.borrowers.push(newBorrower);
                        SweetAlert.swal("Prestatario engadido correctamente", null, "success");
                    })
                    .catch(function (err) {
                        console.log(err);
                        SweetAlert.swal("Ocurriu un erro inesperado", null, "error");
                    });
        }

    };


    $scope.editBorrower = function (borrower) {

        $scope.borrower = borrower;
        $scope.editingBorrower = true;
        if (typeof borrower === 'undefined') {
            $scope.borrower = new Object;
            $scope.borrower.active = true;
        }
    };

    $scope.cancelEditingBorrower = function () {
        $scope.borrower = new Object;
        $scope.editingBorrower = false;
    };

    $scope.newLoan = function (borrower) {
        var limit = new Date();
        limit.setDate(limit.getDate() + 14);

        $scope.loan = new Object;

        $scope.loan.loan_date = new Date;
        $scope.loan.limit_date = limit;

        $scope.creatingLoan = true;
        $scope.borrower = borrower;
    };

    $scope.cancelNewLoan = function () {
        $scope.creatingLoan = false;
        $scope.borrower = new Object;
        $scope.loan = new Object;
    };


    $scope.saveLoan = function (loan) {

        loan.borrower = $scope.borrower._id;
        loan.book = $scope.book._id;
        loan.user = user._id;
        // console.log(loan);

        if (typeof loan.borrower !== 'undefined' && typeof loan.book !== 'undefined' && typeof loan.user !== 'undefined') {
            loansFactory.addLoan(loan).then(function (insertedLoan) {
                loan = new Object;
                $scope.creatingLoan = false;
                SweetAlert.swal("Préstamo engadido correctamente", null, "success");
            }).catch(function (err) {
                console.log(err);
                SweetAlert.swal("Ocurriu un erro inesperado", null, "error");
            });
        }

    };

    // buscar book

    var searched_item = new Object;

    $scope.getBook = function (val) {
        if (!$scope.noResults) {
            $scope.book = new Object;
        }
        return booksFactory.getBookTypeHead(val).then(function (response) {
            //console.log(response);
            return response.map(function (item) {
                searched_item = item;
                return item.title + "  " + item.author + " - " + item.editorial;
            });
        }).catch(function (err) {
            console.log(err);
            SweetAlert.swal("Ocurriu un erro inesperado", null, "error");
        });
    };

    $scope.selectBook = function () {
        $scope.book = searched_item;
    };

    $scope.resetBook = function (model) {
        if (model === '') {
            $scope.book = new Object;
        }
    };

    // fin buscar book 



    (function () {
        var opcionesTablaBorrowers = new Object;

        opcionesTablaBorrowers.dtOptions = DTOptionsBuilder
                .newOptions().withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withLanguageSource('/assets/datatables/translations/galician.json');

        opcionesTablaBorrowers.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7).notSortable()
        ];

        $scope.opcionesTablaBorrowers = opcionesTablaBorrowers;
    })();

    (function () {
        $rootScope.user = auth.get_user();
        $rootScope.login = false;
        $rootScope.salir = function () {
            auth.logout();
        };
    })();

//    $scope.getLocation = function (val) {
//        return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
//            params: {
//                address: val,
//                sensor: false
//            }
//        }).then(function (response) {
//            return response.data.results.map(function (item) {
//                return item.formatted_address;
//            });
//        });
//    };

    $scope.getLocation = function (value) {
        return mapsFactory.getLocations(value).then(function (response) {
            return response.results.map(function (item) {
                return item.formatted_address;
            });
        }).catch(function (err) {
            console.log(err);
        });
    };
}
