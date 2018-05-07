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
                miner.mine(location);
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

var _eventManager = require('./eventManager');

var _eventManager2 = _interopRequireDefault(_eventManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InventoryDisplay = function () {
    function InventoryDisplay() {
        _classCallCheck(this, InventoryDisplay);

        this.EM = _eventManager2.default;
        this.EM.subscribe('display-inventory', this.displayInventory, this);
        this.EM.subscribe('display-mined', this.displayMined, this);
    }

    _createClass(InventoryDisplay, [{
        key: 'displayMined',
        value: function displayMined(minedElementsObject) {

            var str = this.cleanJSONString(JSON.stringify(minedElementsObject));

            str = 'PARTICLES MINED <br><br>' + str;

            this.set(str);
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
        key: 'displayInventory',
        value: function displayInventory(inventoryObject) {
            this.set(inventoryObject, 10);
        }
    }, {
        key: 'set',
        value: function set(description) {
            var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            window.setTimeout(function () {
                document.getElementById('inventoryDisplay').innerHTML = description;
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

        // untested

    }, {
        key: 'remove',
        value: function remove(item) {
            var _this3 = this;

            var theItem = item;
            this.contents.forEach(function (item, i, array) {
                if (array[i] === theItem) {
                    _this3.contents.splice(i, 1);
                    // } else {
                    // console.log('item not in inventory')
                }
            });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0ludmVudG9yeURpc3BsYXkuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIiwic3JjL2pzL2l0ZW1zL0l0ZW0uanMiLCJzcmMvanMvaXRlbXMvUGFydGljbGVNaW5lci5qcyIsInNyYy9qcy9pdGVtcy9pbmRleC5qcyIsInNyYy9qcy9zdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLE9BQU8sSUFBUDs7Ozs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7QUFHQSxJQUFNLGdCQUFnQjtBQUNsQixzQkFBa0I7QUFDZCxjQUFNLCtCQURRO0FBRWQscUJBQWEsRUFGQztBQUdkLG1CQUFXLEVBSEc7QUFJZCxzQkFBYztBQUpBLEtBREE7QUFPbEIsb0JBQWdCO0FBQ1osY0FBTSw2QkFETTtBQUVaLHFCQUFhLEVBRkQ7QUFHWixtQkFBVyxFQUhDO0FBSVosc0JBQWM7QUFKRixLQVBFO0FBYWxCLG1CQUFlO0FBQ1gsY0FBTSw0QkFESztBQUVYLHFCQUFhLEVBRkY7QUFHWCxtQkFBVyxFQUhBO0FBSVgsc0JBQWM7QUFKSDtBQWJHLENBQXRCOztJQXNCTSxTO0FBQ0YsdUJBQVksSUFBWixF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QkFBTyxLQUFQLENBQWEsaUJBQWI7QUFDQSxpQkFBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0gsU0FKRCxNQUlPO0FBQ0gsaUJBQUssUUFBTCxHQUFnQixLQUFoQjtBQUNBLGlCQUFLLE9BQUwsR0FBZSxPQUFPLFlBQXRCO0FBQ0g7QUFDSjs7OztnQ0FFTztBQUNKLGlCQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ0g7Ozs0QkFFRyxHLEVBQUs7QUFDTCxtQkFBUSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEdBQXJCLE1BQThCLElBQXRDO0FBQ0g7Ozs0QkFFRyxHLEVBQUssSyxFQUFPO0FBQ1osb0JBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsR0FBekI7O0FBRUEsaUJBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsRUFBMEIsS0FBSyxTQUFMLENBQWUsS0FBZixDQUExQjtBQUNIOzs7NEJBRUcsRyxFQUFLO0FBQ0wsb0JBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsR0FBekI7O0FBRUEsbUJBQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixDQUFYLENBQVA7QUFDSDs7Ozs7O2tCQUlVLElBQUksS0FBSixFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2pzL2dhbWUnXG5cbndpbmRvdy5nYW1lID0gZ2FtZVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNvbnN0IGJsdWVwcmludERhdGEgPSB7XG4gICAgYXJ0aWZpY2lhbE11c2NsZToge1xuICAgICAgICBuYW1lOiAnYXJ0aWZpY2lhbCBtdXNjbGUgKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHJldGluYWxEaXNwbGF5OiB7XG4gICAgICAgIG5hbWU6ICdyZXRpbmFsIGRpc3BsYXkgKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHByb3N0aGV0aWNBcm06IHtcbiAgICAgICAgbmFtZTogJ3Byb3N0aGV0aWMgYXJtIChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfVxufVxuXG5cbmNsYXNzIEJsdWVwcmludCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9tKCkge1xuICAgICAgICBjb25zdCBibHVlcHJpbnRWYWx1ZXMgPSBPYmplY3QudmFsdWVzKGJsdWVwcmludERhdGEpXG4gICAgICAgIGNvbnN0IGluZGV4ID0gVXRpbGl0eS5yYW5kb21pemUoYmx1ZXByaW50VmFsdWVzLmxlbmd0aClcblxuICAgICAgICBjb25zdCByYW5kb21CbHVlcHJpbnQgPSBibHVlcHJpbnRWYWx1ZXNbaW5kZXhdXG5cbiAgICAgICAgcmV0dXJuIG5ldyBCbHVlcHJpbnQocmFuZG9tQmx1ZXByaW50Lm5hbWUsIHJhbmRvbUJsdWVwcmludC5kZXNjcmlwdGlvbilcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQmx1ZXByaW50XG5cbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICcuL01vdmVhYmxlJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5cblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgTW92ZWFibGUgeyAgLy8gQ2hhcmFjdGVyIGRhdGEgYW5kIGFjdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXBJbnN0YW5jZSwgaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgIHN1cGVyKG1hcEluc3RhbmNlKVxuICAgICAgICB0aGlzLm1hcEluc3RhbmNlID0gbWFwSW5zdGFuY2VcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeS5jb250ZW50c1xuXG4gICAgICAgIGxldCBwb3NpdGlvblxuICAgICAgICBpZiAoaW5pdGlhbFBvc2l0aW9uKSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGluaXRpYWxQb3NpdGlvblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zaXRpb24gPSBtYXBJbnN0YW5jZS5nZXRNYXBDZW50ZXIoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRJbml0aWFsR3JpZEluZGljZXMocG9zaXRpb24pXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFyYWN0ZXIgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2FjdG9yJykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTcGFuKHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3Vic2NyaWJlSXRlbXNUb01hcCgpIHtcbiAgICAgICAgLy8gTk9UIFJFUVVJUkVEIEFUIFRIRSBNT01FTlRcblxuICAgICAgICAvLyB0aGlzLm1hcC5pdGVtc09uTWFwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIC8vICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHtpdGVtLm5hbWV9LSR7aXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLnRha2VJdGVtLCB0aGlzLCB0cnVlKVxuICAgICAgICAvLyB9KVxuICAgIH1cblxuICAgIGdldFBvc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmlkSW5kaWNlc1xuICAgIH1cblxuICAgIGdldENoYXJhY3RlcigpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSB7XG4gICAgICAgICAgICBuYW1lOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdhY3RvcicsXG4gICAgICAgICAgICBlbGVtZW50OiAnQCcsXG4gICAgICAgICAgICBjbHM6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgbGVmdDogY3NzTGVmdCxcbiAgICAgICAgICAgIHRvcDogY3NzVG9wLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hhcmFjdGVyXG4gICAgfVxuXG4gICAgZ2V0QWN0aW9uKGZuTmFtZSwgYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2ZuTmFtZV0uYmluZCh0aGlzLCBhcmcpXG4gICAgfVxuXG4gICAgbW92ZShkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IHRoaXMudXBkYXRlR3JpZEluZGljZXModGhpcy5nZXRDaGFyYWN0ZXIoKSwgRElSRUNUSU9OU1tkaXJlY3Rpb25dKVxuICAgICAgICB0aGlzLnByaW50TG9jYWxTdGF0dXMoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogdGhpcy5sb2NhdGlvbi54LFxuICAgICAgICAgICAgeTogdGhpcy5sb2NhdGlvbi55XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ21vdmVkLXRvJywgcG9zaXRpb24pXG4gICAgfVxuXG4gICAgcHJpbnRMb2NhbFN0YXR1cygpIHtcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLmxvY2F0aW9uKVxuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG5cbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgaWYgKGxvY2FsSXRlbS5taW5pbmcgPT09ICdlbXB0eScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICdtaW5pbmcgaGFzIGJlZW4gZXhoYXVzdGVkIGZvciB0aGlzIHJlZ2lvbicpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxvY2FsSXRlbS5taW5pbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICdhIG1pbmVyIHB1bGxzIGNvbXBvdW5kcyBmcm9tIHRoZSByZWdpb24nKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2Rpc3BsYXktaXRlbScsIGxvY2FsSXRlbS5uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWxJdGVtKCkge1xuICAgICAgICBjb25zdCBjaGFyID0gdGhpcy5nZXRDaGFyYWN0ZXIoKVxuICAgICAgICBsZXQgbG9jYWxJdGVtID0gbnVsbFxuXG4gICAgICAgIHRoaXMubWFwSW5zdGFuY2UuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY2hhci54ICYmIGl0ZW0ueSA9PT0gY2hhci55KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxJdGVtID0gaXRlbVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBsb2NhbEl0ZW1cbiAgICB9XG5cbiAgICB0YWtlKCkge1xuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG5cbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGAke2xvY2FsSXRlbS5uYW1lfS0ke2xvY2FsSXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gKVxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBgJHtsb2NhbEl0ZW0ubmFtZX0gdGFrZW5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAndGhlcmUgaXMgbm90aGluZyBoZXJlIHdvcnRoIHRha2luZycpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0ludmVudG9yeSgpIHtcbiAgICAgICAgY29uc3QgY2FycnlpbmcgPSB0aGlzLmludmVudG9yeS5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpLmpvaW4oJyB8ICcpXG4gICAgICAgIGNvbnN0IHRleHQgPSBgeW91IGFyZSBjYXJyeWluZzogJHtjYXJyeWluZ31gXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgdGV4dClcbiAgICB9XG5cbiAgICBmaW5kSW52ZW50b3J5SXRlbShpdGVtTmFtZSkge1xuICAgICAgICBsZXQgZm91bmRJdGVtID0gbnVsbFxuXG4gICAgICAgIHRoaXMuaW52ZW50b3J5LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBpdGVtTmFtZSkge1xuICAgICAgICAgICAgICAgIGZvdW5kSXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZm91bmRJdGVtXG4gICAgfVxuXG4gICAgbWluZSgpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgY29uc3QgbWluZXIgPSB0aGlzLmZpbmRJbnZlbnRvcnlJdGVtKCdwYXJ0aWNsZSBtaW5lcicpXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gW2NoYXIueCwgY2hhci55XVxuXG4gICAgICAgIGlmIChtaW5lcikge1xuICAgICAgICAgICAgbWluZXIubWluZShsb2NhdGlvbilcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgncmVtb3ZlLWludmVudG9yeScsIG1pbmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAneW91IGRvIG5vdCBoYXZlIGFueSBwYXJ0aWNsZSBtaW5lcnMnKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiY29uc3QgRElSRUNUSU9OUyA9IHtcbiAgICBub3J0aDogeyB4OiAwLCB5OiAtMSB9LFxuICAgIHNvdXRoOiB7IHg6IDAsIHk6IDEgfSxcbiAgICBlYXN0OiB7IHg6IDEsIHk6IDAgfSxcbiAgICB3ZXN0OiB7IHg6IC0xLCB5OiAwIH0sXG4gICAgbm9ydGh3ZXN0OiB7IHg6IC0xLCB5OiAtMSB9LFxuICAgIG5vcnRoZWFzdDogeyB4OiAxLCB5OiAtMSB9LFxuICAgIHNvdXRoZWFzdDogeyB4OiAxLCB5OiAxIH0sXG4gICAgc291dGh3ZXN0OiB7IHg6IC0xLCB5OiAxIH1cbn1cblxuXG5leHBvcnQgeyBESVJFQ1RJT05TIH1cbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIEludmVudG9yeURpc3BsYXkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdkaXNwbGF5LWludmVudG9yeScsIHRoaXMuZGlzcGxheUludmVudG9yeSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktbWluZWQnLCB0aGlzLmRpc3BsYXlNaW5lZCwgdGhpcylcbiAgICB9XG5cblxuXG4gICAgZGlzcGxheU1pbmVkKG1pbmVkRWxlbWVudHNPYmplY3QpIHtcblxuICAgICAgICBsZXQgc3RyID0gdGhpcy5jbGVhbkpTT05TdHJpbmcoSlNPTi5zdHJpbmdpZnkobWluZWRFbGVtZW50c09iamVjdCkpXG5cbiAgICAgICAgc3RyID0gJ1BBUlRJQ0xFUyBNSU5FRCA8YnI+PGJyPicgKyBzdHJcblxuICAgICAgICB0aGlzLnNldChzdHIpXG4gICAgfVxuXG5cbiAgICBjbGVhbkpTT05TdHJpbmcoc3RyKSB7XG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cIi9nLCAnJylcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoLzovZywgJyAnKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvey9nLCAnJylcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL30vZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8sL2csICc8YnI+JylcblxuICAgICAgICByZXR1cm4gc3RyXG4gICAgfVxuXG5cblxuXG5cbiAgICBkaXNwbGF5SW52ZW50b3J5KGludmVudG9yeU9iamVjdCkge1xuICAgICAgICB0aGlzLnNldChpbnZlbnRvcnlPYmplY3QsIDEwKVxuICAgIH1cblxuXG4gICAgc2V0KGRlc2NyaXB0aW9uLCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnZlbnRvcnlEaXNwbGF5JykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEludmVudG9yeURpc3BsYXlcbiIsImNsYXNzIExhbmRzY2FwZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZlYXR1cmVzID0gdGhpcy5mZWF0dXJlcygpXG4gICAgICAgIHRoaXMuYmFyZSA9IHRoaXMuYmFyZSgpXG4gICAgfVxuXG4gICAgZmVhdHVyZXMoKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZCA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcuJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFpciBpcyBjaG9rZWQgd2l0aCBkdXN0LCBzdGF0aWMsIHdpZmknLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI1LFxuICAgICAgICAgICAgY2xzOiAncGVyaW9kJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgY2hyb21lOiAxNSxcbiAgICAgICAgICAgICAgICBsZWFkOiAzMCxcbiAgICAgICAgICAgICAgICBzdHlyb2ZvYW06IDMwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIGh5ZHJvY2FyYm9uczogMTUsXG4gICAgICAgICAgICAgICAgc2lsaWNvbjogMTAsXG4gICAgICAgICAgICAgICAgY2VyYW1pYzogMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tbWEgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnLCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3NwcmF3bCBvZiBzbWFydCBob21lcywgY3VsLWRlLXNhY3MsIGxhbmV3YXlzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNixcbiAgICAgICAgICAgIGNsczogJ2NvbW1hJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGlyb246IDMwLFxuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgbGF0ZXg6IDE1LFxuICAgICAgICAgICAgICAgIHdvb2Q6IDIwLFxuICAgICAgICAgICAgICAgIGh5ZHJvY2FyYm9uczogMTUsXG4gICAgICAgICAgICAgICAgZ2xhc3M6IDMwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwXG5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pY29sb24gPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnOycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3Jvd3Mgb2YgZ3JlZW5ob3VzZXM6IHNvbWUgc2hhdHRlcmVkIGFuZCBiYXJyZW4sIG90aGVycyBvdmVyZ3Jvd24nLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI0LFxuICAgICAgICAgICAgY2xzOiAnc2VtaWNvbG9uJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGlyb246IDMwLFxuICAgICAgICAgICAgICAgIHdvb2Q6IDIwLFxuICAgICAgICAgICAgICAgIGZpYmVyOiAxMCxcbiAgICAgICAgICAgICAgICBib25lOiAxMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBvem9uZTogMTUsXG4gICAgICAgICAgICAgICAgZ2xhc3M6IDMwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwXG5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncmF2ZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdeJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnYSBzaGltbWVyaW5nIGZpZWxkIG9mIHNvbGFyIHBhbmVscywgYnJva2VuIGFuZCBjb3Jyb2RlZCcsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjIsXG4gICAgICAgICAgICBjbHM6ICdncmF2ZScsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIG1lcmN1cnk6IDEwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIGZpYmVyOiAxMCxcbiAgICAgICAgICAgICAgICBvem9uZTogMTUsXG4gICAgICAgICAgICAgICAgYmVuemVuZTogMjAsXG4gICAgICAgICAgICAgICAgZ2xhc3M6IDMwLFxuICAgICAgICAgICAgICAgIGNlcmFtaWM6IDEwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMFxuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXN0ZXJpc2sgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnKicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2hvbGxvdyB1c2VycyBqYWNrIGluIGF0IHRoZSBkYXRhaHVicycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjAsXG4gICAgICAgICAgICBjbHM6ICdhc3RlcmlzaycsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBjaHJvbWU6IDE1LFxuICAgICAgICAgICAgICAgIGxlYWQ6IDMwLFxuICAgICAgICAgICAgICAgIG1lcmN1cnk6IDEwLFxuICAgICAgICAgICAgICAgIHN0eXJvZm9hbTogMzAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgYmVuemVuZTogMjAsXG4gICAgICAgICAgICAgICAgc2lsaWNvbjogMTAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGVyaW9kLCBjb21tYSwgc2VtaWNvbG9uLCBzZW1pY29sb24sIGFzdGVyaXNrLCBhc3RlcmlzaywgZ3JhdmUsIGdyYXZlXVxuICAgIH1cblxuICAgIGJhcmUoKSB7XG4gICAgICAgIGNvbnN0IGJhcmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnJm5ic3A7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnY29uY3JldGUgYW5kIHR3aXN0ZWQgcmViYXIgc3RyZXRjaCB0byB0aGUgaG9yaXpvbicsXG4gICAgICAgICAgICBjbHM6ICdibGFuaycsXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBjaHJvbWU6IDE1LFxuICAgICAgICAgICAgICAgIGxlYWQ6IDMwLFxuICAgICAgICAgICAgICAgIG1lcmN1cnk6IDEwLFxuICAgICAgICAgICAgICAgIHN0eXJvZm9hbTogMzAsXG4gICAgICAgICAgICAgICAgYm9uZTogMTAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICB1cmFuaXVtOiAxMCxcbiAgICAgICAgICAgICAgICBjYXJib246IDIwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmFyZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFuZHNjYXBlRGF0YVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBNYXBHZW5lcmF0b3IgZnJvbSAnLi9NYXBHZW5lcmF0b3InXG5cbmNsYXNzIE1hcCB7XG4gICAgY29uc3RydWN0b3IobWFwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZygnbWFwIGNvbnN0cnVjdG9yJywgbWFwRGF0YSlcblxuICAgICAgICB0aGlzLm1hcCA9IG1hcERhdGFcbiAgICAgICAgdGhpcy5jb2wgPSBNYXAuZ2V0Q29sKG1hcERhdGEpXG4gICAgICAgIHRoaXMucm93ID0gTWFwLmdldFJvdyhtYXBEYXRhKVxuXG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcCA9IFtdXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q29sKG1hcERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1hcERhdGEubGVuZ3RoXG4gICAgfVxuXG4gICAgc3RhdGljIGdldFJvdyhtYXBEYXRhKSB7XG4gICAgICAgIHJldHVybiBtYXBEYXRhWzBdLmxlbmd0aFxuICAgIH1cblxuICAgIHN0YXRpYyBnZW5lcmF0ZSh7IGNvbCwgcm93IH0pIHtcbiAgICAgICAgY29uc3QgbWFwR2VuZXJhdG9yID0gbmV3IE1hcEdlbmVyYXRvcigpXG5cbiAgICAgICAgcmV0dXJuIG1hcEdlbmVyYXRvci5nZW5lcmF0ZSh7IGNvbCwgcm93fSlcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcFxuICAgIH1cblxuICAgIGdldE1hcENlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHRoaXMuY29sLzIpLCBNYXRoLmZsb29yKHRoaXMucm93LzIpXVxuICAgIH1cblxuICAgIGdldFJhbmRvbU1hcExvY2F0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1V0aWxpdHkucmFuZG9taXplKHRoaXMucm93IC0gMSksIFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSldXG4gICAgfVxuXG4gICAgc2V0Q2hhcmFjdGVyKGNoYXJhY3Rlcikge1xuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IGNoYXJhY3RlclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5zZXRNYXAodGhpcy5tYXApXG4gICAgfVxuXG4gICAgc2V0SXRlbXMoaXRlbXMpIHtcbiAgICAgICAgaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tTWFwTG9jYXRpb24gPSB0aGlzLmdldFJhbmRvbU1hcExvY2F0aW9uKClcbiAgICAgICAgICAgIGl0ZW0uc2V0T25NYXAodGhpcy5tYXAsIHJhbmRvbU1hcExvY2F0aW9uKVxuICAgICAgICAgICAgaXRlbS5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJykgIC8vIG1vdmVkIGNoaWxkRWxlbWVudCBjcmVhdGlvbiBvdXQgb2YgJ3NldE9uTWFwJ1xuICAgICAgICAgICAgdGhpcy5wdXNoSXRlbShpdGVtKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1c2hJdGVtKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwLnB1c2goaXRlbSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcFxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IExhbmRzY2FwZURhdGEgZnJvbSAnLi9MYW5kc2NhcGVEYXRhJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuXG5cbmNsYXNzIE1hcEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgZ2VuZXJhdGUoeyBjb2wsIHJvdyB9KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZW5lcmF0aW5nIG1hcCcpXG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG5cbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVEYXRhKClcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMubWFrZUdyaWQoKVxuICAgICAgICBjb25zdCBzZWVkZWRHcmlkID0gdGhpcy5zZWVkKGdyaWQpXG4gICAgICAgIHRoaXMuc2VlZGVkR3JpZCA9IHNlZWRlZEdyaWRcbiAgICAgICAgdGhpcy5ncm93KClcblxuICAgICAgICBjb25zb2xlLmxvZygnbWFwIGdlbmVyYXRlZCcpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VlZGVkR3JpZFxuICAgIH1cblxuICAgIG1ha2VHcmlkKCkge1xuICAgICAgICBjb25zdCBjb2wgPSB0aGlzLmNvbFxuICAgICAgICBjb25zdCByb3cgPSB0aGlzLnJvd1xuICAgICAgICBjb25zdCBncmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICAgICAgZ3JpZFtpXSA9IFtdXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgZ3JpZFtpXS5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgc2VlZChncmlkKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldE51bWJlck9mRWxlbWVudFNlZWRzKCk7IGkrKykge1xuICAgICAgICAgICAgcmFuZG9tRWxlbWVudHMucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXMubGVuZ3RoKV0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VlZHMgPSB0aGlzLmdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cylcbiAgICAgICAgc2VlZHMubWFwKHNlZWQgPT4gZ3JpZFtzZWVkLnldW3NlZWQueF0gPSBzZWVkKVxuICAgICAgICB0aGlzLl9zZWVkcyA9IHNlZWRzXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKSB7XG4gICAgICAgIC8vICByZXR1cm4gMSAgICAgICAgLy8gdGVzdCBzZXR0aW5nXG4gICAgICAgIC8vIHJldHVybiAoKHRoaXMuY29sICogdGhpcy5yb3cpIC8gKHRoaXMuX2NvbCArIHRoaXMucm93KSkgIC8vIHNwYXJzZSBpbml0aWFsIHNlZWRpbmdcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBzZWVkcyA9IHRoaXMuX3NlZWRzXG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdvb2RTZWVkcyA9IFtdXG4gICAgICAgICAgICB0aGlzLmdvb2RTZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5mb3JFYWNoKChzZWVkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2RTZWVkcy5wdXNoKHRoaXMuY2hlY2tTZWVkKHNlZWQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBmb3IgKGxldCBnb29kU2VlZCBvZiBnb29kU2VlZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID09PSB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuY291bnRVbnNlZWRlZExvY2F0aW9ucygpKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5zZWVkZWRHcmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBsZXQgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgaWYgKChzZWVkLnggPCB0aGlzLmNvbCAmJiBzZWVkLnggPj0gMCkgJiZcbiAgICAgICAgICAgIChzZWVkLnkgPCB0aGlzLnJvdyAmJiBzZWVkLnkgPj0gMCkpIHtcbiAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFtzZWVkLnldW3NlZWQueF0gIT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKChzZWVkLnggPT09IGdvb2RTZWVkLngpICYmXG4gICAgICAgICAgICAgICAgKHNlZWQueSA9PT0gZ29vZFNlZWQueSkpIHtcbiAgICAgICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzZWVkU3VjY2VlZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykge1xuICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICBzZWVkcy5mb3JFYWNoKChvcmlnaW5hbFNlZWQpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG4gICAgICAgICAgICAgICAgaWYgKFV0aWxpdHkucHJvYmFiaWxpdHkobmV4dEdlblNlZWQucHJvYmFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkaXJlY3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueCA9IG9yaWdpbmFsU2VlZC54ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnkgPSBvcmlnaW5hbFNlZWQueSArIGRpcmVjdGlvblZhbHVlc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG4gICAgLy8gcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgIC8vICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAvLyAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgLy8gICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICAvLyB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE1hcChtYXApIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgfVxuXG4gICAgZ2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdyaWRJbmRpY2VzWzBdXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdyaWRJbmRpY2VzWzFdXG5cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5tYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLm1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBcInlvdSd2ZSByZWFjaGVkIHRoZSBtYXAncyBlZGdlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uXG4gICAgfVxuXG4gICAgY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykge1xuICAgICAgICBsZXQgbG9jYXRpb25PbkdyaWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHggPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICBjb25zdCB5ID0gbmV3R3JpZEluZGljZXNbMF1cblxuICAgICAgICBpZiAodGhpcy5tYXBbeF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5tYXBbeF1beV1cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uT25HcmlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uT25HcmlkXG4gICAgfVxuXG4gICAgZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXQnKVxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgICBjb25zdCB3aWR0aCA9IFV0aWxpdHkuc3RyaW5nVG9OdW1iZXIoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSlcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSlcbiAgICAgICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9XG4gICAgfVxuXG4gICAgZ2V0Q1NTQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGNzcyA9IHRoaXMuZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKVxuICAgICAgICBjb25zdCBjc3NMZWZ0ID0gdGhpcy5ncmlkSW5kaWNlc1swXSAqIGNzcy5oZWlnaHRcbiAgICAgICAgY29uc3QgY3NzVG9wID0gdGhpcy5ncmlkSW5kaWNlc1sxXSAqIGNzcy53aWR0aFxuICAgICAgICByZXR1cm4geyBjc3NMZWZ0LCBjc3NUb3AgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBNb3ZlYWJsZVxuIiwiY2xhc3MgUmVuZGVyYWJsZSB7ICAvLyBnZW5lcmFsaXplZCByZW5kZXIgZnVuY3Rpb25zIGZvciBTY2VuZXJ5LCBDaGFyYWN0ZXJcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRMYXllcihsYXllcikge1xuICAgICAgICB0aGlzLmxheWVyID0gbGF5ZXJcbiAgICB9XG5cbiAgICBnZXRMYXllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJcbiAgICB9XG5cbiAgICByZW5kZXJTcGFuKHVuaXQpIHtcbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdC50b3AgJiYgdW5pdC5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7dW5pdC50b3B9cHg7IGxlZnQ6ICR7dW5pdC5sZWZ0fXB4YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ1bml0ICR7Y2xzfVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9zcGFuPmBcbiAgICB9XG5cbiAgICByZW5kZXJEaXYoaXRlbSkge1xuICAgICAgICBsZXQgZGl2ID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgZGl2ID0gaXRlbS5kaXZcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpdGVtLmVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS50b3AgJiYgaXRlbS5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7aXRlbS50b3B9cHg7IGxlZnQ6ICR7aXRlbS5sZWZ0fXB4OyBwb3NpdGlvbjogYWJzb2x1dGVgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ub2ZmTWFwKSB7XG4gICAgICAgICAgICBzdHlsZSArPSBgOyBkaXNwbGF5OiBub25lYFxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChpdGVtLm1pbmluZykge1xuICAgICAgICAgICAgY2FzZSAnZnVsbCc6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctZnVsbCAzcyBpbmZpbml0ZWBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnaGFsZic6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctaGFsZiAzcyBpbmZpbml0ZWBcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgICAgICAgIHN0eWxlICs9IGA7IGFuaW1hdGlvbjogbWluaW5nLWVtcHR5IDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYDxkaXYgaWQ9XCIke2Rpdn1cIiBzdHlsZT1cIiR7c3R5bGV9XCI+JHtlbGVtZW50fTwvZGl2PmBcbiAgICB9XG5cbiAgICB1cGRhdGVTcGFuKGFjdG9yKSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5yZW5kZXJTcGFuKGFjdG9yKSlcbiAgICB9XG5cbiAgICB1cGRhdGVEaXYoaXRlbSkge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyRGl2KGl0ZW0pKVxuICAgIH1cblxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG4gICAgY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudChwYXJlbnRMYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50TGF5ZXJJZClcbiAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSAvLyBjcmVhdGVzIGRpdiBpZCB3aXRoaW4gZW5jbG9zaW5nIGRpdiAuLi5cbiAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlcmFibGVcbiIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4vUmVuZGVyYWJsZSdcblxuXG5jbGFzcyBTY2VuZXJ5IGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBTY2VuZXJ5LXNwZWNpZmljIHJlbmRlcmluZyBmdW5jdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLm1hcCA9IG1hcC5nZXRNYXAoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKClcbiAgICAgICAgY29uc29sZS5sb2coJ3NjZW5lcnkgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKCkge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5tYXAubWFwKGFyciA9PiB7IHJldHVybiBhcnIuc2xpY2UoKSB9KVxuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMuY3JlYXRlTGF5ZXIoZ3JpZCkpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVMYXllcihncmlkKSB7XG4gICAgICAgIGNvbnN0IHNjZW5lcnlHcmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3dJdGVtcyA9IGdyaWRbaV1cbiAgICAgICAgICAgIGxldCByb3cgPSAnJyAgLy8gcG9zc2libHkgbWFrZSBlYWNoIHJvdyBhIHRhYmxlP1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyArPSB0aGlzLnJlbmRlclNwYW4ocm93SXRlbXNbaV0pIC8vIGFkZCByZW5kZXJlZCBpdGVtcyB0byB0aGUgZ3JpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NlbmVyeUdyaWQucHVzaChyb3cpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjZW5lcnlHcmlkXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKCkge1xuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBjb25zdCBncmlkVG9IVE1MID0gbGF5ZXIuam9pbignPGJyIC8+JykgIC8vIHVzaW5nIEhUTUwgYnJlYWtzIGZvciBub3dcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZHNjYXBlLWxheWVyJylcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gZ3JpZFRvSFRNTFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTY2VuZXJ5XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLnVwZGF0ZSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktaXRlbScsIHRoaXMuZGlzcGxheUl0ZW0sIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdzdGF0dXMnLCB0aGlzLmRlZmF1bHQsIHRoaXMpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGJlZ2luc1dpdGhWb3dlbCh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TGV0dGVyID0gdGV4dFswXVxuICAgICAgICBjb25zdCB2b3dlbHMgPSBbJ2EnLCAnZScsICdpJywgJ28nLCAndSddXG4gICAgICAgIGxldCBiZWdpbnNXaXRoVm93ZWwgPSBmYWxzZVxuICAgICAgICB2b3dlbHMuZm9yRWFjaCh2b3dlbCA9PiB7XG4gICAgICAgICAgICBpZiAoZmlyc3RMZXR0ZXIgPT09IHZvd2VsKSB7XG4gICAgICAgICAgICAgICAgYmVnaW5zV2l0aFZvd2VsID0gdHJ1ZVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBiZWdpbnNXaXRoVm93ZWxcbiAgICB9XG5cbiAgICBkaXNwbGF5SXRlbShpdGVtTmFtZSkge1xuICAgICAgICBjb25zdCBiZWdpbnNXaXRoVm93ZWwgPSB0aGlzLmJlZ2luc1dpdGhWb3dlbChpdGVtTmFtZSlcbiAgICAgICAgbGV0IHRleHQgPSAnJ1xuICAgICAgICBpZiAoYmVnaW5zV2l0aFZvd2VsKSB7XG4gICAgICAgICAgICB0ZXh0ID0gYHlvdSBzZWUgYW4gJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhICR7aXRlbU5hbWV9IGhlcmVgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXQodGV4dCwgMTApXG4gICAgfVxuXG4gICAgZGVmYXVsdCh0ZXh0KSB7XG4gICAgICAgIHRoaXMuc2V0KHRleHQsIDEwKVxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZGVsYXk9MCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1xuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIFVzZXJJbnB1dCB7XG4gICAgY29uc3RydWN0b3Ioa2V5QWN0aW9uTWFwKSB7XG4gICAgICAgIHRoaXMua2V5QWN0aW9uTWFwID0ga2V5QWN0aW9uTWFwXG5cbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy50cnlBY3Rpb25Gb3JFdmVudC5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgdHJ5QWN0aW9uRm9yRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFVdGlsaXR5LmNvbnRhaW5zKHRoaXMua2V5QWN0aW9uTWFwLCBldmVudC5rZXlDb2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYG5vdCBhIHZhbGlkIGtleWNvZGU6ICR7ZXZlbnQua2V5Q29kZX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXBbZXZlbnQua2V5Q29kZV0oKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJJbnB1dFxuIiwibGV0IGlkID0gMFxuXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICAgIGlkID0gaWQgKyAxXG4gICAgcmV0dXJuIGlkXG59XG5cbmNsYXNzIFV0aWxpdHkge1xuICAgIHN0YXRpYyBjb250YWlucyhvYmosIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmluZGV4T2YoU3RyaW5nKHByb3BlcnR5KSkgIT09IC0xXG4gICAgfVxuXG4gICAgc3RhdGljIHN0cmluZ1RvTnVtYmVyKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nLm1hdGNoKC9cXGQrLylbMF1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9taXplKG11bHQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG11bHQpXG4gICAgfVxuXG4gICAgc3RhdGljIElkKCkge1xuICAgICAgICByZXR1cm4gZ2VuZXJhdGVJZCgpXG4gICAgfVxuXG4gICAgc3RhdGljIHByb2JhYmlsaXR5KHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgY29uc3QgcHJvYmFiaWxpdHlBcnJheSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2godHJ1ZSlcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMCAtIHBlcmNlbnRhZ2U7IGkrKykge1xuICAgICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKGZhbHNlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9iYWJpbGl0eUFycmF5W1V0aWxpdHkucmFuZG9taXplKDEwMCldXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxpdHlcbiIsImNsYXNzIEV2ZW50TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzTGlzdCA9IFtdICAgICAgICAvLyBjcmVhdGUgYXJyYXkgb2YgZXZlbnRzXG4gICAgfVxuXG4gICAgc3Vic2NyaWJlKGV2ZW50LCBmbiwgdGhpc1ZhbHVlLCBvbmNlPWZhbHNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpc1ZhbHVlID09PSAndW5kZWZpbmVkJykgeyAgIC8vIGlmIG5vIHRoaXNWYWx1ZSBwcm92aWRlZCwgYmluZHMgdGhlIGZuIHRvIHRoZSBmbj8/XG4gICAgICAgICAgICB0aGlzVmFsdWUgPSBmblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudHNMaXN0LnB1c2goeyAgICAgIC8vIGNyZWF0ZSBvYmplY3RzIGxpbmtpbmcgZXZlbnRzICsgZnVuY3Rpb25zIHRvIHBlcmZvcm1cbiAgICAgICAgICAgIGV2ZW50OiBldmVudCwgICAgICAgICAgIC8vIHB1c2ggZW0gdG8gdGhlIGFycmF5XG4gICAgICAgICAgICBmbjogZm4sXG4gICAgICAgICAgICBvbmNlOiBvbmNlLFxuICAgICAgICAgICAgdGhpc1ZhbHVlOiB0aGlzVmFsdWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyB1bnN1YnNjcmliZShldmVudCkge1xuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgLy8gICAgICAgICAgICAgYnJlYWtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIHB1Ymxpc2goZXZlbnQsIGFyZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzTGlzdFtpXS5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRoaXNWYWx1ZSwgZm4sIG9uY2UgfSA9IHRoaXMuZXZlbnRzTGlzdFtpXVxuICAgICAgICAgICAgICAgIGZuLmNhbGwodGhpc1ZhbHVlLCBhcmcpXG4gICAgICAgICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNMaXN0LnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEV2ZW50c0xpc3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50c0xpc3RcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50TWFuYWdlcigpXG4iLCJpbXBvcnQgTWFwIGZyb20gJy4vTWFwJ1xuaW1wb3J0IFNjZW5lcnkgZnJvbSAnLi9TY2VuZXJ5J1xuaW1wb3J0IENoYXJhY3RlciBmcm9tICcuL0NoYXJhY3RlcidcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgU3RhdHVzIGZyb20gJy4vU3RhdHVzJ1xuaW1wb3J0IFVzZXJJbnB1dCBmcm9tICcuL1VzZXJJbnB1dCdcbmltcG9ydCBCbHVlcHJpbnRzIGZyb20gJy4vQmx1ZXByaW50cydcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5pbXBvcnQgeyBnZW5lcmF0ZUl0ZW1zIH0gZnJvbSAnLi9pdGVtcydcbmltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlJ1xuaW1wb3J0IEludmVudG9yeURpc3BsYXkgZnJvbSAnLi9JbnZlbnRvcnlEaXNwbGF5J1xuXG5jb25zdCBDT0wgPSA2MFxuY29uc3QgUk9XID0gNjBcbmNvbnN0IElURU1fTlVNID0gNVxuXG5jbGFzcyBHYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdEdhbWUoKSB7XG4gICAgICAgIGxldCBzZXR0aW5nc1xuXG4gICAgICAgIGlmICh0aGlzLmhhc0dhbWVJblByb2dyZXNzKCkpIHtcbiAgICAgICAgICAgIHNldHRpbmdzID0gdGhpcy5yZXN1bWVTZXR0aW5ncygpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRoaXMuZ2VuZXJhdGVTZXR0aW5ncygpXG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IG1vdmVkID0gKGxvY2F0aW9uKSA9PiB7Y29uc29sZS5sb2coJ2xvY2F0aW9uJywgbG9jYXRpb24pfVxuICAgICAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKCdtb3ZlZC10bycsIG1vdmVkKVxuXG4gICAgICAgIHRoaXMubG9hZFNldHRpbmdzKHNldHRpbmdzKVxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpXG4gICAgfVxuXG4gICAgaGFzR2FtZUluUHJvZ3Jlc3MoKSB7XG4gICAgICAgIHJldHVybiBzdG9yZS5oYXMoJ21hcCcpXG4gICAgfVxuXG4gICAgcmVzdW1lU2V0dGluZ3MoKSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0ge1xuICAgICAgICAgICAgbWFwRGF0YTogc3RvcmUuZ2V0KCdtYXAnKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNldHRpbmdzXG4gICAgfVxuXG4gICAgZ2VuZXJhdGVTZXR0aW5ncygpIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7fVxuXG4gICAgICAgIHNldHRpbmdzLm1hcERhdGEgPSBNYXAuZ2VuZXJhdGUoeyBjb2w6IENPTCwgcm93OiAgUk9XIH0pXG5cbiAgICAgICAgc3RvcmUuc2V0KCdtYXAnLCBzZXR0aW5ncy5tYXBEYXRhKVxuXG4gICAgICAgIHJldHVybiBzZXR0aW5nc1xuICAgIH1cblxuICAgIGxvYWRTZXR0aW5ncyhzZXR0aW5ncykge1xuICAgICAgICBjb25zdCBibHVlcHJpbnQgPSB0aGlzLmJsdWVwcmludCA9IEJsdWVwcmludHMucmFuZG9tKClcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zID0gZ2VuZXJhdGVJdGVtcyhJVEVNX05VTSlcblxuICAgICAgICBjb25zdCBzdGF0dXMgPSB0aGlzLnN0YXR1cyA9IG5ldyBTdGF0dXMoKVxuICAgICAgICBjb25zdCBpbnZlbnRvcnlEaXNwbGF5ID0gdGhpcy5pbnZlbnRvcnlEaXNwbGF5ID0gbmV3IEludmVudG9yeURpc3BsYXkoKVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IHRoaXMubWFwID0gbmV3IE1hcChzZXR0aW5ncy5tYXBEYXRhKVxuICAgICAgICBjb25zdCBzY2VuZXJ5ID0gdGhpcy5zY2VuZXJ5ID0gbmV3IFNjZW5lcnkobWFwKVxuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSB0aGlzLmNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIobWFwKVxuXG4gICAgICAgIG1hcC5zZXRJdGVtcyhpdGVtcylcbiAgICAgICAgbWFwLnNldENoYXJhY3RlcihjaGFyYWN0ZXIpXG5cbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnlcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkuYWRkKGJsdWVwcmludClcblxuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy5pbml0VXNlcklucHV0KGNoYXJhY3RlcilcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc2V0IG1hcCEnKVxuXG4gICAgICAgIHN0b3JlLmNsZWFyKClcblxuICAgICAgICB0aGlzLmluaXRHYW1lKClcbiAgICB9XG5cbiAgICBpbml0VXNlcklucHV0KGNoYXJhY3Rlcikge1xuICAgICAgICByZXR1cm4gbmV3IFVzZXJJbnB1dCh7XG4gICAgICAgICAgICAnODInOiB0aGlzLnJlc2V0LmJpbmQodGhpcyksIC8vIChyKSByZXNldCBtYXBcbiAgICAgICAgICAgICczOCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnbm9ydGgnKSxcbiAgICAgICAgICAgICczNyc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnd2VzdCcpLFxuICAgICAgICAgICAgJzM5JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdlYXN0JyksXG4gICAgICAgICAgICAnNDAnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3NvdXRoJyksXG4gICAgICAgICAgICAnODQnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCd0YWtlJyksIC8vICh0KWFrZSBpdGVtXG4gICAgICAgICAgICAnNzMnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdjaGVja0ludmVudG9yeScpLCAvLyBjaGVjayAoaSludmVudG9yeVxuICAgICAgICAgICAgJzc3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbWluZScpIC8vIGRlcGxveSBwYXJ0aWNsZSAobSlpbmVyXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoJ3lvdSB3YWtlIHVwJylcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KGB5b3UgYXJlIGNhcnJ5aW5nICR7dGhpcy5ibHVlcHJpbnQubmFtZX1gLCA0MDAwKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZSgpO1xuIiwiaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuY2xhc3MgSW52ZW50b3J5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jb250ZW50cyA9IFtdXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2FkZC1pbnZlbnRvcnknLCB0aGlzLmFkZCwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ3JlbW92ZS1pbnZlbnRvcnknLCB0aGlzLnJlbW92ZSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2FkZC1taW5lZCcsIHRoaXMuYWRkTWluZWQsIHRoaXMpXG5cbiAgICAgICAgdGhpcy5zdG9yZU1pbmluZyA9IHt9XG4gICAgICAgIHRoaXMubWluaW5nU3RhdGVPYmogPSB7fVxuXG4gICAgfVxuXG4gICAgYWRkKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5jb250ZW50cy5wdXNoKGl0ZW0pXG4gICAgfVxuXG5cbiAgICBhZGRNaW5lZChjdXJyZW50T2JqKSB7XG4gICAgICAgIC8vIGlmIHN0YXRlIG9iamVjdCBkb2Vzbid0IGV4aXN0LCBhZGQgYWxsIHBhcnRpY2xlcyB0byBzdG9yYWdlXG4gICAgICAgIGlmICghdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVNaW5pbmdTdGF0ZShjdXJyZW50T2JqKVxuICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnRTdG9yYWdlKHRoaXMuc3RyaXBJRChjdXJyZW50T2JqKSlcblxuICAgICAgICAvLyBpZiBpdCBkb2VzIGV4aXN0LCBjaGVjayBjdXJyIHZzIHN0YXRlIGFuZCBhZGQgb25seSB0aGUgcmlnaHQgcGFydGljbGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmluY3JlbWVudFN0b3JhZ2UodGhpcy5zdHJpcElEKHRoaXMuY2hlY2tNaW5pbmdTdGF0ZShjdXJyZW50T2JqKSkpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1pbmluZ1N0YXRlKGN1cnJlbnRPYmopXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkaXNwbGF5UGFydGljbGVzID0gdGhpcy5zdG9yZU1pbmluZ1xuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2Rpc3BsYXktbWluZWQnLCBkaXNwbGF5UGFydGljbGVzKVxufVxuXG5cbiAgICBjaGVja01pbmluZ1N0YXRlKGN1cnJlbnRPYmopIHtcbiAgICAgICAgY29uc3QgY2hlY2tlZE9iaiA9IHt9XG4gICAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnRPYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmICghY2hlY2tlZE9ialtrZXldKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tlZE9ialtrZXldID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdW2tleV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdW2tleV0gPSAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGVja2VkT2JqW2tleV0gPSBjdXJyZW50T2JqW2tleV0gLSB0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdW2tleV1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGNoZWNrZWRPYmpcbiAgICB9XG5cblxuICAgIGluY3JlbWVudFN0b3JhZ2UocGFydGljbGVPYmopIHtcbiAgICAgICAgT2JqZWN0LmtleXMocGFydGljbGVPYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdG9yZU1pbmluZ1trZXldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZU1pbmluZ1trZXldID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdG9yZU1pbmluZ1trZXldICs9IHBhcnRpY2xlT2JqW2tleV1cbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIHVwZGF0ZU1pbmluZ1N0YXRlKGN1cnJlbnRPYmopIHtcbiAgICAgICAgdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXSA9IE9iamVjdC5hc3NpZ24oe30sIGN1cnJlbnRPYmopXG4gICAgfVxuXG5cbiAgICBzdHJpcElEKGN1cnJlbnRPYmopIHtcbiAgICAgICAgY29uc3QgcGFydGljbGVPYmogPSB7fVxuICAgICAgICBPYmplY3Qua2V5cyhjdXJyZW50T2JqKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5ICE9PSAnSUQnKSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGVPYmpba2V5XSA9IGN1cnJlbnRPYmpba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcGFydGljbGVPYmpcbiAgICB9XG5cblxuLy8gdW50ZXN0ZWRcblxuICAgIHJlbW92ZShpdGVtKSB7XG4gICAgICAgIGNvbnN0IHRoZUl0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMuY29udGVudHMuZm9yRWFjaCgoaXRlbSwgaSwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gdGhlSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudHMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtIG5vdCBpbiBpbnZlbnRvcnknKVxuICAgICAgICAgICAgfX0pXG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEludmVudG9yeVxuIiwiaW1wb3J0IE1vdmVhYmxlIGZyb20gJ2pzL01vdmVhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnanMvZXZlbnRNYW5hZ2VyJ1xuXG5cbi8vIGNvbnN0IElURU1TID0ge1xuLy8gICAgIG1pbmVyOiB7XG4vLyAgICAgICAgIG5hbWU6ICdwYXJ0aWNsZSBtaW5lcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJ3wnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ21pbmVzLCBkaXZpZGVzLCBhbmQgc3RvcmVzIGFtYmllbnQgY2hlbWljYWwgZWxlbWVudHMgYW5kIGxhcmdlciBjb21wb3VuZHMgZm91bmQgd2l0aGluIGEgMTAwIG1ldGVyIHJhZGl1cy4gOTclIGFjY3VyYWN5IHJhdGUuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1taW5lcidcbi8vICAgICB9LFxuLy8gICAgIHBhcnNlcjoge1xuLy8gICAgICAgICBuYW1lOiAnbm9pc2UgcGFyc2VyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnPycsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAncHJvdG90eXBlLiBwYXJzZXMgYXRtb3NwaGVyaWMgZGF0YSBmb3IgbGF0ZW50IGluZm9ybWF0aW9uLiBzaWduYWwtdG8tbm9pc2UgcmF0aW8gbm90IGd1YXJhbnRlZWQuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1wYXJzZXInXG4vLyAgICAgfSxcbi8vICAgICBpbnRlcmZhY2U6IHtcbi8vICAgICAgICAgbmFtZTogJ3BzaW9uaWMgaW50ZXJmYWNlJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnJicsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiBgY29ubmVjdHMgc2VhbWxlc3NseSB0byBhIHN0YW5kYXJkLWlzc3VlIGJpb3BvcnQuIGZhY2lsaXRhdGVzIHN1bmRyeSBpbnRlcmFjdGlvbnMgcGVyZm9ybWVkIHZpYSBQU0ktTkVULmAsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0taW50ZXJmYWNlJ1xuLy8gICAgIH0sXG4vLyAgICAgcHJpbnRlcjoge1xuLy8gICAgICAgICBuYW1lOiAnbW9sZWN1bGFyIHByaW50ZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICcjJyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdnZW5lcmF0ZXMgb2JqZWN0cyBhY2NvcmRpbmcgdG8gYSBibHVlcHJpbnQuIG1vbGVjdWxlcyBub3QgaW5jbHVkZWQuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1wcmludGVyJ1xuLy8gICAgIH1cbi8vIH1cblxuY2xhc3MgSXRlbSBleHRlbmRzIE1vdmVhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcihpdGVtQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICAvLyBtZXJnZSBpbiBjb25maWcgcHJvcGVydGllc1xuICAgICAgICAvLyBjb25zdCB0YXJnZXQgPSBPYmplY3QuYXNzaWduKHRoaXMsIGl0ZW1Db25maWcpXG5cbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuaWRlbnRpdHlOdW1iZXIgPSBVdGlsaXR5LklkKClcbiAgICAgICAgdGhpcy50eXBlID0gJ2l0ZW0nXG4gICAgICAgIHRoaXMub2ZmTWFwID0gZmFsc2VcbiAgICAgICAgLy8gdGhpcy5pbkludmVudG9yeSA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE9uTWFwKG1hcCwgbG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXRNYXAobWFwKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyhsb2NhdGlvbilcbiAgICAgICAgdGhpcy5zZXRDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMuc2V0R3JpZEluZGljZXMoKVxuICAgICAgICB0aGlzLnNldERpdih0aGlzLmdldElkKCkpXG4gICAgICAgIHRoaXMudXBkYXRlRGl2KHRoaXMpXG5cbi8vIG1vdmVkIHRoaXMgb3V0IHNvIHdlIGFyZSBub3QgY3JlYXRpbmcgY2hpbGRyZW4gZWFjaCB0aW1lIHdlIHdhbnQgdG8gcGxhY2Ugb24gbWFwXG4gICAgICAgIC8vIHRoaXMuY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudCgnaXRlbS1sYXllcicpXG4gICAgfVxuXG4gICAgZ2V0SWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5TnVtYmVyXG4gICAgfVxuXG4gICAgc2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgY3NzTGVmdCwgY3NzVG9wIH0gPSB0aGlzLmdldENTU0Nvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5sZWZ0ID0gY3NzTGVmdFxuICAgICAgICB0aGlzLnRvcCA9IGNzc1RvcFxuICAgIH1cblxuICAgIHNldEdyaWRJbmRpY2VzKCkge1xuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuXG4gICAgICAgIHRoaXMueCA9IHhcbiAgICAgICAgdGhpcy55ID0geVxuICAgIH1cblxuICAgIHNldERpdihpZGVudGl0eU51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuZGl2U2V0KSB7XG4gICAgICAgICAgICB0aGlzLmRpdiA9IHRoaXMuZGl2ICsgaWRlbnRpdHlOdW1iZXJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpdlNldCA9IHRydWVcbiAgICB9XG5cblxuICAgIC8vIHNwZWNpZmljIHRvIGl0ZW0gZHJhd2luZzogdXNlIG91dGVySFRNTFxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwub3V0ZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG5cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2l0ZW0nKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURpdih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25UYWtlKCkge1xuICAgICAgICB0aGlzLnggPSBudWxsXG4gICAgICAgIHRoaXMueSA9IG51bGxcbiAgICAgICAgdGhpcy5vZmZNYXAgPSB0cnVlIC8vIGNoYW5nZXMgY3NzIGRpc3BsYXkgdG8gJ25vbmUnXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3BhcnRpY2xlIG1pbmVyJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbHRNaW5pbmcoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1pbnZlbnRvcnknLCB0aGlzKVxuICAgICAgICAvLyB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMub25Ecm9wLCB0aGlzKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuICAgIH1cblxuICAgIG9uRHJvcCgpIHtcblxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHt0aGlzLm5hbWV9LSR7dGhpcy5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLm9uVGFrZSwgdGhpcywgdHJ1ZSlcbiAgICAvLyAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLCB0aGlzLmRpdilcblxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtXG4iLCJpbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuXG5jbGFzcyBQYXJ0aWNsZU1pbmVyIGV4dGVuZHMgSXRlbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICB0aGlzLm5hbWUgPSAncGFydGljbGUgbWluZXInXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAnfCdcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9ICdtaW5lcywgZGl2aWRlcywgYW5kIHN0b3JlcyBhbWJpZW50IGNoZW1pY2FsIGVsZW1lbnRzIGFuZCBsYXJnZXIgY29tcG91bmRzIGZvdW5kIHdpdGhpbiBhIDEwMCBtZXRlciByYWRpdXMuIDk3JSBhY2N1cmFjeSByYXRlLidcbiAgICAgICAgdGhpcy5kaXYgPSAnaXRlbS1taW5lcidcbiAgICAgICAgLy8gbXVzdCBzdWJzY3JpYmUgdGhlIGl0ZW0gZGlyZWN0bHksIG5vdCBvbiB0aGUgYWJzdHJhY3QgY2xhc3NcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMpXG5cbiAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlcyA9IHtcbiAgICAgICAgICAgIElEOiB0aGlzLmlkZW50aXR5TnVtYmVyXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG1pbmUobG9jYXRpb24pIHtcbiAgICAgICAgLy8gdHJ5IHNldHRpbmcgdGhlIGxvY2F0aW9uIGltbWVkaWF0ZWx5LCB1c2luZyBUSElTXG5cbiAgICAgICAgdGhpcy5sb2NhbGUgPSB0aGlzLm1hcFtsb2NhdGlvblsxXV1bbG9jYXRpb25bMF1dXG5cbiAgICAgICAgdGhpcy5zZXRNaW5pbmdDb25maWcoKVxuXG4gICAgICAgIC8vIGNhbGN1bGF0ZSByYXRpb3Mgb25jZSwgcmF0aGVyIHRoYW4gdyBldmVyeSBpbnRlcnZhbFxuICAgICAgICB0aGlzLmRldGVybWluZVBhcnRpY2xlUmF0aW9zKClcbiAgICAgICAgdGhpcy5jaGVja1BhcnRpY2xlQW1vdW50cygpXG4gICAgICAgIHRoaXMuY2FuY2VsbGF0aW9uS2V5ID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYXJ0aWNsZUFtb3VudHMoKVxuICAgICAgICB9LCAzMDAwKVxuXG4gICAgICAgIHRoaXMuc2V0T25NYXAodGhpcy5tYXAsIGxvY2F0aW9uKVxuICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgfVxuXG4gICAgc2V0TWluaW5nQ29uZmlnKCkge1xuICAgICAgICB0aGlzLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgIGlmICghdGhpcy5taW5pbmcpIHtcbiAgICAgICAgICAgIHRoaXMubWluaW5nID0gJ2Z1bGwnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXRlcm1pbmVQYXJ0aWNsZVJhdGlvcygpIHtcbiAgICAgICAgdGhpcy5hbGxQYXJ0aWNsZXMgPSBbXVxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmxvY2FsZS5wYXJ0aWNsZXMpLmZvckVhY2gocGFydGljbGUgPT4ge1xuICAgICAgICAgICAgbGV0IG51bWJlck9mUGFydGljbGVzID0gdGhpcy5sb2NhbGUucGFydGljbGVzW3BhcnRpY2xlXVxuICAgICAgICAgICAgd2hpbGUgKG51bWJlck9mUGFydGljbGVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGxQYXJ0aWNsZXMucHVzaChwYXJ0aWNsZSlcbiAgICAgICAgICAgICAgICBudW1iZXJPZlBhcnRpY2xlcy0tXG4gICAgICAgIH19KVxuICAgIH1cblxuXG4gICAgZXh0cmFjdFBhcnRpY2xlcygpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tUGFydGljbGUgPSB0aGlzLmFsbFBhcnRpY2xlc1tVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLmFsbFBhcnRpY2xlcy5sZW5ndGgpXVxuICAgICAgICBpZiAoIXRoaXMubWluZWRQYXJ0aWNsZXNbcmFuZG9tUGFydGljbGVdKSB7XG4gICAgICAgICAgICB0aGlzLm1pbmVkUGFydGljbGVzW3JhbmRvbVBhcnRpY2xlXSA9IDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXNbcmFuZG9tUGFydGljbGVdKytcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtaW5lZE9iaiA9IHRoaXMubWluZWRQYXJ0aWNsZXNcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdhZGQtbWluZWQnLCBtaW5lZE9iailcbiAgICB9XG5cblxuXG4gICAgY2hlY2tQYXJ0aWNsZUFtb3VudHMoKSB7XG4gICAgICAgIGlmICh0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubWluaW5nID0gJ2VtcHR5J1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudCA+PSAodGhpcy5sb2NhbGUubWF4UGFydGljbGVzIC8gMikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmluZyA9ICdmdWxsJ1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50LS1cbiAgICAgICAgICAgICAgICB0aGlzLmV4dHJhY3RQYXJ0aWNsZXMoKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudCA8ICh0aGlzLmxvY2FsZS5tYXhQYXJ0aWNsZXMgLyAyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWluaW5nID0gJ2hhbGYnXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQtLVxuICAgICAgICAgICAgICAgIHRoaXMuZXh0cmFjdFBhcnRpY2xlcygpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgfVxuXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlRGl2KHRoaXMpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKHRoaXMuZGl2KVxuICAgIH1cblxuXG4gICAgaGFsdE1pbmluZygpIHtcbiAgICAgICAgLy8gdGhpcy5taW5pbmcgPSBmYWxzZVxuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmNhbmNlbGxhdGlvbktleSlcbiAgICB9XG5cblxuXG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJ0aWNsZU1pbmVyXG4iLCJpbXBvcnQgUGFydGljbGVNaW5lciBmcm9tICcuL1BhcnRpY2xlTWluZXInXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJ1xuXG5jb25zdCBJVEVNUyA9IFtcbiAgICBQYXJ0aWNsZU1pbmVyXG5dXG5cbmZ1bmN0aW9uIHJhbmRvbUl0ZW0oKSB7XG4gICAgcmV0dXJuIG5ldyBJVEVNU1tVdGlsaXR5LnJhbmRvbWl6ZShJVEVNUy5sZW5ndGgpXVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUl0ZW1zKG51bWJlciA9IDEpIHtcbiAgICBjb25zdCBpdGVtcyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXI7IGkrKykge1xuICAgICAgICBpdGVtcy5wdXNoKHJhbmRvbUl0ZW0oKSlcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1zXG59XG5cblxuZXhwb3J0IHtcbiAgICBnZW5lcmF0ZUl0ZW1zXG59XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbG9jYWxzdG9yYWdlLCBzYXZpbmcgZGlzYWJsZWQnKVxuICAgICAgICAgICAgd2luZG93LmFsZXJ0KCdzYXZpbmcgZGlzYWJsZWQnKVxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5jbGVhcigpXG4gICAgfVxuXG4gICAgaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gKHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkgIT09IG51bGwpXG4gICAgfVxuXG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3JlLnNldCcsIGtleSlcblxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSlcbiAgICB9XG5cbiAgICBnZXQoa2V5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdG9yZS5nZXQnLCBrZXkpXG5cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KSlcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFN0b3JlKClcbiJdfQ==
