var noble = require('noble');
var convert = require('color-convert');



var color = new Object();


    color.red = 0;
    color.green = 0;
    color.blue = 0;
    color.white = 255;
    color.brightness = 255;



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
                //var data = new Buffer("3c2a030668341500140000000000000000000000", "hex");
               // var data = new Buffer("3c2a0306463415000a005045dbde06ff04000000",'hex');

                //var data = new Buffer('3c2a0306423415000a00504d8b2b06ff05000000','hex');
                var data = new Buffer(5);
                data.writeUInt8(0x255, 0);
                data.writeUInt8(0x255, 1);
                data.writeUInt8(0x255, 2);
                data.writeUInt8(0x255, 3);
                data.writeUInt8(0x255, 4);
                colorCharacteristic.write(data, true, function (err) {
                    if (err) {
                        console.log(err);
                       // process.exit(1);
                    } else {
                        console.log('Everything worked?!');
                       // process.exit();
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