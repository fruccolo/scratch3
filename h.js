const formatMessage = require('format-message');
const nets = require('nets');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const Clone = require('../../util/clone');
const log = require('../../util/log');
const icon = "data:image/png;base64,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";
const SERVER_HOST = 'http://localhost:3000';
const SERVER_TIMEOUT = 10000; // 10 seconds

class Scratch3Roboable {

  constructor() {}

  getInfo() {
    return {
      id: 'roboable',
      name: 'Roboable',
      colour: '#F39869',
      colourSecondary: '#F39869',
      colourTertiary: '#F39869',
      menuIconURI: icon,
      blocks: [
        {
          opcode: 'AccX',
          blockType: BlockType.REPORTER,
          text: 'Accelerometro X'
        },
        {
          opcode: 'AccY',
          blockType: BlockType.REPORTER,
          text: 'Accelerometro Y'
        },
        {
          opcode: 'AccZ',
          blockType: BlockType.REPORTER,
          text: 'Accelerometro Z'
        },
        {
          opcode: 'GyroX',
          blockType: BlockType.REPORTER,
          text: 'Giroscopio X'
        },
        {
          opcode: 'GyroY',
          blockType: BlockType.REPORTER,
          text: 'Giroscopio Y'
        },
        {
          opcode: 'GyroZ',
          blockType: BlockType.REPORTER,
          text: 'Giroscopio Z'
        },
        {
          opcode: 'MagX',
          blockType: BlockType.REPORTER,
          text: 'Magnetometro X'
        },
        {
          opcode: 'MagY',
          blockType: BlockType.REPORTER,
          text: 'Magnetometro Y'
        },
        {
          opcode: 'MagZ',
          blockType: BlockType.REPORTER,
          text: 'Magnetometro Z'
        },
        {
          opcode: 'D1',
          blockType: BlockType.REPORTER,
          text: 'Digitale 1'
        },
        {
          opcode: 'D2',
          blockType: BlockType.REPORTER,
          text: 'Digitale 2'
        },
        {
          opcode: 'D3',
          blockType: BlockType.REPORTER,
          text: 'Digitale 3'
        },
        {
          opcode: 'D4',
          blockType: BlockType.REPORTER,
          text: 'Digitale 4'
        },
        {
          opcode: 'Battery',
          blockType: BlockType.REPORTER,
          text: 'Batteria %'
        },
        {
          opcode: 'Connected',
          blockType: BlockType.COMMAND,
          text: 'Connetti a Roboable'
        },
        {
          opcode: 'Streaming',
          blockType: BlockType.COMMAND,
          text: 'Start/Stop ricezione dati'
        },
        {
            opcode: 'setMotor',
            text: 'Accedi motore per [TIME] ms',
            blockType: BlockType.COMMAND,
            arguments: {
                TIME: {
                    type: ArgumentType.NUMBER,
                    defaultValue: '300'
                  }
                }
        },
        {
            opcode: 'setPin',
            text: 'Imposta pin [PIN] a [DATA]',
            blockType: BlockType.COMMAND,
            arguments: {
              PIN: {
                  type: ArgumentType.STRING,
                  menu:'pin',
                  defaultValue: '1'
                },
                DATA:{
                  type: ArgumentType.STRING,
                  menu:'data',
                  defaultValue: '0'
                }
              }
      }
 ],   menus: {
        pin: {
            acceptReporters: true,
            items:[
       {text: '1', value: '1'},
       {text: '2', value: '2'},
       {text: '3', value: '3'},
       {text: '4', value: '4'}
     ]
   },
   data: {
       acceptReporters: true,
       items:[
  {text: '0', value: '0'},
  {text: '1', value: '1'}
]
}
 }
    };
  }
  //http://localhost:3000/setPin/1/0
  setPin(args){
    let path = `${SERVER_HOST}/setPin/`+args.PIN+`/`+args.DATA;
    return new Promise(resolve => {
        nets({
            url: path,
            timeout: SERVER_TIMEOUT
        }, (err, res, body) => {
            if (err) {
                log.warn(err);
                return resolve();
            }
            if (res.statusCode !== 200) {
                log.warn(res.statusCode);
                return resolve();
            }
            log("Inviato setPin "+args.PIN+" to "+args.DATA);
        });
    });

  }
  //http://localhost:3000/setMotor/300
  setMotor(args){
    let path = `${SERVER_HOST}/setMotor/`+args.TIME;
    return new Promise(resolve => {
        nets({
            url: path,
            timeout: SERVER_TIMEOUT
        }, (err, res, body) => {
            if (err) {
                log.warn(err);
                return resolve();
            }
            if (res.statusCode !== 200) {
                log.warn(res.statusCode);
                return resolve();
            }
            log("Inviato setMotor "+time);
        });
    });

  }
  //http://localhost:3000/connect
  Connected () {
    let path = `${SERVER_HOST}/connect`;
    return new Promise(resolve => {
        nets({
            url: path,
            timeout: SERVER_TIMEOUT
        }, (err, res, body) => {
            if (err) {
                log.warn(err);
                return resolve();
            }
            if (res.statusCode !== 200) {
                log.warn(res.statusCode);
                return resolve();
            }
            log("Inviato connect ");
        });
    });
  }
  //http://localhost:3000/streaming
  Streaming () {
    let path = `${SERVER_HOST}/streaming`;
    return new Promise(resolve => {
        nets({
            url: path,
            timeout: SERVER_TIMEOUT
        }, (err, res, body) => {
            if (err) {
                log.warn(err);
                return resolve();
            }
            if (res.statusCode !== 200) {
                log.warn(res.statusCode);
                return resolve();
            }
            log("Inviato connect ");
        });
    });
  }
  AccX () {
    let urlBase = `${SERVER_HOST}/poll`;
    const tempThis = this;
    const translatePromise = new Promise(resolve => {
        nets({
            url: urlBase,
            timeout: SERVER_TIMEOUT,
        }, (err, res, body) => {
            if (err) {
                log.warn(`error`);
                resolve('');
                return '';
            }
            var translated = JSON.parse(body);
            //resolve(transacclated);
            log(translated.AccX);
            return translated.AccX;
        });

    });
    translatePromise.then(translatedText => translatedText);
    return translatePromise;

  }
  AccY () {
      // Don't remake the request if we already have the value.
      let urlBase = `${SERVER_HOST}/poll`;
      const tempThis = this;
      const translatePromise = new Promise(resolve => {
          nets({
              url: urlBase,
              timeout: SERVER_TIMEOUT,
          }, (err, res, body) => {
              if (err) {
                  log.warn(`error`);
                  resolve('');
                  return '';
              }
              var translated = JSON.parse(body);
              //resolve(transacclated);
              log(translated.AccY);
              return translated.AccY;
          });

      });
      translatePromise.then(translatedText => translatedText);
      return translatePromise;
    }
    AccZ () {
        // Don't remake the request if we already have the value.
        let urlBase = `${SERVER_HOST}/poll`;
        const tempThis = this;
        const translatePromise = new Promise(resolve => {
            nets({
                url: urlBase,
                timeout: SERVER_TIMEOUT,
            }, (err, res, body) => {
                if (err) {
                    log.warn(`error`);
                    resolve('');
                    return '';
                }
                var translated = JSON.parse(body);
                //resolve(transacclated);
                log(translated.AccZ);
                return translated.AccZ;
            });

        });
        translatePromise.then(translatedText => translatedText);
        return translatePromise;
      }
  isExactly({A, B}) {
    return A === B;
  }

  isLessOrEqual({A, B}) {
    return A <= B;
  }

  isMoreOrEqual({A, B}) {
    return A >= B;
  }

  trueBlock() {
    return true;
  }

  falseBlock() {
    return false;
  }

  exponent({A, B}) {
    return Math.pow(A, B);
  }

  pi() {
    return Math.PI;
  }

  ternaryOperator({A, B, C}) {
    return A ? B : C;
  }

  letters({STRING, START, END}) {
    return STRING.slice(Math.max(1, START) - 1, Math.min(STRING.length, END));
  }

  currentMillisecond() {
    return Date.now() % 1000;
  }

  fetchFrom({URL}) {
    return new Promise(resolve => {
      fetch(URL).then(res => res.text()).then(resolve)
      .catch(err => resolve(''));
    });
  }

  parseJSON({PATH, JSON_STRING}) {
    try {
      const path = PATH.toString().split('/').map(prop => decodeURIComponent(prop));
      if (path[0] === '') path.splice(0, 1);
      if (path[path.length - 1] === '') path.splice(-1, 1);
      let json;
      try {
        json = JSON.parse(' ' + JSON_STRING);
      } catch (e) {
        return e.message;
      }
      path.forEach(prop => json = json[prop]);
      if (json === null) return 'null';
      else if (json === undefined) return '';
      else if (typeof json === 'object') return JSON.stringify(json);
      else return json.toString();
    } catch (err) {
      return '';
    }
  }

  stringToBoolean({STRING}) {
    return STRING;
  }

  regexReplace({STRING, REGEX, NEWSTRING}) {
    return STRING.toString().replace(new RegExp(REGEX, 'gi'), NEWSTRING);
  }

}

module.exports = Scratch3Roboable;
