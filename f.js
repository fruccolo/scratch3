const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const nets = require('nets');
const languageNames = require('scratch-roboable-extension-languages');
const formatMessage = require('format-message');

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAAESCAYAAAB3gfmJAAAACXBIWXMAAAsSAAALEgHS3X78AAAQNElEQVR4nO3dS25T2RbG8c1VNS2FGSQ1gqRGkDACUiPAtCy5Q2oEhBFU6Fhyi2QEN4wAZwSYEVxnBlhyP1ebrAOHxI9j+zzW4/+TLFAViO2T5PPa7xcPDw8JADz5D19NAN4QbADcIdgAuEOwAXCHYAPgDsEGwB2CDYA7BBsAdwg2AO4QbADcIdgAuEOwAXCHYAPgDsEGwB2CDYA7BBsAdwg2AO4QbADcIdgAuEOwAXCHYAPgDsEGwB2CDYA7BBsAdwg2AO4QbADcIdgAuPMHX1JsYzEenskff5lSOlny+23M5JXKv+8NRhO+KNjHi4eHBx4gflqMh0cppfwqAuxMQuy45ac0TylNS4GXw27WG4xmFf4ugiPYglqMh0WVdSZBll+nBp5GEXiT4tfeYPRdQbugCMEWxGI8LELsTALt0NE7v5egy69bgg4Em1MyFla8LFRidfomIXfdG4ymft4WqiLYnJCxsfNSmB1EfybivlTJ3apoERpHsBkm3cu+BFnbg/sW5fG5HG5XVHK+EWzGlMLs3Nk4WdtyJXcllRwzrc4QbAZIN/OCMGvMZ6niWD/nBMGmlCzHOJdAo5vZjlzFXTKzah/Bpox0NYvqjAmAbsylm3pFwNlEsCmxGA/7MnYWbWmGdje5imMczhaCrUPS3exLhcbYmW4EnCEEWwck0C7kRXfTlg90UfUj2FpEoLkxl3C7jP4gtCLYWkCguZVnUS/Y0aAPwdawxXh4IUsICDS/7iTg2M2gBMHWkMV4eC5LBpgUiIPxNyUItprJLoFrlm2ElbunfXYxdItgq0lpHO29izeEfX2WgKN66wDBVgM5++yabieemEu4MbnQMoJtD1Kl5UB7bfZNoA0fZXEv1VtLCLYdyeTANbOdqCiPvZ0zc9oOgm1LUqXl5RvvTDUcWvzTG4yu+Go0i2Dbgpy8cctYGvbExELDuAm+Illo+5VQQw3ymOxUPijRACq2DZggQIPmsmPhmodcLyq2NeQTdUKooSF54unTYjxkzK1mVGwrMOuJljHuViOCbQkZT/tXXcPgXb7o+Yxw2x9d0ScW4+E1oYaOHDOpUA8qNiGTBLdsXocCc6ncWMy7Iyq2X6E2IdSgRB7XncgeZOwgfLCVZj65uxOa5HD7IreXYUuhu6KlUGPmE5q9Za3bdsJWbIQaDPlE5badkMFGqMEgwm0L4YKNUINhhFtFocbY5D6CKaEG4/7mVN71wlRspXVqhBqsu2YR73ohgq20To0lHfCgWOdGuK0QpWK7JdTgTBFuL/nCPuc+2GTvJzsK4BHhtoLrYJNTOt4oaArQlGM5XgslboNNzlPjlA5E8JrDKn/ncrkHa9UQFFuvhLtgYwYUgXHckfDYFb0i1BBU7qHcMpngLNiYLAB+XA8ZvjvqpivKuBrwm9A3znsKtild0Nbdp5Rm8o9ONvzjxWmwJ3z4tOavqONtLoJNprrfKWiKV3M5PGAiv872/YGRY6+PJOhOWETdiPzBcxLx1ivzwSY/IF8UNMWbzxJkk7Y+9eVrmV/nVN+1uekNRuGOOjIdbDL7M5UBU+xnLntqbyXMOv2Ul6/tuby4iX8/4Y45sh5sdEH3dyezaLdauywScn15UcltL39oHUXqkpoNNpkF/aqgKRbNJcyueoPRzFL7pbvaZ1nP1j73BqNzY23emeVgYxZ0e3kw+VJzdVaVnIZ8ISHHLGs1r3qD0abZaxdMBpssxGWDe3U/As3jPkLppl7Ii4BbL8wsqblgk2/kGd/ElbgNtKekgruki7rRh95gdKmhIU2yGGzXfPNuNJc9s1fR1jDJ2OsV6+LW+tPa2Oq2TAUbEwaV3ORuWcRFmWVyTd0Vlf1Sd73B6GyHv2eGtWCb8Em8Uu529qMMDlchwxbXrINbyvVEgpnTPWSan1Bb7qMMChNqJblqlSUOf0v3HL+4Hne1dGwRRx8/dy+fvOG7nuvIqvsjWYyMR4eeb5U30RWVL8AnBU3RhLG0HSzGwzwj+N5cw5vhdkeClYrN/fT0FuZytn2fUNueLHV4Rdf0hwNZ/+eO+oqNau03uet5zpn2+5N1b1yk7bRqs1CxUa09upMJAkKtBrKO60yOZ4rMZdWmumLjrLWfQp6p1RYWffur2rRXbFRrj2fXE2oNkud74/YNbnYg5965oTbYZJdB9HVrbyNfyNEmCbe3cd7xM66KCM0Vm8vZmi1wq3fL5HlHDTdX69pUBpvMWEUd85jL7UKEWgfkuf8T7o0/ItgaFnVMKYfaGTOf3ZLuf8Qxt1MZAjKPYNPlglDTIfCEgoshIHXLPRbjYZ6d+a+CprSNMTWFAp4o42Lph8aKLWK1RqjplT9ovwV6vy6WfqgKNjk/K9rZWTeEml5SufSD7S013x3VVrFFq9buWHyrn4x7Rvo6HcvKBLMItu7ce1vt7Zmc6fYh0Fs2XbWpCTb5hIhy0sJcTung2CFD5MijKIdVmv7Q1VSxRapeWNZhV5TxtkPLa9o0BVuUbuhnJgvskuOOonyvmn2fKoItUDf0PvDiYzdkvC3COW5mr+jTUrFF6YZynLcfEbqkZmdHCbb23HA9nh/yARXhvECTP5udB5ssyvW+ZWXOMUz+yGZ577OkJrujGio211ftC67J88t71Uaw7ch7N/SOWVC/ZHjB8ykgBxaXfVCxNY97G/yjalOm02CTGZdDjQ+mJndMGPgna9s8V20E25a8V2tMGMThuWoj2LbkOdju2DYVh/Oq7cDaejaCrTmMrcXj+WtuagKhs2BzPr7G2FpAUrV53WpFsFXk4jacFVjeEZfXC65N9a66DDav3dA569bikkr93uEDYIytIq8VG6EGj1WbqWGjLoPN6/5Qgg23Hp+ApR0InQSbl9uml7hniQccTyK8VNCGSrqq2EzfgLOGy09q7MTj94KZcfGugs1rxUawocD3Qoe6CjaXM6KsXUNBjqnydoM8Y2wbeOyKRrmWDdV5q9oYY9vA444DqjU8xfdER1oPNsczosyG4jcOhyboiq5hppzdEsGGZTwNURwoaEMlXQSb14mDmYJmQB+6ox3QdBO8ZUwcYBUq+Q5QsdWDG6iwCsHWASq2evDNi6UYougGkwdA87wt1FWvi2A7NvaMqmCAGOswVNEyuqJA8/jgaxnBBsAdgg2AOwRbPZj5wjp0RVtGsNWAKX1AF4INQFVmdtgQbDWwdv0/4B3BVg+CDVCEYANQlZlJEIINaBh3YbSPYKsH+18RgZnDHgi2eng97hwoM7PntYtg41BGwCaCLRiXx50DZb3BiK4oAHSli2DzeNrsqYI2AE0ydVhmF8Hm8tA9dh/AOVM/t10Em9cN48yMAkoQbPUh2OCZqUXGBFt9mBkFlGg92ByfXcYEAqBEV8s9XF5HthgPqdrglanVDF0FG91RRGN9xw2zohV4vTn9XEEbgPAItnodL8ZDTvoAOkaw1Y+qDR4xxraJ81udCDa40xuMGGOryOvxRa/pjgLd6jLYPB+X3FfQBiCsLoPN8zjbhYI2AGFRsTXjkMW6cMTcsFFnwSaDkfdd/fstoDsKdKTrE3Q9V21vOKMN6AbB1qxLz28O0KrrYLvV+2hqcc7SD6B9nQabjLO5POlDHDBDCrRPwy1V3ruj7xlrg3Hm7inREGzeu6OJsTaklCwPSZhbc9p5sPUGo1yxzbtuR8PesK4tvOPoD6BNWi5MpmoDUBuCrT2ni/GQiQSgBSqCrTcY3QbojmaXTCQAzdNSsaUgVVte/nGtoB2AawRb++iSAg1TE2yBuqPZv4vxkJvjgYZoqthSoKotu2W7FdAMbcF2paANbTlkvA1ohqpg6w1GU+dntD2V70eIFOZAK7RVbClY1Za9W4yHHEoJ1EhjsEXsnn1ajIdc2wfURF2wyVFGNwqa0rZrZkqBemis2FLQqi0v3p0QbsD+VAabnPjh+QDKVQg3oAZaK7YUcBKhUIQbEwrAjtQGW28wug629KPsQCYUCDdgB5ortsQC1h/hFv0ZAFvTHmxXgfaPrpJP352w/QqoTnWwydIPVuandJpSmnG8OFCN9ootUbX9lMfdvizGQ44YBzZQH2xUbc/k6/ymLAkBVrNQsSWqtmfyjUdfc/XG2BvwnIlgo2pb6X2+85FlIcDvrFRsiaptpUNZFjJlcgF4ZCbYqNo2OpbJhQkBh+gsVWw53C4D70ao6lQCLi8P6TMGh4hMBZtguUM1P7qosv6NI5EQirlgkz2kdwqaYkVe//ZGZlFzyF0RctiSuar/DwVt2EW+l/OrvWZ3Lldx7+Q48tylnxSv3mA0C/5ssJq5D8IXDw8PCpqxPbkE5Z21diuWg24qrxx2U5mwQQ0W46HNH7RHd73ByNSElNWKLclYW1+6Wtjfobxey/q4JFXdtPyisoMFZiu29PiD15cBcrQrn248k8CbFb+nwltuMR4epZT+p7FtFZmr2EwHW3r8ppnIEgfokEPvu4Te91LwFUe+hyPrCr8Yft90RTvQlx8iuqQ6HEsrnn3YLMbD4rf3RdiVg68UiIUZXV/swnyw5W98OcrnXwXNQTXFeF7aVG2XwjDJlrrpkz/yNAwLRcX47L/TZfbPfFe0QJcUe/q2IgiXdZ+fhub33mC0LFx/oCvaPg9d0QJdUuzjeMXfrfRhWaGyRIssbqlaSsZiLhQ2DfEcSCCWX5aZ23ngJtjSr+1WnxU0BfBkVTWrlqtgE31OAAFicxdsMuN1rqApADrisWJLMkP1VkFTAHTAZbClX+NtNwqaAqBlboNNXMj6JACBuA42GW874xIYIBbvFRvhBgTkPtjSr8kEFu8CO5Kjl8wIEWzp12QCM6XAbgg2rZgpBWIIFWzpMdz6hBvgW7hgS4Qb4F7IYEuEG+Ba2GBLhBvgVuhgS4Qb4FL4YEuEG+AOwSYIN2CtE0uPh2ArkXD7oKZBgB6mjgcn2J7oDUaX7FAAbCPYlpAdCq/YOA/YRLCt0BuMJnIqCOe5AcYQbGvIqSBn3HwF2EKwbZDPc+sNRvlymH9UNxTATwRbRb3B6Cql9BdX+wH6EWxbkK7pCevdAN0Iti1J1zSvd/ubWVNAJ4JtR73B6FZOFaV6QwQs0I2iVL29YuwNzrGlKpq85q03GB3Jdiy6p0DHCLYayXYsuqdAxwi2mpW6p38ScEA3CLaG9AajGQEHdINga9iTgPvIGBzQPIKtJRJwFzIG95bN9UBzXjw8PPB4O7IYD/MUel9eByEfAqy46w1GZ1YaS7ApsRgP80b7czlN5DD684A6BBv2I5XcmQTdKY8TChBsqFcp6E5kjI6wQ9tMBdsfCtqADeRUkWn5Ty3GwyMJuRPZx3cmvx7zPBEdFZtDi/HwZSnwij1+xaftEWN4YeX9zLMd3/xUZvVNINgCW4yHRdiVA/Dlkw3PJ8zY7mVTmEzW/L/vTyv1JXLgfO/0HSpEsGErpTAsPA3Csm3GZPYdN/wmQbCtaYW/t/bPyMU/UIRgA+AOOw8AuEOwAXCHYAPgDsEGwB2CDYA7BBsAdwg2AO4QbADcIdgAuEOwAXCHYAPgDsEGwJeU0v8BTBl5hjLvySkAAAAASUVORK5CYII=";
/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

/**
 * The url of the roboable server.
 * @type {string}
 */
const serverURL = 'http://localhost:3000';

/**
 * How long to wait in ms before timing out requests to roboable server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

/**
 * Class for the roboable block in Scratch 3.0.
 * @constructor
 */
class Scratch3Roboable {
    constructor () {
        /**
         * Language code of the viewer, based on their locale.
         * @type {string}
         * @private
         */
        this._viewerLanguageCode = this.getViewerLanguageCode();

        /**
         * List of supported language name and language code pairs, for use in the block menu.
         * Filled in by getInfo so it is updated when the interface language changes.
         * @type {Array.<object.<string, string>>}
         * @private
         */
        this._supportedLanguages = [];

        /**
         * A randomly selected language code, for use as the default value in the language menu.
         * Properly filled in getInfo so it is updated when the interface languages changes.
         * @type {string}
         * @private
         */
        this._randomLanguageCode = 'en';


        /**
         * The result from the most recent translation.
         * @type {string}
         * @private
         */
        this._roboableResult = '';

        /**
         * The language of the text most recently roboabled.
         * @type {string}
         * @private
         */
        this._lastLangroboabled = '';

        /**
         * The text most recently roboabled.
         * @type {string}
         * @private
         */
        this._lastTextroboabled = '';
    }

    /**
     * The key to load & store a target's roboable state.
     * @return {string} The key.
     */
    static get STATE_KEY () {
        return 'Scratch.roboable';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        this._supportedLanguages = this._getSupportedLanguages(this.getViewerLanguageCode());
        this._randomLanguageCode = this._supportedLanguages[
            Math.floor(Math.random() * this._supportedLanguages.length)].value;

        return {
            id: 'roboable',
            name: formatMessage({
                id: 'roboable.categoryName',
                default: 'Roboable',
                description: 'Name of extension that adds roboable blocks'
            }),
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'getroboable',
                    text: formatMessage({
                        id: 'roboable.roboableBlock',
                        default: 'roboable [WORDS] to [LANGUAGE]',
                        description: 'roboable some text to a different language'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        WORDS: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'roboable.defaultTextToroboable',
                                default: 'hello',
                                description: 'hello: the default text to roboable'
                            })
                        },
                        LANGUAGE: {
                            type: ArgumentType.STRING,
                            menu: 'languages',
                            defaultValue: this._randomLanguageCode
                        }
                    }
                },
                {
                    opcode: 'getViewerLanguage',
                    text: formatMessage({
                        id: 'roboable.viewerLanguage',
                        default: 'language',
                        description: 'the languge of the project viewer'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                }
            ],
            menus: {
                languages: {
                    acceptReporters: true,
                    items: this._supportedLanguages
                }
            }
        };
    }

    /**
     * Computes a list of language code and name pairs for the given language.
     * @param {string} code The language code to get the list of language pairs
     * @return {Array.<object.<string, string>>} An array of languge name and
     *   language code pairs.
     * @private
     */
    _getSupportedLanguages (code) {
        return languageNames.menuMap[code].map(entry => {
            const obj = {text: entry.name, value: entry.code};
            return obj;
        });
    }
    /**
     * Get the human readable language value for the reporter block.
     * @return {string} the language name of the project viewer.
     */
    getViewerLanguage () {
        this._viewerLanguageCode = this.getViewerLanguageCode();
        const names = languageNames.menuMap[this._viewerLanguageCode];
        let langNameObj = names.find(obj => obj.code === this._viewerLanguageCode);

        // If we don't have a name entry yet, try looking it up via the Google langauge
        // code instead of Scratch's (e.g. for es-419 we look up es to get espanol)
        if (!langNameObj && languageNames.scratchToGoogleMap[this._viewerLanguageCode]) {
            const lookupCode = languageNames.scratchToGoogleMap[this._viewerLanguageCode];
            langNameObj = names.find(obj => obj.code === lookupCode);
        }

        let langName = this._viewerLanguageCode;
        if (langNameObj) {
            langName = langNameObj.name;
        }
        return langName;
    }

    /**
     * Get the viewer's language code.
     * @return {string} the language code.
     */
    getViewerLanguageCode () {
        const locale = formatMessage.setup().locale;
        const viewerLanguages = [locale].concat(navigator.languages);
        const languageKeys = Object.keys(languageNames.menuMap);
        // Return the first entry in viewerLanguages that matches
        // one of the available language keys.
        const languageCode = viewerLanguages.reduce((acc, lang) => {
            if (acc) {
                return acc;
            }
            if (languageKeys.indexOf(lang.toLowerCase()) > -1) {
                return lang;
            }
            return acc;
        }, '') || 'en';

        return languageCode.toLowerCase();
    }

    /**
     * Get a language code from a block argument. The arg can be a language code
     * or a language name, written in any language.
     * @param  {object} arg A block argument.
     * @return {string} A language code.
     */
    getLanguageCodeFromArg (arg) {
        const languageArg = Cast.toString(arg).toLowerCase();
        // Check if the arg matches a language code in the menu.
        if (languageNames.menuMap.hasOwnProperty(languageArg)) {
            return languageArg;
        }
        // Check for a dropped-in language name, and convert to a language code.
        if (languageNames.nameMap.hasOwnProperty(languageArg)) {
            return languageNames.nameMap[languageArg];
        }

        // There are some languages we launched in the language menu that Scratch did not
        // end up launching in. In order to keep projects that may have had that menu item
        // working, check for those language codes and let them through.
        // Examples: 'ab', 'hi'.
        if (languageNames.previouslySupported.indexOf(languageArg) !== -1) {
            return languageArg;
        }
        // Default to English.
        return 'en';
    }

    /**
     * roboables the text in the roboable block to the language specified in the menu.
     * @param {object} args - the block arguments.
     * @return {Promise} - a promise that resolves after the response from the roboable server.
     */
    getroboable (args) {
        // Don't remake the request if we already have the value.
        if (this._lastTextroboabled === args.WORDS &&
            this._lastLangroboabled === args.LANGUAGE) {
            return this._roboableResult;
        }

        const lang = this.getLanguageCodeFromArg(args.LANGUAGE);

        let urlBase = `${serverURL}roboable?language=`;
        urlBase += lang;
        urlBase += '&text=';
        urlBase += encodeURIComponent(args.WORDS);

        const tempThis = this;
        const roboablePromise = new Promise(resolve => {
            nets({
                url: urlBase,
                timeout: serverTimeoutMs
            }, (err, res, body) => {
                if (err) {
                    log.warn(`error fetching roboable result! ${res}`);
                    resolve('');
                    return '';
                }
                const roboabled = JSON.parse(body).result;
                tempThis._roboableResult = roboabled;
                // Cache what we just roboabled so we don't keep making the
                // same call over and over.
                tempThis._lastTextroboabled = args.WORDS;
                tempThis._lastLangroboabled = args.LANGUAGE;
                resolve(roboabled);
                return roboabled;
            });

        });
        roboablePromise.then(roboabledText => roboabledText);
        return roboablePromise;
    }
}
module.exports = Scratch3Roboable;
