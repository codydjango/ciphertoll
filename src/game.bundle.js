(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _game = require('./js/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.game = _game2.default;

},{"./js/game":19}],2:[function(require,module,exports){
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
        name: 'Artificial Muscle',
        description: '',
        abilities: '',
        requirements: ''
    },
    retinalDisplay: {
        name: 'Retinal Display',
        description: '',
        abilities: '',
        requirements: ''
    },
    prostheticArm: {
        name: 'Prosthetic Arm',
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

},{"./Utility":17}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Moveable2 = require('./Moveable');

var _Moveable3 = _interopRequireDefault(_Moveable2);

var _constants = require('./constants');

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
        _this.EM = null;
        _this.initialGridIndices = map.getMapCenter();

        _this.setInitialGridIndices(_this.initialGridIndices);
        _this.renderLayer(_this.getCharacter(), 'character-layer');
        console.log('character rendered');
        return _this;
    }

    _createClass(Character, [{
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
            // console.log(`${direction}`)
            this.location = this.updateGridIndices(this.getCharacter(), _constants.DIRECTIONS[direction]);
            // const char = this.getCharacter()
            // console.log('location', this.location)
            this.map.checkCharacterLocation();

            if (this.EM) {
                this.EM.publish('character-moved', this.location);
            }

            this.renderLayer(this.getCharacter(), 'character-layer');
        }

        // eventmanager testing

    }, {
        key: 'setEventManager',
        value: function setEventManager(eventManager) {
            this.EM = eventManager;
        }
    }, {
        key: 'takeItem',
        value: function takeItem() {
            console.log('attempting to take item...');
            this.EM.publish('item taken');
            console.log('events remaining:', this.EM.getEventsList());
        }
    }]);

    return Character;
}(_Moveable3.default);

exports.default = Character;

},{"./Moveable":12,"./constants":18}],4:[function(require,module,exports){
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

exports.default = EventManager;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Moveable2 = require('./Moveable');

var _Moveable3 = _interopRequireDefault(_Moveable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = function (_Moveable) {
    _inherits(Item, _Moveable);

    function Item(map, itemObject) {
        _classCallCheck(this, Item);

        var _this = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).call(this, map));

        _this.item = itemObject;
        _this.initialGridIndices = map.getRandomMapLocation();
        _this.setInitialGridIndices(_this.initialGridIndices);
        _this.setGridIndices();
        _this.setCoordinates();

        _this.renderLayer(_this.getItem(), 'item-layer'); // issues with rendering multiple items

        console.log('item ' + _this.item.name + ' rendered at ' + _this.initialGridIndices);

        return _this;
    }

    _createClass(Item, [{
        key: 'getItem',
        value: function getItem() {
            return this.item;
        }
    }, {
        key: 'setCoordinates',
        value: function setCoordinates() {
            var _getCSSCoordinates = this.getCSSCoordinates(),
                cssLeft = _getCSSCoordinates.cssLeft,
                cssTop = _getCSSCoordinates.cssTop;

            this.item.left = cssLeft;
            this.item.top = cssTop;
        }
    }, {
        key: 'setGridIndices',
        value: function setGridIndices() {
            this.item.x = this.gridIndices[0];
            this.item.y = this.gridIndices[1];
        }

        // eventmanager testing

    }, {
        key: 'setEventManager',
        value: function setEventManager(eventManager) {
            this.EM = eventManager;
            this.EM.subscribe('item taken', this.onTake, this);
            console.log('events list', this.EM.getEventsList());
        }
    }, {
        key: 'onTake',
        value: function onTake() {
            console.log(this.item.name + ' taken!');
        }
    }]);

    return Item;
}(_Moveable3.default);

exports.default = Item;

},{"./Moveable":12}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ItemData = function () {
    function ItemData() {
        _classCallCheck(this, ItemData);

        this.items = this.items();
    }

    _createClass(ItemData, [{
        key: 'items',
        value: function items() {
            var particleMiner = {
                name: 'particle miner',
                element: '|',
                description: '',
                cls: 'item miner'
            };
            var blueprint = {
                name: 'blueprint',
                element: '?',
                description: '',
                cls: 'item blueprint'
            };
            var artificialMuscle = {
                name: 'artificial muscle',
                element: '&',
                description: '',
                cls: 'item muscle'
            };
            var printer = {
                name: '3D printer',
                element: '#',
                description: '',
                cls: 'item printer'
            };
            return [particleMiner, blueprint, artificialMuscle, printer];
        }
    }]);

    return ItemData;
}();

exports.default = ItemData;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ItemData = require('./ItemData');

var _ItemData2 = _interopRequireDefault(_ItemData);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ItemGenerator = function () {
    function ItemGenerator(map, eventManager, numberOfItems) {
        _classCallCheck(this, ItemGenerator);

        this.map = map;
        this.numberOfItems = numberOfItems;
        this.data = new _ItemData2.default();

        // eventmanager testing

        this.EM = eventManager;

        this.generateItems();
    }

    _createClass(ItemGenerator, [{
        key: 'getRandomItems',
        value: function getRandomItems() {
            var allItems = this.data.items;
            var randomItems = [];
            for (var i = 0; i < this.numberOfItems; i++) {
                var randomItem = allItems[_Utility2.default.randomize(allItems.length)];
                randomItems.push(randomItem);
            }
            return randomItems;
        }
    }, {
        key: 'generateItems',
        value: function generateItems() {
            var _this = this;

            var randomItems = this.getRandomItems();
            randomItems.forEach(function (item) {
                _this.newItem = new _Item2.default(_this.map, item);

                // eventmanager testing

                _this.newItem.setEventManager(_this.EM);

                _this.map.pushItem(_this.newItem.item); // hmmm... pushItems refreshes each time generateItems is called?
                console.log('item generated:', _this.newItem.item);
            });
        }
    }]);

    return ItemGenerator;
}();

exports.default = ItemGenerator;

},{"./Item":6,"./ItemData":7,"./Utility":17}],9:[function(require,module,exports){
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
                probability: 30,
                cls: 'period'
            };
            var comma = {
                element: ',',
                description: 'sprawl of smart homes, cul-de-sacs, laneways',
                probability: 30,
                cls: 'comma'
            };
            var semicolon = {
                element: ';',
                description: 'rows of greenhouses: some shattered and barren, others overgrown',
                probability: 15,
                cls: 'semicolon'
            };
            var grave = {
                element: '^',
                description: 'a shimmering field of solar panels, broken and corroded',
                probability: 15,
                cls: 'grave'
            };
            var asterisk = {
                element: '*',
                description: 'hollow users jack in at the datahubs',
                probability: 15,
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapGenerator = require('./MapGenerator');

var _MapGenerator2 = _interopRequireDefault(_MapGenerator);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

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
        }
    }, {
        key: 'setEventManager',
        value: function setEventManager(eventManager) {
            this.EM = eventManager;
        }
    }, {
        key: 'pushItem',
        value: function pushItem(item) {
            this.itemsOnMap.push(item);
            console.log('itemsOnMap', this.itemsOnMap);
        }
    }, {
        key: 'checkCharacterLocation',
        value: function checkCharacterLocation() {
            var char = this.character.getCharacter();
            this.itemsOnMap.forEach(function (item) {
                if (item.x === char.x && item.y === char.y) {
                    // if character is on the same location as an item,
                    // print item description and allow character to interact with item
                    console.log('character is at item!');
                }
            });
        }
    }]);

    return Map;
}();

exports.default = Map;

},{"./MapGenerator":11,"./Utility":17}],11:[function(require,module,exports){
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

},{"./Constants":4,"./LandscapeData":9,"./Utility":17}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderable2 = require('./Renderable');

var _Renderable3 = _interopRequireDefault(_Renderable2);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Moveable = function (_Renderable) {
    _inherits(Moveable, _Renderable);

    // movement and placement on the grid
    function Moveable(map) {
        _classCallCheck(this, Moveable);

        var _this = _possibleConstructorReturn(this, (Moveable.__proto__ || Object.getPrototypeOf(Moveable)).call(this));

        _this.gotMap = map.getMap();
        return _this;
    }

    _createClass(Moveable, [{
        key: 'createMoveableLayer',
        value: function createMoveableLayer(moveableObject) {
            return this.renderUnit(moveableObject);
        }
    }, {
        key: 'updateLayer',
        value: function updateLayer(moveableObject) {
            this.setLayer(this.createMoveableLayer(moveableObject));
        }
    }, {
        key: 'renderLayer',
        value: function renderLayer(moveableObject, layerId) {
            this.updateLayer(moveableObject);
            this.drawLayer(layerId);
        }
    }, {
        key: 'drawLayer',
        value: function drawLayer(layerId) {
            var el = document.getElementById(layerId);
            el.innerHTML = this.getLayer();
        }
    }, {
        key: 'setInitialGridIndices',
        value: function setInitialGridIndices(gridIndices) {
            this.gridIndices = gridIndices;
            var location = this.gotMap[this.gridIndices[1]][this.gridIndices[0]];
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
                    console.log("you've reached the map's edge");
                }
            }
            return location;
        }
    }, {
        key: 'checkGridIndices',
        value: function checkGridIndices(newGridIndices) {
            var locationOnGrid = false;
            if (this.gotMap[newGridIndices[1]]) {
                var location = this.gotMap[newGridIndices[1]][newGridIndices[0]];
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

},{"./Renderable":13,"./Utility":17}],13:[function(require,module,exports){
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
        key: 'renderUnit',
        value: function renderUnit(unit) {
            // issue when ITEMS are rendered: cannot render multiple items on one layer??
            var cls = '';
            var element = '&nbsp;';
            if (unit) {
                cls = unit.cls;
                element = unit.element;
            }
            var style = '';
            if (unit.top && unit.left) {
                style = 'top: ' + unit.top + 'px; left: ' + unit.left + 'px';
            }
            return '<span class="unit ' + cls + '" style="' + style + '">' + element + '</span>';
        }
    }]);

    return Renderable;
}();

exports.default = Renderable;

},{}],14:[function(require,module,exports){
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
                    row += this.renderUnit(rowItems[_i]); // add rendered items to the grid
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

},{"./Renderable":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Status = function () {
    function Status(EM) {
        _classCallCheck(this, Status);

        EM.subscribe('character-moved', this.update, this);
    }

    _createClass(Status, [{
        key: 'update',
        value: function update(location) {
            this.set(location.description);
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

},{}],16:[function(require,module,exports){
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

},{"./Utility":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    }]);

    return Utility;
}();

exports.default = Utility;

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

var _EventManager = require('./EventManager');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _ItemGenerator = require('./ItemGenerator');

var _ItemGenerator2 = _interopRequireDefault(_ItemGenerator);

var _Status = require('./Status');

var _Status2 = _interopRequireDefault(_Status);

var _UserInput = require('./UserInput');

var _UserInput2 = _interopRequireDefault(_UserInput);

var _Blueprints = require('./Blueprints');

var _Blueprints2 = _interopRequireDefault(_Blueprints);

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
            this.spaces = [];
            this.gameOver = false;
            this.map = new _Map2.default(60, 60);
            this.scenery = new _Scenery2.default(this.map);
            this.character = new _Character2.default(this.map);
            this.map.setCharacter(this.character); // gives map reference to character


            // eventmanager testing
            this.EM = new _EventManager2.default(); // create only one EM ? or multiple ?
            this.character.setEventManager(this.EM);
            this.map.setEventManager(this.EM);

            // try generating from a set of stock items
            // bug: only the last item generated will display!!
            // testing with one item generated ...
            this.itemGenerator = new _ItemGenerator2.default(this.map, this.EM, 5); // have to pass in EM to generator (inelegant)

            this.status = new _Status2.default(this.EM);
            this.status.set('you wake up');
            this.blueprint = _Blueprints2.default.random();
            this.status.set('you are carrying ' + this.blueprint.name, 4000);

            this.input = this.initUserInput();
        }
    }, {
        key: 'initUserInput',
        value: function initUserInput() {
            return new _UserInput2.default({
                '38': this.character.getAction('move', 'north'),
                '37': this.character.getAction('move', 'west'),
                '39': this.character.getAction('move', 'east'),
                '40': this.character.getAction('move', 'south'),
                '84': this.character.getAction('takeItem', 'item') // (t)ake item
            });
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            console.log('start!');
        }
    }, {
        key: 'gameIsOver',
        value: function gameIsOver() {
            return this.gameOver;
        }
    }, {
        key: 'explore',
        value: function explore() {
            console.log('exploring the ' + this.kind + ' zone!');
        }
    }]);

    return Game;
}();

exports.default = new Game();

},{"./Blueprints":2,"./Character":3,"./EventManager":5,"./ItemGenerator":8,"./Map":10,"./Scenery":14,"./Status":15,"./UserInput":16}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0V2ZW50TWFuYWdlci5qcyIsInNyYy9qcy9JdGVtLmpzIiwic3JjL2pzL0l0ZW1EYXRhLmpzIiwic3JjL2pzL0l0ZW1HZW5lcmF0b3IuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvY29uc3RhbnRzLmpzIiwic3JjL2pzL2dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxPQUFPLElBQVA7Ozs7Ozs7Ozs7O0FDRkE7Ozs7Ozs7O0FBR0EsSUFBTSxnQkFBZ0I7QUFDbEIsc0JBQWtCO0FBQ2QsY0FBTSxtQkFEUTtBQUVkLHFCQUFhLEVBRkM7QUFHZCxtQkFBVyxFQUhHO0FBSWQsc0JBQWM7QUFKQSxLQURBO0FBT2xCLG9CQUFnQjtBQUNaLGNBQU0saUJBRE07QUFFWixxQkFBYSxFQUZEO0FBR1osbUJBQVcsRUFIQztBQUlaLHNCQUFjO0FBSkYsS0FQRTtBQWFsQixtQkFBZTtBQUNYLGNBQU0sZ0JBREs7QUFFWCxxQkFBYSxFQUZGO0FBR1gsbUJBQVcsRUFIQTtBQUlYLHNCQUFjO0FBSkg7QUFiRyxDQUF0Qjs7SUFzQk0sUztBQUNGLHVCQUFZLElBQVosRUFBa0IsV0FBbEIsRUFBK0I7QUFBQTs7QUFDM0IsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssV0FB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QUEyRCxJQUEzRDs7QUFFQSxpQkFBSyxLQUFMLEdBQWEsS0FBSyxhQUFMLEVBQWI7QUFDSDs7O3dDQUVlO0FBQ1osbUJBQU8sd0JBQWM7QUFDakIsc0JBQU0sS0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixNQUF6QixFQUFpQyxPQUFqQyxDQURXO0FBRWpCLHNCQUFNLEtBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsTUFBekIsRUFBaUMsTUFBakMsQ0FGVztBQUdqQixzQkFBTSxLQUFLLFNBQUwsQ0FBZSxTQUFmLENBQXlCLE1BQXpCLEVBQWlDLE1BQWpDLENBSFc7QUFJakIsc0JBQU0sS0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixNQUF6QixFQUFpQyxPQUFqQyxDQUpXO0FBS2pCLHNCQUFNLEtBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsVUFBekIsRUFBcUMsTUFBckMsQ0FMVyxDQUtrQztBQUxsQyxhQUFkLENBQVA7QUFPSDs7O29DQUVXO0FBQ1Isb0JBQVEsR0FBUixDQUFZLFFBQVo7QUFDSDs7O3FDQUVZO0FBQ1QsbUJBQU8sS0FBSyxRQUFaO0FBQ0g7OztrQ0FFUztBQUNOLG9CQUFRLEdBQVIsb0JBQTZCLEtBQUssSUFBbEM7QUFDSDs7Ozs7O2tCQUlVLElBQUksSUFBSixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2pzL2dhbWUnXG5cbndpbmRvdy5nYW1lID0gZ2FtZVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNvbnN0IGJsdWVwcmludERhdGEgPSB7XG4gICAgYXJ0aWZpY2lhbE11c2NsZToge1xuICAgICAgICBuYW1lOiAnQXJ0aWZpY2lhbCBNdXNjbGUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHJldGluYWxEaXNwbGF5OiB7XG4gICAgICAgIG5hbWU6ICdSZXRpbmFsIERpc3BsYXknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHByb3N0aGV0aWNBcm06IHtcbiAgICAgICAgbmFtZTogJ1Byb3N0aGV0aWMgQXJtJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfVxufVxuXG5cbmNsYXNzIEJsdWVwcmludCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9tKCkge1xuICAgICAgICBjb25zdCBibHVlcHJpbnRWYWx1ZXMgPSBPYmplY3QudmFsdWVzKGJsdWVwcmludERhdGEpXG4gICAgICAgIGNvbnN0IGluZGV4ID0gVXRpbGl0eS5yYW5kb21pemUoYmx1ZXByaW50VmFsdWVzLmxlbmd0aClcblxuICAgICAgICBjb25zdCByYW5kb21CbHVlcHJpbnQgPSBibHVlcHJpbnRWYWx1ZXNbaW5kZXhdXG5cbiAgICAgICAgcmV0dXJuIG5ldyBCbHVlcHJpbnQocmFuZG9tQmx1ZXByaW50Lm5hbWUsIHJhbmRvbUJsdWVwcmludC5kZXNjcmlwdGlvbilcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQmx1ZXByaW50XG5cbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICcuL01vdmVhYmxlJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vY29uc3RhbnRzJ1xuXG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIE1vdmVhYmxlIHsgIC8vIENoYXJhY3RlciBkYXRhIGFuZCBhY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKG1hcClcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICAgICAgdGhpcy5FTSA9IG51bGxcbiAgICAgICAgdGhpcy5pbml0aWFsR3JpZEluZGljZXMgPSBtYXAuZ2V0TWFwQ2VudGVyKClcblxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyh0aGlzLmluaXRpYWxHcmlkSW5kaWNlcylcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJhY3RlciByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgZWxlbWVudDogJ0AnLFxuICAgICAgICAgICAgY2xzOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIGxlZnQ6IGNzc0xlZnQsXG4gICAgICAgICAgICB0b3A6IGNzc1RvcCxcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlclxuICAgIH1cblxuICAgIGdldEFjdGlvbihmbk5hbWUsIGFyZykge1xuICAgICAgICByZXR1cm4gdGhpc1tmbk5hbWVdLmJpbmQodGhpcywgYXJnKVxuICAgIH1cblxuICAgIG1vdmUoZGlyZWN0aW9uKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGAke2RpcmVjdGlvbn1gKVxuICAgICAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy51cGRhdGVHcmlkSW5kaWNlcyh0aGlzLmdldENoYXJhY3RlcigpLCBESVJFQ1RJT05TW2RpcmVjdGlvbl0pXG4gICAgICAgIC8vIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsb2NhdGlvbicsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIHRoaXMubWFwLmNoZWNrQ2hhcmFjdGVyTG9jYXRpb24oKVxuXG4gICAgICAgIGlmICh0aGlzLkVNKSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuICAgIH1cblxuICAgIC8vIGV2ZW50bWFuYWdlciB0ZXN0aW5nXG4gICAgc2V0RXZlbnRNYW5hZ2VyKGV2ZW50TWFuYWdlcikge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgdGFrZUl0ZW0oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhdHRlbXB0aW5nIHRvIHRha2UgaXRlbS4uLicpXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnaXRlbSB0YWtlbicpXG4gICAgICAgIGNvbnNvbGUubG9nKCdldmVudHMgcmVtYWluaW5nOicsIHRoaXMuRU0uZ2V0RXZlbnRzTGlzdCgpKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50c0xpc3QgPSBbXSAgICAgICAgLy8gY3JlYXRlIGFycmF5IG9mIGV2ZW50c1xuICAgIH1cblxuICAgIHN1YnNjcmliZShldmVudCwgZm4sIHRoaXNWYWx1ZSwgb25jZT1mYWxzZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXNWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHsgICAvLyBpZiBubyB0aGlzVmFsdWUgcHJvdmlkZWQsIGJpbmRzIHRoZSBmbiB0byB0aGUgZm4/P1xuICAgICAgICAgICAgdGhpc1ZhbHVlID0gZm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50c0xpc3QucHVzaCh7ICAgICAgLy8gY3JlYXRlIG9iamVjdHMgbGlua2luZyBldmVudHMgKyBmdW5jdGlvbnMgdG8gcGVyZm9ybVxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LCAgICAgICAgICAgLy8gcHVzaCBlbSB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgICAgICB0aGlzVmFsdWU6IHRoaXNWYWx1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1Ymxpc2goZXZlbnQsIGFyZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRoaXNWYWx1ZSwgZm4sIG9uY2UgfSA9IHRoaXMuZXZlbnRzTGlzdFtpXVxuXG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzVmFsdWUsIGFyZylcblxuICAgICAgICAgICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRFdmVudHNMaXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHNMaXN0XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50TWFuYWdlclxuIiwiaW1wb3J0IE1vdmVhYmxlIGZyb20gJy4vTW92ZWFibGUnXG5cblxuY2xhc3MgSXRlbSBleHRlbmRzIE1vdmVhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcihtYXAsIGl0ZW1PYmplY3QpIHtcbiAgICAgICAgc3VwZXIobWFwKVxuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtT2JqZWN0XG4gICAgICAgIHRoaXMuaW5pdGlhbEdyaWRJbmRpY2VzID0gbWFwLmdldFJhbmRvbU1hcExvY2F0aW9uKClcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXModGhpcy5pbml0aWFsR3JpZEluZGljZXMpXG4gICAgICAgIHRoaXMuc2V0R3JpZEluZGljZXMoKVxuICAgICAgICB0aGlzLnNldENvb3JkaW5hdGVzKClcblxuXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRJdGVtKCksICdpdGVtLWxheWVyJykgIC8vIGlzc3VlcyB3aXRoIHJlbmRlcmluZyBtdWx0aXBsZSBpdGVtc1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGBpdGVtICR7dGhpcy5pdGVtLm5hbWV9IHJlbmRlcmVkIGF0ICR7dGhpcy5pbml0aWFsR3JpZEluZGljZXN9YClcblxuICAgIH1cblxuICAgIGdldEl0ZW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1cbiAgICB9XG5cbiAgICBzZXRDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLml0ZW0ubGVmdCA9IGNzc0xlZnRcbiAgICAgICAgdGhpcy5pdGVtLnRvcCA9IGNzc1RvcFxuICAgIH1cblxuICAgIHNldEdyaWRJbmRpY2VzKCkge1xuICAgICAgICB0aGlzLml0ZW0ueCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgdGhpcy5pdGVtLnkgPSB0aGlzLmdyaWRJbmRpY2VzWzFdXG4gICAgfVxuXG4gICAgLy8gZXZlbnRtYW5hZ2VyIHRlc3RpbmdcblxuICAgIHNldEV2ZW50TWFuYWdlcihldmVudE1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnaXRlbSB0YWtlbicsIHRoaXMub25UYWtlLCB0aGlzKVxuICAgICAgICBjb25zb2xlLmxvZygnZXZlbnRzIGxpc3QnLCB0aGlzLkVNLmdldEV2ZW50c0xpc3QoKSlcbiAgICB9XG5cbiAgICBvblRha2UoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke3RoaXMuaXRlbS5uYW1lfSB0YWtlbiFgKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtXG4iLCJjbGFzcyBJdGVtRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zKClcbiAgICB9XG5cbiAgICBpdGVtcygpIHtcbiAgICAgICAgY29uc3QgcGFydGljbGVNaW5lciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdwYXJ0aWNsZSBtaW5lcicsXG4gICAgICAgICAgICBlbGVtZW50OiAnfCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBjbHM6ICdpdGVtIG1pbmVyJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJsdWVwcmludCA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdibHVlcHJpbnQnLFxuICAgICAgICAgICAgZWxlbWVudDogJz8nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgY2xzOiAnaXRlbSBibHVlcHJpbnQnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJ0aWZpY2lhbE11c2NsZSA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdhcnRpZmljaWFsIG11c2NsZScsXG4gICAgICAgICAgICBlbGVtZW50OiAnJicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBjbHM6ICdpdGVtIG11c2NsZSdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmludGVyID0ge1xuICAgICAgICAgICAgbmFtZTogJzNEIHByaW50ZXInLFxuICAgICAgICAgICAgZWxlbWVudDogJyMnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgY2xzOiAnaXRlbSBwcmludGVyJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGFydGljbGVNaW5lciwgYmx1ZXByaW50LCBhcnRpZmljaWFsTXVzY2xlLCBwcmludGVyXVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtRGF0YSIsImltcG9ydCBJdGVtRGF0YSBmcm9tICcuL0l0ZW1EYXRhJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJ1xuXG5cbmNsYXNzIEl0ZW1HZW5lcmF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKG1hcCwgZXZlbnRNYW5hZ2VyLCBudW1iZXJPZkl0ZW1zKSB7XG4gICAgICAgIHRoaXMubWFwID0gbWFwXG4gICAgICAgIHRoaXMubnVtYmVyT2ZJdGVtcyA9IG51bWJlck9mSXRlbXNcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3IEl0ZW1EYXRhKClcblxuICAgICAgICAvLyBldmVudG1hbmFnZXIgdGVzdGluZ1xuXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcblxuICAgICAgICB0aGlzLmdlbmVyYXRlSXRlbXMoKVxuICAgIH1cblxuICAgIGdldFJhbmRvbUl0ZW1zKCkge1xuICAgICAgICBjb25zdCBhbGxJdGVtcyA9IHRoaXMuZGF0YS5pdGVtc1xuICAgICAgICBjb25zdCByYW5kb21JdGVtcyA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZkl0ZW1zOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUl0ZW0gPSBhbGxJdGVtc1tVdGlsaXR5LnJhbmRvbWl6ZShhbGxJdGVtcy5sZW5ndGgpXVxuICAgICAgICAgICAgcmFuZG9tSXRlbXMucHVzaChyYW5kb21JdGVtKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYW5kb21JdGVtc1xuICAgIH1cblxuICAgIGdlbmVyYXRlSXRlbXMoKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUl0ZW1zID0gdGhpcy5nZXRSYW5kb21JdGVtcygpXG4gICAgICAgIHJhbmRvbUl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5ld0l0ZW0gPSBuZXcgSXRlbSh0aGlzLm1hcCwgaXRlbSlcblxuICAgICAgICAgICAgLy8gZXZlbnRtYW5hZ2VyIHRlc3RpbmdcblxuICAgICAgICAgICAgdGhpcy5uZXdJdGVtLnNldEV2ZW50TWFuYWdlcih0aGlzLkVNKVxuXG4gICAgICAgICAgICB0aGlzLm1hcC5wdXNoSXRlbSh0aGlzLm5ld0l0ZW0uaXRlbSkgIC8vIGhtbW0uLi4gcHVzaEl0ZW1zIHJlZnJlc2hlcyBlYWNoIHRpbWUgZ2VuZXJhdGVJdGVtcyBpcyBjYWxsZWQ/XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaXRlbSBnZW5lcmF0ZWQ6JywgdGhpcy5uZXdJdGVtLml0ZW0pXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW1HZW5lcmF0b3JcbiIsImNsYXNzIExhbmRzY2FwZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZlYXR1cmVzID0gdGhpcy5mZWF0dXJlcygpXG4gICAgICAgIHRoaXMuYmFyZSA9IHRoaXMuYmFyZSgpXG4gICAgfVxuXG4gICAgZmVhdHVyZXMoKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZCA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcuJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFpciBpcyBjaG9rZWQgd2l0aCBkdXN0LCBzdGF0aWMsIHdpZmknLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDMwLFxuICAgICAgICAgICAgY2xzOiAncGVyaW9kJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbW1hID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJywnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdzcHJhd2wgb2Ygc21hcnQgaG9tZXMsIGN1bC1kZS1zYWNzLCBsYW5ld2F5cycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMzAsXG4gICAgICAgICAgICBjbHM6ICdjb21tYSdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pY29sb24gPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnOycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3Jvd3Mgb2YgZ3JlZW5ob3VzZXM6IHNvbWUgc2hhdHRlcmVkIGFuZCBiYXJyZW4sIG90aGVycyBvdmVyZ3Jvd24nLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDE1LFxuICAgICAgICAgICAgY2xzOiAnc2VtaWNvbG9uJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdyYXZlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJ14nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhIHNoaW1tZXJpbmcgZmllbGQgb2Ygc29sYXIgcGFuZWxzLCBicm9rZW4gYW5kIGNvcnJvZGVkJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAxNSxcbiAgICAgICAgICAgIGNsczogJ2dyYXZlJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFzdGVyaXNrID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJyonLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdob2xsb3cgdXNlcnMgamFjayBpbiBhdCB0aGUgZGF0YWh1YnMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDE1LFxuICAgICAgICAgICAgY2xzOiAnYXN0ZXJpc2snXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwZXJpb2QsIGNvbW1hLCBzZW1pY29sb24sIHNlbWljb2xvbiwgYXN0ZXJpc2ssIGFzdGVyaXNrLCBncmF2ZSwgZ3JhdmVdXG4gICAgfVxuXG4gICAgYmFyZSgpIHtcbiAgICAgICAgY29uc3QgYmFyZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmbmJzcDsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjb25jcmV0ZSBhbmQgdHdpc3RlZCByZWJhciBzdHJldGNoIHRvIHRoZSBob3Jpem9uJyxcbiAgICAgICAgICAgIGNsczogJ2JsYW5rJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXJlXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYW5kc2NhcGVEYXRhXG4iLCJpbXBvcnQgTWFwR2VuZXJhdG9yIGZyb20gJy4vTWFwR2VuZXJhdG9yJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIE1hcCB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRNYXAgPSBuZXcgTWFwR2VuZXJhdG9yKGNvbCwgcm93KVxuICAgICAgICB0aGlzLm1hcCA9IHRoaXMuZ2VuZXJhdGVkTWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcCA9IFtdXG4gICAgfVxuXG4gICAgZ2V0TWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXBcbiAgICB9XG5cbiAgICBnZXRNYXBDZW50ZXIoKSB7XG4gICAgICAgIHJldHVybiBbTWF0aC5mbG9vcih0aGlzLmNvbC8yKSwgTWF0aC5mbG9vcih0aGlzLnJvdy8yKV1cbiAgICB9XG5cbiAgICBnZXRSYW5kb21NYXBMb2NhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpLCBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLmNvbCAtIDEpXVxuICAgIH1cblxuICAgIHNldENoYXJhY3RlcihjaGFyYWN0ZXIpIHtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBzZXRFdmVudE1hbmFnZXIoZXZlbnRNYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBwdXNoSXRlbShpdGVtKSB7XG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcC5wdXNoKGl0ZW0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdpdGVtc09uTWFwJywgdGhpcy5pdGVtc09uTWFwKVxuICAgIH1cblxuICAgIGNoZWNrQ2hhcmFjdGVyTG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmNoYXJhY3Rlci5nZXRDaGFyYWN0ZXIoKVxuICAgICAgICB0aGlzLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNoYXIueCAmJlxuICAgICAgICAgICAgICAgIGl0ZW0ueSA9PT0gY2hhci55KSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgY2hhcmFjdGVyIGlzIG9uIHRoZSBzYW1lIGxvY2F0aW9uIGFzIGFuIGl0ZW0sXG4gICAgICAgICAgICAgICAgLy8gcHJpbnQgaXRlbSBkZXNjcmlwdGlvbiBhbmQgYWxsb3cgY2hhcmFjdGVyIHRvIGludGVyYWN0IHdpdGggaXRlbVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFyYWN0ZXIgaXMgYXQgaXRlbSEnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgTGFuZHNjYXBlRGF0YSBmcm9tICcuL0xhbmRzY2FwZURhdGEnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5cblxuY2xhc3MgTWFwR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2wsIHJvdykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2VuZXJhdGluZyBtYXAnKVxuICAgICAgICB0aGlzLmxhbmRzY2FwZVNlZWRzID0gbmV3IExhbmRzY2FwZURhdGEoKVxuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5pbml0KGNvbCwgcm93KVxuICAgICAgICBjb25zdCBzZWVkZWRHcmlkID0gdGhpcy5zZWVkKGdyaWQpXG4gICAgICAgIHRoaXMuc2VlZGVkR3JpZCA9IHNlZWRlZEdyaWRcbiAgICAgICAgdGhpcy5ncm93KClcbiAgICAgICAgY29uc29sZS5sb2coJ21hcCBnZW5lcmF0ZWQnKVxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VlZGVkR3JpZFxuICAgIH1cblxuICAgIGluaXQoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcbiAgICAgICAgY29uc3QgZ3JpZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93OyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2w7IGorKykge1xuICAgICAgICAgICAgICAgIGdyaWRbaV0ucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBzZWVkKGdyaWQpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tRWxlbWVudHMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKTsgaSsrKSB7XG4gICAgICAgICAgICByYW5kb21FbGVtZW50cy5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlcy5sZW5ndGgpXSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWVkcyA9IHRoaXMuZ2VuZXJhdGVTZWVkTG9jYXRpb25zKHJhbmRvbUVsZW1lbnRzKVxuICAgICAgICBzZWVkcy5tYXAoc2VlZCA9PiBncmlkW3NlZWQueV1bc2VlZC54XSA9IHNlZWQpXG4gICAgICAgIHRoaXMuX3NlZWRzID0gc2VlZHNcbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpIHtcbiAgICAgICAgLy8gIHJldHVybiAxICAgICAgICAvLyB0ZXN0IHNldHRpbmdcbiAgICAgICAgLy8gcmV0dXJuICgodGhpcy5jb2wgKiB0aGlzLnJvdykgLyAodGhpcy5fY29sICsgdGhpcy5yb3cpKSAgLy8gc3BhcnNlIGluaXRpYWwgc2VlZGluZ1xuICAgICAgICByZXR1cm4gKHRoaXMuY29sICsgdGhpcy5yb3cpICAvLyByaWNoIGluaXRpYWwgc2VlZGluZ1xuICAgIH1cblxuICAgIGdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cykge1xuICAgICAgICByZXR1cm4gcmFuZG9tRWxlbWVudHMubWFwKGVsID0+IHtcbiAgICAgICAgICAgIGVsLnggPSBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpXG4gICAgICAgICAgICBlbC55ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKVxuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ3JvdygpIHtcbiAgICAgICAgbGV0IHNlZWRzID0gdGhpcy5fc2VlZHNcbiAgICAgICAgbGV0IG1hcFBvcHVsYXRlZCA9IGZhbHNlXG5cbiAgICAgICAgd2hpbGUgKCFtYXBQb3B1bGF0ZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ29vZFNlZWRzID0gW11cbiAgICAgICAgICAgIHRoaXMuZ29vZFNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB0aGlzLm5leHRHZW5lcmF0aW9uU2VlZHMoc2VlZHMpLmZvckVhY2goKHNlZWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1NlZWQoc2VlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZFNlZWRzLnB1c2godGhpcy5jaGVja1NlZWQoc2VlZCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGZvciAobGV0IGdvb2RTZWVkIG9mIGdvb2RTZWVkcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPSBnb29kU2VlZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5jb3VudFVuc2VlZGVkTG9jYXRpb25zKCkpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3VudFVuc2VlZGVkTG9jYXRpb25zKCkge1xuICAgICAgICBjb25zdCBmbGF0dGVuZWRHcmlkID0gW10uY29uY2F0LmFwcGx5KFtdLCB0aGlzLnNlZWRlZEdyaWQpXG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSBvZiBmbGF0dGVuZWRHcmlkKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICAgICAgY291bnQrK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudFxuICAgIH1cblxuICAgIGNoZWNrU2VlZChzZWVkKSB7XG4gICAgICAgIGxldCBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICBpZiAoKHNlZWQueCA8IHRoaXMuY29sICYmIHNlZWQueCA+PSAwKSAmJlxuICAgICAgICAgICAgKHNlZWQueSA8IHRoaXMucm93ICYmIHNlZWQueSA+PSAwKSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW3NlZWQueV1bc2VlZC54XSAhPT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nb29kU2VlZHMuZm9yRWFjaChnb29kU2VlZCA9PiB7XG4gICAgICAgICAgICBpZiAoKHNlZWQueCA9PT0gZ29vZFNlZWQueCkgJiZcbiAgICAgICAgICAgICAgICAoc2VlZC55ID09PSBnb29kU2VlZC55KSkge1xuICAgICAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHNlZWRTdWNjZWVkcykge1xuICAgICAgICAgICAgcmV0dXJuIHNlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKSB7XG4gICAgICAgIGNvbnN0IG5leHRHZW5TZWVkcyA9IFtdXG4gICAgICAgIHNlZWRzLmZvckVhY2goKG9yaWdpbmFsU2VlZCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIGluIERJUkVDVElPTlMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb25WYWx1ZXMgPSBESVJFQ1RJT05TW2RpcmVjdGlvbl1cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0R2VuU2VlZCA9IE9iamVjdC5hc3NpZ24oe30sIG9yaWdpbmFsU2VlZClcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9iYWJpbGl0eShuZXh0R2VuU2VlZC5wcm9iYWJpbGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGRpcmVjdGlvblZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZC54ID0gb3JpZ2luYWxTZWVkLnggKyBkaXJlY3Rpb25WYWx1ZXNba2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueSA9IG9yaWdpbmFsU2VlZC55ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZHMucHVzaChuZXh0R2VuU2VlZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMubmV4dEdlblNlZWRzID0gbmV4dEdlblNlZWRzXG4gICAgICAgIHJldHVybiBuZXh0R2VuU2VlZHNcbiAgICB9XG5cbiAgICBwcm9iYWJpbGl0eShwZXJjZW50YWdlKSB7XG4gICAgICAgIGNvbnN0IHByb2JhYmlsaXR5QXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcmNlbnRhZ2U7IGkrKykge1xuICAgICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKHRydWUpXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAgLSBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaChmYWxzZSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvYmFiaWxpdHlBcnJheVtVdGlsaXR5LnJhbmRvbWl6ZSgxMDApXVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwR2VuZXJhdG9yXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5cblxuXG5jbGFzcyBNb3ZlYWJsZSBleHRlbmRzIFJlbmRlcmFibGUgeyAgLy8gbW92ZW1lbnQgYW5kIHBsYWNlbWVudCBvbiB0aGUgZ3JpZFxuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMuZ290TWFwID0gbWFwLmdldE1hcCgpXG4gICAgfVxuXG4gICAgY3JlYXRlTW92ZWFibGVMYXllcihtb3ZlYWJsZU9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJVbml0KG1vdmVhYmxlT2JqZWN0KVxuICAgIH1cblxuICAgIHVwZGF0ZUxheWVyKG1vdmVhYmxlT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5jcmVhdGVNb3ZlYWJsZUxheWVyKG1vdmVhYmxlT2JqZWN0KSlcbiAgICB9XG5cbiAgICByZW5kZXJMYXllcihtb3ZlYWJsZU9iamVjdCwgbGF5ZXJJZCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUxheWVyKG1vdmVhYmxlT2JqZWN0KVxuICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgIH1cblxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpO1xuICAgIH1cblxuICAgIHNldEluaXRpYWxHcmlkSW5kaWNlcyhncmlkSW5kaWNlcykge1xuICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gZ3JpZEluZGljZXNcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdXVt0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgIH1cblxuICAgIGdldEdyaWRJbmRpY2VzKCkge1xuICAgICAgICBjb25zdCB4ID0gdGhpcy5ncmlkSW5kaWNlc1swXVxuICAgICAgICBjb25zdCB5ID0gdGhpcy5ncmlkSW5kaWNlc1sxXVxuICAgICAgICByZXR1cm4geyB4LCB5IH1cbiAgICB9XG5cbiAgICB1cGRhdGVHcmlkSW5kaWNlcyhhY3RvciwgbW92ZSkge1xuICAgICAgICBjb25zdCBuZXdHcmlkSW5kaWNlcyA9IFt0aGlzLmdyaWRJbmRpY2VzWzBdICsgbW92ZS54LCB0aGlzLmdyaWRJbmRpY2VzWzFdICsgbW92ZS55XVxuICAgICAgICBsZXQgbG9jYXRpb24gPSAnJ1xuICAgICAgICBpZiAodGhpcy5jaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSkge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gbmV3R3JpZEluZGljZXNcbiAgICAgICAgICAgIGFjdG9yLnggPSBuZXdHcmlkSW5kaWNlc1swXVxuICAgICAgICAgICAgYWN0b3IueSA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2NhdGlvbiA9IHRoaXMuZ290TWFwW3RoaXMuZ3JpZEluZGljZXNbMV0sIHRoaXMuZ3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAoYWN0b3IubmFtZSA9PT0gJ2NoYXJhY3RlcicpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInlvdSd2ZSByZWFjaGVkIHRoZSBtYXAncyBlZGdlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uXG4gICAgfVxuXG4gICAgY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykge1xuICAgICAgICBsZXQgbG9jYXRpb25PbkdyaWQgPSBmYWxzZVxuICAgICAgICBpZiAodGhpcy5nb3RNYXBbbmV3R3JpZEluZGljZXNbMV1dKSB7XG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuZ290TWFwW25ld0dyaWRJbmRpY2VzWzFdXVtuZXdHcmlkSW5kaWNlc1swXV1cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uT25HcmlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhdGlvbk9uR3JpZFxuICAgIH1cblxuICAgIGdldENTU0hlaWdodEFuZFdpZHRoKCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bml0JylcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClcbiAgICAgICAgY29uc3Qgd2lkdGggPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJykpXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IFV0aWxpdHkuc3RyaW5nVG9OdW1iZXIoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JykpXG4gICAgICAgIHJldHVybiB7IHdpZHRoLCBoZWlnaHQgfVxuICAgIH1cblxuICAgIGdldENTU0Nvb3JkaW5hdGVzKCkge1xuICAgICAgICBjb25zdCBjc3MgPSB0aGlzLmdldENTU0hlaWdodEFuZFdpZHRoKClcbiAgICAgICAgY29uc3QgY3NzTGVmdCA9IHRoaXMuZ3JpZEluZGljZXNbMF0gKiBjc3MuaGVpZ2h0XG4gICAgICAgIGNvbnN0IGNzc1RvcCA9IHRoaXMuZ3JpZEluZGljZXNbMV0gKiBjc3Mud2lkdGhcbiAgICAgICAgcmV0dXJuIHsgY3NzTGVmdCwgY3NzVG9wIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgTW92ZWFibGVcbiIsImNsYXNzIFJlbmRlcmFibGUgeyAgLy8gZ2VuZXJhbGl6ZWQgcmVuZGVyIGZ1bmN0aW9ucyBmb3IgU2NlbmVyeSwgQ2hhcmFjdGVyXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgc2V0TGF5ZXIobGF5ZXIpIHtcbiAgICAgICAgdGhpcy5sYXllciA9IGxheWVyXG4gICAgfVxuXG4gICAgZ2V0TGF5ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxheWVyXG4gICAgfVxuXG4gICAgcmVuZGVyVW5pdCh1bml0KSB7ICAgICAgLy8gaXNzdWUgd2hlbiBJVEVNUyBhcmUgcmVuZGVyZWQ6IGNhbm5vdCByZW5kZXIgbXVsdGlwbGUgaXRlbXMgb24gb25lIGxheWVyPz9cbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQudG9wICYmIHVuaXQubGVmdCkge1xuICAgICAgICAgICAgc3R5bGUgPSBgdG9wOiAke3VuaXQudG9wfXB4OyBsZWZ0OiAke3VuaXQubGVmdH1weGBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidW5pdCAke2Nsc31cIiBzdHlsZT1cIiR7c3R5bGV9XCI+JHtlbGVtZW50fTwvc3Bhbj5gXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlcmFibGVcbiIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4vUmVuZGVyYWJsZSdcblxuXG5jbGFzcyBTY2VuZXJ5IGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBTY2VuZXJ5LXNwZWNpZmljIHJlbmRlcmluZyBmdW5jdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLmdvdE1hcCA9IG1hcC5nZXRNYXAoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKClcbiAgICAgICAgY29uc29sZS5sb2coJ3NjZW5lcnkgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKCkge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5nb3RNYXAubWFwKGFyciA9PiB7IHJldHVybiBhcnIuc2xpY2UoKSB9KVxuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMuY3JlYXRlTGF5ZXIoZ3JpZCkpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVMYXllcihncmlkKSB7XG4gICAgICAgIGNvbnN0IHNjZW5lcnlHcmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3dJdGVtcyA9IGdyaWRbaV1cbiAgICAgICAgICAgIGxldCByb3cgPSAnJyAgLy8gcG9zc2libHkgbWFrZSBlYWNoIHJvdyBhIHRhYmxlP1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyArPSB0aGlzLnJlbmRlclVuaXQocm93SXRlbXNbaV0pIC8vIGFkZCByZW5kZXJlZCBpdGVtcyB0byB0aGUgZ3JpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NlbmVyeUdyaWQucHVzaChyb3cpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjZW5lcnlHcmlkXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKCkge1xuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBjb25zdCBncmlkVG9IVE1MID0gbGF5ZXIuam9pbignPGJyIC8+JykgIC8vIHVzaW5nIEhUTUwgYnJlYWtzIGZvciBub3dcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZHNjYXBlLWxheWVyJylcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gZ3JpZFRvSFRNTFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTY2VuZXJ5XG4iLCJjbGFzcyBTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKEVNKSB7XG4gICAgICAgIEVNLnN1YnNjcmliZSgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy51cGRhdGUsIHRoaXMpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZGVsYXk9MCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1xuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIFVzZXJJbnB1dCB7XG4gICAgY29uc3RydWN0b3Ioa2V5QWN0aW9uTWFwKSB7XG4gICAgICAgIHRoaXMua2V5QWN0aW9uTWFwID0ga2V5QWN0aW9uTWFwXG5cbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy50cnlBY3Rpb25Gb3JFdmVudC5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgdHJ5QWN0aW9uRm9yRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFVdGlsaXR5LmNvbnRhaW5zKHRoaXMua2V5QWN0aW9uTWFwLCBldmVudC5rZXlDb2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYG5vdCBhIHZhbGlkIGtleWNvZGU6ICR7ZXZlbnQua2V5Q29kZX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXBbZXZlbnQua2V5Q29kZV0oKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJJbnB1dFxuIiwiY2xhc3MgVXRpbGl0eSB7XG4gICAgc3RhdGljIGNvbnRhaW5zKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuaW5kZXhPZihTdHJpbmcocHJvcGVydHkpKSAhPT0gLTFcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RyaW5nVG9OdW1iZXIoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcubWF0Y2goL1xcZCsvKVswXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb21pemUobXVsdCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXVsdClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eVxuIiwiY29uc3QgRElSRUNUSU9OUyA9IHtcbiAgICBub3J0aDogeyB4OiAwLCB5OiAtMSB9LFxuICAgIHNvdXRoOiB7IHg6IDAsIHk6IDEgfSxcbiAgICBlYXN0OiB7IHg6IDEsIHk6IDAgfSxcbiAgICB3ZXN0OiB7IHg6IC0xLCB5OiAwIH0sXG4gICAgbm9ydGh3ZXN0OiB7IHg6IC0xLCB5OiAtMSB9LFxuICAgIG5vcnRoZWFzdDogeyB4OiAxLCB5OiAtMSB9LFxuICAgIHNvdXRoZWFzdDogeyB4OiAxLCB5OiAxIH0sXG4gICAgc291dGh3ZXN0OiB7IHg6IC0xLCB5OiAxIH1cbn1cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJpbXBvcnQgTWFwIGZyb20gJy4vTWFwJ1xuaW1wb3J0IFNjZW5lcnkgZnJvbSAnLi9TY2VuZXJ5J1xuaW1wb3J0IENoYXJhY3RlciBmcm9tICcuL0NoYXJhY3RlcidcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSAnLi9FdmVudE1hbmFnZXInXG5pbXBvcnQgSXRlbUdlbmVyYXRvciBmcm9tICcuL0l0ZW1HZW5lcmF0b3InXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4vU3RhdHVzJ1xuaW1wb3J0IFVzZXJJbnB1dCBmcm9tICcuL1VzZXJJbnB1dCdcbmltcG9ydCBCbHVlcHJpbnRzIGZyb20gJy4vQmx1ZXByaW50cydcblxuXG5jbGFzcyBHYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0R2FtZSgpXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKClcbiAgICB9XG5cbiAgICBpbml0R2FtZSgpIHtcbiAgICAgICAgdGhpcy5zcGFjZXMgPSBbXVxuICAgICAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2VcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgTWFwKDYwLCA2MClcbiAgICAgICAgdGhpcy5zY2VuZXJ5ID0gbmV3IFNjZW5lcnkodGhpcy5tYXApXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gbmV3IENoYXJhY3Rlcih0aGlzLm1hcClcbiAgICAgICAgdGhpcy5tYXAuc2V0Q2hhcmFjdGVyKHRoaXMuY2hhcmFjdGVyKSAgLy8gZ2l2ZXMgbWFwIHJlZmVyZW5jZSB0byBjaGFyYWN0ZXJcblxuXG4gICAgICAgIC8vIGV2ZW50bWFuYWdlciB0ZXN0aW5nXG4gICAgICAgIHRoaXMuRU0gPSBuZXcgRXZlbnRNYW5hZ2VyKCkgIC8vIGNyZWF0ZSBvbmx5IG9uZSBFTSA/IG9yIG11bHRpcGxlID9cbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuc2V0RXZlbnRNYW5hZ2VyKHRoaXMuRU0pXG4gICAgICAgIHRoaXMubWFwLnNldEV2ZW50TWFuYWdlcih0aGlzLkVNKVxuXG4gICAgICAgIC8vIHRyeSBnZW5lcmF0aW5nIGZyb20gYSBzZXQgb2Ygc3RvY2sgaXRlbXNcbiAgICAgICAgLy8gYnVnOiBvbmx5IHRoZSBsYXN0IGl0ZW0gZ2VuZXJhdGVkIHdpbGwgZGlzcGxheSEhXG4gICAgICAgIC8vIHRlc3Rpbmcgd2l0aCBvbmUgaXRlbSBnZW5lcmF0ZWQgLi4uXG4gICAgICAgIHRoaXMuaXRlbUdlbmVyYXRvciA9IG5ldyBJdGVtR2VuZXJhdG9yKHRoaXMubWFwLCB0aGlzLkVNLCA1KSAgLy8gaGF2ZSB0byBwYXNzIGluIEVNIHRvIGdlbmVyYXRvciAoaW5lbGVnYW50KVxuXG4gICAgICAgIHRoaXMuc3RhdHVzID0gbmV3IFN0YXR1cyh0aGlzLkVNKVxuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoJ3lvdSB3YWtlIHVwJylcbiAgICAgICAgdGhpcy5ibHVlcHJpbnQgPSBCbHVlcHJpbnRzLnJhbmRvbSgpXG4gICAgICAgIHRoaXMuc3RhdHVzLnNldChgeW91IGFyZSBjYXJyeWluZyAke3RoaXMuYmx1ZXByaW50Lm5hbWV9YCwgNDAwMClcblxuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy5pbml0VXNlcklucHV0KClcbiAgICB9XG5cbiAgICBpbml0VXNlcklucHV0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFVzZXJJbnB1dCh7XG4gICAgICAgICAgICAnMzgnOiB0aGlzLmNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnbm9ydGgnKSxcbiAgICAgICAgICAgICczNyc6IHRoaXMuY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICd3ZXN0JyksXG4gICAgICAgICAgICAnMzknOiB0aGlzLmNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnZWFzdCcpLFxuICAgICAgICAgICAgJzQwJzogdGhpcy5jaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3NvdXRoJyksXG4gICAgICAgICAgICAnODQnOiB0aGlzLmNoYXJhY3Rlci5nZXRBY3Rpb24oJ3Rha2VJdGVtJywgJ2l0ZW0nKSAvLyAodClha2UgaXRlbVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0IScpXG4gICAgfVxuXG4gICAgZ2FtZUlzT3ZlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZU92ZXJcbiAgICB9XG5cbiAgICBleHBsb3JlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgZXhwbG9yaW5nIHRoZSAke3RoaXMua2luZH0gem9uZSFgKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZSgpO1xuIl19
