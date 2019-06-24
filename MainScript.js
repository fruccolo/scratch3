var data;
(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.ncheck = function(check) {
        return true
    };

    ext.color = function(color) {
        return Math.pow(color, 1);
    };

    ext.rgb = function(r, g, b) {
        return ((((r * 256) + g) * 256) + b);
    };

    ext.power = function(num, power) {
        return Math.pow(num, power);
    };

    ext.textif = function(bool, text1, text2) {
    	if (bool) {
    		return text1
    	} else {
    		return text2
    	}

    };

    ext.alertbox = function(string) {
    	window.alert(string);
    }

    ext.whenThis = function(bool) {
        return bool;
    }

    ext.mathy = function(num1, oper, num2) {
        if (oper === '+') {
            return (num1 + num2)
        }
        if (oper === '-') {
            return (num1 - num2)
        }
        if (oper === '*') {
            return (num1 * num2)
        }
        if (oper === '/') {
            return (num1 / num2)
        }
        if (oper === '^') {
            return Math.pow(num1, num2)
        }
        if (oper === 'sqrt') {
            return (num1 * (Math.sqrt(num2)))
        }
    }

    ext.substringy = function(num1, num2, string) {
        return string.substring(num1 -1, num2);
    }
    // START NEW BLOCK
    ext.jQuGet = function(myURL) {

        $.ajaxSetup({async: false});
        $.get('https://cors-anywhere.herokuapp.com/' + myURL, function(data) {
            window.httpdata = data;
        });
        return window.httpdata;
    }    // END NEW BLOCK

    ext.javablock = function(string) {
    	return eval(string);
    }

    ext.blank = function(string) {
    }

    ext.exclu = function(bool1, bool2) {
      if (bool1 && bool2) {
        return false;
      }
      else{
        if (bool1){
          return true;
        }
        if (bool2){
          return true;
        }
      }
    }

    ext.strCont = function(string1, string2) {
    	return string1.includes(string2);
    }

    ext.dPrompt = function(prompty) {
    	return prompt(prompty);
    }

    ext.repAll = function(finder, string, replacer) {
    	return string.replace(new RegExp(finder, 'gi'), replacer);
    }

    ext.greaterOrEqual = function(string1, string2) {
    	return (string1 >= string2);
    }

    ext.lessOrEqual = function(string1, string2) {
    	return (string1 <= string2);
    }


    ext.itOfStr = function(num, string, seper) {
    	var str = string;
    	var res = str.split(seper);
    	return (res[num - 1]);
	};
    // Block and block menu descriptions
    var descriptor = {
          "blocks": [
              [" ", "Connect to Roboable","connect"],
              [" ", "Start/Stop Streaming","streaming"],
              [" ", "Set Pin Mode of %m.getPin to %m.setPinMode","setPinMode"],
              [" ", "Set Pin %m.getPin to %m.setPin","setPin"],
              [" ", "Get digital Pin %m.getPin","getPin"],
              [" ", "Vibrazione %n ms","setMotor",300],
              ["r", "Accelerometro X", "AccX"],
              ["r", "Accelerometro Y", "AccY"],
              ["r", "Accelerometro Z", "AccZ"],
              ["r", "Giroscopio X", "GyroX"],
              ["r", "Giroscopio Y", "GyroY"],
              ["r", "Giroscopio Z", "GyroZ"],
              ["r", "Magnetometro X", "MagX"],
              ["r", "Magnetometro Y", "MagY"],
              ["r", "Magnetometro Z", "MagZ"],
              ["r", "Digital 1", "D1"],
              ["r", "Digital 2", "D2"],
              ["r", "Digital 3", "D3"],
              ["r", "Digital 4", "D4"],
              ["r", "Battery","Battery"],
              ["r", "Connected","Connected"]
          ],
          "menus":{
              "setPinMode":["INPUT","OUTPUT"],
              "setPin":["0","1"],
              "getPin":["1","2","3","4"]
          },

    };

    // Register the extension
    ScratchExtensions.register('Roboable', descriptor, ext);
})({});
