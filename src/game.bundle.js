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

            this.set(str, 10);
        }
    }, {
        key: 'cleanJSONString',
        value: function cleanJSONString(string) {
            string = string.replace(/"/g, '');
            string = string.replace(/:/g, ' ');
            string = string.replace(/{/g, '');
            string = string.replace(/}/g, '');
            // string = string.replace(/,/g, ' | ')
            string = string.replace(/,/g, '<br>');

            return string;
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
                }
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
                }
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
                }

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
                }

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
                }
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
            if (item.mining) {
                style += '; animation: mining 3s infinite';
            }
            // if (item.spinning) {
            //     style += `; animation: spinning 1s infinite`
            // }
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

            console.log('miningStateObject: ', this.miningStateObj);
            console.log('storeMining:', this.storeMining);

            var displayParticles = this.storeMining;
            this.EM.publish('display-mined', displayParticles);
        }
    }, {
        key: 'checkMiningState',
        value: function checkMiningState(currentObj) {
            var checkedObj = {};
            for (var key in currentObj) {
                if (!checkedObj[key]) {
                    checkedObj[key] = 0;
                }
                if (!this.miningStateObj[currentObj.ID][key]) {
                    this.miningStateObj[currentObj.ID][key] = 0;
                }
                checkedObj[key] = currentObj[key] - this.miningStateObj[currentObj.ID][key];
            }
            return checkedObj;
        }
    }, {
        key: 'incrementStorage',
        value: function incrementStorage(particleObj) {
            for (var key in particleObj) {
                if (!this.storeMining[key]) {
                    this.storeMining[key] = 0;
                }
                this.storeMining[key] += particleObj[key];
            }
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
            for (var key in currentObj) {
                if (key !== 'ID') {
                    particleObj[key] = currentObj[key];
                }
            }
            return particleObj;
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

            this.setMiningConfig();

            this.cancellationKey = window.setInterval(function () {
                _this2.extractParticles(_this2.determineParticleAmounts(location));
            }, 3000);

            this.setOnMap(this.map, location);
            this.drawLayer(this.div);
        }
    }, {
        key: 'setMiningConfig',
        value: function setMiningConfig() {
            this.offMap = false;
            this.mining = true;
            // this.spinning = true
        }
    }, {
        key: 'determineParticleAmounts',
        value: function determineParticleAmounts(location) {
            var localParticles = this.map[location[1]][location[0]].particles;
            var allParticles = [];
            Object.keys(localParticles).forEach(function (particle) {
                var numberOfParticles = localParticles[particle];
                while (numberOfParticles) {
                    allParticles.push(particle);
                    numberOfParticles--;
                }
            });
            return allParticles;
        }
    }, {
        key: 'extractParticles',
        value: function extractParticles(allParticles) {
            var randomParticle = allParticles[_Utility2.default.randomize(allParticles.length)];
            if (!this.minedParticles[randomParticle]) {
                this.minedParticles[randomParticle] = 1;
            } else {
                this.minedParticles[randomParticle]++;
            }
            var minedObj = this.minedParticles;
            console.log('in Particleminer', minedObj);
            this.EM.publish('add-mined', minedObj);

            // this.displayParticlesMined()
        }
    }, {
        key: 'haltMining',
        value: function haltMining() {
            this.mining = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0ludmVudG9yeURpc3BsYXkuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIiwic3JjL2pzL2l0ZW1zL0l0ZW0uanMiLCJzcmMvanMvaXRlbXMvUGFydGljbGVNaW5lci5qcyIsInNyYy9qcy9pdGVtcy9pbmRleC5qcyIsInNyYy9qcy9zdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLE9BQU8sSUFBUDs7Ozs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7QUFHQSxJQUFNLGdCQUFnQjtBQUNsQixzQkFBa0I7QUFDZCxjQUFNLCtCQURRO0FBRWQscUJBQWEsRUFGQztBQUdkLG1CQUFXLEVBSEc7QUFJZCxzQkFBYztBQUpBLEtBREE7QUFPbEIsb0JBQWdCO0FBQ1osY0FBTSw2QkFETTtBQUVaLHFCQUFhLEVBRkQ7QUFHWixtQkFBVyxFQUhDO0FBSVosc0JBQWM7QUFKRixLQVBFO0FBYWxCLG1CQUFlO0FBQ1gsY0FBTSw0QkFESztBQUVYLHFCQUFhLEVBRkY7QUFHWCxtQkFBVyxFQUhBO0FBSVgsc0JBQWM7QUFKSDtBQWJHLENBQXRCOztJQXNCTSxTO0FBQ0YsdUJBQVksSUFBWixF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K0IsV0FBbkMsRUFBZ0Q7QUFDNUMsb0JBQVEsR0FBUixDQUFZLGtDQUFaO0FBQ0EsbUJBQU8sS0FBUCxDQUFhLGlCQUFiO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNILFNBSkQsTUFJTztBQUNILGlCQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxpQkFBSyxPQUFMLEdBQWUsT0FBTyxZQUF0QjtBQUNIO0FBQ0o7Ozs7Z0NBRU87QUFDSixpQkFBSyxPQUFMLENBQWEsS0FBYjtBQUNIOzs7NEJBRUcsRyxFQUFLO0FBQ0wsbUJBQVEsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixNQUE4QixJQUF0QztBQUNIOzs7NEJBRUcsRyxFQUFLLEssRUFBTztBQUNaLG9CQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLEdBQXpCOztBQUVBLGlCQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBMUI7QUFDSDs7OzRCQUVHLEcsRUFBSztBQUNMLG9CQUFRLEdBQVIsQ0FBWSxXQUFaLEVBQXlCLEdBQXpCOztBQUVBLG1CQUFPLEtBQUssS0FBTCxDQUFXLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsQ0FBWCxDQUFQO0FBQ0g7Ozs7OztrQkFJVSxJQUFJLEtBQUosRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi9qcy9nYW1lJ1xuXG53aW5kb3cuZ2FtZSA9IGdhbWVcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jb25zdCBibHVlcHJpbnREYXRhID0ge1xuICAgIGFydGlmaWNpYWxNdXNjbGU6IHtcbiAgICAgICAgbmFtZTogJ2FydGlmaWNpYWwgbXVzY2xlIChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICByZXRpbmFsRGlzcGxheToge1xuICAgICAgICBuYW1lOiAncmV0aW5hbCBkaXNwbGF5IChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICBwcm9zdGhldGljQXJtOiB7XG4gICAgICAgIG5hbWU6ICdwcm9zdGhldGljIGFybSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH1cbn1cblxuXG5jbGFzcyBCbHVlcHJpbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbSgpIHtcbiAgICAgICAgY29uc3QgYmx1ZXByaW50VmFsdWVzID0gT2JqZWN0LnZhbHVlcyhibHVlcHJpbnREYXRhKVxuICAgICAgICBjb25zdCBpbmRleCA9IFV0aWxpdHkucmFuZG9taXplKGJsdWVwcmludFZhbHVlcy5sZW5ndGgpXG5cbiAgICAgICAgY29uc3QgcmFuZG9tQmx1ZXByaW50ID0gYmx1ZXByaW50VmFsdWVzW2luZGV4XVxuXG4gICAgICAgIHJldHVybiBuZXcgQmx1ZXByaW50KHJhbmRvbUJsdWVwcmludC5uYW1lLCByYW5kb21CbHVlcHJpbnQuZGVzY3JpcHRpb24pXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEJsdWVwcmludFxuXG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcbmltcG9ydCB7IERJUkVDVElPTlMgfSBmcm9tICcuL0NvbnN0YW50cydcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgaW52ZW50b3J5IGZyb20gJy4vaW52ZW50b3J5J1xuXG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIE1vdmVhYmxlIHsgIC8vIENoYXJhY3RlciBkYXRhIGFuZCBhY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwSW5zdGFuY2UsIGluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICBzdXBlcihtYXBJbnN0YW5jZSlcbiAgICAgICAgdGhpcy5tYXBJbnN0YW5jZSA9IG1hcEluc3RhbmNlXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnkuY29udGVudHNcblxuICAgICAgICBsZXQgcG9zaXRpb25cbiAgICAgICAgaWYgKGluaXRpYWxQb3NpdGlvbikge1xuICAgICAgICAgICAgcG9zaXRpb24gPSBpbml0aWFsUG9zaXRpb25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gbWFwSW5zdGFuY2UuZ2V0TWFwQ2VudGVyKClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbEdyaWRJbmRpY2VzKHBvc2l0aW9uKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuICAgICAgICBjb25zb2xlLmxvZygnY2hhcmFjdGVyIHJlbmRlcmVkJylcbiAgICB9XG5cbiAgICByZW5kZXJMYXllcih1bml0LCBsYXllcklkKSB7XG4gICAgICAgIGlmICh1bml0LnR5cGUgPT09ICdhY3RvcicpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3Bhbih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN1YnNjcmliZUl0ZW1zVG9NYXAoKSB7XG4gICAgICAgIC8vIE5PVCBSRVFVSVJFRCBBVCBUSEUgTU9NRU5UXG5cbiAgICAgICAgLy8gdGhpcy5tYXAuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAvLyAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7aXRlbS5uYW1lfS0ke2l0ZW0uaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy50YWtlSXRlbSwgdGhpcywgdHJ1ZSlcbiAgICAgICAgLy8gfSlcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JpZEluZGljZXNcbiAgICB9XG5cbiAgICBnZXRDaGFyYWN0ZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY3NzTGVmdCwgY3NzVG9wIH0gPSB0aGlzLmdldENTU0Nvb3JkaW5hdGVzKClcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLmdldEdyaWRJbmRpY2VzKClcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyID0ge1xuICAgICAgICAgICAgbmFtZTogJ2NoYXJhY3RlcicsXG4gICAgICAgICAgICB0eXBlOiAnYWN0b3InLFxuICAgICAgICAgICAgZWxlbWVudDogJ0AnLFxuICAgICAgICAgICAgY2xzOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIGxlZnQ6IGNzc0xlZnQsXG4gICAgICAgICAgICB0b3A6IGNzc1RvcCxcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlclxuICAgIH1cblxuICAgIGdldEFjdGlvbihmbk5hbWUsIGFyZykge1xuICAgICAgICByZXR1cm4gdGhpc1tmbk5hbWVdLmJpbmQodGhpcywgYXJnKVxuICAgIH1cblxuICAgIG1vdmUoZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMubG9jYXRpb24gPSB0aGlzLnVwZGF0ZUdyaWRJbmRpY2VzKHRoaXMuZ2V0Q2hhcmFjdGVyKCksIERJUkVDVElPTlNbZGlyZWN0aW9uXSlcbiAgICAgICAgdGhpcy5wcmludExvY2FsU3RhdHVzKClcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMubG9jYXRpb24ueCxcbiAgICAgICAgICAgIHk6IHRoaXMubG9jYXRpb24ueVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdtb3ZlZC10bycsIHBvc2l0aW9uKVxuICAgIH1cblxuICAgIHByaW50TG9jYWxTdGF0dXMoKSB7XG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy5sb2NhdGlvbilcbiAgICAgICAgY29uc3QgbG9jYWxJdGVtID0gdGhpcy5sb2NhbEl0ZW0oKVxuXG4gICAgICAgIGlmIChsb2NhbEl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChsb2NhbEl0ZW0ubWluaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAnYSBtaW5lciBwdWxscyBjb21wb3VuZHMgZnJvbSB0aGUgcmVnaW9uJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LWl0ZW0nLCBsb2NhbEl0ZW0ubmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsSXRlbSgpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgbGV0IGxvY2FsSXRlbSA9IG51bGxcblxuICAgICAgICB0aGlzLm1hcEluc3RhbmNlLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNoYXIueCAmJiBpdGVtLnkgPT09IGNoYXIueSkge1xuICAgICAgICAgICAgICAgIGxvY2FsSXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIH19KVxuICAgICAgICByZXR1cm4gbG9jYWxJdGVtXG4gICAgfVxuXG4gICAgdGFrZSgpIHtcbiAgICAgICAgY29uc3QgbG9jYWxJdGVtID0gdGhpcy5sb2NhbEl0ZW0oKVxuXG4gICAgICAgIGlmIChsb2NhbEl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaChgJHtsb2NhbEl0ZW0ubmFtZX0tJHtsb2NhbEl0ZW0uaWRlbnRpdHlOdW1iZXJ9IHRha2VuYClcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgYCR7bG9jYWxJdGVtLm5hbWV9IHRha2VuYClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ3RoZXJlIGlzIG5vdGhpbmcgaGVyZSB3b3J0aCB0YWtpbmcnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tJbnZlbnRvcnkoKSB7XG4gICAgICAgIGNvbnN0IGNhcnJ5aW5nID0gdGhpcy5pbnZlbnRvcnkubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKS5qb2luKCcgfCAnKVxuICAgICAgICBjb25zdCB0ZXh0ID0gYHlvdSBhcmUgY2Fycnlpbmc6ICR7Y2Fycnlpbmd9YFxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIHRleHQpXG4gICAgfVxuXG4gICAgZmluZEludmVudG9yeUl0ZW0oaXRlbU5hbWUpIHtcbiAgICAgICAgbGV0IGZvdW5kSXRlbSA9IG51bGxcblxuICAgICAgICB0aGlzLmludmVudG9yeS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gaXRlbU5hbWUpIHtcbiAgICAgICAgICAgICAgICBmb3VuZEl0ZW0gPSBpdGVtXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGZvdW5kSXRlbVxuICAgIH1cblxuICAgIG1pbmUoKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIGNvbnN0IG1pbmVyID0gdGhpcy5maW5kSW52ZW50b3J5SXRlbSgncGFydGljbGUgbWluZXInKVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IFtjaGFyLngsIGNoYXIueV1cblxuICAgICAgICBpZiAobWluZXIpIHtcbiAgICAgICAgICAgIG1pbmVyLm1pbmUobG9jYXRpb24pXG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3JlbW92ZS1pbnZlbnRvcnknLCBtaW5lcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ3lvdSBkbyBub3QgaGF2ZSBhbnkgcGFydGljbGUgbWluZXJzJylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBJbnZlbnRvcnlEaXNwbGF5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pbnZlbnRvcnknLCB0aGlzLmRpc3BsYXlJbnZlbnRvcnksIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdkaXNwbGF5LW1pbmVkJywgdGhpcy5kaXNwbGF5TWluZWQsIHRoaXMpXG4gICAgfVxuXG5cblxuICAgIGRpc3BsYXlNaW5lZChtaW5lZEVsZW1lbnRzT2JqZWN0KSB7XG5cbiAgICAgICAgY29uc3Qgc3RyID0gdGhpcy5jbGVhbkpTT05TdHJpbmcoSlNPTi5zdHJpbmdpZnkobWluZWRFbGVtZW50c09iamVjdCkpXG5cbiAgICAgICAgdGhpcy5zZXQoc3RyLCAxMClcbiAgICB9XG5cblxuICAgIGNsZWFuSlNPTlN0cmluZyhzdHJpbmcpIHtcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1wiL2csICcnKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvOi9nLCAnICcpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC97L2csICcnKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvfS9nLCAnJylcbiAgICAgICAgLy8gc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoLywvZywgJyB8ICcpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC8sL2csICc8YnI+JylcblxuICAgICAgICByZXR1cm4gc3RyaW5nXG4gICAgfVxuXG5cblxuXG5cbiAgICBkaXNwbGF5SW52ZW50b3J5KGludmVudG9yeU9iamVjdCkge1xuICAgICAgICB0aGlzLnNldChpbnZlbnRvcnlPYmplY3QsIDEwKVxuICAgIH1cblxuXG4gICAgc2V0KGRlc2NyaXB0aW9uLCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnZlbnRvcnlEaXNwbGF5JykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEludmVudG9yeURpc3BsYXlcbiIsImNsYXNzIExhbmRzY2FwZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZlYXR1cmVzID0gdGhpcy5mZWF0dXJlcygpXG4gICAgICAgIHRoaXMuYmFyZSA9IHRoaXMuYmFyZSgpXG4gICAgfVxuXG4gICAgZmVhdHVyZXMoKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZCA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcuJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFpciBpcyBjaG9rZWQgd2l0aCBkdXN0LCBzdGF0aWMsIHdpZmknLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI1LFxuICAgICAgICAgICAgY2xzOiAncGVyaW9kJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgY2hyb21lOiAxNSxcbiAgICAgICAgICAgICAgICBsZWFkOiAzMCxcbiAgICAgICAgICAgICAgICBzdHlyb2ZvYW06IDMwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIGh5ZHJvY2FyYm9uczogMTUsXG4gICAgICAgICAgICAgICAgc2lsaWNvbjogMTAsXG4gICAgICAgICAgICAgICAgY2VyYW1pYzogMTBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21tYSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcsJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnc3ByYXdsIG9mIHNtYXJ0IGhvbWVzLCBjdWwtZGUtc2FjcywgbGFuZXdheXMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI2LFxuICAgICAgICAgICAgY2xzOiAnY29tbWEnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBsYXRleDogMTUsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIGJvbmU6IDEwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JhdmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnXicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2Egc2hpbW1lcmluZyBmaWVsZCBvZiBzb2xhciBwYW5lbHMsIGJyb2tlbiBhbmQgY29ycm9kZWQnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDIyLFxuICAgICAgICAgICAgY2xzOiAnZ3JhdmUnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBmaWJlcjogMTAsXG4gICAgICAgICAgICAgICAgb3pvbmU6IDE1LFxuICAgICAgICAgICAgICAgIGJlbnplbmU6IDIwLFxuICAgICAgICAgICAgICAgIGdsYXNzOiAzMCxcbiAgICAgICAgICAgICAgICBjZXJhbWljOiAxMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXN0ZXJpc2sgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnKicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2hvbGxvdyB1c2VycyBqYWNrIGluIGF0IHRoZSBkYXRhaHVicycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjAsXG4gICAgICAgICAgICBjbHM6ICdhc3RlcmlzaycsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBjaHJvbWU6IDE1LFxuICAgICAgICAgICAgICAgIGxlYWQ6IDMwLFxuICAgICAgICAgICAgICAgIG1lcmN1cnk6IDEwLFxuICAgICAgICAgICAgICAgIHN0eXJvZm9hbTogMzAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgYmVuemVuZTogMjAsXG4gICAgICAgICAgICAgICAgc2lsaWNvbjogMTAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGVyaW9kLCBjb21tYSwgc2VtaWNvbG9uLCBzZW1pY29sb24sIGFzdGVyaXNrLCBhc3RlcmlzaywgZ3JhdmUsIGdyYXZlXVxuICAgIH1cblxuICAgIGJhcmUoKSB7XG4gICAgICAgIGNvbnN0IGJhcmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnJm5ic3A7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnY29uY3JldGUgYW5kIHR3aXN0ZWQgcmViYXIgc3RyZXRjaCB0byB0aGUgaG9yaXpvbicsXG4gICAgICAgICAgICBjbHM6ICdibGFuaycsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBpcm9uOiAzMCxcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBib25lOiAxMCxcbiAgICAgICAgICAgICAgICBoeWRyb2NhcmJvbnM6IDE1LFxuICAgICAgICAgICAgICAgIHVyYW5pdW06IDEwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmFyZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFuZHNjYXBlRGF0YVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBNYXBHZW5lcmF0b3IgZnJvbSAnLi9NYXBHZW5lcmF0b3InXG5cbmNsYXNzIE1hcCB7XG4gICAgY29uc3RydWN0b3IobWFwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZygnbWFwIGNvbnN0cnVjdG9yJywgbWFwRGF0YSlcblxuICAgICAgICB0aGlzLm1hcCA9IG1hcERhdGFcbiAgICAgICAgdGhpcy5jb2wgPSBNYXAuZ2V0Q29sKG1hcERhdGEpXG4gICAgICAgIHRoaXMucm93ID0gTWFwLmdldFJvdyhtYXBEYXRhKVxuXG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcCA9IFtdXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q29sKG1hcERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1hcERhdGEubGVuZ3RoXG4gICAgfVxuXG4gICAgc3RhdGljIGdldFJvdyhtYXBEYXRhKSB7XG4gICAgICAgIHJldHVybiBtYXBEYXRhWzBdLmxlbmd0aFxuICAgIH1cblxuICAgIHN0YXRpYyBnZW5lcmF0ZSh7IGNvbCwgcm93IH0pIHtcbiAgICAgICAgY29uc3QgbWFwR2VuZXJhdG9yID0gbmV3IE1hcEdlbmVyYXRvcigpXG5cbiAgICAgICAgcmV0dXJuIG1hcEdlbmVyYXRvci5nZW5lcmF0ZSh7IGNvbCwgcm93fSlcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcFxuICAgIH1cblxuICAgIGdldE1hcENlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHRoaXMuY29sLzIpLCBNYXRoLmZsb29yKHRoaXMucm93LzIpXVxuICAgIH1cblxuICAgIGdldFJhbmRvbU1hcExvY2F0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1V0aWxpdHkucmFuZG9taXplKHRoaXMucm93IC0gMSksIFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSldXG4gICAgfVxuXG4gICAgc2V0Q2hhcmFjdGVyKGNoYXJhY3Rlcikge1xuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IGNoYXJhY3RlclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5zZXRNYXAodGhpcy5tYXApXG4gICAgfVxuXG4gICAgc2V0SXRlbXMoaXRlbXMpIHtcbiAgICAgICAgaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tTWFwTG9jYXRpb24gPSB0aGlzLmdldFJhbmRvbU1hcExvY2F0aW9uKClcbiAgICAgICAgICAgIGl0ZW0uc2V0T25NYXAodGhpcy5tYXAsIHJhbmRvbU1hcExvY2F0aW9uKVxuICAgICAgICAgICAgaXRlbS5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJykgIC8vIG1vdmVkIGNoaWxkRWxlbWVudCBjcmVhdGlvbiBvdXQgb2YgJ3NldE9uTWFwJ1xuICAgICAgICAgICAgdGhpcy5wdXNoSXRlbShpdGVtKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1c2hJdGVtKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwLnB1c2goaXRlbSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcFxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IExhbmRzY2FwZURhdGEgZnJvbSAnLi9MYW5kc2NhcGVEYXRhJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuXG5cbmNsYXNzIE1hcEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgZ2VuZXJhdGUoeyBjb2wsIHJvdyB9KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZW5lcmF0aW5nIG1hcCcpXG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG5cbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVEYXRhKClcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMubWFrZUdyaWQoKVxuICAgICAgICBjb25zdCBzZWVkZWRHcmlkID0gdGhpcy5zZWVkKGdyaWQpXG4gICAgICAgIHRoaXMuc2VlZGVkR3JpZCA9IHNlZWRlZEdyaWRcbiAgICAgICAgdGhpcy5ncm93KClcblxuICAgICAgICBjb25zb2xlLmxvZygnbWFwIGdlbmVyYXRlZCcpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VlZGVkR3JpZFxuICAgIH1cblxuICAgIG1ha2VHcmlkKCkge1xuICAgICAgICBjb25zdCBjb2wgPSB0aGlzLmNvbFxuICAgICAgICBjb25zdCByb3cgPSB0aGlzLnJvd1xuICAgICAgICBjb25zdCBncmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICAgICAgZ3JpZFtpXSA9IFtdXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgZ3JpZFtpXS5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgc2VlZChncmlkKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldE51bWJlck9mRWxlbWVudFNlZWRzKCk7IGkrKykge1xuICAgICAgICAgICAgcmFuZG9tRWxlbWVudHMucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXMubGVuZ3RoKV0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VlZHMgPSB0aGlzLmdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cylcbiAgICAgICAgc2VlZHMubWFwKHNlZWQgPT4gZ3JpZFtzZWVkLnldW3NlZWQueF0gPSBzZWVkKVxuICAgICAgICB0aGlzLl9zZWVkcyA9IHNlZWRzXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKSB7XG4gICAgICAgIC8vICByZXR1cm4gMSAgICAgICAgLy8gdGVzdCBzZXR0aW5nXG4gICAgICAgIC8vIHJldHVybiAoKHRoaXMuY29sICogdGhpcy5yb3cpIC8gKHRoaXMuX2NvbCArIHRoaXMucm93KSkgIC8vIHNwYXJzZSBpbml0aWFsIHNlZWRpbmdcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBzZWVkcyA9IHRoaXMuX3NlZWRzXG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdvb2RTZWVkcyA9IFtdXG4gICAgICAgICAgICB0aGlzLmdvb2RTZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5mb3JFYWNoKChzZWVkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2RTZWVkcy5wdXNoKHRoaXMuY2hlY2tTZWVkKHNlZWQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBmb3IgKGxldCBnb29kU2VlZCBvZiBnb29kU2VlZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID09PSB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuY291bnRVbnNlZWRlZExvY2F0aW9ucygpKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5zZWVkZWRHcmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBsZXQgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgaWYgKChzZWVkLnggPCB0aGlzLmNvbCAmJiBzZWVkLnggPj0gMCkgJiZcbiAgICAgICAgICAgIChzZWVkLnkgPCB0aGlzLnJvdyAmJiBzZWVkLnkgPj0gMCkpIHtcbiAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFtzZWVkLnldW3NlZWQueF0gIT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKChzZWVkLnggPT09IGdvb2RTZWVkLngpICYmXG4gICAgICAgICAgICAgICAgKHNlZWQueSA9PT0gZ29vZFNlZWQueSkpIHtcbiAgICAgICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzZWVkU3VjY2VlZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykge1xuICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICBzZWVkcy5mb3JFYWNoKChvcmlnaW5hbFNlZWQpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG4gICAgICAgICAgICAgICAgaWYgKFV0aWxpdHkucHJvYmFiaWxpdHkobmV4dEdlblNlZWQucHJvYmFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkaXJlY3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueCA9IG9yaWdpbmFsU2VlZC54ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnkgPSBvcmlnaW5hbFNlZWQueSArIGRpcmVjdGlvblZhbHVlc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG4gICAgLy8gcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgIC8vICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAvLyAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgLy8gICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICAvLyB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE1hcChtYXApIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgfVxuXG4gICAgZ2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdyaWRJbmRpY2VzWzBdXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdyaWRJbmRpY2VzWzFdXG5cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5tYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLm1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBcInlvdSd2ZSByZWFjaGVkIHRoZSBtYXAncyBlZGdlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uXG4gICAgfVxuXG4gICAgY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykge1xuICAgICAgICBsZXQgbG9jYXRpb25PbkdyaWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHggPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICBjb25zdCB5ID0gbmV3R3JpZEluZGljZXNbMF1cblxuICAgICAgICBpZiAodGhpcy5tYXBbeF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5tYXBbeF1beV1cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uT25HcmlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uT25HcmlkXG4gICAgfVxuXG4gICAgZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXQnKVxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgICBjb25zdCB3aWR0aCA9IFV0aWxpdHkuc3RyaW5nVG9OdW1iZXIoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSlcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSlcbiAgICAgICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9XG4gICAgfVxuXG4gICAgZ2V0Q1NTQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGNzcyA9IHRoaXMuZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKVxuICAgICAgICBjb25zdCBjc3NMZWZ0ID0gdGhpcy5ncmlkSW5kaWNlc1swXSAqIGNzcy5oZWlnaHRcbiAgICAgICAgY29uc3QgY3NzVG9wID0gdGhpcy5ncmlkSW5kaWNlc1sxXSAqIGNzcy53aWR0aFxuICAgICAgICByZXR1cm4geyBjc3NMZWZ0LCBjc3NUb3AgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBNb3ZlYWJsZVxuIiwiY2xhc3MgUmVuZGVyYWJsZSB7ICAvLyBnZW5lcmFsaXplZCByZW5kZXIgZnVuY3Rpb25zIGZvciBTY2VuZXJ5LCBDaGFyYWN0ZXJcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRMYXllcihsYXllcikge1xuICAgICAgICB0aGlzLmxheWVyID0gbGF5ZXJcbiAgICB9XG5cbiAgICBnZXRMYXllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJcbiAgICB9XG5cbiAgICByZW5kZXJTcGFuKHVuaXQpIHtcbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdC50b3AgJiYgdW5pdC5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7dW5pdC50b3B9cHg7IGxlZnQ6ICR7dW5pdC5sZWZ0fXB4YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ1bml0ICR7Y2xzfVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9zcGFuPmBcbiAgICB9XG5cbiAgICByZW5kZXJEaXYoaXRlbSkge1xuICAgICAgICBsZXQgZGl2ID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgZGl2ID0gaXRlbS5kaXZcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpdGVtLmVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS50b3AgJiYgaXRlbS5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7aXRlbS50b3B9cHg7IGxlZnQ6ICR7aXRlbS5sZWZ0fXB4OyBwb3NpdGlvbjogYWJzb2x1dGVgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ub2ZmTWFwKSB7XG4gICAgICAgICAgICBzdHlsZSArPSBgOyBkaXNwbGF5OiBub25lYFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLm1pbmluZykge1xuICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmcgM3MgaW5maW5pdGVgXG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgKGl0ZW0uc3Bpbm5pbmcpIHtcbiAgICAgICAgLy8gICAgIHN0eWxlICs9IGA7IGFuaW1hdGlvbjogc3Bpbm5pbmcgMXMgaW5maW5pdGVgXG4gICAgICAgIC8vIH1cbiAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiJHtkaXZ9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L2Rpdj5gXG4gICAgfVxuXG4gICAgdXBkYXRlU3BhbihhY3Rvcikge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyU3BhbihhY3RvcikpXG4gICAgfVxuXG4gICAgdXBkYXRlRGl2KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlckRpdihpdGVtKSlcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQocGFyZW50TGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudExheWVySWQpXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgLy8gY3JlYXRlcyBkaXYgaWQgd2l0aGluIGVuY2xvc2luZyBkaXYgLi4uXG4gICAgICAgIGNoaWxkLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJhYmxlXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5cblxuY2xhc3MgU2NlbmVyeSBleHRlbmRzIFJlbmRlcmFibGUgeyAgLy8gU2NlbmVyeS1zcGVjaWZpYyByZW5kZXJpbmcgZnVuY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5tYXAgPSBtYXAuZ2V0TWFwKClcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcigpXG4gICAgICAgIGNvbnNvbGUubG9nKCdzY2VuZXJ5IHJlbmRlcmVkJylcbiAgICB9XG5cbiAgICByZW5kZXJMYXllcigpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMubWFwLm1hcChhcnIgPT4geyByZXR1cm4gYXJyLnNsaWNlKCkgfSlcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLmNyZWF0ZUxheWVyKGdyaWQpKVxuICAgICAgICB0aGlzLmRyYXdMYXllcigpXG4gICAgfVxuXG4gICAgY3JlYXRlTGF5ZXIoZ3JpZCkge1xuICAgICAgICBjb25zdCBzY2VuZXJ5R3JpZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgcm93SXRlbXMgPSBncmlkW2ldXG4gICAgICAgICAgICBsZXQgcm93ID0gJycgIC8vIHBvc3NpYmx5IG1ha2UgZWFjaCByb3cgYSB0YWJsZT9cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByb3cgKz0gdGhpcy5yZW5kZXJTcGFuKHJvd0l0ZW1zW2ldKSAvLyBhZGQgcmVuZGVyZWQgaXRlbXMgdG8gdGhlIGdyaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjZW5lcnlHcmlkLnB1c2gocm93KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2VuZXJ5R3JpZFxuICAgIH1cblxuICAgIGRyYXdMYXllcigpIHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgY29uc3QgZ3JpZFRvSFRNTCA9IGxheWVyLmpvaW4oJzxiciAvPicpICAvLyB1c2luZyBIVE1MIGJyZWFrcyBmb3Igbm93XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhbmRzY2FwZS1sYXllcicpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IGdyaWRUb0hUTUxcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU2NlbmVyeVxuIiwiaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuY2xhc3MgU3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy51cGRhdGUsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdkaXNwbGF5LWl0ZW0nLCB0aGlzLmRpc3BsYXlJdGVtLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnc3RhdHVzJywgdGhpcy5kZWZhdWx0LCB0aGlzKVxuICAgIH1cblxuICAgIHVwZGF0ZShsb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldChsb2NhdGlvbi5kZXNjcmlwdGlvbilcbiAgICB9XG5cbiAgICBiZWdpbnNXaXRoVm93ZWwodGV4dCkge1xuICAgICAgICBjb25zdCBmaXJzdExldHRlciA9IHRleHRbMF1cbiAgICAgICAgY29uc3Qgdm93ZWxzID0gWydhJywgJ2UnLCAnaScsICdvJywgJ3UnXVxuICAgICAgICBsZXQgYmVnaW5zV2l0aFZvd2VsID0gZmFsc2VcbiAgICAgICAgdm93ZWxzLmZvckVhY2godm93ZWwgPT4ge1xuICAgICAgICAgICAgaWYgKGZpcnN0TGV0dGVyID09PSB2b3dlbCkge1xuICAgICAgICAgICAgICAgIGJlZ2luc1dpdGhWb3dlbCA9IHRydWVcbiAgICAgICAgICAgIH19KVxuICAgICAgICByZXR1cm4gYmVnaW5zV2l0aFZvd2VsXG4gICAgfVxuXG4gICAgZGlzcGxheUl0ZW0oaXRlbU5hbWUpIHtcbiAgICAgICAgY29uc3QgYmVnaW5zV2l0aFZvd2VsID0gdGhpcy5iZWdpbnNXaXRoVm93ZWwoaXRlbU5hbWUpXG4gICAgICAgIGxldCB0ZXh0ID0gJydcbiAgICAgICAgaWYgKGJlZ2luc1dpdGhWb3dlbCkge1xuICAgICAgICAgICAgdGV4dCA9IGB5b3Ugc2VlIGFuICR7aXRlbU5hbWV9IGhlcmVgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZXh0ID0gYHlvdSBzZWUgYSAke2l0ZW1OYW1lfSBoZXJlYFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KHRleHQsIDEwKVxuICAgIH1cblxuICAgIGRlZmF1bHQodGV4dCkge1xuICAgICAgICB0aGlzLnNldCh0ZXh0LCAxMClcbiAgICB9XG5cbiAgICBzZXQoZGVzY3JpcHRpb24sIGRlbGF5PTApIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uXG4gICAgICAgIH0sIGRlbGF5KVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTdGF0dXNcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jbGFzcyBVc2VySW5wdXQge1xuICAgIGNvbnN0cnVjdG9yKGtleUFjdGlvbk1hcCkge1xuICAgICAgICB0aGlzLmtleUFjdGlvbk1hcCA9IGtleUFjdGlvbk1hcFxuXG4gICAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IHRoaXMudHJ5QWN0aW9uRm9yRXZlbnQuYmluZCh0aGlzKVxuICAgIH1cblxuICAgIHRyeUFjdGlvbkZvckV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGlmICghVXRpbGl0eS5jb250YWlucyh0aGlzLmtleUFjdGlvbk1hcCwgZXZlbnQua2V5Q29kZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBub3QgYSB2YWxpZCBrZXljb2RlOiAke2V2ZW50LmtleUNvZGV9YClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMua2V5QWN0aW9uTWFwW2V2ZW50LmtleUNvZGVdKClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBVc2VySW5wdXRcbiIsImxldCBpZCA9IDBcblxuZnVuY3Rpb24gZ2VuZXJhdGVJZCgpIHtcbiAgICBpZCA9IGlkICsgMVxuICAgIHJldHVybiBpZFxufVxuXG5jbGFzcyBVdGlsaXR5IHtcbiAgICBzdGF0aWMgY29udGFpbnMob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5pbmRleE9mKFN0cmluZyhwcm9wZXJ0eSkpICE9PSAtMVxuICAgIH1cblxuICAgIHN0YXRpYyBzdHJpbmdUb051bWJlcihzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5tYXRjaCgvXFxkKy8pWzBdXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbWl6ZShtdWx0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtdWx0KVxuICAgIH1cblxuICAgIHN0YXRpYyBJZCgpIHtcbiAgICAgICAgcmV0dXJuIGdlbmVyYXRlSWQoKVxuICAgIH1cblxuICAgIHN0YXRpYyBwcm9iYWJpbGl0eShwZXJjZW50YWdlKSB7XG4gICAgICAgIGNvbnN0IHByb2JhYmlsaXR5QXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcmNlbnRhZ2U7IGkrKykge1xuICAgICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKHRydWUpXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAgLSBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaChmYWxzZSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvYmFiaWxpdHlBcnJheVtVdGlsaXR5LnJhbmRvbWl6ZSgxMDApXVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBVdGlsaXR5XG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50c0xpc3QgPSBbXSAgICAgICAgLy8gY3JlYXRlIGFycmF5IG9mIGV2ZW50c1xuICAgIH1cblxuICAgIHN1YnNjcmliZShldmVudCwgZm4sIHRoaXNWYWx1ZSwgb25jZT1mYWxzZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXNWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHsgICAvLyBpZiBubyB0aGlzVmFsdWUgcHJvdmlkZWQsIGJpbmRzIHRoZSBmbiB0byB0aGUgZm4/P1xuICAgICAgICAgICAgdGhpc1ZhbHVlID0gZm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRzTGlzdC5wdXNoKHsgICAgICAvLyBjcmVhdGUgb2JqZWN0cyBsaW5raW5nIGV2ZW50cyArIGZ1bmN0aW9ucyB0byBwZXJmb3JtXG4gICAgICAgICAgICBldmVudDogZXZlbnQsICAgICAgICAgICAvLyBwdXNoIGVtIHRvIHRoZSBhcnJheVxuICAgICAgICAgICAgZm46IGZuLFxuICAgICAgICAgICAgb25jZTogb25jZSxcbiAgICAgICAgICAgIHRoaXNWYWx1ZTogdGhpc1ZhbHVlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gdW5zdWJzY3JpYmUoZXZlbnQpIHtcbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAvLyAgICAgICAgIGlmICh0aGlzLmV2ZW50c0xpc3RbaV0uZXZlbnQgPT09IGV2ZW50KSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5ldmVudHNMaXN0LnNwbGljZShpLCAxKVxuICAgIC8vICAgICAgICAgICAgIGJyZWFrXG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICBwdWJsaXNoKGV2ZW50LCBhcmcpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c0xpc3RbaV0uZXZlbnQgPT09IGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0aGlzVmFsdWUsIGZuLCBvbmNlIH0gPSB0aGlzLmV2ZW50c0xpc3RbaV1cbiAgICAgICAgICAgICAgICBmbi5jYWxsKHRoaXNWYWx1ZSwgYXJnKVxuICAgICAgICAgICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRFdmVudHNMaXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHNMaXN0XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBFdmVudE1hbmFnZXIoKVxuIiwiaW1wb3J0IE1hcCBmcm9tICcuL01hcCdcbmltcG9ydCBTY2VuZXJ5IGZyb20gJy4vU2NlbmVyeSdcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSAnLi9DaGFyYWN0ZXInXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuL1N0YXR1cydcbmltcG9ydCBVc2VySW5wdXQgZnJvbSAnLi9Vc2VySW5wdXQnXG5pbXBvcnQgQmx1ZXByaW50cyBmcm9tICcuL0JsdWVwcmludHMnXG5pbXBvcnQgaW52ZW50b3J5IGZyb20gJy4vaW52ZW50b3J5J1xuaW1wb3J0IHsgZ2VuZXJhdGVJdGVtcyB9IGZyb20gJy4vaXRlbXMnXG5pbXBvcnQgc3RvcmUgZnJvbSAnLi9zdG9yZSdcbmltcG9ydCBJbnZlbnRvcnlEaXNwbGF5IGZyb20gJy4vSW52ZW50b3J5RGlzcGxheSdcblxuY29uc3QgQ09MID0gNjBcbmNvbnN0IFJPVyA9IDYwXG5jb25zdCBJVEVNX05VTSA9IDVcblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgIH1cblxuICAgIGluaXRHYW1lKCkge1xuICAgICAgICBsZXQgc2V0dGluZ3NcblxuICAgICAgICBpZiAodGhpcy5oYXNHYW1lSW5Qcm9ncmVzcygpKSB7XG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRoaXMucmVzdW1lU2V0dGluZ3MoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSB0aGlzLmdlbmVyYXRlU2V0dGluZ3MoKVxuICAgICAgICB9XG5cblxuICAgICAgICBjb25zdCBtb3ZlZCA9IChsb2NhdGlvbikgPT4ge2NvbnNvbGUubG9nKCdsb2NhdGlvbicsIGxvY2F0aW9uKX1cbiAgICAgICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZSgnbW92ZWQtdG8nLCBtb3ZlZClcblxuICAgICAgICB0aGlzLmxvYWRTZXR0aW5ncyhzZXR0aW5ncylcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKVxuICAgIH1cblxuICAgIGhhc0dhbWVJblByb2dyZXNzKCkge1xuICAgICAgICByZXR1cm4gc3RvcmUuaGFzKCdtYXAnKVxuICAgIH1cblxuICAgIHJlc3VtZVNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIG1hcERhdGE6IHN0b3JlLmdldCgnbWFwJylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXR0aW5nc1xuICAgIH1cblxuICAgIGdlbmVyYXRlU2V0dGluZ3MoKSB7XG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0ge31cblxuICAgICAgICBzZXR0aW5ncy5tYXBEYXRhID0gTWFwLmdlbmVyYXRlKHsgY29sOiBDT0wsIHJvdzogIFJPVyB9KVxuXG4gICAgICAgIHN0b3JlLnNldCgnbWFwJywgc2V0dGluZ3MubWFwRGF0YSlcblxuICAgICAgICByZXR1cm4gc2V0dGluZ3NcbiAgICB9XG5cbiAgICBsb2FkU2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICAgICAgY29uc3QgYmx1ZXByaW50ID0gdGhpcy5ibHVlcHJpbnQgPSBCbHVlcHJpbnRzLnJhbmRvbSgpXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcyA9IGdlbmVyYXRlSXRlbXMoSVRFTV9OVU0pXG5cbiAgICAgICAgY29uc3Qgc3RhdHVzID0gdGhpcy5zdGF0dXMgPSBuZXcgU3RhdHVzKClcbiAgICAgICAgY29uc3QgaW52ZW50b3J5RGlzcGxheSA9IHRoaXMuaW52ZW50b3J5RGlzcGxheSA9IG5ldyBJbnZlbnRvcnlEaXNwbGF5KClcblxuICAgICAgICBjb25zdCBtYXAgPSB0aGlzLm1hcCA9IG5ldyBNYXAoc2V0dGluZ3MubWFwRGF0YSlcbiAgICAgICAgY29uc3Qgc2NlbmVyeSA9IHRoaXMuc2NlbmVyeSA9IG5ldyBTY2VuZXJ5KG1hcClcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyID0gdGhpcy5jaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKG1hcClcblxuICAgICAgICBtYXAuc2V0SXRlbXMoaXRlbXMpXG4gICAgICAgIG1hcC5zZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKVxuXG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gaW52ZW50b3J5XG4gICAgICAgIHRoaXMuaW52ZW50b3J5LmFkZChibHVlcHJpbnQpXG5cbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuaW5pdFVzZXJJbnB1dChjaGFyYWN0ZXIpXG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXNldCBtYXAhJylcblxuICAgICAgICBzdG9yZS5jbGVhcigpXG5cbiAgICAgICAgdGhpcy5pbml0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdFVzZXJJbnB1dChjaGFyYWN0ZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VySW5wdXQoe1xuICAgICAgICAgICAgJzgyJzogdGhpcy5yZXNldC5iaW5kKHRoaXMpLCAvLyAocikgcmVzZXQgbWFwXG4gICAgICAgICAgICAnMzgnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ25vcnRoJyksXG4gICAgICAgICAgICAnMzcnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3dlc3QnKSxcbiAgICAgICAgICAgICczOSc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnZWFzdCcpLFxuICAgICAgICAgICAgJzQwJzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdzb3V0aCcpLFxuICAgICAgICAgICAgJzg0JzogY2hhcmFjdGVyLmdldEFjdGlvbigndGFrZScpLCAvLyAodClha2UgaXRlbVxuICAgICAgICAgICAgJzczJzogY2hhcmFjdGVyLmdldEFjdGlvbignY2hlY2tJbnZlbnRvcnknKSwgLy8gY2hlY2sgKGkpbnZlbnRvcnlcbiAgICAgICAgICAgICc3Nyc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21pbmUnKSAvLyBkZXBsb3kgcGFydGljbGUgKG0paW5lclxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KCd5b3Ugd2FrZSB1cCcpXG4gICAgICAgIHRoaXMuc3RhdHVzLnNldChgeW91IGFyZSBjYXJyeWluZyAke3RoaXMuYmx1ZXByaW50Lm5hbWV9YCwgNDAwMClcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEdhbWUoKTtcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIEludmVudG9yeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMgPSBbXVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtaW52ZW50b3J5JywgdGhpcy5hZGQsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdyZW1vdmUtaW52ZW50b3J5JywgdGhpcy5yZW1vdmUsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtbWluZWQnLCB0aGlzLmFkZE1pbmVkLCB0aGlzKVxuXG4gICAgICAgIHRoaXMuc3RvcmVNaW5pbmcgPSB7fVxuXG4gICAgICAgIHRoaXMubWluaW5nU3RhdGVPYmogPSB7fVxuXG4gICAgfVxuXG4gICAgYWRkKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5jb250ZW50cy5wdXNoKGl0ZW0pXG4gICAgfVxuXG5cbiAgICBhZGRNaW5lZChjdXJyZW50T2JqKSB7XG4gICAgICAgIC8vIGlmIHN0YXRlIG9iamVjdCBkb2Vzbid0IGV4aXN0LCBhZGQgYWxsIHBhcnRpY2xlcyB0byBzdG9yYWdlXG4gICAgICAgIGlmICghdGhpcy5taW5pbmdTdGF0ZU9ialtjdXJyZW50T2JqLklEXSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVNaW5pbmdTdGF0ZShjdXJyZW50T2JqKVxuICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnRTdG9yYWdlKHRoaXMuc3RyaXBJRChjdXJyZW50T2JqKSlcblxuICAgICAgICAvLyBpZiBpdCBkb2VzIGV4aXN0LCBjaGVjayBjdXJyIHZzIHN0YXRlIGFuZCBhZGQgb25seSB0aGUgcmlnaHQgcGFydGljbGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmluY3JlbWVudFN0b3JhZ2UodGhpcy5zdHJpcElEKHRoaXMuY2hlY2tNaW5pbmdTdGF0ZShjdXJyZW50T2JqKSkpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1pbmluZ1N0YXRlKGN1cnJlbnRPYmopXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnbWluaW5nU3RhdGVPYmplY3Q6ICcsIHRoaXMubWluaW5nU3RhdGVPYmopXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdG9yZU1pbmluZzonLCB0aGlzLnN0b3JlTWluaW5nKVxuXG4gICAgICAgIGNvbnN0IGRpc3BsYXlQYXJ0aWNsZXMgPSB0aGlzLnN0b3JlTWluaW5nXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnZGlzcGxheS1taW5lZCcsIGRpc3BsYXlQYXJ0aWNsZXMpXG59XG5cblxuICAgIGNoZWNrTWluaW5nU3RhdGUoY3VycmVudE9iaikge1xuICAgICAgICBjb25zdCBjaGVja2VkT2JqID0ge31cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGN1cnJlbnRPYmopIHtcbiAgICAgICAgICAgIGlmICghY2hlY2tlZE9ialtrZXldKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tlZE9ialtrZXldID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdW2tleV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdW2tleV0gPSAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGVja2VkT2JqW2tleV0gPSBjdXJyZW50T2JqW2tleV0gLSB0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdW2tleV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hlY2tlZE9ialxuICAgIH1cblxuXG4gICAgaW5jcmVtZW50U3RvcmFnZShwYXJ0aWNsZU9iaikge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gcGFydGljbGVPYmopIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdG9yZU1pbmluZ1trZXldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9yZU1pbmluZ1trZXldID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdG9yZU1pbmluZ1trZXldICs9IHBhcnRpY2xlT2JqW2tleV1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgdXBkYXRlTWluaW5nU3RhdGUoY3VycmVudE9iaikge1xuICAgICAgICB0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdID0gT2JqZWN0LmFzc2lnbih7fSwgY3VycmVudE9iailcbiAgICB9XG5cblxuICAgIHN0cmlwSUQoY3VycmVudE9iaikge1xuICAgICAgICBjb25zdCBwYXJ0aWNsZU9iaiA9IHt9XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBjdXJyZW50T2JqKSB7XG4gICAgICAgICAgICBpZiAoa2V5ICE9PSAnSUQnKSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGVPYmpba2V5XSA9IGN1cnJlbnRPYmpba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJ0aWNsZU9ialxuICAgIH1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vLyB1bnRlc3RlZFxuXG4gICAgcmVtb3ZlKGl0ZW0pIHtcbiAgICAgICAgY29uc3QgdGhlSXRlbSA9IGl0ZW1cbiAgICAgICAgdGhpcy5jb250ZW50cy5mb3JFYWNoKChpdGVtLCBpLCBhcnJheSkgPT4ge1xuICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSB0aGVJdGVtKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50cy5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW0gbm90IGluIGludmVudG9yeScpXG4gICAgICAgICAgICB9fSlcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW52ZW50b3J5XG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnanMvTW92ZWFibGUnXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICdqcy9ldmVudE1hbmFnZXInXG5cblxuLy8gY29uc3QgSVRFTVMgPSB7XG4vLyAgICAgbWluZXI6IHtcbi8vICAgICAgICAgbmFtZTogJ3BhcnRpY2xlIG1pbmVyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnfCcsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAnbWluZXMsIGRpdmlkZXMsIGFuZCBzdG9yZXMgYW1iaWVudCBjaGVtaWNhbCBlbGVtZW50cyBhbmQgbGFyZ2VyIGNvbXBvdW5kcyBmb3VuZCB3aXRoaW4gYSAxMDAgbWV0ZXIgcmFkaXVzLiA5NyUgYWNjdXJhY3kgcmF0ZS4nLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLW1pbmVyJ1xuLy8gICAgIH0sXG4vLyAgICAgcGFyc2VyOiB7XG4vLyAgICAgICAgIG5hbWU6ICdub2lzZSBwYXJzZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICc/Jyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdwcm90b3R5cGUuIHBhcnNlcyBhdG1vc3BoZXJpYyBkYXRhIGZvciBsYXRlbnQgaW5mb3JtYXRpb24uIHNpZ25hbC10by1ub2lzZSByYXRpbyBub3QgZ3VhcmFudGVlZC4nLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLXBhcnNlcidcbi8vICAgICB9LFxuLy8gICAgIGludGVyZmFjZToge1xuLy8gICAgICAgICBuYW1lOiAncHNpb25pYyBpbnRlcmZhY2UnLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICcmJyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246IGBjb25uZWN0cyBzZWFtbGVzc2x5IHRvIGEgc3RhbmRhcmQtaXNzdWUgYmlvcG9ydC4gZmFjaWxpdGF0ZXMgc3VuZHJ5IGludGVyYWN0aW9ucyBwZXJmb3JtZWQgdmlhIFBTSS1ORVQuYCxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1pbnRlcmZhY2UnXG4vLyAgICAgfSxcbi8vICAgICBwcmludGVyOiB7XG4vLyAgICAgICAgIG5hbWU6ICdtb2xlY3VsYXIgcHJpbnRlcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJyMnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ2dlbmVyYXRlcyBvYmplY3RzIGFjY29yZGluZyB0byBhIGJsdWVwcmludC4gbW9sZWN1bGVzIG5vdCBpbmNsdWRlZC4nLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLXByaW50ZXInXG4vLyAgICAgfVxuLy8gfVxuXG5jbGFzcyBJdGVtIGV4dGVuZHMgTW92ZWFibGUge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW1Db25maWcpIHtcbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIC8vIG1lcmdlIGluIGNvbmZpZyBwcm9wZXJ0aWVzXG4gICAgICAgIC8vIGNvbnN0IHRhcmdldCA9IE9iamVjdC5hc3NpZ24odGhpcywgaXRlbUNvbmZpZylcblxuICAgICAgICAvLyBhZGRpdGlvbmFsIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5pZGVudGl0eU51bWJlciA9IFV0aWxpdHkuSWQoKVxuICAgICAgICB0aGlzLnR5cGUgPSAnaXRlbSdcbiAgICAgICAgdGhpcy5vZmZNYXAgPSBmYWxzZVxuICAgICAgICAvLyB0aGlzLmluSW52ZW50b3J5ID0gZmFsc2VcblxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgc2V0T25NYXAobWFwLCBsb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldE1hcChtYXApXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbEdyaWRJbmRpY2VzKGxvY2F0aW9uKVxuICAgICAgICB0aGlzLnNldENvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5zZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIHRoaXMuc2V0RGl2KHRoaXMuZ2V0SWQoKSlcbiAgICAgICAgdGhpcy51cGRhdGVEaXYodGhpcylcblxuLy8gbW92ZWQgdGhpcyBvdXQgc28gd2UgYXJlIG5vdCBjcmVhdGluZyBjaGlsZHJlbiBlYWNoIHRpbWUgd2Ugd2FudCB0byBwbGFjZSBvbiBtYXBcbiAgICAgICAgLy8gdGhpcy5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJylcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHlOdW1iZXJcbiAgICB9XG5cbiAgICBzZXRDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLmxlZnQgPSBjc3NMZWZ0XG4gICAgICAgIHRoaXMudG9wID0gY3NzVG9wXG4gICAgfVxuXG4gICAgc2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG5cbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgfVxuXG4gICAgc2V0RGl2KGlkZW50aXR5TnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5kaXZTZXQpIHtcbiAgICAgICAgICAgIHRoaXMuZGl2ID0gdGhpcy5kaXYgKyBpZGVudGl0eU51bWJlclxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGl2U2V0ID0gdHJ1ZVxuICAgIH1cblxuXG4gICAgLy8gc3BlY2lmaWMgdG8gaXRlbSBkcmF3aW5nOiB1c2Ugb3V0ZXJIVE1MXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXllcklkKVxuICAgICAgICBlbC5vdXRlckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cblxuXG4gICAgcmVuZGVyTGF5ZXIodW5pdCwgbGF5ZXJJZCkge1xuICAgICAgICBpZiAodW5pdC50eXBlID09PSAnaXRlbScpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGl2KHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBvblRha2UoKSB7XG4gICAgICAgIHRoaXMueCA9IG51bGxcbiAgICAgICAgdGhpcy55ID0gbnVsbFxuICAgICAgICB0aGlzLm9mZk1hcCA9IHRydWUgLy8gY2hhbmdlcyBjc3MgZGlzcGxheSB0byAnbm9uZSdcblxuICAgICAgICBzd2l0Y2ggKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAncGFydGljbGUgbWluZXInOlxuICAgICAgICAgICAgICAgIHRoaXMuaGFsdE1pbmluZygpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnYWRkLWludmVudG9yeScsIHRoaXMpXG4gICAgICAgIC8vIHRoaXMuRU0uc3Vic2NyaWJlKCdyZW1vdmUtaW52ZW50b3J5JywgdGhpcy5vbkRyb3AsIHRoaXMpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcywgdGhpcy5kaXYpXG4gICAgfVxuXG4gICAgb25Ecm9wKCkge1xuXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke3RoaXMubmFtZX0tJHt0aGlzLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMub25UYWtlLCB0aGlzLCB0cnVlKVxuICAgIC8vICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW1cbiIsImltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJ2pzL1V0aWxpdHknXG5cbmNsYXNzIFBhcnRpY2xlTWluZXIgZXh0ZW5kcyBJdGVtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIHRoaXMubmFtZSA9ICdwYXJ0aWNsZSBtaW5lcidcbiAgICAgICAgdGhpcy50eXBlID0gJ2l0ZW0nXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICd8J1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gJ21pbmVzLCBkaXZpZGVzLCBhbmQgc3RvcmVzIGFtYmllbnQgY2hlbWljYWwgZWxlbWVudHMgYW5kIGxhcmdlciBjb21wb3VuZHMgZm91bmQgd2l0aGluIGEgMTAwIG1ldGVyIHJhZGl1cy4gOTclIGFjY3VyYWN5IHJhdGUuJ1xuICAgICAgICB0aGlzLmRpdiA9ICdpdGVtLW1pbmVyJ1xuICAgICAgICAvLyBtdXN0IHN1YnNjcmliZSB0aGUgaXRlbSBkaXJlY3RseSwgbm90IG9uIHRoZSBhYnN0cmFjdCBjbGFzc1xuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHt0aGlzLm5hbWV9LSR7dGhpcy5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLm9uVGFrZSwgdGhpcylcblxuICAgICAgICB0aGlzLm1pbmVkUGFydGljbGVzID0ge1xuICAgICAgICAgICAgSUQ6IHRoaXMuaWRlbnRpdHlOdW1iZXJcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbWluZShsb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldE1pbmluZ0NvbmZpZygpXG5cbiAgICAgICAgdGhpcy5jYW5jZWxsYXRpb25LZXkgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leHRyYWN0UGFydGljbGVzKHRoaXMuZGV0ZXJtaW5lUGFydGljbGVBbW91bnRzKGxvY2F0aW9uKSlcbiAgICAgICAgfSwgMzAwMClcblxuICAgICAgICB0aGlzLnNldE9uTWFwKHRoaXMubWFwLCBsb2NhdGlvbilcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIodGhpcy5kaXYpXG4gICAgfVxuXG4gICAgc2V0TWluaW5nQ29uZmlnKCkge1xuICAgICAgICB0aGlzLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgIHRoaXMubWluaW5nID0gdHJ1ZVxuICAgICAgICAvLyB0aGlzLnNwaW5uaW5nID0gdHJ1ZVxuICAgIH1cblxuICAgIGRldGVybWluZVBhcnRpY2xlQW1vdW50cyhsb2NhdGlvbikge1xuICAgICAgICBjb25zdCBsb2NhbFBhcnRpY2xlcyA9IHRoaXMubWFwW2xvY2F0aW9uWzFdXVtsb2NhdGlvblswXV0ucGFydGljbGVzXG4gICAgICAgIGNvbnN0IGFsbFBhcnRpY2xlcyA9IFtdXG4gICAgICAgIE9iamVjdC5rZXlzKGxvY2FsUGFydGljbGVzKS5mb3JFYWNoKHBhcnRpY2xlID0+IHtcbiAgICAgICAgICAgIGxldCBudW1iZXJPZlBhcnRpY2xlcyA9IGxvY2FsUGFydGljbGVzW3BhcnRpY2xlXVxuICAgICAgICAgICAgd2hpbGUgKG51bWJlck9mUGFydGljbGVzKSB7XG4gICAgICAgICAgICAgICAgYWxsUGFydGljbGVzLnB1c2gocGFydGljbGUpXG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZQYXJ0aWNsZXMtLVxuICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGFsbFBhcnRpY2xlc1xuICAgIH1cblxuXG4gICAgZXh0cmFjdFBhcnRpY2xlcyhhbGxQYXJ0aWNsZXMpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tUGFydGljbGUgPSBhbGxQYXJ0aWNsZXNbVXRpbGl0eS5yYW5kb21pemUoYWxsUGFydGljbGVzLmxlbmd0aCldXG4gICAgICAgIGlmICghdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0pIHtcbiAgICAgICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXNbcmFuZG9tUGFydGljbGVdID0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0rK1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1pbmVkT2JqID0gdGhpcy5taW5lZFBhcnRpY2xlc1xuICAgICAgICBjb25zb2xlLmxvZygnaW4gUGFydGljbGVtaW5lcicsIG1pbmVkT2JqKVxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1taW5lZCcsIG1pbmVkT2JqKVxuXG4gICAgICAgIC8vIHRoaXMuZGlzcGxheVBhcnRpY2xlc01pbmVkKClcblxuICAgIH1cblxuICAgIGhhbHRNaW5pbmcoKSB7XG4gICAgICAgIHRoaXMubWluaW5nID0gZmFsc2VcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5jYW5jZWxsYXRpb25LZXkpXG4gICAgfVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJ0aWNsZU1pbmVyXG4iLCJpbXBvcnQgUGFydGljbGVNaW5lciBmcm9tICcuL1BhcnRpY2xlTWluZXInXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJ1xuXG5jb25zdCBJVEVNUyA9IFtcbiAgICBQYXJ0aWNsZU1pbmVyXG5dXG5cbmZ1bmN0aW9uIHJhbmRvbUl0ZW0oKSB7XG4gICAgcmV0dXJuIG5ldyBJVEVNU1tVdGlsaXR5LnJhbmRvbWl6ZShJVEVNUy5sZW5ndGgpXVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUl0ZW1zKG51bWJlciA9IDEpIHtcbiAgICBjb25zdCBpdGVtcyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXI7IGkrKykge1xuICAgICAgICBpdGVtcy5wdXNoKHJhbmRvbUl0ZW0oKSlcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1zXG59XG5cblxuZXhwb3J0IHtcbiAgICBnZW5lcmF0ZUl0ZW1zXG59XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbG9jYWxzdG9yYWdlLCBzYXZpbmcgZGlzYWJsZWQnKVxuICAgICAgICAgICAgd2luZG93LmFsZXJ0KCdzYXZpbmcgZGlzYWJsZWQnKVxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5jbGVhcigpXG4gICAgfVxuXG4gICAgaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gKHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkgIT09IG51bGwpXG4gICAgfVxuXG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3JlLnNldCcsIGtleSlcblxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSlcbiAgICB9XG5cbiAgICBnZXQoa2V5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdG9yZS5nZXQnLCBrZXkpXG5cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KSlcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFN0b3JlKClcbiJdfQ==
