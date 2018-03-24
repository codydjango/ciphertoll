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

},{"./Utility":18}],3:[function(require,module,exports){
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

},{"./Constants":4,"./Moveable":13}],4:[function(require,module,exports){
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Inventory = function () {
    function Inventory(blueprint) {
        _classCallCheck(this, Inventory);

        this.blueprint = blueprint;
        this.inventory = [this.blueprint];
        console.log('inventory', this.inventory);
    }

    _createClass(Inventory, [{
        key: 'setEventManager',
        value: function setEventManager(eventManager) {
            this.EM = eventManager;
            this.EM.subscribe('add-inventory', this.add, this);
            this.EM.subscribe('remove-inventory', this.remove, this);
        }
    }, {
        key: 'add',
        value: function add(item) {
            this.inventory.push(item);
            console.log('inventory', this.inventory);
        }

        // untested

    }, {
        key: 'remove',
        value: function remove(item) {
            var _this = this;

            this.inventory.forEach(function (item, i) {
                if (_this.inventory[i].item === item) {
                    _this.inventory.splice(i, 1);
                } else {
                    // item not in inventory
                }
            });
        }
    }]);

    return Inventory;
}();

exports.default = Inventory;

},{}],7:[function(require,module,exports){
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

        _this.item.identityNumber = generatorIndex;

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
        console.log('ITEM CONSTRUCTOR: item x', _this.item.x, 'item y', _this.item.y);
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

            this.EM.publish('add-inventory', this.item);

            this.renderLayer(this.getItem(), this.item.div);
        }
    }]);

    return Item;
}(_Moveable3.default);

exports.default = Item;

},{"./Moveable":13}],8:[function(require,module,exports){
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
            var noiseParser = {
                name: 'noise parser',
                type: 'item',
                element: '?',
                description: '',
                div: 'item-parser'
            };
            var psionicInterface = {
                name: 'psionic interface',
                type: 'item',
                element: '&',
                description: '',
                div: 'item-interface'
            };
            var molecularPrinter = {
                name: 'molecular printer',
                type: 'item',
                element: '#',
                description: '',
                div: 'item-printer'
            };
            return [particleMiner, noiseParser, psionicInterface, molecularPrinter];
        }
    }]);

    return ItemData;
}();

exports.default = ItemData;

},{}],9:[function(require,module,exports){
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

            // for (let i = 0; i < randomItems.length; i++) {
            //     this.newItem = new Item (this.map, randomItems[i], i)
            //     console.log('ITEMGENERATOR.GENERATEITEMS: item x', this.newItem.item.x, 'item y', this.newItem.item.y)
            //     this.newItem.setEventManager(this.EM)
            //     this.map.pushItem(this.newItem.item)
            //     console.log('ITEMGENERATOR after PUSHITEM: item x', this.newItem.item.x, 'item y', this.newItem.item.y)
            //     console.log('item generated:', this.newItem.item)
            //     }

            randomItems.forEach(function (item, index) {
                _this.newItem = new _Item2.default(_this.map, item, index);
                console.log('ITEMGENERATOR.GENERATEITEMS: item x', _this.newItem.item.x, 'item y', _this.newItem.item.y);
                _this.newItem.setEventManager(_this.EM);
                _this.map.pushItem(_this.newItem.item);
                console.log('ITEMGENERATOR after PUSHITEM: item x', _this.newItem.item.x, 'item y', _this.newItem.item.y);
                console.log('item generated:', _this.newItem.item); // but here, object itself contains only newest generated location???
            });
        }
    }]);

    return ItemGenerator;
}();

exports.default = ItemGenerator;

},{"./Item":7,"./ItemData":8,"./Utility":18}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
            console.log('MAP.PUSHITEM: item x', item.x, 'item y', item.y);

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
                    _this.EM.publish('item-status', item.name);
                } else {
                    _this.EM.publish('off-' + item.name, item);
                }
            });
        }
    }]);

    return Map;
}();

exports.default = Map;

},{"./MapGenerator":12,"./Utility":18}],12:[function(require,module,exports){
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

},{"./Constants":4,"./LandscapeData":10,"./Utility":18}],13:[function(require,module,exports){
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

},{"./Renderable":14,"./Utility":18}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./Renderable":14}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Status = function () {
    function Status(eventManager) {
        _classCallCheck(this, Status);

        this.EM = eventManager;
        this.EM.subscribe('character-moved', this.update, this);
        this.EM.subscribe('item-status', this.displayItem, this);
    }

    _createClass(Status, [{
        key: 'update',
        value: function update(location) {
            this.set(location.description);
        }
    }, {
        key: 'displayItem',
        value: function displayItem(itemName) {
            this.set('you see ' + itemName + ' here', 10);
            this.EM.subscribe('character-moved', this.update, this);
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

},{}],17:[function(require,module,exports){
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

},{"./Utility":18}],18:[function(require,module,exports){
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

var _Inventory = require('./Inventory');

var _Inventory2 = _interopRequireDefault(_Inventory);

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


            this.EM = new _EventManager2.default();

            this.itemGenerator = new _ItemGenerator2.default(this.map, this.EM, 6); // have to pass in EM to generator (inelegant)

            this.character.setEventManager(this.EM);
            this.map.setEventManager(this.EM);

            this.status = new _Status2.default(this.EM);
            this.status.set('you wake up');
            this.blueprint = _Blueprints2.default.random();
            this.status.set('you are carrying ' + this.blueprint.name, 4000);

            this.inventory = new _Inventory2.default(this.blueprint);
            this.inventory.setEventManager(this.EM);

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

},{"./Blueprints":2,"./Character":3,"./EventManager":5,"./Inventory":6,"./ItemGenerator":9,"./Map":11,"./Scenery":15,"./Status":16,"./UserInput":17}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0V2ZW50TWFuYWdlci5qcyIsInNyYy9qcy9JbnZlbnRvcnkuanMiLCJzcmMvanMvSXRlbS5qcyIsInNyYy9qcy9JdGVtRGF0YS5qcyIsInNyYy9qcy9JdGVtR2VuZXJhdG9yLmpzIiwic3JjL2pzL0xhbmRzY2FwZURhdGEuanMiLCJzcmMvanMvTWFwLmpzIiwic3JjL2pzL01hcEdlbmVyYXRvci5qcyIsInNyYy9qcy9Nb3ZlYWJsZS5qcyIsInNyYy9qcy9SZW5kZXJhYmxlLmpzIiwic3JjL2pzL1NjZW5lcnkuanMiLCJzcmMvanMvU3RhdHVzLmpzIiwic3JjL2pzL1VzZXJJbnB1dC5qcyIsInNyYy9qcy9VdGlsaXR5LmpzIiwic3JjL2pzL2dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxPQUFPLElBQVA7Ozs7Ozs7Ozs7O0FDRkE7Ozs7Ozs7O0FBR0EsSUFBTSxnQkFBZ0I7QUFDbEIsc0JBQWtCO0FBQ2QsY0FBTSxtQkFEUTtBQUVkLHFCQUFhLEVBRkM7QUFHZCxtQkFBVyxFQUhHO0FBSWQsc0JBQWM7QUFKQSxLQURBO0FBT2xCLG9CQUFnQjtBQUNaLGNBQU0saUJBRE07QUFFWixxQkFBYSxFQUZEO0FBR1osbUJBQVcsRUFIQztBQUlaLHNCQUFjO0FBSkYsS0FQRTtBQWFsQixtQkFBZTtBQUNYLGNBQU0sZ0JBREs7QUFFWCxxQkFBYSxFQUZGO0FBR1gsbUJBQVcsRUFIQTtBQUlYLHNCQUFjO0FBSkg7QUFiRyxDQUF0Qjs7SUFzQk0sUztBQUNGLHVCQUFZLElBQVosRUFBa0IsV0FBbEIsRUFBK0I7QUFBQTs7QUFDM0IsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssV0FB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S0FBSyxRQUFaO0FBQ0g7OztrQ0FFUztBQUNOLG9CQUFRLEdBQVIsb0JBQTZCLEtBQUssSUFBbEM7QUFDSDs7Ozs7O2tCQUlVLElBQUksSUFBSixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2pzL2dhbWUnXG5cbndpbmRvdy5nYW1lID0gZ2FtZVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNvbnN0IGJsdWVwcmludERhdGEgPSB7XG4gICAgYXJ0aWZpY2lhbE11c2NsZToge1xuICAgICAgICBuYW1lOiAnQXJ0aWZpY2lhbCBNdXNjbGUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHJldGluYWxEaXNwbGF5OiB7XG4gICAgICAgIG5hbWU6ICdSZXRpbmFsIERpc3BsYXknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHByb3N0aGV0aWNBcm06IHtcbiAgICAgICAgbmFtZTogJ1Byb3N0aGV0aWMgQXJtJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfVxufVxuXG5cbmNsYXNzIEJsdWVwcmludCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9tKCkge1xuICAgICAgICBjb25zdCBibHVlcHJpbnRWYWx1ZXMgPSBPYmplY3QudmFsdWVzKGJsdWVwcmludERhdGEpXG4gICAgICAgIGNvbnN0IGluZGV4ID0gVXRpbGl0eS5yYW5kb21pemUoYmx1ZXByaW50VmFsdWVzLmxlbmd0aClcblxuICAgICAgICBjb25zdCByYW5kb21CbHVlcHJpbnQgPSBibHVlcHJpbnRWYWx1ZXNbaW5kZXhdXG5cbiAgICAgICAgcmV0dXJuIG5ldyBCbHVlcHJpbnQocmFuZG9tQmx1ZXByaW50Lm5hbWUsIHJhbmRvbUJsdWVwcmludC5kZXNjcmlwdGlvbilcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQmx1ZXByaW50XG5cbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICcuL01vdmVhYmxlJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuXG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIE1vdmVhYmxlIHsgIC8vIENoYXJhY3RlciBkYXRhIGFuZCBhY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKG1hcClcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICAgICAgdGhpcy5FTSA9IG51bGxcbiAgICAgICAgdGhpcy5pdGVtID0gbnVsbFxuICAgICAgICB0aGlzLmluaXRpYWxHcmlkSW5kaWNlcyA9IG1hcC5nZXRNYXBDZW50ZXIoKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyh0aGlzLmluaXRpYWxHcmlkSW5kaWNlcylcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJhY3RlciByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgdHlwZTogJ2FjdG9yJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdAJyxcbiAgICAgICAgICAgIGNsczogJ2NoYXJhY3RlcicsXG4gICAgICAgICAgICBsZWZ0OiBjc3NMZWZ0LFxuICAgICAgICAgICAgdG9wOiBjc3NUb3AsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBnZXRBY3Rpb24oZm5OYW1lLCBhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbZm5OYW1lXS5iaW5kKHRoaXMsIGFyZylcbiAgICB9XG5cbiAgICBtb3ZlKGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy51cGRhdGVHcmlkSW5kaWNlcyh0aGlzLmdldENoYXJhY3RlcigpLCBESVJFQ1RJT05TW2RpcmVjdGlvbl0pXG4gICAgICAgIHRoaXMubWFwLmNoZWNrQ2hhcmFjdGVyTG9jYXRpb24oKVxuXG4gICAgICAgIGlmICh0aGlzLkVNKSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuICAgIH1cblxuICAgIHNldEV2ZW50TWFuYWdlcihldmVudE1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY2hhcmFjdGVyIGtub3dzIGFib3V0IGl0ZW1zJywgdGhpcy5tYXAuaXRlbXNPbk1hcClcbiAgICAgICAgdGhpcy5tYXAuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYG9uLSR7aXRlbS5uYW1lfWAsIHRoaXMub25JdGVtLCB0aGlzLCB0cnVlKVxuICAgICAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYHRha2UtJHtpdGVtLm5hbWV9YCwgdGhpcy50YWtlSXRlbSwgdGhpcywgdHJ1ZSlcblxuICAgICAgICB9KVxuICAgIH1cblxuICAgIG9uSXRlbShpdGVtKSB7XG4gICAgICAgIHRoaXMuaXRlbSA9IGl0ZW1cbiAgICAgICAgY29uc29sZS5sb2coYGNoYXJhY3RlciBpcyBhdCAke2l0ZW0ubmFtZX0hYClcbiAgICAgICAgdGhpcy5pdGVtLnRha2VhYmxlID0gdHJ1ZVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgb2ZmLSR7aXRlbS5uYW1lfWAsIHRoaXMub2ZmSXRlbSwgdGhpcywgdHJ1ZSlcbiAgICB9XG5cbiAgICBvZmZJdGVtKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgY2hhcmFjdGVyIGlzIG5vIGxvbmdlciBvbiAke3RoaXMuaXRlbS5uYW1lfWApXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGBvbi0ke2l0ZW0ubmFtZX1gLCB0aGlzLm9uSXRlbSwgdGhpcywgdHJ1ZSlcbiAgICAgICAgdGhpcy5pdGVtLnRha2VhYmxlID0gZmFsc2VcbiAgICB9XG5cbiAgICB0YWtlKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnYXR0ZW1wdGluZyB0byB0YWtlIGl0ZW0uLi4nKVxuICAgICAgICBpZiAodGhpcy5pdGVtKSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goYHRha2UtJHt0aGlzLml0ZW0ubmFtZX1gLCB0aGlzLml0ZW0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm90aGluZyB0byB0YWtlIScpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0YWtlSXRlbShpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLnRha2VhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goYCR7aXRlbS5uYW1lfSB0YWtlbmApXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZXZlbnRzIHJlbWFpbmluZzonLCB0aGlzLkVNLmdldEV2ZW50c0xpc3QoKSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50c0xpc3QgPSBbXSAgICAgICAgLy8gY3JlYXRlIGFycmF5IG9mIGV2ZW50c1xuICAgIH1cblxuICAgIHN1YnNjcmliZShldmVudCwgZm4sIHRoaXNWYWx1ZSwgb25jZT1mYWxzZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXNWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHsgICAvLyBpZiBubyB0aGlzVmFsdWUgcHJvdmlkZWQsIGJpbmRzIHRoZSBmbiB0byB0aGUgZm4/P1xuICAgICAgICAgICAgdGhpc1ZhbHVlID0gZm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50c0xpc3QucHVzaCh7ICAgICAgLy8gY3JlYXRlIG9iamVjdHMgbGlua2luZyBldmVudHMgKyBmdW5jdGlvbnMgdG8gcGVyZm9ybVxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LCAgICAgICAgICAgLy8gcHVzaCBlbSB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgICAgICB0aGlzVmFsdWU6IHRoaXNWYWx1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHVuc3Vic2NyaWJlKGV2ZW50KSB7XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAvLyAgICAgICAgICAgICBicmVha1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGlzaChldmVudCwgYXJnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGhpc1ZhbHVlLCBmbiwgb25jZSB9ID0gdGhpcy5ldmVudHNMaXN0W2ldXG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzVmFsdWUsIGFyZylcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzTGlzdFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBFdmVudE1hbmFnZXJcbiIsImNsYXNzIEludmVudG9yeSB7XG4gICAgY29uc3RydWN0b3IoYmx1ZXByaW50KSB7XG4gICAgICAgIHRoaXMuYmx1ZXByaW50ID0gYmx1ZXByaW50XG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gW3RoaXMuYmx1ZXByaW50XVxuICAgICAgICBjb25zb2xlLmxvZygnaW52ZW50b3J5JywgdGhpcy5pbnZlbnRvcnkpXG4gICAgfVxuXG4gICAgc2V0RXZlbnRNYW5hZ2VyKGV2ZW50TWFuYWdlcikge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtaW52ZW50b3J5JywgdGhpcy5hZGQsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdyZW1vdmUtaW52ZW50b3J5JywgdGhpcy5yZW1vdmUsIHRoaXMpXG4gICAgfVxuXG4gICAgYWRkKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkucHVzaChpdGVtKVxuICAgICAgICBjb25zb2xlLmxvZygnaW52ZW50b3J5JywgdGhpcy5pbnZlbnRvcnkpXG4gICAgfVxuXG5cblxuLy8gdW50ZXN0ZWRcblxuICAgIHJlbW92ZShpdGVtKSB7XG4gICAgICAgIHRoaXMuaW52ZW50b3J5LmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludmVudG9yeVtpXS5pdGVtID09PSBpdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnZlbnRvcnkuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGl0ZW0gbm90IGluIGludmVudG9yeVxuICAgICAgICAgICAgfX0pXG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW52ZW50b3J5XG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcblxuXG5jbGFzcyBJdGVtIGV4dGVuZHMgTW92ZWFibGUge1xuICAgIGNvbnN0cnVjdG9yKG1hcCwgaXRlbU9iamVjdCwgZ2VuZXJhdG9ySW5kZXgpIHtcbiAgICAgICAgc3VwZXIobWFwKVxuICAgICAgICB0aGlzLml0ZW0gPSBpdGVtT2JqZWN0XG5cbiAgICAgICAgdGhpcy5pdGVtLmlkZW50aXR5TnVtYmVyID0gZ2VuZXJhdG9ySW5kZXhcblxuICAgICAgICB0aGlzLml0ZW0udHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLml0ZW0ub2ZmTWFwID0gZmFsc2VcbiAgICAgICAgdGhpcy5pdGVtLmluSW52ZW50b3J5ID0gZmFsc2VcbiAgICAgICAgdGhpcy5pbml0aWFsR3JpZEluZGljZXMgPSBtYXAuZ2V0UmFuZG9tTWFwTG9jYXRpb24oKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyh0aGlzLmluaXRpYWxHcmlkSW5kaWNlcylcbiAgICAgICAgdGhpcy5zZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMoKVxuXG4gICAgICAgIHRoaXMuc2V0RGl2KGdlbmVyYXRvckluZGV4KVxuXG4gICAgICAgIHRoaXMudXBkYXRlRGl2KHRoaXMuZ2V0SXRlbSgpKVxuICAgICAgICB0aGlzLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKVxuICAgICAgICBjb25zb2xlLmxvZyhgaXRlbSBcIiR7dGhpcy5pdGVtLm5hbWV9XCIgcmVuZGVyZWQgYXQgJHt0aGlzLmluaXRpYWxHcmlkSW5kaWNlc31gKVxuICAgICAgICBjb25zb2xlLmxvZygnSVRFTSBDT05TVFJVQ1RPUjogaXRlbSB4JywgdGhpcy5pdGVtLngsICdpdGVtIHknLCB0aGlzLml0ZW0ueSlcbiAgICB9XG5cbiAgICBnZXRJdGVtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtXG4gICAgfVxuXG4gICAgc2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgY3NzTGVmdCwgY3NzVG9wIH0gPSB0aGlzLmdldENTU0Nvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5pdGVtLmxlZnQgPSBjc3NMZWZ0XG4gICAgICAgIHRoaXMuaXRlbS50b3AgPSBjc3NUb3BcbiAgICB9XG5cbiAgICBzZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgdGhpcy5pdGVtLnggPSB0aGlzLmdyaWRJbmRpY2VzWzBdXG4gICAgICAgIHRoaXMuaXRlbS55ID0gdGhpcy5ncmlkSW5kaWNlc1sxXVxuICAgIH1cblxuICAgIHNldERpdihnZW5lcmF0b3JJbmRleCkge1xuICAgICAgICB0aGlzLml0ZW0uZGl2ID0gdGhpcy5pdGVtLmRpdiArIGdlbmVyYXRvckluZGV4XG4gICAgfVxuXG4gICAgc2V0RXZlbnRNYW5hZ2VyKGV2ZW50TWFuYWdlcikge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke3RoaXMuaXRlbS5uYW1lfSB0YWtlbmAsIHRoaXMub25UYWtlLCB0aGlzLCB0cnVlKVxuICAgIH1cblxuXG5cblxuXG5cbiAgICBvblRha2UoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke3RoaXMuaXRlbS5uYW1lfSB0YWtlbiFgKVxuXG4gICAgICAgIHRoaXMuaXRlbS5vZmZNYXAgPSB0cnVlICAvL1xuICAgICAgICB0aGlzLml0ZW0uaW5JbnZlbnRvcnkgPSB0cnVlXG5cbiAgICAgICAgdGhpcy5pdGVtLnggPSBudWxsXG4gICAgICAgIHRoaXMuaXRlbS55ID0gbnVsbFxuXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnYWRkLWludmVudG9yeScsIHRoaXMuaXRlbSlcblxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0SXRlbSgpLCB0aGlzLml0ZW0uZGl2KVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtXG4iLCJjbGFzcyBJdGVtRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zKClcbiAgICB9XG5cbiAgICBpdGVtcygpIHtcbiAgICAgICAgY29uc3QgcGFydGljbGVNaW5lciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdwYXJ0aWNsZSBtaW5lcicsXG4gICAgICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgICAgICBlbGVtZW50OiAnfCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBkaXY6ICdpdGVtLW1pbmVyJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vaXNlUGFyc2VyID0ge1xuICAgICAgICAgICAgbmFtZTogJ25vaXNlIHBhcnNlcicsXG4gICAgICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgICAgICBlbGVtZW50OiAnPycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBkaXY6ICdpdGVtLXBhcnNlcidcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwc2lvbmljSW50ZXJmYWNlID0ge1xuICAgICAgICAgICAgbmFtZTogJ3BzaW9uaWMgaW50ZXJmYWNlJyxcbiAgICAgICAgICAgIHR5cGU6ICdpdGVtJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIGRpdjogJ2l0ZW0taW50ZXJmYWNlJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1vbGVjdWxhclByaW50ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiAnbW9sZWN1bGFyIHByaW50ZXInLFxuICAgICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuICAgICAgICAgICAgZWxlbWVudDogJyMnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgZGl2OiAnaXRlbS1wcmludGVyJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGFydGljbGVNaW5lciwgbm9pc2VQYXJzZXIsIHBzaW9uaWNJbnRlcmZhY2UsIG1vbGVjdWxhclByaW50ZXJdXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW1EYXRhXG4iLCJpbXBvcnQgSXRlbURhdGEgZnJvbSAnLi9JdGVtRGF0YSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcblxuXG5jbGFzcyBJdGVtR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihtYXAsIGV2ZW50TWFuYWdlciwgbnVtYmVyT2ZJdGVtcykge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgICAgICB0aGlzLm51bWJlck9mSXRlbXMgPSBudW1iZXJPZkl0ZW1zXG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBJdGVtRGF0YSgpXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcblxuICAgICAgICB0aGlzLmdlbmVyYXRlSXRlbXMoKVxuICAgIH1cblxuICAgIGdldFJhbmRvbUl0ZW1zKCkge1xuICAgICAgICBjb25zdCBhbGxJdGVtcyA9IHRoaXMuZGF0YS5pdGVtc1xuICAgICAgICBjb25zdCByYW5kb21JdGVtcyA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1iZXJPZkl0ZW1zOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUl0ZW0gPSBhbGxJdGVtc1tVdGlsaXR5LnJhbmRvbWl6ZShhbGxJdGVtcy5sZW5ndGgpXVxuICAgICAgICAgICAgcmFuZG9tSXRlbXMucHVzaChyYW5kb21JdGVtKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYW5kb21JdGVtc1xuICAgIH1cblxuXG4vLyBpc3N1ZXMgd2l0aCBpdGVtcyBvdmVyd3JpdGluZyBvbmUgYW5vdGhlci4uLlxuICAgIGdlbmVyYXRlSXRlbXMoKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUl0ZW1zID0gdGhpcy5nZXRSYW5kb21JdGVtcygpXG5cbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCByYW5kb21JdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyAgICAgdGhpcy5uZXdJdGVtID0gbmV3IEl0ZW0gKHRoaXMubWFwLCByYW5kb21JdGVtc1tpXSwgaSlcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdJVEVNR0VORVJBVE9SLkdFTkVSQVRFSVRFTVM6IGl0ZW0geCcsIHRoaXMubmV3SXRlbS5pdGVtLngsICdpdGVtIHknLCB0aGlzLm5ld0l0ZW0uaXRlbS55KVxuICAgICAgICAvLyAgICAgdGhpcy5uZXdJdGVtLnNldEV2ZW50TWFuYWdlcih0aGlzLkVNKVxuICAgICAgICAvLyAgICAgdGhpcy5tYXAucHVzaEl0ZW0odGhpcy5uZXdJdGVtLml0ZW0pXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnSVRFTUdFTkVSQVRPUiBhZnRlciBQVVNISVRFTTogaXRlbSB4JywgdGhpcy5uZXdJdGVtLml0ZW0ueCwgJ2l0ZW0geScsIHRoaXMubmV3SXRlbS5pdGVtLnkpXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnaXRlbSBnZW5lcmF0ZWQ6JywgdGhpcy5uZXdJdGVtLml0ZW0pXG4gICAgICAgIC8vICAgICB9XG5cbiAgICAgICAgcmFuZG9tSXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubmV3SXRlbSA9IG5ldyBJdGVtKHRoaXMubWFwLCBpdGVtLCBpbmRleClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJVEVNR0VORVJBVE9SLkdFTkVSQVRFSVRFTVM6IGl0ZW0geCcsIHRoaXMubmV3SXRlbS5pdGVtLngsICdpdGVtIHknLCB0aGlzLm5ld0l0ZW0uaXRlbS55KVxuICAgICAgICAgICAgdGhpcy5uZXdJdGVtLnNldEV2ZW50TWFuYWdlcih0aGlzLkVNKVxuICAgICAgICAgICAgdGhpcy5tYXAucHVzaEl0ZW0odGhpcy5uZXdJdGVtLml0ZW0pXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSVRFTUdFTkVSQVRPUiBhZnRlciBQVVNISVRFTTogaXRlbSB4JywgdGhpcy5uZXdJdGVtLml0ZW0ueCwgJ2l0ZW0geScsIHRoaXMubmV3SXRlbS5pdGVtLnkpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaXRlbSBnZW5lcmF0ZWQ6JywgdGhpcy5uZXdJdGVtLml0ZW0pIC8vIGJ1dCBoZXJlLCBvYmplY3QgaXRzZWxmIGNvbnRhaW5zIG9ubHkgbmV3ZXN0IGdlbmVyYXRlZCBsb2NhdGlvbj8/P1xuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtR2VuZXJhdG9yXG4iLCJjbGFzcyBMYW5kc2NhcGVEYXRhIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5mZWF0dXJlcyA9IHRoaXMuZmVhdHVyZXMoKVxuICAgICAgICB0aGlzLmJhcmUgPSB0aGlzLmJhcmUoKVxuICAgIH1cblxuICAgIGZlYXR1cmVzKCkge1xuICAgICAgICBjb25zdCBwZXJpb2QgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnLicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3RoZSBhaXIgaXMgY2hva2VkIHdpdGggZHVzdCwgc3RhdGljLCB3aWZpJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNSxcbiAgICAgICAgICAgIGNsczogJ3BlcmlvZCdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21tYSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcsJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnc3ByYXdsIG9mIHNtYXJ0IGhvbWVzLCBjdWwtZGUtc2FjcywgbGFuZXdheXMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI2LFxuICAgICAgICAgICAgY2xzOiAnY29tbWEnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VtaWNvbG9uID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJzsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdyb3dzIG9mIGdyZWVuaG91c2VzOiBzb21lIHNoYXR0ZXJlZCBhbmQgYmFycmVuLCBvdGhlcnMgb3Zlcmdyb3duJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNCxcbiAgICAgICAgICAgIGNsczogJ3NlbWljb2xvbidcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncmF2ZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdeJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnYSBzaGltbWVyaW5nIGZpZWxkIG9mIHNvbGFyIHBhbmVscywgYnJva2VuIGFuZCBjb3Jyb2RlZCcsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjIsXG4gICAgICAgICAgICBjbHM6ICdncmF2ZSdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhc3RlcmlzayA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcqJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnaG9sbG93IHVzZXJzIGphY2sgaW4gYXQgdGhlIGRhdGFodWJzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMCxcbiAgICAgICAgICAgIGNsczogJ2FzdGVyaXNrJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGVyaW9kLCBjb21tYSwgc2VtaWNvbG9uLCBzZW1pY29sb24sIGFzdGVyaXNrLCBhc3RlcmlzaywgZ3JhdmUsIGdyYXZlXVxuICAgIH1cblxuICAgIGJhcmUoKSB7XG4gICAgICAgIGNvbnN0IGJhcmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnJm5ic3A7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnY29uY3JldGUgYW5kIHR3aXN0ZWQgcmViYXIgc3RyZXRjaCB0byB0aGUgaG9yaXpvbicsXG4gICAgICAgICAgICBjbHM6ICdibGFuaydcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmFyZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFuZHNjYXBlRGF0YVxuIiwiaW1wb3J0IE1hcEdlbmVyYXRvciBmcm9tICcuL01hcEdlbmVyYXRvcidcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jbGFzcyBNYXAge1xuICAgIGNvbnN0cnVjdG9yKGNvbCwgcm93KSB7XG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVkTWFwID0gbmV3IE1hcEdlbmVyYXRvcihjb2wsIHJvdylcbiAgICAgICAgdGhpcy5tYXAgPSB0aGlzLmdlbmVyYXRlZE1hcC5nZXRNYXAoKVxuICAgICAgICB0aGlzLml0ZW1zT25NYXAgPSBbXVxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwXG4gICAgfVxuXG4gICAgZ2V0TWFwQ2VudGVyKCkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IodGhpcy5jb2wvMiksIE1hdGguZmxvb3IodGhpcy5yb3cvMildXG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tTWFwTG9jYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKSwgVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKV1cbiAgICB9XG5cbiAgICBzZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKSB7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgc2V0RXZlbnRNYW5hZ2VyKGV2ZW50TWFuYWdlcikge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgcHVzaEl0ZW0oaXRlbSkge1xuXG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcC5wdXNoKGl0ZW0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdNQVAuUFVTSElURU06IGl0ZW0geCcsIGl0ZW0ueCwgJ2l0ZW0geScsIGl0ZW0ueSlcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnaXRlbXNPbk1hcCcsIHRoaXMuaXRlbXNPbk1hcClcbiAgICB9XG5cbiAgICBjaGVja0NoYXJhY3RlckxvY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBjaGFyID0gdGhpcy5jaGFyYWN0ZXIuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS54ID09PSBjaGFyLnggJiYgaXRlbS55ID09PSBjaGFyLnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goYG9uLSR7aXRlbS5uYW1lfWAsIGl0ZW0pXG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdpdGVtLXN0YXR1cycsIGl0ZW0ubmFtZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGBvZmYtJHtpdGVtLm5hbWV9YCwgaXRlbSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcFxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IExhbmRzY2FwZURhdGEgZnJvbSAnLi9MYW5kc2NhcGVEYXRhJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuXG5cbmNsYXNzIE1hcEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYXRpbmcgbWFwJylcbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVEYXRhKClcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuaW5pdChjb2wsIHJvdylcbiAgICAgICAgY29uc3Qgc2VlZGVkR3JpZCA9IHRoaXMuc2VlZChncmlkKVxuICAgICAgICB0aGlzLnNlZWRlZEdyaWQgPSBzZWVkZWRHcmlkXG4gICAgICAgIHRoaXMuZ3JvdygpXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgZ2VuZXJhdGVkJylcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlZWRlZEdyaWRcbiAgICB9XG5cbiAgICBpbml0KGNvbCwgcm93KSB7XG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG4gICAgICAgIGNvbnN0IGdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdzsgaSsrKSB7XG4gICAgICAgICAgICBncmlkW2ldID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBncmlkW2ldLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgc2VlZChncmlkKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldE51bWJlck9mRWxlbWVudFNlZWRzKCk7IGkrKykge1xuICAgICAgICAgICAgcmFuZG9tRWxlbWVudHMucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXMubGVuZ3RoKV0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VlZHMgPSB0aGlzLmdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cylcbiAgICAgICAgc2VlZHMubWFwKHNlZWQgPT4gZ3JpZFtzZWVkLnldW3NlZWQueF0gPSBzZWVkKVxuICAgICAgICB0aGlzLl9zZWVkcyA9IHNlZWRzXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKSB7XG4gICAgICAgIC8vICByZXR1cm4gMSAgICAgICAgLy8gdGVzdCBzZXR0aW5nXG4gICAgICAgIC8vIHJldHVybiAoKHRoaXMuY29sICogdGhpcy5yb3cpIC8gKHRoaXMuX2NvbCArIHRoaXMucm93KSkgIC8vIHNwYXJzZSBpbml0aWFsIHNlZWRpbmdcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBzZWVkcyA9IHRoaXMuX3NlZWRzXG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdvb2RTZWVkcyA9IFtdXG4gICAgICAgICAgICB0aGlzLmdvb2RTZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5mb3JFYWNoKChzZWVkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2RTZWVkcy5wdXNoKHRoaXMuY2hlY2tTZWVkKHNlZWQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBmb3IgKGxldCBnb29kU2VlZCBvZiBnb29kU2VlZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID09PSB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuY291bnRVbnNlZWRlZExvY2F0aW9ucygpKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5zZWVkZWRHcmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBsZXQgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgaWYgKChzZWVkLnggPCB0aGlzLmNvbCAmJiBzZWVkLnggPj0gMCkgJiZcbiAgICAgICAgICAgIChzZWVkLnkgPCB0aGlzLnJvdyAmJiBzZWVkLnkgPj0gMCkpIHtcbiAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFtzZWVkLnldW3NlZWQueF0gIT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKChzZWVkLnggPT09IGdvb2RTZWVkLngpICYmXG4gICAgICAgICAgICAgICAgKHNlZWQueSA9PT0gZ29vZFNlZWQueSkpIHtcbiAgICAgICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzZWVkU3VjY2VlZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykge1xuICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICBzZWVkcy5mb3JFYWNoKChvcmlnaW5hbFNlZWQpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmFiaWxpdHkobmV4dEdlblNlZWQucHJvYmFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkaXJlY3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueCA9IG9yaWdpbmFsU2VlZC54ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnkgPSBvcmlnaW5hbFNlZWQueSArIGRpcmVjdGlvblZhbHVlc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG4gICAgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXAuZ2V0TWFwKClcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbdGhpcy5ncmlkSW5kaWNlc1sxXV1bdGhpcy5ncmlkSW5kaWNlc1swXV1cbiAgICB9XG5cbiAgICBnZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UndmUgcmVhY2hlZCB0aGUgbWFwJ3MgZWRnZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhdGlvblxuICAgIH1cblxuICAgIGNoZWNrR3JpZEluZGljZXMobmV3R3JpZEluZGljZXMpIHtcbiAgICAgICAgbGV0IGxvY2F0aW9uT25HcmlkID0gZmFsc2VcbiAgICAgICAgaWYgKHRoaXMuZ290TWFwW25ld0dyaWRJbmRpY2VzWzFdXSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbk9uR3JpZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYXRpb25PbkdyaWRcbiAgICB9XG5cbiAgICBnZXRDU1NIZWlnaHRBbmRXaWR0aCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdCcpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgICAgIGNvbnN0IHdpZHRoID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKVxuICAgICAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH1cbiAgICB9XG5cbiAgICBnZXRDU1NDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgY3NzID0gdGhpcy5nZXRDU1NIZWlnaHRBbmRXaWR0aCgpXG4gICAgICAgIGNvbnN0IGNzc0xlZnQgPSB0aGlzLmdyaWRJbmRpY2VzWzBdICogY3NzLmhlaWdodFxuICAgICAgICBjb25zdCBjc3NUb3AgPSB0aGlzLmdyaWRJbmRpY2VzWzFdICogY3NzLndpZHRoXG4gICAgICAgIHJldHVybiB7IGNzc0xlZnQsIGNzc1RvcCB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1vdmVhYmxlXG4iLCJjbGFzcyBSZW5kZXJhYmxlIHsgIC8vIGdlbmVyYWxpemVkIHJlbmRlciBmdW5jdGlvbnMgZm9yIFNjZW5lcnksIENoYXJhY3RlclxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHNldExheWVyKGxheWVyKSB7XG4gICAgICAgIHRoaXMubGF5ZXIgPSBsYXllclxuICAgIH1cblxuICAgIGdldExheWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXllclxuICAgIH1cblxuICAgIHJlbmRlclNwYW4odW5pdCkge1xuICAgICAgICBsZXQgY2xzID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgICAgY2xzID0gdW5pdC5jbHNcbiAgICAgICAgICAgIGVsZW1lbnQgPSB1bml0LmVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bml0LnRvcCAmJiB1bml0LmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHt1bml0LnRvcH1weDsgbGVmdDogJHt1bml0LmxlZnR9cHhgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInVuaXQgJHtjbHN9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L3NwYW4+YFxuICAgIH1cblxuICAgIHJlbmRlckRpdihpdGVtKSB7XG4gICAgICAgIGxldCBkaXYgPSAnJ1xuICAgICAgICBsZXQgZWxlbWVudCA9ICcmbmJzcDsnXG4gICAgICAgIGxldCBzdHlsZSA9ICcnXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBkaXYgPSBpdGVtLmRpdlxuICAgICAgICAgICAgZWxlbWVudCA9IGl0ZW0uZWxlbWVudFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnRvcCAmJiBpdGVtLmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHtpdGVtLnRvcH1weDsgbGVmdDogJHtpdGVtLmxlZnR9cHg7IHBvc2l0aW9uOiBhYnNvbHV0ZWBcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5vZmZNYXApIHtcbiAgICAgICAgICAgIHN0eWxlICs9IGA7IGRpc3BsYXk6IG5vbmVgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiJHtkaXZ9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L2Rpdj5gXG59XG5cbiAgICByZW5kZXJMYXllcih1bml0LCBsYXllcklkKSB7XG4gICAgICAgIGlmICh1bml0LnR5cGUgPT09ICdhY3RvcicpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3Bhbih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGl2KHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlU3BhbihhY3Rvcikge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyU3BhbihhY3RvcikpXG4gICAgfVxuXG4gICAgdXBkYXRlRGl2KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlckRpdihpdGVtKSlcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQocGFyZW50TGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudExheWVySWQpXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgLy8gY3JlYXRlcyBkaXYgaWQgd2l0aGluIGVuY2xvc2luZyBkaXYgLi4uXG4gICAgICAgIGNoaWxkLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJhYmxlXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5cblxuY2xhc3MgU2NlbmVyeSBleHRlbmRzIFJlbmRlcmFibGUgeyAgLy8gU2NlbmVyeS1zcGVjaWZpYyByZW5kZXJpbmcgZnVuY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXAuZ2V0TWFwKClcbiAgICAgICAgdGhpcy5yZW5kZXJHcmlkTGF5ZXIoKVxuICAgICAgICBjb25zb2xlLmxvZygnc2NlbmVyeSByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyR3JpZExheWVyKCkge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5nb3RNYXAubWFwKGFyciA9PiB7IHJldHVybiBhcnIuc2xpY2UoKSB9KVxuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMuY3JlYXRlR3JpZExheWVyKGdyaWQpKVxuICAgICAgICB0aGlzLmRyYXdHcmlkTGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUdyaWRMYXllcihncmlkKSB7XG4gICAgICAgIGNvbnN0IHNjZW5lcnlHcmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3dJdGVtcyA9IGdyaWRbaV1cbiAgICAgICAgICAgIGxldCByb3cgPSAnJyAgLy8gcG9zc2libHkgbWFrZSBlYWNoIHJvdyBhIHRhYmxlP1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyArPSB0aGlzLnJlbmRlclNwYW4ocm93SXRlbXNbaV0pIC8vIGFkZCByZW5kZXJlZCBpdGVtcyB0byB0aGUgZ3JpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NlbmVyeUdyaWQucHVzaChyb3cpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjZW5lcnlHcmlkXG4gICAgfVxuXG4gICAgZHJhd0dyaWRMYXllcigpIHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgY29uc3QgZ3JpZFRvSFRNTCA9IGxheWVyLmpvaW4oJzxiciAvPicpICAvLyB1c2luZyBIVE1MIGJyZWFrcyBmb3Igbm93XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhbmRzY2FwZS1sYXllcicpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IGdyaWRUb0hUTUxcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU2NlbmVyeVxuIiwiY2xhc3MgU3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcihldmVudE1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy51cGRhdGUsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdpdGVtLXN0YXR1cycsIHRoaXMuZGlzcGxheUl0ZW0sIHRoaXMpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGRpc3BsYXlJdGVtKGl0ZW1OYW1lKSB7XG4gICAgICAgIHRoaXMuc2V0KGB5b3Ugc2VlICR7aXRlbU5hbWV9IGhlcmVgLCAxMClcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMudXBkYXRlLCB0aGlzKVxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZGVsYXk9MCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1xuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIFVzZXJJbnB1dCB7XG4gICAgY29uc3RydWN0b3Ioa2V5QWN0aW9uTWFwKSB7XG4gICAgICAgIHRoaXMua2V5QWN0aW9uTWFwID0ga2V5QWN0aW9uTWFwXG5cbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy50cnlBY3Rpb25Gb3JFdmVudC5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgdHJ5QWN0aW9uRm9yRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFVdGlsaXR5LmNvbnRhaW5zKHRoaXMua2V5QWN0aW9uTWFwLCBldmVudC5rZXlDb2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYG5vdCBhIHZhbGlkIGtleWNvZGU6ICR7ZXZlbnQua2V5Q29kZX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXBbZXZlbnQua2V5Q29kZV0oKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJJbnB1dFxuIiwiY2xhc3MgVXRpbGl0eSB7XG4gICAgc3RhdGljIGNvbnRhaW5zKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuaW5kZXhPZihTdHJpbmcocHJvcGVydHkpKSAhPT0gLTFcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RyaW5nVG9OdW1iZXIoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcubWF0Y2goL1xcZCsvKVswXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb21pemUobXVsdCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXVsdClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eVxuIiwiaW1wb3J0IE1hcCBmcm9tICcuL01hcCdcbmltcG9ydCBTY2VuZXJ5IGZyb20gJy4vU2NlbmVyeSdcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSAnLi9DaGFyYWN0ZXInXG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gJy4vRXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IEl0ZW1HZW5lcmF0b3IgZnJvbSAnLi9JdGVtR2VuZXJhdG9yJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuL1N0YXR1cydcbmltcG9ydCBVc2VySW5wdXQgZnJvbSAnLi9Vc2VySW5wdXQnXG5pbXBvcnQgQmx1ZXByaW50cyBmcm9tICcuL0JsdWVwcmludHMnXG5pbXBvcnQgSW52ZW50b3J5IGZyb20gJy4vSW52ZW50b3J5J1xuXG5cbmNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmluaXRHYW1lKClcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKVxuICAgIH1cblxuICAgIGluaXRHYW1lKCkge1xuICAgICAgICB0aGlzLnNwYWNlcyA9IFtdXG4gICAgICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZVxuICAgICAgICB0aGlzLm1hcCA9IG5ldyBNYXAoNjAsIDYwKVxuICAgICAgICB0aGlzLnNjZW5lcnkgPSBuZXcgU2NlbmVyeSh0aGlzLm1hcClcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKHRoaXMubWFwKVxuICAgICAgICB0aGlzLm1hcC5zZXRDaGFyYWN0ZXIodGhpcy5jaGFyYWN0ZXIpICAvLyBnaXZlcyBtYXAgcmVmZXJlbmNlIHRvIGNoYXJhY3RlclxuXG5cbiAgICAgICAgdGhpcy5FTSA9IG5ldyBFdmVudE1hbmFnZXIoKVxuXG5cbiAgICAgICAgdGhpcy5pdGVtR2VuZXJhdG9yID0gbmV3IEl0ZW1HZW5lcmF0b3IodGhpcy5tYXAsIHRoaXMuRU0sIDYpICAvLyBoYXZlIHRvIHBhc3MgaW4gRU0gdG8gZ2VuZXJhdG9yIChpbmVsZWdhbnQpXG5cbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuc2V0RXZlbnRNYW5hZ2VyKHRoaXMuRU0pXG4gICAgICAgIHRoaXMubWFwLnNldEV2ZW50TWFuYWdlcih0aGlzLkVNKVxuXG4gICAgICAgIHRoaXMuc3RhdHVzID0gbmV3IFN0YXR1cyh0aGlzLkVNKVxuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoJ3lvdSB3YWtlIHVwJylcbiAgICAgICAgdGhpcy5ibHVlcHJpbnQgPSBCbHVlcHJpbnRzLnJhbmRvbSgpXG4gICAgICAgIHRoaXMuc3RhdHVzLnNldChgeW91IGFyZSBjYXJyeWluZyAke3RoaXMuYmx1ZXByaW50Lm5hbWV9YCwgNDAwMClcblxuXG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSh0aGlzLmJsdWVwcmludClcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkuc2V0RXZlbnRNYW5hZ2VyKHRoaXMuRU0pXG5cblxuXG5cbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuaW5pdFVzZXJJbnB1dCgpXG4gICAgfVxuXG4gICAgaW5pdFVzZXJJbnB1dCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VySW5wdXQoe1xuICAgICAgICAgICAgJzM4JzogdGhpcy5jaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ25vcnRoJyksXG4gICAgICAgICAgICAnMzcnOiB0aGlzLmNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnd2VzdCcpLFxuICAgICAgICAgICAgJzM5JzogdGhpcy5jaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ2Vhc3QnKSxcbiAgICAgICAgICAgICc0MCc6IHRoaXMuY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdzb3V0aCcpLFxuXG4gICAgICAgICAgICAnODQnOiB0aGlzLmNoYXJhY3Rlci5nZXRBY3Rpb24oJ3Rha2UnLCAnaXRlbScpIC8vICh0KWFrZSBpdGVtXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnQhJylcbiAgICB9XG5cbiAgICBnYW1lSXNPdmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lT3ZlclxuICAgIH1cblxuICAgIGV4cGxvcmUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBleHBsb3JpbmcgdGhlICR7dGhpcy5raW5kfSB6b25lIWApXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBHYW1lKCk7XG4iXX0=
