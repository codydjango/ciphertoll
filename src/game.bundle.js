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
    function Character(map) {
        _classCallCheck(this, Character);

        var _this = _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).call(this, map));

        _this.map = map;
        _this.EM = _eventManager2.default;
        _this.inventory = _inventory2.default.contents;
        _this.initialGridIndices = map.getMapCenter();
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
            this.map.itemsOnMap.forEach(function (item) {
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
                miner.offMap = false;
                miner.mining = true;
                miner.spinning = true;
                miner.setOnMap(this.map.map, location);
                miner.drawLayer(miner.div);
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
            this.gotMap = map;
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
                location = this.gotMap[newGridIndices[1]][newGridIndices[0]];
                this.gridIndices = newGridIndices;
                actor.x = newGridIndices[0];
                actor.y = newGridIndices[1];
            } else {
                location = this.gotMap[(this.gridIndices[1], this.gridIndices[0])];
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

            if (this.gotMap[x]) {
                var location = this.gotMap[x][y];
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
        var _this = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).call(this));

        var target = Object.assign(_this, itemConfig);

        // additional properties
        _this.identityNumber = _Utility2.default.Id();
        _this.type = 'item';
        _this.offMap = false;
        // this.inInventory = false

        _this.EM = _eventManager2.default;
        _this.EM.subscribe(_this.name + '-' + _this.identityNumber + ' taken', _this.onTake, _this);
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
            console.log('layerId', layerId);
            var el = document.getElementById(layerId);
            console.log('el in drawLayer', el);
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
            this.mining = false;

            this.EM.publish('add-inventory', this);
            // this.EM.subscribe('remove-inventory', this.onDrop, this)
            this.renderLayer(this, this.div);
        }
    }, {
        key: 'onDrop',
        value: function onDrop() {
            //     this.x = args.x
            //     this.y = args.y


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

var _Item2 = require('./Item');

var _Item3 = _interopRequireDefault(_Item2);

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
        return _this;
    }

    return ParticleMiner;
}(_Item3.default);

exports.default = ParticleMiner;

},{"./Item":17}],19:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0xhbmRzY2FwZURhdGEuanMiLCJzcmMvanMvTWFwLmpzIiwic3JjL2pzL01hcEdlbmVyYXRvci5qcyIsInNyYy9qcy9Nb3ZlYWJsZS5qcyIsInNyYy9qcy9SZW5kZXJhYmxlLmpzIiwic3JjL2pzL1NjZW5lcnkuanMiLCJzcmMvanMvU3RhdHVzLmpzIiwic3JjL2pzL1VzZXJJbnB1dC5qcyIsInNyYy9qcy9VdGlsaXR5LmpzIiwic3JjL2pzL2V2ZW50TWFuYWdlci5qcyIsInNyYy9qcy9nYW1lLmpzIiwic3JjL2pzL2ludmVudG9yeS5qcyIsInNyYy9qcy9pdGVtcy9JdGVtLmpzIiwic3JjL2pzL2l0ZW1zL1BhcnRpY2xlTWluZXIuanMiLCJzcmMvanMvaXRlbXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxPQUFPLElBQVA7Ozs7Ozs7Ozs7O0FDRkE7Ozs7Ozs7O0FBR0EsSUFBTSxnQkFBZ0I7QUFDbEIsc0JBQWtCO0FBQ2QsY0FBTSwrQkFEUTtBQUVkLHFCQUFhLEVBRkM7QUFHZCxtQkFBVyxFQUhHO0FBSWQsc0JBQWM7QUFKQSxLQURBO0FBT2xCLG9CQUFnQjtBQUNaLGNBQU0sNkJBRE07QUFFWixxQkFBYSxFQUZEO0FBR1osbUJBQVcsRUFIQztBQUlaLHNCQUFjO0FBSkYsS0FQRTtBQWFsQixtQkFBZTtBQUNYLGNBQU0sNEJBREs7QUFFWCxxQkFBYSxFQUZGO0FBR1gsbUJBQVcsRUFIQTtBQUlYLHNCQUFjO0FBSkg7QUFiRyxDQUF0Qjs7SUFzQk0sUztBQUNGLHVCQUFZLElBQVosRUFBa0IsV0FBbEIsRUFBK0I7QUFBQTs7QUFDM0IsYUFBSyxJQUFMLEdBQVksSUFB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LFNBQWtDLEtBQUssY0FBdkMsYUFBK0QsS0FBSyxNQUFwRSxFQUE0RSxJQUE1RSxFQUFrRixJQUFsRjtBQUNKO0FBRUM7Ozs7OztrQkFJVSxJOzs7Ozs7Ozs7QUNuSWY7Ozs7Ozs7Ozs7OztJQUVNLGE7OztBQUNGLDZCQUFjO0FBQUE7O0FBQUE7O0FBR1YsY0FBSyxJQUFMLEdBQVksZ0JBQVo7QUFDQSxjQUFLLElBQUwsR0FBWSxNQUFaO0FBQ0EsY0FBSyxPQUFMLEdBQWUsR0FBZjtBQUNBLGNBQUssV0FBTCxHQUFtQiwrSEFBbkI7QUFDQSxjQUFLLEdBQUwsR0FBVyxZQUFYO0FBUFU7QUFRYjs7Ozs7a0JBSVUsYTs7Ozs7Ozs7OztBQ2ZmOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxRQUFRLHlCQUFkOztBQUlBLFNBQVMsVUFBVCxHQUFzQjtBQUNsQixXQUFPLElBQUksTUFBTSxrQkFBUSxTQUFSLENBQWtCLE1BQU0sTUFBeEIsQ0FBTixDQUFKLEVBQVA7QUFDSDs7QUFHRCxTQUFTLGFBQVQsR0FBbUM7QUFBQSxRQUFaLE1BQVksdUVBQUgsQ0FBRzs7QUFDL0IsUUFBTSxRQUFRLEVBQWQ7O0FBRUEsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQXBCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQzdCLGNBQU0sSUFBTixDQUFXLFlBQVg7QUFDSDs7QUFFRCxXQUFPLEtBQVA7QUFDSDs7UUFHRyxhLEdBQUEsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi9qcy9nYW1lJ1xuXG53aW5kb3cuZ2FtZSA9IGdhbWVcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jb25zdCBibHVlcHJpbnREYXRhID0ge1xuICAgIGFydGlmaWNpYWxNdXNjbGU6IHtcbiAgICAgICAgbmFtZTogJ2FydGlmaWNpYWwgbXVzY2xlIChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICByZXRpbmFsRGlzcGxheToge1xuICAgICAgICBuYW1lOiAncmV0aW5hbCBkaXNwbGF5IChibHVlcHJpbnQpJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBhYmlsaXRpZXM6ICcnLFxuICAgICAgICByZXF1aXJlbWVudHM6ICcnXG4gICAgfSxcbiAgICBwcm9zdGhldGljQXJtOiB7XG4gICAgICAgIG5hbWU6ICdwcm9zdGhldGljIGFybSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH1cbn1cblxuXG5jbGFzcyBCbHVlcHJpbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbSgpIHtcbiAgICAgICAgY29uc3QgYmx1ZXByaW50VmFsdWVzID0gT2JqZWN0LnZhbHVlcyhibHVlcHJpbnREYXRhKVxuICAgICAgICBjb25zdCBpbmRleCA9IFV0aWxpdHkucmFuZG9taXplKGJsdWVwcmludFZhbHVlcy5sZW5ndGgpXG5cbiAgICAgICAgY29uc3QgcmFuZG9tQmx1ZXByaW50ID0gYmx1ZXByaW50VmFsdWVzW2luZGV4XVxuXG4gICAgICAgIHJldHVybiBuZXcgQmx1ZXByaW50KHJhbmRvbUJsdWVwcmludC5uYW1lLCByYW5kb21CbHVlcHJpbnQuZGVzY3JpcHRpb24pXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEJsdWVwcmludFxuXG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnLi9Nb3ZlYWJsZSdcbmltcG9ydCB7IERJUkVDVElPTlMgfSBmcm9tICcuL0NvbnN0YW50cydcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5pbXBvcnQgaW52ZW50b3J5IGZyb20gJy4vaW52ZW50b3J5J1xuXG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIE1vdmVhYmxlIHsgIC8vIENoYXJhY3RlciBkYXRhIGFuZCBhY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKG1hcClcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeS5jb250ZW50c1xuICAgICAgICB0aGlzLmluaXRpYWxHcmlkSW5kaWNlcyA9IG1hcC5nZXRNYXBDZW50ZXIoKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyh0aGlzLmluaXRpYWxHcmlkSW5kaWNlcylcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJhY3RlciByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyTGF5ZXIodW5pdCwgbGF5ZXJJZCkge1xuICAgICAgICBpZiAodW5pdC50eXBlID09PSAnYWN0b3InKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNwYW4odW5pdClcbiAgICAgICAgICAgIHRoaXMuZHJhd0xheWVyKGxheWVySWQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdWJzY3JpYmVJdGVtc1RvTWFwKCkge1xuICAgICAgICAvLyBOT1QgUkVRVUlSRUQgQVQgVEhFIE1PTUVOVFxuXG4gICAgICAgIC8vIHRoaXMubWFwLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgLy8gICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke2l0ZW0ubmFtZX0tJHtpdGVtLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMudGFrZUl0ZW0sIHRoaXMsIHRydWUpXG4gICAgICAgIC8vIH0pXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgdHlwZTogJ2FjdG9yJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdAJyxcbiAgICAgICAgICAgIGNsczogJ2NoYXJhY3RlcicsXG4gICAgICAgICAgICBsZWZ0OiBjc3NMZWZ0LFxuICAgICAgICAgICAgdG9wOiBjc3NUb3AsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBnZXRBY3Rpb24oZm5OYW1lLCBhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbZm5OYW1lXS5iaW5kKHRoaXMsIGFyZylcbiAgICB9XG5cbiAgICBtb3ZlKGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy51cGRhdGVHcmlkSW5kaWNlcyh0aGlzLmdldENoYXJhY3RlcigpLCBESVJFQ1RJT05TW2RpcmVjdGlvbl0pXG4gICAgICAgIHRoaXMucHJpbnRMb2NhbFN0YXR1cygpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG4gICAgfVxuXG4gICAgcHJpbnRMb2NhbFN0YXR1cygpIHtcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdjaGFyYWN0ZXItbW92ZWQnLCB0aGlzLmxvY2F0aW9uKVxuICAgICAgICBjb25zdCBsb2NhbEl0ZW0gPSB0aGlzLmxvY2FsSXRlbSgpXG4gICAgICAgIGlmIChsb2NhbEl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChsb2NhbEl0ZW0ubWluaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAnYSBtaW5lciBwdWxscyBjb21wb3VuZHMgZnJvbSB0aGUgcmVnaW9uJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LWl0ZW0nLCBsb2NhbEl0ZW0ubmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsSXRlbSgpIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgbGV0IGxvY2FsSXRlbSA9IG51bGxcbiAgICAgICAgdGhpcy5tYXAuaXRlbXNPbk1hcC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY2hhci54ICYmIGl0ZW0ueSA9PT0gY2hhci55KSB7XG4gICAgICAgICAgICAgICAgbG9jYWxJdGVtID0gaXRlbVxuICAgICAgICAgICAgfX0pXG4gICAgICAgIHJldHVybiBsb2NhbEl0ZW1cbiAgICB9XG5cblxuICAgIHRha2UoKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsSXRlbSA9IHRoaXMubG9jYWxJdGVtKClcbiAgICAgICAgaWYgKGxvY2FsSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKGAke2xvY2FsSXRlbS5uYW1lfS0ke2xvY2FsSXRlbS5pZGVudGl0eU51bWJlcn0gdGFrZW5gKVxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBgJHtsb2NhbEl0ZW0ubmFtZX0gdGFrZW5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAndGhlcmUgaXMgbm90aGluZyBoZXJlIHdvcnRoIHRha2luZycpXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGNoZWNrSW52ZW50b3J5KCkge1xuICAgICAgICBjb25zdCBjYXJyeWluZyA9IHRoaXMuaW52ZW50b3J5Lm1hcChpdGVtID0+IGl0ZW0ubmFtZSkuam9pbignIHwgJylcbiAgICAgICAgY29uc3QgdGV4dCA9IGB5b3UgYXJlIGNhcnJ5aW5nOiAke2NhcnJ5aW5nfWBcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCB0ZXh0KVxuICAgIH1cblxuXG4gICAgZmluZEludmVudG9yeUl0ZW0oaXRlbU5hbWUpIHtcbiAgICAgICAgbGV0IGZvdW5kSXRlbSA9IG51bGxcbiAgICAgICAgdGhpcy5pbnZlbnRvcnkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUgPT09IGl0ZW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgZm91bmRJdGVtID0gaXRlbVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZm91bmRJdGVtXG4gICAgfVxuXG4gICAgbWluZSgpIHtcblxuICAgICAgICBjb25zdCBjaGFyID0gdGhpcy5nZXRDaGFyYWN0ZXIoKVxuICAgICAgICBjb25zdCBtaW5lciA9IHRoaXMuZmluZEludmVudG9yeUl0ZW0oJ3BhcnRpY2xlIG1pbmVyJylcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBbY2hhci54LCBjaGFyLnldXG5cblxuICAgICAgICBpZiAobWluZXIpIHtcbiAgICAgICAgICAgIG1pbmVyLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgICAgICBtaW5lci5taW5pbmcgPSB0cnVlXG4gICAgICAgICAgICBtaW5lci5zcGlubmluZyA9IHRydWVcbiAgICAgICAgICAgIG1pbmVyLnNldE9uTWFwKHRoaXMubWFwLm1hcCwgbG9jYXRpb24pXG4gICAgICAgICAgICBtaW5lci5kcmF3TGF5ZXIobWluZXIuZGl2KVxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdyZW1vdmUtaW52ZW50b3J5JywgbWluZXIpXG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCAneW91IGRvIG5vdCBoYXZlIGFueSBwYXJ0aWNsZSBtaW5lcnMnKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyXG4iLCJjb25zdCBESVJFQ1RJT05TID0ge1xuICAgIG5vcnRoOiB7IHg6IDAsIHk6IC0xIH0sXG4gICAgc291dGg6IHsgeDogMCwgeTogMSB9LFxuICAgIGVhc3Q6IHsgeDogMSwgeTogMCB9LFxuICAgIHdlc3Q6IHsgeDogLTEsIHk6IDAgfSxcbiAgICBub3J0aHdlc3Q6IHsgeDogLTEsIHk6IC0xIH0sXG4gICAgbm9ydGhlYXN0OiB7IHg6IDEsIHk6IC0xIH0sXG4gICAgc291dGhlYXN0OiB7IHg6IDEsIHk6IDEgfSxcbiAgICBzb3V0aHdlc3Q6IHsgeDogLTEsIHk6IDEgfVxufVxuXG5cbmV4cG9ydCB7IERJUkVDVElPTlMgfVxuIiwiY2xhc3MgTGFuZHNjYXBlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB0aGlzLmZlYXR1cmVzKClcbiAgICAgICAgdGhpcy5iYXJlID0gdGhpcy5iYXJlKClcbiAgICB9XG5cbiAgICBmZWF0dXJlcygpIHtcbiAgICAgICAgY29uc3QgcGVyaW9kID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0aGUgYWlyIGlzIGNob2tlZCB3aXRoIGR1c3QsIHN0YXRpYywgd2lmaScsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjUsXG4gICAgICAgICAgICBjbHM6ICdwZXJpb2QnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tbWEgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnLCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3NwcmF3bCBvZiBzbWFydCBob21lcywgY3VsLWRlLXNhY3MsIGxhbmV3YXlzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyNixcbiAgICAgICAgICAgIGNsczogJ2NvbW1hJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JhdmUgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnXicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2Egc2hpbW1lcmluZyBmaWVsZCBvZiBzb2xhciBwYW5lbHMsIGJyb2tlbiBhbmQgY29ycm9kZWQnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDIyLFxuICAgICAgICAgICAgY2xzOiAnZ3JhdmUnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXN0ZXJpc2sgPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnKicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2hvbGxvdyB1c2VycyBqYWNrIGluIGF0IHRoZSBkYXRhaHVicycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjAsXG4gICAgICAgICAgICBjbHM6ICdhc3RlcmlzaydcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3BlcmlvZCwgY29tbWEsIHNlbWljb2xvbiwgc2VtaWNvbG9uLCBhc3RlcmlzaywgYXN0ZXJpc2ssIGdyYXZlLCBncmF2ZV1cbiAgICB9XG5cbiAgICBiYXJlKCkge1xuICAgICAgICBjb25zdCBiYXJlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJyZuYnNwOycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2NvbmNyZXRlIGFuZCB0d2lzdGVkIHJlYmFyIHN0cmV0Y2ggdG8gdGhlIGhvcml6b24nLFxuICAgICAgICAgICAgY2xzOiAnYmxhbmsnXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhcmVcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExhbmRzY2FwZURhdGFcbiIsImltcG9ydCBNYXBHZW5lcmF0b3IgZnJvbSAnLi9NYXBHZW5lcmF0b3InXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5cbmNsYXNzIE1hcCB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRNYXAgPSBuZXcgTWFwR2VuZXJhdG9yKGNvbCwgcm93KVxuICAgICAgICB0aGlzLm1hcCA9IHRoaXMuZ2VuZXJhdGVkTWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMuaXRlbXNPbk1hcCA9IFtdXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcFxuICAgIH1cblxuICAgIGdldE1hcENlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHRoaXMuY29sLzIpLCBNYXRoLmZsb29yKHRoaXMucm93LzIpXVxuICAgIH1cblxuICAgIGdldFJhbmRvbU1hcExvY2F0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1V0aWxpdHkucmFuZG9taXplKHRoaXMucm93IC0gMSksIFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSldXG4gICAgfVxuXG4gICAgc2V0Q2hhcmFjdGVyKGNoYXJhY3Rlcikge1xuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IGNoYXJhY3RlclxuICAgICAgICB0aGlzLmNoYXJhY3Rlci5zZXRNYXAodGhpcy5tYXApXG4gICAgfVxuXG4gICAgc2V0SXRlbXMoaXRlbXMpIHtcbiAgICAgICAgaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tTWFwTG9jYXRpb24gPSB0aGlzLmdldFJhbmRvbU1hcExvY2F0aW9uKClcbiAgICAgICAgICAgIGl0ZW0uc2V0T25NYXAodGhpcy5tYXAsIHJhbmRvbU1hcExvY2F0aW9uKVxuICAgICAgICAgICAgaXRlbS5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJykgIC8vIG1vdmVkIGNoaWxkRWxlbWVudCBjcmVhdGlvbiBvdXQgb2YgJ3NldE9uTWFwJ1xuICAgICAgICAgICAgdGhpcy5wdXNoSXRlbShpdGVtKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHB1c2hJdGVtKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwLnB1c2goaXRlbSlcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcFxuIiwiaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IExhbmRzY2FwZURhdGEgZnJvbSAnLi9MYW5kc2NhcGVEYXRhJ1xuaW1wb3J0IHsgRElSRUNUSU9OUyB9IGZyb20gJy4vQ29uc3RhbnRzJ1xuXG5cbmNsYXNzIE1hcEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYXRpbmcgbWFwJylcbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVEYXRhKClcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuaW5pdChjb2wsIHJvdylcbiAgICAgICAgY29uc3Qgc2VlZGVkR3JpZCA9IHRoaXMuc2VlZChncmlkKVxuICAgICAgICB0aGlzLnNlZWRlZEdyaWQgPSBzZWVkZWRHcmlkXG4gICAgICAgIHRoaXMuZ3JvdygpXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgZ2VuZXJhdGVkJylcbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlZWRlZEdyaWRcbiAgICB9XG5cbiAgICBpbml0KGNvbCwgcm93KSB7XG4gICAgICAgIHRoaXMuY29sID0gY29sXG4gICAgICAgIHRoaXMucm93ID0gcm93XG4gICAgICAgIGNvbnN0IGdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdzsgaSsrKSB7XG4gICAgICAgICAgICBncmlkW2ldID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBncmlkW2ldLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgc2VlZChncmlkKSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldE51bWJlck9mRWxlbWVudFNlZWRzKCk7IGkrKykge1xuICAgICAgICAgICAgcmFuZG9tRWxlbWVudHMucHVzaCh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXMubGVuZ3RoKV0pXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VlZHMgPSB0aGlzLmdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cylcbiAgICAgICAgc2VlZHMubWFwKHNlZWQgPT4gZ3JpZFtzZWVkLnldW3NlZWQueF0gPSBzZWVkKVxuICAgICAgICB0aGlzLl9zZWVkcyA9IHNlZWRzXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKSB7XG4gICAgICAgIC8vICByZXR1cm4gMSAgICAgICAgLy8gdGVzdCBzZXR0aW5nXG4gICAgICAgIC8vIHJldHVybiAoKHRoaXMuY29sICogdGhpcy5yb3cpIC8gKHRoaXMuX2NvbCArIHRoaXMucm93KSkgIC8vIHNwYXJzZSBpbml0aWFsIHNlZWRpbmdcbiAgICAgICAgcmV0dXJuICh0aGlzLmNvbCArIHRoaXMucm93KSAgLy8gcmljaCBpbml0aWFsIHNlZWRpbmdcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKVxuICAgICAgICAgICAgZWwueSA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBzZWVkcyA9IHRoaXMuX3NlZWRzXG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlICghbWFwUG9wdWxhdGVkKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGdvb2RTZWVkcyA9IFtdXG4gICAgICAgICAgICB0aGlzLmdvb2RTZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5mb3JFYWNoKChzZWVkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tTZWVkKHNlZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdvb2RTZWVkcy5wdXNoKHRoaXMuY2hlY2tTZWVkKHNlZWQpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBmb3IgKGxldCBnb29kU2VlZCBvZiBnb29kU2VlZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID09PSB0aGlzLmxhbmRzY2FwZVNlZWRzLmJhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkZWRHcmlkW2dvb2RTZWVkLnldW2dvb2RTZWVkLnhdID0gZ29vZFNlZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuY291bnRVbnNlZWRlZExvY2F0aW9ucygpKSB7XG4gICAgICAgICAgICAgICAgbWFwUG9wdWxhdGVkID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWVkcyA9IGdvb2RTZWVkc1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRVbnNlZWRlZExvY2F0aW9ucygpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkR3JpZCA9IFtdLmNvbmNhdC5hcHBseShbXSwgdGhpcy5zZWVkZWRHcmlkKVxuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIGZvciAobGV0IGkgb2YgZmxhdHRlbmVkR3JpZCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBsZXQgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgaWYgKChzZWVkLnggPCB0aGlzLmNvbCAmJiBzZWVkLnggPj0gMCkgJiZcbiAgICAgICAgICAgIChzZWVkLnkgPCB0aGlzLnJvdyAmJiBzZWVkLnkgPj0gMCkpIHtcbiAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFtzZWVkLnldW3NlZWQueF0gIT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKChzZWVkLnggPT09IGdvb2RTZWVkLngpICYmXG4gICAgICAgICAgICAgICAgKHNlZWQueSA9PT0gZ29vZFNlZWQueSkpIHtcbiAgICAgICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzZWVkU3VjY2VlZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykge1xuICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICBzZWVkcy5mb3JFYWNoKChvcmlnaW5hbFNlZWQpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmFiaWxpdHkobmV4dEdlblNlZWQucHJvYmFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkaXJlY3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueCA9IG9yaWdpbmFsU2VlZC54ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnkgPSBvcmlnaW5hbFNlZWQueSArIGRpcmVjdGlvblZhbHVlc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG4gICAgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcEdlbmVyYXRvclxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHNldE1hcChtYXApIHtcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXBcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgfVxuXG4gICAgZ2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmdyaWRJbmRpY2VzWzBdXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmdyaWRJbmRpY2VzWzFdXG5cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCBcInlvdSd2ZSByZWFjaGVkIHRoZSBtYXAncyBlZGdlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uXG4gICAgfVxuXG4gICAgY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykge1xuICAgICAgICBsZXQgbG9jYXRpb25PbkdyaWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IHggPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICBjb25zdCB5ID0gbmV3R3JpZEluZGljZXNbMF1cblxuICAgICAgICBpZiAodGhpcy5nb3RNYXBbeF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbeF1beV1cbiAgICAgICAgICAgIGlmIChsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uT25HcmlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uT25HcmlkXG4gICAgfVxuXG4gICAgZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVuaXQnKVxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICAgICAgICBjb25zdCB3aWR0aCA9IFV0aWxpdHkuc3RyaW5nVG9OdW1iZXIoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSlcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSlcbiAgICAgICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodCB9XG4gICAgfVxuXG4gICAgZ2V0Q1NTQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGNzcyA9IHRoaXMuZ2V0Q1NTSGVpZ2h0QW5kV2lkdGgoKVxuICAgICAgICBjb25zdCBjc3NMZWZ0ID0gdGhpcy5ncmlkSW5kaWNlc1swXSAqIGNzcy5oZWlnaHRcbiAgICAgICAgY29uc3QgY3NzVG9wID0gdGhpcy5ncmlkSW5kaWNlc1sxXSAqIGNzcy53aWR0aFxuICAgICAgICByZXR1cm4geyBjc3NMZWZ0LCBjc3NUb3AgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBNb3ZlYWJsZVxuIiwiY2xhc3MgUmVuZGVyYWJsZSB7ICAvLyBnZW5lcmFsaXplZCByZW5kZXIgZnVuY3Rpb25zIGZvciBTY2VuZXJ5LCBDaGFyYWN0ZXJcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBzZXRMYXllcihsYXllcikge1xuICAgICAgICB0aGlzLmxheWVyID0gbGF5ZXJcbiAgICB9XG5cbiAgICBnZXRMYXllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJcbiAgICB9XG5cbiAgICByZW5kZXJTcGFuKHVuaXQpIHtcbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5pdC50b3AgJiYgdW5pdC5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7dW5pdC50b3B9cHg7IGxlZnQ6ICR7dW5pdC5sZWZ0fXB4YFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJ1bml0ICR7Y2xzfVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9zcGFuPmBcbiAgICB9XG5cbiAgICByZW5kZXJEaXYoaXRlbSkge1xuICAgICAgICBsZXQgZGl2ID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgZGl2ID0gaXRlbS5kaXZcbiAgICAgICAgICAgIGVsZW1lbnQgPSBpdGVtLmVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS50b3AgJiYgaXRlbS5sZWZ0KSB7XG4gICAgICAgICAgICBzdHlsZSA9IGB0b3A6ICR7aXRlbS50b3B9cHg7IGxlZnQ6ICR7aXRlbS5sZWZ0fXB4OyBwb3NpdGlvbjogYWJzb2x1dGVgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ub2ZmTWFwKSB7XG4gICAgICAgICAgICBzdHlsZSArPSBgOyBkaXNwbGF5OiBub25lYFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLm1pbmluZykge1xuICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmcgM3MgaW5maW5pdGVgXG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgKGl0ZW0uc3Bpbm5pbmcpIHtcbiAgICAgICAgLy8gICAgIHN0eWxlICs9IGA7IGFuaW1hdGlvbjogc3Bpbm5pbmcgMXMgaW5maW5pdGVgXG4gICAgICAgIC8vIH1cbiAgICAgICAgcmV0dXJuIGA8ZGl2IGlkPVwiJHtkaXZ9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L2Rpdj5gXG4gICAgfVxuXG4gICAgdXBkYXRlU3BhbihhY3Rvcikge1xuICAgICAgICB0aGlzLnNldExheWVyKHRoaXMucmVuZGVyU3BhbihhY3RvcikpXG4gICAgfVxuXG4gICAgdXBkYXRlRGl2KGl0ZW0pIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlckRpdihpdGVtKSlcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIobGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQocGFyZW50TGF5ZXJJZCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBhcmVudExheWVySWQpXG4gICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgLy8gY3JlYXRlcyBkaXYgaWQgd2l0aGluIGVuY2xvc2luZyBkaXYgLi4uXG4gICAgICAgIGNoaWxkLmlubmVySFRNTCA9IHRoaXMuZ2V0TGF5ZXIoKVxuICAgICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJhYmxlXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5cblxuY2xhc3MgU2NlbmVyeSBleHRlbmRzIFJlbmRlcmFibGUgeyAgLy8gU2NlbmVyeS1zcGVjaWZpYyByZW5kZXJpbmcgZnVuY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXAuZ2V0TWFwKClcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcigpXG4gICAgICAgIGNvbnNvbGUubG9nKCdzY2VuZXJ5IHJlbmRlcmVkJylcbiAgICB9XG5cbiAgICByZW5kZXJMYXllcigpIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IHRoaXMuZ290TWFwLm1hcChhcnIgPT4geyByZXR1cm4gYXJyLnNsaWNlKCkgfSlcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLmNyZWF0ZUxheWVyKGdyaWQpKVxuICAgICAgICB0aGlzLmRyYXdMYXllcigpXG4gICAgfVxuXG4gICAgY3JlYXRlTGF5ZXIoZ3JpZCkge1xuICAgICAgICBjb25zdCBzY2VuZXJ5R3JpZCA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgcm93SXRlbXMgPSBncmlkW2ldXG4gICAgICAgICAgICBsZXQgcm93ID0gJycgIC8vIHBvc3NpYmx5IG1ha2UgZWFjaCByb3cgYSB0YWJsZT9cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByb3cgKz0gdGhpcy5yZW5kZXJTcGFuKHJvd0l0ZW1zW2ldKSAvLyBhZGQgcmVuZGVyZWQgaXRlbXMgdG8gdGhlIGdyaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjZW5lcnlHcmlkLnB1c2gocm93KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2VuZXJ5R3JpZFxuICAgIH1cblxuICAgIGRyYXdMYXllcigpIHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgY29uc3QgZ3JpZFRvSFRNTCA9IGxheWVyLmpvaW4oJzxiciAvPicpICAvLyB1c2luZyBIVE1MIGJyZWFrcyBmb3Igbm93XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xhbmRzY2FwZS1sYXllcicpXG4gICAgICAgIGVsLmlubmVySFRNTCA9IGdyaWRUb0hUTUxcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU2NlbmVyeVxuIiwiaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcblxuY2xhc3MgU3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy51cGRhdGUsIHRoaXMpXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKCdkaXNwbGF5LWl0ZW0nLCB0aGlzLmRpc3BsYXlJdGVtLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnc3RhdHVzJywgdGhpcy5kZWZhdWx0LCB0aGlzKVxuICAgIH1cblxuICAgIHVwZGF0ZShsb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldChsb2NhdGlvbi5kZXNjcmlwdGlvbilcbiAgICB9XG5cbiAgICBiZWdpbnNXaXRoVm93ZWwodGV4dCkge1xuICAgICAgICBjb25zdCBmaXJzdExldHRlciA9IHRleHRbMF1cbiAgICAgICAgY29uc3Qgdm93ZWxzID0gWydhJywgJ2UnLCAnaScsICdvJywgJ3UnXVxuICAgICAgICBsZXQgYmVnaW5zV2l0aFZvd2VsID0gZmFsc2VcbiAgICAgICAgdm93ZWxzLmZvckVhY2godm93ZWwgPT4ge1xuICAgICAgICAgICAgaWYgKGZpcnN0TGV0dGVyID09PSB2b3dlbCkge1xuICAgICAgICAgICAgICAgIGJlZ2luc1dpdGhWb3dlbCA9IHRydWVcbiAgICAgICAgICAgIH19KVxuICAgICAgICByZXR1cm4gYmVnaW5zV2l0aFZvd2VsXG4gICAgfVxuXG4gICAgZGlzcGxheUl0ZW0oaXRlbU5hbWUpIHtcbiAgICAgICAgY29uc3QgYmVnaW5zV2l0aFZvd2VsID0gdGhpcy5iZWdpbnNXaXRoVm93ZWwoaXRlbU5hbWUpXG4gICAgICAgIGxldCB0ZXh0ID0gJydcbiAgICAgICAgaWYgKGJlZ2luc1dpdGhWb3dlbCkge1xuICAgICAgICAgICAgdGV4dCA9IGB5b3Ugc2VlIGFuICR7aXRlbU5hbWV9IGhlcmVgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZXh0ID0gYHlvdSBzZWUgYSAke2l0ZW1OYW1lfSBoZXJlYFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0KHRleHQsIDEwKVxuICAgIH1cblxuICAgIGRlZmF1bHQodGV4dCkge1xuICAgICAgICB0aGlzLnNldCh0ZXh0LCAxMClcbiAgICB9XG5cbiAgICBzZXQoZGVzY3JpcHRpb24sIGRlbGF5PTApIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uXG4gICAgICAgIH0sIGRlbGF5KVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTdGF0dXNcbiIsImltcG9ydCBVdGlsaXR5IGZyb20gJy4vVXRpbGl0eSdcblxuXG5jbGFzcyBVc2VySW5wdXQge1xuICAgIGNvbnN0cnVjdG9yKGtleUFjdGlvbk1hcCkge1xuICAgICAgICB0aGlzLmtleUFjdGlvbk1hcCA9IGtleUFjdGlvbk1hcFxuXG4gICAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IHRoaXMudHJ5QWN0aW9uRm9yRXZlbnQuYmluZCh0aGlzKVxuICAgIH1cblxuICAgIHRyeUFjdGlvbkZvckV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGlmICghVXRpbGl0eS5jb250YWlucyh0aGlzLmtleUFjdGlvbk1hcCwgZXZlbnQua2V5Q29kZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBub3QgYSB2YWxpZCBrZXljb2RlOiAke2V2ZW50LmtleUNvZGV9YClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMua2V5QWN0aW9uTWFwW2V2ZW50LmtleUNvZGVdKClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBVc2VySW5wdXRcbiIsImxldCBpZCA9IDBcblxuZnVuY3Rpb24gZ2VuZXJhdGVJZCgpIHtcbiAgICBpZCA9IGlkICsgMVxuICAgIHJldHVybiBpZFxufVxuXG5jbGFzcyBVdGlsaXR5IHtcbiAgICBzdGF0aWMgY29udGFpbnMob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5pbmRleE9mKFN0cmluZyhwcm9wZXJ0eSkpICE9PSAtMVxuICAgIH1cblxuICAgIHN0YXRpYyBzdHJpbmdUb051bWJlcihzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5tYXRjaCgvXFxkKy8pWzBdXG4gICAgfVxuXG4gICAgc3RhdGljIHJhbmRvbWl6ZShtdWx0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtdWx0KVxuICAgIH1cblxuICAgIHN0YXRpYyBJZCgpIHtcbiAgICAgICAgcmV0dXJuIGdlbmVyYXRlSWQoKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBVdGlsaXR5XG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50c0xpc3QgPSBbXSAgICAgICAgLy8gY3JlYXRlIGFycmF5IG9mIGV2ZW50c1xuICAgIH1cblxuICAgIHN1YnNjcmliZShldmVudCwgZm4sIHRoaXNWYWx1ZSwgb25jZT1mYWxzZSkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXNWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHsgICAvLyBpZiBubyB0aGlzVmFsdWUgcHJvdmlkZWQsIGJpbmRzIHRoZSBmbiB0byB0aGUgZm4/P1xuICAgICAgICAgICAgdGhpc1ZhbHVlID0gZm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50c0xpc3QucHVzaCh7ICAgICAgLy8gY3JlYXRlIG9iamVjdHMgbGlua2luZyBldmVudHMgKyBmdW5jdGlvbnMgdG8gcGVyZm9ybVxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LCAgICAgICAgICAgLy8gcHVzaCBlbSB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgICAgICB0aGlzVmFsdWU6IHRoaXNWYWx1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHVuc3Vic2NyaWJlKGV2ZW50KSB7XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAvLyAgICAgICAgICAgICBicmVha1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGlzaChldmVudCwgYXJnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGhpc1ZhbHVlLCBmbiwgb25jZSB9ID0gdGhpcy5ldmVudHNMaXN0W2ldXG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzVmFsdWUsIGFyZylcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzTGlzdFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRXZlbnRNYW5hZ2VyKClcbiIsImltcG9ydCBNYXAgZnJvbSAnLi9NYXAnXG5pbXBvcnQgU2NlbmVyeSBmcm9tICcuL1NjZW5lcnknXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4vQ2hhcmFjdGVyJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi9TdGF0dXMnXG5pbXBvcnQgVXNlcklucHV0IGZyb20gJy4vVXNlcklucHV0J1xuaW1wb3J0IEJsdWVwcmludHMgZnJvbSAnLi9CbHVlcHJpbnRzJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcbmltcG9ydCB7IGdlbmVyYXRlSXRlbXMgfSBmcm9tICcuL2l0ZW1zJ1xuXG5cbmNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmluaXRHYW1lKClcbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKVxuICAgIH1cblxuICAgIGluaXRHYW1lKCkge1xuICAgICAgICAvLyB0aGlzLnNwYWNlcyA9IFtdXG4gICAgICAgIC8vIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZVxuXG4gICAgICAgIHRoaXMuc3RhdHVzID0gbmV3IFN0YXR1cygpXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoNjAsIDYwKVxuICAgICAgICBjb25zdCBpdGVtcyA9IGdlbmVyYXRlSXRlbXMoNSlcblxuICAgICAgICB0aGlzLnNjZW5lcnkgPSBuZXcgU2NlbmVyeShtYXApXG5cbiAgICAgICAgbWFwLnNldEl0ZW1zKGl0ZW1zKVxuXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIobWFwKVxuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IGNoYXJhY3RlclxuXG4gICAgICAgIG1hcC5zZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKVxuICAgICAgICAvLyBjaGFyYWN0ZXIuc3Vic2NyaWJlSXRlbXNUb01hcCgpICAvLyBub3QgY3VycmVudGx5IG5lY2Vzc2FyeVxuXG4gICAgICAgIHRoaXMuYmx1ZXByaW50ID0gQmx1ZXByaW50cy5yYW5kb20oKVxuXG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gaW52ZW50b3J5XG4gICAgICAgIHRoaXMuaW52ZW50b3J5LmFkZCh0aGlzLmJsdWVwcmludClcblxuICAgICAgICB0aGlzLmlucHV0ID0gdGhpcy5pbml0VXNlcklucHV0KGNoYXJhY3RlcilcbiAgICB9XG5cbiAgICBpbml0VXNlcklucHV0KGNoYXJhY3Rlcikge1xuICAgICAgICByZXR1cm4gbmV3IFVzZXJJbnB1dCh7XG4gICAgICAgICAgICAnMzgnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ25vcnRoJyksXG4gICAgICAgICAgICAnMzcnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ3dlc3QnKSxcbiAgICAgICAgICAgICczOSc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnZWFzdCcpLFxuICAgICAgICAgICAgJzQwJzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdzb3V0aCcpLFxuICAgICAgICAgICAgJzg0JzogY2hhcmFjdGVyLmdldEFjdGlvbigndGFrZScpLCAvLyAodClha2UgaXRlbVxuICAgICAgICAgICAgJzczJzogY2hhcmFjdGVyLmdldEFjdGlvbignY2hlY2tJbnZlbnRvcnknKSwgLy8gY2hlY2sgKGkpbnZlbnRvcnlcbiAgICAgICAgICAgICc3Nyc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21pbmUnKSAvLyBkZXBsb3kgcGFydGljbGUgKG0paW5lclxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXJ0R2FtZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KCd5b3Ugd2FrZSB1cCcpXG4gICAgICAgIHRoaXMuc3RhdHVzLnNldChgeW91IGFyZSBjYXJyeWluZyAke3RoaXMuYmx1ZXByaW50Lm5hbWV9YCwgNDAwMClcbiAgICB9XG5cbiAgICAvLyBnYW1lSXNPdmVyKCkge1xuICAgIC8vICAgICByZXR1cm4gdGhpcy5nYW1lT3ZlclxuICAgIC8vIH1cblxuICAgIC8vIGV4cGxvcmUoKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGBleHBsb3JpbmcgdGhlICR7dGhpcy5raW5kfSB6b25lIWApXG4gICAgLy8gfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBHYW1lKCk7XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBJbnZlbnRvcnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRzID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnYWRkLWludmVudG9yeScsIHRoaXMuYWRkLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMucmVtb3ZlLCB0aGlzKVxuICAgIH1cblxuICAgIGFkZChpdGVtKSB7XG4gICAgICAgIHRoaXMuY29udGVudHMucHVzaChpdGVtKVxuICAgIH1cblxuXG5cbi8vIHVudGVzdGVkXG5cbiAgICByZW1vdmUoaXRlbSkge1xuICAgICAgICBjb25zdCB0aGVJdGVtID0gaXRlbVxuICAgICAgICB0aGlzLmNvbnRlbnRzLmZvckVhY2goKGl0ZW0sIGksIGFycmF5KSA9PiB7XG4gICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IHRoZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRzLnNwbGljZShpLCAxKVxuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaXRlbSBub3QgaW4gaW52ZW50b3J5JylcbiAgICAgICAgICAgIH19KVxuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJbnZlbnRvcnlcbiIsImltcG9ydCBNb3ZlYWJsZSBmcm9tICdqcy9Nb3ZlYWJsZSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJ2pzL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJ2pzL2V2ZW50TWFuYWdlcidcblxuXG4vLyBjb25zdCBJVEVNUyA9IHtcbi8vICAgICBtaW5lcjoge1xuLy8gICAgICAgICBuYW1lOiAncGFydGljbGUgbWluZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICd8Jyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdtaW5lcywgZGl2aWRlcywgYW5kIHN0b3JlcyBhbWJpZW50IGNoZW1pY2FsIGVsZW1lbnRzIGFuZCBsYXJnZXIgY29tcG91bmRzIGZvdW5kIHdpdGhpbiBhIDEwMCBtZXRlciByYWRpdXMuIDk3JSBhY2N1cmFjeSByYXRlLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tbWluZXInXG4vLyAgICAgfSxcbi8vICAgICBwYXJzZXI6IHtcbi8vICAgICAgICAgbmFtZTogJ25vaXNlIHBhcnNlcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJz8nLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ3Byb3RvdHlwZS4gcGFyc2VzIGF0bW9zcGhlcmljIGRhdGEgZm9yIGxhdGVudCBpbmZvcm1hdGlvbi4gc2lnbmFsLXRvLW5vaXNlIHJhdGlvIG5vdCBndWFyYW50ZWVkLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tcGFyc2VyJ1xuLy8gICAgIH0sXG4vLyAgICAgaW50ZXJmYWNlOiB7XG4vLyAgICAgICAgIG5hbWU6ICdwc2lvbmljIGludGVyZmFjZScsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJyYnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogYGNvbm5lY3RzIHNlYW1sZXNzbHkgdG8gYSBzdGFuZGFyZC1pc3N1ZSBiaW9wb3J0LiBmYWNpbGl0YXRlcyBzdW5kcnkgaW50ZXJhY3Rpb25zIHBlcmZvcm1lZCB2aWEgUFNJLU5FVC5gLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLWludGVyZmFjZSdcbi8vICAgICB9LFxuLy8gICAgIHByaW50ZXI6IHtcbi8vICAgICAgICAgbmFtZTogJ21vbGVjdWxhciBwcmludGVyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnIycsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAnZ2VuZXJhdGVzIG9iamVjdHMgYWNjb3JkaW5nIHRvIGEgYmx1ZXByaW50LiBtb2xlY3VsZXMgbm90IGluY2x1ZGVkLicsXG4vLyAgICAgICAgIGRpdjogJ2l0ZW0tcHJpbnRlcidcbi8vICAgICB9XG4vLyB9XG5cbmNsYXNzIEl0ZW0gZXh0ZW5kcyBNb3ZlYWJsZSB7XG4gICAgY29uc3RydWN0b3IoaXRlbUNvbmZpZykge1xuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgLy8gbWVyZ2UgaW4gY29uZmlnIHByb3BlcnRpZXNcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gT2JqZWN0LmFzc2lnbih0aGlzLCBpdGVtQ29uZmlnKVxuXG4gICAgICAgIC8vIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuICAgICAgICB0aGlzLmlkZW50aXR5TnVtYmVyID0gVXRpbGl0eS5JZCgpXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLm9mZk1hcCA9IGZhbHNlXG4gICAgICAgIC8vIHRoaXMuaW5JbnZlbnRvcnkgPSBmYWxzZVxuXG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMpXG4gICAgfVxuXG4gICAgc2V0T25NYXAobWFwLCBsb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldE1hcChtYXApXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbEdyaWRJbmRpY2VzKGxvY2F0aW9uKVxuICAgICAgICB0aGlzLnNldENvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5zZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIHRoaXMuc2V0RGl2KHRoaXMuZ2V0SWQoKSlcbiAgICAgICAgdGhpcy51cGRhdGVEaXYodGhpcylcblxuLy8gbW92ZWQgdGhpcyBvdXQgc28gd2UgYXJlIG5vdCBjcmVhdGluZyBjaGlsZHJlbiBlYWNoIHRpbWUgd2Ugd2FudCB0byBwbGFjZSBvbiBtYXBcbiAgICAgICAgLy8gdGhpcy5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJylcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHlOdW1iZXJcbiAgICB9XG5cbiAgICBzZXRDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLmxlZnQgPSBjc3NMZWZ0XG4gICAgICAgIHRoaXMudG9wID0gY3NzVG9wXG4gICAgfVxuXG4gICAgc2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG5cbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgfVxuXG4gICAgc2V0RGl2KGlkZW50aXR5TnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5kaXZTZXQpIHtcbiAgICAgICAgICAgIHRoaXMuZGl2ID0gdGhpcy5kaXYgKyBpZGVudGl0eU51bWJlclxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGl2U2V0ID0gdHJ1ZVxuICAgIH1cblxuXG4gICAgLy8gc3BlY2lmaWMgdG8gaXRlbSBkcmF3aW5nOiB1c2Ugb3V0ZXJIVE1MXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2xheWVySWQnLCBsYXllcklkKVxuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxheWVySWQpXG4gICAgICAgIGNvbnNvbGUubG9nKCdlbCBpbiBkcmF3TGF5ZXInLCBlbClcbiAgICAgICAgZWwub3V0ZXJIVE1MID0gdGhpcy5nZXRMYXllcigpXG4gICAgfVxuXG5cblxuICAgIHJlbmRlckxheWVyKHVuaXQsIGxheWVySWQpIHtcbiAgICAgICAgaWYgKHVuaXQudHlwZSA9PT0gJ2l0ZW0nKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURpdih1bml0KVxuICAgICAgICAgICAgdGhpcy5kcmF3TGF5ZXIobGF5ZXJJZClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgb25UYWtlKCkge1xuICAgICAgICB0aGlzLnggPSBudWxsXG4gICAgICAgIHRoaXMueSA9IG51bGxcbiAgICAgICAgdGhpcy5vZmZNYXAgPSB0cnVlIC8vIGNoYW5nZXMgY3NzIGRpc3BsYXkgdG8gJ25vbmUnXG4gICAgICAgIHRoaXMubWluaW5nID0gZmFsc2VcblxuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1pbnZlbnRvcnknLCB0aGlzKVxuICAgICAgICAvLyB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMub25Ecm9wLCB0aGlzKVxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuICAgIH1cblxuICAgIG9uRHJvcCgpIHtcbiAgICAvLyAgICAgdGhpcy54ID0gYXJncy54XG4gICAgLy8gICAgIHRoaXMueSA9IGFyZ3MueVxuXG5cbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoYCR7dGhpcy5uYW1lfS0ke3RoaXMuaWRlbnRpdHlOdW1iZXJ9IHRha2VuYCwgdGhpcy5vblRha2UsIHRoaXMsIHRydWUpXG4gICAgLy8gICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcywgdGhpcy5kaXYpXG5cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSXRlbVxuIiwiaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJ1xuXG5jbGFzcyBQYXJ0aWNsZU1pbmVyIGV4dGVuZHMgSXRlbSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICB0aGlzLm5hbWUgPSAncGFydGljbGUgbWluZXInXG4gICAgICAgIHRoaXMudHlwZSA9ICdpdGVtJ1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAnfCdcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9ICdtaW5lcywgZGl2aWRlcywgYW5kIHN0b3JlcyBhbWJpZW50IGNoZW1pY2FsIGVsZW1lbnRzIGFuZCBsYXJnZXIgY29tcG91bmRzIGZvdW5kIHdpdGhpbiBhIDEwMCBtZXRlciByYWRpdXMuIDk3JSBhY2N1cmFjeSByYXRlLidcbiAgICAgICAgdGhpcy5kaXYgPSAnaXRlbS1taW5lcidcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFydGljbGVNaW5lclxuIiwiaW1wb3J0IFBhcnRpY2xlTWluZXIgZnJvbSAnLi9QYXJ0aWNsZU1pbmVyJ1xuaW1wb3J0IFV0aWxpdHkgZnJvbSAnanMvVXRpbGl0eSdcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcblxuY29uc3QgSVRFTVMgPSBbXG4gICAgUGFydGljbGVNaW5lclxuXVxuXG5mdW5jdGlvbiByYW5kb21JdGVtKCkge1xuICAgIHJldHVybiBuZXcgSVRFTVNbVXRpbGl0eS5yYW5kb21pemUoSVRFTVMubGVuZ3RoKV1cbn1cblxuXG5mdW5jdGlvbiBnZW5lcmF0ZUl0ZW1zKG51bWJlciA9IDEpIHtcbiAgICBjb25zdCBpdGVtcyA9IFtdXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlcjsgaSsrKSB7XG4gICAgICAgIGl0ZW1zLnB1c2gocmFuZG9tSXRlbSgpKVxuICAgIH1cblxuICAgIHJldHVybiBpdGVtc1xufVxuXG5leHBvcnQge1xuICAgIGdlbmVyYXRlSXRlbXNcbn1cbiJdfQ==
