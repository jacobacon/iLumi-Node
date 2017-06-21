/**
 * Created by jacob on 5/29/17.
 */

var noble = require('noble');


var serviceUuid = '';
var colorCharacteristicUuid = '';

noble.on('stateChange', function (state) {
   if (state === 'poweredOn') {
       console.log('scanning...');
       noble.startScanning([], false);
   } else {
       noble.stopScanning();
   }




});


noble.on('discover', function(peripheral) {
    noble.stopScanning();


    console.log('found peripheral: ', peripheral.advertisement);



});