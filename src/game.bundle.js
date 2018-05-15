(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _game = require('./js/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.game = _game2.default;

},{"./js/game":17}],2:[function(require,module,exports){
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
        type: 'blueprint',
        description: '',
        abilities: '',
        requirements: {
            synthetics: 70,
            organics: 20,
            silicon: 10
        }
    },
    retinalDisplay: {
        name: 'retinal display (blueprint)',
        type: 'blueprint',
        description: '',
        abilities: '',
        requirements: {
            metals: 20,
            synthetics: 20,
            organics: 10,
            glass: 30,
            silicon: 20
        }
    },
    prostheticArm: {
        name: 'prosthetic arm (blueprint)',
        type: 'blueprint',
        description: '',
        abilities: '',
        requirements: {
            metals: 80,
            synthetics: 10,
            uranium: 10
        }
    }
};

var Blueprint = function () {
    function Blueprint(randomBlueprint) {
        _classCallCheck(this, Blueprint);

        this.name = randomBlueprint.name;
        this.type = randomBlueprint.type;
        this.description = randomBlueprint.description;
        this.abilities = randomBlueprint.abilities;
        this.requirements = randomBlueprint.requirements;
    }

    _createClass(Blueprint, null, [{
        key: 'random',
        value: function random() {
            var blueprintValues = Object.values(blueprintData);
            var index = _Utility2.default.randomize(blueprintValues.length);

            var randomBlueprint = blueprintValues[index];

            return new Blueprint(randomBlueprint);
        }
    }]);

    return Blueprint;
}();

exports.default = Blueprint;

},{"./Utility":15}],3:[function(require,module,exports){
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
        _this.EM = _eventManager2.default;
        _this.inventory = _inventory2.default.contents;

        var position = void 0;
        if (initialPosition) {
            position = initialPosition;
        } else {
            position = mapInstance.getMapCenter();
        }

        _this.setInitialGridIndices(position);
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
        key: 'getPosition',
        value: function getPosition() {
            return this.gridIndices;
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
            var localItem = this.localItem();

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
        key: 'localItem',
        value: function localItem() {
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
            var localItem = this.localItem();

            if (localItem) {
                this.EM.publish(localItem.name + '-' + localItem.identityNumber + ' taken');
                this.EM.publish('status', localItem.name + ' taken');
            } else {
                this.EM.publish('status', 'there is nothing here worth taking');
            }
        }

        // checkInventory() {
        //     const carrying = this.inventory.map(item => item.name).join(' | ')
        //     const text = `you are carrying: ${carrying}`
        //     this.EM.publish('status', text)
        // }

    }, {
        key: 'findInventoryItemByNameOrType',
        value: function findInventoryItemByNameOrType(itemName) {
            var foundItem = null;
            this.inventory.forEach(function (item) {
                if (item.name === itemName) {
                    foundItem = item;
                } else if (item.type === itemName) {
                    foundItem = item;
                }
            });
            return foundItem;
        }
    }, {
        key: 'getItemLocation',
        value: function getItemLocation(itemName) {
            var char = this.getCharacter();
            var itself = this.findInventoryItemByNameOrType(itemName);
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
    }, {
        key: 'print',
        value: function print() {
            var printer = this.findInventoryItemByNameOrType('molecular printer');
            var blueprint = this.findInventoryItemByNameOrType('blueprint');

            if (printer) {
                printer.print(blueprint);
            }
        }
    }]);

    return Character;
}(_Moveable3.default);

exports.default = Character;

},{"./Constants":4,"./Moveable":9,"./eventManager":16,"./inventory":18}],4:[function(require,module,exports){
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

},{"./eventManager":16}],6:[function(require,module,exports){
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

},{"./MapGenerator":8,"./Utility":15,"./eventManager":16}],8:[function(require,module,exports){
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

            console.log('generating map');
            this.col = col;
            this.row = row;

            this.landscapeSeeds = new _LandscapeData2.default();
            var grid = this.makeGrid();
            var seededGrid = this.seed(grid);
            this.seededGrid = seededGrid;
            this.grow();

            console.log('map generated');

            return this.seededGrid;
        }
    }, {
        key: 'makeGrid',
        value: function makeGrid() {
            var col = this.col;
            var row = this.row;
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
            var nextGenSeeds = [];
            seeds.forEach(function (originalSeed) {
                for (var direction in _Constants.DIRECTIONS) {
                    var directionValues = _Constants.DIRECTIONS[direction];
                    var nextGenSeed = Object.assign({}, originalSeed);
                    if (_Utility2.default.probability(nextGenSeed.probability)) {
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

        // probability(percentage) {
        //     const probabilityArray = []
        //     for (let i = 0; i < percentage; i++) {
        //         probabilityArray.push(true)
        //     }
        //     for (let i = 0; i < 100 - percentage; i++) {
        //         probabilityArray.push(false)
        //     }
        //     return probabilityArray[Utility.randomize(100)]
        // }

    }]);

    return MapGenerator;
}();

exports.default = MapGenerator;

},{"./Constants":4,"./LandscapeData":6,"./Utility":15}],9:[function(require,module,exports){
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

},{"./Renderable":11,"./Utility":15,"./eventManager":16}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inventory = require('./inventory');

var _inventory2 = _interopRequireDefault(_inventory);

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

var _particleData = require('./particleData');

var _particleData2 = _interopRequireDefault(_particleData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Printer = function () {
    function Printer() {
        _classCallCheck(this, Printer);

        this.EM = _eventManager2.default;
        this.particleData = _particleData2.default;
        this.inventoryItems = _inventory2.default.contents;
        this.inventoryParticles = _inventory2.default.storeMining;

        this.printed = {};

        this.name = 'molecular printer';
        this.type = 'item';
        this.element = '#';
        this.description = 'generates objects according to a blueprint. molecules not included.';
        this.div = 'item-printer';
    }

    _createClass(Printer, [{
        key: 'getBlueprint',
        value: function getBlueprint() {}
    }, {
        key: 'checkRequirements',
        value: function checkRequirements() {
            var _this = this;

            var requirementTypes = Object.keys(this.blueprint.requirements);
            this.particlesRequiredByType = [];
            this.specialParticlesRequired = [];

            // rethink this with NEW PARTICLEDATA info (all particles as objects)

            requirementTypes.forEach(function (particleType) {
                for (var particle in _this.particleData) {
                    if (_this.particleData[particle].type === particleType) {
                        _this.particlesRequiredByType.push(_this.particleData[particle]);
                    } else if (particle === particleType) {
                        _this.specialParticlesRequired.push(_this.particleData[particle]);
                    }
                }
            });

            console.log('requirementTypes', requirementTypes);
            console.log('particlesRequiredByType', this.particlesRequiredByType);
            console.log('specialParticlesRequired', this.specialParticlesRequired);
        }
    }, {
        key: 'checkParticlesByType',
        value: function checkParticlesByType() {
            var _this2 = this;

            var particleArr = Object.keys(this.inventoryParticles);
            this.particlesRequiredByType.forEach(function (requiredParticle) {

                particleArr.forEach(function (ownedParticle) {
                    console.log('got here');

                    if (requiredParticle.name === ownedParticle) {
                        _this2.checkParticleAmounts(ownedParticle);
                    }
                });
            });
        }
    }, {
        key: 'checkParticleAmounts',
        value: function checkParticleAmounts(ownedParticle) {
            console.log('owned', ownedParticle);
            console.log('');

            // particles req by type is ARR not OBJ

            var requiredType = this.particlesRequiredByType[ownedParticle].type; // fails

            if (this.inventoryParticles[ownedParticle] >= this.blueprint.requirements[requiredType]) {
                console.log('you have enough ' + ownedParticle + '!');
            } else {
                console.log('you don\'t have enough ' + ownedParticle + '!');
            }
        }
    }, {
        key: 'checkSpecialParticles',
        value: function checkSpecialParticles() {}
    }, {
        key: 'checkParticleInventory',
        value: function checkParticleInventory() {

            this.inventoryParticles;
            this.particlesRequiredByType;
            this.specialParticlesRequired;
            this.blueprint.requirements;

            // for (let particle in this.blueprint.requirements) {
            //     if (particle === this.inventoryParticles[particle])
            // }


            // console.log('inventory particles', this.inventoryParticles)
        }
    }, {
        key: 'getParticles',
        value: function getParticles() {}
    }, {
        key: 'print',
        value: function print(blueprint) {
            this.blueprint = blueprint;

            this.checkRequirements();
            this.checkParticlesByType();

            // const particleInventory = this.checkParticleInventory(requiredParticles)
            this.getParticles();
        }
    }]);

    return Printer;
}();

exports.default = Printer;

},{"./eventManager":16,"./inventory":18,"./particleData":22}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./Renderable":11}],13:[function(require,module,exports){
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

},{"./eventManager":16}],14:[function(require,module,exports){
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

},{"./Utility":15}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

var _Printer = require('./Printer');

var _Printer2 = _interopRequireDefault(_Printer);

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
            var printer = this.printer = new _Printer2.default();
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
            this.inventory.add(printer);

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
                '77': character.getAction('mine'), // deploy particle (m)iner
                '80': character.getAction('print') // use printer
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

},{"./Blueprints":2,"./Character":3,"./InventoryDisplay":5,"./Map":7,"./Printer":10,"./Scenery":12,"./Status":13,"./UserInput":14,"./eventManager":16,"./inventory":18,"./items":21,"./store":23}],18:[function(require,module,exports){
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

},{"./eventManager":16}],19:[function(require,module,exports){
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

},{"../Moveable":9,"../Utility":15,"../eventManager":16}],20:[function(require,module,exports){
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

},{"../Utility":15,"./Item":19}],21:[function(require,module,exports){
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

},{"../Utility":15,"./Item":19,"./ParticleMiner":20}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var particleData = {
    copper: {
        name: 'copper',
        type: 'metals'
    },

    chrome: {
        name: 'chrome',
        type: 'metals'
    },

    lead: {
        name: 'lead',
        type: 'metals'
    },

    iron: {
        name: 'iron',
        type: 'metals'
    },

    styrofoam: {
        name: 'styrofoam',
        type: 'synthetics'
    },

    acrylic: {
        name: 'acrylic',
        type: 'synthetics'
    },

    latex: {
        name: 'latex',
        type: 'synthetics'
    },

    wood: {
        name: 'wood',
        type: 'organics'
    },

    fiber: {
        name: 'fiber',
        type: 'organics'
    },

    bone: {
        name: 'bone',
        type: 'organics'
    },

    glass: {
        name: 'glass',
        type: 'special'
    },

    silicon: {
        name: 'silicon',
        type: 'special'

    },
    ceramic: {
        name: 'ceramic',
        type: 'special'

    },
    mercury: {
        name: 'mercury',
        type: 'special'
    },

    carbon: {
        name: 'carbon',
        type: 'special'
    },

    ozone: {
        name: 'ozone',
        type: 'special'
    },

    benzene: {
        name: 'benzene',
        type: 'special'
    },

    uranium: {
        name: 'uranium',
        type: 'special'
    }
};

exports.default = particleData;

},{}],23:[function(require,module,exports){
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

},{"./eventManager":16}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0ludmVudG9yeURpc3BsYXkuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1ByaW50ZXIuanMiLCJzcmMvanMvUmVuZGVyYWJsZS5qcyIsInNyYy9qcy9TY2VuZXJ5LmpzIiwic3JjL2pzL1N0YXR1cy5qcyIsInNyYy9qcy9Vc2VySW5wdXQuanMiLCJzcmMvanMvVXRpbGl0eS5qcyIsInNyYy9qcy9ldmVudE1hbmFnZXIuanMiLCJzcmMvanMvZ2FtZS5qcyIsInNyYy9qcy9pbnZlbnRvcnkuanMiLCJzcmMvanMvaXRlbXMvSXRlbS5qcyIsInNyYy9qcy9pdGVtcy9QYXJ0aWNsZU1pbmVyLmpzIiwic3JjL2pzL2l0ZW1zL2luZGV4LmpzIiwic3JjL2pzL3BhcnRpY2xlRGF0YS5qcyIsInNyYy9qcy9zdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLE9BQU8sSUFBUDs7Ozs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7QUFHQSxJQUFNLGdCQUFnQjtBQUNsQixzQkFBa0I7QUFDZCxjQUFNLCtCQURRO0FBRWQsY0FBTSxXQUZRO0FBR2QscUJBQWEsRUFIQztBQUlkLG1CQUFXLEVBSkc7QUFLZCxzQkFBYztBQUNWLHdCQUFZLEVBREY7QUFFVixzQkFBVSxFQUZBO0FBR1YscUJBQVM7QUFIQztBQUxBLEtBREE7QUFZbEIsb0JBQWdCO0FBQ1osY0FBTSw2QkFETTtBQUVaLGNBQU0sV0FGTTtBQUdaLHFCQUFhLEVBSEQ7QUFJWixtQkFBVyxFQUpDO0FBS1osc0JBQWM7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QWdCLElBQWhCO0FBQ0gsU0FKRCxNQUlPO0FBQ0gsaUJBQUssUUFBTCxHQUFnQixLQUFoQjtBQUNBLGlCQUFLLE9BQUwsR0FBZSxPQUFPLFlBQXRCO0FBQ0g7QUFDSjs7OztnQ0FFTztBQUNKLGlCQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ0g7Ozs0QkFFRyxHLEVBQUs7QUFDTCxtQkFBUSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEdBQXJCLE1BQThCLElBQXRDO0FBQ0g7Ozs0QkFFRyxHLEVBQUssSyxFQUFPO0FBQ1osb0JBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsR0FBekI7O0FBRUEsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsRUFBMEIsS0FBSyxTQUFMLENBQWUsS0FBZixDQUExQjtBQUNIOzs7NEJBRUcsRyxFQUFLO0FBQ0wsb0JBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsR0FBekI7O0FBRUEsbUJBQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixDQUFYLENBQVA7QUFDSDs7Ozs7O2tCQUlVLElBQUksS0FBSixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2pzL2dhbWUnXG5cbndpbmRvdy5nYW1lID0gZ2FtZVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNvbnN0IGJsdWVwcmludERhdGEgPSB7XG4gICAgYXJ0aWZpY2lhbE11c2NsZToge1xuICAgICAgICBuYW1lOiAnYXJ0aWZpY2lhbCBtdXNjbGUgKGJsdWVwcmludCknLFxuICAgICAgICB0eXBlOiAnYmx1ZXByaW50JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6IHtcbiAgICAgICAgICAgIHN5bnRoZXRpY3M6IDcwLFxuICAgICAgICAgICAgb3JnYW5pY3M6IDIwLFxuICAgICAgICAgICAgc2lsaWNvbjogMTBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmV0aW5hbERpc3BsYXk6IHtcbiAgICAgICAgbmFtZTogJ3JldGluYWwgZGlzcGxheSAoYmx1ZXByaW50KScsXG4gICAgICAgIHR5cGU6ICdibHVlcHJpbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czoge1xuICAgICAgICAgICAgbWV0YWxzOiAyMCxcbiAgICAgICAgICAgIHN5bnRoZXRpY3M6IDIwLFxuICAgICAgICAgICAgb3JnYW5pY3M6IDEwLFxuICAgICAgICAgICAgZ2xhc3M6IDMwLFxuICAgICAgICAgICAgc2lsaWNvbjogMjBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcHJvc3RoZXRpY0FybToge1xuICAgICAgICBuYW1lOiAncHJvc3RoZXRpYyBhcm0gKGJsdWVwcmludCknLFxuICAgICAgICB0eXBlOiAnYmx1ZXByaW50JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6IHtcbiAgICAgICAgICAgIG1ldGFsczogODAsXG4gICAgICAgICAgICBzeW50aGV0aWNzOiAxMCxcbiAgICAgICAgICAgIHVyYW5pdW06IDEwXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuY2xhc3MgQmx1ZXByaW50IHtcbiAgICBjb25zdHJ1Y3RvcihyYW5kb21CbHVlcHJpbnQpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gcmFuZG9tQmx1ZXByaW50Lm5hbWVcbiAgICAgICAgdGhpcy50eXBlID0gcmFuZG9tQmx1ZXByaW50LnR5cGVcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHJhbmRvbUJsdWVwcmludC5kZXNjcmlwdGlvblxuICAgICAgICB0aGlzLmFiaWxpdGllcyA9IHJhbmRvbUJsdWVwcmludC5hYmlsaXRpZXNcbiAgICAgICAgdGhpcy5yZXF1aXJlbWVudHMgPSByYW5kb21CbHVlcHJpbnQucmVxdWlyZW1lbnRzXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbSgpIHtcbiAgICAgICAgY29uc3QgYmx1ZXByaW50VmFsdWVzID0gT2JqZWN0LnZhbHVlcyhibHVlcHJpbnREYXRhKVxuICAgICAgICBjb25zdCBpbmRleCA9IFV0aWxpdHkucmFuZG9taXplKGJsdWVwcmludFZhbHVlcy5sZW5ndGgpXG5cbiAgICAgICAgY29uc3QgcmFuZG9tQmx1ZXByaW50ID0gYmx1ZXByaW50VmFsdWVzW2luZGV4XVxuXG4gICAgICAgIHJldHVybiBuZXcgQmx1ZXByaW50KHJhbmRvbUJsdWVwcmludClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQmx1ZXByaW50XG5cbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICcuL01vdmVhYmxlJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5cblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgTW92ZWFibGUgeyAgLy8gQ2hhcmFjdGVyIGRhdGEgYW5kIGFjdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXBJbnN0YW5jZSwgaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgIHN1cGVyKG1hcEluc3RhbmNlKVxuICAgICAgICB0aGlzLm1hcEluc3RhbmNlID0gbWFwSW5zdGFuY2VcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeS5jb250ZW50c1xuXG4gICAgICAgIGxldCBwb3NpdGlvblxuICAgICAgICBpZiAoaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGluaXRpYWxQb3NpdGlvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zaXRpb24gPSBtYXBJbnN0YW5jZS5nZXRNYXBDZW50ZXIoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXMocG9zaXRpb24pXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFyYWN0ZXIgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2FjdG9yJykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTcGFuKHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlSXRlbXNUb01hcCgpIHtcbiAgICAgICAgLy8gTk9UIFJFUVVJUkVEIEFUIFRIRSBNT01FTlRcblxuICAgICAgICAvLyB0aGlzLm1hcC5pdGVtc09uTWFwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIC8vICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHtpdGVtLm5hbWV9LSR7aXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLnRha2VJdGVtLCB0aGlzLCB0cnVlKVxuICAgICAgICAvLyB9KVxuICAgIH1cblxuICAgIGdldFBvc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkSW5kaWNlc1xuICAgIH1cblxuICAgIGdldENoYXJhY3RlcigpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdhY3RvcicsXG4gICAgICAgICAgICBlbGVtZW50OiAnQCcsXG4gICAgICAgICAgICBjbHM6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgbGVmdDogY3NzTGVmdCxcbiAgICAgICAgICAgIHRvcDogY3NzVG9wLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgZ2V0QWN0aW9uKGZuTmFtZSwgYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2ZuTmFtZV0uYmluZCh0aGlzLCBhcmcpXG4gICAgfVxuXG4gICAgbW92ZShkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IHRoaXMudXBkYXRlR3JpZEluZGljZXModGhpcy5nZXRDaGFyYWN0ZXIoKSwgRElSRUNUSU9OU1tkaXJlY3Rpb25dKVxuICAgICAgICB0aGlzLnByaW50TG9jYWxTdGF0dXMoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5sb2NhdGlvbi54LFxuICAgICAgICAgICAgeTogdGhpcy5sb2NhdGlvbi55XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ21vdmVkLXRvJywgcG9zaXRpb24pXG4gICAgfVxuXG4gICAgcHJpbnRMb2NhbFN0YXR1cygpIHtcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLmxvY2F0aW9uKVxuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG5cbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgaWYgKGxvY2FsSXRlbS5taW5pbmcgPT09ICdlbXB0eScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICdtaW5pbmcgaGFzIGJlZW4gZXhoYXVzdGVkIGZvciB0aGlzIHJlZ2lvbicpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxvY2FsSXRlbS5taW5pbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICdhIG1pbmVyIHB1bGxzIGNvbXBvdW5kcyBmcm9tIHRoZSByZWdpb24nKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2Rpc3BsYXktaXRlbScsIGxvY2FsSXRlbS5uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWxJdGVtKCkge1xuICAgICAgICBjb25zdCBjaGFyID0gdGhpcy5nZXRDaGFyYWN0ZXIoKVxuICAgICAgICBsZXQgbG9jYWxJdGVtID0gbnVsbFxuXG4gICAgICAgIHRoaXMubWFwSW5zdGFuY2UuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY2hhci54ICYmIGl0ZW0ueSA9PT0gY2hhci55KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxJdGVtID0gaXRlbVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBsb2NhbEl0ZW1cbiAgICB9XG5cbiAgICB0YWtlKCkge1xuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG5cbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGAke2xvY2FsSXRlbS5uYW1lfS0ke2xvY2FsSXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gKVxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBgJHtsb2NhbEl0ZW0ubmFtZX0gdGFrZW5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAndGhlcmUgaXMgbm90aGluZyBoZXJlIHdvcnRoIHRha2luZycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaGVja0ludmVudG9yeSgpIHtcbiAgICAvLyAgICAgY29uc3QgY2FycnlpbmcgPSB0aGlzLmludmVudG9yeS5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpLmpvaW4oJyB8ICcpXG4gICAgLy8gICAgIGNvbnN0IHRleHQgPSBgeW91IGFyZSBjYXJyeWluZzogJHtjYXJyeWluZ31gXG4gICAgLy8gICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgdGV4dClcbiAgICAvLyB9XG5cbiAgICBmaW5kSW52ZW50b3J5SXRlbUJ5TmFtZU9yVHlwZShpdGVtTmFtZSkge1xuICAgICAgICBsZXQgZm91bmRJdGVtID0gbnVsbFxuICAgICAgICB0aGlzLmludmVudG9yeS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gaXRlbU5hbWUpIHtcbiAgICAgICAgICAgICAgICBmb3VuZEl0ZW0gPSBpdGVtXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gaXRlbU5hbWUpIHtcbiAgICAgICAgICAgICAgICBmb3VuZEl0ZW0gPSBpdGVtXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBmb3VuZEl0ZW1cbiAgICB9XG5cbiAgICBnZXRJdGVtTG9jYXRpb24oaXRlbU5hbWUpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgY29uc3QgaXRzZWxmID0gdGhpcy5maW5kSW52ZW50b3J5SXRlbUJ5TmFtZU9yVHlwZShpdGVtTmFtZSlcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBbY2hhci54LCBjaGFyLnldXG4gICAgICAgIHJldHVybiB7IGl0c2VsZiwgbG9jYXRpb24gfVxuICAgIH1cblxuICAgIG1pbmUoKSB7XG4gICAgICAgIGNvbnN0IG1pbmVyID0gdGhpcy5nZXRJdGVtTG9jYXRpb24oJ3BhcnRpY2xlIG1pbmVyJylcbiAgICAgICAgaWYgKG1pbmVyLml0c2VsZikge1xuICAgICAgICAgICAgbWluZXIuaXRzZWxmLm1pbmUobWluZXIubG9jYXRpb24pXG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3JlbW92ZS1pbnZlbnRvcnknLCBtaW5lci5pdHNlbGYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICd5b3UgZG8gbm90IGhhdmUgYW55IHBhcnRpY2xlIG1pbmVycycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcmludCgpIHtcbiAgICAgICAgY29uc3QgcHJpbnRlciA9IHRoaXMuZmluZEludmVudG9yeUl0ZW1CeU5hbWVPclR5cGUoJ21vbGVjdWxhciBwcmludGVyJylcbiAgICAgICAgY29uc3QgYmx1ZXByaW50ID0gdGhpcy5maW5kSW52ZW50b3J5SXRlbUJ5TmFtZU9yVHlwZSgnYmx1ZXByaW50JylcblxuXG4gICAgICAgIGlmIChwcmludGVyKSB7XG4gICAgICAgICAgICBwcmludGVyLnByaW50KGJsdWVwcmludClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBJbnZlbnRvcnlEaXNwbGF5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pbnZlbnRvcnknLCB0aGlzLnJlbmRlciwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktbWluZWQnLCB0aGlzLnJlbmRlck1pbmVkLCB0aGlzKVxuICAgIH1cblxuICAgIHJlbmRlcihpbnZlbnRvcnlPYmplY3QpIHtcbiAgICAgICAgbGV0IHN0ciA9IGludmVudG9yeU9iamVjdC5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpLmpvaW4oJzxicj4nKVxuICAgICAgICBzdHIgPSAnSU5WRU5UT1JZIDxicj48YnI+JyArIHN0clxuICAgICAgICB0aGlzLnNldChzdHIsICdpbnZlbnRvcnktc3RhdHVzJylcbiAgICB9XG5cbiAgICByZW5kZXJNaW5lZChtaW5lZEVsZW1lbnRzT2JqZWN0KSB7XG4gICAgICAgIGxldCBzdHIgPSB0aGlzLmNsZWFuSlNPTlN0cmluZyhKU09OLnN0cmluZ2lmeShtaW5lZEVsZW1lbnRzT2JqZWN0KSlcbiAgICAgICAgc3RyID0gJ1BBUlRJQ0xFUyBNSU5FRCA8YnI+PGJyPicgKyBzdHJcbiAgICAgICAgdGhpcy5zZXQoc3RyLCAnbWluaW5nLXN0YXR1cycpXG4gICAgfVxuXG4gICAgY2xlYW5KU09OU3RyaW5nKHN0cikge1xuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXCIvZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC86L2csICcgJylcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL3svZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC99L2csICcnKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvLC9nLCAnPGJyPicpXG5cbiAgICAgICAgcmV0dXJuIHN0clxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZWxlbWVudElELCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJRCkuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSW52ZW50b3J5RGlzcGxheVxuIiwiY2xhc3MgTGFuZHNjYXBlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB0aGlzLmZlYXR1cmVzKClcbiAgICAgICAgdGhpcy5iYXJlID0gdGhpcy5iYXJlKClcbiAgICB9XG5cbiAgICBmZWF0dXJlcygpIHtcbiAgICAgICAgY29uc3QgcGVyaW9kID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0aGUgYWlyIGlzIGNob2tlZCB3aXRoIGR1c3QsIHN0YXRpYywgd2lmaScsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjUsXG4gICAgICAgICAgICBjbHM6ICdwZXJpb2QnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBjaHJvbWU6IDE1LFxuICAgICAgICAgICAgICAgIGxlYWQ6IDMwLFxuICAgICAgICAgICAgICAgIHN0eXJvZm9hbTogMzAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBzaWxpY29uOiAxMCxcbiAgICAgICAgICAgICAgICBjZXJhbWljOiAxMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21tYSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcsJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnc3ByYXdsIG9mIHNtYXJ0IGhvbWVzLCBjdWwtZGUtc2FjcywgbGFuZXdheXMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI2LFxuICAgICAgICAgICAgY2xzOiAnY29tbWEnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBsYXRleDogMTUsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIGJvbmU6IDEwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdyYXZlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJ14nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhIHNoaW1tZXJpbmcgZmllbGQgb2Ygc29sYXIgcGFuZWxzLCBicm9rZW4gYW5kIGNvcnJvZGVkJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMixcbiAgICAgICAgICAgIGNsczogJ2dyYXZlJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBiZW56ZW5lOiAyMCxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2VyYW1pYzogMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwXG5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhc3RlcmlzayA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcqJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnaG9sbG93IHVzZXJzIGphY2sgaW4gYXQgdGhlIGRhdGFodWJzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMCxcbiAgICAgICAgICAgIGNsczogJ2FzdGVyaXNrJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBiZW56ZW5lOiAyMCxcbiAgICAgICAgICAgICAgICBzaWxpY29uOiAxMCxcbiAgICAgICAgICAgICAgICBjYXJib246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMFxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwZXJpb2QsIGNvbW1hLCBzZW1pY29sb24sIHNlbWljb2xvbiwgYXN0ZXJpc2ssIGFzdGVyaXNrLCBncmF2ZSwgZ3JhdmVdXG4gICAgfVxuXG4gICAgYmFyZSgpIHtcbiAgICAgICAgY29uc3QgYmFyZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmbmJzcDsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjb25jcmV0ZSBhbmQgdHdpc3RlZCByZWJhciBzdHJldGNoIHRvIHRoZSBob3Jpem9uJyxcbiAgICAgICAgICAgIGNsczogJ2JsYW5rJyxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTAsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBpcm9uOiAzMCxcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBib25lOiAxMCxcbiAgICAgICAgICAgICAgICBoeWRyb2NhcmJvbnM6IDE1LFxuICAgICAgICAgICAgICAgIHVyYW5pdW06IDEwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXJlXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYW5kc2NhcGVEYXRhXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IE1hcEdlbmVyYXRvciBmcm9tICcuL01hcEdlbmVyYXRvcidcblxuY2xhc3MgTWFwIHtcbiAgICBjb25zdHJ1Y3RvcihtYXBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgY29uc3RydWN0b3InLCBtYXBEYXRhKVxuXG4gICAgICAgIHRoaXMubWFwID0gbWFwRGF0YVxuICAgICAgICB0aGlzLmNvbCA9IE1hcC5nZXRDb2wobWFwRGF0YSlcbiAgICAgICAgdGhpcy5yb3cgPSBNYXAuZ2V0Um93KG1hcERhdGEpXG5cbiAgICAgICAgdGhpcy5pdGVtc09uTWFwID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDb2wobWFwRGF0YSkge1xuICAgICAgICByZXR1cm4gbWFwRGF0YS5sZW5ndGhcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Um93KG1hcERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1hcERhdGFbMF0ubGVuZ3RoXG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlKHsgY29sLCByb3cgfSkge1xuICAgICAgICBjb25zdCBtYXBHZW5lcmF0b3IgPSBuZXcgTWFwR2VuZXJhdG9yKClcblxuICAgICAgICByZXR1cm4gbWFwR2VuZXJhdG9yLmdlbmVyYXRlKHsgY29sLCByb3d9KVxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwXG4gICAgfVxuXG4gICAgZ2V0TWFwQ2VudGVyKCkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IodGhpcy5jb2wvMiksIE1hdGguZmxvb3IodGhpcy5yb3cvMildXG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tTWFwTG9jYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKSwgVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKV1cbiAgICB9XG5cbiAgICBzZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKSB7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLnNldE1hcCh0aGlzLm1hcClcbiAgICB9XG5cbiAgICBzZXRJdGVtcyhpdGVtcykge1xuICAgICAgICBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21NYXBMb2NhdGlvbiA9IHRoaXMuZ2V0UmFuZG9tTWFwTG9jYXRpb24oKVxuICAgICAgICAgICAgaXRlbS5zZXRPbk1hcCh0aGlzLm1hcCwgcmFuZG9tTWFwTG9jYXRpb24pXG4gICAgICAgICAgICBpdGVtLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKSAgLy8gbW92ZWQgY2hpbGRFbGVtZW50IGNyZWF0aW9uIG91dCBvZiAnc2V0T25NYXAnXG4gICAgICAgICAgICB0aGlzLnB1c2hJdGVtKGl0ZW0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVzaEl0ZW0oaXRlbSkge1xuICAgICAgICB0aGlzLml0ZW1zT25NYXAucHVzaChpdGVtKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgTGFuZHNjYXBlRGF0YSBmcm9tICcuL0xhbmRzY2FwZURhdGEnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5cblxuY2xhc3MgTWFwR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBnZW5lcmF0ZSh7IGNvbCwgcm93IH0pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYXRpbmcgbWFwJylcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcblxuICAgICAgICB0aGlzLmxhbmRzY2FwZVNlZWRzID0gbmV3IExhbmRzY2FwZURhdGEoKVxuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5tYWtlR3JpZCgpXG4gICAgICAgIGNvbnN0IHNlZWRlZEdyaWQgPSB0aGlzLnNlZWQoZ3JpZClcbiAgICAgICAgdGhpcy5zZWVkZWRHcmlkID0gc2VlZGVkR3JpZFxuICAgICAgICB0aGlzLmdyb3coKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgZ2VuZXJhdGVkJylcblxuICAgICAgICByZXR1cm4gdGhpcy5zZWVkZWRHcmlkXG4gICAgfVxuXG4gICAgbWFrZUdyaWQoKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IHRoaXMuY29sXG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMucm93XG4gICAgICAgIGNvbnN0IGdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdzsgaSsrKSB7XG4gICAgICAgICAgICBncmlkW2ldID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBncmlkW2ldLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBzZWVkKGdyaWQpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tRWxlbWVudHMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKTsgaSsrKSB7XG4gICAgICAgICAgICByYW5kb21FbGVtZW50cy5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlcy5sZW5ndGgpXSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWVkcyA9IHRoaXMuZ2VuZXJhdGVTZWVkTG9jYXRpb25zKHJhbmRvbUVsZW1lbnRzKVxuICAgICAgICBzZWVkcy5tYXAoc2VlZCA9PiBncmlkW3NlZWQueV1bc2VlZC54XSA9IHNlZWQpXG4gICAgICAgIHRoaXMuX3NlZWRzID0gc2VlZHNcbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpIHtcbiAgICAgICAgLy8gIHJldHVybiAxICAgICAgICAvLyB0ZXN0IHNldHRpbmdcbiAgICAgICAgLy8gcmV0dXJuICgodGhpcy5jb2wgKiB0aGlzLnJvdykgLyAodGhpcy5fY29sICsgdGhpcy5yb3cpKSAgLy8gc3BhcnNlIGluaXRpYWwgc2VlZGluZ1xuICAgICAgICByZXR1cm4gKHRoaXMuY29sICsgdGhpcy5yb3cpICAvLyByaWNoIGluaXRpYWwgc2VlZGluZ1xuICAgIH1cblxuICAgIGdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cykge1xuICAgICAgICByZXR1cm4gcmFuZG9tRWxlbWVudHMubWFwKGVsID0+IHtcbiAgICAgICAgICAgIGVsLnggPSBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpXG4gICAgICAgICAgICBlbC55ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKVxuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ3JvdygpIHtcbiAgICAgICAgbGV0IHNlZWRzID0gdGhpcy5fc2VlZHNcbiAgICAgICAgbGV0IG1hcFBvcHVsYXRlZCA9IGZhbHNlXG5cbiAgICAgICAgd2hpbGUgKCFtYXBQb3B1bGF0ZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ29vZFNlZWRzID0gW11cbiAgICAgICAgICAgIHRoaXMuZ29vZFNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB0aGlzLm5leHRHZW5lcmF0aW9uU2VlZHMoc2VlZHMpLmZvckVhY2goKHNlZWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1NlZWQoc2VlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZFNlZWRzLnB1c2godGhpcy5jaGVja1NlZWQoc2VlZCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGZvciAobGV0IGdvb2RTZWVkIG9mIGdvb2RTZWVkcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPSBnb29kU2VlZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5jb3VudFVuc2VlZGVkTG9jYXRpb25zKCkpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3VudFVuc2VlZGVkTG9jYXRpb25zKCkge1xuICAgICAgICBjb25zdCBmbGF0dGVuZWRHcmlkID0gW10uY29uY2F0LmFwcGx5KFtdLCB0aGlzLnNlZWRlZEdyaWQpXG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSBvZiBmbGF0dGVuZWRHcmlkKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICAgICAgY291bnQrK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudFxuICAgIH1cblxuICAgIGNoZWNrU2VlZChzZWVkKSB7XG4gICAgICAgIGxldCBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICBpZiAoKHNlZWQueCA8IHRoaXMuY29sICYmIHNlZWQueCA+PSAwKSAmJlxuICAgICAgICAgICAgKHNlZWQueSA8IHRoaXMucm93ICYmIHNlZWQueSA+PSAwKSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW3NlZWQueV1bc2VlZC54XSAhPT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nb29kU2VlZHMuZm9yRWFjaChnb29kU2VlZCA9PiB7XG4gICAgICAgICAgICBpZiAoKHNlZWQueCA9PT0gZ29vZFNlZWQueCkgJiZcbiAgICAgICAgICAgICAgICAoc2VlZC55ID09PSBnb29kU2VlZC55KSkge1xuICAgICAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHNlZWRTdWNjZWVkcykge1xuICAgICAgICAgICAgcmV0dXJuIHNlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKSB7XG4gICAgICAgIGNvbnN0IG5leHRHZW5TZWVkcyA9IFtdXG4gICAgICAgIHNlZWRzLmZvckVhY2goKG9yaWdpbmFsU2VlZCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIGluIERJUkVDVElPTlMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb25WYWx1ZXMgPSBESVJFQ1RJT05TW2RpcmVjdGlvbl1cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0R2VuU2VlZCA9IE9iamVjdC5hc3NpZ24oe30sIG9yaWdpbmFsU2VlZClcbiAgICAgICAgICAgICAgICBpZiAoVXRpbGl0eS5wcm9iYWJpbGl0eShuZXh0R2VuU2VlZC5wcm9iYWJpbGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGRpcmVjdGlvblZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZC54ID0gb3JpZ2luYWxTZWVkLnggKyBkaXJlY3Rpb25WYWx1ZXNba2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueSA9IG9yaWdpbmFsU2VlZC55ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZHMucHVzaChuZXh0R2VuU2VlZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMubmV4dEdlblNlZWRzID0gbmV4dEdlblNlZWRzXG4gICAgICAgIHJldHVybiBuZXh0R2VuU2VlZHNcbiAgICB9XG5cbiAgICAvLyBwcm9iYWJpbGl0eShwZXJjZW50YWdlKSB7XG4gICAgLy8gICAgIGNvbnN0IHByb2JhYmlsaXR5QXJyYXkgPSBbXVxuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcmNlbnRhZ2U7IGkrKykge1xuICAgIC8vICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKHRydWUpXG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAgLSBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAvLyAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaChmYWxzZSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gcHJvYmFiaWxpdHlBcnJheVtVdGlsaXR5LnJhbmRvbWl6ZSgxMDApXVxuICAgIC8vIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwR2VuZXJhdG9yXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5cblxuY2xhc3MgTW92ZWFibGUgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIG1vdmVtZW50IGFuZCBwbGFjZW1lbnQgb24gdGhlIGdyaWRcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgc2V0TWFwKG1hcCkge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgIH1cblxuICAgIHNldEluaXRpYWxHcmlkSW5kaWNlcyhncmlkSW5kaWNlcykge1xuICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gZ3JpZEluZGljZXNcbiAgICB9XG5cbiAgICBnZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cblxuICAgICAgICByZXR1cm4geyB4LCB5IH1cbiAgICB9XG5cbiAgICB1cGRhdGVHcmlkSW5kaWNlcyhhY3RvciwgbW92ZSkge1xuICAgICAgICBjb25zdCBuZXdHcmlkSW5kaWNlcyA9IFt0aGlzLmdyaWRJbmRpY2VzWzBdICsgbW92ZS54LCB0aGlzLmdyaWRJbmRpY2VzWzFdICsgbW92ZS55XVxuICAgICAgICBsZXQgbG9jYXRpb24gPSAnJ1xuICAgICAgICBpZiAodGhpcy5jaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSkge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLm1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gbmV3R3JpZEluZGljZXNcbiAgICAgICAgICAgIGFjdG9yLnggPSBuZXdHcmlkSW5kaWNlc1swXVxuICAgICAgICAgICAgYWN0b3IueSA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2NhdGlvbiA9IHRoaXMubWFwW3RoaXMuZ3JpZEluZGljZXNbMV0sIHRoaXMuZ3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAoYWN0b3IubmFtZSA9PT0gJ2NoYXJhY3RlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIFwieW91J3ZlIHJlYWNoZWQgdGhlIG1hcCdzIGVkZ2VcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYXRpb25cbiAgICB9XG5cbiAgICBjaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSB7XG4gICAgICAgIGxldCBsb2NhdGlvbk9uR3JpZCA9IGZhbHNlXG5cbiAgICAgICAgY29uc3QgeCA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIGNvbnN0IHkgPSBuZXdHcmlkSW5kaWNlc1swXVxuXG4gICAgICAgIGlmICh0aGlzLm1hcFt4XSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLm1hcFt4XVt5XVxuICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb25PbkdyaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYXRpb25PbkdyaWRcbiAgICB9XG5cbiAgICBnZXRDU1NIZWlnaHRBbmRXaWR0aCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdCcpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgICAgIGNvbnN0IHdpZHRoID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKVxuICAgICAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH1cbiAgICB9XG5cbiAgICBnZXRDU1NDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgY3NzID0gdGhpcy5nZXRDU1NIZWlnaHRBbmRXaWR0aCgpXG4gICAgICAgIGNvbnN0IGNzc0xlZnQgPSB0aGlzLmdyaWRJbmRpY2VzWzBdICogY3NzLmhlaWdodFxuICAgICAgICBjb25zdCBjc3NUb3AgPSB0aGlzLmdyaWRJbmRpY2VzWzFdICogY3NzLndpZHRoXG4gICAgICAgIHJldHVybiB7IGNzc0xlZnQsIGNzc1RvcCB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1vdmVhYmxlXG4iLCJpbXBvcnQgaW52ZW50b3J5IGZyb20gJy4vaW52ZW50b3J5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBwYXJ0aWNsZURhdGEgZnJvbSAnLi9wYXJ0aWNsZURhdGEnXG5cblxuY2xhc3MgUHJpbnRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLnBhcnRpY2xlRGF0YSA9IHBhcnRpY2xlRGF0YVxuICAgICAgICB0aGlzLmludmVudG9yeUl0ZW1zID0gaW52ZW50b3J5LmNvbnRlbnRzXG4gICAgICAgIHRoaXMuaW52ZW50b3J5UGFydGljbGVzID0gaW52ZW50b3J5LnN0b3JlTWluaW5nXG5cbiAgICAgICAgdGhpcy5wcmludGVkID0ge31cblxuICAgICAgICB0aGlzLm5hbWUgPSAnbW9sZWN1bGFyIHByaW50ZXInXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAnIydcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9ICdnZW5lcmF0ZXMgb2JqZWN0cyBhY2NvcmRpbmcgdG8gYSBibHVlcHJpbnQuIG1vbGVjdWxlcyBub3QgaW5jbHVkZWQuJ1xuICAgICAgICB0aGlzLmRpdiA9ICdpdGVtLXByaW50ZXInXG5cblxuICAgIH1cblxuXG4gICAgZ2V0Qmx1ZXByaW50KCkge1xuXG4gICAgfVxuXG5cbiAgICBjaGVja1JlcXVpcmVtZW50cygpIHtcblxuICAgICAgICBjb25zdCByZXF1aXJlbWVudFR5cGVzID0gT2JqZWN0LmtleXModGhpcy5ibHVlcHJpbnQucmVxdWlyZW1lbnRzKVxuICAgICAgICB0aGlzLnBhcnRpY2xlc1JlcXVpcmVkQnlUeXBlID0gW11cbiAgICAgICAgdGhpcy5zcGVjaWFsUGFydGljbGVzUmVxdWlyZWQgPSBbXVxuXG4vLyByZXRoaW5rIHRoaXMgd2l0aCBORVcgUEFSVElDTEVEQVRBIGluZm8gKGFsbCBwYXJ0aWNsZXMgYXMgb2JqZWN0cylcblxuICAgICAgICByZXF1aXJlbWVudFR5cGVzLmZvckVhY2gocGFydGljbGVUeXBlID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRpY2xlIGluIHRoaXMucGFydGljbGVEYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVEYXRhW3BhcnRpY2xlXS50eXBlID09PSBwYXJ0aWNsZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXNSZXF1aXJlZEJ5VHlwZS5wdXNoKHRoaXMucGFydGljbGVEYXRhW3BhcnRpY2xlXSlcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcnRpY2xlID09PSBwYXJ0aWNsZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGVjaWFsUGFydGljbGVzUmVxdWlyZWQucHVzaCh0aGlzLnBhcnRpY2xlRGF0YVtwYXJ0aWNsZV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXF1aXJlbWVudFR5cGVzJywgcmVxdWlyZW1lbnRUeXBlcylcbiAgICAgICAgY29uc29sZS5sb2coJ3BhcnRpY2xlc1JlcXVpcmVkQnlUeXBlJywgdGhpcy5wYXJ0aWNsZXNSZXF1aXJlZEJ5VHlwZSlcbiAgICAgICAgY29uc29sZS5sb2coJ3NwZWNpYWxQYXJ0aWNsZXNSZXF1aXJlZCcsIHRoaXMuc3BlY2lhbFBhcnRpY2xlc1JlcXVpcmVkKVxuXG4gICAgfVxuXG5cbiAgICBjaGVja1BhcnRpY2xlc0J5VHlwZSgpIHtcbiAgICAgICAgY29uc3QgcGFydGljbGVBcnIgPSBPYmplY3Qua2V5cyh0aGlzLmludmVudG9yeVBhcnRpY2xlcylcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXNSZXF1aXJlZEJ5VHlwZS5mb3JFYWNoKHJlcXVpcmVkUGFydGljbGUgPT4ge1xuXG4gICAgICAgICAgICBwYXJ0aWNsZUFyci5mb3JFYWNoKG93bmVkUGFydGljbGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnb3QgaGVyZScpXG5cbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZWRQYXJ0aWNsZS5uYW1lID09PSBvd25lZFBhcnRpY2xlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tQYXJ0aWNsZUFtb3VudHMob3duZWRQYXJ0aWNsZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY2hlY2tQYXJ0aWNsZUFtb3VudHMob3duZWRQYXJ0aWNsZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnb3duZWQnLCBvd25lZFBhcnRpY2xlKVxuICAgICAgICBjb25zb2xlLmxvZygnJylcblxuXG4gICAgICAgIC8vIHBhcnRpY2xlcyByZXEgYnkgdHlwZSBpcyBBUlIgbm90IE9CSlxuXG4gICAgICAgIGNvbnN0IHJlcXVpcmVkVHlwZSA9IHRoaXMucGFydGljbGVzUmVxdWlyZWRCeVR5cGVbb3duZWRQYXJ0aWNsZV0udHlwZSAvLyBmYWlsc1xuXG4gICAgICAgIGlmICh0aGlzLmludmVudG9yeVBhcnRpY2xlc1tvd25lZFBhcnRpY2xlXSA+PSB0aGlzLmJsdWVwcmludC5yZXF1aXJlbWVudHNbcmVxdWlyZWRUeXBlXSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYHlvdSBoYXZlIGVub3VnaCAke293bmVkUGFydGljbGV9IWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgeW91IGRvbid0IGhhdmUgZW5vdWdoICR7b3duZWRQYXJ0aWNsZX0hYClcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuXG5cbiAgICBjaGVja1NwZWNpYWxQYXJ0aWNsZXMoKSB7XG5cbiAgICB9XG5cblxuICAgIGNoZWNrUGFydGljbGVJbnZlbnRvcnkoKSB7XG5cbiAgICAgICAgdGhpcy5pbnZlbnRvcnlQYXJ0aWNsZXNcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXNSZXF1aXJlZEJ5VHlwZVxuICAgICAgICB0aGlzLnNwZWNpYWxQYXJ0aWNsZXNSZXF1aXJlZFxuICAgICAgICB0aGlzLmJsdWVwcmludC5yZXF1aXJlbWVudHNcblxuXG5cbiAgICAgICAgLy8gZm9yIChsZXQgcGFydGljbGUgaW4gdGhpcy5ibHVlcHJpbnQucmVxdWlyZW1lbnRzKSB7XG4gICAgICAgIC8vICAgICBpZiAocGFydGljbGUgPT09IHRoaXMuaW52ZW50b3J5UGFydGljbGVzW3BhcnRpY2xlXSlcbiAgICAgICAgLy8gfVxuXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ludmVudG9yeSBwYXJ0aWNsZXMnLCB0aGlzLmludmVudG9yeVBhcnRpY2xlcylcbiAgICB9XG5cblxuICAgIGdldFBhcnRpY2xlcygpIHtcblxuXG5cbiAgICB9XG5cblxuICAgIHByaW50KGJsdWVwcmludCkge1xuICAgICAgICB0aGlzLmJsdWVwcmludCA9IGJsdWVwcmludFxuXG4gICAgICAgIHRoaXMuY2hlY2tSZXF1aXJlbWVudHMoKVxuICAgICAgICB0aGlzLmNoZWNrUGFydGljbGVzQnlUeXBlKClcblxuICAgICAgICAvLyBjb25zdCBwYXJ0aWNsZUludmVudG9yeSA9IHRoaXMuY2hlY2tQYXJ0aWNsZUludmVudG9yeShyZXF1aXJlZFBhcnRpY2xlcylcbiAgICAgICAgdGhpcy5nZXRQYXJ0aWNsZXMoKVxuICAgIH1cblxuXG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQcmludGVyXG4iLCJjbGFzcyBSZW5kZXJhYmxlIHsgIC8vIGdlbmVyYWxpemVkIHJlbmRlciBmdW5jdGlvbnMgZm9yIFNjZW5lcnksIENoYXJhY3RlclxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHNldExheWVyKGxheWVyKSB7XG4gICAgICAgIHRoaXMubGF5ZXIgPSBsYXllclxuICAgIH1cblxuICAgIGdldExheWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXllclxuICAgIH1cblxuICAgIHJlbmRlclNwYW4odW5pdCkge1xuICAgICAgICBsZXQgY2xzID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgICAgY2xzID0gdW5pdC5jbHNcbiAgICAgICAgICAgIGVsZW1lbnQgPSB1bml0LmVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bml0LnRvcCAmJiB1bml0LmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHt1bml0LnRvcH1weDsgbGVmdDogJHt1bml0LmxlZnR9cHhgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInVuaXQgJHtjbHN9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L3NwYW4+YFxuICAgIH1cblxuICAgIHJlbmRlckRpdihpdGVtKSB7XG4gICAgICAgIGxldCBkaXYgPSAnJ1xuICAgICAgICBsZXQgZWxlbWVudCA9ICcmbmJzcDsnXG4gICAgICAgIGxldCBzdHlsZSA9ICcnXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBkaXYgPSBpdGVtLmRpdlxuICAgICAgICAgICAgZWxlbWVudCA9IGl0ZW0uZWxlbWVudFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnRvcCAmJiBpdGVtLmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHtpdGVtLnRvcH1weDsgbGVmdDogJHtpdGVtLmxlZnR9cHg7IHBvc2l0aW9uOiBhYnNvbHV0ZWBcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5vZmZNYXApIHtcbiAgICAgICAgICAgIHN0eWxlICs9IGA7IGRpc3BsYXk6IG5vbmVgXG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGl0ZW0ubWluaW5nKSB7XG4gICAgICAgICAgICBjYXNlICdmdWxsJzpcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgOyBhbmltYXRpb246IG1pbmluZy1mdWxsIDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdoYWxmJzpcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgOyBhbmltYXRpb246IG1pbmluZy1oYWxmIDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctZW1wdHkgM3MgaW5maW5pdGVgXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBgPGRpdiBpZD1cIiR7ZGl2fVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9kaXY+YFxuICAgIH1cblxuICAgIHVwZGF0ZVNwYW4oYWN0b3IpIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlclNwYW4oYWN0b3IpKVxuICAgIH1cblxuICAgIHVwZGF0ZURpdihpdGVtKSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5yZW5kZXJEaXYoaXRlbSkpXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXllcklkKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KHBhcmVudExheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJlbnRMYXllcklkKVxuICAgICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpIC8vIGNyZWF0ZXMgZGl2IGlkIHdpdGhpbiBlbmNsb3NpbmcgZGl2IC4uLlxuICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUmVuZGVyYWJsZVxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuXG5cbmNsYXNzIFNjZW5lcnkgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIFNjZW5lcnktc3BlY2lmaWMgcmVuZGVyaW5nIGZ1bmN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMubWFwID0gbWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIoKVxuICAgICAgICBjb25zb2xlLmxvZygnc2NlbmVyeSByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyTGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLm1hcC5tYXAoYXJyID0+IHsgcmV0dXJuIGFyci5zbGljZSgpIH0pXG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5jcmVhdGVMYXllcihncmlkKSlcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUxheWVyKGdyaWQpIHtcbiAgICAgICAgY29uc3Qgc2NlbmVyeUdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0l0ZW1zID0gZ3JpZFtpXVxuICAgICAgICAgICAgbGV0IHJvdyA9ICcnICAvLyBwb3NzaWJseSBtYWtlIGVhY2ggcm93IGEgdGFibGU/XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm93ICs9IHRoaXMucmVuZGVyU3Bhbihyb3dJdGVtc1tpXSkgLy8gYWRkIHJlbmRlcmVkIGl0ZW1zIHRvIHRoZSBncmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzY2VuZXJ5R3JpZC5wdXNoKHJvdylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2NlbmVyeUdyaWRcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGNvbnN0IGdyaWRUb0hUTUwgPSBsYXllci5qb2luKCc8YnIgLz4nKSAgLy8gdXNpbmcgSFRNTCBicmVha3MgZm9yIG5vd1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYW5kc2NhcGUtbGF5ZXInKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSBncmlkVG9IVE1MXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lcnlcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIFN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMudXBkYXRlLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pdGVtJywgdGhpcy5kaXNwbGF5SXRlbSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ3N0YXR1cycsIHRoaXMuZGVmYXVsdCwgdGhpcylcbiAgICB9XG5cbiAgICB1cGRhdGUobG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXQobG9jYXRpb24uZGVzY3JpcHRpb24pXG4gICAgfVxuXG4gICAgYmVnaW5zV2l0aFZvd2VsKHRleHQpIHtcbiAgICAgICAgY29uc3QgZmlyc3RMZXR0ZXIgPSB0ZXh0WzBdXG4gICAgICAgIGNvbnN0IHZvd2VscyA9IFsnYScsICdlJywgJ2knLCAnbycsICd1J11cbiAgICAgICAgbGV0IGJlZ2luc1dpdGhWb3dlbCA9IGZhbHNlXG4gICAgICAgIHZvd2Vscy5mb3JFYWNoKHZvd2VsID0+IHtcbiAgICAgICAgICAgIGlmIChmaXJzdExldHRlciA9PT0gdm93ZWwpIHtcbiAgICAgICAgICAgICAgICBiZWdpbnNXaXRoVm93ZWwgPSB0cnVlXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGJlZ2luc1dpdGhWb3dlbFxuICAgIH1cblxuICAgIGRpc3BsYXlJdGVtKGl0ZW1OYW1lKSB7XG4gICAgICAgIGNvbnN0IGJlZ2luc1dpdGhWb3dlbCA9IHRoaXMuYmVnaW5zV2l0aFZvd2VsKGl0ZW1OYW1lKVxuICAgICAgICBsZXQgdGV4dCA9ICcnXG4gICAgICAgIGlmIChiZWdpbnNXaXRoVm93ZWwpIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhbiAke2l0ZW1OYW1lfSBoZXJlYFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dCA9IGB5b3Ugc2VlIGEgJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldCh0ZXh0LCAxMClcbiAgICB9XG5cbiAgICBkZWZhdWx0KHRleHQpIHtcbiAgICAgICAgdGhpcy5zZXQodGV4dCwgMTApXG4gICAgfVxuXG4gICAgc2V0KGRlc2NyaXB0aW9uLCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKS5pbm5lckhUTUwgPSBkZXNjcmlwdGlvblxuICAgICAgICB9LCBkZWxheSlcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU3RhdHVzXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5cblxuY2xhc3MgVXNlcklucHV0IHtcbiAgICBjb25zdHJ1Y3RvcihrZXlBY3Rpb25NYXApIHtcbiAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXAgPSBrZXlBY3Rpb25NYXBcblxuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSB0aGlzLnRyeUFjdGlvbkZvckV2ZW50LmJpbmQodGhpcylcbiAgICB9XG5cbiAgICB0cnlBY3Rpb25Gb3JFdmVudChldmVudCkge1xuICAgICAgICBpZiAoIVV0aWxpdHkuY29udGFpbnModGhpcy5rZXlBY3Rpb25NYXAsIGV2ZW50LmtleUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgbm90IGEgdmFsaWQga2V5Y29kZTogJHtldmVudC5rZXlDb2RlfWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmtleUFjdGlvbk1hcFtldmVudC5rZXlDb2RlXSgpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXNlcklucHV0XG4iLCJsZXQgaWQgPSAwXG5cbmZ1bmN0aW9uIGdlbmVyYXRlSWQoKSB7XG4gICAgaWQgPSBpZCArIDFcbiAgICByZXR1cm4gaWRcbn1cblxuY2xhc3MgVXRpbGl0eSB7XG4gICAgc3RhdGljIGNvbnRhaW5zKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuaW5kZXhPZihTdHJpbmcocHJvcGVydHkpKSAhPT0gLTFcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RyaW5nVG9OdW1iZXIoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcubWF0Y2goL1xcZCsvKVswXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb21pemUobXVsdCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXVsdClcbiAgICB9XG5cbiAgICBzdGF0aWMgSWQoKSB7XG4gICAgICAgIHJldHVybiBnZW5lcmF0ZUlkKClcbiAgICB9XG5cbiAgICBzdGF0aWMgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eVxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudHNMaXN0ID0gW10gICAgICAgIC8vIGNyZWF0ZSBhcnJheSBvZiBldmVudHNcbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoZXZlbnQsIGZuLCB0aGlzVmFsdWUsIG9uY2U9ZmFsc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7ICAgLy8gaWYgbm8gdGhpc1ZhbHVlIHByb3ZpZGVkLCBiaW5kcyB0aGUgZm4gdG8gdGhlIGZuPz9cbiAgICAgICAgICAgIHRoaXNWYWx1ZSA9IGZuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50c0xpc3QucHVzaCh7ICAgICAgLy8gY3JlYXRlIG9iamVjdHMgbGlua2luZyBldmVudHMgKyBmdW5jdGlvbnMgdG8gcGVyZm9ybVxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LCAgICAgICAgICAgLy8gcHVzaCBlbSB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgICAgICB0aGlzVmFsdWU6IHRoaXNWYWx1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHVuc3Vic2NyaWJlKGV2ZW50KSB7XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAvLyAgICAgICAgICAgICBicmVha1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGlzaChldmVudCwgYXJnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGhpc1ZhbHVlLCBmbiwgb25jZSB9ID0gdGhpcy5ldmVudHNMaXN0W2ldXG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzVmFsdWUsIGFyZylcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzTGlzdFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRXZlbnRNYW5hZ2VyKClcbiIsImltcG9ydCBNYXAgZnJvbSAnLi9NYXAnXG5pbXBvcnQgU2NlbmVyeSBmcm9tICcuL1NjZW5lcnknXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4vQ2hhcmFjdGVyJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi9TdGF0dXMnXG5pbXBvcnQgVXNlcklucHV0IGZyb20gJy4vVXNlcklucHV0J1xuaW1wb3J0IEJsdWVwcmludHMgZnJvbSAnLi9CbHVlcHJpbnRzJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcbmltcG9ydCB7IGdlbmVyYXRlSXRlbXMgfSBmcm9tICcuL2l0ZW1zJ1xuaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUnXG5pbXBvcnQgSW52ZW50b3J5RGlzcGxheSBmcm9tICcuL0ludmVudG9yeURpc3BsYXknXG5pbXBvcnQgUHJpbnRlciBmcm9tICcuL1ByaW50ZXInXG5cbmNvbnN0IENPTCA9IDYwXG5jb25zdCBST1cgPSA2MFxuY29uc3QgSVRFTV9OVU0gPSA1XG5cbmNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmluaXRHYW1lKClcbiAgICB9XG5cbiAgICBpbml0R2FtZSgpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzXG5cbiAgICAgICAgaWYgKHRoaXMuaGFzR2FtZUluUHJvZ3Jlc3MoKSkge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSB0aGlzLnJlc3VtZVNldHRpbmdzKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldHRpbmdzID0gdGhpcy5nZW5lcmF0ZVNldHRpbmdzKClcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgbW92ZWQgPSAobG9jYXRpb24pID0+IHtjb25zb2xlLmxvZygnbG9jYXRpb24nLCBsb2NhdGlvbil9XG4gICAgICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoJ21vdmVkLXRvJywgbW92ZWQpXG5cbiAgICAgICAgdGhpcy5sb2FkU2V0dGluZ3Moc2V0dGluZ3MpXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKClcbiAgICB9XG5cbiAgICBoYXNHYW1lSW5Qcm9ncmVzcygpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmhhcygnbWFwJylcbiAgICB9XG5cbiAgICByZXN1bWVTZXR0aW5ncygpIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBtYXBEYXRhOiBzdG9yZS5nZXQoJ21hcCcpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3NcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHt9XG5cbiAgICAgICAgc2V0dGluZ3MubWFwRGF0YSA9IE1hcC5nZW5lcmF0ZSh7IGNvbDogQ09MLCByb3c6ICBST1cgfSlcblxuICAgICAgICBzdG9yZS5zZXQoJ21hcCcsIHNldHRpbmdzLm1hcERhdGEpXG5cbiAgICAgICAgcmV0dXJuIHNldHRpbmdzXG4gICAgfVxuXG4gICAgbG9hZFNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJsdWVwcmludCA9IHRoaXMuYmx1ZXByaW50ID0gQmx1ZXByaW50cy5yYW5kb20oKVxuICAgICAgICBjb25zdCBwcmludGVyID0gdGhpcy5wcmludGVyID0gbmV3IFByaW50ZXIoKVxuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMgPSBnZW5lcmF0ZUl0ZW1zKElURU1fTlVNKVxuXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMuc3RhdHVzID0gbmV3IFN0YXR1cygpXG4gICAgICAgIGNvbnN0IGludmVudG9yeURpc3BsYXkgPSB0aGlzLmludmVudG9yeURpc3BsYXkgPSBuZXcgSW52ZW50b3J5RGlzcGxheSgpXG5cbiAgICAgICAgY29uc3QgbWFwID0gdGhpcy5tYXAgPSBuZXcgTWFwKHNldHRpbmdzLm1hcERhdGEpXG4gICAgICAgIGNvbnN0IHNjZW5lcnkgPSB0aGlzLnNjZW5lcnkgPSBuZXcgU2NlbmVyeShtYXApXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHRoaXMuY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihtYXApXG5cbiAgICAgICAgbWFwLnNldEl0ZW1zKGl0ZW1zKVxuICAgICAgICBtYXAuc2V0Q2hhcmFjdGVyKGNoYXJhY3RlcilcblxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeVxuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQoYmx1ZXByaW50KVxuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQocHJpbnRlcilcblxuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy5pbml0VXNlcklucHV0KGNoYXJhY3RlcilcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc2V0IG1hcCEnKVxuXG4gICAgICAgIHN0b3JlLmNsZWFyKClcblxuICAgICAgICB0aGlzLmluaXRHYW1lKClcbiAgICB9XG5cbiAgICBpbml0VXNlcklucHV0KGNoYXJhY3Rlcikge1xuICAgICAgICByZXR1cm4gbmV3IFVzZXJJbnB1dCh7XG4gICAgICAgICAgICAnODInOiB0aGlzLnJlc2V0LmJpbmQodGhpcyksIC8vIChyKSByZXNldCBtYXBcbiAgICAgICAgICAgICczOCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnbm9ydGgnKSxcbiAgICAgICAgICAgICczNyc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnd2VzdCcpLFxuICAgICAgICAgICAgJzM5JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdlYXN0JyksXG4gICAgICAgICAgICAnNDAnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3NvdXRoJyksXG4gICAgICAgICAgICAnODQnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCd0YWtlJyksIC8vICh0KWFrZSBpdGVtXG4gICAgICAgICAgICAvLyAnNzMnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdjaGVja0ludmVudG9yeScpLCAvLyBjaGVjayAoaSludmVudG9yeVxuICAgICAgICAgICAgJzc3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbWluZScpLCAvLyBkZXBsb3kgcGFydGljbGUgKG0paW5lclxuICAgICAgICAgICAgJzgwJzogY2hhcmFjdGVyLmdldEFjdGlvbigncHJpbnQnKSAvLyB1c2UgcHJpbnRlclxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KCd5b3Ugd2FrZSB1cCcpXG4gICAgICAgIHRoaXMuc3RhdHVzLnNldChgeW91IGFyZSBjYXJyeWluZyAke3RoaXMuYmx1ZXByaW50Lm5hbWV9YCwgNDAwMClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEdhbWUoKTtcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIEludmVudG9yeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMgPSBbXVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtaW52ZW50b3J5JywgdGhpcy5hZGQsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdyZW1vdmUtaW52ZW50b3J5JywgdGhpcy5yZW1vdmUsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtbWluZWQnLCB0aGlzLmFkZE1pbmVkLCB0aGlzKVxuXG4gICAgICAgIHRoaXMuc3RvcmVNaW5pbmcgPSB7fVxuICAgICAgICB0aGlzLm1pbmluZ1N0YXRlT2JqID0ge31cblxuICAgIH1cblxuICAgIGFkZChpdGVtKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMucHVzaChpdGVtKVxuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfVxuXG4gICAgcmVtb3ZlKGl0ZW0pIHtcbiAgICAgICAgY29uc3QgdGhlSXRlbSA9IGl0ZW1cbiAgICAgICAgdGhpcy5jb250ZW50cy5mb3JFYWNoKChpdGVtLCBpLCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSB0aGVJdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50cy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW52ZW50b3J5IGl0ZW0gcmVtb3ZlZCcpXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICAgICAgfX0pXG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2Rpc3BsYXktaW52ZW50b3J5JywgdGhpcy5jb250ZW50cylcbiAgICB9XG5cblxuXG5cblxuXG4gICAgYWRkTWluZWQoY3VycmVudE9iaikge1xuICAgICAgICAvLyBpZiBzdGF0ZSBvYmplY3QgZG9lc24ndCBleGlzdCwgYWRkIGFsbCBwYXJ0aWNsZXMgdG8gc3RvcmFnZVxuICAgICAgICBpZiAoIXRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF0pIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWluaW5nU3RhdGUoY3VycmVudE9iailcbiAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50U3RvcmFnZSh0aGlzLnN0cmlwSUQoY3VycmVudE9iaikpXG5cbiAgICAgICAgLy8gaWYgaXQgZG9lcyBleGlzdCwgY2hlY2sgY3VyciB2cyBzdGF0ZSBhbmQgYWRkIG9ubHkgdGhlIHJpZ2h0IHBhcnRpY2xlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnRTdG9yYWdlKHRoaXMuc3RyaXBJRCh0aGlzLmNoZWNrTWluaW5nU3RhdGUoY3VycmVudE9iaikpKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVNaW5pbmdTdGF0ZShjdXJyZW50T2JqKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGlzcGxheVBhcnRpY2xlcyA9IHRoaXMuc3RvcmVNaW5pbmdcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LW1pbmVkJywgZGlzcGxheVBhcnRpY2xlcylcbn1cblxuXG4gICAgY2hlY2tNaW5pbmdTdGF0ZShjdXJyZW50T2JqKSB7XG4gICAgICAgIGNvbnN0IGNoZWNrZWRPYmogPSB7fVxuICAgICAgICBPYmplY3Qua2V5cyhjdXJyZW50T2JqKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoIWNoZWNrZWRPYmpba2V5XSkge1xuICAgICAgICAgICAgICAgIGNoZWNrZWRPYmpba2V5XSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXVtrZXldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXVtrZXldID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hlY2tlZE9ialtrZXldID0gY3VycmVudE9ialtrZXldIC0gdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXVtrZXldXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBjaGVja2VkT2JqXG4gICAgfVxuXG5cbiAgICBpbmNyZW1lbnRTdG9yYWdlKHBhcnRpY2xlT2JqKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHBhcnRpY2xlT2JqKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RvcmVNaW5pbmdba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVNaW5pbmdba2V5XSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RvcmVNaW5pbmdba2V5XSArPSBwYXJ0aWNsZU9ialtrZXldXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICB1cGRhdGVNaW5pbmdTdGF0ZShjdXJyZW50T2JqKSB7XG4gICAgICAgIHRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF0gPSBPYmplY3QuYXNzaWduKHt9LCBjdXJyZW50T2JqKVxuICAgIH1cblxuXG4gICAgc3RyaXBJRChjdXJyZW50T2JqKSB7XG4gICAgICAgIGNvbnN0IHBhcnRpY2xlT2JqID0ge31cbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudE9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKGtleSAhPT0gJ0lEJykge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlT2JqW2tleV0gPSBjdXJyZW50T2JqW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHBhcnRpY2xlT2JqXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJbnZlbnRvcnlcbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICdqcy9Nb3ZlYWJsZSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJ2pzL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJ2pzL2V2ZW50TWFuYWdlcidcblxuXG4vLyBjb25zdCBJVEVNUyA9IHtcbi8vICAgICBtaW5lcjoge1xuLy8gICAgICAgICBuYW1lOiAncGFydGljbGUgbWluZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICd8Jyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdtaW5lcywgZGl2aWRlcywgYW5kIHN0b3JlcyBhbWJpZW50IGNoZW1pY2FsIGVsZW1lbnRzIGFuZCBsYXJnZXIgY29tcG91bmRzIGZvdW5kIHdpdGhpbiBhIDEwMCBtZXRlciByYWRpdXMuIDk3JSBhY2N1cmFjeSByYXRlLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tbWluZXInXG4vLyAgICAgfSxcbi8vICAgICBwYXJzZXI6IHtcbi8vICAgICAgICAgbmFtZTogJ25vaXNlIHBhcnNlcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJz8nLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ3Byb3RvdHlwZS4gcGFyc2VzIGF0bW9zcGhlcmljIGRhdGEgZm9yIGxhdGVudCBpbmZvcm1hdGlvbi4gc2lnbmFsLXRvLW5vaXNlIHJhdGlvIG5vdCBndWFyYW50ZWVkLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tcGFyc2VyJ1xuLy8gICAgIH0sXG4vLyAgICAgaW50ZXJmYWNlOiB7XG4vLyAgICAgICAgIG5hbWU6ICdwc2lvbmljIGludGVyZmFjZScsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJyYnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogYGNvbm5lY3RzIHNlYW1sZXNzbHkgdG8gYSBzdGFuZGFyZC1pc3N1ZSBiaW9wb3J0LiBmYWNpbGl0YXRlcyBzdW5kcnkgaW50ZXJhY3Rpb25zIHBlcmZvcm1lZCB2aWEgUFNJLU5FVC5gLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLWludGVyZmFjZSdcbi8vICAgICB9LFxuLy8gICAgIHByaW50ZXI6IHtcbi8vICAgICAgICAgbmFtZTogJ21vbGVjdWxhciBwcmludGVyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnIycsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAnZ2VuZXJhdGVzIG9iamVjdHMgYWNjb3JkaW5nIHRvIGEgYmx1ZXByaW50LiBtb2xlY3VsZXMgbm90IGluY2x1ZGVkLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tcHJpbnRlcidcbi8vICAgICB9XG4vLyB9XG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBNb3ZlYWJsZSB7XG4gICAgY29uc3RydWN0b3IoaXRlbUNvbmZpZykge1xuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgLy8gbWVyZ2UgaW4gY29uZmlnIHByb3BlcnRpZXNcbiAgICAgICAgLy8gY29uc3QgdGFyZ2V0ID0gT2JqZWN0LmFzc2lnbih0aGlzLCBpdGVtQ29uZmlnKVxuXG4gICAgICAgIC8vIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmlkZW50aXR5TnVtYmVyID0gVXRpbGl0eS5JZCgpXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgIC8vIHRoaXMuaW5JbnZlbnRvcnkgPSBmYWxzZVxuXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBzZXRPbk1hcChtYXAsIGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0TWFwKG1hcClcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXMobG9jYXRpb24pXG4gICAgICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLnNldEdyaWRJbmRpY2VzKClcbiAgICAgICAgdGhpcy5zZXREaXYodGhpcy5nZXRJZCgpKVxuICAgICAgICB0aGlzLnVwZGF0ZURpdih0aGlzKVxuXG4vLyBtb3ZlZCB0aGlzIG91dCBzbyB3ZSBhcmUgbm90IGNyZWF0aW5nIGNoaWxkcmVuIGVhY2ggdGltZSB3ZSB3YW50IHRvIHBsYWNlIG9uIG1hcFxuICAgICAgICAvLyB0aGlzLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKVxuICAgIH1cblxuICAgIGdldElkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pZGVudGl0eU51bWJlclxuICAgIH1cblxuICAgIHNldENvb3JkaW5hdGVzKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMubGVmdCA9IGNzc0xlZnRcbiAgICAgICAgdGhpcy50b3AgPSBjc3NUb3BcbiAgICB9XG5cbiAgICBzZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEdyaWRJbmRpY2VzKClcblxuICAgICAgICB0aGlzLnggPSB4XG4gICAgICAgIHRoaXMueSA9IHlcbiAgICB9XG5cbiAgICBzZXREaXYoaWRlbnRpdHlOdW1iZXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpdlNldCkge1xuICAgICAgICAgICAgdGhpcy5kaXYgPSB0aGlzLmRpdiArIGlkZW50aXR5TnVtYmVyXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXZTZXQgPSB0cnVlXG4gICAgfVxuXG5cbiAgICAvLyBzcGVjaWZpYyB0byBpdGVtIGRyYXdpbmc6IHVzZSBvdXRlckhUTUxcbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGVsLm91dGVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgIH1cblxuXG5cbiAgICByZW5kZXJMYXllcih1bml0LCBsYXllcklkKSB7XG4gICAgICAgIGlmICh1bml0LnR5cGUgPT09ICdpdGVtJykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEaXYodW5pdClcbiAgICAgICAgICAgIHRoaXMuZHJhd0xheWVyKGxheWVySWQpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIG9uVGFrZSgpIHtcbiAgICAgICAgdGhpcy54ID0gbnVsbFxuICAgICAgICB0aGlzLnkgPSBudWxsXG4gICAgICAgIHRoaXMub2ZmTWFwID0gdHJ1ZSAvLyBjaGFuZ2VzIGNzcyBkaXNwbGF5IHRvICdub25lJ1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdwYXJ0aWNsZSBtaW5lcic6XG4gICAgICAgICAgICAgICAgdGhpcy5oYWx0TWluaW5nKClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdhZGQtaW52ZW50b3J5JywgdGhpcylcbiAgICAgICAgLy8gdGhpcy5FTS5zdWJzY3JpYmUoJ3JlbW92ZS1pbnZlbnRvcnknLCB0aGlzLm9uRHJvcCwgdGhpcylcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLCB0aGlzLmRpdilcbiAgICB9XG5cbiAgICBvbkRyb3AoKSB7XG5cbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMsIHRydWUpXG4gICAgLy8gICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcywgdGhpcy5kaXYpXG5cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSXRlbVxuIiwiaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcblxuY2xhc3MgUGFydGljbGVNaW5lciBleHRlbmRzIEl0ZW0ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgdGhpcy5uYW1lID0gJ3BhcnRpY2xlIG1pbmVyJ1xuICAgICAgICB0aGlzLnR5cGUgPSAnaXRlbSdcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJ3wnXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSAnbWluZXMsIGRpdmlkZXMsIGFuZCBzdG9yZXMgYW1iaWVudCBjaGVtaWNhbCBlbGVtZW50cyBhbmQgbGFyZ2VyIGNvbXBvdW5kcyBmb3VuZCB3aXRoaW4gYSAxMDAgbWV0ZXIgcmFkaXVzLiA5NyUgYWNjdXJhY3kgcmF0ZS4nXG4gICAgICAgIHRoaXMuZGl2ID0gJ2l0ZW0tbWluZXInXG4gICAgICAgIC8vIG11c3Qgc3Vic2NyaWJlIHRoZSBpdGVtIGRpcmVjdGx5LCBub3Qgb24gdGhlIGFic3RyYWN0IGNsYXNzXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke3RoaXMubmFtZX0tJHt0aGlzLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMub25UYWtlLCB0aGlzKVxuXG4gICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXMgPSB7XG4gICAgICAgICAgICBJRDogdGhpcy5pZGVudGl0eU51bWJlclxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBtaW5lKGxvY2F0aW9uKSB7XG4gICAgICAgIC8vIHRyeSBzZXR0aW5nIHRoZSBsb2NhdGlvbiBpbW1lZGlhdGVseSwgdXNpbmcgVEhJU1xuXG4gICAgICAgIHRoaXMubG9jYWxlID0gdGhpcy5tYXBbbG9jYXRpb25bMV1dW2xvY2F0aW9uWzBdXVxuXG4gICAgICAgIHRoaXMuc2V0TWluaW5nQ29uZmlnKClcblxuICAgICAgICAvLyBjYWxjdWxhdGUgcmF0aW9zIG9uY2UsIHJhdGhlciB0aGFuIHcgZXZlcnkgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy5kZXRlcm1pbmVQYXJ0aWNsZVJhdGlvcygpXG4gICAgICAgIHRoaXMuY2hlY2tQYXJ0aWNsZUFtb3VudHMoKVxuICAgICAgICB0aGlzLmNhbmNlbGxhdGlvbktleSA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrUGFydGljbGVBbW91bnRzKClcbiAgICAgICAgfSwgMzAwMClcblxuICAgICAgICB0aGlzLnNldE9uTWFwKHRoaXMubWFwLCBsb2NhdGlvbilcbiAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgIH1cblxuICAgIHNldE1pbmluZ0NvbmZpZygpIHtcbiAgICAgICAgdGhpcy5vZmZNYXAgPSBmYWxzZVxuICAgICAgICBpZiAoIXRoaXMubWluaW5nKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmluZyA9ICdmdWxsJ1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGV0ZXJtaW5lUGFydGljbGVSYXRpb3MoKSB7XG4gICAgICAgIHRoaXMuYWxsUGFydGljbGVzID0gW11cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5sb2NhbGUucGFydGljbGVzKS5mb3JFYWNoKHBhcnRpY2xlID0+IHtcbiAgICAgICAgICAgIGxldCBudW1iZXJPZlBhcnRpY2xlcyA9IHRoaXMubG9jYWxlLnBhcnRpY2xlc1twYXJ0aWNsZV1cbiAgICAgICAgICAgIHdoaWxlIChudW1iZXJPZlBhcnRpY2xlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuYWxsUGFydGljbGVzLnB1c2gocGFydGljbGUpXG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZQYXJ0aWNsZXMtLVxuICAgICAgICB9fSlcbiAgICB9XG5cblxuICAgIGV4dHJhY3RQYXJ0aWNsZXMoKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbVBhcnRpY2xlID0gdGhpcy5hbGxQYXJ0aWNsZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5hbGxQYXJ0aWNsZXMubGVuZ3RoKV1cbiAgICAgICAgaWYgKCF0aGlzLm1pbmVkUGFydGljbGVzW3JhbmRvbVBhcnRpY2xlXSkge1xuICAgICAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0gPSAxXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1pbmVkUGFydGljbGVzW3JhbmRvbVBhcnRpY2xlXSsrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWluZWRPYmogPSB0aGlzLm1pbmVkUGFydGljbGVzXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnYWRkLW1pbmVkJywgbWluZWRPYmopXG4gICAgfVxuXG5cblxuICAgIGNoZWNrUGFydGljbGVBbW91bnRzKCkge1xuICAgICAgICBpZiAodGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmluZyA9ICdlbXB0eSdcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQgPj0gKHRoaXMubG9jYWxlLm1heFBhcnRpY2xlcyAvIDIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbmcgPSAnZnVsbCdcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudC0tXG4gICAgICAgICAgICAgICAgdGhpcy5leHRyYWN0UGFydGljbGVzKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQgPCAodGhpcy5sb2NhbGUubWF4UGFydGljbGVzIC8gMikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmluZyA9ICdoYWxmJ1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50LS1cbiAgICAgICAgICAgICAgICB0aGlzLmV4dHJhY3RQYXJ0aWNsZXMoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgIH1cblxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZURpdih0aGlzKVxuICAgICAgICB0aGlzLmRyYXdMYXllcih0aGlzLmRpdilcbiAgICB9XG5cblxuICAgIGhhbHRNaW5pbmcoKSB7XG4gICAgICAgIC8vIHRoaXMubWluaW5nID0gZmFsc2VcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5jYW5jZWxsYXRpb25LZXkpXG4gICAgfVxuXG5cblxuXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFydGljbGVNaW5lclxuIiwiaW1wb3J0IFBhcnRpY2xlTWluZXIgZnJvbSAnLi9QYXJ0aWNsZU1pbmVyJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcblxuY29uc3QgSVRFTVMgPSBbXG4gICAgUGFydGljbGVNaW5lclxuXVxuXG5mdW5jdGlvbiByYW5kb21JdGVtKCkge1xuICAgIHJldHVybiBuZXcgSVRFTVNbVXRpbGl0eS5yYW5kb21pemUoSVRFTVMubGVuZ3RoKV1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVJdGVtcyhudW1iZXI9MSkge1xuICAgIGNvbnN0IGl0ZW1zID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlcjsgaSsrKSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocmFuZG9tSXRlbSgpKVxuICAgIH1cbiAgICByZXR1cm4gaXRlbXNcbn1cblxuXG5leHBvcnQge1xuICAgIGdlbmVyYXRlSXRlbXNcbn1cbiIsImNvbnN0IHBhcnRpY2xlRGF0YSA9IHtcbiAgICBjb3BwZXI6IHtcbiAgICAgICAgbmFtZTogJ2NvcHBlcicsXG4gICAgICAgIHR5cGU6ICdtZXRhbHMnXG4gICAgfSxcblxuICAgIGNocm9tZToge1xuICAgICAgICBuYW1lOiAnY2hyb21lJyxcbiAgICAgICAgdHlwZTogJ21ldGFscydcbiAgICB9LFxuXG4gICAgbGVhZDoge1xuICAgICAgICBuYW1lOiAnbGVhZCcsXG4gICAgICAgIHR5cGU6ICdtZXRhbHMnXG4gICAgfSxcblxuICAgIGlyb246IHtcbiAgICAgICAgbmFtZTogJ2lyb24nLFxuICAgICAgICB0eXBlOiAnbWV0YWxzJ1xuICAgIH0sXG5cbiAgICBzdHlyb2ZvYW06IHtcbiAgICAgICAgbmFtZTogJ3N0eXJvZm9hbScsXG4gICAgICAgIHR5cGU6ICdzeW50aGV0aWNzJ1xuICAgIH0sXG5cbiAgICBhY3J5bGljOiB7XG4gICAgICAgIG5hbWU6ICdhY3J5bGljJyxcbiAgICAgICAgdHlwZTogJ3N5bnRoZXRpY3MnXG4gICAgfSxcblxuICAgIGxhdGV4OiB7XG4gICAgICAgIG5hbWU6ICdsYXRleCcsXG4gICAgICAgIHR5cGU6ICdzeW50aGV0aWNzJ1xuICAgIH0sXG5cbiAgICB3b29kOiB7XG4gICAgICAgIG5hbWU6ICd3b29kJyxcbiAgICAgICAgdHlwZTogJ29yZ2FuaWNzJ1xuICAgIH0sXG5cbiAgICBmaWJlcjoge1xuICAgICAgICBuYW1lOiAnZmliZXInLFxuICAgICAgICB0eXBlOiAnb3JnYW5pY3MnXG4gICAgfSxcblxuICAgIGJvbmU6IHtcbiAgICAgICAgbmFtZTogJ2JvbmUnLFxuICAgICAgICB0eXBlOiAnb3JnYW5pY3MnXG4gICAgfSxcblxuICAgIGdsYXNzOiB7XG4gICAgICAgIG5hbWU6ICdnbGFzcycsXG4gICAgICAgIHR5cGU6ICdzcGVjaWFsJ1xuICAgIH0sXG5cbiAgICBzaWxpY29uOiB7XG4gICAgICAgIG5hbWU6ICdzaWxpY29uJyxcbiAgICAgICAgdHlwZTogJ3NwZWNpYWwnXG5cbiAgICB9LFxuICAgIGNlcmFtaWM6IHtcbiAgICAgICAgbmFtZTogJ2NlcmFtaWMnLFxuICAgICAgICB0eXBlOiAnc3BlY2lhbCdcblxuICAgIH0sXG4gICAgbWVyY3VyeToge1xuICAgICAgICBuYW1lOiAnbWVyY3VyeScsXG4gICAgICAgIHR5cGU6ICdzcGVjaWFsJ1xuICAgIH0sXG5cbiAgICBjYXJib246IHtcbiAgICAgICAgbmFtZTogJ2NhcmJvbicsXG4gICAgICAgIHR5cGU6ICdzcGVjaWFsJ1xuICAgIH0sXG5cbiAgICBvem9uZToge1xuICAgICAgICBuYW1lOiAnb3pvbmUnLFxuICAgICAgICB0eXBlOiAnc3BlY2lhbCdcbiAgICB9LFxuXG4gICAgYmVuemVuZToge1xuICAgICAgICBuYW1lOiAnYmVuemVuZScsXG4gICAgICAgIHR5cGU6ICdzcGVjaWFsJ1xuICAgIH0sXG5cbiAgICB1cmFuaXVtOiB7XG4gICAgICAgIG5hbWU6ICd1cmFuaXVtJyxcbiAgICAgICAgdHlwZTogJ3NwZWNpYWwnXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IHBhcnRpY2xlRGF0YVxuIiwiaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuY2xhc3MgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG5cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cubG9jYWxTdG9yYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGxvY2Fsc3RvcmFnZSwgc2F2aW5nIGRpc2FibGVkJylcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydCgnc2F2aW5nIGRpc2FibGVkJylcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UuY2xlYXIoKVxuICAgIH1cblxuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpICE9PSBudWxsKVxuICAgIH1cblxuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdG9yZS5zZXQnLCBrZXkpXG5cbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpXG4gICAgfVxuXG4gICAgZ2V0KGtleSkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RvcmUuZ2V0Jywga2V5KVxuXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTdG9yZSgpXG4iXX0=
