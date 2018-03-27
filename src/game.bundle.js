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
        div: 'item-miner'
    },
    parser: {
        name: 'noise parser',
        type: 'item',
        element: '?',
        description: 'prototype. parses atmospheric data for latent information. signal-to-noise ratio not guaranteed.',
        div: 'item-parser'
    },
    interface: {
        name: 'psionic interface',
        type: 'item',
        element: '&',
        description: 'connects seamlessly to a standard-issue bioport. facilitates sundry interactions performed via PSI-NET.',
        div: 'item-interface'
    },
    printer: {
        name: 'molecular printer',
        type: 'item',
        element: '#',
        description: 'generates objects according to a blueprint. molecules not included.',
        div: 'item-printer'
    }
};

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
        _this.inInventory = false;

        _this.EM = _eventManager2.default;
        _this.EM.subscribe(_this.name + '-' + _this.identityNumber + ' taken', _this.onTake, _this, true);
        return _this;
    }

    _createClass(Item, [{
        key: 'setOnMap',
        value: function setOnMap(map, randomMapLocation) {
            this.setMap(map);
            this.setInitialGridIndices(randomMapLocation);
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
    }, {
        key: 'onTake',
        value: function onTake() {
            this.offMap = true;
            this.inInventory = true;

            this.x = null;
            this.y = null;

            this.EM.publish('add-inventory', this);

            this.renderLayer(this, this.div);
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
            } else {
                this.updateDiv(unit);
                this.drawLayer(layerId);
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
                '73': character.getAction('checkInventory') // check (i)nventory
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

            this.contents.forEach(function (item, i) {
                if (_this.contents[i].item === item) {
                    _this.contents.splice(i, 1);
                } else {
                    // item not in inventory
                }
            });
        }
    }]);

    return Inventory;
}();

exports.default = new Inventory();

},{"./eventManager":15}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0l0ZW0uanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsT0FBTyxJQUFQOzs7Ozs7Ozs7OztBQ0ZBOzs7Ozs7OztBQUdBLElBQU0sZ0JBQWdCO0FBQ2xCLHNCQUFrQjtBQUNkLGNBQU0sK0JBRFE7QUFFZCxxQkFBYSxFQUZDO0FBR2QsbUJBQVcsRUFIRztBQUlkLHNCQUFjO0FBSkEsS0FEQTtBQU9sQixvQkFBZ0I7QUFDWixjQUFNLDZCQURNO0FBRVoscUJBQWEsRUFGRDtBQUdaLG1CQUFXLEVBSEM7QUFJWixzQkFBYztBQUpGLEtBUEU7QUFhbEIsbUJBQWU7QUFDWCxjQUFNLDRCQURLO0FBRVgscUJBQWEsRUFGRjtBQUdYLG1CQUFXLEVBSEE7QUFJWCxzQkFBYztBQUpIO0FBYkcsQ0FBdEI7O0lBc0JNLFM7QUFDRix1QkFBWSxJQUFaLEVBQWtCLFdBQWxCLEVBQStCO0FBQUE7O0FBQzNCLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFLLFdBQUwsR0FBbUIsV0FBbkI7QUFDSDs7OztpQ0FFZTtBQUNaLGdCQUFNLGtCQUFrQixP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QUFJTDs7OzsrQkFFVyxJLEVBQU07QUFBQTs7QUFDVCxpQkFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixVQUFDLElBQUQsRUFBTyxDQUFQLEVBQWE7QUFDL0Isb0JBQUksTUFBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixJQUFqQixLQUEwQixJQUE5QixFQUFvQztBQUNoQywwQkFBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixDQUFyQixFQUF3QixDQUF4QjtBQUNILGlCQUZELE1BRU87QUFDSDtBQUNIO0FBQUMsYUFMTjtBQU9IOzs7Ozs7a0JBSVUsSUFBSSxTQUFKLEUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBnYW1lIGZyb20gJy4vanMvZ2FtZSdcblxud2luZG93LmdhbWUgPSBnYW1lXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5cblxuY29uc3QgYmx1ZXByaW50RGF0YSA9IHtcbiAgICBhcnRpZmljaWFsTXVzY2xlOiB7XG4gICAgICAgIG5hbWU6ICdhcnRpZmljaWFsIG11c2NsZSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH0sXG4gICAgcmV0aW5hbERpc3BsYXk6IHtcbiAgICAgICAgbmFtZTogJ3JldGluYWwgZGlzcGxheSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH0sXG4gICAgcHJvc3RoZXRpY0FybToge1xuICAgICAgICBuYW1lOiAncHJvc3RoZXRpYyBhcm0gKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9XG59XG5cblxuY2xhc3MgQmx1ZXByaW50IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBkZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb20oKSB7XG4gICAgICAgIGNvbnN0IGJsdWVwcmludFZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYmx1ZXByaW50RGF0YSlcbiAgICAgICAgY29uc3QgaW5kZXggPSBVdGlsaXR5LnJhbmRvbWl6ZShibHVlcHJpbnRWYWx1ZXMubGVuZ3RoKVxuXG4gICAgICAgIGNvbnN0IHJhbmRvbUJsdWVwcmludCA9IGJsdWVwcmludFZhbHVlc1tpbmRleF1cblxuICAgICAgICByZXR1cm4gbmV3IEJsdWVwcmludChyYW5kb21CbHVlcHJpbnQubmFtZSwgcmFuZG9tQmx1ZXByaW50LmRlc2NyaXB0aW9uKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBCbHVlcHJpbnRcblxuIiwiaW1wb3J0IE1vdmVhYmxlIGZyb20gJy4vTW92ZWFibGUnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcblxuXG5jbGFzcyBDaGFyYWN0ZXIgZXh0ZW5kcyBNb3ZlYWJsZSB7ICAvLyBDaGFyYWN0ZXIgZGF0YSBhbmQgYWN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcihtYXApXG4gICAgICAgIHRoaXMubWFwID0gbWFwXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnkuY29udGVudHNcbiAgICAgICAgdGhpcy5pbml0aWFsR3JpZEluZGljZXMgPSBtYXAuZ2V0TWFwQ2VudGVyKClcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXModGhpcy5pbml0aWFsR3JpZEluZGljZXMpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFyYWN0ZXIgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHN1YnNjcmliZUl0ZW1zVG9NYXAoKSB7XG4gICAgICAgIC8vIE5PVCBSRVFVSVJFRCBBVCBUSEUgTU9NRU5UXG5cbiAgICAgICAgLy8gdGhpcy5tYXAuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAvLyAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7aXRlbS5uYW1lfS0ke2l0ZW0uaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy50YWtlSXRlbSwgdGhpcywgdHJ1ZSlcbiAgICAgICAgLy8gfSlcbiAgICB9XG5cbiAgICBnZXRDaGFyYWN0ZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY3NzTGVmdCwgY3NzVG9wIH0gPSB0aGlzLmdldENTU0Nvb3JkaW5hdGVzKClcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEdyaWRJbmRpY2VzKClcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyID0ge1xuICAgICAgICAgICAgbmFtZTogJ2NoYXJhY3RlcicsXG4gICAgICAgICAgICB0eXBlOiAnYWN0b3InLFxuICAgICAgICAgICAgZWxlbWVudDogJ0AnLFxuICAgICAgICAgICAgY2xzOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIGxlZnQ6IGNzc0xlZnQsXG4gICAgICAgICAgICB0b3A6IGNzc1RvcCxcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlclxuICAgIH1cblxuICAgIGdldEFjdGlvbihmbk5hbWUsIGFyZykge1xuICAgICAgICByZXR1cm4gdGhpc1tmbk5hbWVdLmJpbmQodGhpcywgYXJnKVxuICAgIH1cblxuICAgIG1vdmUoZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMubG9jYXRpb24gPSB0aGlzLnVwZGF0ZUdyaWRJbmRpY2VzKHRoaXMuZ2V0Q2hhcmFjdGVyKCksIERJUkVDVElPTlNbZGlyZWN0aW9uXSlcbiAgICAgICAgdGhpcy5wcmludExvY2FsU3RhdHVzKClcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcbiAgICB9XG5cbiAgICBwcmludExvY2FsU3RhdHVzKCkge1xuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIGNvbnN0IGxvY2FsSXRlbSA9IHRoaXMubG9jYWxJdGVtKClcbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LWl0ZW0nLCBsb2NhbEl0ZW0ubmFtZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsSXRlbSgpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgbGV0IGxvY2FsSXRlbSA9IG51bGxcbiAgICAgICAgdGhpcy5tYXAuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY2hhci54ICYmIGl0ZW0ueSA9PT0gY2hhci55KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxJdGVtID0gaXRlbVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBsb2NhbEl0ZW1cbiAgICB9XG5cblxuICAgIHRha2UoKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsSXRlbSA9IHRoaXMubG9jYWxJdGVtKClcbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGAke2xvY2FsSXRlbS5uYW1lfS0ke2xvY2FsSXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gKVxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBgJHtsb2NhbEl0ZW0ubmFtZX0gdGFrZW5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAndGhlcmUgaXMgbm90aGluZyBoZXJlIHdvcnRoIHRha2luZycpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGNoZWNrSW52ZW50b3J5KCkge1xuICAgICAgICBjb25zdCBjYXJyeWluZyA9IHRoaXMuaW52ZW50b3J5Lm1hcChpdGVtID0+IGl0ZW0ubmFtZSkuam9pbignIHwgJylcbiAgICAgICAgY29uc3QgdGV4dCA9IGB5b3UgYXJlIGNhcnJ5aW5nOiAke2NhcnJ5aW5nfWBcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCB0ZXh0KVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cblxuY29uc3QgSVRFTVMgPSB7XG4gICAgbWluZXI6IHtcbiAgICAgICAgbmFtZTogJ3BhcnRpY2xlIG1pbmVyJyxcbiAgICAgICAgdHlwZTogJ2l0ZW0nLFxuICAgICAgICBlbGVtZW50OiAnfCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnbWluZXMsIGRpdmlkZXMsIGFuZCBzdG9yZXMgYW1iaWVudCBjaGVtaWNhbCBlbGVtZW50cyBhbmQgbGFyZ2VyIGNvbXBvdW5kcyBmb3VuZCB3aXRoaW4gYSAxMDAgbWV0ZXIgcmFkaXVzLiA5NyUgYWNjdXJhY3kgcmF0ZS4nLFxuICAgICAgICBkaXY6ICdpdGVtLW1pbmVyJ1xuICAgIH0sXG4gICAgcGFyc2VyOiB7XG4gICAgICAgIG5hbWU6ICdub2lzZSBwYXJzZXInLFxuICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgIGVsZW1lbnQ6ICc/JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdwcm90b3R5cGUuIHBhcnNlcyBhdG1vc3BoZXJpYyBkYXRhIGZvciBsYXRlbnQgaW5mb3JtYXRpb24uIHNpZ25hbC10by1ub2lzZSByYXRpbyBub3QgZ3VhcmFudGVlZC4nLFxuICAgICAgICBkaXY6ICdpdGVtLXBhcnNlcidcbiAgICB9LFxuICAgIGludGVyZmFjZToge1xuICAgICAgICBuYW1lOiAncHNpb25pYyBpbnRlcmZhY2UnLFxuICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgIGVsZW1lbnQ6ICcmJyxcbiAgICAgICAgZGVzY3JpcHRpb246IGBjb25uZWN0cyBzZWFtbGVzc2x5IHRvIGEgc3RhbmRhcmQtaXNzdWUgYmlvcG9ydC4gZmFjaWxpdGF0ZXMgc3VuZHJ5IGludGVyYWN0aW9ucyBwZXJmb3JtZWQgdmlhIFBTSS1ORVQuYCxcbiAgICAgICAgZGl2OiAnaXRlbS1pbnRlcmZhY2UnXG4gICAgfSxcbiAgICBwcmludGVyOiB7XG4gICAgICAgIG5hbWU6ICdtb2xlY3VsYXIgcHJpbnRlcicsXG4gICAgICAgIHR5cGU6ICdpdGVtJyxcbiAgICAgICAgZWxlbWVudDogJyMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2dlbmVyYXRlcyBvYmplY3RzIGFjY29yZGluZyB0byBhIGJsdWVwcmludC4gbW9sZWN1bGVzIG5vdCBpbmNsdWRlZC4nLFxuICAgICAgICBkaXY6ICdpdGVtLXByaW50ZXInXG4gICAgfVxufVxuXG5jbGFzcyBJdGVtIGV4dGVuZHMgTW92ZWFibGUge1xuICAgIHN0YXRpYyBnZXRSYW5kb21JdGVtQ29uZmlnKCkge1xuICAgICAgICBjb25zdCBhbGxJdGVtcyA9IE9iamVjdC52YWx1ZXMoSVRFTVMpXG4gICAgICAgIHJldHVybiBhbGxJdGVtc1tVdGlsaXR5LnJhbmRvbWl6ZShhbGxJdGVtcy5sZW5ndGgpXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb20oKSB7XG4gICAgICAgIHJldHVybiBuZXcgSXRlbShJdGVtLmdldFJhbmRvbUl0ZW1Db25maWcoKSlcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGUobnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXI7IGkrKykge1xuICAgICAgICAgICAgaXRlbXMucHVzaChJdGVtLnJhbmRvbSgpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zXG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoaXRlbUNvbmZpZykge1xuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgLy8gbWVyZ2UgaW4gY29uZmlnIHByb3BlcnRpZXNcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gT2JqZWN0LmFzc2lnbih0aGlzLCBpdGVtQ29uZmlnKVxuXG4gICAgICAgIC8vIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmlkZW50aXR5TnVtYmVyID0gVXRpbGl0eS5JZCgpXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgIHRoaXMuaW5JbnZlbnRvcnkgPSBmYWxzZVxuXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMsIHRydWUpXG4gICAgfVxuXG4gICAgc2V0T25NYXAobWFwLCByYW5kb21NYXBMb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldE1hcChtYXApXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbEdyaWRJbmRpY2VzKHJhbmRvbU1hcExvY2F0aW9uKVxuICAgICAgICB0aGlzLnNldENvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5zZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIHRoaXMuc2V0RGl2KHRoaXMuZ2V0SWQoKSlcbiAgICAgICAgdGhpcy51cGRhdGVEaXYodGhpcylcbiAgICAgICAgdGhpcy5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJylcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHlOdW1iZXJcbiAgICB9XG5cbiAgICBzZXRDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLmxlZnQgPSBjc3NMZWZ0XG4gICAgICAgIHRoaXMudG9wID0gY3NzVG9wXG4gICAgfVxuXG4gICAgc2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG5cbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgfVxuXG4gICAgc2V0RGl2KGlkZW50aXR5TnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZGl2ID0gdGhpcy5kaXYgKyBpZGVudGl0eU51bWJlclxuICAgIH1cblxuICAgIG9uVGFrZSgpIHtcbiAgICAgICAgdGhpcy5vZmZNYXAgPSB0cnVlXG4gICAgICAgIHRoaXMuaW5JbnZlbnRvcnkgPSB0cnVlXG5cbiAgICAgICAgdGhpcy54ID0gbnVsbFxuICAgICAgICB0aGlzLnkgPSBudWxsXG5cbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdhZGQtaW52ZW50b3J5JywgdGhpcylcblxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtXG4iLCJjbGFzcyBMYW5kc2NhcGVEYXRhIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5mZWF0dXJlcyA9IHRoaXMuZmVhdHVyZXMoKVxuICAgICAgICB0aGlzLmJhcmUgPSB0aGlzLmJhcmUoKVxuICAgIH1cblxuICAgIGZlYXR1cmVzKCkge1xuICAgICAgICBjb25zdCBwZXJpb2QgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnLicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3RoZSBhaXIgaXMgY2hva2VkIHdpdGggZHVzdCwgc3RhdGljLCB3aWZpJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNSxcbiAgICAgICAgICAgIGNsczogJ3BlcmlvZCdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21tYSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcsJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnc3ByYXdsIG9mIHNtYXJ0IGhvbWVzLCBjdWwtZGUtc2FjcywgbGFuZXdheXMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI2LFxuICAgICAgICAgICAgY2xzOiAnY29tbWEnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VtaWNvbG9uID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJzsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdyb3dzIG9mIGdyZWVuaG91c2VzOiBzb21lIHNoYXR0ZXJlZCBhbmQgYmFycmVuLCBvdGhlcnMgb3Zlcmdyb3duJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNCxcbiAgICAgICAgICAgIGNsczogJ3NlbWljb2xvbidcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncmF2ZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdeJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnYSBzaGltbWVyaW5nIGZpZWxkIG9mIHNvbGFyIHBhbmVscywgYnJva2VuIGFuZCBjb3Jyb2RlZCcsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjIsXG4gICAgICAgICAgICBjbHM6ICdncmF2ZSdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhc3RlcmlzayA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcqJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnaG9sbG93IHVzZXJzIGphY2sgaW4gYXQgdGhlIGRhdGFodWJzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMCxcbiAgICAgICAgICAgIGNsczogJ2FzdGVyaXNrJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGVyaW9kLCBjb21tYSwgc2VtaWNvbG9uLCBzZW1pY29sb24sIGFzdGVyaXNrLCBhc3RlcmlzaywgZ3JhdmUsIGdyYXZlXVxuICAgIH1cblxuICAgIGJhcmUoKSB7XG4gICAgICAgIGNvbnN0IGJhcmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnJm5ic3A7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnY29uY3JldGUgYW5kIHR3aXN0ZWQgcmViYXIgc3RyZXRjaCB0byB0aGUgaG9yaXpvbicsXG4gICAgICAgICAgICBjbHM6ICdibGFuaydcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmFyZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFuZHNjYXBlRGF0YVxuIiwiaW1wb3J0IE1hcEdlbmVyYXRvciBmcm9tICcuL01hcEdlbmVyYXRvcidcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cblxuY2xhc3MgTWFwIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2wsIHJvdykge1xuICAgICAgICB0aGlzLmNvbCA9IGNvbFxuICAgICAgICB0aGlzLnJvdyA9IHJvd1xuICAgICAgICB0aGlzLmdlbmVyYXRlZE1hcCA9IG5ldyBNYXBHZW5lcmF0b3IoY29sLCByb3cpXG4gICAgICAgIHRoaXMubWFwID0gdGhpcy5nZW5lcmF0ZWRNYXAuZ2V0TWFwKClcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwXG4gICAgfVxuXG4gICAgZ2V0TWFwQ2VudGVyKCkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IodGhpcy5jb2wvMiksIE1hdGguZmxvb3IodGhpcy5yb3cvMildXG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tTWFwTG9jYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKSwgVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKV1cbiAgICB9XG5cbiAgICBzZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKSB7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLnNldE1hcCh0aGlzLm1hcClcbiAgICB9XG5cbiAgICBzZXRJdGVtcyhpdGVtcykge1xuICAgICAgICBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21NYXBMb2NhdGlvbiA9IHRoaXMuZ2V0UmFuZG9tTWFwTG9jYXRpb24oKVxuICAgICAgICAgICAgaXRlbS5zZXRPbk1hcCh0aGlzLm1hcCwgcmFuZG9tTWFwTG9jYXRpb24pXG4gICAgICAgICAgICB0aGlzLnB1c2hJdGVtKGl0ZW0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVzaEl0ZW0oaXRlbSkge1xuICAgICAgICB0aGlzLml0ZW1zT25NYXAucHVzaChpdGVtKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgTGFuZHNjYXBlRGF0YSBmcm9tICcuL0xhbmRzY2FwZURhdGEnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5cblxuY2xhc3MgTWFwR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2wsIHJvdykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2VuZXJhdGluZyBtYXAnKVxuICAgICAgICB0aGlzLmxhbmRzY2FwZVNlZWRzID0gbmV3IExhbmRzY2FwZURhdGEoKVxuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5pbml0KGNvbCwgcm93KVxuICAgICAgICBjb25zdCBzZWVkZWRHcmlkID0gdGhpcy5zZWVkKGdyaWQpXG4gICAgICAgIHRoaXMuc2VlZGVkR3JpZCA9IHNlZWRlZEdyaWRcbiAgICAgICAgdGhpcy5ncm93KClcbiAgICAgICAgY29uc29sZS5sb2coJ21hcCBnZW5lcmF0ZWQnKVxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VlZGVkR3JpZFxuICAgIH1cblxuICAgIGluaXQoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcbiAgICAgICAgY29uc3QgZ3JpZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93OyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2w7IGorKykge1xuICAgICAgICAgICAgICAgIGdyaWRbaV0ucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBzZWVkKGdyaWQpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tRWxlbWVudHMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKTsgaSsrKSB7XG4gICAgICAgICAgICByYW5kb21FbGVtZW50cy5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlcy5sZW5ndGgpXSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWVkcyA9IHRoaXMuZ2VuZXJhdGVTZWVkTG9jYXRpb25zKHJhbmRvbUVsZW1lbnRzKVxuICAgICAgICBzZWVkcy5tYXAoc2VlZCA9PiBncmlkW3NlZWQueV1bc2VlZC54XSA9IHNlZWQpXG4gICAgICAgIHRoaXMuX3NlZWRzID0gc2VlZHNcbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpIHtcbiAgICAgICAgLy8gIHJldHVybiAxICAgICAgICAvLyB0ZXN0IHNldHRpbmdcbiAgICAgICAgLy8gcmV0dXJuICgodGhpcy5jb2wgKiB0aGlzLnJvdykgLyAodGhpcy5fY29sICsgdGhpcy5yb3cpKSAgLy8gc3BhcnNlIGluaXRpYWwgc2VlZGluZ1xuICAgICAgICByZXR1cm4gKHRoaXMuY29sICsgdGhpcy5yb3cpICAvLyByaWNoIGluaXRpYWwgc2VlZGluZ1xuICAgIH1cblxuICAgIGdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cykge1xuICAgICAgICByZXR1cm4gcmFuZG9tRWxlbWVudHMubWFwKGVsID0+IHtcbiAgICAgICAgICAgIGVsLnggPSBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpXG4gICAgICAgICAgICBlbC55ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKVxuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ3JvdygpIHtcbiAgICAgICAgbGV0IHNlZWRzID0gdGhpcy5fc2VlZHNcbiAgICAgICAgbGV0IG1hcFBvcHVsYXRlZCA9IGZhbHNlXG5cbiAgICAgICAgd2hpbGUgKCFtYXBQb3B1bGF0ZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ29vZFNlZWRzID0gW11cbiAgICAgICAgICAgIHRoaXMuZ29vZFNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB0aGlzLm5leHRHZW5lcmF0aW9uU2VlZHMoc2VlZHMpLmZvckVhY2goKHNlZWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1NlZWQoc2VlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZFNlZWRzLnB1c2godGhpcy5jaGVja1NlZWQoc2VlZCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGZvciAobGV0IGdvb2RTZWVkIG9mIGdvb2RTZWVkcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPSBnb29kU2VlZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5jb3VudFVuc2VlZGVkTG9jYXRpb25zKCkpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3VudFVuc2VlZGVkTG9jYXRpb25zKCkge1xuICAgICAgICBjb25zdCBmbGF0dGVuZWRHcmlkID0gW10uY29uY2F0LmFwcGx5KFtdLCB0aGlzLnNlZWRlZEdyaWQpXG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSBvZiBmbGF0dGVuZWRHcmlkKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICAgICAgY291bnQrK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudFxuICAgIH1cblxuICAgIGNoZWNrU2VlZChzZWVkKSB7XG4gICAgICAgIGxldCBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICBpZiAoKHNlZWQueCA8IHRoaXMuY29sICYmIHNlZWQueCA+PSAwKSAmJlxuICAgICAgICAgICAgKHNlZWQueSA8IHRoaXMucm93ICYmIHNlZWQueSA+PSAwKSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW3NlZWQueV1bc2VlZC54XSAhPT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nb29kU2VlZHMuZm9yRWFjaChnb29kU2VlZCA9PiB7XG4gICAgICAgICAgICBpZiAoKHNlZWQueCA9PT0gZ29vZFNlZWQueCkgJiZcbiAgICAgICAgICAgICAgICAoc2VlZC55ID09PSBnb29kU2VlZC55KSkge1xuICAgICAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHNlZWRTdWNjZWVkcykge1xuICAgICAgICAgICAgcmV0dXJuIHNlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKSB7XG4gICAgICAgIGNvbnN0IG5leHRHZW5TZWVkcyA9IFtdXG4gICAgICAgIHNlZWRzLmZvckVhY2goKG9yaWdpbmFsU2VlZCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIGluIERJUkVDVElPTlMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb25WYWx1ZXMgPSBESVJFQ1RJT05TW2RpcmVjdGlvbl1cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0R2VuU2VlZCA9IE9iamVjdC5hc3NpZ24oe30sIG9yaWdpbmFsU2VlZClcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9iYWJpbGl0eShuZXh0R2VuU2VlZC5wcm9iYWJpbGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGRpcmVjdGlvblZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZC54ID0gb3JpZ2luYWxTZWVkLnggKyBkaXJlY3Rpb25WYWx1ZXNba2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueSA9IG9yaWdpbmFsU2VlZC55ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZHMucHVzaChuZXh0R2VuU2VlZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMubmV4dEdlblNlZWRzID0gbmV4dEdlblNlZWRzXG4gICAgICAgIHJldHVybiBuZXh0R2VuU2VlZHNcbiAgICB9XG5cbiAgICBwcm9iYWJpbGl0eShwZXJjZW50YWdlKSB7XG4gICAgICAgIGNvbnN0IHByb2JhYmlsaXR5QXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcmNlbnRhZ2U7IGkrKykge1xuICAgICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKHRydWUpXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAgLSBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaChmYWxzZSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvYmFiaWxpdHlBcnJheVtVdGlsaXR5LnJhbmRvbWl6ZSgxMDApXVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwR2VuZXJhdG9yXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5cblxuY2xhc3MgTW92ZWFibGUgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIG1vdmVtZW50IGFuZCBwbGFjZW1lbnQgb24gdGhlIGdyaWRcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgc2V0TWFwKG1hcCkge1xuICAgICAgICB0aGlzLmdvdE1hcCA9IG1hcFxuICAgIH1cblxuICAgIHNldEluaXRpYWxHcmlkSW5kaWNlcyhncmlkSW5kaWNlcykge1xuICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gZ3JpZEluZGljZXNcbiAgICB9XG5cbiAgICBnZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cblxuICAgICAgICByZXR1cm4geyB4LCB5IH1cbiAgICB9XG5cbiAgICB1cGRhdGVHcmlkSW5kaWNlcyhhY3RvciwgbW92ZSkge1xuICAgICAgICBjb25zdCBuZXdHcmlkSW5kaWNlcyA9IFt0aGlzLmdyaWRJbmRpY2VzWzBdICsgbW92ZS54LCB0aGlzLmdyaWRJbmRpY2VzWzFdICsgbW92ZS55XVxuICAgICAgICBsZXQgbG9jYXRpb24gPSAnJ1xuICAgICAgICBpZiAodGhpcy5jaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSkge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gbmV3R3JpZEluZGljZXNcbiAgICAgICAgICAgIGFjdG9yLnggPSBuZXdHcmlkSW5kaWNlc1swXVxuICAgICAgICAgICAgYWN0b3IueSA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2NhdGlvbiA9IHRoaXMuZ290TWFwW3RoaXMuZ3JpZEluZGljZXNbMV0sIHRoaXMuZ3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAoYWN0b3IubmFtZSA9PT0gJ2NoYXJhY3RlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIFwieW91J3ZlIHJlYWNoZWQgdGhlIG1hcCdzIGVkZ2VcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYXRpb25cbiAgICB9XG5cbiAgICBjaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSB7XG4gICAgICAgIGxldCBsb2NhdGlvbk9uR3JpZCA9IGZhbHNlXG5cbiAgICAgICAgY29uc3QgeCA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIGNvbnN0IHkgPSBuZXdHcmlkSW5kaWNlc1swXVxuXG4gICAgICAgIGlmICh0aGlzLmdvdE1hcFt4XSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFt4XVt5XVxuICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb25PbkdyaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYXRpb25PbkdyaWRcbiAgICB9XG5cbiAgICBnZXRDU1NIZWlnaHRBbmRXaWR0aCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdCcpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgICAgIGNvbnN0IHdpZHRoID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKVxuICAgICAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH1cbiAgICB9XG5cbiAgICBnZXRDU1NDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgY3NzID0gdGhpcy5nZXRDU1NIZWlnaHRBbmRXaWR0aCgpXG4gICAgICAgIGNvbnN0IGNzc0xlZnQgPSB0aGlzLmdyaWRJbmRpY2VzWzBdICogY3NzLmhlaWdodFxuICAgICAgICBjb25zdCBjc3NUb3AgPSB0aGlzLmdyaWRJbmRpY2VzWzFdICogY3NzLndpZHRoXG4gICAgICAgIHJldHVybiB7IGNzc0xlZnQsIGNzc1RvcCB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1vdmVhYmxlXG4iLCJjbGFzcyBSZW5kZXJhYmxlIHsgIC8vIGdlbmVyYWxpemVkIHJlbmRlciBmdW5jdGlvbnMgZm9yIFNjZW5lcnksIENoYXJhY3RlclxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHNldExheWVyKGxheWVyKSB7XG4gICAgICAgIHRoaXMubGF5ZXIgPSBsYXllclxuICAgIH1cblxuICAgIGdldExheWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXllclxuICAgIH1cblxuICAgIHJlbmRlclNwYW4odW5pdCkge1xuICAgICAgICBsZXQgY2xzID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgICAgY2xzID0gdW5pdC5jbHNcbiAgICAgICAgICAgIGVsZW1lbnQgPSB1bml0LmVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bml0LnRvcCAmJiB1bml0LmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHt1bml0LnRvcH1weDsgbGVmdDogJHt1bml0LmxlZnR9cHhgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInVuaXQgJHtjbHN9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L3NwYW4+YFxuICAgIH1cblxuICAgIHJlbmRlckRpdihpdGVtKSB7XG4gICAgICAgIGxldCBkaXYgPSAnJ1xuICAgICAgICBsZXQgZWxlbWVudCA9ICcmbmJzcDsnXG4gICAgICAgIGxldCBzdHlsZSA9ICcnXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBkaXYgPSBpdGVtLmRpdlxuICAgICAgICAgICAgZWxlbWVudCA9IGl0ZW0uZWxlbWVudFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnRvcCAmJiBpdGVtLmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHtpdGVtLnRvcH1weDsgbGVmdDogJHtpdGVtLmxlZnR9cHg7IHBvc2l0aW9uOiBhYnNvbHV0ZWBcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5vZmZNYXApIHtcbiAgICAgICAgICAgIHN0eWxlICs9IGA7IGRpc3BsYXk6IG5vbmVgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiJHtkaXZ9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L2Rpdj5gXG4gICAgfVxuXG4gICAgcmVuZGVyTGF5ZXIodW5pdCwgbGF5ZXJJZCkge1xuICAgICAgICBpZiAodW5pdC50eXBlID09PSAnYWN0b3InKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNwYW4odW5pdClcbiAgICAgICAgICAgIHRoaXMuZHJhd0xheWVyKGxheWVySWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURpdih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVNwYW4oYWN0b3IpIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlclNwYW4oYWN0b3IpKVxuICAgIH1cblxuICAgIHVwZGF0ZURpdihpdGVtKSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5yZW5kZXJEaXYoaXRlbSkpXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXllcklkKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KHBhcmVudExheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJlbnRMYXllcklkKVxuICAgICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpIC8vIGNyZWF0ZXMgZGl2IGlkIHdpdGhpbiBlbmNsb3NpbmcgZGl2IC4uLlxuICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUmVuZGVyYWJsZVxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuXG5cbmNsYXNzIFNjZW5lcnkgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIFNjZW5lcnktc3BlY2lmaWMgcmVuZGVyaW5nIGZ1bmN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMuZ290TWFwID0gbWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMucmVuZGVyR3JpZExheWVyKClcbiAgICAgICAgY29uc29sZS5sb2coJ3NjZW5lcnkgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckdyaWRMYXllcigpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuZ290TWFwLm1hcChhcnIgPT4geyByZXR1cm4gYXJyLnNsaWNlKCkgfSlcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLmNyZWF0ZUdyaWRMYXllcihncmlkKSlcbiAgICAgICAgdGhpcy5kcmF3R3JpZExheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVHcmlkTGF5ZXIoZ3JpZCkge1xuICAgICAgICBjb25zdCBzY2VuZXJ5R3JpZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgcm93SXRlbXMgPSBncmlkW2ldXG4gICAgICAgICAgICBsZXQgcm93ID0gJycgIC8vIHBvc3NpYmx5IG1ha2UgZWFjaCByb3cgYSB0YWJsZT9cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByb3cgKz0gdGhpcy5yZW5kZXJTcGFuKHJvd0l0ZW1zW2ldKSAvLyBhZGQgcmVuZGVyZWQgaXRlbXMgdG8gdGhlIGdyaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjZW5lcnlHcmlkLnB1c2gocm93KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2VuZXJ5R3JpZFxuICAgIH1cblxuICAgIGRyYXdHcmlkTGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGNvbnN0IGdyaWRUb0hUTUwgPSBsYXllci5qb2luKCc8YnIgLz4nKSAgLy8gdXNpbmcgSFRNTCBicmVha3MgZm9yIG5vd1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYW5kc2NhcGUtbGF5ZXInKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSBncmlkVG9IVE1MXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lcnlcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIFN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMudXBkYXRlLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pdGVtJywgdGhpcy5kaXNwbGF5SXRlbSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ3N0YXR1cycsIHRoaXMuZGVmYXVsdCwgdGhpcylcbiAgICB9XG5cbiAgICB1cGRhdGUobG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXQobG9jYXRpb24uZGVzY3JpcHRpb24pXG4gICAgfVxuXG4gICAgYmVnaW5zV2l0aFZvd2VsKHRleHQpIHtcbiAgICAgICAgY29uc3QgZmlyc3RMZXR0ZXIgPSB0ZXh0WzBdXG4gICAgICAgIGNvbnN0IHZvd2VscyA9IFsnYScsICdlJywgJ2knLCAnbycsICd1J11cbiAgICAgICAgbGV0IGJlZ2luc1dpdGhWb3dlbCA9IGZhbHNlXG4gICAgICAgIHZvd2Vscy5mb3JFYWNoKHZvd2VsID0+IHtcbiAgICAgICAgICAgIGlmIChmaXJzdExldHRlciA9PT0gdm93ZWwpIHtcbiAgICAgICAgICAgICAgICBiZWdpbnNXaXRoVm93ZWwgPSB0cnVlXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGJlZ2luc1dpdGhWb3dlbFxuICAgIH1cblxuICAgIGRpc3BsYXlJdGVtKGl0ZW1OYW1lKSB7XG4gICAgICAgIGNvbnN0IGJlZ2luc1dpdGhWb3dlbCA9IHRoaXMuYmVnaW5zV2l0aFZvd2VsKGl0ZW1OYW1lKVxuICAgICAgICBsZXQgdGV4dCA9ICcnXG4gICAgICAgIGlmIChiZWdpbnNXaXRoVm93ZWwpIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhbiAke2l0ZW1OYW1lfSBoZXJlYFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dCA9IGB5b3Ugc2VlIGEgJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldCh0ZXh0LCAxMClcbiAgICB9XG5cbiAgICBkZWZhdWx0KHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMuc2V0KHJlc3BvbnNlLCAxMClcbiAgICB9XG5cbiAgICBzZXQoZGVzY3JpcHRpb24sIGRlbGF5PTApIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uXG4gICAgICAgIH0sIGRlbGF5KVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTdGF0dXNcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jbGFzcyBVc2VySW5wdXQge1xuICAgIGNvbnN0cnVjdG9yKGtleUFjdGlvbk1hcCkge1xuICAgICAgICB0aGlzLmtleUFjdGlvbk1hcCA9IGtleUFjdGlvbk1hcFxuXG4gICAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IHRoaXMudHJ5QWN0aW9uRm9yRXZlbnQuYmluZCh0aGlzKVxuICAgIH1cblxuICAgIHRyeUFjdGlvbkZvckV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGlmICghVXRpbGl0eS5jb250YWlucyh0aGlzLmtleUFjdGlvbk1hcCwgZXZlbnQua2V5Q29kZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBub3QgYSB2YWxpZCBrZXljb2RlOiAke2V2ZW50LmtleUNvZGV9YClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMua2V5QWN0aW9uTWFwW2V2ZW50LmtleUNvZGVdKClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBVc2VySW5wdXRcbiIsImxldCBpZCA9IDBcblxuZnVuY3Rpb24gZ2VuZXJhdGVJZCgpIHtcbiAgICBpZCA9IGlkICsgMVxuICAgIHJldHVybiBpZFxufVxuXG5jbGFzcyBVdGlsaXR5IHtcbiAgICBzdGF0aWMgY29udGFpbnMob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5pbmRleE9mKFN0cmluZyhwcm9wZXJ0eSkpICE9PSAtMVxuICAgIH1cblxuICAgIHN0YXRpYyBzdHJpbmdUb051bWJlcihzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5tYXRjaCgvXFxkKy8pWzBdXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbWl6ZShtdWx0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtdWx0KVxuICAgIH1cblxuICAgIHN0YXRpYyBJZCgpIHtcbiAgICAgICAgcmV0dXJuIGdlbmVyYXRlSWQoKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBVdGlsaXR5XG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50c0xpc3QgPSBbXSAgICAgICAgLy8gY3JlYXRlIGFycmF5IG9mIGV2ZW50c1xuICAgIH1cblxuICAgIHN1YnNjcmliZShldmVudCwgZm4sIHRoaXNWYWx1ZSwgb25jZT1mYWxzZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXNWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHsgICAvLyBpZiBubyB0aGlzVmFsdWUgcHJvdmlkZWQsIGJpbmRzIHRoZSBmbiB0byB0aGUgZm4/P1xuICAgICAgICAgICAgdGhpc1ZhbHVlID0gZm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50c0xpc3QucHVzaCh7ICAgICAgLy8gY3JlYXRlIG9iamVjdHMgbGlua2luZyBldmVudHMgKyBmdW5jdGlvbnMgdG8gcGVyZm9ybVxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LCAgICAgICAgICAgLy8gcHVzaCBlbSB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgICAgICB0aGlzVmFsdWU6IHRoaXNWYWx1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHVuc3Vic2NyaWJlKGV2ZW50KSB7XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAvLyAgICAgICAgICAgICBicmVha1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGlzaChldmVudCwgYXJnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGhpc1ZhbHVlLCBmbiwgb25jZSB9ID0gdGhpcy5ldmVudHNMaXN0W2ldXG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzVmFsdWUsIGFyZylcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzTGlzdFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRXZlbnRNYW5hZ2VyKClcbiIsImltcG9ydCBNYXAgZnJvbSAnLi9NYXAnXG5pbXBvcnQgU2NlbmVyeSBmcm9tICcuL1NjZW5lcnknXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4vQ2hhcmFjdGVyJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi9TdGF0dXMnXG5pbXBvcnQgVXNlcklucHV0IGZyb20gJy4vVXNlcklucHV0J1xuaW1wb3J0IEJsdWVwcmludHMgZnJvbSAnLi9CbHVlcHJpbnRzJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcblxuXG5jbGFzcyBHYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0R2FtZSgpXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKClcbiAgICB9XG5cbiAgICBpbml0R2FtZSgpIHtcbiAgICAgICAgLy8gdGhpcy5zcGFjZXMgPSBbXVxuICAgICAgICAvLyB0aGlzLmdhbWVPdmVyID0gZmFsc2VcblxuICAgICAgICB0aGlzLnN0YXR1cyA9IG5ldyBTdGF0dXMoKVxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKDYwLCA2MClcbiAgICAgICAgY29uc3QgaXRlbXMgPSBJdGVtLmdlbmVyYXRlKDUpXG5cbiAgICAgICAgdGhpcy5zY2VuZXJ5ID0gbmV3IFNjZW5lcnkobWFwKVxuXG4gICAgICAgIG1hcC5zZXRJdGVtcyhpdGVtcylcblxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKG1hcClcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXJcblxuICAgICAgICBtYXAuc2V0Q2hhcmFjdGVyKGNoYXJhY3RlcilcbiAgICAgICAgLy8gY2hhcmFjdGVyLnN1YnNjcmliZUl0ZW1zVG9NYXAoKSAgLy8gbm90IGN1cnJlbnRseSBuZWNlc3NhcnlcblxuICAgICAgICB0aGlzLmJsdWVwcmludCA9IEJsdWVwcmludHMucmFuZG9tKClcblxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeVxuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQodGhpcy5ibHVlcHJpbnQpXG5cbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuaW5pdFVzZXJJbnB1dChjaGFyYWN0ZXIpXG4gICAgfVxuXG4gICAgaW5pdFVzZXJJbnB1dChjaGFyYWN0ZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VySW5wdXQoe1xuICAgICAgICAgICAgJzM4JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdub3J0aCcpLFxuICAgICAgICAgICAgJzM3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICd3ZXN0JyksXG4gICAgICAgICAgICAnMzknOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ2Vhc3QnKSxcbiAgICAgICAgICAgICc0MCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnc291dGgnKSxcbiAgICAgICAgICAgICc4NCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ3Rha2UnKSwgLy8gKHQpYWtlIGl0ZW1cbiAgICAgICAgICAgICc3Myc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ2NoZWNrSW52ZW50b3J5JykgLy8gY2hlY2sgKGkpbnZlbnRvcnlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGFydEdhbWUoKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzLnNldCgneW91IHdha2UgdXAnKVxuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoYHlvdSBhcmUgY2FycnlpbmcgJHt0aGlzLmJsdWVwcmludC5uYW1lfWAsIDQwMDApXG4gICAgfVxuXG4gICAgLy8gZ2FtZUlzT3ZlcigpIHtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuZ2FtZU92ZXJcbiAgICAvLyB9XG5cbiAgICAvLyBleHBsb3JlKCkge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhgZXhwbG9yaW5nIHRoZSAke3RoaXMua2luZH0gem9uZSFgKVxuICAgIC8vIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZSgpO1xuIiwiaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuY2xhc3MgSW52ZW50b3J5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jb250ZW50cyA9IFtdXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2FkZC1pbnZlbnRvcnknLCB0aGlzLmFkZCwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ3JlbW92ZS1pbnZlbnRvcnknLCB0aGlzLnJlbW92ZSwgdGhpcylcbiAgICB9XG5cbiAgICBhZGQoaXRlbSkge1xuICAgICAgICB0aGlzLmNvbnRlbnRzLnB1c2goaXRlbSlcbiAgICB9XG5cblxuXG4vLyB1bnRlc3RlZFxuXG4gICAgcmVtb3ZlKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5jb250ZW50cy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50c1tpXS5pdGVtID09PSBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50cy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaXRlbSBub3QgaW4gaW52ZW50b3J5XG4gICAgICAgICAgICB9fSlcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW52ZW50b3J5XG4iXX0=
