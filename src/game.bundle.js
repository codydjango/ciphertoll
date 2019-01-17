(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

        //

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
            console.log('reset game!');

            _eventManager2.default.publish('reset');

            this.initGame();
        }
    }, {
        key: 'initUserInput',
        value: function initUserInput(character) {
            return new _UserInput2.default({
                '78': this.reset.bind(this), // (r) reset map
                '38': character.getAction('move', 'north'),
                '37': character.getAction('move', 'west'),
                '39': character.getAction('move', 'east'),
                '40': character.getAction('move', 'south'),
                '84': character.getAction('take'), // (t)ake item
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

        _eventManager2.default.subscribe('add-inventory', this.add, this);
        _eventManager2.default.subscribe('remove-inventory', this.remove, this);
        _eventManager2.default.subscribe('reset', this.clear, this);
    }

    _createClass(Inventory, [{
        key: 'clear',
        value: function clear() {
            this.contents = [];
        }
    }, {
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
            _eventManager2.default.publish('display-inventory', this.contents);
        }
    }, {
        key: 'retrieveItem',
        value: function retrieveItem(itemName) {
            var retrieved = null;
            this.contents.forEach(function (item) {
                if (item.name === itemName) {
                    retrieved = item;
                }
            });
            return retrieved;
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

        _this.initSettings();
        return _this;
    }

    _createClass(ParticleMiner, [{
        key: 'initSettings',
        value: function initSettings() {
            this.name = 'particle miner';
            this.type = 'item';
            this.element = '|';
            this.description = 'mines, divides, and stores ambient chemical elements and larger compounds found within a 100 meter radius. 97% accuracy rate.';
            this.div = 'item-miner';
            // must subscribe the item directly, not on the abstract class
            this.EM.subscribe(this.name + '-' + this.identityNumber + ' taken', this.onTake, this);

            this.minedParticles = {
                ID: this.identityNumber
            };
        }
    }, {
        key: 'mine',
        value: function mine(location) {
            var _this2 = this;

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
        this.EM.subscribe('add-mined', this.add, this);
        this.storage = {};
        this.state = {};
    }

    _createClass(MiningInventory, [{
        key: 'add',
        value: function add(current) {
            // if state object doesn't exist, add all particles to storage
            if (!this.state[current.ID]) {
                this.updateState(current);
                this.incrementStorage(this.stripID(current));

                // if it does exist, check curr vs state and add only the right particles
            } else {
                this.incrementStorage(this.stripID(this.checkState(current)));
                this.updateState(current);
            }

            var displayableParticles = this.storage;
            this.EM.publish('display-mined', displayableParticles);
        }
    }, {
        key: 'checkState',
        value: function checkState(current) {
            var _this = this;

            var checked = {};
            Object.keys(current).forEach(function (key) {
                if (!checked[key]) {
                    checked[key] = 0;
                }
                if (!_this.state[current.ID][key]) {
                    _this.state[current.ID][key] = 0;
                }
                checked[key] = current[key] - _this.state[current.ID][key];
            });
            return checked;
        }
    }, {
        key: 'incrementStorage',
        value: function incrementStorage(particles) {
            var _this2 = this;

            Object.keys(particles).forEach(function (key) {
                if (!_this2.storage[key]) {
                    _this2.storage[key] = 0;
                }
                _this2.storage[key] += particles[key];
            });
        }
    }, {
        key: 'updateState',
        value: function updateState(current) {
            this.state[current.ID] = Object.assign({}, current);
        }
    }, {
        key: 'stripID',
        value: function stripID(current) {
            var particles = {};
            Object.keys(current).forEach(function (key) {
                if (key !== 'ID') {
                    particles[key] = current[key];
                }
            });
            return particles;
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

        if (typeof window.localStorage === 'undefined') {
            console.log('no localstorage, saving disabled');
            window.alert('saving disabled');
            this.disabled = true;
        } else {
            this.disabled = false;
            this.storage = window.localStorage;
        }

        _eventManager2.default.subscribe('reset', this.clear, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0ludmVudG9yeURpc3BsYXkuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIiwic3JjL2pzL2l0ZW1zL0l0ZW0uanMiLCJzcmMvanMvaXRlbXMvUGFydGljbGVNaW5lci5qcyIsInNyYy9qcy9pdGVtcy9pbmRleC5qcyIsInNyYy9qcy9taW5pbmdJbnZlbnRvcnkuanMiLCJzcmMvanMvc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxPQUFPLElBQVAsR0FBYyxjQUFkOzs7Ozs7Ozs7OztBQ0ZBOzs7Ozs7OztBQUdBLElBQU0sZ0JBQWdCO0FBQ2xCLHNCQUFrQjtBQUNkLGNBQU0sK0JBRFE7QUFFZCxxQkFBYSxFQUZDO0FBR2QsbUJBQVcsRUFIRztBQUlkLHNCQUFjO0FBSkEsS0FEQTtBQU9sQixvQkFBZ0I7QUFDWixjQUFNLDZCQURNO0FBRVoscUJBQWEsRUFGRDtBQUdaLG1CQUFXLEVBSEM7QUFJWixzQkFBYztBQUpGLEtBUEU7QUFhbEIsbUJBQWU7QUFDWCxjQUFNLDRCQURLO0FBRVgscUJBQWEsRUFGRjtBQUdYLG1CQUFXLEVBSEE7QUFJWCxzQkFBYztBQUpI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QWUsS0FBZixDQUExQjtBQUNIOzs7NEJBRUcsRyxFQUFLO0FBQ0wsb0JBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsR0FBekI7O0FBRUEsbUJBQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixDQUFYLENBQVA7QUFDSDs7Ozs7O2tCQUlVLElBQUksS0FBSixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi9qcy9nYW1lJ1xuXG53aW5kb3cuZ2FtZSA9IGdhbWVcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jb25zdCBibHVlcHJpbnREYXRhID0ge1xuICAgIGFydGlmaWNpYWxNdXNjbGU6IHtcbiAgICAgICAgbmFtZTogJ2FydGlmaWNpYWwgbXVzY2xlIChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICByZXRpbmFsRGlzcGxheToge1xuICAgICAgICBuYW1lOiAncmV0aW5hbCBkaXNwbGF5IChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICBwcm9zdGhldGljQXJtOiB7XG4gICAgICAgIG5hbWU6ICdwcm9zdGhldGljIGFybSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH1cbn1cblxuXG5jbGFzcyBCbHVlcHJpbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbSgpIHtcbiAgICAgICAgY29uc3QgYmx1ZXByaW50VmFsdWVzID0gT2JqZWN0LnZhbHVlcyhibHVlcHJpbnREYXRhKVxuICAgICAgICBjb25zdCBpbmRleCA9IFV0aWxpdHkucmFuZG9taXplKGJsdWVwcmludFZhbHVlcy5sZW5ndGgpXG5cbiAgICAgICAgY29uc3QgcmFuZG9tQmx1ZXByaW50ID0gYmx1ZXByaW50VmFsdWVzW2luZGV4XVxuXG4gICAgICAgIHJldHVybiBuZXcgQmx1ZXByaW50KHJhbmRvbUJsdWVwcmludC5uYW1lLCByYW5kb21CbHVlcHJpbnQuZGVzY3JpcHRpb24pXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEJsdWVwcmludFxuXG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcbmltcG9ydCB7IERJUkVDVElPTlMgfSBmcm9tICcuL0NvbnN0YW50cydcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgaW52ZW50b3J5IGZyb20gJy4vaW52ZW50b3J5J1xuXG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIE1vdmVhYmxlIHsgIC8vIENoYXJhY3RlciBkYXRhIGFuZCBhY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwSW5zdGFuY2UsIGluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICBzdXBlcihtYXBJbnN0YW5jZSlcblxuICAgICAgICB0aGlzLm1hcEluc3RhbmNlID0gbWFwSW5zdGFuY2VcbiAgICAgICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPSBpbml0aWFsUG9zaXRpb25cblxuICAgICAgICB0aGlzLmluaXRTZXR0aW5ncygpXG4gICAgICAgIHRoaXMucmVuZGVyKClcblxuICAgICAgICBjb25zb2xlLmxvZygnY2hhcmFjdGVyIHJlbmRlcmVkJylcbiAgICB9XG5cbiAgICBpbml0U2V0dGluZ3MoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnlcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXModGhpcy5nZXRQb3NpdGlvbigpKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVTcGFuKHRoaXMuZ2V0Q2hhcmFjdGVyKCkpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKCdjaGFyYWN0ZXItbGF5ZXInKVxuICAgIH1cblxuICAgIGdldFBvc2l0aW9uKCkge1xuICAgICAgICBsZXQgcG9zaXRpb25cbiAgICAgICAgdGhpcy5pbml0aWFsUG9zaXRpb24gPyBwb3NpdGlvbiA9IHRoaXMuaW5pdGlhbFBvc2l0aW9uIDogcG9zaXRpb24gPSB0aGlzLm1hcEluc3RhbmNlLmdldE1hcENlbnRlcigpXG4gICAgICAgIHJldHVybiBwb3NpdGlvblxuICAgIH1cblxuICAgIGdldENoYXJhY3RlcigpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdhY3RvcicsXG4gICAgICAgICAgICBlbGVtZW50OiAnQCcsXG4gICAgICAgICAgICBjbHM6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgbGVmdDogY3NzTGVmdCxcbiAgICAgICAgICAgIHRvcDogY3NzVG9wLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgZ2V0QWN0aW9uKGZuTmFtZSwgYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2ZuTmFtZV0uYmluZCh0aGlzLCBhcmcpXG4gICAgfVxuXG4gICAgbW92ZShkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IHRoaXMudXBkYXRlR3JpZEluZGljZXModGhpcy5nZXRDaGFyYWN0ZXIoKSwgRElSRUNUSU9OU1tkaXJlY3Rpb25dKVxuICAgICAgICB0aGlzLnByaW50TG9jYWxTdGF0dXMoKVxuICAgICAgICB0aGlzLnJlbmRlcigpXG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmxvY2F0aW9uLngsXG4gICAgICAgICAgICB5OiB0aGlzLmxvY2F0aW9uLnlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnbW92ZWQtdG8nLCBwb3NpdGlvbilcbiAgICB9XG5cbiAgICBwcmludExvY2FsU3RhdHVzKCkge1xuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIGNvbnN0IGxvY2FsSXRlbSA9IHRoaXMuZ2V0TG9jYWxJdGVtKClcblxuICAgICAgICBpZiAobG9jYWxJdGVtKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxJdGVtLm1pbmluZyA9PT0gJ2VtcHR5Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ21pbmluZyBoYXMgYmVlbiBleGhhdXN0ZWQgZm9yIHRoaXMgcmVnaW9uJylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobG9jYWxJdGVtLm1pbmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ2EgbWluZXIgcHVsbHMgY29tcG91bmRzIGZyb20gdGhlIHJlZ2lvbicpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnZGlzcGxheS1pdGVtJywgbG9jYWxJdGVtLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMb2NhbEl0ZW0oKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIGxldCBsb2NhbEl0ZW0gPSBudWxsXG4gICAgICAgIHRoaXMubWFwSW5zdGFuY2UuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY2hhci54ICYmIGl0ZW0ueSA9PT0gY2hhci55KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxJdGVtID0gaXRlbVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBsb2NhbEl0ZW1cbiAgICB9XG5cbiAgICB0YWtlKCkge1xuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmdldExvY2FsSXRlbSgpXG5cbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGAke2xvY2FsSXRlbS5uYW1lfS0ke2xvY2FsSXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gKVxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBgJHtsb2NhbEl0ZW0ubmFtZX0gdGFrZW5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAndGhlcmUgaXMgbm90aGluZyBoZXJlIHdvcnRoIHRha2luZycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRJdGVtTG9jYXRpb24oaXRlbU5hbWUpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgY29uc3QgaXRzZWxmID0gdGhpcy5pbnZlbnRvcnkucmV0cmlldmVJdGVtKGl0ZW1OYW1lKVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IFtjaGFyLngsIGNoYXIueV1cbiAgICAgICAgcmV0dXJuIHsgaXRzZWxmLCBsb2NhdGlvbiB9XG4gICAgfVxuXG4gICAgbWluZSgpIHtcbiAgICAgICAgY29uc3QgbWluZXIgPSB0aGlzLmdldEl0ZW1Mb2NhdGlvbigncGFydGljbGUgbWluZXInKVxuICAgICAgICBpZiAobWluZXIuaXRzZWxmKSB7XG4gICAgICAgICAgICBtaW5lci5pdHNlbGYubWluZShtaW5lci5sb2NhdGlvbilcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgncmVtb3ZlLWludmVudG9yeScsIG1pbmVyLml0c2VsZilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ3lvdSBkbyBub3QgaGF2ZSBhbnkgcGFydGljbGUgbWluZXJzJylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBJbnZlbnRvcnlEaXNwbGF5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pbnZlbnRvcnknLCB0aGlzLnJlbmRlciwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktbWluZWQnLCB0aGlzLnJlbmRlck1pbmVkLCB0aGlzKVxuICAgIH1cblxuICAgIHJlbmRlcihpbnZlbnRvcnlPYmplY3QpIHtcbiAgICAgICAgbGV0IHN0ciA9IGludmVudG9yeU9iamVjdC5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpLmpvaW4oJzxicj4nKVxuICAgICAgICBzdHIgPSAnSU5WRU5UT1JZIDxicj48YnI+JyArIHN0clxuICAgICAgICB0aGlzLnNldChzdHIsICdpbnZlbnRvcnktc3RhdHVzJylcbiAgICB9XG5cbiAgICByZW5kZXJNaW5lZChtaW5lZEVsZW1lbnRzT2JqZWN0KSB7XG4gICAgICAgIGxldCBzdHIgPSB0aGlzLmNsZWFuSlNPTlN0cmluZyhKU09OLnN0cmluZ2lmeShtaW5lZEVsZW1lbnRzT2JqZWN0KSlcbiAgICAgICAgc3RyID0gJ1BBUlRJQ0xFUyBNSU5FRCA8YnI+PGJyPicgKyBzdHJcbiAgICAgICAgdGhpcy5zZXQoc3RyLCAnbWluaW5nLXN0YXR1cycpXG4gICAgfVxuXG4gICAgY2xlYW5KU09OU3RyaW5nKHN0cikge1xuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXCIvZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC86L2csICcgJylcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL3svZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC99L2csICcnKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvLC9nLCAnPGJyPicpXG5cbiAgICAgICAgcmV0dXJuIHN0clxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZWxlbWVudElELCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJRCkuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSW52ZW50b3J5RGlzcGxheVxuIiwiY2xhc3MgTGFuZHNjYXBlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB0aGlzLmZlYXR1cmVzKClcbiAgICAgICAgdGhpcy5iYXJlID0gdGhpcy5iYXJlKClcbiAgICB9XG5cbiAgICBmZWF0dXJlcygpIHtcbiAgICAgICAgY29uc3QgcGVyaW9kID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0aGUgYWlyIGlzIGNob2tlZCB3aXRoIGR1c3QsIHN0YXRpYywgd2lmaScsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjUsXG4gICAgICAgICAgICBjbHM6ICdwZXJpb2QnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBjaHJvbWU6IDE1LFxuICAgICAgICAgICAgICAgIGxlYWQ6IDMwLFxuICAgICAgICAgICAgICAgIHN0eXJvZm9hbTogMzAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBzaWxpY29uOiAxMCxcbiAgICAgICAgICAgICAgICBjZXJhbWljOiAxMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21tYSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcsJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnc3ByYXdsIG9mIHNtYXJ0IGhvbWVzLCBjdWwtZGUtc2FjcywgbGFuZXdheXMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI2LFxuICAgICAgICAgICAgY2xzOiAnY29tbWEnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBsYXRleDogMTUsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIGJvbmU6IDEwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdyYXZlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJ14nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhIHNoaW1tZXJpbmcgZmllbGQgb2Ygc29sYXIgcGFuZWxzLCBicm9rZW4gYW5kIGNvcnJvZGVkJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMixcbiAgICAgICAgICAgIGNsczogJ2dyYXZlJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBiZW56ZW5lOiAyMCxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2VyYW1pYzogMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwXG5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhc3RlcmlzayA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcqJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnaG9sbG93IHVzZXJzIGphY2sgaW4gYXQgdGhlIGRhdGFodWJzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMCxcbiAgICAgICAgICAgIGNsczogJ2FzdGVyaXNrJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBiZW56ZW5lOiAyMCxcbiAgICAgICAgICAgICAgICBzaWxpY29uOiAxMCxcbiAgICAgICAgICAgICAgICBjYXJib246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMFxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwZXJpb2QsIGNvbW1hLCBzZW1pY29sb24sIHNlbWljb2xvbiwgYXN0ZXJpc2ssIGFzdGVyaXNrLCBncmF2ZSwgZ3JhdmVdXG4gICAgfVxuXG4gICAgYmFyZSgpIHtcbiAgICAgICAgY29uc3QgYmFyZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmbmJzcDsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjb25jcmV0ZSBhbmQgdHdpc3RlZCByZWJhciBzdHJldGNoIHRvIHRoZSBob3Jpem9uJyxcbiAgICAgICAgICAgIGNsczogJ2JsYW5rJyxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTAsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBpcm9uOiAzMCxcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBib25lOiAxMCxcbiAgICAgICAgICAgICAgICBoeWRyb2NhcmJvbnM6IDE1LFxuICAgICAgICAgICAgICAgIHVyYW5pdW06IDEwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXJlXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYW5kc2NhcGVEYXRhXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IE1hcEdlbmVyYXRvciBmcm9tICcuL01hcEdlbmVyYXRvcidcblxuY2xhc3MgTWFwIHtcbiAgICBjb25zdHJ1Y3RvcihtYXBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgY29uc3RydWN0b3InLCBtYXBEYXRhKVxuXG4gICAgICAgIHRoaXMubWFwID0gbWFwRGF0YVxuICAgICAgICB0aGlzLmNvbCA9IE1hcC5nZXRDb2wobWFwRGF0YSlcbiAgICAgICAgdGhpcy5yb3cgPSBNYXAuZ2V0Um93KG1hcERhdGEpXG5cbiAgICAgICAgdGhpcy5pdGVtc09uTWFwID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDb2wobWFwRGF0YSkge1xuICAgICAgICByZXR1cm4gbWFwRGF0YS5sZW5ndGhcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Um93KG1hcERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1hcERhdGFbMF0ubGVuZ3RoXG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlKHsgY29sLCByb3cgfSkge1xuICAgICAgICBjb25zdCBtYXBHZW5lcmF0b3IgPSBuZXcgTWFwR2VuZXJhdG9yKClcblxuICAgICAgICByZXR1cm4gbWFwR2VuZXJhdG9yLmdlbmVyYXRlKHsgY29sLCByb3d9KVxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwXG4gICAgfVxuXG4gICAgZ2V0TWFwQ2VudGVyKCkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IodGhpcy5jb2wvMiksIE1hdGguZmxvb3IodGhpcy5yb3cvMildXG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tTWFwTG9jYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKSwgVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKV1cbiAgICB9XG5cbiAgICBzZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKSB7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLnNldE1hcCh0aGlzLm1hcClcbiAgICB9XG5cbiAgICBzZXRJdGVtcyhpdGVtcykge1xuICAgICAgICBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21NYXBMb2NhdGlvbiA9IHRoaXMuZ2V0UmFuZG9tTWFwTG9jYXRpb24oKVxuICAgICAgICAgICAgaXRlbS5zZXRPbk1hcCh0aGlzLm1hcCwgcmFuZG9tTWFwTG9jYXRpb24pXG4gICAgICAgICAgICBpdGVtLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKSAgLy8gbW92ZWQgY2hpbGRFbGVtZW50IGNyZWF0aW9uIG91dCBvZiAnc2V0T25NYXAnXG4gICAgICAgICAgICB0aGlzLnB1c2hJdGVtKGl0ZW0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVzaEl0ZW0oaXRlbSkge1xuICAgICAgICB0aGlzLml0ZW1zT25NYXAucHVzaChpdGVtKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgTGFuZHNjYXBlRGF0YSBmcm9tICcuL0xhbmRzY2FwZURhdGEnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5cblxuY2xhc3MgTWFwR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBnZW5lcmF0ZSh7IGNvbCwgcm93IH0pIHtcblxuICAgICAgICB0aGlzLmNvbCA9IGNvbFxuICAgICAgICB0aGlzLnJvdyA9IHJvd1xuXG4gICAgICAgIHRoaXMubGFuZHNjYXBlU2VlZHMgPSBuZXcgTGFuZHNjYXBlRGF0YSgpXG5cbiAgICAgICAgdGhpcy5tYWtlR3JpZCgpXG4gICAgICAgIHRoaXMuc2VlZCgpXG4gICAgICAgIHRoaXMuZ3JvdygpXG5cbiAgICAgICAgY29uc29sZS5sb2coJ21hcCBnZW5lcmF0ZWQnKVxuXG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRcbiAgICB9XG5cbiAgICBtYWtlR3JpZCgpIHtcbiAgICAgICAgdGhpcy5ncmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvdzsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWRbaV0gPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmNvbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld0NlbGwgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpXG4gICAgICAgICAgICAgICAgbmV3Q2VsbCA9IHRoaXMuYXNzaWduQ29vcmRpbmF0ZXMobmV3Q2VsbCwgaiwgaSlcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbaV0ucHVzaChuZXdDZWxsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXNzaWduQ29vcmRpbmF0ZXMoY2VsbCwgeENvb3JkLCB5Q29vcmQpIHtcbiAgICAgICAgY2VsbC54ID0geENvb3JkXG4gICAgICAgIGNlbGwueSA9IHlDb29yZFxuICAgICAgICByZXR1cm4gY2VsbFxuICAgfVxuXG4gICAgc2VlZCgpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tRWxlbWVudHMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKTsgaSsrKSB7XG4gICAgICAgICAgICByYW5kb21FbGVtZW50cy5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlcy5sZW5ndGgpXSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlZWRzID0gdGhpcy5nZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpXG4gICAgICAgIHRoaXMuc2VlZHMubWFwKHNlZWQgPT4gdGhpcy5ncmlkW3NlZWQueV1bc2VlZC54XSA9IHNlZWQpXG5cbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlTmV4dFNlZWRCYXRjaCgpXG4gICAgICAgICAgICBpZiAodGhpcy5vdXRPZlNlZWRzKCkpIG1hcFBvcHVsYXRlZCA9IHRydWVcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQmFkU2VlZHMoKVxuICAgICAgICAgICAgdGhpcy5wbGFudFNlZWRzKClcbiAgICAgICAgICAgIHRoaXMuaGFzVW5zZWVkZWRMb2NhdGlvbnMoKSA/IHRoaXMuc2VlZHMgPSB0aGlzLmdvb2RTZWVkcyA6IG1hcFBvcHVsYXRlZCA9IHRydWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlTmV4dFNlZWRCYXRjaCgpIHtcbiAgICAgICAgdGhpcy5uZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICB0aGlzLnNlZWRzLmZvckVhY2goKG9yaWdpbmFsU2VlZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFNlZWQgPSBvcmlnaW5hbFNlZWRcbiAgICAgICAgICAgIHRoaXMuZ2V0TmV3U2VlZCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBnZXROZXdTZWVkKCkge1xuICAgICAgIGZvciAobGV0IGtleSBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1NlZWQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9yaWdpbmFsU2VlZClcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRElSRUNUSU9OU1trZXldXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja1Byb2JhYmlsaXR5KHRoaXMubmV3U2VlZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5ld1NlZWRDb29yZGluYXRlcygpXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0R2VuU2VlZHMucHVzaCh0aGlzLm5ld1NlZWQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja1Byb2JhYmlsaXR5KG5ld1NlZWQpIHtcbiAgICAgICAgcmV0dXJuIFV0aWxpdHkucHJvYmFiaWxpdHkobmV3U2VlZC5wcm9iYWJpbGl0eSlcbiAgICB9XG5cbiAgICBjcmVhdGVOZXdTZWVkQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1NlZWQueCA9IHRoaXMub3JpZ2luYWxTZWVkLnggKyB0aGlzLmRpcmVjdGlvbltrZXldXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3knKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1NlZWQueSA9IHRoaXMub3JpZ2luYWxTZWVkLnkgKyB0aGlzLmRpcmVjdGlvbltrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG91dE9mU2VlZHMoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5uZXh0R2VuU2VlZHMubGVuZ3RoXG4gICAgfVxuXG4gICAgZmlsdGVyQmFkU2VlZHMoKSB7XG4gICAgICAgIHRoaXMuZ29vZFNlZWRzID0gW11cbiAgICAgICAgdGhpcy5uZXh0R2VuU2VlZHMuZm9yRWFjaCgoc2VlZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kU2VlZHMucHVzaCh0aGlzLmNoZWNrU2VlZChzZWVkKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBpZiAodGhpcy5pZk9mZk1hcChzZWVkKSkgcmV0dXJuIG51bGxcbiAgICAgICAgaWYgKHRoaXMuaXNBbHJlYWR5U2VlZGVkKHNlZWQpKSByZXR1cm4gbnVsbFxuICAgICAgICAvLyBpZiAodGhpcy5pc1dhaXRpbmdUb0JlU2VlZGVkKHNlZWQpKSByZXR1cm4gbnVsbFxuICAgICAgICByZXR1cm4gc2VlZFxuICAgIH1cblxuICAgIGlmT2ZmTWFwKHNlZWQpIHtcbiAgICAgICAgcmV0dXJuICEoKHNlZWQueCA8IHRoaXMuY29sICYmIHNlZWQueCA+PSAwKSAmJiAoc2VlZC55IDwgdGhpcy5yb3cgJiYgc2VlZC55ID49IDApKVxuICAgIH1cblxuICAgIGlzQWxyZWFkeVNlZWRlZChzZWVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRbc2VlZC55XVtzZWVkLnhdLmNscyAhPT0gJ2JsYW5rJ1xuICAgIH1cblxuXG4gICAgcGxhbnRTZWVkcygpIHtcbiAgICAgICAgdGhpcy5nb29kU2VlZHMuZm9yRWFjaCgoZ29vZFNlZWQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0uY2xzID09PSAnYmxhbmsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBoYXNVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5ncmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkuY2xzID09PSAnYmxhbmsnKSBjb3VudCsrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE1hcChtYXApIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgfVxuXG4gICAgZ2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdyaWRJbmRpY2VzWzBdXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdyaWRJbmRpY2VzWzFdXG5cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5tYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLm1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBcInlvdSd2ZSByZWFjaGVkIHRoZSBtYXAncyBlZGdlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uXG4gICAgfVxuXG4gICAgY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykge1xuICAgICAgICBsZXQgbG9jYXRpb25PbkdyaWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHggPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICBjb25zdCB5ID0gbmV3R3JpZEluZGljZXNbMF1cblxuICAgICAgICBpZiAodGhpcy5tYXBbeF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5tYXBbeF1beV1cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uT25HcmlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uT25HcmlkXG4gICAgfVxuXG4gICAgZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXQnKVxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgICBjb25zdCB3aWR0aCA9IFV0aWxpdHkuc3RyaW5nVG9OdW1iZXIoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSlcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSlcbiAgICAgICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9XG4gICAgfVxuXG4gICAgZ2V0Q1NTQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGNzcyA9IHRoaXMuZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKVxuICAgICAgICBjb25zdCBjc3NMZWZ0ID0gdGhpcy5ncmlkSW5kaWNlc1swXSAqIGNzcy5oZWlnaHRcbiAgICAgICAgY29uc3QgY3NzVG9wID0gdGhpcy5ncmlkSW5kaWNlc1sxXSAqIGNzcy53aWR0aFxuICAgICAgICByZXR1cm4geyBjc3NMZWZ0LCBjc3NUb3AgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBNb3ZlYWJsZVxuIiwiY2xhc3MgUmVuZGVyYWJsZSB7ICAvLyBnZW5lcmFsaXplZCByZW5kZXIgZnVuY3Rpb25zIGZvciBTY2VuZXJ5LCBDaGFyYWN0ZXJcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRMYXllcihsYXllcikge1xuICAgICAgICB0aGlzLmxheWVyID0gbGF5ZXJcbiAgICB9XG5cbiAgICBnZXRMYXllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJcbiAgICB9XG5cbiAgICByZW5kZXJTcGFuKHVuaXQpIHtcbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdC50b3AgJiYgdW5pdC5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7dW5pdC50b3B9cHg7IGxlZnQ6ICR7dW5pdC5sZWZ0fXB4YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ1bml0ICR7Y2xzfVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9zcGFuPmBcbiAgICB9XG5cbiAgICByZW5kZXJEaXYoaXRlbSkge1xuICAgICAgICBsZXQgZGl2ID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgZGl2ID0gaXRlbS5kaXZcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpdGVtLmVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS50b3AgJiYgaXRlbS5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7aXRlbS50b3B9cHg7IGxlZnQ6ICR7aXRlbS5sZWZ0fXB4OyBwb3NpdGlvbjogYWJzb2x1dGVgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ub2ZmTWFwKSB7XG4gICAgICAgICAgICBzdHlsZSArPSBgOyBkaXNwbGF5OiBub25lYFxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChpdGVtLm1pbmluZykge1xuICAgICAgICAgICAgY2FzZSAnZnVsbCc6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctZnVsbCAzcyBpbmZpbml0ZWBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnaGFsZic6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctaGFsZiAzcyBpbmZpbml0ZWBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgICAgICAgIHN0eWxlICs9IGA7IGFuaW1hdGlvbjogbWluaW5nLWVtcHR5IDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYDxkaXYgaWQ9XCIke2Rpdn1cIiBzdHlsZT1cIiR7c3R5bGV9XCI+JHtlbGVtZW50fTwvZGl2PmBcbiAgICB9XG5cbiAgICB1cGRhdGVTcGFuKGFjdG9yKSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5yZW5kZXJTcGFuKGFjdG9yKSlcbiAgICB9XG5cbiAgICB1cGRhdGVEaXYoaXRlbSkge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyRGl2KGl0ZW0pKVxuICAgIH1cblxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG4gICAgY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudChwYXJlbnRMYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50TGF5ZXJJZClcbiAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSAvLyBjcmVhdGVzIGRpdiBpZCB3aXRoaW4gZW5jbG9zaW5nIGRpdiAuLi5cbiAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlcmFibGVcbiIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4vUmVuZGVyYWJsZSdcblxuXG5jbGFzcyBTY2VuZXJ5IGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBTY2VuZXJ5LXNwZWNpZmljIHJlbmRlcmluZyBmdW5jdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLm1hcCA9IG1hcC5nZXRNYXAoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKClcbiAgICAgICAgY29uc29sZS5sb2coJ3NjZW5lcnkgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKCkge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5tYXAubWFwKGFyciA9PiB7IHJldHVybiBhcnIuc2xpY2UoKSB9KVxuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMuY3JlYXRlTGF5ZXIoZ3JpZCkpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVMYXllcihncmlkKSB7XG4gICAgICAgIGNvbnN0IHNjZW5lcnlHcmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3dJdGVtcyA9IGdyaWRbaV1cbiAgICAgICAgICAgIGxldCByb3cgPSAnJyAgLy8gcG9zc2libHkgbWFrZSBlYWNoIHJvdyBhIHRhYmxlP1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyArPSB0aGlzLnJlbmRlclNwYW4ocm93SXRlbXNbaV0pIC8vIGFkZCByZW5kZXJlZCBpdGVtcyB0byB0aGUgZ3JpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NlbmVyeUdyaWQucHVzaChyb3cpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjZW5lcnlHcmlkXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKCkge1xuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBjb25zdCBncmlkVG9IVE1MID0gbGF5ZXIuam9pbignPGJyIC8+JykgIC8vIHVzaW5nIEhUTUwgYnJlYWtzIGZvciBub3dcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZHNjYXBlLWxheWVyJylcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gZ3JpZFRvSFRNTFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTY2VuZXJ5XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLnVwZGF0ZSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktaXRlbScsIHRoaXMuZGlzcGxheUl0ZW0sIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdzdGF0dXMnLCB0aGlzLmRlZmF1bHQsIHRoaXMpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGJlZ2luc1dpdGhWb3dlbCh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TGV0dGVyID0gdGV4dFswXVxuICAgICAgICBjb25zdCB2b3dlbHMgPSBbJ2EnLCAnZScsICdpJywgJ28nLCAndSddXG4gICAgICAgIGxldCBiZWdpbnNXaXRoVm93ZWwgPSBmYWxzZVxuICAgICAgICB2b3dlbHMuZm9yRWFjaCh2b3dlbCA9PiB7XG4gICAgICAgICAgICBpZiAoZmlyc3RMZXR0ZXIgPT09IHZvd2VsKSB7XG4gICAgICAgICAgICAgICAgYmVnaW5zV2l0aFZvd2VsID0gdHJ1ZVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBiZWdpbnNXaXRoVm93ZWxcbiAgICB9XG5cbiAgICBkaXNwbGF5SXRlbShpdGVtTmFtZSkge1xuICAgICAgICBjb25zdCBiZWdpbnNXaXRoVm93ZWwgPSB0aGlzLmJlZ2luc1dpdGhWb3dlbChpdGVtTmFtZSlcbiAgICAgICAgbGV0IHRleHQgPSAnJ1xuICAgICAgICBpZiAoYmVnaW5zV2l0aFZvd2VsKSB7XG4gICAgICAgICAgICB0ZXh0ID0gYHlvdSBzZWUgYW4gJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhICR7aXRlbU5hbWV9IGhlcmVgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXQodGV4dCwgMTApXG4gICAgfVxuXG4gICAgZGVmYXVsdCh0ZXh0KSB7XG4gICAgICAgIHRoaXMuc2V0KHRleHQsIDEwKVxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZGVsYXk9MCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1xuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIFVzZXJJbnB1dCB7XG4gICAgY29uc3RydWN0b3Ioa2V5QWN0aW9uTWFwKSB7XG4gICAgICAgIHRoaXMua2V5QWN0aW9uTWFwID0ga2V5QWN0aW9uTWFwXG5cbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy50cnlBY3Rpb25Gb3JFdmVudC5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgdHJ5QWN0aW9uRm9yRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFVdGlsaXR5LmNvbnRhaW5zKHRoaXMua2V5QWN0aW9uTWFwLCBldmVudC5rZXlDb2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYG5vdCBhIHZhbGlkIGtleWNvZGU6ICR7ZXZlbnQua2V5Q29kZX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXBbZXZlbnQua2V5Q29kZV0oKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJJbnB1dFxuIiwibGV0IGlkID0gMFxuXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICAgIGlkID0gaWQgKyAxXG4gICAgcmV0dXJuIGlkXG59XG5cbmNsYXNzIFV0aWxpdHkge1xuICAgIHN0YXRpYyBjb250YWlucyhvYmosIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmluZGV4T2YoU3RyaW5nKHByb3BlcnR5KSkgIT09IC0xXG4gICAgfVxuXG4gICAgc3RhdGljIHN0cmluZ1RvTnVtYmVyKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nLm1hdGNoKC9cXGQrLylbMF1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9taXplKG11bHQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG11bHQpXG4gICAgfVxuXG4gICAgc3RhdGljIElkKCkge1xuICAgICAgICByZXR1cm4gZ2VuZXJhdGVJZCgpXG4gICAgfVxuXG4gICAgc3RhdGljIHByb2JhYmlsaXR5KHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgY29uc3QgcHJvYmFiaWxpdHlBcnJheSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2godHJ1ZSlcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMCAtIHBlcmNlbnRhZ2U7IGkrKykge1xuICAgICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKGZhbHNlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9iYWJpbGl0eUFycmF5W1V0aWxpdHkucmFuZG9taXplKDEwMCldXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxpdHlcbiIsImNsYXNzIEV2ZW50TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzTGlzdCA9IFtdICAgICAgICAvLyBjcmVhdGUgYXJyYXkgb2YgZXZlbnRzXG4gICAgfVxuXG4gICAgc3Vic2NyaWJlKGV2ZW50LCBmbiwgdGhpc1ZhbHVlLCBvbmNlPWZhbHNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpc1ZhbHVlID09PSAndW5kZWZpbmVkJykgeyAgIC8vIGlmIG5vIHRoaXNWYWx1ZSBwcm92aWRlZCwgYmluZHMgdGhlIGZuIHRvIHRoZSBmbj8/XG4gICAgICAgICAgICB0aGlzVmFsdWUgPSBmblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudHNMaXN0LnB1c2goeyAgICAgIC8vIGNyZWF0ZSBvYmplY3RzIGxpbmtpbmcgZXZlbnRzICsgZnVuY3Rpb25zIHRvIHBlcmZvcm1cbiAgICAgICAgICAgIGV2ZW50OiBldmVudCwgICAgICAgICAgIC8vIHB1c2ggZW0gdG8gdGhlIGFycmF5XG4gICAgICAgICAgICBmbjogZm4sXG4gICAgICAgICAgICBvbmNlOiBvbmNlLFxuICAgICAgICAgICAgdGhpc1ZhbHVlOiB0aGlzVmFsdWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyB1bnN1YnNjcmliZShldmVudCkge1xuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgLy8gICAgICAgICAgICAgYnJlYWtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIHB1Ymxpc2goZXZlbnQsIGFyZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRoaXNWYWx1ZSwgZm4sIG9uY2UgfSA9IHRoaXMuZXZlbnRzTGlzdFtpXVxuICAgICAgICAgICAgICAgIGZuLmNhbGwodGhpc1ZhbHVlLCBhcmcpXG4gICAgICAgICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNMaXN0LnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEV2ZW50c0xpc3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50c0xpc3RcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50TWFuYWdlcigpXG4iLCJpbXBvcnQgTWFwIGZyb20gJy4vTWFwJ1xuaW1wb3J0IFNjZW5lcnkgZnJvbSAnLi9TY2VuZXJ5J1xuaW1wb3J0IENoYXJhY3RlciBmcm9tICcuL0NoYXJhY3RlcidcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4vU3RhdHVzJ1xuaW1wb3J0IFVzZXJJbnB1dCBmcm9tICcuL1VzZXJJbnB1dCdcbmltcG9ydCBCbHVlcHJpbnRzIGZyb20gJy4vQmx1ZXByaW50cydcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5pbXBvcnQgeyBnZW5lcmF0ZUl0ZW1zIH0gZnJvbSAnLi9pdGVtcydcbmltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlJ1xuaW1wb3J0IEludmVudG9yeURpc3BsYXkgZnJvbSAnLi9JbnZlbnRvcnlEaXNwbGF5J1xuaW1wb3J0IG1pbmluZ0ludmVudG9yeSBmcm9tICcuL21pbmluZ0ludmVudG9yeSdcblxuY29uc3QgQ09MID0gNjBcbmNvbnN0IFJPVyA9IDYwXG5jb25zdCBJVEVNX05VTSA9IDVcblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vXG5cbiAgICAgICAgdGhpcy5pbml0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdEdhbWUoKSB7XG4gICAgICAgIGxldCBzZXR0aW5nc1xuXG4gICAgICAgIGlmICh0aGlzLmhhc0dhbWVJblByb2dyZXNzKCkpIHtcbiAgICAgICAgICAgIHNldHRpbmdzID0gdGhpcy5yZXN1bWVTZXR0aW5ncygpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRoaXMuZ2VuZXJhdGVTZXR0aW5ncygpXG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IG1vdmVkID0gKGxvY2F0aW9uKSA9PiB7Y29uc29sZS5sb2coJ2xvY2F0aW9uJywgbG9jYXRpb24pfVxuICAgICAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKCdtb3ZlZC10bycsIG1vdmVkKVxuXG4gICAgICAgIHRoaXMubG9hZFNldHRpbmdzKHNldHRpbmdzKVxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpXG4gICAgfVxuXG4gICAgaGFzR2FtZUluUHJvZ3Jlc3MoKSB7XG4gICAgICAgIHJldHVybiBzdG9yZS5oYXMoJ21hcCcpXG4gICAgfVxuXG4gICAgcmVzdW1lU2V0dGluZ3MoKSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0ge1xuICAgICAgICAgICAgbWFwRGF0YTogc3RvcmUuZ2V0KCdtYXAnKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldHRpbmdzXG4gICAgfVxuXG4gICAgZ2VuZXJhdGVTZXR0aW5ncygpIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7fVxuXG4gICAgICAgIHNldHRpbmdzLm1hcERhdGEgPSBNYXAuZ2VuZXJhdGUoeyBjb2w6IENPTCwgcm93OiAgUk9XIH0pXG5cbiAgICAgICAgc3RvcmUuc2V0KCdtYXAnLCBzZXR0aW5ncy5tYXBEYXRhKVxuXG4gICAgICAgIHJldHVybiBzZXR0aW5nc1xuICAgIH1cblxuICAgIGxvYWRTZXR0aW5ncyhzZXR0aW5ncykge1xuICAgICAgICBjb25zdCBibHVlcHJpbnQgPSB0aGlzLmJsdWVwcmludCA9IEJsdWVwcmludHMucmFuZG9tKClcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zID0gZ2VuZXJhdGVJdGVtcyhJVEVNX05VTSlcblxuICAgICAgICBjb25zdCBzdGF0dXMgPSB0aGlzLnN0YXR1cyA9IG5ldyBTdGF0dXMoKVxuICAgICAgICBjb25zdCBpbnZlbnRvcnlEaXNwbGF5ID0gdGhpcy5pbnZlbnRvcnlEaXNwbGF5ID0gbmV3IEludmVudG9yeURpc3BsYXkoKVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IHRoaXMubWFwID0gbmV3IE1hcChzZXR0aW5ncy5tYXBEYXRhKVxuICAgICAgICBjb25zdCBzY2VuZXJ5ID0gdGhpcy5zY2VuZXJ5ID0gbmV3IFNjZW5lcnkobWFwKVxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSB0aGlzLmNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIobWFwKVxuXG4gICAgICAgIG1hcC5zZXRJdGVtcyhpdGVtcylcbiAgICAgICAgbWFwLnNldENoYXJhY3RlcihjaGFyYWN0ZXIpXG5cbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnlcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkuYWRkKGJsdWVwcmludClcbiAgICAgICAgdGhpcy5taW5pbmdJbnZlbnRvcnkgPSBtaW5pbmdJbnZlbnRvcnlcblxuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy5pbml0VXNlcklucHV0KGNoYXJhY3RlcilcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc2V0IGdhbWUhJylcblxuICAgICAgICBldmVudE1hbmFnZXIucHVibGlzaCgncmVzZXQnKVxuXG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgIH1cblxuICAgIGluaXRVc2VySW5wdXQoY2hhcmFjdGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgVXNlcklucHV0KHtcbiAgICAgICAgICAgICc3OCc6IHRoaXMucmVzZXQuYmluZCh0aGlzKSwgLy8gKHIpIHJlc2V0IG1hcFxuICAgICAgICAgICAgJzM4JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdub3J0aCcpLFxuICAgICAgICAgICAgJzM3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICd3ZXN0JyksXG4gICAgICAgICAgICAnMzknOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ2Vhc3QnKSxcbiAgICAgICAgICAgICc0MCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnc291dGgnKSxcbiAgICAgICAgICAgICc4NCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ3Rha2UnKSwgLy8gKHQpYWtlIGl0ZW1cbiAgICAgICAgICAgICc3Nyc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21pbmUnKSAvLyBkZXBsb3kgcGFydGljbGUgKG0paW5lclxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KCd5b3Ugd2FrZSB1cCcpXG4gICAgICAgIHRoaXMuc3RhdHVzLnNldChgeW91IGFyZSBjYXJyeWluZyAke3RoaXMuYmx1ZXByaW50Lm5hbWV9YCwgNDAwMClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEdhbWUoKTtcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIEludmVudG9yeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMgPSBbXVxuXG4gICAgICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoJ2FkZC1pbnZlbnRvcnknLCB0aGlzLmFkZCwgdGhpcylcbiAgICAgICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMucmVtb3ZlLCB0aGlzKVxuICAgICAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKCdyZXNldCcsIHRoaXMuY2xlYXIsIHRoaXMpXG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMgPSBbXVxuICAgIH1cblxuICAgIGFkZChpdGVtKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMucHVzaChpdGVtKVxuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfVxuXG4gICAgcmVtb3ZlKGl0ZW0pIHtcbiAgICAgICAgY29uc3QgdGhlSXRlbSA9IGl0ZW1cbiAgICAgICAgdGhpcy5jb250ZW50cy5mb3JFYWNoKChpdGVtLCBpLCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSB0aGVJdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50cy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW52ZW50b3J5IGl0ZW0gcmVtb3ZlZCcpXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICAgICAgfX0pXG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBldmVudE1hbmFnZXIucHVibGlzaCgnZGlzcGxheS1pbnZlbnRvcnknLCB0aGlzLmNvbnRlbnRzKVxuICAgIH1cblxuICAgIHJldHJpZXZlSXRlbShpdGVtTmFtZSkge1xuICAgICAgICBsZXQgcmV0cmlldmVkID0gbnVsbFxuICAgICAgICB0aGlzLmNvbnRlbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBpdGVtTmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHJpZXZlZCA9IGl0ZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHJldHJpZXZlZFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEludmVudG9yeVxuIiwiaW1wb3J0IE1vdmVhYmxlIGZyb20gJ2pzL01vdmVhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnanMvZXZlbnRNYW5hZ2VyJ1xuXG5cbi8vIGNvbnN0IElURU1TID0ge1xuLy8gICAgIG1pbmVyOiB7XG4vLyAgICAgICAgIG5hbWU6ICdwYXJ0aWNsZSBtaW5lcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJ3wnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ21pbmVzLCBkaXZpZGVzLCBhbmQgc3RvcmVzIGFtYmllbnQgY2hlbWljYWwgZWxlbWVudHMgYW5kIGxhcmdlciBjb21wb3VuZHMgZm91bmQgd2l0aGluIGEgMTAwIG1ldGVyIHJhZGl1cy4gOTclIGFjY3VyYWN5IHJhdGUuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1taW5lcidcbi8vICAgICB9LFxuLy8gICAgIHBhcnNlcjoge1xuLy8gICAgICAgICBuYW1lOiAnbm9pc2UgcGFyc2VyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnPycsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAncHJvdG90eXBlLiBwYXJzZXMgYXRtb3NwaGVyaWMgZGF0YSBmb3IgbGF0ZW50IGluZm9ybWF0aW9uLiBzaWduYWwtdG8tbm9pc2UgcmF0aW8gbm90IGd1YXJhbnRlZWQuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1wYXJzZXInXG4vLyAgICAgfSxcbi8vICAgICBpbnRlcmZhY2U6IHtcbi8vICAgICAgICAgbmFtZTogJ3BzaW9uaWMgaW50ZXJmYWNlJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnJicsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiBgY29ubmVjdHMgc2VhbWxlc3NseSB0byBhIHN0YW5kYXJkLWlzc3VlIGJpb3BvcnQuIGZhY2lsaXRhdGVzIHN1bmRyeSBpbnRlcmFjdGlvbnMgcGVyZm9ybWVkIHZpYSBQU0ktTkVULmAsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0taW50ZXJmYWNlJ1xuLy8gICAgIH0sXG4vLyAgICAgcHJpbnRlcjoge1xuLy8gICAgICAgICBuYW1lOiAnbW9sZWN1bGFyIHByaW50ZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICcjJyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdnZW5lcmF0ZXMgb2JqZWN0cyBhY2NvcmRpbmcgdG8gYSBibHVlcHJpbnQuIG1vbGVjdWxlcyBub3QgaW5jbHVkZWQuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1wcmludGVyJ1xuLy8gICAgIH1cbi8vIH1cblxuY2xhc3MgSXRlbSBleHRlbmRzIE1vdmVhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcihpdGVtQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICAvLyBtZXJnZSBpbiBjb25maWcgcHJvcGVydGllc1xuICAgICAgICAvLyBjb25zdCB0YXJnZXQgPSBPYmplY3QuYXNzaWduKHRoaXMsIGl0ZW1Db25maWcpXG5cbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuaWRlbnRpdHlOdW1iZXIgPSBVdGlsaXR5LklkKClcbiAgICAgICAgdGhpcy50eXBlID0gJ2l0ZW0nXG4gICAgICAgIHRoaXMub2ZmTWFwID0gZmFsc2VcbiAgICAgICAgLy8gdGhpcy5pbkludmVudG9yeSA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE9uTWFwKG1hcCwgbG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXRNYXAobWFwKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyhsb2NhdGlvbilcbiAgICAgICAgdGhpcy5zZXRDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMuc2V0R3JpZEluZGljZXMoKVxuICAgICAgICB0aGlzLnNldERpdih0aGlzLmdldElkKCkpXG4gICAgICAgIHRoaXMudXBkYXRlRGl2KHRoaXMpXG5cbi8vIG1vdmVkIHRoaXMgb3V0IHNvIHdlIGFyZSBub3QgY3JlYXRpbmcgY2hpbGRyZW4gZWFjaCB0aW1lIHdlIHdhbnQgdG8gcGxhY2Ugb24gbWFwXG4gICAgICAgIC8vIHRoaXMuY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudCgnaXRlbS1sYXllcicpXG4gICAgfVxuXG4gICAgZ2V0SWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5TnVtYmVyXG4gICAgfVxuXG4gICAgc2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgY3NzTGVmdCwgY3NzVG9wIH0gPSB0aGlzLmdldENTU0Nvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5sZWZ0ID0gY3NzTGVmdFxuICAgICAgICB0aGlzLnRvcCA9IGNzc1RvcFxuICAgIH1cblxuICAgIHNldEdyaWRJbmRpY2VzKCkge1xuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuXG4gICAgICAgIHRoaXMueCA9IHhcbiAgICAgICAgdGhpcy55ID0geVxuICAgIH1cblxuICAgIHNldERpdihpZGVudGl0eU51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuZGl2U2V0KSB7XG4gICAgICAgICAgICB0aGlzLmRpdiA9IHRoaXMuZGl2ICsgaWRlbnRpdHlOdW1iZXJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpdlNldCA9IHRydWVcbiAgICB9XG5cblxuICAgIC8vIHNwZWNpZmljIHRvIGl0ZW0gZHJhd2luZzogdXNlIG91dGVySFRNTFxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwub3V0ZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG5cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2l0ZW0nKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURpdih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25UYWtlKCkge1xuICAgICAgICB0aGlzLnggPSBudWxsXG4gICAgICAgIHRoaXMueSA9IG51bGxcbiAgICAgICAgdGhpcy5vZmZNYXAgPSB0cnVlIC8vIGNoYW5nZXMgY3NzIGRpc3BsYXkgdG8gJ25vbmUnXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3BhcnRpY2xlIG1pbmVyJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbHRNaW5pbmcoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1pbnZlbnRvcnknLCB0aGlzKVxuICAgICAgICAvLyB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMub25Ecm9wLCB0aGlzKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuICAgIH1cblxuICAgIG9uRHJvcCgpIHtcblxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHt0aGlzLm5hbWV9LSR7dGhpcy5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLm9uVGFrZSwgdGhpcywgdHJ1ZSlcbiAgICAvLyAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLCB0aGlzLmRpdilcblxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtXG4iLCJpbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuXG5jbGFzcyBQYXJ0aWNsZU1pbmVyIGV4dGVuZHMgSXRlbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5pbml0U2V0dGluZ3MoKVxuICAgIH1cblxuICAgIGluaXRTZXR0aW5ncygpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gJ3BhcnRpY2xlIG1pbmVyJ1xuICAgICAgICB0aGlzLnR5cGUgPSAnaXRlbSdcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJ3wnXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSAnbWluZXMsIGRpdmlkZXMsIGFuZCBzdG9yZXMgYW1iaWVudCBjaGVtaWNhbCBlbGVtZW50cyBhbmQgbGFyZ2VyIGNvbXBvdW5kcyBmb3VuZCB3aXRoaW4gYSAxMDAgbWV0ZXIgcmFkaXVzLiA5NyUgYWNjdXJhY3kgcmF0ZS4nXG4gICAgICAgIHRoaXMuZGl2ID0gJ2l0ZW0tbWluZXInXG4gICAgICAgIC8vIG11c3Qgc3Vic2NyaWJlIHRoZSBpdGVtIGRpcmVjdGx5LCBub3Qgb24gdGhlIGFic3RyYWN0IGNsYXNzXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke3RoaXMubmFtZX0tJHt0aGlzLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMub25UYWtlLCB0aGlzKVxuXG4gICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXMgPSB7XG4gICAgICAgICAgICBJRDogdGhpcy5pZGVudGl0eU51bWJlclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWluZShsb2NhdGlvbikge1xuXG4gICAgICAgIHRoaXMubG9jYWxlID0gdGhpcy5tYXBbbG9jYXRpb25bMV1dW2xvY2F0aW9uWzBdXVxuICAgICAgICB0aGlzLnNldE1pbmluZ0NvbmZpZygpXG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHJhdGlvcyBvbmNlLCByYXRoZXIgdGhhbiB3IGV2ZXJ5IGludGVydmFsXG4gICAgICAgIHRoaXMuZGV0ZXJtaW5lUGFydGljbGVSYXRpb3MoKVxuICAgICAgICB0aGlzLmNoZWNrUGFydGljbGVBbW91bnRzKClcbiAgICAgICAgdGhpcy5jYW5jZWxsYXRpb25LZXkgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja1BhcnRpY2xlQW1vdW50cygpXG4gICAgICAgIH0sIDMwMDApXG5cbiAgICAgICAgdGhpcy5zZXRPbk1hcCh0aGlzLm1hcCwgbG9jYXRpb24pXG4gICAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG5cbiAgICBzZXRNaW5pbmdDb25maWcoKSB7XG4gICAgICAgIHRoaXMub2ZmTWFwID0gZmFsc2VcbiAgICAgICAgaWYgKCF0aGlzLm1pbmluZykge1xuICAgICAgICAgICAgdGhpcy5taW5pbmcgPSAnZnVsbCdcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRldGVybWluZVBhcnRpY2xlUmF0aW9zKCkge1xuICAgICAgICB0aGlzLmFsbFBhcnRpY2xlcyA9IFtdXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMubG9jYWxlLnBhcnRpY2xlcykuZm9yRWFjaChwYXJ0aWNsZSA9PiB7XG4gICAgICAgICAgICBsZXQgbnVtYmVyT2ZQYXJ0aWNsZXMgPSB0aGlzLmxvY2FsZS5wYXJ0aWNsZXNbcGFydGljbGVdXG4gICAgICAgICAgICB3aGlsZSAobnVtYmVyT2ZQYXJ0aWNsZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFsbFBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKVxuICAgICAgICAgICAgICAgIG51bWJlck9mUGFydGljbGVzLS1cbiAgICAgICAgfX0pXG4gICAgfVxuXG5cbiAgICBleHRyYWN0UGFydGljbGVzKCkge1xuICAgICAgICBjb25zdCByYW5kb21QYXJ0aWNsZSA9IHRoaXMuYWxsUGFydGljbGVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMuYWxsUGFydGljbGVzLmxlbmd0aCldXG4gICAgICAgIGlmICghdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0pIHtcbiAgICAgICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXNbcmFuZG9tUGFydGljbGVdID0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0rK1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1pbmVkT2JqID0gdGhpcy5taW5lZFBhcnRpY2xlc1xuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1taW5lZCcsIG1pbmVkT2JqKVxuICAgIH1cblxuXG5cbiAgICBjaGVja1BhcnRpY2xlQW1vdW50cygpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbmcgPSAnZW1wdHknXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50ID49ICh0aGlzLmxvY2FsZS5tYXhQYXJ0aWNsZXMgLyAyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWluaW5nID0gJ2Z1bGwnXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQtLVxuICAgICAgICAgICAgICAgIHRoaXMuZXh0cmFjdFBhcnRpY2xlcygpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50IDwgKHRoaXMubG9jYWxlLm1heFBhcnRpY2xlcyAvIDIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbmcgPSAnaGFsZidcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudC0tXG4gICAgICAgICAgICAgICAgdGhpcy5leHRyYWN0UGFydGljbGVzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG5cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVEaXYodGhpcylcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIodGhpcy5kaXYpXG4gICAgfVxuXG5cbiAgICBoYWx0TWluaW5nKCkge1xuICAgICAgICAvLyB0aGlzLm1pbmluZyA9IGZhbHNlXG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuY2FuY2VsbGF0aW9uS2V5KVxuICAgIH1cblxuXG5cblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhcnRpY2xlTWluZXJcbiIsImltcG9ydCBQYXJ0aWNsZU1pbmVyIGZyb20gJy4vUGFydGljbGVNaW5lcidcbmltcG9ydCBVdGlsaXR5IGZyb20gJ2pzL1V0aWxpdHknXG5pbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nXG5cbmNvbnN0IElURU1TID0gW1xuICAgIFBhcnRpY2xlTWluZXJcbl1cblxuZnVuY3Rpb24gcmFuZG9tSXRlbSgpIHtcbiAgICByZXR1cm4gbmV3IElURU1TW1V0aWxpdHkucmFuZG9taXplKElURU1TLmxlbmd0aCldXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSXRlbXMobnVtYmVyPTEpIHtcbiAgICBjb25zdCBpdGVtcyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXI7IGkrKykge1xuICAgICAgICBpdGVtcy5wdXNoKHJhbmRvbUl0ZW0oKSlcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1zXG59XG5cblxuZXhwb3J0IHtcbiAgICBnZW5lcmF0ZUl0ZW1zXG59XG4iLCJcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIE1pbmluZ0ludmVudG9yeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2FkZC1taW5lZCcsIHRoaXMuYWRkLCB0aGlzKVxuICAgICAgICB0aGlzLnN0b3JhZ2UgPSB7fVxuICAgICAgICB0aGlzLnN0YXRlID0ge31cbiAgICB9XG5cbiAgICBhZGQoY3VycmVudCkge1xuICAgICAgICAvLyBpZiBzdGF0ZSBvYmplY3QgZG9lc24ndCBleGlzdCwgYWRkIGFsbCBwYXJ0aWNsZXMgdG8gc3RvcmFnZVxuICAgICAgICBpZiAoIXRoaXMuc3RhdGVbY3VycmVudC5JRF0pIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGUoY3VycmVudClcbiAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50U3RvcmFnZSh0aGlzLnN0cmlwSUQoY3VycmVudCkpXG5cbiAgICAgICAgLy8gaWYgaXQgZG9lcyBleGlzdCwgY2hlY2sgY3VyciB2cyBzdGF0ZSBhbmQgYWRkIG9ubHkgdGhlIHJpZ2h0IHBhcnRpY2xlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnRTdG9yYWdlKHRoaXMuc3RyaXBJRCh0aGlzLmNoZWNrU3RhdGUoY3VycmVudCkpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZShjdXJyZW50KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlzcGxheWFibGVQYXJ0aWNsZXMgPSB0aGlzLnN0b3JhZ2VcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LW1pbmVkJywgZGlzcGxheWFibGVQYXJ0aWNsZXMpXG59XG5cbiAgICBjaGVja1N0YXRlKGN1cnJlbnQpIHtcbiAgICAgICAgY29uc3QgY2hlY2tlZCA9IHt9XG4gICAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnQpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmICghY2hlY2tlZFtrZXldKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tlZFtrZXldID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlW2N1cnJlbnQuSURdW2tleV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlW2N1cnJlbnQuSURdW2tleV0gPSAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGVja2VkW2tleV0gPSBjdXJyZW50W2tleV0gLSB0aGlzLnN0YXRlW2N1cnJlbnQuSURdW2tleV1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGNoZWNrZWRcbiAgICB9XG5cbiAgICBpbmNyZW1lbnRTdG9yYWdlKHBhcnRpY2xlcykge1xuICAgICAgICBPYmplY3Qua2V5cyhwYXJ0aWNsZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdG9yYWdlW2tleV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JhZ2Vba2V5XSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZVtrZXldICs9IHBhcnRpY2xlc1trZXldXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdXBkYXRlU3RhdGUoY3VycmVudCkge1xuICAgICAgICB0aGlzLnN0YXRlW2N1cnJlbnQuSURdID0gT2JqZWN0LmFzc2lnbih7fSwgY3VycmVudClcbiAgICB9XG5cbiAgICBzdHJpcElEKGN1cnJlbnQpIHtcbiAgICAgICAgY29uc3QgcGFydGljbGVzID0ge31cbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSAhPT0gJ0lEJykge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlc1trZXldID0gY3VycmVudFtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwYXJ0aWNsZXNcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNaW5pbmdJbnZlbnRvcnlcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGxvY2Fsc3RvcmFnZSwgc2F2aW5nIGRpc2FibGVkJylcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydCgnc2F2aW5nIGRpc2FibGVkJylcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoJ3Jlc2V0JywgdGhpcy5jbGVhciwgdGhpcylcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlLmNsZWFyKClcbiAgICB9XG5cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAodGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KSAhPT0gbnVsbClcbiAgICB9XG5cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RvcmUuc2V0Jywga2V5KVxuXG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKVxuICAgIH1cblxuICAgIGdldChrZXkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3JlLmdldCcsIGtleSlcblxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU3RvcmUoKVxuIl19
