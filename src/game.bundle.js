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
            this.render();

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

var _miningInventory = require('./miningInventory');

var _miningInventory2 = _interopRequireDefault(_miningInventory);

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
            this.miningInventory = _miningInventory2.default;

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

},{"./Blueprints":2,"./Character":3,"./InventoryDisplay":5,"./Map":7,"./Scenery":11,"./Status":12,"./UserInput":13,"./eventManager":15,"./inventory":17,"./items":20,"./miningInventory":21,"./store":22}],17:[function(require,module,exports){
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

var MiningInventory = function () {
    function MiningInventory() {
        _classCallCheck(this, MiningInventory);

        this.EM = _eventManager2.default;
        this.EM.subscribe('add-mined', this.addMined, this);
        this.storeMining = {};
        this.miningStateObj = {};
    }

    _createClass(MiningInventory, [{
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
            var _this = this;

            var checkedObj = {};
            Object.keys(currentObj).forEach(function (key) {
                if (!checkedObj[key]) {
                    checkedObj[key] = 0;
                }
                if (!_this.miningStateObj[currentObj.ID][key]) {
                    _this.miningStateObj[currentObj.ID][key] = 0;
                }
                checkedObj[key] = currentObj[key] - _this.miningStateObj[currentObj.ID][key];
            });
            return checkedObj;
        }
    }, {
        key: 'incrementStorage',
        value: function incrementStorage(particleObj) {
            var _this2 = this;

            Object.keys(particleObj).forEach(function (key) {
                if (!_this2.storeMining[key]) {
                    _this2.storeMining[key] = 0;
                }
                _this2.storeMining[key] += particleObj[key];
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

    return MiningInventory;
}();

exports.default = new MiningInventory();

},{"./eventManager":15}],22:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0ludmVudG9yeURpc3BsYXkuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIiwic3JjL2pzL2l0ZW1zL0l0ZW0uanMiLCJzcmMvanMvaXRlbXMvUGFydGljbGVNaW5lci5qcyIsInNyYy9qcy9pdGVtcy9pbmRleC5qcyIsInNyYy9qcy9taW5pbmdJbnZlbnRvcnkuanMiLCJzcmMvanMvc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxPQUFPLElBQVA7Ozs7Ozs7Ozs7O0FDRkE7Ozs7Ozs7O0FBR0EsSUFBTSxnQkFBZ0I7QUFDbEIsc0JBQWtCO0FBQ2QsY0FBTSwrQkFEUTtBQUVkLHFCQUFhLEVBRkM7QUFHZCxtQkFBVyxFQUhHO0FBSWQsc0JBQWM7QUFKQSxLQURBO0FBT2xCLG9CQUFnQjtBQUNaLGNBQU0sNkJBRE07QUFFWixxQkFBYSxFQUZEO0FBR1osbUJBQVcsRUFIQztBQUlaLHNCQUFjO0FBSkYsS0FQRTtBQWFsQixtQkFBZTtBQUNYLGNBQU0sNEJBREs7QUFFWCxxQkFBYSxFQUZGO0FBR1gsbUJBQVcsRUFIQTtBQUlYLHNCQUFjO0FBSkg7QUFiRyxDQUF0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LG1CQUFPLFdBQVA7QUFDSDs7Ozs7O2tCQUdVLElBQUksZUFBSixFOzs7Ozs7Ozs7OztBQ2pFZjs7Ozs7Ozs7SUFFTSxLO0FBQ0YscUJBQWM7QUFBQTs7QUFDVixhQUFLLEVBQUw7O0FBRUEsWUFBSSxPQUFPLE9BQU8sWUFBZCxLQUErQixXQUFuQyxFQUFnRDtBQUM1QyxvQkFBUSxHQUFSLENBQVksa0NBQVo7QUFDQSxtQkFBTyxLQUFQLENBQWEsaUJBQWI7QUFDQSxpQkFBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0gsU0FKRCxNQUlPO0FBQ0gsaUJBQUssUUFBTCxHQUFnQixLQUFoQjtBQUNBLGlCQUFLLE9BQUwsR0FBZSxPQUFPLFlBQXRCO0FBQ0g7QUFDSjs7OztnQ0FFTztBQUNKLGlCQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ0g7Ozs0QkFFRyxHLEVBQUs7QUFDTCxtQkFBUSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEdBQXJCLE1BQThCLElBQXRDO0FBQ0g7Ozs0QkFFRyxHLEVBQUssSyxFQUFPO0FBQ1osb0JBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsR0FBekI7O0FBRUEsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsRUFBMEIsS0FBSyxTQUFMLENBQWUsS0FBZixDQUExQjtBQUNIOzs7NEJBRUcsRyxFQUFLO0FBQ0wsb0JBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsR0FBekI7O0FBRUEsbUJBQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixDQUFYLENBQVA7QUFDSDs7Ozs7O2tCQUlVLElBQUksS0FBSixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2pzL2dhbWUnXG5cbndpbmRvdy5nYW1lID0gZ2FtZVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNvbnN0IGJsdWVwcmludERhdGEgPSB7XG4gICAgYXJ0aWZpY2lhbE11c2NsZToge1xuICAgICAgICBuYW1lOiAnYXJ0aWZpY2lhbCBtdXNjbGUgKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHJldGluYWxEaXNwbGF5OiB7XG4gICAgICAgIG5hbWU6ICdyZXRpbmFsIGRpc3BsYXkgKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHByb3N0aGV0aWNBcm06IHtcbiAgICAgICAgbmFtZTogJ3Byb3N0aGV0aWMgYXJtIChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfVxufVxuXG5cbmNsYXNzIEJsdWVwcmludCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9tKCkge1xuICAgICAgICBjb25zdCBibHVlcHJpbnRWYWx1ZXMgPSBPYmplY3QudmFsdWVzKGJsdWVwcmludERhdGEpXG4gICAgICAgIGNvbnN0IGluZGV4ID0gVXRpbGl0eS5yYW5kb21pemUoYmx1ZXByaW50VmFsdWVzLmxlbmd0aClcblxuICAgICAgICBjb25zdCByYW5kb21CbHVlcHJpbnQgPSBibHVlcHJpbnRWYWx1ZXNbaW5kZXhdXG5cbiAgICAgICAgcmV0dXJuIG5ldyBCbHVlcHJpbnQocmFuZG9tQmx1ZXByaW50Lm5hbWUsIHJhbmRvbUJsdWVwcmludC5kZXNjcmlwdGlvbilcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQmx1ZXByaW50XG5cbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICcuL01vdmVhYmxlJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5cblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgTW92ZWFibGUgeyAgLy8gQ2hhcmFjdGVyIGRhdGEgYW5kIGFjdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXBJbnN0YW5jZSwgaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgIHN1cGVyKG1hcEluc3RhbmNlKVxuXG4gICAgICAgIHRoaXMubWFwSW5zdGFuY2UgPSBtYXBJbnN0YW5jZVxuICAgICAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA9IGluaXRpYWxQb3NpdGlvblxuXG4gICAgICAgIHRoaXMuaW5pdFNldHRpbmdzKClcbiAgICAgICAgdGhpcy5yZW5kZXIoKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFyYWN0ZXIgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIGluaXRTZXR0aW5ncygpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyh0aGlzLmdldFBvc2l0aW9uKCkpXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVNwYW4odGhpcy5nZXRDaGFyYWN0ZXIoKSlcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIoJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb24oKSB7XG4gICAgICAgIGxldCBwb3NpdGlvblxuICAgICAgICB0aGlzLmluaXRpYWxQb3NpdGlvbiA/IHBvc2l0aW9uID0gdGhpcy5pbml0aWFsUG9zaXRpb24gOiBwb3NpdGlvbiA9IHRoaXMubWFwSW5zdGFuY2UuZ2V0TWFwQ2VudGVyKClcbiAgICAgICAgcmV0dXJuIHBvc2l0aW9uXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgdHlwZTogJ2FjdG9yJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdAJyxcbiAgICAgICAgICAgIGNsczogJ2NoYXJhY3RlcicsXG4gICAgICAgICAgICBsZWZ0OiBjc3NMZWZ0LFxuICAgICAgICAgICAgdG9wOiBjc3NUb3AsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBnZXRBY3Rpb24oZm5OYW1lLCBhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbZm5OYW1lXS5iaW5kKHRoaXMsIGFyZylcbiAgICB9XG5cbiAgICBtb3ZlKGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy51cGRhdGVHcmlkSW5kaWNlcyh0aGlzLmdldENoYXJhY3RlcigpLCBESVJFQ1RJT05TW2RpcmVjdGlvbl0pXG4gICAgICAgIHRoaXMucHJpbnRMb2NhbFN0YXR1cygpXG4gICAgICAgIHRoaXMucmVuZGVyKClcblxuICAgICAgICBjb25zb2xlLmxvZygndGhpcy5sb2NhdGlvbicsIHRoaXMubG9jYXRpb24pXG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmxvY2F0aW9uLngsXG4gICAgICAgICAgICB5OiB0aGlzLmxvY2F0aW9uLnlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnbW92ZWQtdG8nLCBwb3NpdGlvbilcbiAgICB9XG5cbiAgICBwcmludExvY2FsU3RhdHVzKCkge1xuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIGNvbnN0IGxvY2FsSXRlbSA9IHRoaXMuZ2V0TG9jYWxJdGVtKClcblxuICAgICAgICBpZiAobG9jYWxJdGVtKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxJdGVtLm1pbmluZyA9PT0gJ2VtcHR5Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ21pbmluZyBoYXMgYmVlbiBleGhhdXN0ZWQgZm9yIHRoaXMgcmVnaW9uJylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobG9jYWxJdGVtLm1pbmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ2EgbWluZXIgcHVsbHMgY29tcG91bmRzIGZyb20gdGhlIHJlZ2lvbicpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnZGlzcGxheS1pdGVtJywgbG9jYWxJdGVtLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMb2NhbEl0ZW0oKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIGxldCBsb2NhbEl0ZW0gPSBudWxsXG4gICAgICAgIHRoaXMubWFwSW5zdGFuY2UuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY2hhci54ICYmIGl0ZW0ueSA9PT0gY2hhci55KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxJdGVtID0gaXRlbVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBsb2NhbEl0ZW1cbiAgICB9XG5cbiAgICB0YWtlKCkge1xuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmdldExvY2FsSXRlbSgpXG5cbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGAke2xvY2FsSXRlbS5uYW1lfS0ke2xvY2FsSXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gKVxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBgJHtsb2NhbEl0ZW0ubmFtZX0gdGFrZW5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAndGhlcmUgaXMgbm90aGluZyBoZXJlIHdvcnRoIHRha2luZycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRJdGVtTG9jYXRpb24oaXRlbU5hbWUpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgY29uc3QgaXRzZWxmID0gdGhpcy5pbnZlbnRvcnkucmV0cmlldmVJdGVtKGl0ZW1OYW1lKVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IFtjaGFyLngsIGNoYXIueV1cbiAgICAgICAgcmV0dXJuIHsgaXRzZWxmLCBsb2NhdGlvbiB9XG4gICAgfVxuXG4gICAgbWluZSgpIHtcbiAgICAgICAgY29uc3QgbWluZXIgPSB0aGlzLmdldEl0ZW1Mb2NhdGlvbigncGFydGljbGUgbWluZXInKVxuICAgICAgICBpZiAobWluZXIuaXRzZWxmKSB7XG4gICAgICAgICAgICBtaW5lci5pdHNlbGYubWluZShtaW5lci5sb2NhdGlvbilcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgncmVtb3ZlLWludmVudG9yeScsIG1pbmVyLml0c2VsZilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ3lvdSBkbyBub3QgaGF2ZSBhbnkgcGFydGljbGUgbWluZXJzJylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBJbnZlbnRvcnlEaXNwbGF5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pbnZlbnRvcnknLCB0aGlzLnJlbmRlciwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktbWluZWQnLCB0aGlzLnJlbmRlck1pbmVkLCB0aGlzKVxuICAgIH1cblxuICAgIHJlbmRlcihpbnZlbnRvcnlPYmplY3QpIHtcbiAgICAgICAgbGV0IHN0ciA9IGludmVudG9yeU9iamVjdC5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpLmpvaW4oJzxicj4nKVxuICAgICAgICBzdHIgPSAnSU5WRU5UT1JZIDxicj48YnI+JyArIHN0clxuICAgICAgICB0aGlzLnNldChzdHIsICdpbnZlbnRvcnktc3RhdHVzJylcbiAgICB9XG5cbiAgICByZW5kZXJNaW5lZChtaW5lZEVsZW1lbnRzT2JqZWN0KSB7XG4gICAgICAgIGxldCBzdHIgPSB0aGlzLmNsZWFuSlNPTlN0cmluZyhKU09OLnN0cmluZ2lmeShtaW5lZEVsZW1lbnRzT2JqZWN0KSlcbiAgICAgICAgc3RyID0gJ1BBUlRJQ0xFUyBNSU5FRCA8YnI+PGJyPicgKyBzdHJcbiAgICAgICAgdGhpcy5zZXQoc3RyLCAnbWluaW5nLXN0YXR1cycpXG4gICAgfVxuXG4gICAgY2xlYW5KU09OU3RyaW5nKHN0cikge1xuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXCIvZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC86L2csICcgJylcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL3svZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC99L2csICcnKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvLC9nLCAnPGJyPicpXG5cbiAgICAgICAgcmV0dXJuIHN0clxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZWxlbWVudElELCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJRCkuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSW52ZW50b3J5RGlzcGxheVxuIiwiY2xhc3MgTGFuZHNjYXBlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB0aGlzLmZlYXR1cmVzKClcbiAgICAgICAgdGhpcy5iYXJlID0gdGhpcy5iYXJlKClcbiAgICB9XG5cbiAgICBmZWF0dXJlcygpIHtcbiAgICAgICAgY29uc3QgcGVyaW9kID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0aGUgYWlyIGlzIGNob2tlZCB3aXRoIGR1c3QsIHN0YXRpYywgd2lmaScsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjUsXG4gICAgICAgICAgICBjbHM6ICdwZXJpb2QnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBjaHJvbWU6IDE1LFxuICAgICAgICAgICAgICAgIGxlYWQ6IDMwLFxuICAgICAgICAgICAgICAgIHN0eXJvZm9hbTogMzAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBzaWxpY29uOiAxMCxcbiAgICAgICAgICAgICAgICBjZXJhbWljOiAxMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21tYSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcsJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnc3ByYXdsIG9mIHNtYXJ0IGhvbWVzLCBjdWwtZGUtc2FjcywgbGFuZXdheXMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI2LFxuICAgICAgICAgICAgY2xzOiAnY29tbWEnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBsYXRleDogMTUsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIGJvbmU6IDEwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdyYXZlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJ14nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhIHNoaW1tZXJpbmcgZmllbGQgb2Ygc29sYXIgcGFuZWxzLCBicm9rZW4gYW5kIGNvcnJvZGVkJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMixcbiAgICAgICAgICAgIGNsczogJ2dyYXZlJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBiZW56ZW5lOiAyMCxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2VyYW1pYzogMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwXG5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhc3RlcmlzayA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcqJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnaG9sbG93IHVzZXJzIGphY2sgaW4gYXQgdGhlIGRhdGFodWJzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMCxcbiAgICAgICAgICAgIGNsczogJ2FzdGVyaXNrJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBiZW56ZW5lOiAyMCxcbiAgICAgICAgICAgICAgICBzaWxpY29uOiAxMCxcbiAgICAgICAgICAgICAgICBjYXJib246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMFxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwZXJpb2QsIGNvbW1hLCBzZW1pY29sb24sIHNlbWljb2xvbiwgYXN0ZXJpc2ssIGFzdGVyaXNrLCBncmF2ZSwgZ3JhdmVdXG4gICAgfVxuXG4gICAgYmFyZSgpIHtcbiAgICAgICAgY29uc3QgYmFyZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmbmJzcDsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjb25jcmV0ZSBhbmQgdHdpc3RlZCByZWJhciBzdHJldGNoIHRvIHRoZSBob3Jpem9uJyxcbiAgICAgICAgICAgIGNsczogJ2JsYW5rJyxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTAsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBpcm9uOiAzMCxcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBib25lOiAxMCxcbiAgICAgICAgICAgICAgICBoeWRyb2NhcmJvbnM6IDE1LFxuICAgICAgICAgICAgICAgIHVyYW5pdW06IDEwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXJlXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYW5kc2NhcGVEYXRhXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IE1hcEdlbmVyYXRvciBmcm9tICcuL01hcEdlbmVyYXRvcidcblxuY2xhc3MgTWFwIHtcbiAgICBjb25zdHJ1Y3RvcihtYXBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgY29uc3RydWN0b3InLCBtYXBEYXRhKVxuXG4gICAgICAgIHRoaXMubWFwID0gbWFwRGF0YVxuICAgICAgICB0aGlzLmNvbCA9IE1hcC5nZXRDb2wobWFwRGF0YSlcbiAgICAgICAgdGhpcy5yb3cgPSBNYXAuZ2V0Um93KG1hcERhdGEpXG5cbiAgICAgICAgdGhpcy5pdGVtc09uTWFwID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDb2wobWFwRGF0YSkge1xuICAgICAgICByZXR1cm4gbWFwRGF0YS5sZW5ndGhcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Um93KG1hcERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1hcERhdGFbMF0ubGVuZ3RoXG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlKHsgY29sLCByb3cgfSkge1xuICAgICAgICBjb25zdCBtYXBHZW5lcmF0b3IgPSBuZXcgTWFwR2VuZXJhdG9yKClcblxuICAgICAgICByZXR1cm4gbWFwR2VuZXJhdG9yLmdlbmVyYXRlKHsgY29sLCByb3d9KVxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwXG4gICAgfVxuXG4gICAgZ2V0TWFwQ2VudGVyKCkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IodGhpcy5jb2wvMiksIE1hdGguZmxvb3IodGhpcy5yb3cvMildXG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tTWFwTG9jYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKSwgVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKV1cbiAgICB9XG5cbiAgICBzZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKSB7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLnNldE1hcCh0aGlzLm1hcClcbiAgICB9XG5cbiAgICBzZXRJdGVtcyhpdGVtcykge1xuICAgICAgICBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21NYXBMb2NhdGlvbiA9IHRoaXMuZ2V0UmFuZG9tTWFwTG9jYXRpb24oKVxuICAgICAgICAgICAgaXRlbS5zZXRPbk1hcCh0aGlzLm1hcCwgcmFuZG9tTWFwTG9jYXRpb24pXG4gICAgICAgICAgICBpdGVtLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKSAgLy8gbW92ZWQgY2hpbGRFbGVtZW50IGNyZWF0aW9uIG91dCBvZiAnc2V0T25NYXAnXG4gICAgICAgICAgICB0aGlzLnB1c2hJdGVtKGl0ZW0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVzaEl0ZW0oaXRlbSkge1xuICAgICAgICB0aGlzLml0ZW1zT25NYXAucHVzaChpdGVtKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgTGFuZHNjYXBlRGF0YSBmcm9tICcuL0xhbmRzY2FwZURhdGEnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5cblxuY2xhc3MgTWFwR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBnZW5lcmF0ZSh7IGNvbCwgcm93IH0pIHtcblxuICAgICAgICB0aGlzLmNvbCA9IGNvbFxuICAgICAgICB0aGlzLnJvdyA9IHJvd1xuXG4gICAgICAgIHRoaXMubGFuZHNjYXBlU2VlZHMgPSBuZXcgTGFuZHNjYXBlRGF0YSgpXG5cbiAgICAgICAgdGhpcy5tYWtlR3JpZCgpXG4gICAgICAgIHRoaXMuc2VlZCgpXG4gICAgICAgIHRoaXMuZ3JvdygpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ21hcCBnZW5lcmF0ZWQnKVxuXG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRcbiAgICB9XG5cbiAgICBtYWtlR3JpZCgpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvdzsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRbaV0gPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0NlbGwgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpXG4gICAgICAgICAgICAgICAgbmV3Q2VsbCA9IHRoaXMuYXNzaWduQ29vcmRpbmF0ZXMobmV3Q2VsbCwgaiwgaSlcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbaV0ucHVzaChuZXdDZWxsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXNzaWduQ29vcmRpbmF0ZXMoY2VsbCwgeENvb3JkLCB5Q29vcmQpIHtcbiAgICAgICAgY2VsbC54ID0geENvb3JkXG4gICAgICAgIGNlbGwueSA9IHlDb29yZFxuICAgICAgICByZXR1cm4gY2VsbFxuICAgfVxuXG4gICAgc2VlZCgpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tRWxlbWVudHMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKTsgaSsrKSB7XG4gICAgICAgICAgICByYW5kb21FbGVtZW50cy5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlcy5sZW5ndGgpXSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlZWRzID0gdGhpcy5nZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpXG4gICAgICAgIHRoaXMuc2VlZHMubWFwKHNlZWQgPT4gdGhpcy5ncmlkW3NlZWQueV1bc2VlZC54XSA9IHNlZWQpXG5cbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlTmV4dFNlZWRCYXRjaCgpXG4gICAgICAgICAgICBpZiAodGhpcy5vdXRPZlNlZWRzKCkpIG1hcFBvcHVsYXRlZCA9IHRydWVcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQmFkU2VlZHMoKVxuICAgICAgICAgICAgdGhpcy5wbGFudFNlZWRzKClcbiAgICAgICAgICAgIHRoaXMuaGFzVW5zZWVkZWRMb2NhdGlvbnMoKSA/IHRoaXMuc2VlZHMgPSB0aGlzLmdvb2RTZWVkcyA6IG1hcFBvcHVsYXRlZCA9IHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlTmV4dFNlZWRCYXRjaCgpIHtcbiAgICAgICAgdGhpcy5uZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICB0aGlzLnNlZWRzLmZvckVhY2goKG9yaWdpbmFsU2VlZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFNlZWQgPSBvcmlnaW5hbFNlZWRcbiAgICAgICAgICAgIHRoaXMuZ2V0TmV3U2VlZCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBnZXROZXdTZWVkKCkge1xuICAgICAgIGZvciAobGV0IGtleSBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1NlZWQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9yaWdpbmFsU2VlZClcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRElSRUNUSU9OU1trZXldXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja1Byb2JhYmlsaXR5KHRoaXMubmV3U2VlZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5ld1NlZWRDb29yZGluYXRlcygpXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0R2VuU2VlZHMucHVzaCh0aGlzLm5ld1NlZWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja1Byb2JhYmlsaXR5KG5ld1NlZWQpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxpdHkucHJvYmFiaWxpdHkobmV3U2VlZC5wcm9iYWJpbGl0eSlcbiAgICB9XG5cbiAgICBjcmVhdGVOZXdTZWVkQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1NlZWQueCA9IHRoaXMub3JpZ2luYWxTZWVkLnggKyB0aGlzLmRpcmVjdGlvbltrZXldXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3knKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1NlZWQueSA9IHRoaXMub3JpZ2luYWxTZWVkLnkgKyB0aGlzLmRpcmVjdGlvbltrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG91dE9mU2VlZHMoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5uZXh0R2VuU2VlZHMubGVuZ3RoXG4gICAgfVxuXG4gICAgZmlsdGVyQmFkU2VlZHMoKSB7XG4gICAgICAgIHRoaXMuZ29vZFNlZWRzID0gW11cbiAgICAgICAgdGhpcy5uZXh0R2VuU2VlZHMuZm9yRWFjaCgoc2VlZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kU2VlZHMucHVzaCh0aGlzLmNoZWNrU2VlZChzZWVkKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBpZiAodGhpcy5pZk9mZk1hcChzZWVkKSkgcmV0dXJuIG51bGxcbiAgICAgICAgaWYgKHRoaXMuaXNBbHJlYWR5U2VlZGVkKHNlZWQpKSByZXR1cm4gbnVsbFxuICAgICAgICAvLyBpZiAodGhpcy5pc1dhaXRpbmdUb0JlU2VlZGVkKHNlZWQpKSByZXR1cm4gbnVsbFxuICAgICAgICByZXR1cm4gc2VlZFxuICAgIH1cblxuICAgIGlmT2ZmTWFwKHNlZWQpIHtcbiAgICAgICAgcmV0dXJuICEoKHNlZWQueCA8IHRoaXMuY29sICYmIHNlZWQueCA+PSAwKSAmJiAoc2VlZC55IDwgdGhpcy5yb3cgJiYgc2VlZC55ID49IDApKVxuICAgIH1cblxuICAgIGlzQWxyZWFkeVNlZWRlZChzZWVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRbc2VlZC55XVtzZWVkLnhdLmNscyAhPT0gJ2JsYW5rJ1xuICAgIH1cblxuXG4gICAgcGxhbnRTZWVkcygpIHtcbiAgICAgICAgdGhpcy5nb29kU2VlZHMuZm9yRWFjaCgoZ29vZFNlZWQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0uY2xzID09PSAnYmxhbmsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBoYXNVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5ncmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkuY2xzID09PSAnYmxhbmsnKSBjb3VudCsrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE1hcChtYXApIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgfVxuXG4gICAgZ2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdyaWRJbmRpY2VzWzBdXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdyaWRJbmRpY2VzWzFdXG5cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5tYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLm1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBcInlvdSd2ZSByZWFjaGVkIHRoZSBtYXAncyBlZGdlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uXG4gICAgfVxuXG4gICAgY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykge1xuICAgICAgICBsZXQgbG9jYXRpb25PbkdyaWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHggPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICBjb25zdCB5ID0gbmV3R3JpZEluZGljZXNbMF1cblxuICAgICAgICBpZiAodGhpcy5tYXBbeF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5tYXBbeF1beV1cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uT25HcmlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uT25HcmlkXG4gICAgfVxuXG4gICAgZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXQnKVxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgICBjb25zdCB3aWR0aCA9IFV0aWxpdHkuc3RyaW5nVG9OdW1iZXIoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSlcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSlcbiAgICAgICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9XG4gICAgfVxuXG4gICAgZ2V0Q1NTQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGNzcyA9IHRoaXMuZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKVxuICAgICAgICBjb25zdCBjc3NMZWZ0ID0gdGhpcy5ncmlkSW5kaWNlc1swXSAqIGNzcy5oZWlnaHRcbiAgICAgICAgY29uc3QgY3NzVG9wID0gdGhpcy5ncmlkSW5kaWNlc1sxXSAqIGNzcy53aWR0aFxuICAgICAgICByZXR1cm4geyBjc3NMZWZ0LCBjc3NUb3AgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBNb3ZlYWJsZVxuIiwiY2xhc3MgUmVuZGVyYWJsZSB7ICAvLyBnZW5lcmFsaXplZCByZW5kZXIgZnVuY3Rpb25zIGZvciBTY2VuZXJ5LCBDaGFyYWN0ZXJcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRMYXllcihsYXllcikge1xuICAgICAgICB0aGlzLmxheWVyID0gbGF5ZXJcbiAgICB9XG5cbiAgICBnZXRMYXllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJcbiAgICB9XG5cbiAgICByZW5kZXJTcGFuKHVuaXQpIHtcbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdC50b3AgJiYgdW5pdC5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7dW5pdC50b3B9cHg7IGxlZnQ6ICR7dW5pdC5sZWZ0fXB4YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ1bml0ICR7Y2xzfVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9zcGFuPmBcbiAgICB9XG5cbiAgICByZW5kZXJEaXYoaXRlbSkge1xuICAgICAgICBsZXQgZGl2ID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgZGl2ID0gaXRlbS5kaXZcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpdGVtLmVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS50b3AgJiYgaXRlbS5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7aXRlbS50b3B9cHg7IGxlZnQ6ICR7aXRlbS5sZWZ0fXB4OyBwb3NpdGlvbjogYWJzb2x1dGVgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ub2ZmTWFwKSB7XG4gICAgICAgICAgICBzdHlsZSArPSBgOyBkaXNwbGF5OiBub25lYFxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChpdGVtLm1pbmluZykge1xuICAgICAgICAgICAgY2FzZSAnZnVsbCc6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctZnVsbCAzcyBpbmZpbml0ZWBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnaGFsZic6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctaGFsZiAzcyBpbmZpbml0ZWBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgICAgICAgIHN0eWxlICs9IGA7IGFuaW1hdGlvbjogbWluaW5nLWVtcHR5IDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYDxkaXYgaWQ9XCIke2Rpdn1cIiBzdHlsZT1cIiR7c3R5bGV9XCI+JHtlbGVtZW50fTwvZGl2PmBcbiAgICB9XG5cbiAgICB1cGRhdGVTcGFuKGFjdG9yKSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5yZW5kZXJTcGFuKGFjdG9yKSlcbiAgICB9XG5cbiAgICB1cGRhdGVEaXYoaXRlbSkge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyRGl2KGl0ZW0pKVxuICAgIH1cblxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG4gICAgY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudChwYXJlbnRMYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50TGF5ZXJJZClcbiAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSAvLyBjcmVhdGVzIGRpdiBpZCB3aXRoaW4gZW5jbG9zaW5nIGRpdiAuLi5cbiAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlcmFibGVcbiIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4vUmVuZGVyYWJsZSdcblxuXG5jbGFzcyBTY2VuZXJ5IGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBTY2VuZXJ5LXNwZWNpZmljIHJlbmRlcmluZyBmdW5jdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLm1hcCA9IG1hcC5nZXRNYXAoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKClcbiAgICAgICAgY29uc29sZS5sb2coJ3NjZW5lcnkgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKCkge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5tYXAubWFwKGFyciA9PiB7IHJldHVybiBhcnIuc2xpY2UoKSB9KVxuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMuY3JlYXRlTGF5ZXIoZ3JpZCkpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVMYXllcihncmlkKSB7XG4gICAgICAgIGNvbnN0IHNjZW5lcnlHcmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3dJdGVtcyA9IGdyaWRbaV1cbiAgICAgICAgICAgIGxldCByb3cgPSAnJyAgLy8gcG9zc2libHkgbWFrZSBlYWNoIHJvdyBhIHRhYmxlP1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyArPSB0aGlzLnJlbmRlclNwYW4ocm93SXRlbXNbaV0pIC8vIGFkZCByZW5kZXJlZCBpdGVtcyB0byB0aGUgZ3JpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NlbmVyeUdyaWQucHVzaChyb3cpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjZW5lcnlHcmlkXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKCkge1xuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBjb25zdCBncmlkVG9IVE1MID0gbGF5ZXIuam9pbignPGJyIC8+JykgIC8vIHVzaW5nIEhUTUwgYnJlYWtzIGZvciBub3dcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZHNjYXBlLWxheWVyJylcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gZ3JpZFRvSFRNTFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTY2VuZXJ5XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLnVwZGF0ZSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktaXRlbScsIHRoaXMuZGlzcGxheUl0ZW0sIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdzdGF0dXMnLCB0aGlzLmRlZmF1bHQsIHRoaXMpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGJlZ2luc1dpdGhWb3dlbCh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TGV0dGVyID0gdGV4dFswXVxuICAgICAgICBjb25zdCB2b3dlbHMgPSBbJ2EnLCAnZScsICdpJywgJ28nLCAndSddXG4gICAgICAgIGxldCBiZWdpbnNXaXRoVm93ZWwgPSBmYWxzZVxuICAgICAgICB2b3dlbHMuZm9yRWFjaCh2b3dlbCA9PiB7XG4gICAgICAgICAgICBpZiAoZmlyc3RMZXR0ZXIgPT09IHZvd2VsKSB7XG4gICAgICAgICAgICAgICAgYmVnaW5zV2l0aFZvd2VsID0gdHJ1ZVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBiZWdpbnNXaXRoVm93ZWxcbiAgICB9XG5cbiAgICBkaXNwbGF5SXRlbShpdGVtTmFtZSkge1xuICAgICAgICBjb25zdCBiZWdpbnNXaXRoVm93ZWwgPSB0aGlzLmJlZ2luc1dpdGhWb3dlbChpdGVtTmFtZSlcbiAgICAgICAgbGV0IHRleHQgPSAnJ1xuICAgICAgICBpZiAoYmVnaW5zV2l0aFZvd2VsKSB7XG4gICAgICAgICAgICB0ZXh0ID0gYHlvdSBzZWUgYW4gJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhICR7aXRlbU5hbWV9IGhlcmVgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXQodGV4dCwgMTApXG4gICAgfVxuXG4gICAgZGVmYXVsdCh0ZXh0KSB7XG4gICAgICAgIHRoaXMuc2V0KHRleHQsIDEwKVxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZGVsYXk9MCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1xuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIFVzZXJJbnB1dCB7XG4gICAgY29uc3RydWN0b3Ioa2V5QWN0aW9uTWFwKSB7XG4gICAgICAgIHRoaXMua2V5QWN0aW9uTWFwID0ga2V5QWN0aW9uTWFwXG5cbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy50cnlBY3Rpb25Gb3JFdmVudC5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgdHJ5QWN0aW9uRm9yRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFVdGlsaXR5LmNvbnRhaW5zKHRoaXMua2V5QWN0aW9uTWFwLCBldmVudC5rZXlDb2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYG5vdCBhIHZhbGlkIGtleWNvZGU6ICR7ZXZlbnQua2V5Q29kZX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXBbZXZlbnQua2V5Q29kZV0oKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJJbnB1dFxuIiwibGV0IGlkID0gMFxuXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICAgIGlkID0gaWQgKyAxXG4gICAgcmV0dXJuIGlkXG59XG5cbmNsYXNzIFV0aWxpdHkge1xuICAgIHN0YXRpYyBjb250YWlucyhvYmosIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmluZGV4T2YoU3RyaW5nKHByb3BlcnR5KSkgIT09IC0xXG4gICAgfVxuXG4gICAgc3RhdGljIHN0cmluZ1RvTnVtYmVyKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nLm1hdGNoKC9cXGQrLylbMF1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9taXplKG11bHQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG11bHQpXG4gICAgfVxuXG4gICAgc3RhdGljIElkKCkge1xuICAgICAgICByZXR1cm4gZ2VuZXJhdGVJZCgpXG4gICAgfVxuXG4gICAgc3RhdGljIHByb2JhYmlsaXR5KHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgY29uc3QgcHJvYmFiaWxpdHlBcnJheSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2godHJ1ZSlcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMCAtIHBlcmNlbnRhZ2U7IGkrKykge1xuICAgICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKGZhbHNlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9iYWJpbGl0eUFycmF5W1V0aWxpdHkucmFuZG9taXplKDEwMCldXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxpdHlcbiIsImNsYXNzIEV2ZW50TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzTGlzdCA9IFtdICAgICAgICAvLyBjcmVhdGUgYXJyYXkgb2YgZXZlbnRzXG4gICAgfVxuXG4gICAgc3Vic2NyaWJlKGV2ZW50LCBmbiwgdGhpc1ZhbHVlLCBvbmNlPWZhbHNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpc1ZhbHVlID09PSAndW5kZWZpbmVkJykgeyAgIC8vIGlmIG5vIHRoaXNWYWx1ZSBwcm92aWRlZCwgYmluZHMgdGhlIGZuIHRvIHRoZSBmbj8/XG4gICAgICAgICAgICB0aGlzVmFsdWUgPSBmblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudHNMaXN0LnB1c2goeyAgICAgIC8vIGNyZWF0ZSBvYmplY3RzIGxpbmtpbmcgZXZlbnRzICsgZnVuY3Rpb25zIHRvIHBlcmZvcm1cbiAgICAgICAgICAgIGV2ZW50OiBldmVudCwgICAgICAgICAgIC8vIHB1c2ggZW0gdG8gdGhlIGFycmF5XG4gICAgICAgICAgICBmbjogZm4sXG4gICAgICAgICAgICBvbmNlOiBvbmNlLFxuICAgICAgICAgICAgdGhpc1ZhbHVlOiB0aGlzVmFsdWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyB1bnN1YnNjcmliZShldmVudCkge1xuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgLy8gICAgICAgICAgICAgYnJlYWtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIHB1Ymxpc2goZXZlbnQsIGFyZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRoaXNWYWx1ZSwgZm4sIG9uY2UgfSA9IHRoaXMuZXZlbnRzTGlzdFtpXVxuICAgICAgICAgICAgICAgIGZuLmNhbGwodGhpc1ZhbHVlLCBhcmcpXG4gICAgICAgICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNMaXN0LnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEV2ZW50c0xpc3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50c0xpc3RcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50TWFuYWdlcigpXG4iLCJpbXBvcnQgTWFwIGZyb20gJy4vTWFwJ1xuaW1wb3J0IFNjZW5lcnkgZnJvbSAnLi9TY2VuZXJ5J1xuaW1wb3J0IENoYXJhY3RlciBmcm9tICcuL0NoYXJhY3RlcidcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4vU3RhdHVzJ1xuaW1wb3J0IFVzZXJJbnB1dCBmcm9tICcuL1VzZXJJbnB1dCdcbmltcG9ydCBCbHVlcHJpbnRzIGZyb20gJy4vQmx1ZXByaW50cydcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5pbXBvcnQgeyBnZW5lcmF0ZUl0ZW1zIH0gZnJvbSAnLi9pdGVtcydcbmltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlJ1xuaW1wb3J0IEludmVudG9yeURpc3BsYXkgZnJvbSAnLi9JbnZlbnRvcnlEaXNwbGF5J1xuaW1wb3J0IG1pbmluZ0ludmVudG9yeSBmcm9tICcuL21pbmluZ0ludmVudG9yeSdcblxuY29uc3QgQ09MID0gNjBcbmNvbnN0IFJPVyA9IDYwXG5jb25zdCBJVEVNX05VTSA9IDVcblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgIH1cblxuICAgIGluaXRHYW1lKCkge1xuICAgICAgICBsZXQgc2V0dGluZ3NcblxuICAgICAgICBpZiAodGhpcy5oYXNHYW1lSW5Qcm9ncmVzcygpKSB7XG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRoaXMucmVzdW1lU2V0dGluZ3MoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSB0aGlzLmdlbmVyYXRlU2V0dGluZ3MoKVxuICAgICAgICB9XG5cblxuICAgICAgICBjb25zdCBtb3ZlZCA9IChsb2NhdGlvbikgPT4ge2NvbnNvbGUubG9nKCdsb2NhdGlvbicsIGxvY2F0aW9uKX1cbiAgICAgICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZSgnbW92ZWQtdG8nLCBtb3ZlZClcblxuICAgICAgICB0aGlzLmxvYWRTZXR0aW5ncyhzZXR0aW5ncylcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKVxuICAgIH1cblxuICAgIGhhc0dhbWVJblByb2dyZXNzKCkge1xuICAgICAgICByZXR1cm4gc3RvcmUuaGFzKCdtYXAnKVxuICAgIH1cblxuICAgIHJlc3VtZVNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIG1hcERhdGE6IHN0b3JlLmdldCgnbWFwJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXR0aW5nc1xuICAgIH1cblxuICAgIGdlbmVyYXRlU2V0dGluZ3MoKSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0ge31cblxuICAgICAgICBzZXR0aW5ncy5tYXBEYXRhID0gTWFwLmdlbmVyYXRlKHsgY29sOiBDT0wsIHJvdzogIFJPVyB9KVxuXG4gICAgICAgIHN0b3JlLnNldCgnbWFwJywgc2V0dGluZ3MubWFwRGF0YSlcblxuICAgICAgICByZXR1cm4gc2V0dGluZ3NcbiAgICB9XG5cbiAgICBsb2FkU2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICAgICAgY29uc3QgYmx1ZXByaW50ID0gdGhpcy5ibHVlcHJpbnQgPSBCbHVlcHJpbnRzLnJhbmRvbSgpXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcyA9IGdlbmVyYXRlSXRlbXMoSVRFTV9OVU0pXG5cbiAgICAgICAgY29uc3Qgc3RhdHVzID0gdGhpcy5zdGF0dXMgPSBuZXcgU3RhdHVzKClcbiAgICAgICAgY29uc3QgaW52ZW50b3J5RGlzcGxheSA9IHRoaXMuaW52ZW50b3J5RGlzcGxheSA9IG5ldyBJbnZlbnRvcnlEaXNwbGF5KClcblxuICAgICAgICBjb25zdCBtYXAgPSB0aGlzLm1hcCA9IG5ldyBNYXAoc2V0dGluZ3MubWFwRGF0YSlcbiAgICAgICAgY29uc3Qgc2NlbmVyeSA9IHRoaXMuc2NlbmVyeSA9IG5ldyBTY2VuZXJ5KG1hcClcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyID0gdGhpcy5jaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKG1hcClcblxuICAgICAgICBtYXAuc2V0SXRlbXMoaXRlbXMpXG4gICAgICAgIG1hcC5zZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKVxuXG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gaW52ZW50b3J5XG4gICAgICAgIHRoaXMuaW52ZW50b3J5LmFkZChibHVlcHJpbnQpXG4gICAgICAgIHRoaXMubWluaW5nSW52ZW50b3J5ID0gbWluaW5nSW52ZW50b3J5XG5cbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuaW5pdFVzZXJJbnB1dChjaGFyYWN0ZXIpXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXNldCBtYXAhJylcblxuICAgICAgICBzdG9yZS5jbGVhcigpXG5cbiAgICAgICAgdGhpcy5pbml0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdFVzZXJJbnB1dChjaGFyYWN0ZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VySW5wdXQoe1xuICAgICAgICAgICAgJzgyJzogdGhpcy5yZXNldC5iaW5kKHRoaXMpLCAvLyAocikgcmVzZXQgbWFwXG4gICAgICAgICAgICAnMzgnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ25vcnRoJyksXG4gICAgICAgICAgICAnMzcnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3dlc3QnKSxcbiAgICAgICAgICAgICczOSc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnZWFzdCcpLFxuICAgICAgICAgICAgJzQwJzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdzb3V0aCcpLFxuICAgICAgICAgICAgJzg0JzogY2hhcmFjdGVyLmdldEFjdGlvbigndGFrZScpLCAvLyAodClha2UgaXRlbVxuICAgICAgICAgICAgLy8gJzczJzogY2hhcmFjdGVyLmdldEFjdGlvbignY2hlY2tJbnZlbnRvcnknKSwgLy8gY2hlY2sgKGkpbnZlbnRvcnlcbiAgICAgICAgICAgICc3Nyc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21pbmUnKSAvLyBkZXBsb3kgcGFydGljbGUgKG0paW5lclxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KCd5b3Ugd2FrZSB1cCcpXG4gICAgICAgIHRoaXMuc3RhdHVzLnNldChgeW91IGFyZSBjYXJyeWluZyAke3RoaXMuYmx1ZXByaW50Lm5hbWV9YCwgNDAwMClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEdhbWUoKTtcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIEludmVudG9yeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMgPSBbXVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtaW52ZW50b3J5JywgdGhpcy5hZGQsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdyZW1vdmUtaW52ZW50b3J5JywgdGhpcy5yZW1vdmUsIHRoaXMpXG4gICAgfVxuXG4gICAgYWRkKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5jb250ZW50cy5wdXNoKGl0ZW0pXG4gICAgICAgIHRoaXMudXBkYXRlKClcbiAgICB9XG5cbiAgICByZW1vdmUoaXRlbSkge1xuICAgICAgICBjb25zdCB0aGVJdGVtID0gaXRlbVxuICAgICAgICB0aGlzLmNvbnRlbnRzLmZvckVhY2goKGl0ZW0sIGksIGFycmF5KSA9PiB7XG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IHRoZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRzLnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnZlbnRvcnkgaXRlbSByZW1vdmVkJylcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgICAgICB9fSlcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnZGlzcGxheS1pbnZlbnRvcnknLCB0aGlzLmNvbnRlbnRzKVxuICAgIH1cblxuICAgIHJldHJpZXZlSXRlbShpdGVtTmFtZSkge1xuICAgICAgICBsZXQgZm91bmRJdGVtID0gbnVsbFxuICAgICAgICB0aGlzLmNvbnRlbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBpdGVtTmFtZSkge1xuICAgICAgICAgICAgICAgIGZvdW5kSXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGZvdW5kSXRlbVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEludmVudG9yeVxuIiwiaW1wb3J0IE1vdmVhYmxlIGZyb20gJ2pzL01vdmVhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnanMvZXZlbnRNYW5hZ2VyJ1xuXG5cbi8vIGNvbnN0IElURU1TID0ge1xuLy8gICAgIG1pbmVyOiB7XG4vLyAgICAgICAgIG5hbWU6ICdwYXJ0aWNsZSBtaW5lcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJ3wnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ21pbmVzLCBkaXZpZGVzLCBhbmQgc3RvcmVzIGFtYmllbnQgY2hlbWljYWwgZWxlbWVudHMgYW5kIGxhcmdlciBjb21wb3VuZHMgZm91bmQgd2l0aGluIGEgMTAwIG1ldGVyIHJhZGl1cy4gOTclIGFjY3VyYWN5IHJhdGUuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1taW5lcidcbi8vICAgICB9LFxuLy8gICAgIHBhcnNlcjoge1xuLy8gICAgICAgICBuYW1lOiAnbm9pc2UgcGFyc2VyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnPycsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAncHJvdG90eXBlLiBwYXJzZXMgYXRtb3NwaGVyaWMgZGF0YSBmb3IgbGF0ZW50IGluZm9ybWF0aW9uLiBzaWduYWwtdG8tbm9pc2UgcmF0aW8gbm90IGd1YXJhbnRlZWQuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1wYXJzZXInXG4vLyAgICAgfSxcbi8vICAgICBpbnRlcmZhY2U6IHtcbi8vICAgICAgICAgbmFtZTogJ3BzaW9uaWMgaW50ZXJmYWNlJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnJicsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiBgY29ubmVjdHMgc2VhbWxlc3NseSB0byBhIHN0YW5kYXJkLWlzc3VlIGJpb3BvcnQuIGZhY2lsaXRhdGVzIHN1bmRyeSBpbnRlcmFjdGlvbnMgcGVyZm9ybWVkIHZpYSBQU0ktTkVULmAsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0taW50ZXJmYWNlJ1xuLy8gICAgIH0sXG4vLyAgICAgcHJpbnRlcjoge1xuLy8gICAgICAgICBuYW1lOiAnbW9sZWN1bGFyIHByaW50ZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICcjJyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdnZW5lcmF0ZXMgb2JqZWN0cyBhY2NvcmRpbmcgdG8gYSBibHVlcHJpbnQuIG1vbGVjdWxlcyBub3QgaW5jbHVkZWQuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1wcmludGVyJ1xuLy8gICAgIH1cbi8vIH1cblxuY2xhc3MgSXRlbSBleHRlbmRzIE1vdmVhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcihpdGVtQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICAvLyBtZXJnZSBpbiBjb25maWcgcHJvcGVydGllc1xuICAgICAgICAvLyBjb25zdCB0YXJnZXQgPSBPYmplY3QuYXNzaWduKHRoaXMsIGl0ZW1Db25maWcpXG5cbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuaWRlbnRpdHlOdW1iZXIgPSBVdGlsaXR5LklkKClcbiAgICAgICAgdGhpcy50eXBlID0gJ2l0ZW0nXG4gICAgICAgIHRoaXMub2ZmTWFwID0gZmFsc2VcbiAgICAgICAgLy8gdGhpcy5pbkludmVudG9yeSA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE9uTWFwKG1hcCwgbG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXRNYXAobWFwKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyhsb2NhdGlvbilcbiAgICAgICAgdGhpcy5zZXRDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMuc2V0R3JpZEluZGljZXMoKVxuICAgICAgICB0aGlzLnNldERpdih0aGlzLmdldElkKCkpXG4gICAgICAgIHRoaXMudXBkYXRlRGl2KHRoaXMpXG5cbi8vIG1vdmVkIHRoaXMgb3V0IHNvIHdlIGFyZSBub3QgY3JlYXRpbmcgY2hpbGRyZW4gZWFjaCB0aW1lIHdlIHdhbnQgdG8gcGxhY2Ugb24gbWFwXG4gICAgICAgIC8vIHRoaXMuY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudCgnaXRlbS1sYXllcicpXG4gICAgfVxuXG4gICAgZ2V0SWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5TnVtYmVyXG4gICAgfVxuXG4gICAgc2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgY3NzTGVmdCwgY3NzVG9wIH0gPSB0aGlzLmdldENTU0Nvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5sZWZ0ID0gY3NzTGVmdFxuICAgICAgICB0aGlzLnRvcCA9IGNzc1RvcFxuICAgIH1cblxuICAgIHNldEdyaWRJbmRpY2VzKCkge1xuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuXG4gICAgICAgIHRoaXMueCA9IHhcbiAgICAgICAgdGhpcy55ID0geVxuICAgIH1cblxuICAgIHNldERpdihpZGVudGl0eU51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuZGl2U2V0KSB7XG4gICAgICAgICAgICB0aGlzLmRpdiA9IHRoaXMuZGl2ICsgaWRlbnRpdHlOdW1iZXJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpdlNldCA9IHRydWVcbiAgICB9XG5cblxuICAgIC8vIHNwZWNpZmljIHRvIGl0ZW0gZHJhd2luZzogdXNlIG91dGVySFRNTFxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwub3V0ZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG5cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2l0ZW0nKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURpdih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25UYWtlKCkge1xuICAgICAgICB0aGlzLnggPSBudWxsXG4gICAgICAgIHRoaXMueSA9IG51bGxcbiAgICAgICAgdGhpcy5vZmZNYXAgPSB0cnVlIC8vIGNoYW5nZXMgY3NzIGRpc3BsYXkgdG8gJ25vbmUnXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3BhcnRpY2xlIG1pbmVyJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbHRNaW5pbmcoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1pbnZlbnRvcnknLCB0aGlzKVxuICAgICAgICAvLyB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMub25Ecm9wLCB0aGlzKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuICAgIH1cblxuICAgIG9uRHJvcCgpIHtcblxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHt0aGlzLm5hbWV9LSR7dGhpcy5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLm9uVGFrZSwgdGhpcywgdHJ1ZSlcbiAgICAvLyAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLCB0aGlzLmRpdilcblxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtXG4iLCJpbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuXG5jbGFzcyBQYXJ0aWNsZU1pbmVyIGV4dGVuZHMgSXRlbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICB0aGlzLm5hbWUgPSAncGFydGljbGUgbWluZXInXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAnfCdcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9ICdtaW5lcywgZGl2aWRlcywgYW5kIHN0b3JlcyBhbWJpZW50IGNoZW1pY2FsIGVsZW1lbnRzIGFuZCBsYXJnZXIgY29tcG91bmRzIGZvdW5kIHdpdGhpbiBhIDEwMCBtZXRlciByYWRpdXMuIDk3JSBhY2N1cmFjeSByYXRlLidcbiAgICAgICAgdGhpcy5kaXYgPSAnaXRlbS1taW5lcidcbiAgICAgICAgLy8gbXVzdCBzdWJzY3JpYmUgdGhlIGl0ZW0gZGlyZWN0bHksIG5vdCBvbiB0aGUgYWJzdHJhY3QgY2xhc3NcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMpXG5cbiAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlcyA9IHtcbiAgICAgICAgICAgIElEOiB0aGlzLmlkZW50aXR5TnVtYmVyXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG1pbmUobG9jYXRpb24pIHtcbiAgICAgICAgLy8gdHJ5IHNldHRpbmcgdGhlIGxvY2F0aW9uIGltbWVkaWF0ZWx5LCB1c2luZyBUSElTXG5cbiAgICAgICAgdGhpcy5sb2NhbGUgPSB0aGlzLm1hcFtsb2NhdGlvblsxXV1bbG9jYXRpb25bMF1dXG5cbiAgICAgICAgdGhpcy5zZXRNaW5pbmdDb25maWcoKVxuXG4gICAgICAgIC8vIGNhbGN1bGF0ZSByYXRpb3Mgb25jZSwgcmF0aGVyIHRoYW4gdyBldmVyeSBpbnRlcnZhbFxuICAgICAgICB0aGlzLmRldGVybWluZVBhcnRpY2xlUmF0aW9zKClcbiAgICAgICAgdGhpcy5jaGVja1BhcnRpY2xlQW1vdW50cygpXG4gICAgICAgIHRoaXMuY2FuY2VsbGF0aW9uS2V5ID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYXJ0aWNsZUFtb3VudHMoKVxuICAgICAgICB9LCAzMDAwKVxuXG4gICAgICAgIHRoaXMuc2V0T25NYXAodGhpcy5tYXAsIGxvY2F0aW9uKVxuICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgfVxuXG4gICAgc2V0TWluaW5nQ29uZmlnKCkge1xuICAgICAgICB0aGlzLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgIGlmICghdGhpcy5taW5pbmcpIHtcbiAgICAgICAgICAgIHRoaXMubWluaW5nID0gJ2Z1bGwnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXRlcm1pbmVQYXJ0aWNsZVJhdGlvcygpIHtcbiAgICAgICAgdGhpcy5hbGxQYXJ0aWNsZXMgPSBbXVxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxvY2FsZS5wYXJ0aWNsZXMpLmZvckVhY2gocGFydGljbGUgPT4ge1xuICAgICAgICAgICAgbGV0IG51bWJlck9mUGFydGljbGVzID0gdGhpcy5sb2NhbGUucGFydGljbGVzW3BhcnRpY2xlXVxuICAgICAgICAgICAgd2hpbGUgKG51bWJlck9mUGFydGljbGVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGxQYXJ0aWNsZXMucHVzaChwYXJ0aWNsZSlcbiAgICAgICAgICAgICAgICBudW1iZXJPZlBhcnRpY2xlcy0tXG4gICAgICAgIH19KVxuICAgIH1cblxuXG4gICAgZXh0cmFjdFBhcnRpY2xlcygpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tUGFydGljbGUgPSB0aGlzLmFsbFBhcnRpY2xlc1tVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLmFsbFBhcnRpY2xlcy5sZW5ndGgpXVxuICAgICAgICBpZiAoIXRoaXMubWluZWRQYXJ0aWNsZXNbcmFuZG9tUGFydGljbGVdKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmVkUGFydGljbGVzW3JhbmRvbVBhcnRpY2xlXSA9IDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXNbcmFuZG9tUGFydGljbGVdKytcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtaW5lZE9iaiA9IHRoaXMubWluZWRQYXJ0aWNsZXNcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdhZGQtbWluZWQnLCBtaW5lZE9iailcbiAgICB9XG5cblxuXG4gICAgY2hlY2tQYXJ0aWNsZUFtb3VudHMoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubWluaW5nID0gJ2VtcHR5J1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudCA+PSAodGhpcy5sb2NhbGUubWF4UGFydGljbGVzIC8gMikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmluZyA9ICdmdWxsJ1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50LS1cbiAgICAgICAgICAgICAgICB0aGlzLmV4dHJhY3RQYXJ0aWNsZXMoKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudCA8ICh0aGlzLmxvY2FsZS5tYXhQYXJ0aWNsZXMgLyAyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWluaW5nID0gJ2hhbGYnXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQtLVxuICAgICAgICAgICAgICAgIHRoaXMuZXh0cmFjdFBhcnRpY2xlcygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgfVxuXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlRGl2KHRoaXMpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKHRoaXMuZGl2KVxuICAgIH1cblxuXG4gICAgaGFsdE1pbmluZygpIHtcbiAgICAgICAgLy8gdGhpcy5taW5pbmcgPSBmYWxzZVxuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmNhbmNlbGxhdGlvbktleSlcbiAgICB9XG5cblxuXG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJ0aWNsZU1pbmVyXG4iLCJpbXBvcnQgUGFydGljbGVNaW5lciBmcm9tICcuL1BhcnRpY2xlTWluZXInXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJ1xuXG5jb25zdCBJVEVNUyA9IFtcbiAgICBQYXJ0aWNsZU1pbmVyXG5dXG5cbmZ1bmN0aW9uIHJhbmRvbUl0ZW0oKSB7XG4gICAgcmV0dXJuIG5ldyBJVEVNU1tVdGlsaXR5LnJhbmRvbWl6ZShJVEVNUy5sZW5ndGgpXVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUl0ZW1zKG51bWJlcj0xKSB7XG4gICAgY29uc3QgaXRlbXMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspIHtcbiAgICAgICAgaXRlbXMucHVzaChyYW5kb21JdGVtKCkpXG4gICAgfVxuICAgIHJldHVybiBpdGVtc1xufVxuXG5cbmV4cG9ydCB7XG4gICAgZ2VuZXJhdGVJdGVtc1xufVxuIiwiXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBNaW5pbmdJbnZlbnRvcnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtbWluZWQnLCB0aGlzLmFkZE1pbmVkLCB0aGlzKVxuICAgICAgICB0aGlzLnN0b3JlTWluaW5nID0ge31cbiAgICAgICAgdGhpcy5taW5pbmdTdGF0ZU9iaiA9IHt9XG4gICAgfVxuXG4gICAgYWRkTWluZWQoY3VycmVudE9iaikge1xuICAgICAgICAvLyBpZiBzdGF0ZSBvYmplY3QgZG9lc24ndCBleGlzdCwgYWRkIGFsbCBwYXJ0aWNsZXMgdG8gc3RvcmFnZVxuICAgICAgICBpZiAoIXRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF0pIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWluaW5nU3RhdGUoY3VycmVudE9iailcbiAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50U3RvcmFnZSh0aGlzLnN0cmlwSUQoY3VycmVudE9iaikpXG5cbiAgICAgICAgLy8gaWYgaXQgZG9lcyBleGlzdCwgY2hlY2sgY3VyciB2cyBzdGF0ZSBhbmQgYWRkIG9ubHkgdGhlIHJpZ2h0IHBhcnRpY2xlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnRTdG9yYWdlKHRoaXMuc3RyaXBJRCh0aGlzLmNoZWNrTWluaW5nU3RhdGUoY3VycmVudE9iaikpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVNaW5pbmdTdGF0ZShjdXJyZW50T2JqKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlzcGxheVBhcnRpY2xlcyA9IHRoaXMuc3RvcmVNaW5pbmdcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LW1pbmVkJywgZGlzcGxheVBhcnRpY2xlcylcbn1cblxuICAgIGNoZWNrTWluaW5nU3RhdGUoY3VycmVudE9iaikge1xuICAgICAgICBjb25zdCBjaGVja2VkT2JqID0ge31cbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudE9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKCFjaGVja2VkT2JqW2tleV0pIHtcbiAgICAgICAgICAgICAgICBjaGVja2VkT2JqW2tleV0gPSAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF1ba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF1ba2V5XSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoZWNrZWRPYmpba2V5XSA9IGN1cnJlbnRPYmpba2V5XSAtIHRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF1ba2V5XVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY2hlY2tlZE9ialxuICAgIH1cblxuICAgIGluY3JlbWVudFN0b3JhZ2UocGFydGljbGVPYmopIHtcbiAgICAgICAgT2JqZWN0LmtleXMocGFydGljbGVPYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdG9yZU1pbmluZ1trZXldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZU1pbmluZ1trZXldID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdG9yZU1pbmluZ1trZXldICs9IHBhcnRpY2xlT2JqW2tleV1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB1cGRhdGVNaW5pbmdTdGF0ZShjdXJyZW50T2JqKSB7XG4gICAgICAgIHRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF0gPSBPYmplY3QuYXNzaWduKHt9LCBjdXJyZW50T2JqKVxuICAgIH1cblxuICAgIHN0cmlwSUQoY3VycmVudE9iaikge1xuICAgICAgICBjb25zdCBwYXJ0aWNsZU9iaiA9IHt9XG4gICAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnRPYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICdJRCcpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZU9ialtrZXldID0gY3VycmVudE9ialtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwYXJ0aWNsZU9ialxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IE1pbmluZ0ludmVudG9yeVxuIiwiaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuY2xhc3MgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG5cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGxvY2Fsc3RvcmFnZSwgc2F2aW5nIGRpc2FibGVkJylcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydCgnc2F2aW5nIGRpc2FibGVkJylcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UuY2xlYXIoKVxuICAgIH1cblxuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsKVxuICAgIH1cblxuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdG9yZS5zZXQnLCBrZXkpXG5cbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpXG4gICAgfVxuXG4gICAgZ2V0KGtleSkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RvcmUuZ2V0Jywga2V5KVxuXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTdG9yZSgpXG4iXX0=
