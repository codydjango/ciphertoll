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
    function Character(mapInstance, initialPosition) {
        _classCallCheck(this, Character);

        var _this = _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).call(this, mapInstance));

        _this.mapInstance = mapInstance;
        _this.initialPosition = initialPosition;

        _this.initSettings();
        _this.render();

        console.log('character rendered');
        return _this;
    }

    _createClass(Character, [{
        key: 'initSettings',
        value: function initSettings() {
            this.EM = _eventManager2.default;
            this.inventory = _inventory2.default;
            this.setInitialGridIndices(this.getPosition());
        }
    }, {
        key: 'render',
        value: function render() {
            this.updateSpan(this.getCharacter());
            this.drawLayer('character-layer');
        }
    }, {
        key: 'getPosition',
        value: function getPosition() {
            var position = void 0;
            this.initialPosition ? position = this.initialPosition : position = this.mapInstance.getMapCenter();
            return position;
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

            console.log('this.location', this.location);

            var position = {
                x: this.location.x,
                y: this.location.y
            };

            this.EM.publish('moved-to', position);
        }
    }, {
        key: 'printLocalStatus',
        value: function printLocalStatus() {
            this.EM.publish('character-moved', this.location);
            var localItem = this.getLocalItem();

            if (localItem) {
                if (localItem.mining === 'empty') {
                    this.EM.publish('status', 'mining has been exhausted for this region');
                } else if (localItem.mining) {
                    this.EM.publish('status', 'a miner pulls compounds from the region');
                } else {
                    this.EM.publish('display-item', localItem.name);
                }
            }
        }
    }, {
        key: 'getLocalItem',
        value: function getLocalItem() {
            var char = this.getCharacter();
            var localItem = null;
            this.mapInstance.itemsOnMap.forEach(function (item) {
                if (item.x === char.x && item.y === char.y) {
                    localItem = item;
                }
            });
            return localItem;
        }
    }, {
        key: 'take',
        value: function take() {
            var localItem = this.getLocalItem();

            if (localItem) {
                this.EM.publish(localItem.name + '-' + localItem.identityNumber + ' taken');
                this.EM.publish('status', localItem.name + ' taken');
            } else {
                this.EM.publish('status', 'there is nothing here worth taking');
            }
        }
    }, {
        key: 'getItemLocation',
        value: function getItemLocation(itemName) {
            var char = this.getCharacter();
            var itself = this.inventory.retrieveItem(itemName);
            var location = [char.x, char.y];
            return { itself: itself, location: location };
        }
    }, {
        key: 'mine',
        value: function mine() {
            var miner = this.getItemLocation('particle miner');
            if (miner.itself) {
                miner.itself.mine(miner.location);
                this.EM.publish('remove-inventory', miner.itself);
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

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InventoryDisplay = function () {
    function InventoryDisplay() {
        _classCallCheck(this, InventoryDisplay);

        this.EM = _eventManager2.default;
        this.EM.subscribe('display-inventory', this.render, this);
        this.EM.subscribe('display-mined', this.renderMined, this);
    }

    _createClass(InventoryDisplay, [{
        key: 'render',
        value: function render(inventoryObject) {
            var str = inventoryObject.map(function (item) {
                return item.name;
            }).join('<br>');
            str = 'INVENTORY <br><br>' + str;
            this.set(str, 'inventory-status');
        }
    }, {
        key: 'renderMined',
        value: function renderMined(minedElementsObject) {
            var str = this.cleanJSONString(JSON.stringify(minedElementsObject));
            str = 'PARTICLES MINED <br><br>' + str;
            this.set(str, 'mining-status');
        }
    }, {
        key: 'cleanJSONString',
        value: function cleanJSONString(str) {
            str = str.replace(/"/g, '');
            str = str.replace(/:/g, ' ');
            str = str.replace(/{/g, '');
            str = str.replace(/}/g, '');
            str = str.replace(/,/g, '<br>');

            return str;
        }
    }, {
        key: 'set',
        value: function set(description, elementID) {
            var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            window.setTimeout(function () {
                document.getElementById(elementID).innerHTML = description;
            }, delay);
        }
    }]);

    return InventoryDisplay;
}();

exports.default = InventoryDisplay;

},{"./eventManager":15}],6:[function(require,module,exports){
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
                cls: 'period',
                particles: {
                    copper: 10,
                    chrome: 15,
                    lead: 30,
                    styrofoam: 30,
                    acrylic: 20,
                    hydrocarbons: 15,
                    silicon: 10,
                    ceramic: 10
                },
                particleAmount: 10,
                maxParticles: 10
            };
            var comma = {
                element: ',',
                description: 'sprawl of smart homes, cul-de-sacs, laneways',
                probability: 26,
                cls: 'comma',
                particles: {
                    iron: 30,
                    copper: 10,
                    mercury: 10,
                    latex: 15,
                    wood: 20,
                    hydrocarbons: 15,
                    glass: 30,
                    carbon: 20
                },
                particleAmount: 10,
                maxParticles: 10

            };
            var semicolon = {
                element: ';',
                description: 'rows of greenhouses: some shattered and barren, others overgrown',
                probability: 24,
                cls: 'semicolon',
                particles: {
                    iron: 30,
                    wood: 20,
                    fiber: 10,
                    bone: 10,
                    acrylic: 20,
                    ozone: 15,
                    glass: 30,
                    carbon: 20
                },
                particleAmount: 10,
                maxParticles: 10

            };
            var grave = {
                element: '^',
                description: 'a shimmering field of solar panels, broken and corroded',
                probability: 22,
                cls: 'grave',
                particles: {
                    copper: 10,
                    mercury: 10,
                    acrylic: 20,
                    fiber: 10,
                    ozone: 15,
                    benzene: 20,
                    glass: 30,
                    ceramic: 10
                },
                particleAmount: 10,
                maxParticles: 10

            };
            var asterisk = {
                element: '*',
                description: 'hollow users jack in at the datahubs',
                probability: 20,
                cls: 'asterisk',
                particles: {
                    chrome: 15,
                    lead: 30,
                    mercury: 10,
                    styrofoam: 30,
                    acrylic: 20,
                    benzene: 20,
                    silicon: 10,
                    carbon: 20
                },
                particleAmount: 10,
                maxParticles: 10

            };
            return [period, comma, semicolon, semicolon, asterisk, asterisk, grave, grave];
        }
    }, {
        key: 'bare',
        value: function bare() {
            var bare = {
                element: '&nbsp;',
                description: 'concrete and twisted rebar stretch to the horizon',
                cls: 'blank',
                particleAmount: 10,
                maxParticles: 10,
                particles: {
                    iron: 30,
                    copper: 10,
                    chrome: 15,
                    lead: 30,
                    mercury: 10,
                    styrofoam: 30,
                    bone: 10,
                    hydrocarbons: 15,
                    uranium: 10,
                    carbon: 20
                }

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

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

var _MapGenerator = require('./MapGenerator');

var _MapGenerator2 = _interopRequireDefault(_MapGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
    function Map(mapData) {
        _classCallCheck(this, Map);

        console.log('map constructor', mapData);

        this.map = mapData;
        this.col = Map.getCol(mapData);
        this.row = Map.getRow(mapData);

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
    }], [{
        key: 'getCol',
        value: function getCol(mapData) {
            return mapData.length;
        }
    }, {
        key: 'getRow',
        value: function getRow(mapData) {
            return mapData[0].length;
        }
    }, {
        key: 'generate',
        value: function generate(_ref) {
            var col = _ref.col,
                row = _ref.row;

            var mapGenerator = new _MapGenerator2.default();

            return mapGenerator.generate({ col: col, row: row });
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
    function MapGenerator() {
        _classCallCheck(this, MapGenerator);
    }

    _createClass(MapGenerator, [{
        key: 'generate',
        value: function generate(_ref) {
            var col = _ref.col,
                row = _ref.row;


            this.col = col;
            this.row = row;

            this.landscapeSeeds = new _LandscapeData2.default();

            this.makeGrid();
            this.seed();
            this.grow();

            console.log('map generated');

            return this.grid;
        }
    }, {
        key: 'makeGrid',
        value: function makeGrid() {
            this.grid = [];
            for (var i = 0; i < this.row; i++) {
                this.grid[i] = [];
                for (var j = 0; j < this.col; j++) {
                    var newCell = Object.assign({}, this.landscapeSeeds.bare);
                    newCell = this.assignCoordinates(newCell, j, i);
                    this.grid[i].push(newCell);
                }
            }
        }
    }, {
        key: 'assignCoordinates',
        value: function assignCoordinates(cell, xCoord, yCoord) {
            cell.x = xCoord;
            cell.y = yCoord;
            return cell;
        }
    }, {
        key: 'seed',
        value: function seed() {
            var _this = this;

            var randomElements = [];
            for (var i = 0; i < this.getNumberOfElementSeeds(); i++) {
                randomElements.push(this.landscapeSeeds.features[_Utility2.default.randomize(this.landscapeSeeds.features.length)]);
            }
            this.seeds = this.generateSeedLocations(randomElements);
            this.seeds.map(function (seed) {
                return _this.grid[seed.y][seed.x] = seed;
            });
        }
    }, {
        key: 'getNumberOfElementSeeds',
        value: function getNumberOfElementSeeds() {
            return this.col + this.row; // rich initial seeding
        }
    }, {
        key: 'generateSeedLocations',
        value: function generateSeedLocations(randomElements) {
            var _this2 = this;

            return randomElements.map(function (el) {
                el.x = _Utility2.default.randomize(_this2.row - 1);
                el.y = _Utility2.default.randomize(_this2.col - 1);
                return el;
            });
        }
    }, {
        key: 'grow',
        value: function grow() {
            var mapPopulated = false;

            while (!mapPopulated) {
                this.generateNextSeedBatch();
                if (this.outOfSeeds()) mapPopulated = true;
                this.filterBadSeeds();
                this.plantSeeds();
                this.hasUnseededLocations() ? this.seeds = this.goodSeeds : mapPopulated = true;
            }
        }
    }, {
        key: 'generateNextSeedBatch',
        value: function generateNextSeedBatch() {
            var _this3 = this;

            this.nextGenSeeds = [];
            this.seeds.forEach(function (originalSeed) {
                _this3.originalSeed = originalSeed;
                _this3.getNewSeed();
            });
        }
    }, {
        key: 'getNewSeed',
        value: function getNewSeed() {
            for (var key in _Constants.DIRECTIONS) {
                this.newSeed = Object.assign({}, this.originalSeed);
                this.direction = _Constants.DIRECTIONS[key];
                if (this.checkProbability(this.newSeed)) {
                    this.createNewSeedCoordinates();
                    this.nextGenSeeds.push(this.newSeed);
                }
            }
        }
    }, {
        key: 'checkProbability',
        value: function checkProbability(newSeed) {
            return _Utility2.default.probability(newSeed.probability);
        }
    }, {
        key: 'createNewSeedCoordinates',
        value: function createNewSeedCoordinates() {
            for (var key in this.direction) {
                if (key === 'x') {
                    this.newSeed.x = this.originalSeed.x + this.direction[key];
                } else if (key === 'y') {
                    this.newSeed.y = this.originalSeed.y + this.direction[key];
                }
            }
        }
    }, {
        key: 'outOfSeeds',
        value: function outOfSeeds() {
            return !this.nextGenSeeds.length;
        }
    }, {
        key: 'filterBadSeeds',
        value: function filterBadSeeds() {
            var _this4 = this;

            this.goodSeeds = [];
            this.nextGenSeeds.forEach(function (seed) {
                if (_this4.checkSeed(seed)) {
                    _this4.goodSeeds.push(_this4.checkSeed(seed));
                }
            });
        }
    }, {
        key: 'checkSeed',
        value: function checkSeed(seed) {
            if (this.ifOffMap(seed)) return null;
            if (this.isAlreadySeeded(seed)) return null;
            // if (this.isWaitingToBeSeeded(seed)) return null
            return seed;
        }
    }, {
        key: 'ifOffMap',
        value: function ifOffMap(seed) {
            return !(seed.x < this.col && seed.x >= 0 && seed.y < this.row && seed.y >= 0);
        }
    }, {
        key: 'isAlreadySeeded',
        value: function isAlreadySeeded(seed) {
            return this.grid[seed.y][seed.x].cls !== 'blank';
        }
    }, {
        key: 'plantSeeds',
        value: function plantSeeds() {
            var _this5 = this;

            this.goodSeeds.forEach(function (goodSeed) {
                if (_this5.grid[goodSeed.y][goodSeed.x].cls === 'blank') {
                    _this5.grid[goodSeed.y][goodSeed.x] = goodSeed;
                }
            });
        }
    }, {
        key: 'hasUnseededLocations',
        value: function hasUnseededLocations() {
            var flattenedGrid = [].concat.apply([], this.grid);
            var count = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = flattenedGrid[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    if (i.cls === 'blank') count++;
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

            return count;
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
            this.map = map;
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
                location = this.map[newGridIndices[1]][newGridIndices[0]];
                this.gridIndices = newGridIndices;
                actor.x = newGridIndices[0];
                actor.y = newGridIndices[1];
            } else {
                location = this.map[(this.gridIndices[1], this.gridIndices[0])];
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

            if (this.map[x]) {
                var location = this.map[x][y];
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

            switch (item.mining) {
                case 'full':
                    style += '; animation: mining-full 3s infinite';
                    break;
                case 'half':
                    style += '; animation: mining-half 3s infinite';
                    break;
                case 'empty':
                    style += '; animation: mining-empty 3s infinite';
                    break;
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

        _this.map = map.getMap();
        _this.renderLayer();
        console.log('scenery rendered');
        return _this;
    }

    _createClass(Scenery, [{
        key: 'renderLayer',
        value: function renderLayer() {
            var grid = this.map.map(function (arr) {
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
    }, {
        key: "probability",
        value: function probability(percentage) {
            var probabilityArray = [];
            for (var i = 0; i < percentage; i++) {
                probabilityArray.push(true);
            }
            for (var _i = 0; _i < 100 - percentage; _i++) {
                probabilityArray.push(false);
            }
            return probabilityArray[Utility.randomize(100)];
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

var _items = require('./items');

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _InventoryDisplay = require('./InventoryDisplay');

var _InventoryDisplay2 = _interopRequireDefault(_InventoryDisplay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COL = 60;
var ROW = 60;
var ITEM_NUM = 5;

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.initGame();
    }

    _createClass(Game, [{
        key: 'initGame',
        value: function initGame() {
            var settings = void 0;

            if (this.hasGameInProgress()) {
                settings = this.resumeSettings();
            } else {
                settings = this.generateSettings();
            }

            var moved = function moved(location) {
                console.log('location', location);
            };
            _eventManager2.default.subscribe('moved-to', moved);

            this.loadSettings(settings);
            this.startGame();
        }
    }, {
        key: 'hasGameInProgress',
        value: function hasGameInProgress() {
            return _store2.default.has('map');
        }
    }, {
        key: 'resumeSettings',
        value: function resumeSettings() {
            var settings = {
                mapData: _store2.default.get('map')
            };

            return settings;
        }
    }, {
        key: 'generateSettings',
        value: function generateSettings() {
            var settings = {};

            settings.mapData = _Map2.default.generate({ col: COL, row: ROW });

            _store2.default.set('map', settings.mapData);

            return settings;
        }
    }, {
        key: 'loadSettings',
        value: function loadSettings(settings) {
            var blueprint = this.blueprint = _Blueprints2.default.random();
            var items = this.items = (0, _items.generateItems)(ITEM_NUM);

            var status = this.status = new _Status2.default();
            var inventoryDisplay = this.inventoryDisplay = new _InventoryDisplay2.default();

            var map = this.map = new _Map2.default(settings.mapData);
            var scenery = this.scenery = new _Scenery2.default(map);
            var character = this.character = new _Character2.default(map);

            map.setItems(items);
            map.setCharacter(character);

            this.inventory = _inventory2.default;
            this.inventory.add(blueprint);

            this.input = this.initUserInput(character);
        }
    }, {
        key: 'reset',
        value: function reset() {
            console.log('reset map!');

            _store2.default.clear();

            this.initGame();
        }
    }, {
        key: 'initUserInput',
        value: function initUserInput(character) {
            return new _UserInput2.default({
                '82': this.reset.bind(this), // (r) reset map
                '38': character.getAction('move', 'north'),
                '37': character.getAction('move', 'west'),
                '39': character.getAction('move', 'east'),
                '40': character.getAction('move', 'south'),
                '84': character.getAction('take'), // (t)ake item
                // '73': character.getAction('checkInventory'), // check (i)nventory
                '77': character.getAction('mine') // deploy particle (m)iner
            });
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            this.status.set('you wake up');
            this.status.set('you are carrying ' + this.blueprint.name, 4000);
        }
    }]);

    return Game;
}();

exports.default = new Game();

},{"./Blueprints":2,"./Character":3,"./InventoryDisplay":5,"./Map":7,"./Scenery":11,"./Status":12,"./UserInput":13,"./eventManager":15,"./inventory":17,"./items":20,"./store":21}],17:[function(require,module,exports){
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
        this.EM.subscribe('add-mined', this.addMined, this);

        this.storeMining = {};
        this.miningStateObj = {};
    }

    _createClass(Inventory, [{
        key: 'add',
        value: function add(item) {
            this.contents.push(item);
            this.update();
        }
    }, {
        key: 'remove',
        value: function remove(item) {
            var _this = this;

            var theItem = item;
            this.contents.forEach(function (item, i, array) {
                if (array[i] === theItem) {
                    _this.contents.splice(i, 1);
                    console.log('inventory item removed');
                    _this.update();
                }
            });
        }
    }, {
        key: 'update',
        value: function update() {
            this.EM.publish('display-inventory', this.contents);
        }
    }, {
        key: 'retrieveItem',
        value: function retrieveItem(itemName) {
            var foundItem = null;
            this.contents.forEach(function (item) {
                if (item.name === itemName) {
                    foundItem = item;
                }
            });
            return foundItem;
        }
    }, {
        key: 'addMined',
        value: function addMined(currentObj) {
            // if state object doesn't exist, add all particles to storage
            if (!this.miningStateObj[currentObj.ID]) {
                this.updateMiningState(currentObj);
                this.incrementStorage(this.stripID(currentObj));

                // if it does exist, check curr vs state and add only the right particles
            } else {
                this.incrementStorage(this.stripID(this.checkMiningState(currentObj)));
                this.updateMiningState(currentObj);
            }

            var displayParticles = this.storeMining;
            this.EM.publish('display-mined', displayParticles);
        }
    }, {
        key: 'checkMiningState',
        value: function checkMiningState(currentObj) {
            var _this2 = this;

            var checkedObj = {};
            Object.keys(currentObj).forEach(function (key) {
                if (!checkedObj[key]) {
                    checkedObj[key] = 0;
                }
                if (!_this2.miningStateObj[currentObj.ID][key]) {
                    _this2.miningStateObj[currentObj.ID][key] = 0;
                }
                checkedObj[key] = currentObj[key] - _this2.miningStateObj[currentObj.ID][key];
            });
            return checkedObj;
        }
    }, {
        key: 'incrementStorage',
        value: function incrementStorage(particleObj) {
            var _this3 = this;

            Object.keys(particleObj).forEach(function (key) {
                if (!_this3.storeMining[key]) {
                    _this3.storeMining[key] = 0;
                }
                _this3.storeMining[key] += particleObj[key];
            });
        }
    }, {
        key: 'updateMiningState',
        value: function updateMiningState(currentObj) {
            this.miningStateObj[currentObj.ID] = Object.assign({}, currentObj);
        }
    }, {
        key: 'stripID',
        value: function stripID(currentObj) {
            var particleObj = {};
            Object.keys(currentObj).forEach(function (key) {
                if (key !== 'ID') {
                    particleObj[key] = currentObj[key];
                }
            });
            return particleObj;
        }
    }]);

    return Inventory;
}();

exports.default = new Inventory();

},{"./eventManager":15}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Moveable2 = require('../Moveable');

var _Moveable3 = _interopRequireDefault(_Moveable2);

var _Utility = require('../Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _eventManager = require('../eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const ITEMS = {
//     miner: {
//         name: 'particle miner',
//         type: 'item',
//         element: '|',
//         description: 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.',
//         div: 'item-miner'
//     },
//     parser: {
//         name: 'noise parser',
//         type: 'item',
//         element: '?',
//         description: 'prototype. parses atmospheric data for latent information. signal-to-noise ratio not guaranteed.',
//         div: 'item-parser'
//     },
//     interface: {
//         name: 'psionic interface',
//         type: 'item',
//         element: '&',
//         description: `connects seamlessly to a standard-issue bioport. facilitates sundry interactions performed via PSI-NET.`,
//         div: 'item-interface'
//     },
//     printer: {
//         name: 'molecular printer',
//         type: 'item',
//         element: '#',
//         description: 'generates objects according to a blueprint. molecules not included.',
//         div: 'item-printer'
//     }
// }

var Item = function (_Moveable) {
    _inherits(Item, _Moveable);

    function Item(itemConfig) {
        _classCallCheck(this, Item);

        // merge in config properties
        // const target = Object.assign(this, itemConfig)

        // additional properties
        var _this = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).call(this));

        _this.identityNumber = _Utility2.default.Id();
        _this.type = 'item';
        _this.offMap = false;
        // this.inInventory = false

        _this.EM = _eventManager2.default;
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
            var el = document.getElementById(layerId);
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

            switch (this.name) {
                case 'particle miner':
                    this.haltMining();
                    break;
            }

            this.EM.publish('add-inventory', this);
            // this.EM.subscribe('remove-inventory', this.onDrop, this)
            this.renderLayer(this, this.div);
        }
    }, {
        key: 'onDrop',
        value: function onDrop() {

            this.EM.subscribe(this.name + '-' + this.identityNumber + ' taken', this.onTake, this, true);
            //     this.renderLayer(this, this.div)
        }
    }]);

    return Item;
}(_Moveable3.default);

exports.default = Item;

},{"../Moveable":9,"../Utility":14,"../eventManager":15}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Item2 = require('./Item');

var _Item3 = _interopRequireDefault(_Item2);

var _Utility = require('../Utility');

var _Utility2 = _interopRequireDefault(_Utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParticleMiner = function (_Item) {
    _inherits(ParticleMiner, _Item);

    function ParticleMiner() {
        _classCallCheck(this, ParticleMiner);

        var _this = _possibleConstructorReturn(this, (ParticleMiner.__proto__ || Object.getPrototypeOf(ParticleMiner)).call(this));

        _this.name = 'particle miner';
        _this.type = 'item';
        _this.element = '|';
        _this.description = 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.';
        _this.div = 'item-miner';
        // must subscribe the item directly, not on the abstract class
        _this.EM.subscribe(_this.name + '-' + _this.identityNumber + ' taken', _this.onTake, _this);

        _this.minedParticles = {
            ID: _this.identityNumber
        };

        return _this;
    }

    _createClass(ParticleMiner, [{
        key: 'mine',
        value: function mine(location) {
            var _this2 = this;

            // try setting the location immediately, using THIS

            this.locale = this.map[location[1]][location[0]];

            this.setMiningConfig();

            // calculate ratios once, rather than w every interval
            this.determineParticleRatios();
            this.checkParticleAmounts();
            this.cancellationKey = window.setInterval(function () {
                _this2.checkParticleAmounts();
            }, 3000);

            this.setOnMap(this.map, location);
            this.render();
        }
    }, {
        key: 'setMiningConfig',
        value: function setMiningConfig() {
            this.offMap = false;
            if (!this.mining) {
                this.mining = 'full';
            }
        }
    }, {
        key: 'determineParticleRatios',
        value: function determineParticleRatios() {
            var _this3 = this;

            this.allParticles = [];
            Object.keys(this.locale.particles).forEach(function (particle) {
                var numberOfParticles = _this3.locale.particles[particle];
                while (numberOfParticles) {
                    _this3.allParticles.push(particle);
                    numberOfParticles--;
                }
            });
        }
    }, {
        key: 'extractParticles',
        value: function extractParticles() {
            var randomParticle = this.allParticles[_Utility2.default.randomize(this.allParticles.length)];
            if (!this.minedParticles[randomParticle]) {
                this.minedParticles[randomParticle] = 1;
            } else {
                this.minedParticles[randomParticle]++;
            }
            var minedObj = this.minedParticles;
            this.EM.publish('add-mined', minedObj);
        }
    }, {
        key: 'checkParticleAmounts',
        value: function checkParticleAmounts() {
            if (this.locale.particleAmount === 0) {
                this.mining = 'empty';
            } else if (this.locale.particleAmount >= this.locale.maxParticles / 2) {
                this.mining = 'full';
                this.locale.particleAmount--;
                this.extractParticles();
            } else if (this.locale.particleAmount < this.locale.maxParticles / 2) {
                this.mining = 'half';
                this.locale.particleAmount--;
                this.extractParticles();
            }
            this.render();
        }
    }, {
        key: 'render',
        value: function render() {
            this.updateDiv(this);
            this.drawLayer(this.div);
        }
    }, {
        key: 'haltMining',
        value: function haltMining() {
            // this.mining = false
            window.clearInterval(this.cancellationKey);
        }
    }]);

    return ParticleMiner;
}(_Item3.default);

exports.default = ParticleMiner;

},{"../Utility":14,"./Item":18}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateItems = undefined;

var _ParticleMiner = require('./ParticleMiner');

var _ParticleMiner2 = _interopRequireDefault(_ParticleMiner);

var _Utility = require('../Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Item = require('./Item');

var _Item2 = _interopRequireDefault(_Item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ITEMS = [_ParticleMiner2.default];

function randomItem() {
    return new ITEMS[_Utility2.default.randomize(ITEMS.length)]();
}

function generateItems() {
    var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var items = [];
    for (var i = 0; i < number; i++) {
        items.push(randomItem());
    }
    return items;
}

exports.generateItems = generateItems;

},{"../Utility":14,"./Item":18,"./ParticleMiner":19}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store() {
        _classCallCheck(this, Store);

        this.EM = _eventManager2.default;

        if (typeof window.localStorage === 'undefined') {
            console.log('no localstorage, saving disabled');
            window.alert('saving disabled');
            this.disabled = true;
        } else {
            this.disabled = false;
            this.storage = window.localStorage;
        }
    }

    _createClass(Store, [{
        key: 'clear',
        value: function clear() {
            this.storage.clear();
        }
    }, {
        key: 'has',
        value: function has(key) {
            return this.storage.getItem(key) !== null;
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            console.log('store.set', key);

            this.storage.setItem(key, JSON.stringify(value));
        }
    }, {
        key: 'get',
        value: function get(key) {
            console.log('store.get', key);

            return JSON.parse(this.storage.getItem(key));
        }
    }]);

    return Store;
}();

exports.default = new Store();

},{"./eventManager":15}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0ludmVudG9yeURpc3BsYXkuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIiwic3JjL2pzL2l0ZW1zL0l0ZW0uanMiLCJzcmMvanMvaXRlbXMvUGFydGljbGVNaW5lci5qcyIsInNyYy9qcy9pdGVtcy9pbmRleC5qcyIsInNyYy9qcy9zdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLE9BQU8sSUFBUDs7Ozs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7QUFHQSxJQUFNLGdCQUFnQjtBQUNsQixzQkFBa0I7QUFDZCxjQUFNLCtCQURRO0FBRWQscUJBQWEsRUFGQztBQUdkLG1CQUFXLEVBSEc7QUFJZCxzQkFBYztBQUpBLEtBREE7QUFPbEIsb0JBQWdCO0FBQ1osY0FBTSw2QkFETTtBQUVaLHFCQUFhLEVBRkQ7QUFHWixtQkFBVyxFQUhDO0FBSVosc0JBQWM7QUFKRixLQVBFO0FBYWxCLG1CQUFlO0FBQ1gsY0FBTSw0QkFESztBQUVYLHFCQUFhLEVBRkY7QUFHWCxtQkFBVyxFQUhBO0FBSVgsc0JBQWM7QUFKSDtBQWJHLENBQXRCOztJQXNCTSxTO0FBQ0YsdUJBQVksSUFBWixF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LFlBQUksT0FBTyxPQUFPLFlBQWQsS0FBK0IsV0FBbkMsRUFBZ0Q7QUFDNUMsb0JBQVEsR0FBUixDQUFZLGtDQUFaO0FBQ0EsbUJBQU8sS0FBUCxDQUFhLGlCQUFiO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNILFNBSkQsTUFJTztBQUNILGlCQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxpQkFBSyxPQUFMLEdBQWUsT0FBTyxZQUF0QjtBQUNIO0FBQ0o7Ozs7Z0NBRU87QUFDSixpQkFBSyxPQUFMLENBQWEsS0FBYjtBQUNIOzs7NEJBRUcsRyxFQUFLO0FBQ0wsbUJBQVEsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixNQUE4QixJQUF0QztBQUNIOzs7NEJBRUcsRyxFQUFLLEssRUFBTztBQUNaLG9CQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLEdBQXpCOztBQUVBLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBMUI7QUFDSDs7OzRCQUVHLEcsRUFBSztBQUNMLG9CQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLEdBQXpCOztBQUVBLG1CQUFPLEtBQUssS0FBTCxDQUFXLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsQ0FBWCxDQUFQO0FBQ0g7Ozs7OztrQkFJVSxJQUFJLEtBQUosRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi9qcy9nYW1lJ1xuXG53aW5kb3cuZ2FtZSA9IGdhbWVcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jb25zdCBibHVlcHJpbnREYXRhID0ge1xuICAgIGFydGlmaWNpYWxNdXNjbGU6IHtcbiAgICAgICAgbmFtZTogJ2FydGlmaWNpYWwgbXVzY2xlIChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICByZXRpbmFsRGlzcGxheToge1xuICAgICAgICBuYW1lOiAncmV0aW5hbCBkaXNwbGF5IChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICBwcm9zdGhldGljQXJtOiB7XG4gICAgICAgIG5hbWU6ICdwcm9zdGhldGljIGFybSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH1cbn1cblxuXG5jbGFzcyBCbHVlcHJpbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbSgpIHtcbiAgICAgICAgY29uc3QgYmx1ZXByaW50VmFsdWVzID0gT2JqZWN0LnZhbHVlcyhibHVlcHJpbnREYXRhKVxuICAgICAgICBjb25zdCBpbmRleCA9IFV0aWxpdHkucmFuZG9taXplKGJsdWVwcmludFZhbHVlcy5sZW5ndGgpXG5cbiAgICAgICAgY29uc3QgcmFuZG9tQmx1ZXByaW50ID0gYmx1ZXByaW50VmFsdWVzW2luZGV4XVxuXG4gICAgICAgIHJldHVybiBuZXcgQmx1ZXByaW50KHJhbmRvbUJsdWVwcmludC5uYW1lLCByYW5kb21CbHVlcHJpbnQuZGVzY3JpcHRpb24pXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEJsdWVwcmludFxuXG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcbmltcG9ydCB7IERJUkVDVElPTlMgfSBmcm9tICcuL0NvbnN0YW50cydcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgaW52ZW50b3J5IGZyb20gJy4vaW52ZW50b3J5J1xuXG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIE1vdmVhYmxlIHsgIC8vIENoYXJhY3RlciBkYXRhIGFuZCBhY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwSW5zdGFuY2UsIGluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICBzdXBlcihtYXBJbnN0YW5jZSlcblxuICAgICAgICB0aGlzLm1hcEluc3RhbmNlID0gbWFwSW5zdGFuY2VcbiAgICAgICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSBpbml0aWFsUG9zaXRpb25cblxuICAgICAgICB0aGlzLmluaXRTZXR0aW5ncygpXG4gICAgICAgIHRoaXMucmVuZGVyKClcblxuICAgICAgICBjb25zb2xlLmxvZygnY2hhcmFjdGVyIHJlbmRlcmVkJylcbiAgICB9XG5cbiAgICBpbml0U2V0dGluZ3MoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnlcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXModGhpcy5nZXRQb3NpdGlvbigpKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVTcGFuKHRoaXMuZ2V0Q2hhcmFjdGVyKCkpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKCdjaGFyYWN0ZXItbGF5ZXInKVxuICAgIH1cblxuICAgIGdldFBvc2l0aW9uKCkge1xuICAgICAgICBsZXQgcG9zaXRpb25cbiAgICAgICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPyBwb3NpdGlvbiA9IHRoaXMuaW5pdGlhbFBvc2l0aW9uIDogcG9zaXRpb24gPSB0aGlzLm1hcEluc3RhbmNlLmdldE1hcENlbnRlcigpXG4gICAgICAgIHJldHVybiBwb3NpdGlvblxuICAgIH1cblxuICAgIGdldENoYXJhY3RlcigpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdhY3RvcicsXG4gICAgICAgICAgICBlbGVtZW50OiAnQCcsXG4gICAgICAgICAgICBjbHM6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgbGVmdDogY3NzTGVmdCxcbiAgICAgICAgICAgIHRvcDogY3NzVG9wLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgZ2V0QWN0aW9uKGZuTmFtZSwgYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2ZuTmFtZV0uYmluZCh0aGlzLCBhcmcpXG4gICAgfVxuXG4gICAgbW92ZShkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IHRoaXMudXBkYXRlR3JpZEluZGljZXModGhpcy5nZXRDaGFyYWN0ZXIoKSwgRElSRUNUSU9OU1tkaXJlY3Rpb25dKVxuICAgICAgICB0aGlzLnByaW50TG9jYWxTdGF0dXMoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLmxvY2F0aW9uJywgdGhpcy5sb2NhdGlvbilcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMubG9jYXRpb24ueCxcbiAgICAgICAgICAgIHk6IHRoaXMubG9jYXRpb24ueVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdtb3ZlZC10bycsIHBvc2l0aW9uKVxuICAgIH1cblxuICAgIHByaW50TG9jYWxTdGF0dXMoKSB7XG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy5sb2NhdGlvbilcbiAgICAgICAgY29uc3QgbG9jYWxJdGVtID0gdGhpcy5nZXRMb2NhbEl0ZW0oKVxuXG4gICAgICAgIGlmIChsb2NhbEl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChsb2NhbEl0ZW0ubWluaW5nID09PSAnZW1wdHknKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAnbWluaW5nIGhhcyBiZWVuIGV4aGF1c3RlZCBmb3IgdGhpcyByZWdpb24nKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChsb2NhbEl0ZW0ubWluaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAnYSBtaW5lciBwdWxscyBjb21wb3VuZHMgZnJvbSB0aGUgcmVnaW9uJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LWl0ZW0nLCBsb2NhbEl0ZW0ubmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldExvY2FsSXRlbSgpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgbGV0IGxvY2FsSXRlbSA9IG51bGxcbiAgICAgICAgdGhpcy5tYXBJbnN0YW5jZS5pdGVtc09uTWFwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS54ID09PSBjaGFyLnggJiYgaXRlbS55ID09PSBjaGFyLnkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEl0ZW0gPSBpdGVtXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGxvY2FsSXRlbVxuICAgIH1cblxuICAgIHRha2UoKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsSXRlbSA9IHRoaXMuZ2V0TG9jYWxJdGVtKClcblxuICAgICAgICBpZiAobG9jYWxJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goYCR7bG9jYWxJdGVtLm5hbWV9LSR7bG9jYWxJdGVtLmlkZW50aXR5TnVtYmVyfSB0YWtlbmApXG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIGAke2xvY2FsSXRlbS5uYW1lfSB0YWtlbmApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICd0aGVyZSBpcyBub3RoaW5nIGhlcmUgd29ydGggdGFraW5nJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEl0ZW1Mb2NhdGlvbihpdGVtTmFtZSkge1xuICAgICAgICBjb25zdCBjaGFyID0gdGhpcy5nZXRDaGFyYWN0ZXIoKVxuICAgICAgICBjb25zdCBpdHNlbGYgPSB0aGlzLmludmVudG9yeS5yZXRyaWV2ZUl0ZW0oaXRlbU5hbWUpXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gW2NoYXIueCwgY2hhci55XVxuICAgICAgICByZXR1cm4geyBpdHNlbGYsIGxvY2F0aW9uIH1cbiAgICB9XG5cbiAgICBtaW5lKCkge1xuICAgICAgICBjb25zdCBtaW5lciA9IHRoaXMuZ2V0SXRlbUxvY2F0aW9uKCdwYXJ0aWNsZSBtaW5lcicpXG4gICAgICAgIGlmIChtaW5lci5pdHNlbGYpIHtcbiAgICAgICAgICAgIG1pbmVyLml0c2VsZi5taW5lKG1pbmVyLmxvY2F0aW9uKVxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdyZW1vdmUtaW52ZW50b3J5JywgbWluZXIuaXRzZWxmKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAneW91IGRvIG5vdCBoYXZlIGFueSBwYXJ0aWNsZSBtaW5lcnMnKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiY29uc3QgRElSRUNUSU9OUyA9IHtcbiAgICBub3J0aDogeyB4OiAwLCB5OiAtMSB9LFxuICAgIHNvdXRoOiB7IHg6IDAsIHk6IDEgfSxcbiAgICBlYXN0OiB7IHg6IDEsIHk6IDAgfSxcbiAgICB3ZXN0OiB7IHg6IC0xLCB5OiAwIH0sXG4gICAgbm9ydGh3ZXN0OiB7IHg6IC0xLCB5OiAtMSB9LFxuICAgIG5vcnRoZWFzdDogeyB4OiAxLCB5OiAtMSB9LFxuICAgIHNvdXRoZWFzdDogeyB4OiAxLCB5OiAxIH0sXG4gICAgc291dGh3ZXN0OiB7IHg6IC0xLCB5OiAxIH1cbn1cblxuXG5leHBvcnQgeyBESVJFQ1RJT05TIH1cbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIEludmVudG9yeURpc3BsYXkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdkaXNwbGF5LWludmVudG9yeScsIHRoaXMucmVuZGVyLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1taW5lZCcsIHRoaXMucmVuZGVyTWluZWQsIHRoaXMpXG4gICAgfVxuXG4gICAgcmVuZGVyKGludmVudG9yeU9iamVjdCkge1xuICAgICAgICBsZXQgc3RyID0gaW52ZW50b3J5T2JqZWN0Lm1hcChpdGVtID0+IGl0ZW0ubmFtZSkuam9pbignPGJyPicpXG4gICAgICAgIHN0ciA9ICdJTlZFTlRPUlkgPGJyPjxicj4nICsgc3RyXG4gICAgICAgIHRoaXMuc2V0KHN0ciwgJ2ludmVudG9yeS1zdGF0dXMnKVxuICAgIH1cblxuICAgIHJlbmRlck1pbmVkKG1pbmVkRWxlbWVudHNPYmplY3QpIHtcbiAgICAgICAgbGV0IHN0ciA9IHRoaXMuY2xlYW5KU09OU3RyaW5nKEpTT04uc3RyaW5naWZ5KG1pbmVkRWxlbWVudHNPYmplY3QpKVxuICAgICAgICBzdHIgPSAnUEFSVElDTEVTIE1JTkVEIDxicj48YnI+JyArIHN0clxuICAgICAgICB0aGlzLnNldChzdHIsICdtaW5pbmctc3RhdHVzJylcbiAgICB9XG5cbiAgICBjbGVhbkpTT05TdHJpbmcoc3RyKSB7XG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cIi9nLCAnJylcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoLzovZywgJyAnKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvey9nLCAnJylcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL30vZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8sL2csICc8YnI+JylcblxuICAgICAgICByZXR1cm4gc3RyXG4gICAgfVxuXG4gICAgc2V0KGRlc2NyaXB0aW9uLCBlbGVtZW50SUQsIGRlbGF5PTApIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKS5pbm5lckhUTUwgPSBkZXNjcmlwdGlvblxuICAgICAgICB9LCBkZWxheSlcbiAgICB9XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJbnZlbnRvcnlEaXNwbGF5XG4iLCJjbGFzcyBMYW5kc2NhcGVEYXRhIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5mZWF0dXJlcyA9IHRoaXMuZmVhdHVyZXMoKVxuICAgICAgICB0aGlzLmJhcmUgPSB0aGlzLmJhcmUoKVxuICAgIH1cblxuICAgIGZlYXR1cmVzKCkge1xuICAgICAgICBjb25zdCBwZXJpb2QgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnLicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3RoZSBhaXIgaXMgY2hva2VkIHdpdGggZHVzdCwgc3RhdGljLCB3aWZpJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNSxcbiAgICAgICAgICAgIGNsczogJ3BlcmlvZCcsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBoeWRyb2NhcmJvbnM6IDE1LFxuICAgICAgICAgICAgICAgIHNpbGljb246IDEwLFxuICAgICAgICAgICAgICAgIGNlcmFtaWM6IDEwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbW1hID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJywnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdzcHJhd2wgb2Ygc21hcnQgaG9tZXMsIGN1bC1kZS1zYWNzLCBsYW5ld2F5cycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjYsXG4gICAgICAgICAgICBjbHM6ICdjb21tYScsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBpcm9uOiAzMCxcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIG1lcmN1cnk6IDEwLFxuICAgICAgICAgICAgICAgIGxhdGV4OiAxNSxcbiAgICAgICAgICAgICAgICB3b29kOiAyMCxcbiAgICAgICAgICAgICAgICBoeWRyb2NhcmJvbnM6IDE1LFxuICAgICAgICAgICAgICAgIGdsYXNzOiAzMCxcbiAgICAgICAgICAgICAgICBjYXJib246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMFxuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VtaWNvbG9uID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJzsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdyb3dzIG9mIGdyZWVuaG91c2VzOiBzb21lIHNoYXR0ZXJlZCBhbmQgYmFycmVuLCBvdGhlcnMgb3Zlcmdyb3duJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNCxcbiAgICAgICAgICAgIGNsczogJ3NlbWljb2xvbicsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBpcm9uOiAzMCxcbiAgICAgICAgICAgICAgICB3b29kOiAyMCxcbiAgICAgICAgICAgICAgICBmaWJlcjogMTAsXG4gICAgICAgICAgICAgICAgYm9uZTogMTAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgb3pvbmU6IDE1LFxuICAgICAgICAgICAgICAgIGdsYXNzOiAzMCxcbiAgICAgICAgICAgICAgICBjYXJib246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMFxuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JhdmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnXicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2Egc2hpbW1lcmluZyBmaWVsZCBvZiBzb2xhciBwYW5lbHMsIGJyb2tlbiBhbmQgY29ycm9kZWQnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDIyLFxuICAgICAgICAgICAgY2xzOiAnZ3JhdmUnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBmaWJlcjogMTAsXG4gICAgICAgICAgICAgICAgb3pvbmU6IDE1LFxuICAgICAgICAgICAgICAgIGJlbnplbmU6IDIwLFxuICAgICAgICAgICAgICAgIGdsYXNzOiAzMCxcbiAgICAgICAgICAgICAgICBjZXJhbWljOiAxMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFzdGVyaXNrID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJyonLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdob2xsb3cgdXNlcnMgamFjayBpbiBhdCB0aGUgZGF0YWh1YnMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDIwLFxuICAgICAgICAgICAgY2xzOiAnYXN0ZXJpc2snLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgY2hyb21lOiAxNSxcbiAgICAgICAgICAgICAgICBsZWFkOiAzMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBzdHlyb2ZvYW06IDMwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIGJlbnplbmU6IDIwLFxuICAgICAgICAgICAgICAgIHNpbGljb246IDEwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwXG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3BlcmlvZCwgY29tbWEsIHNlbWljb2xvbiwgc2VtaWNvbG9uLCBhc3RlcmlzaywgYXN0ZXJpc2ssIGdyYXZlLCBncmF2ZV1cbiAgICB9XG5cbiAgICBiYXJlKCkge1xuICAgICAgICBjb25zdCBiYXJlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJyZuYnNwOycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2NvbmNyZXRlIGFuZCB0d2lzdGVkIHJlYmFyIHN0cmV0Y2ggdG8gdGhlIGhvcml6b24nLFxuICAgICAgICAgICAgY2xzOiAnYmxhbmsnLFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMCxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGlyb246IDMwLFxuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgY2hyb21lOiAxNSxcbiAgICAgICAgICAgICAgICBsZWFkOiAzMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBzdHlyb2ZvYW06IDMwLFxuICAgICAgICAgICAgICAgIGJvbmU6IDEwLFxuICAgICAgICAgICAgICAgIGh5ZHJvY2FyYm9uczogMTUsXG4gICAgICAgICAgICAgICAgdXJhbml1bTogMTAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhcmVcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExhbmRzY2FwZURhdGFcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgTWFwR2VuZXJhdG9yIGZyb20gJy4vTWFwR2VuZXJhdG9yJ1xuXG5jbGFzcyBNYXAge1xuICAgIGNvbnN0cnVjdG9yKG1hcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ21hcCBjb25zdHJ1Y3RvcicsIG1hcERhdGEpXG5cbiAgICAgICAgdGhpcy5tYXAgPSBtYXBEYXRhXG4gICAgICAgIHRoaXMuY29sID0gTWFwLmdldENvbChtYXBEYXRhKVxuICAgICAgICB0aGlzLnJvdyA9IE1hcC5nZXRSb3cobWFwRGF0YSlcblxuICAgICAgICB0aGlzLml0ZW1zT25NYXAgPSBbXVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgc3RhdGljIGdldENvbChtYXBEYXRhKSB7XG4gICAgICAgIHJldHVybiBtYXBEYXRhLmxlbmd0aFxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRSb3cobWFwRGF0YSkge1xuICAgICAgICByZXR1cm4gbWFwRGF0YVswXS5sZW5ndGhcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGUoeyBjb2wsIHJvdyB9KSB7XG4gICAgICAgIGNvbnN0IG1hcEdlbmVyYXRvciA9IG5ldyBNYXBHZW5lcmF0b3IoKVxuXG4gICAgICAgIHJldHVybiBtYXBHZW5lcmF0b3IuZ2VuZXJhdGUoeyBjb2wsIHJvd30pXG4gICAgfVxuXG4gICAgZ2V0TWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXBcbiAgICB9XG5cbiAgICBnZXRNYXBDZW50ZXIoKSB7XG4gICAgICAgIHJldHVybiBbTWF0aC5mbG9vcih0aGlzLmNvbC8yKSwgTWF0aC5mbG9vcih0aGlzLnJvdy8yKV1cbiAgICB9XG5cbiAgICBnZXRSYW5kb21NYXBMb2NhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpLCBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLmNvbCAtIDEpXVxuICAgIH1cblxuICAgIHNldENoYXJhY3RlcihjaGFyYWN0ZXIpIHtcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIgPSBjaGFyYWN0ZXJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXIuc2V0TWFwKHRoaXMubWFwKVxuICAgIH1cblxuICAgIHNldEl0ZW1zKGl0ZW1zKSB7XG4gICAgICAgIGl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbU1hcExvY2F0aW9uID0gdGhpcy5nZXRSYW5kb21NYXBMb2NhdGlvbigpXG4gICAgICAgICAgICBpdGVtLnNldE9uTWFwKHRoaXMubWFwLCByYW5kb21NYXBMb2NhdGlvbilcbiAgICAgICAgICAgIGl0ZW0uY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudCgnaXRlbS1sYXllcicpICAvLyBtb3ZlZCBjaGlsZEVsZW1lbnQgY3JlYXRpb24gb3V0IG9mICdzZXRPbk1hcCdcbiAgICAgICAgICAgIHRoaXMucHVzaEl0ZW0oaXRlbSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwdXNoSXRlbShpdGVtKSB7XG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcC5wdXNoKGl0ZW0pXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYXBcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcbmltcG9ydCBMYW5kc2NhcGVEYXRhIGZyb20gJy4vTGFuZHNjYXBlRGF0YSdcbmltcG9ydCB7IERJUkVDVElPTlMgfSBmcm9tICcuL0NvbnN0YW50cydcblxuXG5jbGFzcyBNYXBHZW5lcmF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIGdlbmVyYXRlKHsgY29sLCByb3cgfSkge1xuXG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG5cbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVEYXRhKClcblxuICAgICAgICB0aGlzLm1ha2VHcmlkKClcbiAgICAgICAgdGhpcy5zZWVkKClcbiAgICAgICAgdGhpcy5ncm93KClcblxuICAgICAgICBjb25zb2xlLmxvZygnbWFwIGdlbmVyYXRlZCcpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZFxuICAgIH1cblxuICAgIG1ha2VHcmlkKCkge1xuICAgICAgICB0aGlzLmdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFtpXSA9IFtdXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3Q2VsbCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSlcbiAgICAgICAgICAgICAgICBuZXdDZWxsID0gdGhpcy5hc3NpZ25Db29yZGluYXRlcyhuZXdDZWxsLCBqLCBpKVxuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZFtpXS5wdXNoKG5ld0NlbGwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3NpZ25Db29yZGluYXRlcyhjZWxsLCB4Q29vcmQsIHlDb29yZCkge1xuICAgICAgICBjZWxsLnggPSB4Q29vcmRcbiAgICAgICAgY2VsbC55ID0geUNvb3JkXG4gICAgICAgIHJldHVybiBjZWxsXG4gICB9XG5cbiAgICBzZWVkKCkge1xuICAgICAgICBjb25zdCByYW5kb21FbGVtZW50cyA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpOyBpKyspIHtcbiAgICAgICAgICAgIHJhbmRvbUVsZW1lbnRzLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlc1tVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzLmxlbmd0aCldKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VlZHMgPSB0aGlzLmdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cylcbiAgICAgICAgdGhpcy5zZWVkcy5tYXAoc2VlZCA9PiB0aGlzLmdyaWRbc2VlZC55XVtzZWVkLnhdID0gc2VlZClcblxuICAgIH1cblxuICAgIGdldE51bWJlck9mRWxlbWVudFNlZWRzKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuY29sICsgdGhpcy5yb3cpICAvLyByaWNoIGluaXRpYWwgc2VlZGluZ1xuICAgIH1cblxuICAgIGdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cykge1xuICAgICAgICByZXR1cm4gcmFuZG9tRWxlbWVudHMubWFwKGVsID0+IHtcbiAgICAgICAgICAgIGVsLnggPSBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpXG4gICAgICAgICAgICBlbC55ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKVxuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ3JvdygpIHtcbiAgICAgICAgbGV0IG1hcFBvcHVsYXRlZCA9IGZhbHNlXG5cbiAgICAgICAgd2hpbGUgKCFtYXBQb3B1bGF0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVOZXh0U2VlZEJhdGNoKClcbiAgICAgICAgICAgIGlmICh0aGlzLm91dE9mU2VlZHMoKSkgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5maWx0ZXJCYWRTZWVkcygpXG4gICAgICAgICAgICB0aGlzLnBsYW50U2VlZHMoKVxuICAgICAgICAgICAgdGhpcy5oYXNVbnNlZWRlZExvY2F0aW9ucygpID8gdGhpcy5zZWVkcyA9IHRoaXMuZ29vZFNlZWRzIDogbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVOZXh0U2VlZEJhdGNoKCkge1xuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IFtdXG4gICAgICAgIHRoaXMuc2VlZHMuZm9yRWFjaCgob3JpZ2luYWxTZWVkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsU2VlZCA9IG9yaWdpbmFsU2VlZFxuICAgICAgICAgICAgdGhpcy5nZXROZXdTZWVkKClcbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIGdldE5ld1NlZWQoKSB7XG4gICAgICAgZm9yIChsZXQga2V5IGluIERJUkVDVElPTlMpIHtcbiAgICAgICAgICAgIHRoaXMubmV3U2VlZCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3JpZ2luYWxTZWVkKVxuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBESVJFQ1RJT05TW2tleV1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUHJvYmFiaWxpdHkodGhpcy5uZXdTZWVkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTmV3U2VlZENvb3JkaW5hdGVzKClcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRHZW5TZWVkcy5wdXNoKHRoaXMubmV3U2VlZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrUHJvYmFiaWxpdHkobmV3U2VlZCkge1xuICAgICAgICByZXR1cm4gVXRpbGl0eS5wcm9iYWJpbGl0eShuZXdTZWVkLnByb2JhYmlsaXR5KVxuICAgIH1cblxuICAgIGNyZWF0ZU5ld1NlZWRDb29yZGluYXRlcygpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAneCcpIHtcbiAgICAgICAgICAgIHRoaXMubmV3U2VlZC54ID0gdGhpcy5vcmlnaW5hbFNlZWQueCArIHRoaXMuZGlyZWN0aW9uW2tleV1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgIHRoaXMubmV3U2VlZC55ID0gdGhpcy5vcmlnaW5hbFNlZWQueSArIHRoaXMuZGlyZWN0aW9uW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb3V0T2ZTZWVkcygpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLm5leHRHZW5TZWVkcy5sZW5ndGhcbiAgICB9XG5cbiAgICBmaWx0ZXJCYWRTZWVkcygpIHtcbiAgICAgICAgdGhpcy5nb29kU2VlZHMgPSBbXVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcy5mb3JFYWNoKChzZWVkKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja1NlZWQoc2VlZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RTZWVkcy5wdXNoKHRoaXMuY2hlY2tTZWVkKHNlZWQpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNoZWNrU2VlZChzZWVkKSB7XG4gICAgICAgIGlmICh0aGlzLmlmT2ZmTWFwKHNlZWQpKSByZXR1cm4gbnVsbFxuICAgICAgICBpZiAodGhpcy5pc0FscmVhZHlTZWVkZWQoc2VlZCkpIHJldHVybiBudWxsXG4gICAgICAgIC8vIGlmICh0aGlzLmlzV2FpdGluZ1RvQmVTZWVkZWQoc2VlZCkpIHJldHVybiBudWxsXG4gICAgICAgIHJldHVybiBzZWVkXG4gICAgfVxuXG4gICAgaWZPZmZNYXAoc2VlZCkge1xuICAgICAgICByZXR1cm4gISgoc2VlZC54IDwgdGhpcy5jb2wgJiYgc2VlZC54ID49IDApICYmIChzZWVkLnkgPCB0aGlzLnJvdyAmJiBzZWVkLnkgPj0gMCkpXG4gICAgfVxuXG4gICAgaXNBbHJlYWR5U2VlZGVkKHNlZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZFtzZWVkLnldW3NlZWQueF0uY2xzICE9PSAnYmxhbmsnXG4gICAgfVxuXG5cbiAgICBwbGFudFNlZWRzKCkge1xuICAgICAgICB0aGlzLmdvb2RTZWVkcy5mb3JFYWNoKChnb29kU2VlZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZFtnb29kU2VlZC55XVtnb29kU2VlZC54XS5jbHMgPT09ICdibGFuaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPSBnb29kU2VlZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGhhc1Vuc2VlZGVkTG9jYXRpb25zKCkge1xuICAgICAgICBjb25zdCBmbGF0dGVuZWRHcmlkID0gW10uY29uY2F0LmFwcGx5KFtdLCB0aGlzLmdyaWQpXG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSBvZiBmbGF0dGVuZWRHcmlkKSB7XG4gICAgICAgICAgICBpZiAoaS5jbHMgPT09ICdibGFuaycpIGNvdW50KytcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwR2VuZXJhdG9yXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5cblxuY2xhc3MgTW92ZWFibGUgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIG1vdmVtZW50IGFuZCBwbGFjZW1lbnQgb24gdGhlIGdyaWRcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgc2V0TWFwKG1hcCkge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgIH1cblxuICAgIHNldEluaXRpYWxHcmlkSW5kaWNlcyhncmlkSW5kaWNlcykge1xuICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gZ3JpZEluZGljZXNcbiAgICB9XG5cbiAgICBnZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cblxuICAgICAgICByZXR1cm4geyB4LCB5IH1cbiAgICB9XG5cbiAgICB1cGRhdGVHcmlkSW5kaWNlcyhhY3RvciwgbW92ZSkge1xuICAgICAgICBjb25zdCBuZXdHcmlkSW5kaWNlcyA9IFt0aGlzLmdyaWRJbmRpY2VzWzBdICsgbW92ZS54LCB0aGlzLmdyaWRJbmRpY2VzWzFdICsgbW92ZS55XVxuICAgICAgICBsZXQgbG9jYXRpb24gPSAnJ1xuICAgICAgICBpZiAodGhpcy5jaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSkge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLm1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gbmV3R3JpZEluZGljZXNcbiAgICAgICAgICAgIGFjdG9yLnggPSBuZXdHcmlkSW5kaWNlc1swXVxuICAgICAgICAgICAgYWN0b3IueSA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2NhdGlvbiA9IHRoaXMubWFwW3RoaXMuZ3JpZEluZGljZXNbMV0sIHRoaXMuZ3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAoYWN0b3IubmFtZSA9PT0gJ2NoYXJhY3RlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIFwieW91J3ZlIHJlYWNoZWQgdGhlIG1hcCdzIGVkZ2VcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYXRpb25cbiAgICB9XG5cbiAgICBjaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSB7XG4gICAgICAgIGxldCBsb2NhdGlvbk9uR3JpZCA9IGZhbHNlXG5cbiAgICAgICAgY29uc3QgeCA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIGNvbnN0IHkgPSBuZXdHcmlkSW5kaWNlc1swXVxuXG4gICAgICAgIGlmICh0aGlzLm1hcFt4XSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLm1hcFt4XVt5XVxuICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb25PbkdyaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYXRpb25PbkdyaWRcbiAgICB9XG5cbiAgICBnZXRDU1NIZWlnaHRBbmRXaWR0aCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdCcpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgICAgIGNvbnN0IHdpZHRoID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKVxuICAgICAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH1cbiAgICB9XG5cbiAgICBnZXRDU1NDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgY3NzID0gdGhpcy5nZXRDU1NIZWlnaHRBbmRXaWR0aCgpXG4gICAgICAgIGNvbnN0IGNzc0xlZnQgPSB0aGlzLmdyaWRJbmRpY2VzWzBdICogY3NzLmhlaWdodFxuICAgICAgICBjb25zdCBjc3NUb3AgPSB0aGlzLmdyaWRJbmRpY2VzWzFdICogY3NzLndpZHRoXG4gICAgICAgIHJldHVybiB7IGNzc0xlZnQsIGNzc1RvcCB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1vdmVhYmxlXG4iLCJjbGFzcyBSZW5kZXJhYmxlIHsgIC8vIGdlbmVyYWxpemVkIHJlbmRlciBmdW5jdGlvbnMgZm9yIFNjZW5lcnksIENoYXJhY3RlclxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHNldExheWVyKGxheWVyKSB7XG4gICAgICAgIHRoaXMubGF5ZXIgPSBsYXllclxuICAgIH1cblxuICAgIGdldExheWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXllclxuICAgIH1cblxuICAgIHJlbmRlclNwYW4odW5pdCkge1xuICAgICAgICBsZXQgY2xzID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgICAgY2xzID0gdW5pdC5jbHNcbiAgICAgICAgICAgIGVsZW1lbnQgPSB1bml0LmVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bml0LnRvcCAmJiB1bml0LmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHt1bml0LnRvcH1weDsgbGVmdDogJHt1bml0LmxlZnR9cHhgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInVuaXQgJHtjbHN9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L3NwYW4+YFxuICAgIH1cblxuICAgIHJlbmRlckRpdihpdGVtKSB7XG4gICAgICAgIGxldCBkaXYgPSAnJ1xuICAgICAgICBsZXQgZWxlbWVudCA9ICcmbmJzcDsnXG4gICAgICAgIGxldCBzdHlsZSA9ICcnXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBkaXYgPSBpdGVtLmRpdlxuICAgICAgICAgICAgZWxlbWVudCA9IGl0ZW0uZWxlbWVudFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnRvcCAmJiBpdGVtLmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHtpdGVtLnRvcH1weDsgbGVmdDogJHtpdGVtLmxlZnR9cHg7IHBvc2l0aW9uOiBhYnNvbHV0ZWBcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5vZmZNYXApIHtcbiAgICAgICAgICAgIHN0eWxlICs9IGA7IGRpc3BsYXk6IG5vbmVgXG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGl0ZW0ubWluaW5nKSB7XG4gICAgICAgICAgICBjYXNlICdmdWxsJzpcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgOyBhbmltYXRpb246IG1pbmluZy1mdWxsIDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdoYWxmJzpcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgOyBhbmltYXRpb246IG1pbmluZy1oYWxmIDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctZW1wdHkgM3MgaW5maW5pdGVgXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBgPGRpdiBpZD1cIiR7ZGl2fVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9kaXY+YFxuICAgIH1cblxuICAgIHVwZGF0ZVNwYW4oYWN0b3IpIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlclNwYW4oYWN0b3IpKVxuICAgIH1cblxuICAgIHVwZGF0ZURpdihpdGVtKSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5yZW5kZXJEaXYoaXRlbSkpXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXllcklkKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KHBhcmVudExheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJlbnRMYXllcklkKVxuICAgICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpIC8vIGNyZWF0ZXMgZGl2IGlkIHdpdGhpbiBlbmNsb3NpbmcgZGl2IC4uLlxuICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUmVuZGVyYWJsZVxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuXG5cbmNsYXNzIFNjZW5lcnkgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIFNjZW5lcnktc3BlY2lmaWMgcmVuZGVyaW5nIGZ1bmN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMubWFwID0gbWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIoKVxuICAgICAgICBjb25zb2xlLmxvZygnc2NlbmVyeSByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyTGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLm1hcC5tYXAoYXJyID0+IHsgcmV0dXJuIGFyci5zbGljZSgpIH0pXG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5jcmVhdGVMYXllcihncmlkKSlcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUxheWVyKGdyaWQpIHtcbiAgICAgICAgY29uc3Qgc2NlbmVyeUdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0l0ZW1zID0gZ3JpZFtpXVxuICAgICAgICAgICAgbGV0IHJvdyA9ICcnICAvLyBwb3NzaWJseSBtYWtlIGVhY2ggcm93IGEgdGFibGU/XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm93ICs9IHRoaXMucmVuZGVyU3Bhbihyb3dJdGVtc1tpXSkgLy8gYWRkIHJlbmRlcmVkIGl0ZW1zIHRvIHRoZSBncmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzY2VuZXJ5R3JpZC5wdXNoKHJvdylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2NlbmVyeUdyaWRcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGNvbnN0IGdyaWRUb0hUTUwgPSBsYXllci5qb2luKCc8YnIgLz4nKSAgLy8gdXNpbmcgSFRNTCBicmVha3MgZm9yIG5vd1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYW5kc2NhcGUtbGF5ZXInKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSBncmlkVG9IVE1MXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lcnlcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIFN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMudXBkYXRlLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pdGVtJywgdGhpcy5kaXNwbGF5SXRlbSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ3N0YXR1cycsIHRoaXMuZGVmYXVsdCwgdGhpcylcbiAgICB9XG5cbiAgICB1cGRhdGUobG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXQobG9jYXRpb24uZGVzY3JpcHRpb24pXG4gICAgfVxuXG4gICAgYmVnaW5zV2l0aFZvd2VsKHRleHQpIHtcbiAgICAgICAgY29uc3QgZmlyc3RMZXR0ZXIgPSB0ZXh0WzBdXG4gICAgICAgIGNvbnN0IHZvd2VscyA9IFsnYScsICdlJywgJ2knLCAnbycsICd1J11cbiAgICAgICAgbGV0IGJlZ2luc1dpdGhWb3dlbCA9IGZhbHNlXG4gICAgICAgIHZvd2Vscy5mb3JFYWNoKHZvd2VsID0+IHtcbiAgICAgICAgICAgIGlmIChmaXJzdExldHRlciA9PT0gdm93ZWwpIHtcbiAgICAgICAgICAgICAgICBiZWdpbnNXaXRoVm93ZWwgPSB0cnVlXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGJlZ2luc1dpdGhWb3dlbFxuICAgIH1cblxuICAgIGRpc3BsYXlJdGVtKGl0ZW1OYW1lKSB7XG4gICAgICAgIGNvbnN0IGJlZ2luc1dpdGhWb3dlbCA9IHRoaXMuYmVnaW5zV2l0aFZvd2VsKGl0ZW1OYW1lKVxuICAgICAgICBsZXQgdGV4dCA9ICcnXG4gICAgICAgIGlmIChiZWdpbnNXaXRoVm93ZWwpIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhbiAke2l0ZW1OYW1lfSBoZXJlYFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dCA9IGB5b3Ugc2VlIGEgJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldCh0ZXh0LCAxMClcbiAgICB9XG5cbiAgICBkZWZhdWx0KHRleHQpIHtcbiAgICAgICAgdGhpcy5zZXQodGV4dCwgMTApXG4gICAgfVxuXG4gICAgc2V0KGRlc2NyaXB0aW9uLCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKS5pbm5lckhUTUwgPSBkZXNjcmlwdGlvblxuICAgICAgICB9LCBkZWxheSlcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU3RhdHVzXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5cblxuY2xhc3MgVXNlcklucHV0IHtcbiAgICBjb25zdHJ1Y3RvcihrZXlBY3Rpb25NYXApIHtcbiAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXAgPSBrZXlBY3Rpb25NYXBcblxuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSB0aGlzLnRyeUFjdGlvbkZvckV2ZW50LmJpbmQodGhpcylcbiAgICB9XG5cbiAgICB0cnlBY3Rpb25Gb3JFdmVudChldmVudCkge1xuICAgICAgICBpZiAoIVV0aWxpdHkuY29udGFpbnModGhpcy5rZXlBY3Rpb25NYXAsIGV2ZW50LmtleUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgbm90IGEgdmFsaWQga2V5Y29kZTogJHtldmVudC5rZXlDb2RlfWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmtleUFjdGlvbk1hcFtldmVudC5rZXlDb2RlXSgpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXNlcklucHV0XG4iLCJsZXQgaWQgPSAwXG5cbmZ1bmN0aW9uIGdlbmVyYXRlSWQoKSB7XG4gICAgaWQgPSBpZCArIDFcbiAgICByZXR1cm4gaWRcbn1cblxuY2xhc3MgVXRpbGl0eSB7XG4gICAgc3RhdGljIGNvbnRhaW5zKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuaW5kZXhPZihTdHJpbmcocHJvcGVydHkpKSAhPT0gLTFcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RyaW5nVG9OdW1iZXIoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcubWF0Y2goL1xcZCsvKVswXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb21pemUobXVsdCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXVsdClcbiAgICB9XG5cbiAgICBzdGF0aWMgSWQoKSB7XG4gICAgICAgIHJldHVybiBnZW5lcmF0ZUlkKClcbiAgICB9XG5cbiAgICBzdGF0aWMgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eVxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudHNMaXN0ID0gW10gICAgICAgIC8vIGNyZWF0ZSBhcnJheSBvZiBldmVudHNcbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoZXZlbnQsIGZuLCB0aGlzVmFsdWUsIG9uY2U9ZmFsc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7ICAgLy8gaWYgbm8gdGhpc1ZhbHVlIHByb3ZpZGVkLCBiaW5kcyB0aGUgZm4gdG8gdGhlIGZuPz9cbiAgICAgICAgICAgIHRoaXNWYWx1ZSA9IGZuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50c0xpc3QucHVzaCh7ICAgICAgLy8gY3JlYXRlIG9iamVjdHMgbGlua2luZyBldmVudHMgKyBmdW5jdGlvbnMgdG8gcGVyZm9ybVxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LCAgICAgICAgICAgLy8gcHVzaCBlbSB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgICAgICB0aGlzVmFsdWU6IHRoaXNWYWx1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHVuc3Vic2NyaWJlKGV2ZW50KSB7XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAvLyAgICAgICAgICAgICBicmVha1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGlzaChldmVudCwgYXJnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGhpc1ZhbHVlLCBmbiwgb25jZSB9ID0gdGhpcy5ldmVudHNMaXN0W2ldXG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzVmFsdWUsIGFyZylcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzTGlzdFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRXZlbnRNYW5hZ2VyKClcbiIsImltcG9ydCBNYXAgZnJvbSAnLi9NYXAnXG5pbXBvcnQgU2NlbmVyeSBmcm9tICcuL1NjZW5lcnknXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4vQ2hhcmFjdGVyJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi9TdGF0dXMnXG5pbXBvcnQgVXNlcklucHV0IGZyb20gJy4vVXNlcklucHV0J1xuaW1wb3J0IEJsdWVwcmludHMgZnJvbSAnLi9CbHVlcHJpbnRzJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcbmltcG9ydCB7IGdlbmVyYXRlSXRlbXMgfSBmcm9tICcuL2l0ZW1zJ1xuaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUnXG5pbXBvcnQgSW52ZW50b3J5RGlzcGxheSBmcm9tICcuL0ludmVudG9yeURpc3BsYXknXG5cbmNvbnN0IENPTCA9IDYwXG5jb25zdCBST1cgPSA2MFxuY29uc3QgSVRFTV9OVU0gPSA1XG5cbmNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmluaXRHYW1lKClcbiAgICB9XG5cbiAgICBpbml0R2FtZSgpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzXG5cbiAgICAgICAgaWYgKHRoaXMuaGFzR2FtZUluUHJvZ3Jlc3MoKSkge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSB0aGlzLnJlc3VtZVNldHRpbmdzKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldHRpbmdzID0gdGhpcy5nZW5lcmF0ZVNldHRpbmdzKClcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgbW92ZWQgPSAobG9jYXRpb24pID0+IHtjb25zb2xlLmxvZygnbG9jYXRpb24nLCBsb2NhdGlvbil9XG4gICAgICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoJ21vdmVkLXRvJywgbW92ZWQpXG5cbiAgICAgICAgdGhpcy5sb2FkU2V0dGluZ3Moc2V0dGluZ3MpXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKClcbiAgICB9XG5cbiAgICBoYXNHYW1lSW5Qcm9ncmVzcygpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmhhcygnbWFwJylcbiAgICB9XG5cbiAgICByZXN1bWVTZXR0aW5ncygpIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBtYXBEYXRhOiBzdG9yZS5nZXQoJ21hcCcpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3NcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHt9XG5cbiAgICAgICAgc2V0dGluZ3MubWFwRGF0YSA9IE1hcC5nZW5lcmF0ZSh7IGNvbDogQ09MLCByb3c6ICBST1cgfSlcblxuICAgICAgICBzdG9yZS5zZXQoJ21hcCcsIHNldHRpbmdzLm1hcERhdGEpXG5cbiAgICAgICAgcmV0dXJuIHNldHRpbmdzXG4gICAgfVxuXG4gICAgbG9hZFNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJsdWVwcmludCA9IHRoaXMuYmx1ZXByaW50ID0gQmx1ZXByaW50cy5yYW5kb20oKVxuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMgPSBnZW5lcmF0ZUl0ZW1zKElURU1fTlVNKVxuXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMuc3RhdHVzID0gbmV3IFN0YXR1cygpXG4gICAgICAgIGNvbnN0IGludmVudG9yeURpc3BsYXkgPSB0aGlzLmludmVudG9yeURpc3BsYXkgPSBuZXcgSW52ZW50b3J5RGlzcGxheSgpXG5cbiAgICAgICAgY29uc3QgbWFwID0gdGhpcy5tYXAgPSBuZXcgTWFwKHNldHRpbmdzLm1hcERhdGEpXG4gICAgICAgIGNvbnN0IHNjZW5lcnkgPSB0aGlzLnNjZW5lcnkgPSBuZXcgU2NlbmVyeShtYXApXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHRoaXMuY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihtYXApXG5cbiAgICAgICAgbWFwLnNldEl0ZW1zKGl0ZW1zKVxuICAgICAgICBtYXAuc2V0Q2hhcmFjdGVyKGNoYXJhY3RlcilcblxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeVxuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQoYmx1ZXByaW50KVxuXG4gICAgICAgIHRoaXMuaW5wdXQgPSB0aGlzLmluaXRVc2VySW5wdXQoY2hhcmFjdGVyKVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzZXQgbWFwIScpXG5cbiAgICAgICAgc3RvcmUuY2xlYXIoKVxuXG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgIH1cblxuICAgIGluaXRVc2VySW5wdXQoY2hhcmFjdGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgVXNlcklucHV0KHtcbiAgICAgICAgICAgICc4Mic6IHRoaXMucmVzZXQuYmluZCh0aGlzKSwgLy8gKHIpIHJlc2V0IG1hcFxuICAgICAgICAgICAgJzM4JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdub3J0aCcpLFxuICAgICAgICAgICAgJzM3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICd3ZXN0JyksXG4gICAgICAgICAgICAnMzknOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ2Vhc3QnKSxcbiAgICAgICAgICAgICc0MCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnc291dGgnKSxcbiAgICAgICAgICAgICc4NCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ3Rha2UnKSwgLy8gKHQpYWtlIGl0ZW1cbiAgICAgICAgICAgIC8vICc3Myc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ2NoZWNrSW52ZW50b3J5JyksIC8vIGNoZWNrIChpKW52ZW50b3J5XG4gICAgICAgICAgICAnNzcnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtaW5lJykgLy8gZGVwbG95IHBhcnRpY2xlIChtKWluZXJcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGFydEdhbWUoKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzLnNldCgneW91IHdha2UgdXAnKVxuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoYHlvdSBhcmUgY2FycnlpbmcgJHt0aGlzLmJsdWVwcmludC5uYW1lfWAsIDQwMDApXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBHYW1lKCk7XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBJbnZlbnRvcnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRzID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnYWRkLWludmVudG9yeScsIHRoaXMuYWRkLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMucmVtb3ZlLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnYWRkLW1pbmVkJywgdGhpcy5hZGRNaW5lZCwgdGhpcylcblxuICAgICAgICB0aGlzLnN0b3JlTWluaW5nID0ge31cbiAgICAgICAgdGhpcy5taW5pbmdTdGF0ZU9iaiA9IHt9XG5cbiAgICB9XG5cbiAgICBhZGQoaXRlbSkge1xuICAgICAgICB0aGlzLmNvbnRlbnRzLnB1c2goaXRlbSlcbiAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH1cblxuICAgIHJlbW92ZShpdGVtKSB7XG4gICAgICAgIGNvbnN0IHRoZUl0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMuY29udGVudHMuZm9yRWFjaCgoaXRlbSwgaSwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gdGhlSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudHMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmVudG9yeSBpdGVtIHJlbW92ZWQnKVxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgICAgICAgIH19KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LWludmVudG9yeScsIHRoaXMuY29udGVudHMpXG4gICAgfVxuXG4gICAgcmV0cmlldmVJdGVtKGl0ZW1OYW1lKSB7XG4gICAgICAgIGxldCBmb3VuZEl0ZW0gPSBudWxsXG4gICAgICAgIHRoaXMuY29udGVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUgPT09IGl0ZW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgZm91bmRJdGVtID0gaXRlbVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZm91bmRJdGVtXG4gICAgfVxuXG5cblxuXG4gICAgYWRkTWluZWQoY3VycmVudE9iaikge1xuICAgICAgICAvLyBpZiBzdGF0ZSBvYmplY3QgZG9lc24ndCBleGlzdCwgYWRkIGFsbCBwYXJ0aWNsZXMgdG8gc3RvcmFnZVxuICAgICAgICBpZiAoIXRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF0pIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWluaW5nU3RhdGUoY3VycmVudE9iailcbiAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50U3RvcmFnZSh0aGlzLnN0cmlwSUQoY3VycmVudE9iaikpXG5cbiAgICAgICAgLy8gaWYgaXQgZG9lcyBleGlzdCwgY2hlY2sgY3VyciB2cyBzdGF0ZSBhbmQgYWRkIG9ubHkgdGhlIHJpZ2h0IHBhcnRpY2xlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnRTdG9yYWdlKHRoaXMuc3RyaXBJRCh0aGlzLmNoZWNrTWluaW5nU3RhdGUoY3VycmVudE9iaikpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVNaW5pbmdTdGF0ZShjdXJyZW50T2JqKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlzcGxheVBhcnRpY2xlcyA9IHRoaXMuc3RvcmVNaW5pbmdcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LW1pbmVkJywgZGlzcGxheVBhcnRpY2xlcylcbn1cblxuXG4gICAgY2hlY2tNaW5pbmdTdGF0ZShjdXJyZW50T2JqKSB7XG4gICAgICAgIGNvbnN0IGNoZWNrZWRPYmogPSB7fVxuICAgICAgICBPYmplY3Qua2V5cyhjdXJyZW50T2JqKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoIWNoZWNrZWRPYmpba2V5XSkge1xuICAgICAgICAgICAgICAgIGNoZWNrZWRPYmpba2V5XSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXVtrZXldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXVtrZXldID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hlY2tlZE9ialtrZXldID0gY3VycmVudE9ialtrZXldIC0gdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXVtrZXldXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBjaGVja2VkT2JqXG4gICAgfVxuXG5cbiAgICBpbmNyZW1lbnRTdG9yYWdlKHBhcnRpY2xlT2JqKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHBhcnRpY2xlT2JqKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RvcmVNaW5pbmdba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVNaW5pbmdba2V5XSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RvcmVNaW5pbmdba2V5XSArPSBwYXJ0aWNsZU9ialtrZXldXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICB1cGRhdGVNaW5pbmdTdGF0ZShjdXJyZW50T2JqKSB7XG4gICAgICAgIHRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF0gPSBPYmplY3QuYXNzaWduKHt9LCBjdXJyZW50T2JqKVxuICAgIH1cblxuXG4gICAgc3RyaXBJRChjdXJyZW50T2JqKSB7XG4gICAgICAgIGNvbnN0IHBhcnRpY2xlT2JqID0ge31cbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudE9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSAhPT0gJ0lEJykge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlT2JqW2tleV0gPSBjdXJyZW50T2JqW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHBhcnRpY2xlT2JqXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJbnZlbnRvcnlcbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICdqcy9Nb3ZlYWJsZSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJ2pzL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJ2pzL2V2ZW50TWFuYWdlcidcblxuXG4vLyBjb25zdCBJVEVNUyA9IHtcbi8vICAgICBtaW5lcjoge1xuLy8gICAgICAgICBuYW1lOiAncGFydGljbGUgbWluZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICd8Jyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdtaW5lcywgZGl2aWRlcywgYW5kIHN0b3JlcyBhbWJpZW50IGNoZW1pY2FsIGVsZW1lbnRzIGFuZCBsYXJnZXIgY29tcG91bmRzIGZvdW5kIHdpdGhpbiBhIDEwMCBtZXRlciByYWRpdXMuIDk3JSBhY2N1cmFjeSByYXRlLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tbWluZXInXG4vLyAgICAgfSxcbi8vICAgICBwYXJzZXI6IHtcbi8vICAgICAgICAgbmFtZTogJ25vaXNlIHBhcnNlcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJz8nLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ3Byb3RvdHlwZS4gcGFyc2VzIGF0bW9zcGhlcmljIGRhdGEgZm9yIGxhdGVudCBpbmZvcm1hdGlvbi4gc2lnbmFsLXRvLW5vaXNlIHJhdGlvIG5vdCBndWFyYW50ZWVkLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tcGFyc2VyJ1xuLy8gICAgIH0sXG4vLyAgICAgaW50ZXJmYWNlOiB7XG4vLyAgICAgICAgIG5hbWU6ICdwc2lvbmljIGludGVyZmFjZScsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJyYnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogYGNvbm5lY3RzIHNlYW1sZXNzbHkgdG8gYSBzdGFuZGFyZC1pc3N1ZSBiaW9wb3J0LiBmYWNpbGl0YXRlcyBzdW5kcnkgaW50ZXJhY3Rpb25zIHBlcmZvcm1lZCB2aWEgUFNJLU5FVC5gLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLWludGVyZmFjZSdcbi8vICAgICB9LFxuLy8gICAgIHByaW50ZXI6IHtcbi8vICAgICAgICAgbmFtZTogJ21vbGVjdWxhciBwcmludGVyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnIycsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAnZ2VuZXJhdGVzIG9iamVjdHMgYWNjb3JkaW5nIHRvIGEgYmx1ZXByaW50LiBtb2xlY3VsZXMgbm90IGluY2x1ZGVkLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tcHJpbnRlcidcbi8vICAgICB9XG4vLyB9XG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBNb3ZlYWJsZSB7XG4gICAgY29uc3RydWN0b3IoaXRlbUNvbmZpZykge1xuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgLy8gbWVyZ2UgaW4gY29uZmlnIHByb3BlcnRpZXNcbiAgICAgICAgLy8gY29uc3QgdGFyZ2V0ID0gT2JqZWN0LmFzc2lnbih0aGlzLCBpdGVtQ29uZmlnKVxuXG4gICAgICAgIC8vIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmlkZW50aXR5TnVtYmVyID0gVXRpbGl0eS5JZCgpXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgIC8vIHRoaXMuaW5JbnZlbnRvcnkgPSBmYWxzZVxuXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBzZXRPbk1hcChtYXAsIGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0TWFwKG1hcClcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXMobG9jYXRpb24pXG4gICAgICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLnNldEdyaWRJbmRpY2VzKClcbiAgICAgICAgdGhpcy5zZXREaXYodGhpcy5nZXRJZCgpKVxuICAgICAgICB0aGlzLnVwZGF0ZURpdih0aGlzKVxuXG4vLyBtb3ZlZCB0aGlzIG91dCBzbyB3ZSBhcmUgbm90IGNyZWF0aW5nIGNoaWxkcmVuIGVhY2ggdGltZSB3ZSB3YW50IHRvIHBsYWNlIG9uIG1hcFxuICAgICAgICAvLyB0aGlzLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKVxuICAgIH1cblxuICAgIGdldElkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eU51bWJlclxuICAgIH1cblxuICAgIHNldENvb3JkaW5hdGVzKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMubGVmdCA9IGNzc0xlZnRcbiAgICAgICAgdGhpcy50b3AgPSBjc3NUb3BcbiAgICB9XG5cbiAgICBzZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEdyaWRJbmRpY2VzKClcblxuICAgICAgICB0aGlzLnggPSB4XG4gICAgICAgIHRoaXMueSA9IHlcbiAgICB9XG5cbiAgICBzZXREaXYoaWRlbnRpdHlOdW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpdlNldCkge1xuICAgICAgICAgICAgdGhpcy5kaXYgPSB0aGlzLmRpdiArIGlkZW50aXR5TnVtYmVyXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXZTZXQgPSB0cnVlXG4gICAgfVxuXG5cbiAgICAvLyBzcGVjaWZpYyB0byBpdGVtIGRyYXdpbmc6IHVzZSBvdXRlckhUTUxcbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGVsLm91dGVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgIH1cblxuXG5cbiAgICByZW5kZXJMYXllcih1bml0LCBsYXllcklkKSB7XG4gICAgICAgIGlmICh1bml0LnR5cGUgPT09ICdpdGVtJykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEaXYodW5pdClcbiAgICAgICAgICAgIHRoaXMuZHJhd0xheWVyKGxheWVySWQpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uVGFrZSgpIHtcbiAgICAgICAgdGhpcy54ID0gbnVsbFxuICAgICAgICB0aGlzLnkgPSBudWxsXG4gICAgICAgIHRoaXMub2ZmTWFwID0gdHJ1ZSAvLyBjaGFuZ2VzIGNzcyBkaXNwbGF5IHRvICdub25lJ1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdwYXJ0aWNsZSBtaW5lcic6XG4gICAgICAgICAgICAgICAgdGhpcy5oYWx0TWluaW5nKClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdhZGQtaW52ZW50b3J5JywgdGhpcylcbiAgICAgICAgLy8gdGhpcy5FTS5zdWJzY3JpYmUoJ3JlbW92ZS1pbnZlbnRvcnknLCB0aGlzLm9uRHJvcCwgdGhpcylcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLCB0aGlzLmRpdilcbiAgICB9XG5cbiAgICBvbkRyb3AoKSB7XG5cbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMsIHRydWUpXG4gICAgLy8gICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcywgdGhpcy5kaXYpXG5cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSXRlbVxuIiwiaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcblxuY2xhc3MgUGFydGljbGVNaW5lciBleHRlbmRzIEl0ZW0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgdGhpcy5uYW1lID0gJ3BhcnRpY2xlIG1pbmVyJ1xuICAgICAgICB0aGlzLnR5cGUgPSAnaXRlbSdcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJ3wnXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSAnbWluZXMsIGRpdmlkZXMsIGFuZCBzdG9yZXMgYW1iaWVudCBjaGVtaWNhbCBlbGVtZW50cyBhbmQgbGFyZ2VyIGNvbXBvdW5kcyBmb3VuZCB3aXRoaW4gYSAxMDAgbWV0ZXIgcmFkaXVzLiA5NyUgYWNjdXJhY3kgcmF0ZS4nXG4gICAgICAgIHRoaXMuZGl2ID0gJ2l0ZW0tbWluZXInXG4gICAgICAgIC8vIG11c3Qgc3Vic2NyaWJlIHRoZSBpdGVtIGRpcmVjdGx5LCBub3Qgb24gdGhlIGFic3RyYWN0IGNsYXNzXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke3RoaXMubmFtZX0tJHt0aGlzLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMub25UYWtlLCB0aGlzKVxuXG4gICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXMgPSB7XG4gICAgICAgICAgICBJRDogdGhpcy5pZGVudGl0eU51bWJlclxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBtaW5lKGxvY2F0aW9uKSB7XG4gICAgICAgIC8vIHRyeSBzZXR0aW5nIHRoZSBsb2NhdGlvbiBpbW1lZGlhdGVseSwgdXNpbmcgVEhJU1xuXG4gICAgICAgIHRoaXMubG9jYWxlID0gdGhpcy5tYXBbbG9jYXRpb25bMV1dW2xvY2F0aW9uWzBdXVxuXG4gICAgICAgIHRoaXMuc2V0TWluaW5nQ29uZmlnKClcblxuICAgICAgICAvLyBjYWxjdWxhdGUgcmF0aW9zIG9uY2UsIHJhdGhlciB0aGFuIHcgZXZlcnkgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy5kZXRlcm1pbmVQYXJ0aWNsZVJhdGlvcygpXG4gICAgICAgIHRoaXMuY2hlY2tQYXJ0aWNsZUFtb3VudHMoKVxuICAgICAgICB0aGlzLmNhbmNlbGxhdGlvbktleSA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrUGFydGljbGVBbW91bnRzKClcbiAgICAgICAgfSwgMzAwMClcblxuICAgICAgICB0aGlzLnNldE9uTWFwKHRoaXMubWFwLCBsb2NhdGlvbilcbiAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgIH1cblxuICAgIHNldE1pbmluZ0NvbmZpZygpIHtcbiAgICAgICAgdGhpcy5vZmZNYXAgPSBmYWxzZVxuICAgICAgICBpZiAoIXRoaXMubWluaW5nKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmluZyA9ICdmdWxsJ1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGV0ZXJtaW5lUGFydGljbGVSYXRpb3MoKSB7XG4gICAgICAgIHRoaXMuYWxsUGFydGljbGVzID0gW11cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5sb2NhbGUucGFydGljbGVzKS5mb3JFYWNoKHBhcnRpY2xlID0+IHtcbiAgICAgICAgICAgIGxldCBudW1iZXJPZlBhcnRpY2xlcyA9IHRoaXMubG9jYWxlLnBhcnRpY2xlc1twYXJ0aWNsZV1cbiAgICAgICAgICAgIHdoaWxlIChudW1iZXJPZlBhcnRpY2xlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuYWxsUGFydGljbGVzLnB1c2gocGFydGljbGUpXG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZQYXJ0aWNsZXMtLVxuICAgICAgICB9fSlcbiAgICB9XG5cblxuICAgIGV4dHJhY3RQYXJ0aWNsZXMoKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbVBhcnRpY2xlID0gdGhpcy5hbGxQYXJ0aWNsZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5hbGxQYXJ0aWNsZXMubGVuZ3RoKV1cbiAgICAgICAgaWYgKCF0aGlzLm1pbmVkUGFydGljbGVzW3JhbmRvbVBhcnRpY2xlXSkge1xuICAgICAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0gPSAxXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1pbmVkUGFydGljbGVzW3JhbmRvbVBhcnRpY2xlXSsrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWluZWRPYmogPSB0aGlzLm1pbmVkUGFydGljbGVzXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnYWRkLW1pbmVkJywgbWluZWRPYmopXG4gICAgfVxuXG5cblxuICAgIGNoZWNrUGFydGljbGVBbW91bnRzKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmluZyA9ICdlbXB0eSdcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQgPj0gKHRoaXMubG9jYWxlLm1heFBhcnRpY2xlcyAvIDIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbmcgPSAnZnVsbCdcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudC0tXG4gICAgICAgICAgICAgICAgdGhpcy5leHRyYWN0UGFydGljbGVzKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQgPCAodGhpcy5sb2NhbGUubWF4UGFydGljbGVzIC8gMikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmluZyA9ICdoYWxmJ1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50LS1cbiAgICAgICAgICAgICAgICB0aGlzLmV4dHJhY3RQYXJ0aWNsZXMoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgIH1cblxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZURpdih0aGlzKVxuICAgICAgICB0aGlzLmRyYXdMYXllcih0aGlzLmRpdilcbiAgICB9XG5cblxuICAgIGhhbHRNaW5pbmcoKSB7XG4gICAgICAgIC8vIHRoaXMubWluaW5nID0gZmFsc2VcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5jYW5jZWxsYXRpb25LZXkpXG4gICAgfVxuXG5cblxuXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFydGljbGVNaW5lclxuIiwiaW1wb3J0IFBhcnRpY2xlTWluZXIgZnJvbSAnLi9QYXJ0aWNsZU1pbmVyJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcblxuY29uc3QgSVRFTVMgPSBbXG4gICAgUGFydGljbGVNaW5lclxuXVxuXG5mdW5jdGlvbiByYW5kb21JdGVtKCkge1xuICAgIHJldHVybiBuZXcgSVRFTVNbVXRpbGl0eS5yYW5kb21pemUoSVRFTVMubGVuZ3RoKV1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVJdGVtcyhudW1iZXI9MSkge1xuICAgIGNvbnN0IGl0ZW1zID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlcjsgaSsrKSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocmFuZG9tSXRlbSgpKVxuICAgIH1cbiAgICByZXR1cm4gaXRlbXNcbn1cblxuXG5leHBvcnQge1xuICAgIGdlbmVyYXRlSXRlbXNcbn1cbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LmxvY2FsU3RvcmFnZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBsb2NhbHN0b3JhZ2UsIHNhdmluZyBkaXNhYmxlZCcpXG4gICAgICAgICAgICB3aW5kb3cuYWxlcnQoJ3NhdmluZyBkaXNhYmxlZCcpXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICAgICAgICB0aGlzLnN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLmNsZWFyKClcbiAgICB9XG5cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAodGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KSAhPT0gbnVsbClcbiAgICB9XG5cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RvcmUuc2V0Jywga2V5KVxuXG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKVxuICAgIH1cblxuICAgIGdldChrZXkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3JlLmdldCcsIGtleSlcblxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU3RvcmUoKVxuIl19
