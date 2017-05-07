var noble = require('noble');
var convert = require('color-convert');

var bluetoothHelper = require('./bluetooth.js');


noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function (peripheral) {


    if (peripheral.advertisement.localName === 'NrdicE63839') {
        console.log('Found the iLumi Bulb at ' + peripheral.id);


        connectToPeripheral(peripheral);

    }
});

function connectToPeripheral(peripheral) {

    peripheral.connect(function (error) {
        peripheral.discoverServices(['f000f0c004514000b000000000000000'], function (error, services) {
            console.log(services);

            var colorService = services[0];
            console.log('Discovered Service');

            colorService.discoverCharacteristics(['f000f0c104514000b000000000000000'], function (error, characteristics) {
                console.log(characteristics);
                var colorCharacteristic = characteristics[0];

                console.log('Discovered Characteristic');


                //changeColor(colorCharacteristic, '00', 'cyan');
                var data = new Buffer('ff0000ff00ff00ff00ff', 'hex');
                colorCharacteristic.write(data, true, function (err) {
                    if (!err){
                        console.log('Everything worked?!');
                        process.exit();
                    } else {
                        concole.log(err);
                        process.exit(1);
                    }
                });


            });

        });


    });


}


function changeColor(colorCharacteristic, intensity, newColor) {

    //var data = new Buffer("00ff00000100af00", "hex");
    var newColorHex = convert.keyword.hex(newColor);

    var data = new Buffer(intensity + newColorHex, "hex");




    colorCharacteristic.write(data, true, function (err) {

        if (!err) {
            console.log('Changed color to: ' + newColor);
        } else {
            console.error(err);
        }


    });


}