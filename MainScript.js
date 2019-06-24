var data;
(function(ext) {

    ext.setPinMode = function(pin,mode) {
        return true
    };
    ext.setPin = function(pin,set) {
        return true
    };
    ext.setMotor = function(speed) {
        return true
    };
    // Block and block menu descriptions
    var descriptor = {
        blocks: [

          [" ", "Set Pin Mode of %m.getPin to %m.setPinMode","setPinMode"],
          [" ", "Set Pin %m.getPin to %m.setPin","setPin"],
          [" ", "Get digital Pin %m.getPin","getPin"],
          [" ", "Vibrazione %n ms","setMotor",300],

      ],
      "menus":{
          "setPinMode":["INPUT","OUTPUT"],
          "setPin":["0","1"],
          "getPin":["1","2","3","4"]
      }
    };

    // Register the extension
    ScratchExtensions.register('NitroBlock', descriptor, ext);
})({});
