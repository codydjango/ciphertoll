(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _game = require('./js/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.game = _game2.default;

},{"./js/game":15}],2:[function(require,module,exports){
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

},{"./Utility":13}],3:[function(require,module,exports){
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
    function Character(mapInstance) {
        _classCallCheck(this, Character);

        var _this = _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).call(this, mapInstance));

        _this.mapInstance = mapInstance;
        _this.EM = _eventManager2.default;
        _this.inventory = _inventory2.default.contents;
        _this.initialGridIndices = mapInstance.getMapCenter();
        _this.setInitialGridIndices(_this.initialGridIndices);
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

},{"./Constants":4,"./Moveable":8,"./eventManager":14,"./inventory":16}],4:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
                item.createInitialChildElement('item-layer'); // moved childElement creation out of 'setOnMap'
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

},{"./MapGenerator":7,"./Utility":13,"./eventManager":14}],7:[function(require,module,exports){
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

},{"./Constants":4,"./LandscapeData":5,"./Utility":13}],8:[function(require,module,exports){
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

},{"./Renderable":9,"./Utility":13,"./eventManager":14}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./Renderable":9}],11:[function(require,module,exports){
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

},{"./eventManager":14}],12:[function(require,module,exports){
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

},{"./Utility":13}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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
            var items = (0, _items.generateItems)(5);

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

},{"./Blueprints":2,"./Character":3,"./Map":6,"./Scenery":10,"./Status":11,"./UserInput":12,"./eventManager":14,"./inventory":16,"./items":19}],16:[function(require,module,exports){
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

},{"./eventManager":14}],17:[function(require,module,exports){
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

},{"../Moveable":8,"../Utility":13,"../eventManager":14}],18:[function(require,module,exports){
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

        _this.minedParticles = {};
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

            this.displayParticlesMined();
        }
    }, {
        key: 'displayParticlesMined',
        value: function displayParticlesMined() {

            var str = this.cleanJSONString(JSON.stringify(this.minedParticles));
            this.EM.publish('status', str);

            console.log('particles mined', this.minedParticles);
        }
    }, {
        key: 'cleanJSONString',
        value: function cleanJSONString(string) {
            string = string.replace(/"/g, '');
            string = string.replace(/:/g, ' ');
            string = string.replace(/{/g, '');
            string = string.replace(/}/g, '');
            string = string.replace(/,/g, ' | ');
            return string;
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

},{"../Utility":13,"./Item":17}],19:[function(require,module,exports){
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

},{"../Utility":13,"./Item":17,"./ParticleMiner":18}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0xhbmRzY2FwZURhdGEuanMiLCJzcmMvanMvTWFwLmpzIiwic3JjL2pzL01hcEdlbmVyYXRvci5qcyIsInNyYy9qcy9Nb3ZlYWJsZS5qcyIsInNyYy9qcy9SZW5kZXJhYmxlLmpzIiwic3JjL2pzL1NjZW5lcnkuanMiLCJzcmMvanMvU3RhdHVzLmpzIiwic3JjL2pzL1VzZXJJbnB1dC5qcyIsInNyYy9qcy9VdGlsaXR5LmpzIiwic3JjL2pzL2V2ZW50TWFuYWdlci5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2ludmVudG9yeS5qcyIsInNyYy9qcy9pdGVtcy9JdGVtLmpzIiwic3JjL2pzL2l0ZW1zL1BhcnRpY2xlTWluZXIuanMiLCJzcmMvanMvaXRlbXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxPQUFPLElBQVA7Ozs7Ozs7Ozs7O0FDRkE7Ozs7Ozs7O0FBR0EsSUFBTSxnQkFBZ0I7QUFDbEIsc0JBQWtCO0FBQ2QsY0FBTSwrQkFEUTtBQUVkLHFCQUFhLEVBRkM7QUFHZCxtQkFBVyxFQUhHO0FBSWQsc0JBQWM7QUFKQSxLQURBO0FBT2xCLG9CQUFnQjtBQUNaLGNBQU0sNkJBRE07QUFFWixxQkFBYSxFQUZEO0FBR1osbUJBQVcsRUFIQztBQUlaLHNCQUFjO0FBSkYsS0FQRTtBQWFsQixtQkFBZTtBQUNYLGNBQU0sNEJBREs7QUFFWCxxQkFBYSxFQUZGO0FBR1gsbUJBQVcsRUFIQTtBQUlYLHNCQUFjO0FBSkg7QUFiRyxDQUF0Qjs7SUFzQk0sUztBQUNGLHVCQUFZLElBQVosRUFBa0IsV0FBbEIsRUFBK0I7QUFBQTs7QUFDM0IsYUFBSyxJQUFMLEdBQVksSUFB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LE1BQXBCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQzdCLGNBQU0sSUFBTixDQUFXLFlBQVg7QUFDSDtBQUNELFdBQU8sS0FBUDtBQUNIOztRQUlHLGEsR0FBQSxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2pzL2dhbWUnXG5cbndpbmRvdy5nYW1lID0gZ2FtZVxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNvbnN0IGJsdWVwcmludERhdGEgPSB7XG4gICAgYXJ0aWZpY2lhbE11c2NsZToge1xuICAgICAgICBuYW1lOiAnYXJ0aWZpY2lhbCBtdXNjbGUgKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHJldGluYWxEaXNwbGF5OiB7XG4gICAgICAgIG5hbWU6ICdyZXRpbmFsIGRpc3BsYXkgKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9LFxuICAgIHByb3N0aGV0aWNBcm06IHtcbiAgICAgICAgbmFtZTogJ3Byb3N0aGV0aWMgYXJtIChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfVxufVxuXG5cbmNsYXNzIEJsdWVwcmludCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9tKCkge1xuICAgICAgICBjb25zdCBibHVlcHJpbnRWYWx1ZXMgPSBPYmplY3QudmFsdWVzKGJsdWVwcmludERhdGEpXG4gICAgICAgIGNvbnN0IGluZGV4ID0gVXRpbGl0eS5yYW5kb21pemUoYmx1ZXByaW50VmFsdWVzLmxlbmd0aClcblxuICAgICAgICBjb25zdCByYW5kb21CbHVlcHJpbnQgPSBibHVlcHJpbnRWYWx1ZXNbaW5kZXhdXG5cbiAgICAgICAgcmV0dXJuIG5ldyBCbHVlcHJpbnQocmFuZG9tQmx1ZXByaW50Lm5hbWUsIHJhbmRvbUJsdWVwcmludC5kZXNjcmlwdGlvbilcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQmx1ZXByaW50XG5cbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICcuL01vdmVhYmxlJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBpbnZlbnRvcnkgZnJvbSAnLi9pbnZlbnRvcnknXG5cblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgTW92ZWFibGUgeyAgLy8gQ2hhcmFjdGVyIGRhdGEgYW5kIGFjdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXBJbnN0YW5jZSkge1xuICAgICAgICBzdXBlcihtYXBJbnN0YW5jZSlcbiAgICAgICAgdGhpcy5tYXBJbnN0YW5jZSA9IG1hcEluc3RhbmNlXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnkuY29udGVudHNcbiAgICAgICAgdGhpcy5pbml0aWFsR3JpZEluZGljZXMgPSBtYXBJbnN0YW5jZS5nZXRNYXBDZW50ZXIoKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyh0aGlzLmluaXRpYWxHcmlkSW5kaWNlcylcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJhY3RlciByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyTGF5ZXIodW5pdCwgbGF5ZXJJZCkge1xuICAgICAgICBpZiAodW5pdC50eXBlID09PSAnYWN0b3InKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNwYW4odW5pdClcbiAgICAgICAgICAgIHRoaXMuZHJhd0xheWVyKGxheWVySWQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdWJzY3JpYmVJdGVtc1RvTWFwKCkge1xuICAgICAgICAvLyBOT1QgUkVRVUlSRUQgQVQgVEhFIE1PTUVOVFxuXG4gICAgICAgIC8vIHRoaXMubWFwLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgLy8gICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke2l0ZW0ubmFtZX0tJHtpdGVtLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMudGFrZUl0ZW0sIHRoaXMsIHRydWUpXG4gICAgICAgIC8vIH0pXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgdHlwZTogJ2FjdG9yJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdAJyxcbiAgICAgICAgICAgIGNsczogJ2NoYXJhY3RlcicsXG4gICAgICAgICAgICBsZWZ0OiBjc3NMZWZ0LFxuICAgICAgICAgICAgdG9wOiBjc3NUb3AsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBnZXRBY3Rpb24oZm5OYW1lLCBhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbZm5OYW1lXS5iaW5kKHRoaXMsIGFyZylcbiAgICB9XG5cbiAgICBtb3ZlKGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy51cGRhdGVHcmlkSW5kaWNlcyh0aGlzLmdldENoYXJhY3RlcigpLCBESVJFQ1RJT05TW2RpcmVjdGlvbl0pXG4gICAgICAgIHRoaXMucHJpbnRMb2NhbFN0YXR1cygpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgfVxuXG4gICAgcHJpbnRMb2NhbFN0YXR1cygpIHtcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLmxvY2F0aW9uKVxuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG4gICAgICAgIGlmIChsb2NhbEl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChsb2NhbEl0ZW0ubWluaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAnYSBtaW5lciBwdWxscyBjb21wb3VuZHMgZnJvbSB0aGUgcmVnaW9uJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LWl0ZW0nLCBsb2NhbEl0ZW0ubmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsSXRlbSgpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgbGV0IGxvY2FsSXRlbSA9IG51bGxcbiAgICAgICAgdGhpcy5tYXBJbnN0YW5jZS5pdGVtc09uTWFwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS54ID09PSBjaGFyLnggJiYgaXRlbS55ID09PSBjaGFyLnkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEl0ZW0gPSBpdGVtXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGxvY2FsSXRlbVxuICAgIH1cblxuXG4gICAgdGFrZSgpIHtcbiAgICAgICAgY29uc3QgbG9jYWxJdGVtID0gdGhpcy5sb2NhbEl0ZW0oKVxuICAgICAgICBpZiAobG9jYWxJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goYCR7bG9jYWxJdGVtLm5hbWV9LSR7bG9jYWxJdGVtLmlkZW50aXR5TnVtYmVyfSB0YWtlbmApXG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIGAke2xvY2FsSXRlbS5uYW1lfSB0YWtlbmApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICd0aGVyZSBpcyBub3RoaW5nIGhlcmUgd29ydGggdGFraW5nJylcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgY2hlY2tJbnZlbnRvcnkoKSB7XG4gICAgICAgIGNvbnN0IGNhcnJ5aW5nID0gdGhpcy5pbnZlbnRvcnkubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKS5qb2luKCcgfCAnKVxuICAgICAgICBjb25zdCB0ZXh0ID0gYHlvdSBhcmUgY2Fycnlpbmc6ICR7Y2Fycnlpbmd9YFxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIHRleHQpXG4gICAgfVxuXG5cbiAgICBmaW5kSW52ZW50b3J5SXRlbShpdGVtTmFtZSkge1xuICAgICAgICBsZXQgZm91bmRJdGVtID0gbnVsbFxuICAgICAgICB0aGlzLmludmVudG9yeS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gaXRlbU5hbWUpIHtcbiAgICAgICAgICAgICAgICBmb3VuZEl0ZW0gPSBpdGVtXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBmb3VuZEl0ZW1cbiAgICB9XG5cbiAgICBtaW5lKCkge1xuXG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIGNvbnN0IG1pbmVyID0gdGhpcy5maW5kSW52ZW50b3J5SXRlbSgncGFydGljbGUgbWluZXInKVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IFtjaGFyLngsIGNoYXIueV1cblxuXG4gICAgICAgIGlmIChtaW5lcikge1xuICAgICAgICAgICAgbWluZXIubWluZShsb2NhdGlvbilcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgncmVtb3ZlLWludmVudG9yeScsIG1pbmVyKVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ3lvdSBkbyBub3QgaGF2ZSBhbnkgcGFydGljbGUgbWluZXJzJylcblxuICAgICAgICB9XG5cbiAgICB9XG5cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlclxuIiwiY29uc3QgRElSRUNUSU9OUyA9IHtcbiAgICBub3J0aDogeyB4OiAwLCB5OiAtMSB9LFxuICAgIHNvdXRoOiB7IHg6IDAsIHk6IDEgfSxcbiAgICBlYXN0OiB7IHg6IDEsIHk6IDAgfSxcbiAgICB3ZXN0OiB7IHg6IC0xLCB5OiAwIH0sXG4gICAgbm9ydGh3ZXN0OiB7IHg6IC0xLCB5OiAtMSB9LFxuICAgIG5vcnRoZWFzdDogeyB4OiAxLCB5OiAtMSB9LFxuICAgIHNvdXRoZWFzdDogeyB4OiAxLCB5OiAxIH0sXG4gICAgc291dGh3ZXN0OiB7IHg6IC0xLCB5OiAxIH1cbn1cblxuXG5leHBvcnQgeyBESVJFQ1RJT05TIH1cbiIsImNsYXNzIExhbmRzY2FwZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZlYXR1cmVzID0gdGhpcy5mZWF0dXJlcygpXG4gICAgICAgIHRoaXMuYmFyZSA9IHRoaXMuYmFyZSgpXG4gICAgfVxuXG4gICAgZmVhdHVyZXMoKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZCA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcuJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFpciBpcyBjaG9rZWQgd2l0aCBkdXN0LCBzdGF0aWMsIHdpZmknLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI1LFxuICAgICAgICAgICAgY2xzOiAncGVyaW9kJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgY2hyb21lOiAxNSxcbiAgICAgICAgICAgICAgICBsZWFkOiAzMCxcbiAgICAgICAgICAgICAgICBzdHlyb2ZvYW06IDMwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIGh5ZHJvY2FyYm9uczogMTUsXG4gICAgICAgICAgICAgICAgc2lsaWNvbjogMTAsXG4gICAgICAgICAgICAgICAgY2VyYW1pYzogMTBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21tYSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcsJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnc3ByYXdsIG9mIHNtYXJ0IGhvbWVzLCBjdWwtZGUtc2FjcywgbGFuZXdheXMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI2LFxuICAgICAgICAgICAgY2xzOiAnY29tbWEnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBsYXRleDogMTUsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIGJvbmU6IDEwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JhdmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnXicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2Egc2hpbW1lcmluZyBmaWVsZCBvZiBzb2xhciBwYW5lbHMsIGJyb2tlbiBhbmQgY29ycm9kZWQnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDIyLFxuICAgICAgICAgICAgY2xzOiAnZ3JhdmUnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBmaWJlcjogMTAsXG4gICAgICAgICAgICAgICAgb3pvbmU6IDE1LFxuICAgICAgICAgICAgICAgIGJlbnplbmU6IDIwLFxuICAgICAgICAgICAgICAgIGdsYXNzOiAzMCxcbiAgICAgICAgICAgICAgICBjZXJhbWljOiAxMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXN0ZXJpc2sgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnKicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2hvbGxvdyB1c2VycyBqYWNrIGluIGF0IHRoZSBkYXRhaHVicycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjAsXG4gICAgICAgICAgICBjbHM6ICdhc3RlcmlzaycsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBjaHJvbWU6IDE1LFxuICAgICAgICAgICAgICAgIGxlYWQ6IDMwLFxuICAgICAgICAgICAgICAgIG1lcmN1cnk6IDEwLFxuICAgICAgICAgICAgICAgIHN0eXJvZm9hbTogMzAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgYmVuemVuZTogMjAsXG4gICAgICAgICAgICAgICAgc2lsaWNvbjogMTAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGVyaW9kLCBjb21tYSwgc2VtaWNvbG9uLCBzZW1pY29sb24sIGFzdGVyaXNrLCBhc3RlcmlzaywgZ3JhdmUsIGdyYXZlXVxuICAgIH1cblxuICAgIGJhcmUoKSB7XG4gICAgICAgIGNvbnN0IGJhcmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnJm5ic3A7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnY29uY3JldGUgYW5kIHR3aXN0ZWQgcmViYXIgc3RyZXRjaCB0byB0aGUgaG9yaXpvbicsXG4gICAgICAgICAgICBjbHM6ICdibGFuaycsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBpcm9uOiAzMCxcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBib25lOiAxMCxcbiAgICAgICAgICAgICAgICBoeWRyb2NhcmJvbnM6IDE1LFxuICAgICAgICAgICAgICAgIHVyYW5pdW06IDEwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmFyZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFuZHNjYXBlRGF0YVxuIiwiaW1wb3J0IE1hcEdlbmVyYXRvciBmcm9tICcuL01hcEdlbmVyYXRvcidcbmltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cblxuY2xhc3MgTWFwIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2wsIHJvdykge1xuICAgICAgICB0aGlzLmNvbCA9IGNvbFxuICAgICAgICB0aGlzLnJvdyA9IHJvd1xuICAgICAgICB0aGlzLmdlbmVyYXRlZE1hcCA9IG5ldyBNYXBHZW5lcmF0b3IoY29sLCByb3cpXG4gICAgICAgIHRoaXMubWFwID0gdGhpcy5nZW5lcmF0ZWRNYXAuZ2V0TWFwKClcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwXG4gICAgfVxuXG4gICAgZ2V0TWFwQ2VudGVyKCkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IodGhpcy5jb2wvMiksIE1hdGguZmxvb3IodGhpcy5yb3cvMildXG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tTWFwTG9jYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKSwgVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKV1cbiAgICB9XG5cbiAgICBzZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKSB7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLnNldE1hcCh0aGlzLm1hcClcbiAgICB9XG5cbiAgICBzZXRJdGVtcyhpdGVtcykge1xuICAgICAgICBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21NYXBMb2NhdGlvbiA9IHRoaXMuZ2V0UmFuZG9tTWFwTG9jYXRpb24oKVxuICAgICAgICAgICAgaXRlbS5zZXRPbk1hcCh0aGlzLm1hcCwgcmFuZG9tTWFwTG9jYXRpb24pXG4gICAgICAgICAgICBpdGVtLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKSAgLy8gbW92ZWQgY2hpbGRFbGVtZW50IGNyZWF0aW9uIG91dCBvZiAnc2V0T25NYXAnXG4gICAgICAgICAgICB0aGlzLnB1c2hJdGVtKGl0ZW0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVzaEl0ZW0oaXRlbSkge1xuICAgICAgICB0aGlzLml0ZW1zT25NYXAucHVzaChpdGVtKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgTGFuZHNjYXBlRGF0YSBmcm9tICcuL0xhbmRzY2FwZURhdGEnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5cblxuY2xhc3MgTWFwR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2wsIHJvdykge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2VuZXJhdGluZyBtYXAnKVxuICAgICAgICB0aGlzLmxhbmRzY2FwZVNlZWRzID0gbmV3IExhbmRzY2FwZURhdGEoKVxuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5pbml0KGNvbCwgcm93KVxuICAgICAgICBjb25zdCBzZWVkZWRHcmlkID0gdGhpcy5zZWVkKGdyaWQpXG4gICAgICAgIHRoaXMuc2VlZGVkR3JpZCA9IHNlZWRlZEdyaWRcbiAgICAgICAgdGhpcy5ncm93KClcbiAgICAgICAgY29uc29sZS5sb2coJ21hcCBnZW5lcmF0ZWQnKVxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VlZGVkR3JpZFxuICAgIH1cblxuICAgIGluaXQoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcbiAgICAgICAgY29uc3QgZ3JpZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93OyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2w7IGorKykge1xuICAgICAgICAgICAgICAgIGdyaWRbaV0ucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBzZWVkKGdyaWQpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tRWxlbWVudHMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKTsgaSsrKSB7XG4gICAgICAgICAgICByYW5kb21FbGVtZW50cy5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlcy5sZW5ndGgpXSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWVkcyA9IHRoaXMuZ2VuZXJhdGVTZWVkTG9jYXRpb25zKHJhbmRvbUVsZW1lbnRzKVxuICAgICAgICBzZWVkcy5tYXAoc2VlZCA9PiBncmlkW3NlZWQueV1bc2VlZC54XSA9IHNlZWQpXG4gICAgICAgIHRoaXMuX3NlZWRzID0gc2VlZHNcbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpIHtcbiAgICAgICAgLy8gIHJldHVybiAxICAgICAgICAvLyB0ZXN0IHNldHRpbmdcbiAgICAgICAgLy8gcmV0dXJuICgodGhpcy5jb2wgKiB0aGlzLnJvdykgLyAodGhpcy5fY29sICsgdGhpcy5yb3cpKSAgLy8gc3BhcnNlIGluaXRpYWwgc2VlZGluZ1xuICAgICAgICByZXR1cm4gKHRoaXMuY29sICsgdGhpcy5yb3cpICAvLyByaWNoIGluaXRpYWwgc2VlZGluZ1xuICAgIH1cblxuICAgIGdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cykge1xuICAgICAgICByZXR1cm4gcmFuZG9tRWxlbWVudHMubWFwKGVsID0+IHtcbiAgICAgICAgICAgIGVsLnggPSBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpXG4gICAgICAgICAgICBlbC55ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKVxuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ3JvdygpIHtcbiAgICAgICAgbGV0IHNlZWRzID0gdGhpcy5fc2VlZHNcbiAgICAgICAgbGV0IG1hcFBvcHVsYXRlZCA9IGZhbHNlXG5cbiAgICAgICAgd2hpbGUgKCFtYXBQb3B1bGF0ZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ29vZFNlZWRzID0gW11cbiAgICAgICAgICAgIHRoaXMuZ29vZFNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB0aGlzLm5leHRHZW5lcmF0aW9uU2VlZHMoc2VlZHMpLmZvckVhY2goKHNlZWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1NlZWQoc2VlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZFNlZWRzLnB1c2godGhpcy5jaGVja1NlZWQoc2VlZCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGZvciAobGV0IGdvb2RTZWVkIG9mIGdvb2RTZWVkcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPSBnb29kU2VlZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5jb3VudFVuc2VlZGVkTG9jYXRpb25zKCkpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3VudFVuc2VlZGVkTG9jYXRpb25zKCkge1xuICAgICAgICBjb25zdCBmbGF0dGVuZWRHcmlkID0gW10uY29uY2F0LmFwcGx5KFtdLCB0aGlzLnNlZWRlZEdyaWQpXG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSBvZiBmbGF0dGVuZWRHcmlkKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICAgICAgY291bnQrK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudFxuICAgIH1cblxuICAgIGNoZWNrU2VlZChzZWVkKSB7XG4gICAgICAgIGxldCBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICBpZiAoKHNlZWQueCA8IHRoaXMuY29sICYmIHNlZWQueCA+PSAwKSAmJlxuICAgICAgICAgICAgKHNlZWQueSA8IHRoaXMucm93ICYmIHNlZWQueSA+PSAwKSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW3NlZWQueV1bc2VlZC54XSAhPT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nb29kU2VlZHMuZm9yRWFjaChnb29kU2VlZCA9PiB7XG4gICAgICAgICAgICBpZiAoKHNlZWQueCA9PT0gZ29vZFNlZWQueCkgJiZcbiAgICAgICAgICAgICAgICAoc2VlZC55ID09PSBnb29kU2VlZC55KSkge1xuICAgICAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHNlZWRTdWNjZWVkcykge1xuICAgICAgICAgICAgcmV0dXJuIHNlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKSB7XG4gICAgICAgIGNvbnN0IG5leHRHZW5TZWVkcyA9IFtdXG4gICAgICAgIHNlZWRzLmZvckVhY2goKG9yaWdpbmFsU2VlZCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIGluIERJUkVDVElPTlMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb25WYWx1ZXMgPSBESVJFQ1RJT05TW2RpcmVjdGlvbl1cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0R2VuU2VlZCA9IE9iamVjdC5hc3NpZ24oe30sIG9yaWdpbmFsU2VlZClcbiAgICAgICAgICAgICAgICBpZiAoVXRpbGl0eS5wcm9iYWJpbGl0eShuZXh0R2VuU2VlZC5wcm9iYWJpbGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGRpcmVjdGlvblZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZC54ID0gb3JpZ2luYWxTZWVkLnggKyBkaXJlY3Rpb25WYWx1ZXNba2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueSA9IG9yaWdpbmFsU2VlZC55ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZHMucHVzaChuZXh0R2VuU2VlZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMubmV4dEdlblNlZWRzID0gbmV4dEdlblNlZWRzXG4gICAgICAgIHJldHVybiBuZXh0R2VuU2VlZHNcbiAgICB9XG5cbiAgICAvLyBwcm9iYWJpbGl0eShwZXJjZW50YWdlKSB7XG4gICAgLy8gICAgIGNvbnN0IHByb2JhYmlsaXR5QXJyYXkgPSBbXVxuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcmNlbnRhZ2U7IGkrKykge1xuICAgIC8vICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKHRydWUpXG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAgLSBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAvLyAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaChmYWxzZSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gcHJvYmFiaWxpdHlBcnJheVtVdGlsaXR5LnJhbmRvbWl6ZSgxMDApXVxuICAgIC8vIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwR2VuZXJhdG9yXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5cblxuY2xhc3MgTW92ZWFibGUgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIG1vdmVtZW50IGFuZCBwbGFjZW1lbnQgb24gdGhlIGdyaWRcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgc2V0TWFwKG1hcCkge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgIH1cblxuICAgIHNldEluaXRpYWxHcmlkSW5kaWNlcyhncmlkSW5kaWNlcykge1xuICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gZ3JpZEluZGljZXNcbiAgICB9XG5cbiAgICBnZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cblxuICAgICAgICByZXR1cm4geyB4LCB5IH1cbiAgICB9XG5cbiAgICB1cGRhdGVHcmlkSW5kaWNlcyhhY3RvciwgbW92ZSkge1xuICAgICAgICBjb25zdCBuZXdHcmlkSW5kaWNlcyA9IFt0aGlzLmdyaWRJbmRpY2VzWzBdICsgbW92ZS54LCB0aGlzLmdyaWRJbmRpY2VzWzFdICsgbW92ZS55XVxuICAgICAgICBsZXQgbG9jYXRpb24gPSAnJ1xuICAgICAgICBpZiAodGhpcy5jaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSkge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLm1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gbmV3R3JpZEluZGljZXNcbiAgICAgICAgICAgIGFjdG9yLnggPSBuZXdHcmlkSW5kaWNlc1swXVxuICAgICAgICAgICAgYWN0b3IueSA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2NhdGlvbiA9IHRoaXMubWFwW3RoaXMuZ3JpZEluZGljZXNbMV0sIHRoaXMuZ3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAoYWN0b3IubmFtZSA9PT0gJ2NoYXJhY3RlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIFwieW91J3ZlIHJlYWNoZWQgdGhlIG1hcCdzIGVkZ2VcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYXRpb25cbiAgICB9XG5cbiAgICBjaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSB7XG4gICAgICAgIGxldCBsb2NhdGlvbk9uR3JpZCA9IGZhbHNlXG5cbiAgICAgICAgY29uc3QgeCA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIGNvbnN0IHkgPSBuZXdHcmlkSW5kaWNlc1swXVxuXG4gICAgICAgIGlmICh0aGlzLm1hcFt4XSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLm1hcFt4XVt5XVxuICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb25PbkdyaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYXRpb25PbkdyaWRcbiAgICB9XG5cbiAgICBnZXRDU1NIZWlnaHRBbmRXaWR0aCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdCcpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgICAgIGNvbnN0IHdpZHRoID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKVxuICAgICAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH1cbiAgICB9XG5cbiAgICBnZXRDU1NDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgY3NzID0gdGhpcy5nZXRDU1NIZWlnaHRBbmRXaWR0aCgpXG4gICAgICAgIGNvbnN0IGNzc0xlZnQgPSB0aGlzLmdyaWRJbmRpY2VzWzBdICogY3NzLmhlaWdodFxuICAgICAgICBjb25zdCBjc3NUb3AgPSB0aGlzLmdyaWRJbmRpY2VzWzFdICogY3NzLndpZHRoXG4gICAgICAgIHJldHVybiB7IGNzc0xlZnQsIGNzc1RvcCB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1vdmVhYmxlXG4iLCJjbGFzcyBSZW5kZXJhYmxlIHsgIC8vIGdlbmVyYWxpemVkIHJlbmRlciBmdW5jdGlvbnMgZm9yIFNjZW5lcnksIENoYXJhY3RlclxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHNldExheWVyKGxheWVyKSB7XG4gICAgICAgIHRoaXMubGF5ZXIgPSBsYXllclxuICAgIH1cblxuICAgIGdldExheWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXllclxuICAgIH1cblxuICAgIHJlbmRlclNwYW4odW5pdCkge1xuICAgICAgICBsZXQgY2xzID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgICAgY2xzID0gdW5pdC5jbHNcbiAgICAgICAgICAgIGVsZW1lbnQgPSB1bml0LmVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bml0LnRvcCAmJiB1bml0LmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHt1bml0LnRvcH1weDsgbGVmdDogJHt1bml0LmxlZnR9cHhgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInVuaXQgJHtjbHN9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L3NwYW4+YFxuICAgIH1cblxuICAgIHJlbmRlckRpdihpdGVtKSB7XG4gICAgICAgIGxldCBkaXYgPSAnJ1xuICAgICAgICBsZXQgZWxlbWVudCA9ICcmbmJzcDsnXG4gICAgICAgIGxldCBzdHlsZSA9ICcnXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBkaXYgPSBpdGVtLmRpdlxuICAgICAgICAgICAgZWxlbWVudCA9IGl0ZW0uZWxlbWVudFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnRvcCAmJiBpdGVtLmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHtpdGVtLnRvcH1weDsgbGVmdDogJHtpdGVtLmxlZnR9cHg7IHBvc2l0aW9uOiBhYnNvbHV0ZWBcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5vZmZNYXApIHtcbiAgICAgICAgICAgIHN0eWxlICs9IGA7IGRpc3BsYXk6IG5vbmVgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ubWluaW5nKSB7XG4gICAgICAgICAgICBzdHlsZSArPSBgOyBhbmltYXRpb246IG1pbmluZyAzcyBpbmZpbml0ZWBcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiAoaXRlbS5zcGlubmluZykge1xuICAgICAgICAvLyAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBzcGlubmluZyAxcyBpbmZpbml0ZWBcbiAgICAgICAgLy8gfVxuICAgICAgICByZXR1cm4gYDxkaXYgaWQ9XCIke2Rpdn1cIiBzdHlsZT1cIiR7c3R5bGV9XCI+JHtlbGVtZW50fTwvZGl2PmBcbiAgICB9XG5cbiAgICB1cGRhdGVTcGFuKGFjdG9yKSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5yZW5kZXJTcGFuKGFjdG9yKSlcbiAgICB9XG5cbiAgICB1cGRhdGVEaXYoaXRlbSkge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyRGl2KGl0ZW0pKVxuICAgIH1cblxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG4gICAgY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudChwYXJlbnRMYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFyZW50TGF5ZXJJZClcbiAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSAvLyBjcmVhdGVzIGRpdiBpZCB3aXRoaW4gZW5jbG9zaW5nIGRpdiAuLi5cbiAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlcmFibGVcbiIsImltcG9ydCBSZW5kZXJhYmxlIGZyb20gJy4vUmVuZGVyYWJsZSdcblxuXG5jbGFzcyBTY2VuZXJ5IGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBTY2VuZXJ5LXNwZWNpZmljIHJlbmRlcmluZyBmdW5jdGlvbnNcbiAgICBjb25zdHJ1Y3RvcihtYXApIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLm1hcCA9IG1hcC5nZXRNYXAoKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKClcbiAgICAgICAgY29uc29sZS5sb2coJ3NjZW5lcnkgcmVuZGVyZWQnKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKCkge1xuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5tYXAubWFwKGFyciA9PiB7IHJldHVybiBhcnIuc2xpY2UoKSB9KVxuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMuY3JlYXRlTGF5ZXIoZ3JpZCkpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVMYXllcihncmlkKSB7XG4gICAgICAgIGNvbnN0IHNjZW5lcnlHcmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3dJdGVtcyA9IGdyaWRbaV1cbiAgICAgICAgICAgIGxldCByb3cgPSAnJyAgLy8gcG9zc2libHkgbWFrZSBlYWNoIHJvdyBhIHRhYmxlP1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvdyArPSB0aGlzLnJlbmRlclNwYW4ocm93SXRlbXNbaV0pIC8vIGFkZCByZW5kZXJlZCBpdGVtcyB0byB0aGUgZ3JpZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NlbmVyeUdyaWQucHVzaChyb3cpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjZW5lcnlHcmlkXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKCkge1xuICAgICAgICBjb25zdCBsYXllciA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBjb25zdCBncmlkVG9IVE1MID0gbGF5ZXIuam9pbignPGJyIC8+JykgIC8vIHVzaW5nIEhUTUwgYnJlYWtzIGZvciBub3dcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGFuZHNjYXBlLWxheWVyJylcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gZ3JpZFRvSFRNTFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTY2VuZXJ5XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLnVwZGF0ZSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktaXRlbScsIHRoaXMuZGlzcGxheUl0ZW0sIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdzdGF0dXMnLCB0aGlzLmRlZmF1bHQsIHRoaXMpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIGJlZ2luc1dpdGhWb3dlbCh0ZXh0KSB7XG4gICAgICAgIGNvbnN0IGZpcnN0TGV0dGVyID0gdGV4dFswXVxuICAgICAgICBjb25zdCB2b3dlbHMgPSBbJ2EnLCAnZScsICdpJywgJ28nLCAndSddXG4gICAgICAgIGxldCBiZWdpbnNXaXRoVm93ZWwgPSBmYWxzZVxuICAgICAgICB2b3dlbHMuZm9yRWFjaCh2b3dlbCA9PiB7XG4gICAgICAgICAgICBpZiAoZmlyc3RMZXR0ZXIgPT09IHZvd2VsKSB7XG4gICAgICAgICAgICAgICAgYmVnaW5zV2l0aFZvd2VsID0gdHJ1ZVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBiZWdpbnNXaXRoVm93ZWxcbiAgICB9XG5cbiAgICBkaXNwbGF5SXRlbShpdGVtTmFtZSkge1xuICAgICAgICBjb25zdCBiZWdpbnNXaXRoVm93ZWwgPSB0aGlzLmJlZ2luc1dpdGhWb3dlbChpdGVtTmFtZSlcbiAgICAgICAgbGV0IHRleHQgPSAnJ1xuICAgICAgICBpZiAoYmVnaW5zV2l0aFZvd2VsKSB7XG4gICAgICAgICAgICB0ZXh0ID0gYHlvdSBzZWUgYW4gJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhICR7aXRlbU5hbWV9IGhlcmVgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXQodGV4dCwgMTApXG4gICAgfVxuXG4gICAgZGVmYXVsdCh0ZXh0KSB7XG4gICAgICAgIHRoaXMuc2V0KHRleHQsIDEwKVxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZGVsYXk9MCkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFN0YXR1c1xuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuXG5cbmNsYXNzIFVzZXJJbnB1dCB7XG4gICAgY29uc3RydWN0b3Ioa2V5QWN0aW9uTWFwKSB7XG4gICAgICAgIHRoaXMua2V5QWN0aW9uTWFwID0ga2V5QWN0aW9uTWFwXG5cbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy50cnlBY3Rpb25Gb3JFdmVudC5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgdHJ5QWN0aW9uRm9yRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFVdGlsaXR5LmNvbnRhaW5zKHRoaXMua2V5QWN0aW9uTWFwLCBldmVudC5rZXlDb2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYG5vdCBhIHZhbGlkIGtleWNvZGU6ICR7ZXZlbnQua2V5Q29kZX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXBbZXZlbnQua2V5Q29kZV0oKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJJbnB1dFxuIiwibGV0IGlkID0gMFxuXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKCkge1xuICAgIGlkID0gaWQgKyAxXG4gICAgcmV0dXJuIGlkXG59XG5cbmNsYXNzIFV0aWxpdHkge1xuICAgIHN0YXRpYyBjb250YWlucyhvYmosIHByb3BlcnR5KSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmluZGV4T2YoU3RyaW5nKHByb3BlcnR5KSkgIT09IC0xXG4gICAgfVxuXG4gICAgc3RhdGljIHN0cmluZ1RvTnVtYmVyKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nLm1hdGNoKC9cXGQrLylbMF1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9taXplKG11bHQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG11bHQpXG4gICAgfVxuXG4gICAgc3RhdGljIElkKCkge1xuICAgICAgICByZXR1cm4gZ2VuZXJhdGVJZCgpXG4gICAgfVxuXG4gICAgc3RhdGljIHByb2JhYmlsaXR5KHBlcmNlbnRhZ2UpIHtcbiAgICAgICAgY29uc3QgcHJvYmFiaWxpdHlBcnJheSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2godHJ1ZSlcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMCAtIHBlcmNlbnRhZ2U7IGkrKykge1xuICAgICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKGZhbHNlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9iYWJpbGl0eUFycmF5W1V0aWxpdHkucmFuZG9taXplKDEwMCldXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFV0aWxpdHlcbiIsImNsYXNzIEV2ZW50TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzTGlzdCA9IFtdICAgICAgICAvLyBjcmVhdGUgYXJyYXkgb2YgZXZlbnRzXG4gICAgfVxuXG4gICAgc3Vic2NyaWJlKGV2ZW50LCBmbiwgdGhpc1ZhbHVlLCBvbmNlPWZhbHNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpc1ZhbHVlID09PSAndW5kZWZpbmVkJykgeyAgIC8vIGlmIG5vIHRoaXNWYWx1ZSBwcm92aWRlZCwgYmluZHMgdGhlIGZuIHRvIHRoZSBmbj8/XG4gICAgICAgICAgICB0aGlzVmFsdWUgPSBmblxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRzTGlzdC5wdXNoKHsgICAgICAvLyBjcmVhdGUgb2JqZWN0cyBsaW5raW5nIGV2ZW50cyArIGZ1bmN0aW9ucyB0byBwZXJmb3JtXG4gICAgICAgICAgICBldmVudDogZXZlbnQsICAgICAgICAgICAvLyBwdXNoIGVtIHRvIHRoZSBhcnJheVxuICAgICAgICAgICAgZm46IGZuLFxuICAgICAgICAgICAgb25jZTogb25jZSxcbiAgICAgICAgICAgIHRoaXNWYWx1ZTogdGhpc1ZhbHVlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gdW5zdWJzY3JpYmUoZXZlbnQpIHtcbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAvLyAgICAgICAgIGlmICh0aGlzLmV2ZW50c0xpc3RbaV0uZXZlbnQgPT09IGV2ZW50KSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5ldmVudHNMaXN0LnNwbGljZShpLCAxKVxuICAgIC8vICAgICAgICAgICAgIGJyZWFrXG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICBwdWJsaXNoKGV2ZW50LCBhcmcpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c0xpc3RbaV0uZXZlbnQgPT09IGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0aGlzVmFsdWUsIGZuLCBvbmNlIH0gPSB0aGlzLmV2ZW50c0xpc3RbaV1cbiAgICAgICAgICAgICAgICBmbi5jYWxsKHRoaXNWYWx1ZSwgYXJnKVxuICAgICAgICAgICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRFdmVudHNMaXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHNMaXN0XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBFdmVudE1hbmFnZXIoKVxuIiwiaW1wb3J0IE1hcCBmcm9tICcuL01hcCdcbmltcG9ydCBTY2VuZXJ5IGZyb20gJy4vU2NlbmVyeSdcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSAnLi9DaGFyYWN0ZXInXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuL1N0YXR1cydcbmltcG9ydCBVc2VySW5wdXQgZnJvbSAnLi9Vc2VySW5wdXQnXG5pbXBvcnQgQmx1ZXByaW50cyBmcm9tICcuL0JsdWVwcmludHMnXG5pbXBvcnQgaW52ZW50b3J5IGZyb20gJy4vaW52ZW50b3J5J1xuaW1wb3J0IHsgZ2VuZXJhdGVJdGVtcyB9IGZyb20gJy4vaXRlbXMnXG5cblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdEdhbWUoKSB7XG4gICAgICAgIC8vIHRoaXMuc3BhY2VzID0gW11cbiAgICAgICAgLy8gdGhpcy5nYW1lT3ZlciA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5zdGF0dXMgPSBuZXcgU3RhdHVzKClcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcCg2MCwgNjApXG4gICAgICAgIGNvbnN0IGl0ZW1zID0gZ2VuZXJhdGVJdGVtcyg1KVxuXG4gICAgICAgIHRoaXMuc2NlbmVyeSA9IG5ldyBTY2VuZXJ5KG1hcClcblxuICAgICAgICBtYXAuc2V0SXRlbXMoaXRlbXMpXG5cbiAgICAgICAgY29uc3QgY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihtYXApXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG5cbiAgICAgICAgbWFwLnNldENoYXJhY3RlcihjaGFyYWN0ZXIpXG4gICAgICAgIC8vIGNoYXJhY3Rlci5zdWJzY3JpYmVJdGVtc1RvTWFwKCkgIC8vIG5vdCBjdXJyZW50bHkgbmVjZXNzYXJ5XG5cbiAgICAgICAgdGhpcy5ibHVlcHJpbnQgPSBCbHVlcHJpbnRzLnJhbmRvbSgpXG5cbiAgICAgICAgdGhpcy5pbnZlbnRvcnkgPSBpbnZlbnRvcnlcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkuYWRkKHRoaXMuYmx1ZXByaW50KVxuXG4gICAgICAgIHRoaXMuaW5wdXQgPSB0aGlzLmluaXRVc2VySW5wdXQoY2hhcmFjdGVyKVxuICAgIH1cblxuICAgIGluaXRVc2VySW5wdXQoY2hhcmFjdGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgVXNlcklucHV0KHtcbiAgICAgICAgICAgICczOCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnbm9ydGgnKSxcbiAgICAgICAgICAgICczNyc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnd2VzdCcpLFxuICAgICAgICAgICAgJzM5JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdlYXN0JyksXG4gICAgICAgICAgICAnNDAnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3NvdXRoJyksXG4gICAgICAgICAgICAnODQnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCd0YWtlJyksIC8vICh0KWFrZSBpdGVtXG4gICAgICAgICAgICAnNzMnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdjaGVja0ludmVudG9yeScpLCAvLyBjaGVjayAoaSludmVudG9yeVxuICAgICAgICAgICAgJzc3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbWluZScpIC8vIGRlcGxveSBwYXJ0aWNsZSAobSlpbmVyXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoJ3lvdSB3YWtlIHVwJylcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KGB5b3UgYXJlIGNhcnJ5aW5nICR7dGhpcy5ibHVlcHJpbnQubmFtZX1gLCA0MDAwKVxuICAgIH1cblxuICAgIC8vIGdhbWVJc092ZXIoKSB7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmdhbWVPdmVyXG4gICAgLy8gfVxuXG4gICAgLy8gZXhwbG9yZSgpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coYGV4cGxvcmluZyB0aGUgJHt0aGlzLmtpbmR9IHpvbmUhYClcbiAgICAvLyB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEdhbWUoKTtcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIEludmVudG9yeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMgPSBbXVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdhZGQtaW52ZW50b3J5JywgdGhpcy5hZGQsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdyZW1vdmUtaW52ZW50b3J5JywgdGhpcy5yZW1vdmUsIHRoaXMpXG4gICAgfVxuXG4gICAgYWRkKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5jb250ZW50cy5wdXNoKGl0ZW0pXG4gICAgfVxuXG5cblxuLy8gdW50ZXN0ZWRcblxuICAgIHJlbW92ZShpdGVtKSB7XG4gICAgICAgIGNvbnN0IHRoZUl0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMuY29udGVudHMuZm9yRWFjaCgoaXRlbSwgaSwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gdGhlSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudHMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtIG5vdCBpbiBpbnZlbnRvcnknKVxuICAgICAgICAgICAgfX0pXG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEludmVudG9yeVxuIiwiaW1wb3J0IE1vdmVhYmxlIGZyb20gJ2pzL01vdmVhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnanMvZXZlbnRNYW5hZ2VyJ1xuXG5cbi8vIGNvbnN0IElURU1TID0ge1xuLy8gICAgIG1pbmVyOiB7XG4vLyAgICAgICAgIG5hbWU6ICdwYXJ0aWNsZSBtaW5lcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJ3wnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ21pbmVzLCBkaXZpZGVzLCBhbmQgc3RvcmVzIGFtYmllbnQgY2hlbWljYWwgZWxlbWVudHMgYW5kIGxhcmdlciBjb21wb3VuZHMgZm91bmQgd2l0aGluIGEgMTAwIG1ldGVyIHJhZGl1cy4gOTclIGFjY3VyYWN5IHJhdGUuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1taW5lcidcbi8vICAgICB9LFxuLy8gICAgIHBhcnNlcjoge1xuLy8gICAgICAgICBuYW1lOiAnbm9pc2UgcGFyc2VyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnPycsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAncHJvdG90eXBlLiBwYXJzZXMgYXRtb3NwaGVyaWMgZGF0YSBmb3IgbGF0ZW50IGluZm9ybWF0aW9uLiBzaWduYWwtdG8tbm9pc2UgcmF0aW8gbm90IGd1YXJhbnRlZWQuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1wYXJzZXInXG4vLyAgICAgfSxcbi8vICAgICBpbnRlcmZhY2U6IHtcbi8vICAgICAgICAgbmFtZTogJ3BzaW9uaWMgaW50ZXJmYWNlJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnJicsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiBgY29ubmVjdHMgc2VhbWxlc3NseSB0byBhIHN0YW5kYXJkLWlzc3VlIGJpb3BvcnQuIGZhY2lsaXRhdGVzIHN1bmRyeSBpbnRlcmFjdGlvbnMgcGVyZm9ybWVkIHZpYSBQU0ktTkVULmAsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0taW50ZXJmYWNlJ1xuLy8gICAgIH0sXG4vLyAgICAgcHJpbnRlcjoge1xuLy8gICAgICAgICBuYW1lOiAnbW9sZWN1bGFyIHByaW50ZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICcjJyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdnZW5lcmF0ZXMgb2JqZWN0cyBhY2NvcmRpbmcgdG8gYSBibHVlcHJpbnQuIG1vbGVjdWxlcyBub3QgaW5jbHVkZWQuJyxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1wcmludGVyJ1xuLy8gICAgIH1cbi8vIH1cblxuY2xhc3MgSXRlbSBleHRlbmRzIE1vdmVhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcihpdGVtQ29uZmlnKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICAvLyBtZXJnZSBpbiBjb25maWcgcHJvcGVydGllc1xuICAgICAgICAvLyBjb25zdCB0YXJnZXQgPSBPYmplY3QuYXNzaWduKHRoaXMsIGl0ZW1Db25maWcpXG5cbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9wZXJ0aWVzXG4gICAgICAgIHRoaXMuaWRlbnRpdHlOdW1iZXIgPSBVdGlsaXR5LklkKClcbiAgICAgICAgdGhpcy50eXBlID0gJ2l0ZW0nXG4gICAgICAgIHRoaXMub2ZmTWFwID0gZmFsc2VcbiAgICAgICAgLy8gdGhpcy5pbkludmVudG9yeSA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE9uTWFwKG1hcCwgbG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXRNYXAobWFwKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyhsb2NhdGlvbilcbiAgICAgICAgdGhpcy5zZXRDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMuc2V0R3JpZEluZGljZXMoKVxuICAgICAgICB0aGlzLnNldERpdih0aGlzLmdldElkKCkpXG4gICAgICAgIHRoaXMudXBkYXRlRGl2KHRoaXMpXG5cbi8vIG1vdmVkIHRoaXMgb3V0IHNvIHdlIGFyZSBub3QgY3JlYXRpbmcgY2hpbGRyZW4gZWFjaCB0aW1lIHdlIHdhbnQgdG8gcGxhY2Ugb24gbWFwXG4gICAgICAgIC8vIHRoaXMuY3JlYXRlSW5pdGlhbENoaWxkRWxlbWVudCgnaXRlbS1sYXllcicpXG4gICAgfVxuXG4gICAgZ2V0SWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aXR5TnVtYmVyXG4gICAgfVxuXG4gICAgc2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgY3NzTGVmdCwgY3NzVG9wIH0gPSB0aGlzLmdldENTU0Nvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5sZWZ0ID0gY3NzTGVmdFxuICAgICAgICB0aGlzLnRvcCA9IGNzc1RvcFxuICAgIH1cblxuICAgIHNldEdyaWRJbmRpY2VzKCkge1xuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuZ2V0R3JpZEluZGljZXMoKVxuXG4gICAgICAgIHRoaXMueCA9IHhcbiAgICAgICAgdGhpcy55ID0geVxuICAgIH1cblxuICAgIHNldERpdihpZGVudGl0eU51bWJlcikge1xuICAgICAgICBpZiAoIXRoaXMuZGl2U2V0KSB7XG4gICAgICAgICAgICB0aGlzLmRpdiA9IHRoaXMuZGl2ICsgaWRlbnRpdHlOdW1iZXJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpdlNldCA9IHRydWVcbiAgICB9XG5cblxuICAgIC8vIHNwZWNpZmljIHRvIGl0ZW0gZHJhd2luZzogdXNlIG91dGVySFRNTFxuICAgIGRyYXdMYXllcihsYXllcklkKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGF5ZXJJZClcbiAgICAgICAgZWwub3V0ZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG5cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2l0ZW0nKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURpdih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25UYWtlKCkge1xuICAgICAgICB0aGlzLnggPSBudWxsXG4gICAgICAgIHRoaXMueSA9IG51bGxcbiAgICAgICAgdGhpcy5vZmZNYXAgPSB0cnVlIC8vIGNoYW5nZXMgY3NzIGRpc3BsYXkgdG8gJ25vbmUnXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3BhcnRpY2xlIG1pbmVyJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbHRNaW5pbmcoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1pbnZlbnRvcnknLCB0aGlzKVxuICAgICAgICAvLyB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMub25Ecm9wLCB0aGlzKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuICAgIH1cblxuICAgIG9uRHJvcCgpIHtcblxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHt0aGlzLm5hbWV9LSR7dGhpcy5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLm9uVGFrZSwgdGhpcywgdHJ1ZSlcbiAgICAvLyAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLCB0aGlzLmRpdilcblxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJdGVtXG4iLCJpbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuXG5jbGFzcyBQYXJ0aWNsZU1pbmVyIGV4dGVuZHMgSXRlbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICB0aGlzLm5hbWUgPSAncGFydGljbGUgbWluZXInXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAnfCdcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9ICdtaW5lcywgZGl2aWRlcywgYW5kIHN0b3JlcyBhbWJpZW50IGNoZW1pY2FsIGVsZW1lbnRzIGFuZCBsYXJnZXIgY29tcG91bmRzIGZvdW5kIHdpdGhpbiBhIDEwMCBtZXRlciByYWRpdXMuIDk3JSBhY2N1cmFjeSByYXRlLidcbiAgICAgICAgdGhpcy5kaXYgPSAnaXRlbS1taW5lcidcbiAgICAgICAgLy8gbXVzdCBzdWJzY3JpYmUgdGhlIGl0ZW0gZGlyZWN0bHksIG5vdCBvbiB0aGUgYWJzdHJhY3QgY2xhc3NcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMpXG5cbiAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlcyA9IHt9XG4gICAgfVxuXG4gICAgbWluZShsb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldE1pbmluZ0NvbmZpZygpXG5cbiAgICAgICAgdGhpcy5jYW5jZWxsYXRpb25LZXkgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leHRyYWN0UGFydGljbGVzKHRoaXMuZGV0ZXJtaW5lUGFydGljbGVBbW91bnRzKGxvY2F0aW9uKSlcbiAgICAgICAgfSwgMzAwMClcblxuICAgICAgICB0aGlzLnNldE9uTWFwKHRoaXMubWFwLCBsb2NhdGlvbilcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIodGhpcy5kaXYpXG4gICAgfVxuXG4gICAgc2V0TWluaW5nQ29uZmlnKCkge1xuICAgICAgICB0aGlzLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgIHRoaXMubWluaW5nID0gdHJ1ZVxuICAgICAgICAvLyB0aGlzLnNwaW5uaW5nID0gdHJ1ZVxuICAgIH1cblxuICAgIGRldGVybWluZVBhcnRpY2xlQW1vdW50cyhsb2NhdGlvbikge1xuICAgICAgICBjb25zdCBsb2NhbFBhcnRpY2xlcyA9IHRoaXMubWFwW2xvY2F0aW9uWzFdXVtsb2NhdGlvblswXV0ucGFydGljbGVzXG4gICAgICAgIGNvbnN0IGFsbFBhcnRpY2xlcyA9IFtdXG4gICAgICAgIE9iamVjdC5rZXlzKGxvY2FsUGFydGljbGVzKS5mb3JFYWNoKHBhcnRpY2xlID0+IHtcbiAgICAgICAgICAgIGxldCBudW1iZXJPZlBhcnRpY2xlcyA9IGxvY2FsUGFydGljbGVzW3BhcnRpY2xlXVxuICAgICAgICAgICAgd2hpbGUgKG51bWJlck9mUGFydGljbGVzKSB7XG4gICAgICAgICAgICAgICAgYWxsUGFydGljbGVzLnB1c2gocGFydGljbGUpXG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZQYXJ0aWNsZXMtLVxuICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGFsbFBhcnRpY2xlc1xuICAgIH1cblxuXG4gICAgZXh0cmFjdFBhcnRpY2xlcyhhbGxQYXJ0aWNsZXMpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tUGFydGljbGUgPSBhbGxQYXJ0aWNsZXNbVXRpbGl0eS5yYW5kb21pemUoYWxsUGFydGljbGVzLmxlbmd0aCldXG4gICAgICAgIGlmICghdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0pIHtcbiAgICAgICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXNbcmFuZG9tUGFydGljbGVdID0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0rK1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5UGFydGljbGVzTWluZWQoKVxuXG4gICAgfVxuXG5cbiAgICBkaXNwbGF5UGFydGljbGVzTWluZWQoKSB7XG5cbiAgICAgICAgY29uc3Qgc3RyID0gdGhpcy5jbGVhbkpTT05TdHJpbmcoSlNPTi5zdHJpbmdpZnkodGhpcy5taW5lZFBhcnRpY2xlcykpXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgc3RyKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdwYXJ0aWNsZXMgbWluZWQnLCB0aGlzLm1pbmVkUGFydGljbGVzKVxuICAgIH1cblxuICAgIGNsZWFuSlNPTlN0cmluZyhzdHJpbmcpIHtcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1wiL2csICcnKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvOi9nLCAnICcpXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC97L2csICcnKVxuICAgICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvfS9nLCAnJylcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoLywvZywgJyB8ICcpXG4gICAgICAgIHJldHVybiBzdHJpbmdcbiAgICB9XG5cblxuXG4gICAgaGFsdE1pbmluZygpIHtcbiAgICAgICAgdGhpcy5taW5pbmcgPSBmYWxzZVxuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmNhbmNlbGxhdGlvbktleSlcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFydGljbGVNaW5lclxuIiwiaW1wb3J0IFBhcnRpY2xlTWluZXIgZnJvbSAnLi9QYXJ0aWNsZU1pbmVyJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcblxuY29uc3QgSVRFTVMgPSBbXG4gICAgUGFydGljbGVNaW5lclxuXVxuXG5mdW5jdGlvbiByYW5kb21JdGVtKCkge1xuICAgIHJldHVybiBuZXcgSVRFTVNbVXRpbGl0eS5yYW5kb21pemUoSVRFTVMubGVuZ3RoKV1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVJdGVtcyhudW1iZXIgPSAxKSB7XG4gICAgY29uc3QgaXRlbXMgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyOyBpKyspIHtcbiAgICAgICAgaXRlbXMucHVzaChyYW5kb21JdGVtKCkpXG4gICAgfVxuICAgIHJldHVybiBpdGVtc1xufVxuXG5cbmV4cG9ydCB7XG4gICAgZ2VuZXJhdGVJdGVtc1xufVxuIl19
