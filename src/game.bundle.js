(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _game = require('./js/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.game = _game2.default;

},{"./js/game":16}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var blueprintData = {
    artificialMuscle: {
        name: 'artificial muscle (blueprint)',
        description: '',
        abilities: '',
        requirements: ''
    },
    retinalDisplay: {
        name: 'retinal display (blueprint)',
        description: '',
        abilities: '',
        requirements: ''
    },
    prostheticArm: {
        name: 'prosthetic arm (blueprint)',
        description: '',
        abilities: '',
        requirements: ''
    }
};

var Blueprint = function () {
    function Blueprint(name, description) {
        _classCallCheck(this, Blueprint);

        this.name = name;
        this.description = description;
    }

    _createClass(Blueprint, null, [{
        key: 'random',
        value: function random() {
            var blueprintValues = Object.values(blueprintData);
            var index = _Utility2.default.randomize(blueprintValues.length);

            var randomBlueprint = blueprintValues[index];

            return new Blueprint(randomBlueprint.name, randomBlueprint.description);
        }
    }]);

    return Blueprint;
}();

exports.default = Blueprint;

},{"./Utility":14}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Moveable2 = require('./Moveable');

var _Moveable3 = _interopRequireDefault(_Moveable2);

var _Constants = require('./Constants');

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

var _inventory = require('./inventory');

var _inventory2 = _interopRequireDefault(_inventory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Character = function (_Moveable) {
    _inherits(Character, _Moveable);

    // Character data and actions
    function Character(map) {
        _classCallCheck(this, Character);

        var _this = _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).call(this, map));

        _this.map = map;
        _this.EM = _eventManager2.default;
        _this.inventory = _inventory2.default.contents;
        _this.initialGridIndices = map.getMapCenter();
        _this.setInitialGridIndices(_this.initialGridIndices);
        _this.renderLayer(_this.getCharacter(), 'character-layer');
        console.log('character rendered');
        return _this;
    }

    _createClass(Character, [{
        key: 'subscribeItemsToMap',
        value: function subscribeItemsToMap() {
            // NOT REQUIRED AT THE MOMENT

            // this.map.itemsOnMap.forEach(item => {
            //     this.EM.subscribe(`${item.name}-${item.identityNumber} taken`, this.takeItem, this, true)
            // })
        }
    }, {
        key: 'getCharacter',
        value: function getCharacter() {
            var _getCSSCoordinates = this.getCSSCoordinates(),
                cssLeft = _getCSSCoordinates.cssLeft,
                cssTop = _getCSSCoordinates.cssTop;

            var _getGridIndices = this.getGridIndices(),
                x = _getGridIndices.x,
                y = _getGridIndices.y;

            var character = {
                name: 'character',
                type: 'actor',
                element: '@',
                cls: 'character',
                left: cssLeft,
                top: cssTop,
                x: x,
                y: y
            };
            return character;
        }
    }, {
        key: 'getAction',
        value: function getAction(fnName, arg) {
            return this[fnName].bind(this, arg);
        }
    }, {
        key: 'move',
        value: function move(direction) {
            this.location = this.updateGridIndices(this.getCharacter(), _Constants.DIRECTIONS[direction]);
            this.printLocalStatus();
            this.renderLayer(this.getCharacter(), 'character-layer');
        }
    }, {
        key: 'printLocalStatus',
        value: function printLocalStatus() {
            this.EM.publish('character-moved', this.location);
            var localItem = this.localItem();
            if (localItem) {
                this.EM.publish('display-item', localItem.name);
            }
        }
    }, {
        key: 'localItem',
        value: function localItem() {
            var char = this.getCharacter();
            var localItem = null;
            this.map.itemsOnMap.forEach(function (item) {
                if (item.x === char.x && item.y === char.y) {
                    localItem = item;
                }
            });
            return localItem;
        }
    }, {
        key: 'take',
        value: function take() {
            var localItem = this.localItem();
            if (localItem) {
                this.EM.publish(localItem.name + '-' + localItem.identityNumber + ' taken');
                this.EM.publish('status', localItem.name + ' taken');
            } else {
                this.EM.publish('status', 'there is nothing here worth taking');
            }
        }
    }, {
        key: 'checkInventory',
        value: function checkInventory() {
            var carrying = this.inventory.map(function (item) {
                return item.name;
            }).join(' | ');
            var text = 'you are carrying: ' + carrying;
            this.EM.publish('status', text);
        }
    }, {
        key: 'mine',
        value: function mine() {
            // let miner = false
            // const char = this.getCharacter()
            // const location = [char.x, char.y]

            // this.inventory.forEach(item => {
            //     if (item.name === 'particle miner') {
            //         miner = item
            //     }
            // })

            // if (miner) {
            //     console.log('miner', miner)
            //     console.log('this.map.map', this.map.map)
            //     console.log('location', location)

            //     miner.setOnMap(this.map.map, location)
            //     this.EM.publish('remove-inventory', miner)
            // } else {
            //     this.EM.publish('status', 'you do not have any particle miners')
            // }

        }
    }]);

    return Character;
}(_Moveable3.default);

exports.default = Character;

},{"./Constants":4,"./Moveable":9,"./eventManager":15,"./inventory":17}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DIRECTIONS = {
    north: { x: 0, y: -1 },
    south: { x: 0, y: 1 },
    east: { x: 1, y: 0 },
    west: { x: -1, y: 0 },
    northwest: { x: -1, y: -1 },
    northeast: { x: 1, y: -1 },
    southeast: { x: 1, y: 1 },
    southwest: { x: -1, y: 1 }
};

exports.DIRECTIONS = DIRECTIONS;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Moveable2 = require('./Moveable');

var _Moveable3 = _interopRequireDefault(_Moveable2);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ITEMS = {
    miner: {
        name: 'particle miner',
        type: 'item',
        element: '|',
        description: 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.',
        div: 'item-miner' //,
        // parser: {
        //     name: 'noise parser',
        //     type: 'item',
        //     element: '?',
        //     description: 'prototype. parses atmospheric data for latent information. signal-to-noise ratio not guaranteed.',
        //     div: 'item-parser'
        // },
        // interface: {
        //     name: 'psionic interface',
        //     type: 'item',
        //     element: '&',
        //     description: `connects seamlessly to a standard-issue bioport. facilitates sundry interactions performed via PSI-NET.`,
        //     div: 'item-interface'
        // },
        // printer: {
        //     name: 'molecular printer',
        //     type: 'item',
        //     element: '#',
        //     description: 'generates objects according to a blueprint. molecules not included.',
        //     div: 'item-printer'
        // }
    } };

var Item = function (_Moveable) {
    _inherits(Item, _Moveable);

    _createClass(Item, null, [{
        key: 'getRandomItemConfig',
        value: function getRandomItemConfig() {
            var allItems = Object.values(ITEMS);
            return allItems[_Utility2.default.randomize(allItems.length)];
        }
    }, {
        key: 'random',
        value: function random() {
            return new Item(Item.getRandomItemConfig());
        }
    }, {
        key: 'generate',
        value: function generate(number) {
            var items = [];
            for (var i = 0; i < number; i++) {
                items.push(Item.random());
            }

            return items;
        }
    }]);

    function Item(itemConfig) {
        _classCallCheck(this, Item);

        // merge in config properties
        var _this = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).call(this));

        var target = Object.assign(_this, itemConfig);

        // additional properties
        _this.identityNumber = _Utility2.default.Id();
        _this.type = 'item';
        _this.offMap = false;
        // this.inInventory = false

        _this.EM = _eventManager2.default;
        _this.EM.subscribe(_this.name + '-' + _this.identityNumber + ' taken', _this.onTake, _this, true);
        return _this;
    }

    _createClass(Item, [{
        key: 'setOnMap',
        value: function setOnMap(map, location) {
            this.setMap(map);
            this.setInitialGridIndices(location);
            this.setCoordinates();
            this.setGridIndices();
            this.setDiv(this.getId());
            this.updateDiv(this);

            this.createInitialChildElement('item-layer');
        }
    }, {
        key: 'getId',
        value: function getId() {
            return this.identityNumber;
        }
    }, {
        key: 'setCoordinates',
        value: function setCoordinates() {
            var _getCSSCoordinates = this.getCSSCoordinates(),
                cssLeft = _getCSSCoordinates.cssLeft,
                cssTop = _getCSSCoordinates.cssTop;

            this.left = cssLeft;
            this.top = cssTop;
        }
    }, {
        key: 'setGridIndices',
        value: function setGridIndices() {
            var _getGridIndices = this.getGridIndices(),
                x = _getGridIndices.x,
                y = _getGridIndices.y;

            this.x = x;
            this.y = y;
        }
    }, {
        key: 'setDiv',
        value: function setDiv(identityNumber) {
            this.div = this.div + identityNumber;
        }

        // specific to item drawing: use outerHTML

    }, {
        key: 'drawLayer',
        value: function drawLayer(layerId) {
            var el = document.getElementById(layerId);
            el.outerHTML = this.getLayer();
        }
    }, {
        key: 'onTake',
        value: function onTake() {
            this.x = null;
            this.y = null;
            this.offMap = true; // changes css display to 'none'

            this.EM.publish('add-inventory', this);
            // this.EM.subscribe('remove-inventory', this.onDrop, this)
            this.renderLayer(this, this.div);
        }
    }, {
        key: 'onDrop',
        value: function onDrop() {
            //     this.x = args.x
            //     this.y = args.y


            this.EM.subscribe(this.name + '-' + this.identityNumber + ' taken', this.onTake, this, true);
            //     this.renderLayer(this, this.div)
        }
    }]);

    return Item;
}(_Moveable3.default);

exports.default = Item;

},{"./Moveable":9,"./Utility":14,"./eventManager":15}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LandscapeData = function () {
    function LandscapeData() {
        _classCallCheck(this, LandscapeData);

        this.features = this.features();
        this.bare = this.bare();
    }

    _createClass(LandscapeData, [{
        key: 'features',
        value: function features() {
            var period = {
                element: '.',
                description: 'the air is choked with dust, static, wifi',
                probability: 25,
                cls: 'period'
            };
            var comma = {
                element: ',',
                description: 'sprawl of smart homes, cul-de-sacs, laneways',
                probability: 26,
                cls: 'comma'
            };
            var semicolon = {
                element: ';',
                description: 'rows of greenhouses: some shattered and barren, others overgrown',
                probability: 24,
                cls: 'semicolon'
            };
            var grave = {
                element: '^',
                description: 'a shimmering field of solar panels, broken and corroded',
                probability: 22,
                cls: 'grave'
            };
            var asterisk = {
                element: '*',
                description: 'hollow users jack in at the datahubs',
                probability: 20,
                cls: 'asterisk'
            };
            return [period, comma, semicolon, semicolon, asterisk, asterisk, grave, grave];
        }
    }, {
        key: 'bare',
        value: function bare() {
            var bare = {
                element: '&nbsp;',
                description: 'concrete and twisted rebar stretch to the horizon',
                cls: 'blank'
            };
            return bare;
        }
    }]);

    return LandscapeData;
}();

exports.default = LandscapeData;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapGenerator = require('./MapGenerator');

var _MapGenerator2 = _interopRequireDefault(_MapGenerator);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
    function Map(col, row) {
        _classCallCheck(this, Map);

        this.col = col;
        this.row = row;
        this.generatedMap = new _MapGenerator2.default(col, row);
        this.map = this.generatedMap.getMap();
        this.itemsOnMap = [];
        this.EM = _eventManager2.default;
    }

    _createClass(Map, [{
        key: 'getMap',
        value: function getMap() {
            return this.map;
        }
    }, {
        key: 'getMapCenter',
        value: function getMapCenter() {
            return [Math.floor(this.col / 2), Math.floor(this.row / 2)];
        }
    }, {
        key: 'getRandomMapLocation',
        value: function getRandomMapLocation() {
            return [_Utility2.default.randomize(this.row - 1), _Utility2.default.randomize(this.col - 1)];
        }
    }, {
        key: 'setCharacter',
        value: function setCharacter(character) {
            this.character = character;
            this.character.setMap(this.map);
        }
    }, {
        key: 'setItems',
        value: function setItems(items) {
            var _this = this;

            items.map(function (item, index) {
                var randomMapLocation = _this.getRandomMapLocation();
                item.setOnMap(_this.map, randomMapLocation);
                _this.pushItem(item);
            });
        }
    }, {
        key: 'pushItem',
        value: function pushItem(item) {
            this.itemsOnMap.push(item);
        }
    }]);

    return Map;
}();

exports.default = Map;

},{"./MapGenerator":8,"./Utility":14,"./eventManager":15}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _LandscapeData = require('./LandscapeData');

var _LandscapeData2 = _interopRequireDefault(_LandscapeData);

var _Constants = require('./Constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapGenerator = function () {
    function MapGenerator(col, row) {
        _classCallCheck(this, MapGenerator);

        console.log('generating map');
        this.landscapeSeeds = new _LandscapeData2.default();
        var grid = this.init(col, row);
        var seededGrid = this.seed(grid);
        this.seededGrid = seededGrid;
        this.grow();
        console.log('map generated');
    }

    _createClass(MapGenerator, [{
        key: 'getMap',
        value: function getMap() {
            return this.seededGrid;
        }
    }, {
        key: 'init',
        value: function init(col, row) {
            this.col = col;
            this.row = row;
            var grid = [];
            for (var i = 0; i < row; i++) {
                grid[i] = [];
                for (var j = 0; j < col; j++) {
                    grid[i].push(this.landscapeSeeds.bare);
                }
            }
            return grid;
        }
    }, {
        key: 'seed',
        value: function seed(grid) {
            var randomElements = [];
            for (var i = 0; i < this.getNumberOfElementSeeds(); i++) {
                randomElements.push(this.landscapeSeeds.features[_Utility2.default.randomize(this.landscapeSeeds.features.length)]);
            }
            var seeds = this.generateSeedLocations(randomElements);
            seeds.map(function (seed) {
                return grid[seed.y][seed.x] = seed;
            });
            this._seeds = seeds;
            return grid;
        }
    }, {
        key: 'getNumberOfElementSeeds',
        value: function getNumberOfElementSeeds() {
            //  return 1        // test setting
            // return ((this.col * this.row) / (this._col + this.row))  // sparse initial seeding
            return this.col + this.row; // rich initial seeding
        }
    }, {
        key: 'generateSeedLocations',
        value: function generateSeedLocations(randomElements) {
            var _this = this;

            return randomElements.map(function (el) {
                el.x = _Utility2.default.randomize(_this.row - 1);
                el.y = _Utility2.default.randomize(_this.col - 1);
                return el;
            });
        }
    }, {
        key: 'grow',
        value: function grow() {
            var _this2 = this;

            var seeds = this._seeds;
            var mapPopulated = false;

            var _loop = function _loop() {
                if (!_this2.nextGenerationSeeds(seeds).length) {
                    mapPopulated = true;
                }
                var goodSeeds = [];
                _this2.goodSeeds = goodSeeds;
                _this2.nextGenerationSeeds(seeds).forEach(function (seed) {
                    if (_this2.checkSeed(seed)) {
                        goodSeeds.push(_this2.checkSeed(seed));
                    }
                });
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = goodSeeds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var goodSeed = _step.value;

                        if (_this2.seededGrid[goodSeed.y][goodSeed.x] === _this2.landscapeSeeds.bare) {
                            _this2.seededGrid[goodSeed.y][goodSeed.x] = goodSeed;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (!_this2.countUnseededLocations()) {
                    mapPopulated = true;
                } else {
                    seeds = goodSeeds;
                }
            };

            while (!mapPopulated) {
                _loop();
            }
        }
    }, {
        key: 'countUnseededLocations',
        value: function countUnseededLocations() {
            var flattenedGrid = [].concat.apply([], this.seededGrid);
            var count = 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = flattenedGrid[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var i = _step2.value;

                    if (i === this.landscapeSeeds.bare) {
                        count++;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return count;
        }
    }, {
        key: 'checkSeed',
        value: function checkSeed(seed) {
            var seedSucceeds = false;
            if (seed.x < this.col && seed.x >= 0 && seed.y < this.row && seed.y >= 0) {
                seedSucceeds = true;
            } else {
                return null;
            }
            if (this.seededGrid[seed.y][seed.x] !== this.landscapeSeeds.bare) {
                seedSucceeds = false;
            }

            this.goodSeeds.forEach(function (goodSeed) {
                if (seed.x === goodSeed.x && seed.y === goodSeed.y) {
                    seedSucceeds = false;
                }
            });

            if (seedSucceeds) {
                return seed;
            } else {
                return null;
            }
        }
    }, {
        key: 'nextGenerationSeeds',
        value: function nextGenerationSeeds(seeds) {
            var _this3 = this;

            var nextGenSeeds = [];
            seeds.forEach(function (originalSeed) {
                for (var direction in _Constants.DIRECTIONS) {
                    var directionValues = _Constants.DIRECTIONS[direction];
                    var nextGenSeed = Object.assign({}, originalSeed);
                    if (_this3.probability(nextGenSeed.probability)) {
                        for (var key in directionValues) {
                            if (key === 'x') {
                                nextGenSeed.x = originalSeed.x + directionValues[key];
                            } else if (key === 'y') {
                                nextGenSeed.y = originalSeed.y + directionValues[key];
                            }
                        }
                        nextGenSeeds.push(nextGenSeed);
                    }
                }
            });
            this.nextGenSeeds = nextGenSeeds;
            return nextGenSeeds;
        }
    }, {
        key: 'probability',
        value: function probability(percentage) {
            var probabilityArray = [];
            for (var i = 0; i < percentage; i++) {
                probabilityArray.push(true);
            }
            for (var _i = 0; _i < 100 - percentage; _i++) {
                probabilityArray.push(false);
            }
            return probabilityArray[_Utility2.default.randomize(100)];
        }
    }]);

    return MapGenerator;
}();

exports.default = MapGenerator;

},{"./Constants":4,"./LandscapeData":6,"./Utility":14}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderable2 = require('./Renderable');

var _Renderable3 = _interopRequireDefault(_Renderable2);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Moveable = function (_Renderable) {
    _inherits(Moveable, _Renderable);

    // movement and placement on the grid
    function Moveable() {
        _classCallCheck(this, Moveable);

        var _this = _possibleConstructorReturn(this, (Moveable.__proto__ || Object.getPrototypeOf(Moveable)).call(this));

        _this.EM = _eventManager2.default;
        return _this;
    }

    _createClass(Moveable, [{
        key: 'setMap',
        value: function setMap(map) {
            this.gotMap = map;
        }
    }, {
        key: 'setInitialGridIndices',
        value: function setInitialGridIndices(gridIndices) {
            this.gridIndices = gridIndices;
        }
    }, {
        key: 'getGridIndices',
        value: function getGridIndices() {
            var x = this.gridIndices[0];
            var y = this.gridIndices[1];

            return { x: x, y: y };
        }
    }, {
        key: 'updateGridIndices',
        value: function updateGridIndices(actor, move) {
            var newGridIndices = [this.gridIndices[0] + move.x, this.gridIndices[1] + move.y];
            var location = '';
            if (this.checkGridIndices(newGridIndices)) {
                location = this.gotMap[newGridIndices[1]][newGridIndices[0]];
                this.gridIndices = newGridIndices;
                actor.x = newGridIndices[0];
                actor.y = newGridIndices[1];
            } else {
                location = this.gotMap[(this.gridIndices[1], this.gridIndices[0])];
                if (actor.name === 'character') {
                    this.EM.publish('status', "you've reached the map's edge");
                }
            }
            return location;
        }
    }, {
        key: 'checkGridIndices',
        value: function checkGridIndices(newGridIndices) {
            var locationOnGrid = false;

            var x = newGridIndices[1];
            var y = newGridIndices[0];

            if (this.gotMap[x]) {
                var location = this.gotMap[x][y];
                if (location) {
                    locationOnGrid = true;
                }
            }

            return locationOnGrid;
        }
    }, {
        key: 'getCSSHeightAndWidth',
        value: function getCSSHeightAndWidth() {
            var el = document.querySelector('.unit');
            var style = window.getComputedStyle(el);
            var width = _Utility2.default.stringToNumber(style.getPropertyValue('width'));
            var height = _Utility2.default.stringToNumber(style.getPropertyValue('height'));
            return { width: width, height: height };
        }
    }, {
        key: 'getCSSCoordinates',
        value: function getCSSCoordinates() {
            var css = this.getCSSHeightAndWidth();
            var cssLeft = this.gridIndices[0] * css.height;
            var cssTop = this.gridIndices[1] * css.width;
            return { cssLeft: cssLeft, cssTop: cssTop };
        }
    }]);

    return Moveable;
}(_Renderable3.default);

exports.default = Moveable;

},{"./Renderable":10,"./Utility":14,"./eventManager":15}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderable = function () {
    // generalized render functions for Scenery, Character
    function Renderable() {
        _classCallCheck(this, Renderable);
    }

    _createClass(Renderable, [{
        key: 'setLayer',
        value: function setLayer(layer) {
            this.layer = layer;
        }
    }, {
        key: 'getLayer',
        value: function getLayer() {
            return this.layer;
        }
    }, {
        key: 'renderSpan',
        value: function renderSpan(unit) {
            var cls = '';
            var element = '&nbsp;';
            var style = '';
            if (unit) {
                cls = unit.cls;
                element = unit.element;
            }

            if (unit.top && unit.left) {
                style = 'top: ' + unit.top + 'px; left: ' + unit.left + 'px';
            }
            return '<span class="unit ' + cls + '" style="' + style + '">' + element + '</span>';
        }
    }, {
        key: 'renderDiv',
        value: function renderDiv(item) {
            var div = '';
            var element = '&nbsp;';
            var style = '';
            if (item) {
                div = item.div;
                element = item.element;
            }
            if (item.top && item.left) {
                style = 'top: ' + item.top + 'px; left: ' + item.left + 'px; position: absolute';
            }
            if (item.offMap) {
                style += '; display: none';
            }
            return '<div id="' + div + '" style="' + style + '">' + element + '</div>';
        }
    }, {
        key: 'renderLayer',
        value: function renderLayer(unit, layerId) {
            if (unit.type === 'actor') {
                this.updateSpan(unit);
                this.drawLayer(layerId);
                console.log('render actor');
            } else if (unit.type === 'item') {
                this.updateDiv(unit);
                this.drawLayer(layerId);
            } else {
                console.log('rewrite yr renderLayer code lol');
            }
        }
    }, {
        key: 'updateSpan',
        value: function updateSpan(actor) {
            this.setLayer(this.renderSpan(actor));
        }
    }, {
        key: 'updateDiv',
        value: function updateDiv(item) {
            this.setLayer(this.renderDiv(item));
        }
    }, {
        key: 'drawLayer',
        value: function drawLayer(layerId) {
            var el = document.getElementById(layerId);
            el.innerHTML = this.getLayer();
            // el.outerHTML = this.getLayer()
        }
    }, {
        key: 'createInitialChildElement',
        value: function createInitialChildElement(parentLayerId) {
            var el = document.getElementById(parentLayerId);
            var child = document.createElement('div'); // creates div id within enclosing div ...
            child.innerHTML = this.getLayer();
            el.appendChild(child);
        }
    }]);

    return Renderable;
}();

exports.default = Renderable;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderable2 = require('./Renderable');

var _Renderable3 = _interopRequireDefault(_Renderable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scenery = function (_Renderable) {
    _inherits(Scenery, _Renderable);

    // Scenery-specific rendering functions
    function Scenery(map) {
        _classCallCheck(this, Scenery);

        var _this = _possibleConstructorReturn(this, (Scenery.__proto__ || Object.getPrototypeOf(Scenery)).call(this));

        _this.gotMap = map.getMap();
        _this.renderGridLayer();
        console.log('scenery rendered');
        return _this;
    }

    _createClass(Scenery, [{
        key: 'renderGridLayer',
        value: function renderGridLayer() {
            var grid = this.gotMap.map(function (arr) {
                return arr.slice();
            });
            this.setLayer(this.createGridLayer(grid));
            this.drawGridLayer();
        }
    }, {
        key: 'createGridLayer',
        value: function createGridLayer(grid) {
            var sceneryGrid = [];
            for (var i = 0; i < grid.length; i++) {
                var rowItems = grid[i];
                var row = ''; // possibly make each row a table?
                for (var _i = 0; _i < rowItems.length; _i++) {
                    row += this.renderSpan(rowItems[_i]); // add rendered items to the grid
                }
                sceneryGrid.push(row);
            }
            return sceneryGrid;
        }
    }, {
        key: 'drawGridLayer',
        value: function drawGridLayer() {
            var layer = this.getLayer();
            var gridToHTML = layer.join('<br />'); // using HTML breaks for now
            var el = document.getElementById('landscape-layer');
            el.innerHTML = gridToHTML;
        }
    }]);

    return Scenery;
}(_Renderable3.default);

exports.default = Scenery;

},{"./Renderable":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Status = function () {
    function Status() {
        _classCallCheck(this, Status);

        this.EM = _eventManager2.default;
        this.EM.subscribe('character-moved', this.update, this);
        this.EM.subscribe('display-item', this.displayItem, this);
        this.EM.subscribe('status', this.default, this);
    }

    _createClass(Status, [{
        key: 'update',
        value: function update(location) {
            this.set(location.description);
        }
    }, {
        key: 'beginsWithVowel',
        value: function beginsWithVowel(text) {
            var firstLetter = text[0];
            var vowels = ['a', 'e', 'i', 'o', 'u'];
            var beginsWithVowel = false;
            vowels.forEach(function (vowel) {
                if (firstLetter === vowel) {
                    beginsWithVowel = true;
                }
            });
            return beginsWithVowel;
        }
    }, {
        key: 'displayItem',
        value: function displayItem(itemName) {
            var beginsWithVowel = this.beginsWithVowel(itemName);
            var text = '';
            if (beginsWithVowel) {
                text = 'you see an ' + itemName + ' here';
            } else {
                text = 'you see a ' + itemName + ' here';
            }
            this.set(text, 10);
        }
    }, {
        key: 'default',
        value: function _default(response) {
            this.set(response, 10);
        }
    }, {
        key: 'set',
        value: function set(description) {
            var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            window.setTimeout(function () {
                document.getElementById('status').innerHTML = description;
            }, delay);
        }
    }]);

    return Status;
}();

exports.default = Status;

},{"./eventManager":15}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserInput = function () {
    function UserInput(keyActionMap) {
        _classCallCheck(this, UserInput);

        this.keyActionMap = keyActionMap;

        document.onkeydown = this.tryActionForEvent.bind(this);
    }

    _createClass(UserInput, [{
        key: 'tryActionForEvent',
        value: function tryActionForEvent(event) {
            if (!_Utility2.default.contains(this.keyActionMap, event.keyCode)) {
                console.log('not a valid keycode: ' + event.keyCode);
            } else {
                this.keyActionMap[event.keyCode]();
            }
        }
    }]);

    return UserInput;
}();

exports.default = UserInput;

},{"./Utility":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var id = 0;

function generateId() {
    id = id + 1;
    return id;
}

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, null, [{
        key: "contains",
        value: function contains(obj, property) {
            return Object.keys(obj).indexOf(String(property)) !== -1;
        }
    }, {
        key: "stringToNumber",
        value: function stringToNumber(string) {
            return string.match(/\d+/)[0];
        }
    }, {
        key: "randomize",
        value: function randomize(mult) {
            return Math.floor(Math.random() * mult);
        }
    }, {
        key: "Id",
        value: function Id() {
            return generateId();
        }
    }]);

    return Utility;
}();

exports.default = Utility;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventManager = function () {
    function EventManager() {
        _classCallCheck(this, EventManager);

        this.eventsList = []; // create array of events
    }

    _createClass(EventManager, [{
        key: 'subscribe',
        value: function subscribe(event, fn, thisValue) {
            var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            if (typeof thisValue === 'undefined') {
                // if no thisValue provided, binds the fn to the fn??
                thisValue = fn;
            }
            this.eventsList.push({ // create objects linking events + functions to perform
                event: event, // push em to the array
                fn: fn,
                once: once,
                thisValue: thisValue
            });
        }

        // unsubscribe(event) {
        //     for (let i = 0; i < this.eventsList.length; i++) {
        //         if (this.eventsList[i].event === event) {
        //             this.eventsList.splice(i, 1)
        //             break
        //         }
        //     }
        // }

    }, {
        key: 'publish',
        value: function publish(event, arg) {
            for (var i = 0; i < this.eventsList.length; i++) {
                if (this.eventsList[i].event === event) {
                    var _eventsList$i = this.eventsList[i],
                        thisValue = _eventsList$i.thisValue,
                        fn = _eventsList$i.fn,
                        once = _eventsList$i.once;

                    fn.call(thisValue, arg);
                    if (once) {
                        this.eventsList.splice(i, 1);
                    }
                }
            }
        }
    }, {
        key: 'getEventsList',
        value: function getEventsList() {
            return this.eventsList;
        }
    }]);

    return EventManager;
}();

exports.default = new EventManager();

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Map = require('./Map');

var _Map2 = _interopRequireDefault(_Map);

var _Scenery = require('./Scenery');

var _Scenery2 = _interopRequireDefault(_Scenery);

var _Character = require('./Character');

var _Character2 = _interopRequireDefault(_Character);

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

var _Status = require('./Status');

var _Status2 = _interopRequireDefault(_Status);

var _UserInput = require('./UserInput');

var _UserInput2 = _interopRequireDefault(_UserInput);

var _Blueprints = require('./Blueprints');

var _Blueprints2 = _interopRequireDefault(_Blueprints);

var _inventory = require('./inventory');

var _inventory2 = _interopRequireDefault(_inventory);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.initGame();
        this.startGame();
    }

    _createClass(Game, [{
        key: 'initGame',
        value: function initGame() {
            // this.spaces = []
            // this.gameOver = false

            this.status = new _Status2.default();
            var map = new _Map2.default(60, 60);
            var items = _Item2.default.generate(5);

            this.scenery = new _Scenery2.default(map);

            map.setItems(items);

            var character = new _Character2.default(map);
            this.character = character;

            map.setCharacter(character);
            // character.subscribeItemsToMap()  // not currently necessary

            this.blueprint = _Blueprints2.default.random();

            this.inventory = _inventory2.default;
            this.inventory.add(this.blueprint);

            this.input = this.initUserInput(character);
        }
    }, {
        key: 'initUserInput',
        value: function initUserInput(character) {
            return new _UserInput2.default({
                '38': character.getAction('move', 'north'),
                '37': character.getAction('move', 'west'),
                '39': character.getAction('move', 'east'),
                '40': character.getAction('move', 'south'),
                '84': character.getAction('take'), // (t)ake item
                '73': character.getAction('checkInventory'), // check (i)nventory
                '77': character.getAction('mine') // deploy particle (m)iner
            });
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            this.status.set('you wake up');
            this.status.set('you are carrying ' + this.blueprint.name, 4000);
        }

        // gameIsOver() {
        //     return this.gameOver
        // }

        // explore() {
        //     console.log(`exploring the ${this.kind} zone!`)
        // }

    }]);

    return Game;
}();

exports.default = new Game();

},{"./Blueprints":2,"./Character":3,"./Item":5,"./Map":7,"./Scenery":11,"./Status":12,"./UserInput":13,"./eventManager":15,"./inventory":17}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Inventory = function () {
    function Inventory() {
        _classCallCheck(this, Inventory);

        this.contents = [];
        this.EM = _eventManager2.default;
        this.EM.subscribe('add-inventory', this.add, this);
        this.EM.subscribe('remove-inventory', this.remove, this);
    }

    _createClass(Inventory, [{
        key: 'add',
        value: function add(item) {
            this.contents.push(item);
        }

        // untested

    }, {
        key: 'remove',
        value: function remove(item) {
            var _this = this;

            var theItem = item;
            this.contents.forEach(function (item, i, array) {
                if (array[i] === theItem) {
                    _this.contents.splice(i, 1);
                    // } else {
                    // console.log('item not in inventory')
                }
            });
        }
    }]);

    return Inventory;
}();

exports.default = new Inventory();

},{"./eventManager":15}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0l0ZW0uanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsT0FBTyxJQUFQOzs7Ozs7Ozs7OztBQ0ZBOzs7Ozs7OztBQUdBLElBQU0sZ0JBQWdCO0FBQ2xCLHNCQUFrQjtBQUNkLGNBQU0sK0JBRFE7QUFFZCxxQkFBYSxFQUZDO0FBR2QsbUJBQVcsRUFIRztBQUlkLHNCQUFjO0FBSkEsS0FEQTtBQU9sQixvQkFBZ0I7QUFDWixjQUFNLDZCQURNO0FBRVoscUJBQWEsRUFGRDtBQUdaLG1CQUFXLEVBSEM7QUFJWixzQkFBYztBQUpGLEtBUEU7QUFhbEIsbUJBQWU7QUFDWCxjQUFNLDRCQURLO0FBRVgscUJBQWEsRUFGRjtBQUdYLG1CQUFXLEVBSEE7QUFJWCxzQkFBYztBQUpIO0FBYkcsQ0FBdEI7O0lBc0JNLFM7QUFDRix1QkFBWSxJQUFaLEVBQWtCLFdBQWxCLEVBQStCO0FBQUE7O0FBQzNCLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFLLFdBQUwsR0FBbUIsV0FBbkI7QUFDSDs7OztpQ0FFZTtBQUNaLGdCQUFNLGtCQUFrQixP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LEU7Ozs7Ozs7Ozs7O0FDdEVmOzs7Ozs7OztJQUVNLFM7QUFDRix5QkFBYztBQUFBOztBQUNWLGFBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLGFBQUssRUFBTDtBQUNBLGFBQUssRUFBTCxDQUFRLFNBQVIsQ0FBa0IsZUFBbEIsRUFBbUMsS0FBSyxHQUF4QyxFQUE2QyxJQUE3QztBQUNBLGFBQUssRUFBTCxDQUFRLFNBQVIsQ0FBa0Isa0JBQWxCLEVBQXNDLEtBQUssTUFBM0MsRUFBbUQsSUFBbkQ7QUFDSDs7Ozs0QkFFRyxJLEVBQU07QUFDTixpQkFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQjtBQUNIOztBQUlMOzs7OytCQUVXLEksRUFBTTtBQUFBOztBQUNULGdCQUFNLFVBQVUsSUFBaEI7QUFDQSxpQkFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixVQUFDLElBQUQsRUFBTyxDQUFQLEVBQVUsS0FBVixFQUFvQjtBQUN0QyxvQkFBSSxNQUFNLENBQU4sTUFBYSxPQUFqQixFQUEwQjtBQUN0QiwwQkFBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNKO0FBQ0k7QUFDSDtBQUFDLGFBTE47QUFPSDs7Ozs7O2tCQUlVLElBQUksU0FBSixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2pzL2dhbWUnXG5cbndpbmRvdy5nYW1lID0gZ2FtZVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNvbnN0IGJsdWVwcmludERhdGEgPSB7XG4gICAgYXJ0aWZpY2lhbE11c2NsZToge1xuICAgICAgICBuYW1lOiAnYXJ0aWZpY2lhbCBtdXNjbGUgKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHJldGluYWxEaXNwbGF5OiB7XG4gICAgICAgIG5hbWU6ICdyZXRpbmFsIGRpc3BsYXkgKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHByb3N0aGV0aWNBcm06IHtcbiAgICAgICAgbmFtZTogJ3Byb3N0aGV0aWMgYXJtIChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfVxufVxuXG5cbmNsYXNzIEJsdWVwcmludCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9tKCkge1xuICAgICAgICBjb25zdCBibHVlcHJpbnRWYWx1ZXMgPSBPYmplY3QudmFsdWVzKGJsdWVwcmludERhdGEpXG4gICAgICAgIGNvbnN0IGluZGV4ID0gVXRpbGl0eS5yYW5kb21pemUoYmx1ZXByaW50VmFsdWVzLmxlbmd0aClcblxuICAgICAgICBjb25zdCByYW5kb21CbHVlcHJpbnQgPSBibHVlcHJpbnRWYWx1ZXNbaW5kZXhdXG5cbiAgICAgICAgcmV0dXJuIG5ldyBCbHVlcHJpbnQocmFuZG9tQmx1ZXByaW50Lm5hbWUsIHJhbmRvbUJsdWVwcmludC5kZXNjcmlwdGlvbilcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQmx1ZXByaW50XG5cbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICcuL01vdmVhYmxlJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5cblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgTW92ZWFibGUgeyAgLy8gQ2hhcmFjdGVyIGRhdGEgYW5kIGFjdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgc3VwZXIobWFwKVxuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gaW52ZW50b3J5LmNvbnRlbnRzXG4gICAgICAgIHRoaXMuaW5pdGlhbEdyaWRJbmRpY2VzID0gbWFwLmdldE1hcENlbnRlcigpXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbEdyaWRJbmRpY2VzKHRoaXMuaW5pdGlhbEdyaWRJbmRpY2VzKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuICAgICAgICBjb25zb2xlLmxvZygnY2hhcmFjdGVyIHJlbmRlcmVkJylcbiAgICB9XG5cbiAgICBzdWJzY3JpYmVJdGVtc1RvTWFwKCkge1xuICAgICAgICAvLyBOT1QgUkVRVUlSRUQgQVQgVEhFIE1PTUVOVFxuXG4gICAgICAgIC8vIHRoaXMubWFwLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgLy8gICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke2l0ZW0ubmFtZX0tJHtpdGVtLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMudGFrZUl0ZW0sIHRoaXMsIHRydWUpXG4gICAgICAgIC8vIH0pXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgdHlwZTogJ2FjdG9yJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdAJyxcbiAgICAgICAgICAgIGNsczogJ2NoYXJhY3RlcicsXG4gICAgICAgICAgICBsZWZ0OiBjc3NMZWZ0LFxuICAgICAgICAgICAgdG9wOiBjc3NUb3AsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBnZXRBY3Rpb24oZm5OYW1lLCBhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbZm5OYW1lXS5iaW5kKHRoaXMsIGFyZylcbiAgICB9XG5cbiAgICBtb3ZlKGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy51cGRhdGVHcmlkSW5kaWNlcyh0aGlzLmdldENoYXJhY3RlcigpLCBESVJFQ1RJT05TW2RpcmVjdGlvbl0pXG4gICAgICAgIHRoaXMucHJpbnRMb2NhbFN0YXR1cygpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgfVxuXG4gICAgcHJpbnRMb2NhbFN0YXR1cygpIHtcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLmxvY2F0aW9uKVxuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG4gICAgICAgIGlmIChsb2NhbEl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnZGlzcGxheS1pdGVtJywgbG9jYWxJdGVtLm5hbWUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbEl0ZW0oKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIGxldCBsb2NhbEl0ZW0gPSBudWxsXG4gICAgICAgIHRoaXMubWFwLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNoYXIueCAmJiBpdGVtLnkgPT09IGNoYXIueSkge1xuICAgICAgICAgICAgICAgIGxvY2FsSXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIH19KVxuICAgICAgICByZXR1cm4gbG9jYWxJdGVtXG4gICAgfVxuXG5cbiAgICB0YWtlKCkge1xuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG4gICAgICAgIGlmIChsb2NhbEl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaChgJHtsb2NhbEl0ZW0ubmFtZX0tJHtsb2NhbEl0ZW0uaWRlbnRpdHlOdW1iZXJ9IHRha2VuYClcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgYCR7bG9jYWxJdGVtLm5hbWV9IHRha2VuYClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ3RoZXJlIGlzIG5vdGhpbmcgaGVyZSB3b3J0aCB0YWtpbmcnKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBjaGVja0ludmVudG9yeSgpIHtcbiAgICAgICAgY29uc3QgY2FycnlpbmcgPSB0aGlzLmludmVudG9yeS5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpLmpvaW4oJyB8ICcpXG4gICAgICAgIGNvbnN0IHRleHQgPSBgeW91IGFyZSBjYXJyeWluZzogJHtjYXJyeWluZ31gXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgdGV4dClcbiAgICB9XG5cblxuICAgIG1pbmUoKSB7XG4gICAgICAgIC8vIGxldCBtaW5lciA9IGZhbHNlXG4gICAgICAgIC8vIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIC8vIGNvbnN0IGxvY2F0aW9uID0gW2NoYXIueCwgY2hhci55XVxuXG4gICAgICAgIC8vIHRoaXMuaW52ZW50b3J5LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIC8vICAgICBpZiAoaXRlbS5uYW1lID09PSAncGFydGljbGUgbWluZXInKSB7XG4gICAgICAgIC8vICAgICAgICAgbWluZXIgPSBpdGVtXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0pXG5cbiAgICAgICAgLy8gaWYgKG1pbmVyKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnbWluZXInLCBtaW5lcilcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd0aGlzLm1hcC5tYXAnLCB0aGlzLm1hcC5tYXApXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnbG9jYXRpb24nLCBsb2NhdGlvbilcblxuICAgICAgICAvLyAgICAgbWluZXIuc2V0T25NYXAodGhpcy5tYXAubWFwLCBsb2NhdGlvbilcbiAgICAgICAgLy8gICAgIHRoaXMuRU0ucHVibGlzaCgncmVtb3ZlLWludmVudG9yeScsIG1pbmVyKVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAneW91IGRvIG5vdCBoYXZlIGFueSBwYXJ0aWNsZSBtaW5lcnMnKVxuICAgICAgICAvLyB9XG5cbiAgICB9XG5cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiY29uc3QgRElSRUNUSU9OUyA9IHtcbiAgICBub3J0aDogeyB4OiAwLCB5OiAtMSB9LFxuICAgIHNvdXRoOiB7IHg6IDAsIHk6IDEgfSxcbiAgICBlYXN0OiB7IHg6IDEsIHk6IDAgfSxcbiAgICB3ZXN0OiB7IHg6IC0xLCB5OiAwIH0sXG4gICAgbm9ydGh3ZXN0OiB7IHg6IC0xLCB5OiAtMSB9LFxuICAgIG5vcnRoZWFzdDogeyB4OiAxLCB5OiAtMSB9LFxuICAgIHNvdXRoZWFzdDogeyB4OiAxLCB5OiAxIH0sXG4gICAgc291dGh3ZXN0OiB7IHg6IC0xLCB5OiAxIH1cbn1cblxuXG5leHBvcnQgeyBESVJFQ1RJT05TIH1cbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICcuL01vdmVhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuXG5jb25zdCBJVEVNUyA9IHtcbiAgICBtaW5lcjoge1xuICAgICAgICBuYW1lOiAncGFydGljbGUgbWluZXInLFxuICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgIGVsZW1lbnQ6ICd8JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdtaW5lcywgZGl2aWRlcywgYW5kIHN0b3JlcyBhbWJpZW50IGNoZW1pY2FsIGVsZW1lbnRzIGFuZCBsYXJnZXIgY29tcG91bmRzIGZvdW5kIHdpdGhpbiBhIDEwMCBtZXRlciByYWRpdXMuIDk3JSBhY2N1cmFjeSByYXRlLicsXG4gICAgICAgIGRpdjogJ2l0ZW0tbWluZXInXG4gICAgfS8vLFxuICAgIC8vIHBhcnNlcjoge1xuICAgIC8vICAgICBuYW1lOiAnbm9pc2UgcGFyc2VyJyxcbiAgICAvLyAgICAgdHlwZTogJ2l0ZW0nLFxuICAgIC8vICAgICBlbGVtZW50OiAnPycsXG4gICAgLy8gICAgIGRlc2NyaXB0aW9uOiAncHJvdG90eXBlLiBwYXJzZXMgYXRtb3NwaGVyaWMgZGF0YSBmb3IgbGF0ZW50IGluZm9ybWF0aW9uLiBzaWduYWwtdG8tbm9pc2UgcmF0aW8gbm90IGd1YXJhbnRlZWQuJyxcbiAgICAvLyAgICAgZGl2OiAnaXRlbS1wYXJzZXInXG4gICAgLy8gfSxcbiAgICAvLyBpbnRlcmZhY2U6IHtcbiAgICAvLyAgICAgbmFtZTogJ3BzaW9uaWMgaW50ZXJmYWNlJyxcbiAgICAvLyAgICAgdHlwZTogJ2l0ZW0nLFxuICAgIC8vICAgICBlbGVtZW50OiAnJicsXG4gICAgLy8gICAgIGRlc2NyaXB0aW9uOiBgY29ubmVjdHMgc2VhbWxlc3NseSB0byBhIHN0YW5kYXJkLWlzc3VlIGJpb3BvcnQuIGZhY2lsaXRhdGVzIHN1bmRyeSBpbnRlcmFjdGlvbnMgcGVyZm9ybWVkIHZpYSBQU0ktTkVULmAsXG4gICAgLy8gICAgIGRpdjogJ2l0ZW0taW50ZXJmYWNlJ1xuICAgIC8vIH0sXG4gICAgLy8gcHJpbnRlcjoge1xuICAgIC8vICAgICBuYW1lOiAnbW9sZWN1bGFyIHByaW50ZXInLFxuICAgIC8vICAgICB0eXBlOiAnaXRlbScsXG4gICAgLy8gICAgIGVsZW1lbnQ6ICcjJyxcbiAgICAvLyAgICAgZGVzY3JpcHRpb246ICdnZW5lcmF0ZXMgb2JqZWN0cyBhY2NvcmRpbmcgdG8gYSBibHVlcHJpbnQuIG1vbGVjdWxlcyBub3QgaW5jbHVkZWQuJyxcbiAgICAvLyAgICAgZGl2OiAnaXRlbS1wcmludGVyJ1xuICAgIC8vIH1cbn1cblxuY2xhc3MgSXRlbSBleHRlbmRzIE1vdmVhYmxlIHtcbiAgICBzdGF0aWMgZ2V0UmFuZG9tSXRlbUNvbmZpZygpIHtcbiAgICAgICAgY29uc3QgYWxsSXRlbXMgPSBPYmplY3QudmFsdWVzKElURU1TKVxuICAgICAgICByZXR1cm4gYWxsSXRlbXNbVXRpbGl0eS5yYW5kb21pemUoYWxsSXRlbXMubGVuZ3RoKV1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9tKCkge1xuICAgICAgICByZXR1cm4gbmV3IEl0ZW0oSXRlbS5nZXRSYW5kb21JdGVtQ29uZmlnKCkpXG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlKG51bWJlcikge1xuICAgICAgICBjb25zdCBpdGVtcyA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspIHtcbiAgICAgICAgICAgIGl0ZW1zLnB1c2goSXRlbS5yYW5kb20oKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtc1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGl0ZW1Db25maWcpIHtcbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIC8vIG1lcmdlIGluIGNvbmZpZyBwcm9wZXJ0aWVzXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IE9iamVjdC5hc3NpZ24odGhpcywgaXRlbUNvbmZpZylcblxuICAgICAgICAvLyBhZGRpdGlvbmFsIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5pZGVudGl0eU51bWJlciA9IFV0aWxpdHkuSWQoKVxuICAgICAgICB0aGlzLnR5cGUgPSAnaXRlbSdcbiAgICAgICAgdGhpcy5vZmZNYXAgPSBmYWxzZVxuICAgICAgICAvLyB0aGlzLmluSW52ZW50b3J5ID0gZmFsc2VcblxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke3RoaXMubmFtZX0tJHt0aGlzLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMub25UYWtlLCB0aGlzLCB0cnVlKVxuICAgIH1cblxuICAgIHNldE9uTWFwKG1hcCwgbG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXRNYXAobWFwKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyhsb2NhdGlvbilcbiAgICAgICAgdGhpcy5zZXRDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMuc2V0R3JpZEluZGljZXMoKVxuICAgICAgICB0aGlzLnNldERpdih0aGlzLmdldElkKCkpXG4gICAgICAgIHRoaXMudXBkYXRlRGl2KHRoaXMpXG5cbiAgICAgICAgdGhpcy5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJylcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHlOdW1iZXJcbiAgICB9XG5cbiAgICBzZXRDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLmxlZnQgPSBjc3NMZWZ0XG4gICAgICAgIHRoaXMudG9wID0gY3NzVG9wXG4gICAgfVxuXG4gICAgc2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG5cbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgfVxuXG4gICAgc2V0RGl2KGlkZW50aXR5TnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZGl2ID0gdGhpcy5kaXYgKyBpZGVudGl0eU51bWJlclxuICAgIH1cblxuXG4gICAgLy8gc3BlY2lmaWMgdG8gaXRlbSBkcmF3aW5nOiB1c2Ugb3V0ZXJIVE1MXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXllcklkKVxuICAgICAgICBlbC5vdXRlckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cbiAgICBvblRha2UoKSB7XG4gICAgICAgIHRoaXMueCA9IG51bGxcbiAgICAgICAgdGhpcy55ID0gbnVsbFxuICAgICAgICB0aGlzLm9mZk1hcCA9IHRydWUgLy8gY2hhbmdlcyBjc3MgZGlzcGxheSB0byAnbm9uZSdcblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1pbnZlbnRvcnknLCB0aGlzKVxuICAgICAgICAvLyB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMub25Ecm9wLCB0aGlzKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuICAgIH1cblxuICAgIG9uRHJvcCgpIHtcbiAgICAvLyAgICAgdGhpcy54ID0gYXJncy54XG4gICAgLy8gICAgIHRoaXMueSA9IGFyZ3MueVxuXG5cbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMsIHRydWUpXG4gICAgLy8gICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcywgdGhpcy5kaXYpXG5cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSXRlbVxuIiwiY2xhc3MgTGFuZHNjYXBlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB0aGlzLmZlYXR1cmVzKClcbiAgICAgICAgdGhpcy5iYXJlID0gdGhpcy5iYXJlKClcbiAgICB9XG5cbiAgICBmZWF0dXJlcygpIHtcbiAgICAgICAgY29uc3QgcGVyaW9kID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0aGUgYWlyIGlzIGNob2tlZCB3aXRoIGR1c3QsIHN0YXRpYywgd2lmaScsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjUsXG4gICAgICAgICAgICBjbHM6ICdwZXJpb2QnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tbWEgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnLCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3NwcmF3bCBvZiBzbWFydCBob21lcywgY3VsLWRlLXNhY3MsIGxhbmV3YXlzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNixcbiAgICAgICAgICAgIGNsczogJ2NvbW1hJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JhdmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnXicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2Egc2hpbW1lcmluZyBmaWVsZCBvZiBzb2xhciBwYW5lbHMsIGJyb2tlbiBhbmQgY29ycm9kZWQnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDIyLFxuICAgICAgICAgICAgY2xzOiAnZ3JhdmUnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXN0ZXJpc2sgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnKicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2hvbGxvdyB1c2VycyBqYWNrIGluIGF0IHRoZSBkYXRhaHVicycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjAsXG4gICAgICAgICAgICBjbHM6ICdhc3RlcmlzaydcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3BlcmlvZCwgY29tbWEsIHNlbWljb2xvbiwgc2VtaWNvbG9uLCBhc3RlcmlzaywgYXN0ZXJpc2ssIGdyYXZlLCBncmF2ZV1cbiAgICB9XG5cbiAgICBiYXJlKCkge1xuICAgICAgICBjb25zdCBiYXJlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJyZuYnNwOycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2NvbmNyZXRlIGFuZCB0d2lzdGVkIHJlYmFyIHN0cmV0Y2ggdG8gdGhlIGhvcml6b24nLFxuICAgICAgICAgICAgY2xzOiAnYmxhbmsnXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhcmVcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExhbmRzY2FwZURhdGFcbiIsImltcG9ydCBNYXBHZW5lcmF0b3IgZnJvbSAnLi9NYXBHZW5lcmF0b3InXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5cbmNsYXNzIE1hcCB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRNYXAgPSBuZXcgTWFwR2VuZXJhdG9yKGNvbCwgcm93KVxuICAgICAgICB0aGlzLm1hcCA9IHRoaXMuZ2VuZXJhdGVkTWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcCA9IFtdXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcFxuICAgIH1cblxuICAgIGdldE1hcENlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHRoaXMuY29sLzIpLCBNYXRoLmZsb29yKHRoaXMucm93LzIpXVxuICAgIH1cblxuICAgIGdldFJhbmRvbU1hcExvY2F0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1V0aWxpdHkucmFuZG9taXplKHRoaXMucm93IC0gMSksIFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSldXG4gICAgfVxuXG4gICAgc2V0Q2hhcmFjdGVyKGNoYXJhY3Rlcikge1xuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IGNoYXJhY3RlclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5zZXRNYXAodGhpcy5tYXApXG4gICAgfVxuXG4gICAgc2V0SXRlbXMoaXRlbXMpIHtcbiAgICAgICAgaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tTWFwTG9jYXRpb24gPSB0aGlzLmdldFJhbmRvbU1hcExvY2F0aW9uKClcbiAgICAgICAgICAgIGl0ZW0uc2V0T25NYXAodGhpcy5tYXAsIHJhbmRvbU1hcExvY2F0aW9uKVxuICAgICAgICAgICAgdGhpcy5wdXNoSXRlbShpdGVtKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1c2hJdGVtKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwLnB1c2goaXRlbSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcFxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IExhbmRzY2FwZURhdGEgZnJvbSAnLi9MYW5kc2NhcGVEYXRhJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuXG5cbmNsYXNzIE1hcEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYXRpbmcgbWFwJylcbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVEYXRhKClcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuaW5pdChjb2wsIHJvdylcbiAgICAgICAgY29uc3Qgc2VlZGVkR3JpZCA9IHRoaXMuc2VlZChncmlkKVxuICAgICAgICB0aGlzLnNlZWRlZEdyaWQgPSBzZWVkZWRHcmlkXG4gICAgICAgIHRoaXMuZ3JvdygpXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgZ2VuZXJhdGVkJylcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlZWRlZEdyaWRcbiAgICB9XG5cbiAgICBpbml0KGNvbCwgcm93KSB7XG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG4gICAgICAgIGNvbnN0IGdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdzsgaSsrKSB7XG4gICAgICAgICAgICBncmlkW2ldID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBncmlkW2ldLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgc2VlZChncmlkKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldE51bWJlck9mRWxlbWVudFNlZWRzKCk7IGkrKykge1xuICAgICAgICAgICAgcmFuZG9tRWxlbWVudHMucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXMubGVuZ3RoKV0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VlZHMgPSB0aGlzLmdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cylcbiAgICAgICAgc2VlZHMubWFwKHNlZWQgPT4gZ3JpZFtzZWVkLnldW3NlZWQueF0gPSBzZWVkKVxuICAgICAgICB0aGlzLl9zZWVkcyA9IHNlZWRzXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKSB7XG4gICAgICAgIC8vICByZXR1cm4gMSAgICAgICAgLy8gdGVzdCBzZXR0aW5nXG4gICAgICAgIC8vIHJldHVybiAoKHRoaXMuY29sICogdGhpcy5yb3cpIC8gKHRoaXMuX2NvbCArIHRoaXMucm93KSkgIC8vIHNwYXJzZSBpbml0aWFsIHNlZWRpbmdcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBzZWVkcyA9IHRoaXMuX3NlZWRzXG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdvb2RTZWVkcyA9IFtdXG4gICAgICAgICAgICB0aGlzLmdvb2RTZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5mb3JFYWNoKChzZWVkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2RTZWVkcy5wdXNoKHRoaXMuY2hlY2tTZWVkKHNlZWQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBmb3IgKGxldCBnb29kU2VlZCBvZiBnb29kU2VlZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID09PSB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuY291bnRVbnNlZWRlZExvY2F0aW9ucygpKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5zZWVkZWRHcmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBsZXQgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgaWYgKChzZWVkLnggPCB0aGlzLmNvbCAmJiBzZWVkLnggPj0gMCkgJiZcbiAgICAgICAgICAgIChzZWVkLnkgPCB0aGlzLnJvdyAmJiBzZWVkLnkgPj0gMCkpIHtcbiAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFtzZWVkLnldW3NlZWQueF0gIT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKChzZWVkLnggPT09IGdvb2RTZWVkLngpICYmXG4gICAgICAgICAgICAgICAgKHNlZWQueSA9PT0gZ29vZFNlZWQueSkpIHtcbiAgICAgICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzZWVkU3VjY2VlZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykge1xuICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICBzZWVkcy5mb3JFYWNoKChvcmlnaW5hbFNlZWQpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmFiaWxpdHkobmV4dEdlblNlZWQucHJvYmFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkaXJlY3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueCA9IG9yaWdpbmFsU2VlZC54ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnkgPSBvcmlnaW5hbFNlZWQueSArIGRpcmVjdGlvblZhbHVlc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG4gICAgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE1hcChtYXApIHtcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXBcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgfVxuXG4gICAgZ2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdyaWRJbmRpY2VzWzBdXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdyaWRJbmRpY2VzWzFdXG5cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBcInlvdSd2ZSByZWFjaGVkIHRoZSBtYXAncyBlZGdlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uXG4gICAgfVxuXG4gICAgY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykge1xuICAgICAgICBsZXQgbG9jYXRpb25PbkdyaWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHggPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICBjb25zdCB5ID0gbmV3R3JpZEluZGljZXNbMF1cblxuICAgICAgICBpZiAodGhpcy5nb3RNYXBbeF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbeF1beV1cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uT25HcmlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uT25HcmlkXG4gICAgfVxuXG4gICAgZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXQnKVxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgICBjb25zdCB3aWR0aCA9IFV0aWxpdHkuc3RyaW5nVG9OdW1iZXIoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSlcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSlcbiAgICAgICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9XG4gICAgfVxuXG4gICAgZ2V0Q1NTQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGNzcyA9IHRoaXMuZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKVxuICAgICAgICBjb25zdCBjc3NMZWZ0ID0gdGhpcy5ncmlkSW5kaWNlc1swXSAqIGNzcy5oZWlnaHRcbiAgICAgICAgY29uc3QgY3NzVG9wID0gdGhpcy5ncmlkSW5kaWNlc1sxXSAqIGNzcy53aWR0aFxuICAgICAgICByZXR1cm4geyBjc3NMZWZ0LCBjc3NUb3AgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBNb3ZlYWJsZVxuIiwiY2xhc3MgUmVuZGVyYWJsZSB7ICAvLyBnZW5lcmFsaXplZCByZW5kZXIgZnVuY3Rpb25zIGZvciBTY2VuZXJ5LCBDaGFyYWN0ZXJcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRMYXllcihsYXllcikge1xuICAgICAgICB0aGlzLmxheWVyID0gbGF5ZXJcbiAgICB9XG5cbiAgICBnZXRMYXllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJcbiAgICB9XG5cbiAgICByZW5kZXJTcGFuKHVuaXQpIHtcbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdC50b3AgJiYgdW5pdC5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7dW5pdC50b3B9cHg7IGxlZnQ6ICR7dW5pdC5sZWZ0fXB4YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ1bml0ICR7Y2xzfVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9zcGFuPmBcbiAgICB9XG5cbiAgICByZW5kZXJEaXYoaXRlbSkge1xuICAgICAgICBsZXQgZGl2ID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgZGl2ID0gaXRlbS5kaXZcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpdGVtLmVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS50b3AgJiYgaXRlbS5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7aXRlbS50b3B9cHg7IGxlZnQ6ICR7aXRlbS5sZWZ0fXB4OyBwb3NpdGlvbjogYWJzb2x1dGVgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ub2ZmTWFwKSB7XG4gICAgICAgICAgICBzdHlsZSArPSBgOyBkaXNwbGF5OiBub25lYFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgPGRpdiBpZD1cIiR7ZGl2fVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9kaXY+YFxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2FjdG9yJykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTcGFuKHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlbmRlciBhY3RvcicpXG4gICAgICAgIH0gZWxzZSBpZiAodW5pdC50eXBlID09PSAnaXRlbScpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGl2KHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jld3JpdGUgeXIgcmVuZGVyTGF5ZXIgY29kZSBsb2wnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlU3BhbihhY3Rvcikge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyU3BhbihhY3RvcikpXG4gICAgfVxuXG4gICAgdXBkYXRlRGl2KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlckRpdihpdGVtKSlcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICAvLyBlbC5vdXRlckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cblxuXG4gICAgY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudChwYXJlbnRMYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50TGF5ZXJJZClcbiAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSAvLyBjcmVhdGVzIGRpdiBpZCB3aXRoaW4gZW5jbG9zaW5nIGRpdiAuLi5cbiAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlcmFibGVcbiIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4vUmVuZGVyYWJsZSdcblxuXG5jbGFzcyBTY2VuZXJ5IGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBTY2VuZXJ5LXNwZWNpZmljIHJlbmRlcmluZyBmdW5jdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLmdvdE1hcCA9IG1hcC5nZXRNYXAoKVxuICAgICAgICB0aGlzLnJlbmRlckdyaWRMYXllcigpXG4gICAgICAgIGNvbnNvbGUubG9nKCdzY2VuZXJ5IHJlbmRlcmVkJylcbiAgICB9XG5cbiAgICByZW5kZXJHcmlkTGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLmdvdE1hcC5tYXAoYXJyID0+IHsgcmV0dXJuIGFyci5zbGljZSgpIH0pXG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5jcmVhdGVHcmlkTGF5ZXIoZ3JpZCkpXG4gICAgICAgIHRoaXMuZHJhd0dyaWRMYXllcigpXG4gICAgfVxuXG4gICAgY3JlYXRlR3JpZExheWVyKGdyaWQpIHtcbiAgICAgICAgY29uc3Qgc2NlbmVyeUdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0l0ZW1zID0gZ3JpZFtpXVxuICAgICAgICAgICAgbGV0IHJvdyA9ICcnICAvLyBwb3NzaWJseSBtYWtlIGVhY2ggcm93IGEgdGFibGU/XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm93ICs9IHRoaXMucmVuZGVyU3Bhbihyb3dJdGVtc1tpXSkgLy8gYWRkIHJlbmRlcmVkIGl0ZW1zIHRvIHRoZSBncmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzY2VuZXJ5R3JpZC5wdXNoKHJvdylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2NlbmVyeUdyaWRcbiAgICB9XG5cbiAgICBkcmF3R3JpZExheWVyKCkge1xuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBjb25zdCBncmlkVG9IVE1MID0gbGF5ZXIuam9pbignPGJyIC8+JykgIC8vIHVzaW5nIEhUTUwgYnJlYWtzIGZvciBub3dcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZHNjYXBlLWxheWVyJylcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gZ3JpZFRvSFRNTFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTY2VuZXJ5XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLnVwZGF0ZSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktaXRlbScsIHRoaXMuZGlzcGxheUl0ZW0sIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdzdGF0dXMnLCB0aGlzLmRlZmF1bHQsIHRoaXMpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGJlZ2luc1dpdGhWb3dlbCh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TGV0dGVyID0gdGV4dFswXVxuICAgICAgICBjb25zdCB2b3dlbHMgPSBbJ2EnLCAnZScsICdpJywgJ28nLCAndSddXG4gICAgICAgIGxldCBiZWdpbnNXaXRoVm93ZWwgPSBmYWxzZVxuICAgICAgICB2b3dlbHMuZm9yRWFjaCh2b3dlbCA9PiB7XG4gICAgICAgICAgICBpZiAoZmlyc3RMZXR0ZXIgPT09IHZvd2VsKSB7XG4gICAgICAgICAgICAgICAgYmVnaW5zV2l0aFZvd2VsID0gdHJ1ZVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBiZWdpbnNXaXRoVm93ZWxcbiAgICB9XG5cbiAgICBkaXNwbGF5SXRlbShpdGVtTmFtZSkge1xuICAgICAgICBjb25zdCBiZWdpbnNXaXRoVm93ZWwgPSB0aGlzLmJlZ2luc1dpdGhWb3dlbChpdGVtTmFtZSlcbiAgICAgICAgbGV0IHRleHQgPSAnJ1xuICAgICAgICBpZiAoYmVnaW5zV2l0aFZvd2VsKSB7XG4gICAgICAgICAgICB0ZXh0ID0gYHlvdSBzZWUgYW4gJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhICR7aXRlbU5hbWV9IGhlcmVgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXQodGV4dCwgMTApXG4gICAgfVxuXG4gICAgZGVmYXVsdChyZXNwb25zZSkge1xuICAgICAgICB0aGlzLnNldChyZXNwb25zZSwgMTApXG4gICAgfVxuXG4gICAgc2V0KGRlc2NyaXB0aW9uLCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKS5pbm5lckhUTUwgPSBkZXNjcmlwdGlvblxuICAgICAgICB9LCBkZWxheSlcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU3RhdHVzXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5cblxuY2xhc3MgVXNlcklucHV0IHtcbiAgICBjb25zdHJ1Y3RvcihrZXlBY3Rpb25NYXApIHtcbiAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXAgPSBrZXlBY3Rpb25NYXBcblxuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSB0aGlzLnRyeUFjdGlvbkZvckV2ZW50LmJpbmQodGhpcylcbiAgICB9XG5cbiAgICB0cnlBY3Rpb25Gb3JFdmVudChldmVudCkge1xuICAgICAgICBpZiAoIVV0aWxpdHkuY29udGFpbnModGhpcy5rZXlBY3Rpb25NYXAsIGV2ZW50LmtleUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgbm90IGEgdmFsaWQga2V5Y29kZTogJHtldmVudC5rZXlDb2RlfWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmtleUFjdGlvbk1hcFtldmVudC5rZXlDb2RlXSgpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXNlcklucHV0XG4iLCJsZXQgaWQgPSAwXG5cbmZ1bmN0aW9uIGdlbmVyYXRlSWQoKSB7XG4gICAgaWQgPSBpZCArIDFcbiAgICByZXR1cm4gaWRcbn1cblxuY2xhc3MgVXRpbGl0eSB7XG4gICAgc3RhdGljIGNvbnRhaW5zKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuaW5kZXhPZihTdHJpbmcocHJvcGVydHkpKSAhPT0gLTFcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RyaW5nVG9OdW1iZXIoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcubWF0Y2goL1xcZCsvKVswXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb21pemUobXVsdCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXVsdClcbiAgICB9XG5cbiAgICBzdGF0aWMgSWQoKSB7XG4gICAgICAgIHJldHVybiBnZW5lcmF0ZUlkKClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eVxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudHNMaXN0ID0gW10gICAgICAgIC8vIGNyZWF0ZSBhcnJheSBvZiBldmVudHNcbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoZXZlbnQsIGZuLCB0aGlzVmFsdWUsIG9uY2U9ZmFsc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7ICAgLy8gaWYgbm8gdGhpc1ZhbHVlIHByb3ZpZGVkLCBiaW5kcyB0aGUgZm4gdG8gdGhlIGZuPz9cbiAgICAgICAgICAgIHRoaXNWYWx1ZSA9IGZuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ldmVudHNMaXN0LnB1c2goeyAgICAgIC8vIGNyZWF0ZSBvYmplY3RzIGxpbmtpbmcgZXZlbnRzICsgZnVuY3Rpb25zIHRvIHBlcmZvcm1cbiAgICAgICAgICAgIGV2ZW50OiBldmVudCwgICAgICAgICAgIC8vIHB1c2ggZW0gdG8gdGhlIGFycmF5XG4gICAgICAgICAgICBmbjogZm4sXG4gICAgICAgICAgICBvbmNlOiBvbmNlLFxuICAgICAgICAgICAgdGhpc1ZhbHVlOiB0aGlzVmFsdWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyB1bnN1YnNjcmliZShldmVudCkge1xuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgLy8gICAgICAgICAgICAgYnJlYWtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIHB1Ymxpc2goZXZlbnQsIGFyZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRoaXNWYWx1ZSwgZm4sIG9uY2UgfSA9IHRoaXMuZXZlbnRzTGlzdFtpXVxuICAgICAgICAgICAgICAgIGZuLmNhbGwodGhpc1ZhbHVlLCBhcmcpXG4gICAgICAgICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNMaXN0LnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEV2ZW50c0xpc3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50c0xpc3RcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50TWFuYWdlcigpXG4iLCJpbXBvcnQgTWFwIGZyb20gJy4vTWFwJ1xuaW1wb3J0IFNjZW5lcnkgZnJvbSAnLi9TY2VuZXJ5J1xuaW1wb3J0IENoYXJhY3RlciBmcm9tICcuL0NoYXJhY3RlcidcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4vU3RhdHVzJ1xuaW1wb3J0IFVzZXJJbnB1dCBmcm9tICcuL1VzZXJJbnB1dCdcbmltcG9ydCBCbHVlcHJpbnRzIGZyb20gJy4vQmx1ZXByaW50cydcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5pbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nXG5cblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdEdhbWUoKSB7XG4gICAgICAgIC8vIHRoaXMuc3BhY2VzID0gW11cbiAgICAgICAgLy8gdGhpcy5nYW1lT3ZlciA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5zdGF0dXMgPSBuZXcgU3RhdHVzKClcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcCg2MCwgNjApXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gSXRlbS5nZW5lcmF0ZSg1KVxuXG4gICAgICAgIHRoaXMuc2NlbmVyeSA9IG5ldyBTY2VuZXJ5KG1hcClcblxuICAgICAgICBtYXAuc2V0SXRlbXMoaXRlbXMpXG5cbiAgICAgICAgY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihtYXApXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG5cbiAgICAgICAgbWFwLnNldENoYXJhY3RlcihjaGFyYWN0ZXIpXG4gICAgICAgIC8vIGNoYXJhY3Rlci5zdWJzY3JpYmVJdGVtc1RvTWFwKCkgIC8vIG5vdCBjdXJyZW50bHkgbmVjZXNzYXJ5XG5cbiAgICAgICAgdGhpcy5ibHVlcHJpbnQgPSBCbHVlcHJpbnRzLnJhbmRvbSgpXG5cbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnlcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkuYWRkKHRoaXMuYmx1ZXByaW50KVxuXG4gICAgICAgIHRoaXMuaW5wdXQgPSB0aGlzLmluaXRVc2VySW5wdXQoY2hhcmFjdGVyKVxuICAgIH1cblxuICAgIGluaXRVc2VySW5wdXQoY2hhcmFjdGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgVXNlcklucHV0KHtcbiAgICAgICAgICAgICczOCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnbm9ydGgnKSxcbiAgICAgICAgICAgICczNyc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnd2VzdCcpLFxuICAgICAgICAgICAgJzM5JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdlYXN0JyksXG4gICAgICAgICAgICAnNDAnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3NvdXRoJyksXG4gICAgICAgICAgICAnODQnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCd0YWtlJyksIC8vICh0KWFrZSBpdGVtXG4gICAgICAgICAgICAnNzMnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdjaGVja0ludmVudG9yeScpLCAvLyBjaGVjayAoaSludmVudG9yeVxuICAgICAgICAgICAgJzc3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbWluZScpIC8vIGRlcGxveSBwYXJ0aWNsZSAobSlpbmVyXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoJ3lvdSB3YWtlIHVwJylcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KGB5b3UgYXJlIGNhcnJ5aW5nICR7dGhpcy5ibHVlcHJpbnQubmFtZX1gLCA0MDAwKVxuICAgIH1cblxuICAgIC8vIGdhbWVJc092ZXIoKSB7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmdhbWVPdmVyXG4gICAgLy8gfVxuXG4gICAgLy8gZXhwbG9yZSgpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coYGV4cGxvcmluZyB0aGUgJHt0aGlzLmtpbmR9IHpvbmUhYClcbiAgICAvLyB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEdhbWUoKTtcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIEludmVudG9yeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMgPSBbXVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtaW52ZW50b3J5JywgdGhpcy5hZGQsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdyZW1vdmUtaW52ZW50b3J5JywgdGhpcy5yZW1vdmUsIHRoaXMpXG4gICAgfVxuXG4gICAgYWRkKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5jb250ZW50cy5wdXNoKGl0ZW0pXG4gICAgfVxuXG5cblxuLy8gdW50ZXN0ZWRcblxuICAgIHJlbW92ZShpdGVtKSB7XG4gICAgICAgIGNvbnN0IHRoZUl0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMuY29udGVudHMuZm9yRWFjaCgoaXRlbSwgaSwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gdGhlSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudHMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtIG5vdCBpbiBpbnZlbnRvcnknKVxuICAgICAgICAgICAgfX0pXG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEludmVudG9yeVxuIl19
