(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _game = require('./js/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.game = _game2.default;

},{"./js/game":18}],2:[function(require,module,exports){
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

var _Constants = require('./Constants');

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
        _this.item = null;
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
            this.map.checkCharacterLocation();

            if (this.EM) {
                this.EM.publish('character-moved', this.location);
            }

            this.renderLayer(this.getCharacter(), 'character-layer');
        }
    }, {
        key: 'setEventManager',
        value: function setEventManager(eventManager) {
            var _this2 = this;

            this.EM = eventManager;
            // console.log('character knows about items', this.map.itemsOnMap)
            this.map.itemsOnMap.forEach(function (item) {
                _this2.EM.subscribe('on-' + item.name, _this2.onItem, _this2, true);
                _this2.EM.subscribe('take-' + item.name, _this2.takeItem, _this2, true);
            });
        }
    }, {
        key: 'onItem',
        value: function onItem(item) {
            this.item = item;
            console.log('character is at ' + item.name + '!');
            this.item.takeable = true;
            this.EM.subscribe('off-' + item.name, this.offItem, this, true);
        }
    }, {
        key: 'offItem',
        value: function offItem(item) {
            this.item = item;
            // console.log(`character is no longer on ${this.item.name}`)
            this.EM.subscribe('on-' + item.name, this.onItem, this, true);
            this.item.takeable = false;
        }
    }, {
        key: 'take',
        value: function take() {
            // console.log('attempting to take item...')
            if (this.item) {
                this.EM.publish('take-' + this.item.name, this.item);
            } else {
                console.log('nothing to take!');
            }
        }
    }, {
        key: 'takeItem',
        value: function takeItem(item) {
            if (item.takeable) {
                this.EM.publish(item.name + ' taken');
                // console.log('events remaining:', this.EM.getEventsList())
            }
        }
    }]);

    return Character;
}(_Moveable3.default);

exports.default = Character;

},{"./Constants":4,"./Moveable":12}],4:[function(require,module,exports){
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

    function Item(map, itemObject, generatorIndex) {
        _classCallCheck(this, Item);

        var _this = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).call(this, map));

        _this.item = itemObject;
        _this.item.type = 'item';
        _this.item.offMap = false;
        _this.item.inInventory = false;
        _this.initialGridIndices = map.getRandomMapLocation();
        _this.setInitialGridIndices(_this.initialGridIndices);
        _this.setGridIndices();
        _this.setCoordinates();

        _this.setDiv(generatorIndex);

        _this.updateDiv(_this.getItem());
        _this.createInitialChildElement('item-layer');
        console.log('item "' + _this.item.name + '" rendered at ' + _this.initialGridIndices);
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
    }, {
        key: 'setDiv',
        value: function setDiv(generatorIndex) {
            this.item.div = this.item.div + generatorIndex;
        }
    }, {
        key: 'setEventManager',
        value: function setEventManager(eventManager) {
            this.EM = eventManager;
            this.EM.subscribe(this.item.name + ' taken', this.onTake, this, true);
        }
    }, {
        key: 'onTake',
        value: function onTake() {
            console.log(this.item.name + ' taken!');

            this.item.offMap = true; //
            this.item.inInventory = true;

            this.item.x = null;
            this.item.y = null;

            this.renderLayer(this.getItem(), this.item.div);
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
                type: 'item',
                element: '|',
                description: '',
                div: 'item-miner'
            };
            var blueprint = {
                name: 'blueprint',
                type: 'item',
                element: '?',
                description: '',
                div: 'item-blueprint'
            };
            var artificialMuscle = {
                name: 'artificial muscle',
                type: 'item',
                element: '&',
                description: '',
                div: 'item-muscle'
            };
            var printer = {
                name: '3D printer',
                type: 'item',
                element: '#',
                description: '',
                div: 'item-printer'
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

        // issues with items overwriting one another...

    }, {
        key: 'generateItems',
        value: function generateItems() {
            var _this = this;

            var randomItems = this.getRandomItems();
            randomItems.forEach(function (item, index) {
                _this.newItem = new _Item2.default(_this.map, item, index);

                _this.newItem.setEventManager(_this.EM);

                _this.map.pushItem(_this.newItem.item);
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
            // console.log('itemsOnMap', this.itemsOnMap)
        }
    }, {
        key: 'checkCharacterLocation',
        value: function checkCharacterLocation() {
            var _this = this;

            var char = this.character.getCharacter();
            this.itemsOnMap.forEach(function (item) {
                if (item.x === char.x && item.y === char.y) {
                    _this.EM.publish('on-' + item.name, item);
                } else {
                    _this.EM.publish('off-' + item.name, item);
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
        EM.subscribe('');
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


            this.itemGenerator = new _ItemGenerator2.default(this.map, this.EM, 6); // have to pass in EM to generator (inelegant)

            this.character.setEventManager(this.EM);
            this.map.setEventManager(this.EM);

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

                '84': this.character.getAction('take', 'item') // (t)ake item
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0V2ZW50TWFuYWdlci5qcyIsInNyYy9qcy9JdGVtLmpzIiwic3JjL2pzL0l0ZW1EYXRhLmpzIiwic3JjL2pzL0l0ZW1HZW5lcmF0b3IuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZ2FtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLE9BQU8sSUFBUDs7Ozs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7QUFHQSxJQUFNLGdCQUFnQjtBQUNsQixzQkFBa0I7QUFDZCxjQUFNLG1CQURRO0FBRWQscUJBQWEsRUFGQztBQUdkLG1CQUFXLEVBSEc7QUFJZCxzQkFBYztBQUpBLEtBREE7QUFPbEIsb0JBQWdCO0FBQ1osY0FBTSxpQkFETTtBQUVaLHFCQUFhLEVBRkQ7QUFHWixtQkFBVyxFQUhDO0FBSVosc0JBQWM7QUFKRixLQVBFO0FBYWxCLG1CQUFlO0FBQ1gsY0FBTSxnQkFESztBQUVYLHFCQUFhLEVBRkY7QUFHWCxtQkFBVyxFQUhBO0FBSVgsc0JBQWM7QUFKSDtBQWJHLENBQXRCOztJQXNCTSxTO0FBQ0YsdUJBQVksSUFBWixFQUFrQixXQUFsQixFQUErQjtBQUFBOztBQUMzQixhQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsYUFBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0g7Ozs7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QixNQUF6QixFQUFpQyxPQUFqQyxDQUpXOztBQU1qQixzQkFBTSxLQUFLLFNBQUwsQ0FBZSxTQUFmLENBQXlCLE1BQXpCLEVBQWlDLE1BQWpDLENBTlcsQ0FNOEI7QUFOOUIsYUFBZCxDQUFQO0FBUUg7OztvQ0FFVztBQUNSLG9CQUFRLEdBQVIsQ0FBWSxRQUFaO0FBQ0g7OztxQ0FFWTtBQUNULG1CQUFPLEtBQUssUUFBWjtBQUNIOzs7a0NBRVM7QUFDTixvQkFBUSxHQUFSLG9CQUE2QixLQUFLLElBQWxDO0FBQ0g7Ozs7OztrQkFJVSxJQUFJLElBQUosRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi9qcy9nYW1lJ1xuXG53aW5kb3cuZ2FtZSA9IGdhbWVcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jb25zdCBibHVlcHJpbnREYXRhID0ge1xuICAgIGFydGlmaWNpYWxNdXNjbGU6IHtcbiAgICAgICAgbmFtZTogJ0FydGlmaWNpYWwgTXVzY2xlJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICByZXRpbmFsRGlzcGxheToge1xuICAgICAgICBuYW1lOiAnUmV0aW5hbCBEaXNwbGF5JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICBwcm9zdGhldGljQXJtOiB7XG4gICAgICAgIG5hbWU6ICdQcm9zdGhldGljIEFybScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH1cbn1cblxuXG5jbGFzcyBCbHVlcHJpbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbSgpIHtcbiAgICAgICAgY29uc3QgYmx1ZXByaW50VmFsdWVzID0gT2JqZWN0LnZhbHVlcyhibHVlcHJpbnREYXRhKVxuICAgICAgICBjb25zdCBpbmRleCA9IFV0aWxpdHkucmFuZG9taXplKGJsdWVwcmludFZhbHVlcy5sZW5ndGgpXG5cbiAgICAgICAgY29uc3QgcmFuZG9tQmx1ZXByaW50ID0gYmx1ZXByaW50VmFsdWVzW2luZGV4XVxuXG4gICAgICAgIHJldHVybiBuZXcgQmx1ZXByaW50KHJhbmRvbUJsdWVwcmludC5uYW1lLCByYW5kb21CbHVlcHJpbnQuZGVzY3JpcHRpb24pXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEJsdWVwcmludFxuXG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcbmltcG9ydCB7IERJUkVDVElPTlMgfSBmcm9tICcuL0NvbnN0YW50cydcblxuXG5jbGFzcyBDaGFyYWN0ZXIgZXh0ZW5kcyBNb3ZlYWJsZSB7ICAvLyBDaGFyYWN0ZXIgZGF0YSBhbmQgYWN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcihtYXApXG4gICAgICAgIHRoaXMubWFwID0gbWFwXG4gICAgICAgIHRoaXMuRU0gPSBudWxsXG4gICAgICAgIHRoaXMuaXRlbSA9IG51bGxcbiAgICAgICAgdGhpcy5pbml0aWFsR3JpZEluZGljZXMgPSBtYXAuZ2V0TWFwQ2VudGVyKClcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXModGhpcy5pbml0aWFsR3JpZEluZGljZXMpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFyYWN0ZXIgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIGdldENoYXJhY3RlcigpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdhY3RvcicsXG4gICAgICAgICAgICBlbGVtZW50OiAnQCcsXG4gICAgICAgICAgICBjbHM6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgbGVmdDogY3NzTGVmdCxcbiAgICAgICAgICAgIHRvcDogY3NzVG9wLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgZ2V0QWN0aW9uKGZuTmFtZSwgYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2ZuTmFtZV0uYmluZCh0aGlzLCBhcmcpXG4gICAgfVxuXG4gICAgbW92ZShkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IHRoaXMudXBkYXRlR3JpZEluZGljZXModGhpcy5nZXRDaGFyYWN0ZXIoKSwgRElSRUNUSU9OU1tkaXJlY3Rpb25dKVxuICAgICAgICB0aGlzLm1hcC5jaGVja0NoYXJhY3RlckxvY2F0aW9uKClcblxuICAgICAgICBpZiAodGhpcy5FTSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLmxvY2F0aW9uKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcbiAgICB9XG5cbiAgICBzZXRFdmVudE1hbmFnZXIoZXZlbnRNYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NoYXJhY3RlciBrbm93cyBhYm91dCBpdGVtcycsIHRoaXMubWFwLml0ZW1zT25NYXApXG4gICAgICAgIHRoaXMubWFwLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGBvbi0ke2l0ZW0ubmFtZX1gLCB0aGlzLm9uSXRlbSwgdGhpcywgdHJ1ZSlcbiAgICAgICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGB0YWtlLSR7aXRlbS5uYW1lfWAsIHRoaXMudGFrZUl0ZW0sIHRoaXMsIHRydWUpXG5cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBvbkl0ZW0oaXRlbSkge1xuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtXG4gICAgICAgIGNvbnNvbGUubG9nKGBjaGFyYWN0ZXIgaXMgYXQgJHtpdGVtLm5hbWV9IWApXG4gICAgICAgIHRoaXMuaXRlbS50YWtlYWJsZSA9IHRydWVcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYG9mZi0ke2l0ZW0ubmFtZX1gLCB0aGlzLm9mZkl0ZW0sIHRoaXMsIHRydWUpXG4gICAgfVxuXG4gICAgb2ZmSXRlbShpdGVtKSB7XG4gICAgICAgIHRoaXMuaXRlbSA9IGl0ZW1cbiAgICAgICAgLy8gY29uc29sZS5sb2coYGNoYXJhY3RlciBpcyBubyBsb25nZXIgb24gJHt0aGlzLml0ZW0ubmFtZX1gKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgb24tJHtpdGVtLm5hbWV9YCwgdGhpcy5vbkl0ZW0sIHRoaXMsIHRydWUpXG4gICAgICAgIHRoaXMuaXRlbS50YWtlYWJsZSA9IGZhbHNlXG4gICAgfVxuXG4gICAgdGFrZSgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2F0dGVtcHRpbmcgdG8gdGFrZSBpdGVtLi4uJylcbiAgICAgICAgaWYgKHRoaXMuaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGB0YWtlLSR7dGhpcy5pdGVtLm5hbWV9YCwgdGhpcy5pdGVtKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vdGhpbmcgdG8gdGFrZSEnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGFrZUl0ZW0oaXRlbSkge1xuICAgICAgICBpZiAoaXRlbS50YWtlYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGAke2l0ZW0ubmFtZX0gdGFrZW5gKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2V2ZW50cyByZW1haW5pbmc6JywgdGhpcy5FTS5nZXRFdmVudHNMaXN0KCkpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyXG4iLCJjb25zdCBESVJFQ1RJT05TID0ge1xuICAgIG5vcnRoOiB7IHg6IDAsIHk6IC0xIH0sXG4gICAgc291dGg6IHsgeDogMCwgeTogMSB9LFxuICAgIGVhc3Q6IHsgeDogMSwgeTogMCB9LFxuICAgIHdlc3Q6IHsgeDogLTEsIHk6IDAgfSxcbiAgICBub3J0aHdlc3Q6IHsgeDogLTEsIHk6IC0xIH0sXG4gICAgbm9ydGhlYXN0OiB7IHg6IDEsIHk6IC0xIH0sXG4gICAgc291dGhlYXN0OiB7IHg6IDEsIHk6IDEgfSxcbiAgICBzb3V0aHdlc3Q6IHsgeDogLTEsIHk6IDEgfVxufVxuXG5cbmV4cG9ydCB7IERJUkVDVElPTlMgfVxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudHNMaXN0ID0gW10gICAgICAgIC8vIGNyZWF0ZSBhcnJheSBvZiBldmVudHNcbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoZXZlbnQsIGZuLCB0aGlzVmFsdWUsIG9uY2U9ZmFsc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7ICAgLy8gaWYgbm8gdGhpc1ZhbHVlIHByb3ZpZGVkLCBiaW5kcyB0aGUgZm4gdG8gdGhlIGZuPz9cbiAgICAgICAgICAgIHRoaXNWYWx1ZSA9IGZuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ldmVudHNMaXN0LnB1c2goeyAgICAgIC8vIGNyZWF0ZSBvYmplY3RzIGxpbmtpbmcgZXZlbnRzICsgZnVuY3Rpb25zIHRvIHBlcmZvcm1cbiAgICAgICAgICAgIGV2ZW50OiBldmVudCwgICAgICAgICAgIC8vIHB1c2ggZW0gdG8gdGhlIGFycmF5XG4gICAgICAgICAgICBmbjogZm4sXG4gICAgICAgICAgICBvbmNlOiBvbmNlLFxuICAgICAgICAgICAgdGhpc1ZhbHVlOiB0aGlzVmFsdWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyB1bnN1YnNjcmliZShldmVudCkge1xuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgLy8gICAgICAgICAgICAgYnJlYWtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIHB1Ymxpc2goZXZlbnQsIGFyZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRoaXNWYWx1ZSwgZm4sIG9uY2UgfSA9IHRoaXMuZXZlbnRzTGlzdFtpXVxuICAgICAgICAgICAgICAgIGZuLmNhbGwodGhpc1ZhbHVlLCBhcmcpXG4gICAgICAgICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNMaXN0LnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEV2ZW50c0xpc3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50c0xpc3RcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRNYW5hZ2VyXG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcblxuXG5jbGFzcyBJdGVtIGV4dGVuZHMgTW92ZWFibGUge1xuICAgIGNvbnN0cnVjdG9yKG1hcCwgaXRlbU9iamVjdCwgZ2VuZXJhdG9ySW5kZXgpIHtcbiAgICAgICAgc3VwZXIobWFwKVxuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtT2JqZWN0XG4gICAgICAgIHRoaXMuaXRlbS50eXBlID0gJ2l0ZW0nXG4gICAgICAgIHRoaXMuaXRlbS5vZmZNYXAgPSBmYWxzZVxuICAgICAgICB0aGlzLml0ZW0uaW5JbnZlbnRvcnkgPSBmYWxzZVxuICAgICAgICB0aGlzLmluaXRpYWxHcmlkSW5kaWNlcyA9IG1hcC5nZXRSYW5kb21NYXBMb2NhdGlvbigpXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbEdyaWRJbmRpY2VzKHRoaXMuaW5pdGlhbEdyaWRJbmRpY2VzKVxuICAgICAgICB0aGlzLnNldEdyaWRJbmRpY2VzKClcbiAgICAgICAgdGhpcy5zZXRDb29yZGluYXRlcygpXG5cbiAgICAgICAgdGhpcy5zZXREaXYoZ2VuZXJhdG9ySW5kZXgpXG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXYodGhpcy5nZXRJdGVtKCkpXG4gICAgICAgIHRoaXMuY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudCgnaXRlbS1sYXllcicpXG4gICAgICAgIGNvbnNvbGUubG9nKGBpdGVtIFwiJHt0aGlzLml0ZW0ubmFtZX1cIiByZW5kZXJlZCBhdCAke3RoaXMuaW5pdGlhbEdyaWRJbmRpY2VzfWApXG4gICAgfVxuXG4gICAgZ2V0SXRlbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbVxuICAgIH1cblxuICAgIHNldENvb3JkaW5hdGVzKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMuaXRlbS5sZWZ0ID0gY3NzTGVmdFxuICAgICAgICB0aGlzLml0ZW0udG9wID0gY3NzVG9wXG4gICAgfVxuXG4gICAgc2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIHRoaXMuaXRlbS54ID0gdGhpcy5ncmlkSW5kaWNlc1swXVxuICAgICAgICB0aGlzLml0ZW0ueSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cbiAgICB9XG5cbiAgICBzZXREaXYoZ2VuZXJhdG9ySW5kZXgpIHtcbiAgICAgICAgdGhpcy5pdGVtLmRpdiA9IHRoaXMuaXRlbS5kaXYgKyBnZW5lcmF0b3JJbmRleFxuICAgIH1cblxuICAgIHNldEV2ZW50TWFuYWdlcihldmVudE1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHt0aGlzLml0ZW0ubmFtZX0gdGFrZW5gLCB0aGlzLm9uVGFrZSwgdGhpcywgdHJ1ZSlcbiAgICB9XG5cblxuXG5cblxuXG4gICAgb25UYWtlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLml0ZW0ubmFtZX0gdGFrZW4hYClcblxuICAgICAgICB0aGlzLml0ZW0ub2ZmTWFwID0gdHJ1ZSAgLy9cbiAgICAgICAgdGhpcy5pdGVtLmluSW52ZW50b3J5ID0gdHJ1ZVxuXG4gICAgICAgIHRoaXMuaXRlbS54ID0gbnVsbFxuICAgICAgICB0aGlzLml0ZW0ueSA9IG51bGxcblxuXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRJdGVtKCksIHRoaXMuaXRlbS5kaXYpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW1cbiIsImNsYXNzIEl0ZW1EYXRhIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMoKVxuICAgIH1cblxuICAgIGl0ZW1zKCkge1xuICAgICAgICBjb25zdCBwYXJ0aWNsZU1pbmVyID0ge1xuICAgICAgICAgICAgbmFtZTogJ3BhcnRpY2xlIG1pbmVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpdGVtJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICd8JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIGRpdjogJ2l0ZW0tbWluZXInXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmx1ZXByaW50ID0ge1xuICAgICAgICAgICAgbmFtZTogJ2JsdWVwcmludCcsXG4gICAgICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgICAgICBlbGVtZW50OiAnPycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBkaXY6ICdpdGVtLWJsdWVwcmludCdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcnRpZmljaWFsTXVzY2xlID0ge1xuICAgICAgICAgICAgbmFtZTogJ2FydGlmaWNpYWwgbXVzY2xlJyxcbiAgICAgICAgICAgIHR5cGU6ICdpdGVtJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIGRpdjogJ2l0ZW0tbXVzY2xlJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByaW50ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiAnM0QgcHJpbnRlcicsXG4gICAgICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgICAgICBlbGVtZW50OiAnIycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBkaXY6ICdpdGVtLXByaW50ZXInXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwYXJ0aWNsZU1pbmVyLCBibHVlcHJpbnQsIGFydGlmaWNpYWxNdXNjbGUsIHByaW50ZXJdXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW1EYXRhXG4iLCJpbXBvcnQgSXRlbURhdGEgZnJvbSAnLi9JdGVtRGF0YSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcblxuXG5jbGFzcyBJdGVtR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihtYXAsIGV2ZW50TWFuYWdlciwgbnVtYmVyT2ZJdGVtcykge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgICAgICB0aGlzLm51bWJlck9mSXRlbXMgPSBudW1iZXJPZkl0ZW1zXG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBJdGVtRGF0YSgpXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcblxuICAgICAgICB0aGlzLmdlbmVyYXRlSXRlbXMoKVxuICAgIH1cblxuICAgIGdldFJhbmRvbUl0ZW1zKCkge1xuICAgICAgICBjb25zdCBhbGxJdGVtcyA9IHRoaXMuZGF0YS5pdGVtc1xuICAgICAgICBjb25zdCByYW5kb21JdGVtcyA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZkl0ZW1zOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUl0ZW0gPSBhbGxJdGVtc1tVdGlsaXR5LnJhbmRvbWl6ZShhbGxJdGVtcy5sZW5ndGgpXVxuICAgICAgICAgICAgcmFuZG9tSXRlbXMucHVzaChyYW5kb21JdGVtKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYW5kb21JdGVtc1xuICAgIH1cblxuXG4vLyBpc3N1ZXMgd2l0aCBpdGVtcyBvdmVyd3JpdGluZyBvbmUgYW5vdGhlci4uLlxuICAgIGdlbmVyYXRlSXRlbXMoKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUl0ZW1zID0gdGhpcy5nZXRSYW5kb21JdGVtcygpXG4gICAgICAgIHJhbmRvbUl0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5ld0l0ZW0gPSBuZXcgSXRlbSh0aGlzLm1hcCwgaXRlbSwgaW5kZXgpXG5cbiAgICAgICAgICAgIHRoaXMubmV3SXRlbS5zZXRFdmVudE1hbmFnZXIodGhpcy5FTSlcblxuICAgICAgICAgICAgdGhpcy5tYXAucHVzaEl0ZW0odGhpcy5uZXdJdGVtLml0ZW0pXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaXRlbSBnZW5lcmF0ZWQ6JywgdGhpcy5uZXdJdGVtLml0ZW0pXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW1HZW5lcmF0b3JcbiIsImNsYXNzIExhbmRzY2FwZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZlYXR1cmVzID0gdGhpcy5mZWF0dXJlcygpXG4gICAgICAgIHRoaXMuYmFyZSA9IHRoaXMuYmFyZSgpXG4gICAgfVxuXG4gICAgZmVhdHVyZXMoKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZCA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcuJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFpciBpcyBjaG9rZWQgd2l0aCBkdXN0LCBzdGF0aWMsIHdpZmknLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI1LFxuICAgICAgICAgICAgY2xzOiAncGVyaW9kJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbW1hID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJywnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdzcHJhd2wgb2Ygc21hcnQgaG9tZXMsIGN1bC1kZS1zYWNzLCBsYW5ld2F5cycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjYsXG4gICAgICAgICAgICBjbHM6ICdjb21tYSdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pY29sb24gPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnOycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3Jvd3Mgb2YgZ3JlZW5ob3VzZXM6IHNvbWUgc2hhdHRlcmVkIGFuZCBiYXJyZW4sIG90aGVycyBvdmVyZ3Jvd24nLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI0LFxuICAgICAgICAgICAgY2xzOiAnc2VtaWNvbG9uJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdyYXZlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJ14nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhIHNoaW1tZXJpbmcgZmllbGQgb2Ygc29sYXIgcGFuZWxzLCBicm9rZW4gYW5kIGNvcnJvZGVkJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMixcbiAgICAgICAgICAgIGNsczogJ2dyYXZlJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFzdGVyaXNrID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJyonLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdob2xsb3cgdXNlcnMgamFjayBpbiBhdCB0aGUgZGF0YWh1YnMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDIwLFxuICAgICAgICAgICAgY2xzOiAnYXN0ZXJpc2snXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwZXJpb2QsIGNvbW1hLCBzZW1pY29sb24sIHNlbWljb2xvbiwgYXN0ZXJpc2ssIGFzdGVyaXNrLCBncmF2ZSwgZ3JhdmVdXG4gICAgfVxuXG4gICAgYmFyZSgpIHtcbiAgICAgICAgY29uc3QgYmFyZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmbmJzcDsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjb25jcmV0ZSBhbmQgdHdpc3RlZCByZWJhciBzdHJldGNoIHRvIHRoZSBob3Jpem9uJyxcbiAgICAgICAgICAgIGNsczogJ2JsYW5rJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXJlXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYW5kc2NhcGVEYXRhXG4iLCJpbXBvcnQgTWFwR2VuZXJhdG9yIGZyb20gJy4vTWFwR2VuZXJhdG9yJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIE1hcCB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRNYXAgPSBuZXcgTWFwR2VuZXJhdG9yKGNvbCwgcm93KVxuICAgICAgICB0aGlzLm1hcCA9IHRoaXMuZ2VuZXJhdGVkTWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcCA9IFtdXG4gICAgfVxuXG4gICAgZ2V0TWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXBcbiAgICB9XG5cbiAgICBnZXRNYXBDZW50ZXIoKSB7XG4gICAgICAgIHJldHVybiBbTWF0aC5mbG9vcih0aGlzLmNvbC8yKSwgTWF0aC5mbG9vcih0aGlzLnJvdy8yKV1cbiAgICB9XG5cbiAgICBnZXRSYW5kb21NYXBMb2NhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpLCBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLmNvbCAtIDEpXVxuICAgIH1cblxuICAgIHNldENoYXJhY3RlcihjaGFyYWN0ZXIpIHtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBzZXRFdmVudE1hbmFnZXIoZXZlbnRNYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBwdXNoSXRlbShpdGVtKSB7XG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcC5wdXNoKGl0ZW0pXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtc09uTWFwJywgdGhpcy5pdGVtc09uTWFwKVxuICAgIH1cblxuICAgIGNoZWNrQ2hhcmFjdGVyTG9jYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmNoYXJhY3Rlci5nZXRDaGFyYWN0ZXIoKVxuICAgICAgICB0aGlzLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNoYXIueCAmJiBpdGVtLnkgPT09IGNoYXIueSkge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaChgb24tJHtpdGVtLm5hbWV9YCwgaXRlbSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGBvZmYtJHtpdGVtLm5hbWV9YCwgaXRlbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcFxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IExhbmRzY2FwZURhdGEgZnJvbSAnLi9MYW5kc2NhcGVEYXRhJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuXG5cbmNsYXNzIE1hcEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYXRpbmcgbWFwJylcbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVEYXRhKClcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuaW5pdChjb2wsIHJvdylcbiAgICAgICAgY29uc3Qgc2VlZGVkR3JpZCA9IHRoaXMuc2VlZChncmlkKVxuICAgICAgICB0aGlzLnNlZWRlZEdyaWQgPSBzZWVkZWRHcmlkXG4gICAgICAgIHRoaXMuZ3JvdygpXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgZ2VuZXJhdGVkJylcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlZWRlZEdyaWRcbiAgICB9XG5cbiAgICBpbml0KGNvbCwgcm93KSB7XG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG4gICAgICAgIGNvbnN0IGdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdzsgaSsrKSB7XG4gICAgICAgICAgICBncmlkW2ldID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBncmlkW2ldLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgc2VlZChncmlkKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldE51bWJlck9mRWxlbWVudFNlZWRzKCk7IGkrKykge1xuICAgICAgICAgICAgcmFuZG9tRWxlbWVudHMucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXMubGVuZ3RoKV0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VlZHMgPSB0aGlzLmdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cylcbiAgICAgICAgc2VlZHMubWFwKHNlZWQgPT4gZ3JpZFtzZWVkLnldW3NlZWQueF0gPSBzZWVkKVxuICAgICAgICB0aGlzLl9zZWVkcyA9IHNlZWRzXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKSB7XG4gICAgICAgIC8vICByZXR1cm4gMSAgICAgICAgLy8gdGVzdCBzZXR0aW5nXG4gICAgICAgIC8vIHJldHVybiAoKHRoaXMuY29sICogdGhpcy5yb3cpIC8gKHRoaXMuX2NvbCArIHRoaXMucm93KSkgIC8vIHNwYXJzZSBpbml0aWFsIHNlZWRpbmdcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBzZWVkcyA9IHRoaXMuX3NlZWRzXG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdvb2RTZWVkcyA9IFtdXG4gICAgICAgICAgICB0aGlzLmdvb2RTZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5mb3JFYWNoKChzZWVkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2RTZWVkcy5wdXNoKHRoaXMuY2hlY2tTZWVkKHNlZWQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBmb3IgKGxldCBnb29kU2VlZCBvZiBnb29kU2VlZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID09PSB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuY291bnRVbnNlZWRlZExvY2F0aW9ucygpKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5zZWVkZWRHcmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBsZXQgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgaWYgKChzZWVkLnggPCB0aGlzLmNvbCAmJiBzZWVkLnggPj0gMCkgJiZcbiAgICAgICAgICAgIChzZWVkLnkgPCB0aGlzLnJvdyAmJiBzZWVkLnkgPj0gMCkpIHtcbiAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFtzZWVkLnldW3NlZWQueF0gIT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKChzZWVkLnggPT09IGdvb2RTZWVkLngpICYmXG4gICAgICAgICAgICAgICAgKHNlZWQueSA9PT0gZ29vZFNlZWQueSkpIHtcbiAgICAgICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzZWVkU3VjY2VlZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykge1xuICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICBzZWVkcy5mb3JFYWNoKChvcmlnaW5hbFNlZWQpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmFiaWxpdHkobmV4dEdlblNlZWQucHJvYmFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkaXJlY3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueCA9IG9yaWdpbmFsU2VlZC54ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnkgPSBvcmlnaW5hbFNlZWQueSArIGRpcmVjdGlvblZhbHVlc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG4gICAgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXAuZ2V0TWFwKClcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbdGhpcy5ncmlkSW5kaWNlc1sxXV1bdGhpcy5ncmlkSW5kaWNlc1swXV1cbiAgICB9XG5cbiAgICBnZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UndmUgcmVhY2hlZCB0aGUgbWFwJ3MgZWRnZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhdGlvblxuICAgIH1cblxuICAgIGNoZWNrR3JpZEluZGljZXMobmV3R3JpZEluZGljZXMpIHtcbiAgICAgICAgbGV0IGxvY2F0aW9uT25HcmlkID0gZmFsc2VcbiAgICAgICAgaWYgKHRoaXMuZ290TWFwW25ld0dyaWRJbmRpY2VzWzFdXSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbk9uR3JpZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYXRpb25PbkdyaWRcbiAgICB9XG5cbiAgICBnZXRDU1NIZWlnaHRBbmRXaWR0aCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdCcpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgICAgIGNvbnN0IHdpZHRoID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKVxuICAgICAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH1cbiAgICB9XG5cbiAgICBnZXRDU1NDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgY3NzID0gdGhpcy5nZXRDU1NIZWlnaHRBbmRXaWR0aCgpXG4gICAgICAgIGNvbnN0IGNzc0xlZnQgPSB0aGlzLmdyaWRJbmRpY2VzWzBdICogY3NzLmhlaWdodFxuICAgICAgICBjb25zdCBjc3NUb3AgPSB0aGlzLmdyaWRJbmRpY2VzWzFdICogY3NzLndpZHRoXG4gICAgICAgIHJldHVybiB7IGNzc0xlZnQsIGNzc1RvcCB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1vdmVhYmxlXG4iLCJjbGFzcyBSZW5kZXJhYmxlIHsgIC8vIGdlbmVyYWxpemVkIHJlbmRlciBmdW5jdGlvbnMgZm9yIFNjZW5lcnksIENoYXJhY3RlclxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHNldExheWVyKGxheWVyKSB7XG4gICAgICAgIHRoaXMubGF5ZXIgPSBsYXllclxuICAgIH1cblxuICAgIGdldExheWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXllclxuICAgIH1cblxuICAgIHJlbmRlclNwYW4odW5pdCkge1xuICAgICAgICBsZXQgY2xzID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgICAgY2xzID0gdW5pdC5jbHNcbiAgICAgICAgICAgIGVsZW1lbnQgPSB1bml0LmVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bml0LnRvcCAmJiB1bml0LmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHt1bml0LnRvcH1weDsgbGVmdDogJHt1bml0LmxlZnR9cHhgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInVuaXQgJHtjbHN9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L3NwYW4+YFxuICAgIH1cblxuICAgIHJlbmRlckRpdihpdGVtKSB7XG4gICAgICAgIGxldCBkaXYgPSAnJ1xuICAgICAgICBsZXQgZWxlbWVudCA9ICcmbmJzcDsnXG4gICAgICAgIGxldCBzdHlsZSA9ICcnXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBkaXYgPSBpdGVtLmRpdlxuICAgICAgICAgICAgZWxlbWVudCA9IGl0ZW0uZWxlbWVudFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnRvcCAmJiBpdGVtLmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHtpdGVtLnRvcH1weDsgbGVmdDogJHtpdGVtLmxlZnR9cHg7IHBvc2l0aW9uOiBhYnNvbHV0ZWBcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5vZmZNYXApIHtcbiAgICAgICAgICAgIHN0eWxlICs9IGA7IGRpc3BsYXk6IG5vbmVgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiJHtkaXZ9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L2Rpdj5gXG59XG5cbiAgICByZW5kZXJMYXllcih1bml0LCBsYXllcklkKSB7XG4gICAgICAgIGlmICh1bml0LnR5cGUgPT09ICdhY3RvcicpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3Bhbih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGl2KHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlU3BhbihhY3Rvcikge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyU3BhbihhY3RvcikpXG4gICAgfVxuXG4gICAgdXBkYXRlRGl2KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlckRpdihpdGVtKSlcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQocGFyZW50TGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudExheWVySWQpXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgLy8gY3JlYXRlcyBkaXYgaWQgd2l0aGluIGVuY2xvc2luZyBkaXYgLi4uXG4gICAgICAgIGNoaWxkLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJhYmxlXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5cblxuY2xhc3MgU2NlbmVyeSBleHRlbmRzIFJlbmRlcmFibGUgeyAgLy8gU2NlbmVyeS1zcGVjaWZpYyByZW5kZXJpbmcgZnVuY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXAuZ2V0TWFwKClcbiAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGF5ZXIoKVxuICAgICAgICBjb25zb2xlLmxvZygnc2NlbmVyeSByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyR3JpZExheWVyKCkge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5nb3RNYXAubWFwKGFyciA9PiB7IHJldHVybiBhcnIuc2xpY2UoKSB9KVxuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMuY3JlYXRlR3JpZExheWVyKGdyaWQpKVxuICAgICAgICB0aGlzLmRyYXdHcmlkTGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUdyaWRMYXllcihncmlkKSB7XG4gICAgICAgIGNvbnN0IHNjZW5lcnlHcmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3dJdGVtcyA9IGdyaWRbaV1cbiAgICAgICAgICAgIGxldCByb3cgPSAnJyAgLy8gcG9zc2libHkgbWFrZSBlYWNoIHJvdyBhIHRhYmxlP1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyArPSB0aGlzLnJlbmRlclNwYW4ocm93SXRlbXNbaV0pIC8vIGFkZCByZW5kZXJlZCBpdGVtcyB0byB0aGUgZ3JpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NlbmVyeUdyaWQucHVzaChyb3cpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjZW5lcnlHcmlkXG4gICAgfVxuXG4gICAgZHJhd0dyaWRMYXllcigpIHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgY29uc3QgZ3JpZFRvSFRNTCA9IGxheWVyLmpvaW4oJzxiciAvPicpICAvLyB1c2luZyBIVE1MIGJyZWFrcyBmb3Igbm93XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhbmRzY2FwZS1sYXllcicpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IGdyaWRUb0hUTUxcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU2NlbmVyeVxuIiwiY2xhc3MgU3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcihFTSkge1xuICAgICAgICBFTS5zdWJzY3JpYmUoJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMudXBkYXRlLCB0aGlzKVxuICAgICAgICBFTS5zdWJzY3JpYmUoJycpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZGVsYXk9MCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1xuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIFVzZXJJbnB1dCB7XG4gICAgY29uc3RydWN0b3Ioa2V5QWN0aW9uTWFwKSB7XG4gICAgICAgIHRoaXMua2V5QWN0aW9uTWFwID0ga2V5QWN0aW9uTWFwXG5cbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy50cnlBY3Rpb25Gb3JFdmVudC5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgdHJ5QWN0aW9uRm9yRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFVdGlsaXR5LmNvbnRhaW5zKHRoaXMua2V5QWN0aW9uTWFwLCBldmVudC5rZXlDb2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYG5vdCBhIHZhbGlkIGtleWNvZGU6ICR7ZXZlbnQua2V5Q29kZX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXBbZXZlbnQua2V5Q29kZV0oKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJJbnB1dFxuIiwiY2xhc3MgVXRpbGl0eSB7XG4gICAgc3RhdGljIGNvbnRhaW5zKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuaW5kZXhPZihTdHJpbmcocHJvcGVydHkpKSAhPT0gLTFcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RyaW5nVG9OdW1iZXIoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcubWF0Y2goL1xcZCsvKVswXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb21pemUobXVsdCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXVsdClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eVxuIiwiaW1wb3J0IE1hcCBmcm9tICcuL01hcCdcbmltcG9ydCBTY2VuZXJ5IGZyb20gJy4vU2NlbmVyeSdcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSAnLi9DaGFyYWN0ZXInXG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gJy4vRXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IEl0ZW1HZW5lcmF0b3IgZnJvbSAnLi9JdGVtR2VuZXJhdG9yJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuL1N0YXR1cydcbmltcG9ydCBVc2VySW5wdXQgZnJvbSAnLi9Vc2VySW5wdXQnXG5pbXBvcnQgQmx1ZXByaW50cyBmcm9tICcuL0JsdWVwcmludHMnXG5cblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdEdhbWUoKSB7XG4gICAgICAgIHRoaXMuc3BhY2VzID0gW11cbiAgICAgICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlXG4gICAgICAgIHRoaXMubWFwID0gbmV3IE1hcCg2MCwgNjApXG4gICAgICAgIHRoaXMuc2NlbmVyeSA9IG5ldyBTY2VuZXJ5KHRoaXMubWFwKVxuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIodGhpcy5tYXApXG4gICAgICAgIHRoaXMubWFwLnNldENoYXJhY3Rlcih0aGlzLmNoYXJhY3RlcikgIC8vIGdpdmVzIG1hcCByZWZlcmVuY2UgdG8gY2hhcmFjdGVyXG5cblxuICAgICAgICAvLyBldmVudG1hbmFnZXIgdGVzdGluZ1xuICAgICAgICB0aGlzLkVNID0gbmV3IEV2ZW50TWFuYWdlcigpICAvLyBjcmVhdGUgb25seSBvbmUgRU0gPyBvciBtdWx0aXBsZSA/XG5cblxuICAgICAgICB0aGlzLml0ZW1HZW5lcmF0b3IgPSBuZXcgSXRlbUdlbmVyYXRvcih0aGlzLm1hcCwgdGhpcy5FTSwgNikgIC8vIGhhdmUgdG8gcGFzcyBpbiBFTSB0byBnZW5lcmF0b3IgKGluZWxlZ2FudClcblxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5zZXRFdmVudE1hbmFnZXIodGhpcy5FTSlcbiAgICAgICAgdGhpcy5tYXAuc2V0RXZlbnRNYW5hZ2VyKHRoaXMuRU0pXG5cbiAgICAgICAgdGhpcy5zdGF0dXMgPSBuZXcgU3RhdHVzKHRoaXMuRU0pXG4gICAgICAgIHRoaXMuc3RhdHVzLnNldCgneW91IHdha2UgdXAnKVxuICAgICAgICB0aGlzLmJsdWVwcmludCA9IEJsdWVwcmludHMucmFuZG9tKClcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KGB5b3UgYXJlIGNhcnJ5aW5nICR7dGhpcy5ibHVlcHJpbnQubmFtZX1gLCA0MDAwKVxuXG4gICAgICAgIHRoaXMuaW5wdXQgPSB0aGlzLmluaXRVc2VySW5wdXQoKVxuICAgIH1cblxuICAgIGluaXRVc2VySW5wdXQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVXNlcklucHV0KHtcbiAgICAgICAgICAgICczOCc6IHRoaXMuY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdub3J0aCcpLFxuICAgICAgICAgICAgJzM3JzogdGhpcy5jaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3dlc3QnKSxcbiAgICAgICAgICAgICczOSc6IHRoaXMuY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdlYXN0JyksXG4gICAgICAgICAgICAnNDAnOiB0aGlzLmNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnc291dGgnKSxcblxuICAgICAgICAgICAgJzg0JzogdGhpcy5jaGFyYWN0ZXIuZ2V0QWN0aW9uKCd0YWtlJywgJ2l0ZW0nKSAvLyAodClha2UgaXRlbVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0IScpXG4gICAgfVxuXG4gICAgZ2FtZUlzT3ZlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZU92ZXJcbiAgICB9XG5cbiAgICBleHBsb3JlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgZXhwbG9yaW5nIHRoZSAke3RoaXMua2luZH0gem9uZSFgKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZSgpO1xuIl19
