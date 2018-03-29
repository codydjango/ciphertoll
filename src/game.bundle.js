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
        key: 'renderLayer',
        value: function renderLayer(unit, layerId) {
            if (unit.type === 'actor') {
                this.updateSpan(unit);
                this.drawLayer(layerId);
            }
        }
    }, {
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
                if (localItem.mining) {
                    this.EM.publish('status', 'a miner pulls compounds from the region');
                } else {
                    this.EM.publish('display-item', localItem.name);
                }
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
        key: 'findInventoryItem',
        value: function findInventoryItem(itemName) {
            var foundItem = null;
            this.inventory.forEach(function (item) {
                if (item.name === itemName) {
                    foundItem = item;
                }
            });
            return foundItem;
        }
    }, {
        key: 'mine',
        value: function mine() {

            var char = this.getCharacter();
            var miner = this.findInventoryItem('particle miner');
            var location = [char.x, char.y];

            if (miner) {
                miner.offMap = false;
                miner.mining = true;
                miner.setOnMap(this.map.map, location);
                miner.drawLayer(miner.div);
                this.EM.publish('remove-inventory', miner);
            } else {

                this.EM.publish('status', 'you do not have any particle miners');
            }
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
        _this.EM.subscribe(_this.name + '-' + _this.identityNumber + ' taken', _this.onTake, _this);
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

            // moved this out so we are not creating children each time we want to place on map
            // this.createInitialChildElement('item-layer')
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
            if (!this.divSet) {
                this.div = this.div + identityNumber;
            }
            this.divSet = true;
        }

        // specific to item drawing: use outerHTML

    }, {
        key: 'drawLayer',
        value: function drawLayer(layerId) {
            console.log('layerId', layerId);
            var el = document.getElementById(layerId);
            console.log('el in drawLayer', el);
            el.outerHTML = this.getLayer();
        }
    }, {
        key: 'renderLayer',
        value: function renderLayer(unit, layerId) {
            if (unit.type === 'item') {
                this.updateDiv(unit);
                this.drawLayer(layerId);
            }
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
                item.createInitialChildElement('item-layer'); // moved childElement creation out of 'setOnMap'
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
            if (item.mining) {
                style += '; animation-name: mining; animation-duration: 4s; animation-iteration-count: infinite';
            }
            return '<div id="' + div + '" style="' + style + '">' + element + '</div>';
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
        _this.renderLayer();
        console.log('scenery rendered');
        return _this;
    }

    _createClass(Scenery, [{
        key: 'renderLayer',
        value: function renderLayer() {
            var grid = this.gotMap.map(function (arr) {
                return arr.slice();
            });
            this.setLayer(this.createLayer(grid));
            this.drawLayer();
        }
    }, {
        key: 'createLayer',
        value: function createLayer(grid) {
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
        key: 'drawLayer',
        value: function drawLayer() {
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
        value: function _default(text) {
            this.set(text, 10);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0l0ZW0uanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsT0FBTyxJQUFQOzs7Ozs7Ozs7OztBQ0ZBOzs7Ozs7OztBQUdBLElBQU0sZ0JBQWdCO0FBQ2xCLHNCQUFrQjtBQUNkLGNBQU0sK0JBRFE7QUFFZCxxQkFBYSxFQUZDO0FBR2QsbUJBQVcsRUFIRztBQUlkLHNCQUFjO0FBSkEsS0FEQTtBQU9sQixvQkFBZ0I7QUFDWixjQUFNLDZCQURNO0FBRVoscUJBQWEsRUFGRDtBQUdaLG1CQUFXLEVBSEM7QUFJWixzQkFBYztBQUpGLEtBUEU7QUFhbEIsbUJBQWU7QUFDWCxjQUFNLDRCQURLO0FBRVgscUJBQWEsRUFGRjtBQUdYLG1CQUFXLEVBSEE7QUFJWCxzQkFBYztBQUpIO0FBYkcsQ0FBdEI7O0lBc0JNLFM7QUFDRix1QkFBWSxJQUFaLEVBQWtCLFdBQWxCLEVBQStCO0FBQUE7O0FBQzNCLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFLLFdBQUwsR0FBbUIsV0FBbkI7QUFDSDs7OztpQ0FFZTtBQUNaLGdCQUFNLGtCQUFrQixP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LENBQVEsU0FBUixDQUFrQixrQkFBbEIsRUFBc0MsS0FBSyxNQUEzQyxFQUFtRCxJQUFuRDtBQUNIOzs7OzRCQUVHLEksRUFBTTtBQUNOLGlCQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CO0FBQ0g7O0FBSUw7Ozs7K0JBRVcsSSxFQUFNO0FBQUE7O0FBQ1QsZ0JBQU0sVUFBVSxJQUFoQjtBQUNBLGlCQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFVBQUMsSUFBRCxFQUFPLENBQVAsRUFBVSxLQUFWLEVBQW9CO0FBQ3RDLG9CQUFJLE1BQU0sQ0FBTixNQUFhLE9BQWpCLEVBQTBCO0FBQ3RCLDBCQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLENBQXJCLEVBQXdCLENBQXhCO0FBQ0o7QUFDSTtBQUNIO0FBQUMsYUFMTjtBQU9IOzs7Ozs7a0JBSVUsSUFBSSxTQUFKLEUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBnYW1lIGZyb20gJy4vanMvZ2FtZSdcblxud2luZG93LmdhbWUgPSBnYW1lXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5cblxuY29uc3QgYmx1ZXByaW50RGF0YSA9IHtcbiAgICBhcnRpZmljaWFsTXVzY2xlOiB7XG4gICAgICAgIG5hbWU6ICdhcnRpZmljaWFsIG11c2NsZSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH0sXG4gICAgcmV0aW5hbERpc3BsYXk6IHtcbiAgICAgICAgbmFtZTogJ3JldGluYWwgZGlzcGxheSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH0sXG4gICAgcHJvc3RoZXRpY0FybToge1xuICAgICAgICBuYW1lOiAncHJvc3RoZXRpYyBhcm0gKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9XG59XG5cblxuY2xhc3MgQmx1ZXByaW50IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBkZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb20oKSB7XG4gICAgICAgIGNvbnN0IGJsdWVwcmludFZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYmx1ZXByaW50RGF0YSlcbiAgICAgICAgY29uc3QgaW5kZXggPSBVdGlsaXR5LnJhbmRvbWl6ZShibHVlcHJpbnRWYWx1ZXMubGVuZ3RoKVxuXG4gICAgICAgIGNvbnN0IHJhbmRvbUJsdWVwcmludCA9IGJsdWVwcmludFZhbHVlc1tpbmRleF1cblxuICAgICAgICByZXR1cm4gbmV3IEJsdWVwcmludChyYW5kb21CbHVlcHJpbnQubmFtZSwgcmFuZG9tQmx1ZXByaW50LmRlc2NyaXB0aW9uKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBCbHVlcHJpbnRcblxuIiwiaW1wb3J0IE1vdmVhYmxlIGZyb20gJy4vTW92ZWFibGUnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcblxuXG5jbGFzcyBDaGFyYWN0ZXIgZXh0ZW5kcyBNb3ZlYWJsZSB7ICAvLyBDaGFyYWN0ZXIgZGF0YSBhbmQgYWN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcihtYXApXG4gICAgICAgIHRoaXMubWFwID0gbWFwXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnkuY29udGVudHNcbiAgICAgICAgdGhpcy5pbml0aWFsR3JpZEluZGljZXMgPSBtYXAuZ2V0TWFwQ2VudGVyKClcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXModGhpcy5pbml0aWFsR3JpZEluZGljZXMpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFyYWN0ZXIgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2FjdG9yJykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTcGFuKHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlSXRlbXNUb01hcCgpIHtcbiAgICAgICAgLy8gTk9UIFJFUVVJUkVEIEFUIFRIRSBNT01FTlRcblxuICAgICAgICAvLyB0aGlzLm1hcC5pdGVtc09uTWFwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIC8vICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHtpdGVtLm5hbWV9LSR7aXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLnRha2VJdGVtLCB0aGlzLCB0cnVlKVxuICAgICAgICAvLyB9KVxuICAgIH1cblxuICAgIGdldENoYXJhY3RlcigpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdhY3RvcicsXG4gICAgICAgICAgICBlbGVtZW50OiAnQCcsXG4gICAgICAgICAgICBjbHM6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgbGVmdDogY3NzTGVmdCxcbiAgICAgICAgICAgIHRvcDogY3NzVG9wLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgZ2V0QWN0aW9uKGZuTmFtZSwgYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2ZuTmFtZV0uYmluZCh0aGlzLCBhcmcpXG4gICAgfVxuXG4gICAgbW92ZShkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IHRoaXMudXBkYXRlR3JpZEluZGljZXModGhpcy5nZXRDaGFyYWN0ZXIoKSwgRElSRUNUSU9OU1tkaXJlY3Rpb25dKVxuICAgICAgICB0aGlzLnByaW50TG9jYWxTdGF0dXMoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuICAgIH1cblxuICAgIHByaW50TG9jYWxTdGF0dXMoKSB7XG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy5sb2NhdGlvbilcbiAgICAgICAgY29uc3QgbG9jYWxJdGVtID0gdGhpcy5sb2NhbEl0ZW0oKVxuICAgICAgICBpZiAobG9jYWxJdGVtKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxJdGVtLm1pbmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ2EgbWluZXIgcHVsbHMgY29tcG91bmRzIGZyb20gdGhlIHJlZ2lvbicpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnZGlzcGxheS1pdGVtJywgbG9jYWxJdGVtLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbEl0ZW0oKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIGxldCBsb2NhbEl0ZW0gPSBudWxsXG4gICAgICAgIHRoaXMubWFwLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNoYXIueCAmJiBpdGVtLnkgPT09IGNoYXIueSkge1xuICAgICAgICAgICAgICAgIGxvY2FsSXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIH19KVxuICAgICAgICByZXR1cm4gbG9jYWxJdGVtXG4gICAgfVxuXG5cbiAgICB0YWtlKCkge1xuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG4gICAgICAgIGlmIChsb2NhbEl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaChgJHtsb2NhbEl0ZW0ubmFtZX0tJHtsb2NhbEl0ZW0uaWRlbnRpdHlOdW1iZXJ9IHRha2VuYClcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgYCR7bG9jYWxJdGVtLm5hbWV9IHRha2VuYClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ3RoZXJlIGlzIG5vdGhpbmcgaGVyZSB3b3J0aCB0YWtpbmcnKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBjaGVja0ludmVudG9yeSgpIHtcbiAgICAgICAgY29uc3QgY2FycnlpbmcgPSB0aGlzLmludmVudG9yeS5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpLmpvaW4oJyB8ICcpXG4gICAgICAgIGNvbnN0IHRleHQgPSBgeW91IGFyZSBjYXJyeWluZzogJHtjYXJyeWluZ31gXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgdGV4dClcbiAgICB9XG5cblxuICAgIGZpbmRJbnZlbnRvcnlJdGVtKGl0ZW1OYW1lKSB7XG4gICAgICAgIGxldCBmb3VuZEl0ZW0gPSBudWxsXG4gICAgICAgIHRoaXMuaW52ZW50b3J5LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBpdGVtTmFtZSkge1xuICAgICAgICAgICAgICAgIGZvdW5kSXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGZvdW5kSXRlbVxuICAgIH1cblxuICAgIG1pbmUoKSB7XG5cbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgY29uc3QgbWluZXIgPSB0aGlzLmZpbmRJbnZlbnRvcnlJdGVtKCdwYXJ0aWNsZSBtaW5lcicpXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gW2NoYXIueCwgY2hhci55XVxuXG5cbiAgICAgICAgaWYgKG1pbmVyKSB7XG4gICAgICAgICAgICBtaW5lci5vZmZNYXAgPSBmYWxzZVxuICAgICAgICAgICAgbWluZXIubWluaW5nID0gdHJ1ZVxuICAgICAgICAgICAgbWluZXIuc2V0T25NYXAodGhpcy5tYXAubWFwLCBsb2NhdGlvbilcbiAgICAgICAgICAgIG1pbmVyLmRyYXdMYXllcihtaW5lci5kaXYpXG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3JlbW92ZS1pbnZlbnRvcnknLCBtaW5lcilcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICd5b3UgZG8gbm90IGhhdmUgYW55IHBhcnRpY2xlIG1pbmVycycpXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cblxuY29uc3QgSVRFTVMgPSB7XG4gICAgbWluZXI6IHtcbiAgICAgICAgbmFtZTogJ3BhcnRpY2xlIG1pbmVyJyxcbiAgICAgICAgdHlwZTogJ2l0ZW0nLFxuICAgICAgICBlbGVtZW50OiAnfCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnbWluZXMsIGRpdmlkZXMsIGFuZCBzdG9yZXMgYW1iaWVudCBjaGVtaWNhbCBlbGVtZW50cyBhbmQgbGFyZ2VyIGNvbXBvdW5kcyBmb3VuZCB3aXRoaW4gYSAxMDAgbWV0ZXIgcmFkaXVzLiA5NyUgYWNjdXJhY3kgcmF0ZS4nLFxuICAgICAgICBkaXY6ICdpdGVtLW1pbmVyJ1xuICAgIH0vLyxcbiAgICAvLyBwYXJzZXI6IHtcbiAgICAvLyAgICAgbmFtZTogJ25vaXNlIHBhcnNlcicsXG4gICAgLy8gICAgIHR5cGU6ICdpdGVtJyxcbiAgICAvLyAgICAgZWxlbWVudDogJz8nLFxuICAgIC8vICAgICBkZXNjcmlwdGlvbjogJ3Byb3RvdHlwZS4gcGFyc2VzIGF0bW9zcGhlcmljIGRhdGEgZm9yIGxhdGVudCBpbmZvcm1hdGlvbi4gc2lnbmFsLXRvLW5vaXNlIHJhdGlvIG5vdCBndWFyYW50ZWVkLicsXG4gICAgLy8gICAgIGRpdjogJ2l0ZW0tcGFyc2VyJ1xuICAgIC8vIH0sXG4gICAgLy8gaW50ZXJmYWNlOiB7XG4gICAgLy8gICAgIG5hbWU6ICdwc2lvbmljIGludGVyZmFjZScsXG4gICAgLy8gICAgIHR5cGU6ICdpdGVtJyxcbiAgICAvLyAgICAgZWxlbWVudDogJyYnLFxuICAgIC8vICAgICBkZXNjcmlwdGlvbjogYGNvbm5lY3RzIHNlYW1sZXNzbHkgdG8gYSBzdGFuZGFyZC1pc3N1ZSBiaW9wb3J0LiBmYWNpbGl0YXRlcyBzdW5kcnkgaW50ZXJhY3Rpb25zIHBlcmZvcm1lZCB2aWEgUFNJLU5FVC5gLFxuICAgIC8vICAgICBkaXY6ICdpdGVtLWludGVyZmFjZSdcbiAgICAvLyB9LFxuICAgIC8vIHByaW50ZXI6IHtcbiAgICAvLyAgICAgbmFtZTogJ21vbGVjdWxhciBwcmludGVyJyxcbiAgICAvLyAgICAgdHlwZTogJ2l0ZW0nLFxuICAgIC8vICAgICBlbGVtZW50OiAnIycsXG4gICAgLy8gICAgIGRlc2NyaXB0aW9uOiAnZ2VuZXJhdGVzIG9iamVjdHMgYWNjb3JkaW5nIHRvIGEgYmx1ZXByaW50LiBtb2xlY3VsZXMgbm90IGluY2x1ZGVkLicsXG4gICAgLy8gICAgIGRpdjogJ2l0ZW0tcHJpbnRlcidcbiAgICAvLyB9XG59XG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBNb3ZlYWJsZSB7XG4gICAgc3RhdGljIGdldFJhbmRvbUl0ZW1Db25maWcoKSB7XG4gICAgICAgIGNvbnN0IGFsbEl0ZW1zID0gT2JqZWN0LnZhbHVlcyhJVEVNUylcbiAgICAgICAgcmV0dXJuIGFsbEl0ZW1zW1V0aWxpdHkucmFuZG9taXplKGFsbEl0ZW1zLmxlbmd0aCldXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJdGVtKEl0ZW0uZ2V0UmFuZG9tSXRlbUNvbmZpZygpKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZW5lcmF0ZShudW1iZXIpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlcjsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtcy5wdXNoKEl0ZW0ucmFuZG9tKCkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbXNcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihpdGVtQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICAvLyBtZXJnZSBpbiBjb25maWcgcHJvcGVydGllc1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBPYmplY3QuYXNzaWduKHRoaXMsIGl0ZW1Db25maWcpXG5cbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuaWRlbnRpdHlOdW1iZXIgPSBVdGlsaXR5LklkKClcbiAgICAgICAgdGhpcy50eXBlID0gJ2l0ZW0nXG4gICAgICAgIHRoaXMub2ZmTWFwID0gZmFsc2VcbiAgICAgICAgLy8gdGhpcy5pbkludmVudG9yeSA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHt0aGlzLm5hbWV9LSR7dGhpcy5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLm9uVGFrZSwgdGhpcylcbiAgICB9XG5cbiAgICBzZXRPbk1hcChtYXAsIGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0TWFwKG1hcClcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXMobG9jYXRpb24pXG4gICAgICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLnNldEdyaWRJbmRpY2VzKClcbiAgICAgICAgdGhpcy5zZXREaXYodGhpcy5nZXRJZCgpKVxuICAgICAgICB0aGlzLnVwZGF0ZURpdih0aGlzKVxuXG4vLyBtb3ZlZCB0aGlzIG91dCBzbyB3ZSBhcmUgbm90IGNyZWF0aW5nIGNoaWxkcmVuIGVhY2ggdGltZSB3ZSB3YW50IHRvIHBsYWNlIG9uIG1hcFxuICAgICAgICAvLyB0aGlzLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKVxuICAgIH1cblxuICAgIGdldElkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eU51bWJlclxuICAgIH1cblxuICAgIHNldENvb3JkaW5hdGVzKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMubGVmdCA9IGNzc0xlZnRcbiAgICAgICAgdGhpcy50b3AgPSBjc3NUb3BcbiAgICB9XG5cbiAgICBzZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEdyaWRJbmRpY2VzKClcblxuICAgICAgICB0aGlzLnggPSB4XG4gICAgICAgIHRoaXMueSA9IHlcbiAgICB9XG5cbiAgICBzZXREaXYoaWRlbnRpdHlOdW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpdlNldCkge1xuICAgICAgICAgICAgdGhpcy5kaXYgPSB0aGlzLmRpdiArIGlkZW50aXR5TnVtYmVyXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXZTZXQgPSB0cnVlXG4gICAgfVxuXG5cbiAgICAvLyBzcGVjaWZpYyB0byBpdGVtIGRyYXdpbmc6IHVzZSBvdXRlckhUTUxcbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbGF5ZXJJZCcsIGxheWVySWQpXG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgY29uc29sZS5sb2coJ2VsIGluIGRyYXdMYXllcicsIGVsKVxuICAgICAgICBlbC5vdXRlckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cblxuXG4gICAgcmVuZGVyTGF5ZXIodW5pdCwgbGF5ZXJJZCkge1xuICAgICAgICBpZiAodW5pdC50eXBlID09PSAnaXRlbScpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGl2KHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBvblRha2UoKSB7XG4gICAgICAgIHRoaXMueCA9IG51bGxcbiAgICAgICAgdGhpcy55ID0gbnVsbFxuICAgICAgICB0aGlzLm9mZk1hcCA9IHRydWUgLy8gY2hhbmdlcyBjc3MgZGlzcGxheSB0byAnbm9uZSdcblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1pbnZlbnRvcnknLCB0aGlzKVxuICAgICAgICAvLyB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMub25Ecm9wLCB0aGlzKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuICAgIH1cblxuICAgIG9uRHJvcCgpIHtcbiAgICAvLyAgICAgdGhpcy54ID0gYXJncy54XG4gICAgLy8gICAgIHRoaXMueSA9IGFyZ3MueVxuXG5cbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMsIHRydWUpXG4gICAgLy8gICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcywgdGhpcy5kaXYpXG5cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSXRlbVxuIiwiY2xhc3MgTGFuZHNjYXBlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB0aGlzLmZlYXR1cmVzKClcbiAgICAgICAgdGhpcy5iYXJlID0gdGhpcy5iYXJlKClcbiAgICB9XG5cbiAgICBmZWF0dXJlcygpIHtcbiAgICAgICAgY29uc3QgcGVyaW9kID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0aGUgYWlyIGlzIGNob2tlZCB3aXRoIGR1c3QsIHN0YXRpYywgd2lmaScsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjUsXG4gICAgICAgICAgICBjbHM6ICdwZXJpb2QnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tbWEgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnLCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3NwcmF3bCBvZiBzbWFydCBob21lcywgY3VsLWRlLXNhY3MsIGxhbmV3YXlzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNixcbiAgICAgICAgICAgIGNsczogJ2NvbW1hJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JhdmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnXicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2Egc2hpbW1lcmluZyBmaWVsZCBvZiBzb2xhciBwYW5lbHMsIGJyb2tlbiBhbmQgY29ycm9kZWQnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDIyLFxuICAgICAgICAgICAgY2xzOiAnZ3JhdmUnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXN0ZXJpc2sgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnKicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2hvbGxvdyB1c2VycyBqYWNrIGluIGF0IHRoZSBkYXRhaHVicycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjAsXG4gICAgICAgICAgICBjbHM6ICdhc3RlcmlzaydcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3BlcmlvZCwgY29tbWEsIHNlbWljb2xvbiwgc2VtaWNvbG9uLCBhc3RlcmlzaywgYXN0ZXJpc2ssIGdyYXZlLCBncmF2ZV1cbiAgICB9XG5cbiAgICBiYXJlKCkge1xuICAgICAgICBjb25zdCBiYXJlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJyZuYnNwOycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2NvbmNyZXRlIGFuZCB0d2lzdGVkIHJlYmFyIHN0cmV0Y2ggdG8gdGhlIGhvcml6b24nLFxuICAgICAgICAgICAgY2xzOiAnYmxhbmsnXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhcmVcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExhbmRzY2FwZURhdGFcbiIsImltcG9ydCBNYXBHZW5lcmF0b3IgZnJvbSAnLi9NYXBHZW5lcmF0b3InXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5cbmNsYXNzIE1hcCB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRNYXAgPSBuZXcgTWFwR2VuZXJhdG9yKGNvbCwgcm93KVxuICAgICAgICB0aGlzLm1hcCA9IHRoaXMuZ2VuZXJhdGVkTWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcCA9IFtdXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcFxuICAgIH1cblxuICAgIGdldE1hcENlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHRoaXMuY29sLzIpLCBNYXRoLmZsb29yKHRoaXMucm93LzIpXVxuICAgIH1cblxuICAgIGdldFJhbmRvbU1hcExvY2F0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1V0aWxpdHkucmFuZG9taXplKHRoaXMucm93IC0gMSksIFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSldXG4gICAgfVxuXG4gICAgc2V0Q2hhcmFjdGVyKGNoYXJhY3Rlcikge1xuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IGNoYXJhY3RlclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5zZXRNYXAodGhpcy5tYXApXG4gICAgfVxuXG4gICAgc2V0SXRlbXMoaXRlbXMpIHtcbiAgICAgICAgaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tTWFwTG9jYXRpb24gPSB0aGlzLmdldFJhbmRvbU1hcExvY2F0aW9uKClcbiAgICAgICAgICAgIGl0ZW0uc2V0T25NYXAodGhpcy5tYXAsIHJhbmRvbU1hcExvY2F0aW9uKVxuICAgICAgICAgICAgaXRlbS5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJykgIC8vIG1vdmVkIGNoaWxkRWxlbWVudCBjcmVhdGlvbiBvdXQgb2YgJ3NldE9uTWFwJ1xuICAgICAgICAgICAgdGhpcy5wdXNoSXRlbShpdGVtKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1c2hJdGVtKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwLnB1c2goaXRlbSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcFxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IExhbmRzY2FwZURhdGEgZnJvbSAnLi9MYW5kc2NhcGVEYXRhJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuXG5cbmNsYXNzIE1hcEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYXRpbmcgbWFwJylcbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVEYXRhKClcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuaW5pdChjb2wsIHJvdylcbiAgICAgICAgY29uc3Qgc2VlZGVkR3JpZCA9IHRoaXMuc2VlZChncmlkKVxuICAgICAgICB0aGlzLnNlZWRlZEdyaWQgPSBzZWVkZWRHcmlkXG4gICAgICAgIHRoaXMuZ3JvdygpXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgZ2VuZXJhdGVkJylcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlZWRlZEdyaWRcbiAgICB9XG5cbiAgICBpbml0KGNvbCwgcm93KSB7XG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG4gICAgICAgIGNvbnN0IGdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdzsgaSsrKSB7XG4gICAgICAgICAgICBncmlkW2ldID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBncmlkW2ldLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgc2VlZChncmlkKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldE51bWJlck9mRWxlbWVudFNlZWRzKCk7IGkrKykge1xuICAgICAgICAgICAgcmFuZG9tRWxlbWVudHMucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXMubGVuZ3RoKV0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VlZHMgPSB0aGlzLmdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cylcbiAgICAgICAgc2VlZHMubWFwKHNlZWQgPT4gZ3JpZFtzZWVkLnldW3NlZWQueF0gPSBzZWVkKVxuICAgICAgICB0aGlzLl9zZWVkcyA9IHNlZWRzXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKSB7XG4gICAgICAgIC8vICByZXR1cm4gMSAgICAgICAgLy8gdGVzdCBzZXR0aW5nXG4gICAgICAgIC8vIHJldHVybiAoKHRoaXMuY29sICogdGhpcy5yb3cpIC8gKHRoaXMuX2NvbCArIHRoaXMucm93KSkgIC8vIHNwYXJzZSBpbml0aWFsIHNlZWRpbmdcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBzZWVkcyA9IHRoaXMuX3NlZWRzXG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdvb2RTZWVkcyA9IFtdXG4gICAgICAgICAgICB0aGlzLmdvb2RTZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5mb3JFYWNoKChzZWVkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2RTZWVkcy5wdXNoKHRoaXMuY2hlY2tTZWVkKHNlZWQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBmb3IgKGxldCBnb29kU2VlZCBvZiBnb29kU2VlZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID09PSB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuY291bnRVbnNlZWRlZExvY2F0aW9ucygpKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5zZWVkZWRHcmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBsZXQgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgaWYgKChzZWVkLnggPCB0aGlzLmNvbCAmJiBzZWVkLnggPj0gMCkgJiZcbiAgICAgICAgICAgIChzZWVkLnkgPCB0aGlzLnJvdyAmJiBzZWVkLnkgPj0gMCkpIHtcbiAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFtzZWVkLnldW3NlZWQueF0gIT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKChzZWVkLnggPT09IGdvb2RTZWVkLngpICYmXG4gICAgICAgICAgICAgICAgKHNlZWQueSA9PT0gZ29vZFNlZWQueSkpIHtcbiAgICAgICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzZWVkU3VjY2VlZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykge1xuICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICBzZWVkcy5mb3JFYWNoKChvcmlnaW5hbFNlZWQpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmFiaWxpdHkobmV4dEdlblNlZWQucHJvYmFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkaXJlY3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueCA9IG9yaWdpbmFsU2VlZC54ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnkgPSBvcmlnaW5hbFNlZWQueSArIGRpcmVjdGlvblZhbHVlc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG4gICAgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE1hcChtYXApIHtcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXBcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgfVxuXG4gICAgZ2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdyaWRJbmRpY2VzWzBdXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdyaWRJbmRpY2VzWzFdXG5cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBcInlvdSd2ZSByZWFjaGVkIHRoZSBtYXAncyBlZGdlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uXG4gICAgfVxuXG4gICAgY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykge1xuICAgICAgICBsZXQgbG9jYXRpb25PbkdyaWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHggPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICBjb25zdCB5ID0gbmV3R3JpZEluZGljZXNbMF1cblxuICAgICAgICBpZiAodGhpcy5nb3RNYXBbeF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbeF1beV1cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uT25HcmlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uT25HcmlkXG4gICAgfVxuXG4gICAgZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXQnKVxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgICBjb25zdCB3aWR0aCA9IFV0aWxpdHkuc3RyaW5nVG9OdW1iZXIoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSlcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSlcbiAgICAgICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9XG4gICAgfVxuXG4gICAgZ2V0Q1NTQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGNzcyA9IHRoaXMuZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKVxuICAgICAgICBjb25zdCBjc3NMZWZ0ID0gdGhpcy5ncmlkSW5kaWNlc1swXSAqIGNzcy5oZWlnaHRcbiAgICAgICAgY29uc3QgY3NzVG9wID0gdGhpcy5ncmlkSW5kaWNlc1sxXSAqIGNzcy53aWR0aFxuICAgICAgICByZXR1cm4geyBjc3NMZWZ0LCBjc3NUb3AgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBNb3ZlYWJsZVxuIiwiY2xhc3MgUmVuZGVyYWJsZSB7ICAvLyBnZW5lcmFsaXplZCByZW5kZXIgZnVuY3Rpb25zIGZvciBTY2VuZXJ5LCBDaGFyYWN0ZXJcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRMYXllcihsYXllcikge1xuICAgICAgICB0aGlzLmxheWVyID0gbGF5ZXJcbiAgICB9XG5cbiAgICBnZXRMYXllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJcbiAgICB9XG5cbiAgICByZW5kZXJTcGFuKHVuaXQpIHtcbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdC50b3AgJiYgdW5pdC5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7dW5pdC50b3B9cHg7IGxlZnQ6ICR7dW5pdC5sZWZ0fXB4YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ1bml0ICR7Y2xzfVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9zcGFuPmBcbiAgICB9XG5cbiAgICByZW5kZXJEaXYoaXRlbSkge1xuICAgICAgICBsZXQgZGl2ID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgZGl2ID0gaXRlbS5kaXZcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpdGVtLmVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS50b3AgJiYgaXRlbS5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7aXRlbS50b3B9cHg7IGxlZnQ6ICR7aXRlbS5sZWZ0fXB4OyBwb3NpdGlvbjogYWJzb2x1dGVgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ub2ZmTWFwKSB7XG4gICAgICAgICAgICBzdHlsZSArPSBgOyBkaXNwbGF5OiBub25lYFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLm1pbmluZykge1xuICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uLW5hbWU6IG1pbmluZzsgYW5pbWF0aW9uLWR1cmF0aW9uOiA0czsgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGVgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiJHtkaXZ9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L2Rpdj5gXG4gICAgfVxuXG4gICAgdXBkYXRlU3BhbihhY3Rvcikge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyU3BhbihhY3RvcikpXG4gICAgfVxuXG4gICAgdXBkYXRlRGl2KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlckRpdihpdGVtKSlcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQocGFyZW50TGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudExheWVySWQpXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgLy8gY3JlYXRlcyBkaXYgaWQgd2l0aGluIGVuY2xvc2luZyBkaXYgLi4uXG4gICAgICAgIGNoaWxkLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJhYmxlXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5cblxuY2xhc3MgU2NlbmVyeSBleHRlbmRzIFJlbmRlcmFibGUgeyAgLy8gU2NlbmVyeS1zcGVjaWZpYyByZW5kZXJpbmcgZnVuY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXAuZ2V0TWFwKClcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcigpXG4gICAgICAgIGNvbnNvbGUubG9nKCdzY2VuZXJ5IHJlbmRlcmVkJylcbiAgICB9XG5cbiAgICByZW5kZXJMYXllcigpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuZ290TWFwLm1hcChhcnIgPT4geyByZXR1cm4gYXJyLnNsaWNlKCkgfSlcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLmNyZWF0ZUxheWVyKGdyaWQpKVxuICAgICAgICB0aGlzLmRyYXdMYXllcigpXG4gICAgfVxuXG4gICAgY3JlYXRlTGF5ZXIoZ3JpZCkge1xuICAgICAgICBjb25zdCBzY2VuZXJ5R3JpZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgcm93SXRlbXMgPSBncmlkW2ldXG4gICAgICAgICAgICBsZXQgcm93ID0gJycgIC8vIHBvc3NpYmx5IG1ha2UgZWFjaCByb3cgYSB0YWJsZT9cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByb3cgKz0gdGhpcy5yZW5kZXJTcGFuKHJvd0l0ZW1zW2ldKSAvLyBhZGQgcmVuZGVyZWQgaXRlbXMgdG8gdGhlIGdyaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjZW5lcnlHcmlkLnB1c2gocm93KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2VuZXJ5R3JpZFxuICAgIH1cblxuICAgIGRyYXdMYXllcigpIHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgY29uc3QgZ3JpZFRvSFRNTCA9IGxheWVyLmpvaW4oJzxiciAvPicpICAvLyB1c2luZyBIVE1MIGJyZWFrcyBmb3Igbm93XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhbmRzY2FwZS1sYXllcicpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IGdyaWRUb0hUTUxcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU2NlbmVyeVxuIiwiaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuY2xhc3MgU3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy51cGRhdGUsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdkaXNwbGF5LWl0ZW0nLCB0aGlzLmRpc3BsYXlJdGVtLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnc3RhdHVzJywgdGhpcy5kZWZhdWx0LCB0aGlzKVxuICAgIH1cblxuICAgIHVwZGF0ZShsb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldChsb2NhdGlvbi5kZXNjcmlwdGlvbilcbiAgICB9XG5cbiAgICBiZWdpbnNXaXRoVm93ZWwodGV4dCkge1xuICAgICAgICBjb25zdCBmaXJzdExldHRlciA9IHRleHRbMF1cbiAgICAgICAgY29uc3Qgdm93ZWxzID0gWydhJywgJ2UnLCAnaScsICdvJywgJ3UnXVxuICAgICAgICBsZXQgYmVnaW5zV2l0aFZvd2VsID0gZmFsc2VcbiAgICAgICAgdm93ZWxzLmZvckVhY2godm93ZWwgPT4ge1xuICAgICAgICAgICAgaWYgKGZpcnN0TGV0dGVyID09PSB2b3dlbCkge1xuICAgICAgICAgICAgICAgIGJlZ2luc1dpdGhWb3dlbCA9IHRydWVcbiAgICAgICAgICAgIH19KVxuICAgICAgICByZXR1cm4gYmVnaW5zV2l0aFZvd2VsXG4gICAgfVxuXG4gICAgZGlzcGxheUl0ZW0oaXRlbU5hbWUpIHtcbiAgICAgICAgY29uc3QgYmVnaW5zV2l0aFZvd2VsID0gdGhpcy5iZWdpbnNXaXRoVm93ZWwoaXRlbU5hbWUpXG4gICAgICAgIGxldCB0ZXh0ID0gJydcbiAgICAgICAgaWYgKGJlZ2luc1dpdGhWb3dlbCkge1xuICAgICAgICAgICAgdGV4dCA9IGB5b3Ugc2VlIGFuICR7aXRlbU5hbWV9IGhlcmVgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZXh0ID0gYHlvdSBzZWUgYSAke2l0ZW1OYW1lfSBoZXJlYFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KHRleHQsIDEwKVxuICAgIH1cblxuICAgIGRlZmF1bHQodGV4dCkge1xuICAgICAgICB0aGlzLnNldCh0ZXh0LCAxMClcbiAgICB9XG5cbiAgICBzZXQoZGVzY3JpcHRpb24sIGRlbGF5PTApIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uXG4gICAgICAgIH0sIGRlbGF5KVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTdGF0dXNcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jbGFzcyBVc2VySW5wdXQge1xuICAgIGNvbnN0cnVjdG9yKGtleUFjdGlvbk1hcCkge1xuICAgICAgICB0aGlzLmtleUFjdGlvbk1hcCA9IGtleUFjdGlvbk1hcFxuXG4gICAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IHRoaXMudHJ5QWN0aW9uRm9yRXZlbnQuYmluZCh0aGlzKVxuICAgIH1cblxuICAgIHRyeUFjdGlvbkZvckV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGlmICghVXRpbGl0eS5jb250YWlucyh0aGlzLmtleUFjdGlvbk1hcCwgZXZlbnQua2V5Q29kZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBub3QgYSB2YWxpZCBrZXljb2RlOiAke2V2ZW50LmtleUNvZGV9YClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMua2V5QWN0aW9uTWFwW2V2ZW50LmtleUNvZGVdKClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBVc2VySW5wdXRcbiIsImxldCBpZCA9IDBcblxuZnVuY3Rpb24gZ2VuZXJhdGVJZCgpIHtcbiAgICBpZCA9IGlkICsgMVxuICAgIHJldHVybiBpZFxufVxuXG5jbGFzcyBVdGlsaXR5IHtcbiAgICBzdGF0aWMgY29udGFpbnMob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5pbmRleE9mKFN0cmluZyhwcm9wZXJ0eSkpICE9PSAtMVxuICAgIH1cblxuICAgIHN0YXRpYyBzdHJpbmdUb051bWJlcihzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5tYXRjaCgvXFxkKy8pWzBdXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbWl6ZShtdWx0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtdWx0KVxuICAgIH1cblxuICAgIHN0YXRpYyBJZCgpIHtcbiAgICAgICAgcmV0dXJuIGdlbmVyYXRlSWQoKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBVdGlsaXR5XG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50c0xpc3QgPSBbXSAgICAgICAgLy8gY3JlYXRlIGFycmF5IG9mIGV2ZW50c1xuICAgIH1cblxuICAgIHN1YnNjcmliZShldmVudCwgZm4sIHRoaXNWYWx1ZSwgb25jZT1mYWxzZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXNWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHsgICAvLyBpZiBubyB0aGlzVmFsdWUgcHJvdmlkZWQsIGJpbmRzIHRoZSBmbiB0byB0aGUgZm4/P1xuICAgICAgICAgICAgdGhpc1ZhbHVlID0gZm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50c0xpc3QucHVzaCh7ICAgICAgLy8gY3JlYXRlIG9iamVjdHMgbGlua2luZyBldmVudHMgKyBmdW5jdGlvbnMgdG8gcGVyZm9ybVxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LCAgICAgICAgICAgLy8gcHVzaCBlbSB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgICAgICB0aGlzVmFsdWU6IHRoaXNWYWx1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHVuc3Vic2NyaWJlKGV2ZW50KSB7XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAvLyAgICAgICAgICAgICBicmVha1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGlzaChldmVudCwgYXJnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGhpc1ZhbHVlLCBmbiwgb25jZSB9ID0gdGhpcy5ldmVudHNMaXN0W2ldXG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzVmFsdWUsIGFyZylcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzTGlzdFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRXZlbnRNYW5hZ2VyKClcbiIsImltcG9ydCBNYXAgZnJvbSAnLi9NYXAnXG5pbXBvcnQgU2NlbmVyeSBmcm9tICcuL1NjZW5lcnknXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4vQ2hhcmFjdGVyJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi9TdGF0dXMnXG5pbXBvcnQgVXNlcklucHV0IGZyb20gJy4vVXNlcklucHV0J1xuaW1wb3J0IEJsdWVwcmludHMgZnJvbSAnLi9CbHVlcHJpbnRzJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcblxuXG5jbGFzcyBHYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0R2FtZSgpXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKClcbiAgICB9XG5cbiAgICBpbml0R2FtZSgpIHtcbiAgICAgICAgLy8gdGhpcy5zcGFjZXMgPSBbXVxuICAgICAgICAvLyB0aGlzLmdhbWVPdmVyID0gZmFsc2VcblxuICAgICAgICB0aGlzLnN0YXR1cyA9IG5ldyBTdGF0dXMoKVxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKDYwLCA2MClcbiAgICAgICAgY29uc3QgaXRlbXMgPSBJdGVtLmdlbmVyYXRlKDUpXG5cbiAgICAgICAgdGhpcy5zY2VuZXJ5ID0gbmV3IFNjZW5lcnkobWFwKVxuXG4gICAgICAgIG1hcC5zZXRJdGVtcyhpdGVtcylcblxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKG1hcClcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXJcblxuICAgICAgICBtYXAuc2V0Q2hhcmFjdGVyKGNoYXJhY3RlcilcbiAgICAgICAgLy8gY2hhcmFjdGVyLnN1YnNjcmliZUl0ZW1zVG9NYXAoKSAgLy8gbm90IGN1cnJlbnRseSBuZWNlc3NhcnlcblxuICAgICAgICB0aGlzLmJsdWVwcmludCA9IEJsdWVwcmludHMucmFuZG9tKClcblxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeVxuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQodGhpcy5ibHVlcHJpbnQpXG5cbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuaW5pdFVzZXJJbnB1dChjaGFyYWN0ZXIpXG4gICAgfVxuXG4gICAgaW5pdFVzZXJJbnB1dChjaGFyYWN0ZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VySW5wdXQoe1xuICAgICAgICAgICAgJzM4JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdub3J0aCcpLFxuICAgICAgICAgICAgJzM3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICd3ZXN0JyksXG4gICAgICAgICAgICAnMzknOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ2Vhc3QnKSxcbiAgICAgICAgICAgICc0MCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnc291dGgnKSxcbiAgICAgICAgICAgICc4NCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ3Rha2UnKSwgLy8gKHQpYWtlIGl0ZW1cbiAgICAgICAgICAgICc3Myc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ2NoZWNrSW52ZW50b3J5JyksIC8vIGNoZWNrIChpKW52ZW50b3J5XG4gICAgICAgICAgICAnNzcnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtaW5lJykgLy8gZGVwbG95IHBhcnRpY2xlIChtKWluZXJcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGFydEdhbWUoKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzLnNldCgneW91IHdha2UgdXAnKVxuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoYHlvdSBhcmUgY2FycnlpbmcgJHt0aGlzLmJsdWVwcmludC5uYW1lfWAsIDQwMDApXG4gICAgfVxuXG4gICAgLy8gZ2FtZUlzT3ZlcigpIHtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuZ2FtZU92ZXJcbiAgICAvLyB9XG5cbiAgICAvLyBleHBsb3JlKCkge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhgZXhwbG9yaW5nIHRoZSAke3RoaXMua2luZH0gem9uZSFgKVxuICAgIC8vIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZSgpO1xuIiwiaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuY2xhc3MgSW52ZW50b3J5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jb250ZW50cyA9IFtdXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2FkZC1pbnZlbnRvcnknLCB0aGlzLmFkZCwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ3JlbW92ZS1pbnZlbnRvcnknLCB0aGlzLnJlbW92ZSwgdGhpcylcbiAgICB9XG5cbiAgICBhZGQoaXRlbSkge1xuICAgICAgICB0aGlzLmNvbnRlbnRzLnB1c2goaXRlbSlcbiAgICB9XG5cblxuXG4vLyB1bnRlc3RlZFxuXG4gICAgcmVtb3ZlKGl0ZW0pIHtcbiAgICAgICAgY29uc3QgdGhlSXRlbSA9IGl0ZW1cbiAgICAgICAgdGhpcy5jb250ZW50cy5mb3JFYWNoKChpdGVtLCBpLCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSB0aGVJdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50cy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW0gbm90IGluIGludmVudG9yeScpXG4gICAgICAgICAgICB9fSlcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW52ZW50b3J5XG4iXX0=
