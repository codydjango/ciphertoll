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

        // checkInventory() {
        //     const carrying = this.inventory.map(item => item.name).join(' | ')
        //     const text = `you are carrying: ${carrying}`
        //     this.EM.publish('status', text)
        // }

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
        key: 'getItemLocation',
        value: function getItemLocation(itemName) {
            var char = this.getCharacter();
            var itself = this.findInventoryItem(itemName);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvQmx1ZXByaW50cy5qcyIsInNyYy9qcy9DaGFyYWN0ZXIuanMiLCJzcmMvanMvQ29uc3RhbnRzLmpzIiwic3JjL2pzL0ludmVudG9yeURpc3BsYXkuanMiLCJzcmMvanMvTGFuZHNjYXBlRGF0YS5qcyIsInNyYy9qcy9NYXAuanMiLCJzcmMvanMvTWFwR2VuZXJhdG9yLmpzIiwic3JjL2pzL01vdmVhYmxlLmpzIiwic3JjL2pzL1JlbmRlcmFibGUuanMiLCJzcmMvanMvU2NlbmVyeS5qcyIsInNyYy9qcy9TdGF0dXMuanMiLCJzcmMvanMvVXNlcklucHV0LmpzIiwic3JjL2pzL1V0aWxpdHkuanMiLCJzcmMvanMvZXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvaW52ZW50b3J5LmpzIiwic3JjL2pzL2l0ZW1zL0l0ZW0uanMiLCJzcmMvanMvaXRlbXMvUGFydGljbGVNaW5lci5qcyIsInNyYy9qcy9pdGVtcy9pbmRleC5qcyIsInNyYy9qcy9zdG9yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLE9BQU8sSUFBUDs7Ozs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7QUFHQSxJQUFNLGdCQUFnQjtBQUNsQixzQkFBa0I7QUFDZCxjQUFNLCtCQURRO0FBRWQscUJBQWEsRUFGQztBQUdkLG1CQUFXLEVBSEc7QUFJZCxzQkFBYztBQUpBLEtBREE7QUFPbEIsb0JBQWdCO0FBQ1osY0FBTSw2QkFETTtBQUVaLHFCQUFhLEVBRkQ7QUFHWixtQkFBVyxFQUhDO0FBSVosc0JBQWM7QUFKRixLQVBFO0FBYWxCLG1CQUFlO0FBQ1gsY0FBTSw0QkFESztBQUVYLHFCQUFhLEVBRkY7QUFHWCxtQkFBVyxFQUhBO0FBSVgsc0JBQWM7QUFKSDtBQWJHLENBQXRCOztJQXNCTSxTO0FBQ0YsdUJBQVksSUFBWixF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O0FBQ0g7O1FBSUcsYSxHQUFBLGE7Ozs7Ozs7Ozs7O0FDdEJKOzs7Ozs7OztJQUVNLEs7QUFDRixxQkFBYztBQUFBOztBQUNWLGFBQUssRUFBTDs7QUFFQSxZQUFJLE9BQU8sT0FBTyxZQUFkLEtBQStCLFdBQW5DLEVBQWdEO0FBQzVDLG9CQUFRLEdBQVIsQ0FBWSxrQ0FBWjtBQUNBLG1CQUFPLEtBQVAsQ0FBYSxpQkFBYjtBQUNBLGlCQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDSCxTQUpELE1BSU87QUFDSCxpQkFBSyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsaUJBQUssT0FBTCxHQUFlLE9BQU8sWUFBdEI7QUFDSDtBQUNKOzs7O2dDQUVPO0FBQ0osaUJBQUssT0FBTCxDQUFhLEtBQWI7QUFDSDs7OzRCQUVHLEcsRUFBSztBQUNMLG1CQUFRLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsTUFBOEIsSUFBdEM7QUFDSDs7OzRCQUVHLEcsRUFBSyxLLEVBQU87QUFDWixvQkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixHQUF6Qjs7QUFFQSxpQkFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixFQUEwQixLQUFLLFNBQUwsQ0FBZSxLQUFmLENBQTFCO0FBQ0g7Ozs0QkFFRyxHLEVBQUs7QUFDTCxvQkFBUSxHQUFSLENBQVksV0FBWixFQUF5QixHQUF6Qjs7QUFFQSxtQkFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEdBQXJCLENBQVgsQ0FBUDtBQUNIOzs7Ozs7a0JBSVUsSUFBSSxLQUFKLEUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBnYW1lIGZyb20gJy4vanMvZ2FtZSdcblxud2luZG93LmdhbWUgPSBnYW1lXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5cblxuY29uc3QgYmx1ZXByaW50RGF0YSA9IHtcbiAgICBhcnRpZmljaWFsTXVzY2xlOiB7XG4gICAgICAgIG5hbWU6ICdhcnRpZmljaWFsIG11c2NsZSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH0sXG4gICAgcmV0aW5hbERpc3BsYXk6IHtcbiAgICAgICAgbmFtZTogJ3JldGluYWwgZGlzcGxheSAoYmx1ZXByaW50KScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgYWJpbGl0aWVzOiAnJyxcbiAgICAgICAgcmVxdWlyZW1lbnRzOiAnJ1xuICAgIH0sXG4gICAgcHJvc3RoZXRpY0FybToge1xuICAgICAgICBuYW1lOiAncHJvc3RoZXRpYyBhcm0gKGJsdWVwcmludCknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgIGFiaWxpdGllczogJycsXG4gICAgICAgIHJlcXVpcmVtZW50czogJydcbiAgICB9XG59XG5cblxuY2xhc3MgQmx1ZXByaW50IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBkZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb20oKSB7XG4gICAgICAgIGNvbnN0IGJsdWVwcmludFZhbHVlcyA9IE9iamVjdC52YWx1ZXMoYmx1ZXByaW50RGF0YSlcbiAgICAgICAgY29uc3QgaW5kZXggPSBVdGlsaXR5LnJhbmRvbWl6ZShibHVlcHJpbnRWYWx1ZXMubGVuZ3RoKVxuXG4gICAgICAgIGNvbnN0IHJhbmRvbUJsdWVwcmludCA9IGJsdWVwcmludFZhbHVlc1tpbmRleF1cblxuICAgICAgICByZXR1cm4gbmV3IEJsdWVwcmludChyYW5kb21CbHVlcHJpbnQubmFtZSwgcmFuZG9tQmx1ZXByaW50LmRlc2NyaXB0aW9uKVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBCbHVlcHJpbnRcblxuIiwiaW1wb3J0IE1vdmVhYmxlIGZyb20gJy4vTW92ZWFibGUnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcblxuXG5jbGFzcyBDaGFyYWN0ZXIgZXh0ZW5kcyBNb3ZlYWJsZSB7ICAvLyBDaGFyYWN0ZXIgZGF0YSBhbmQgYWN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcEluc3RhbmNlLCBpbml0aWFsUG9zaXRpb24pIHtcbiAgICAgICAgc3VwZXIobWFwSW5zdGFuY2UpXG4gICAgICAgIHRoaXMubWFwSW5zdGFuY2UgPSBtYXBJbnN0YW5jZVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgICAgIHRoaXMuaW52ZW50b3J5ID0gaW52ZW50b3J5LmNvbnRlbnRzXG5cbiAgICAgICAgbGV0IHBvc2l0aW9uXG4gICAgICAgIGlmIChpbml0aWFsUG9zaXRpb24pIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaW5pdGlhbFBvc2l0aW9uXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IG1hcEluc3RhbmNlLmdldE1hcENlbnRlcigpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyhwb3NpdGlvbilcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJhY3RlciByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyTGF5ZXIodW5pdCwgbGF5ZXJJZCkge1xuICAgICAgICBpZiAodW5pdC50eXBlID09PSAnYWN0b3InKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNwYW4odW5pdClcbiAgICAgICAgICAgIHRoaXMuZHJhd0xheWVyKGxheWVySWQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdWJzY3JpYmVJdGVtc1RvTWFwKCkge1xuICAgICAgICAvLyBOT1QgUkVRVUlSRUQgQVQgVEhFIE1PTUVOVFxuXG4gICAgICAgIC8vIHRoaXMubWFwLml0ZW1zT25NYXAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgLy8gICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke2l0ZW0ubmFtZX0tJHtpdGVtLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMudGFrZUl0ZW0sIHRoaXMsIHRydWUpXG4gICAgICAgIC8vIH0pXG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyaWRJbmRpY2VzXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgdHlwZTogJ2FjdG9yJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdAJyxcbiAgICAgICAgICAgIGNsczogJ2NoYXJhY3RlcicsXG4gICAgICAgICAgICBsZWZ0OiBjc3NMZWZ0LFxuICAgICAgICAgICAgdG9wOiBjc3NUb3AsXG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXJcbiAgICB9XG5cbiAgICBnZXRBY3Rpb24oZm5OYW1lLCBhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbZm5OYW1lXS5iaW5kKHRoaXMsIGFyZylcbiAgICB9XG5cbiAgICBtb3ZlKGRpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy51cGRhdGVHcmlkSW5kaWNlcyh0aGlzLmdldENoYXJhY3RlcigpLCBESVJFQ1RJT05TW2RpcmVjdGlvbl0pXG4gICAgICAgIHRoaXMucHJpbnRMb2NhbFN0YXR1cygpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcy5nZXRDaGFyYWN0ZXIoKSwgJ2NoYXJhY3Rlci1sYXllcicpXG5cbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLmxvY2F0aW9uLngsXG4gICAgICAgICAgICB5OiB0aGlzLmxvY2F0aW9uLnlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnbW92ZWQtdG8nLCBwb3NpdGlvbilcbiAgICB9XG5cbiAgICBwcmludExvY2FsU3RhdHVzKCkge1xuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIGNvbnN0IGxvY2FsSXRlbSA9IHRoaXMubG9jYWxJdGVtKClcblxuICAgICAgICBpZiAobG9jYWxJdGVtKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxJdGVtLm1pbmluZyA9PT0gJ2VtcHR5Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ21pbmluZyBoYXMgYmVlbiBleGhhdXN0ZWQgZm9yIHRoaXMgcmVnaW9uJylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobG9jYWxJdGVtLm1pbmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ2EgbWluZXIgcHVsbHMgY29tcG91bmRzIGZyb20gdGhlIHJlZ2lvbicpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnZGlzcGxheS1pdGVtJywgbG9jYWxJdGVtLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbEl0ZW0oKSB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIGxldCBsb2NhbEl0ZW0gPSBudWxsXG5cbiAgICAgICAgdGhpcy5tYXBJbnN0YW5jZS5pdGVtc09uTWFwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS54ID09PSBjaGFyLnggJiYgaXRlbS55ID09PSBjaGFyLnkpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEl0ZW0gPSBpdGVtXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGxvY2FsSXRlbVxuICAgIH1cblxuICAgIHRha2UoKSB7XG4gICAgICAgIGNvbnN0IGxvY2FsSXRlbSA9IHRoaXMubG9jYWxJdGVtKClcblxuICAgICAgICBpZiAobG9jYWxJdGVtKSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goYCR7bG9jYWxJdGVtLm5hbWV9LSR7bG9jYWxJdGVtLmlkZW50aXR5TnVtYmVyfSB0YWtlbmApXG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIGAke2xvY2FsSXRlbS5uYW1lfSB0YWtlbmApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsICd0aGVyZSBpcyBub3RoaW5nIGhlcmUgd29ydGggdGFraW5nJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrSW52ZW50b3J5KCkge1xuICAgIC8vICAgICBjb25zdCBjYXJyeWluZyA9IHRoaXMuaW52ZW50b3J5Lm1hcChpdGVtID0+IGl0ZW0ubmFtZSkuam9pbignIHwgJylcbiAgICAvLyAgICAgY29uc3QgdGV4dCA9IGB5b3UgYXJlIGNhcnJ5aW5nOiAke2NhcnJ5aW5nfWBcbiAgICAvLyAgICAgdGhpcy5FTS5wdWJsaXNoKCdzdGF0dXMnLCB0ZXh0KVxuICAgIC8vIH1cblxuICAgIGZpbmRJbnZlbnRvcnlJdGVtKGl0ZW1OYW1lKSB7XG4gICAgICAgIGxldCBmb3VuZEl0ZW0gPSBudWxsXG4gICAgICAgIHRoaXMuaW52ZW50b3J5LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBpdGVtTmFtZSkge1xuICAgICAgICAgICAgICAgIGZvdW5kSXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGZvdW5kSXRlbVxuICAgIH1cblxuICAgIGdldEl0ZW1Mb2NhdGlvbihpdGVtTmFtZSkge1xuICAgICAgICBjb25zdCBjaGFyID0gdGhpcy5nZXRDaGFyYWN0ZXIoKVxuICAgICAgICBjb25zdCBpdHNlbGYgPSB0aGlzLmZpbmRJbnZlbnRvcnlJdGVtKGl0ZW1OYW1lKVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IFtjaGFyLngsIGNoYXIueV1cbiAgICAgICAgcmV0dXJuIHsgaXRzZWxmLCBsb2NhdGlvbiB9XG4gICAgfVxuXG4gICAgbWluZSgpIHtcbiAgICAgICAgY29uc3QgbWluZXIgPSB0aGlzLmdldEl0ZW1Mb2NhdGlvbigncGFydGljbGUgbWluZXInKVxuICAgICAgICBpZiAobWluZXIuaXRzZWxmKSB7XG4gICAgICAgICAgICBtaW5lci5pdHNlbGYubWluZShtaW5lci5sb2NhdGlvbilcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgncmVtb3ZlLWludmVudG9yeScsIG1pbmVyLml0c2VsZilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuRU0ucHVibGlzaCgnc3RhdHVzJywgJ3lvdSBkbyBub3QgaGF2ZSBhbnkgcGFydGljbGUgbWluZXJzJylcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJcbiIsImNvbnN0IERJUkVDVElPTlMgPSB7XG4gICAgbm9ydGg6IHsgeDogMCwgeTogLTEgfSxcbiAgICBzb3V0aDogeyB4OiAwLCB5OiAxIH0sXG4gICAgZWFzdDogeyB4OiAxLCB5OiAwIH0sXG4gICAgd2VzdDogeyB4OiAtMSwgeTogMCB9LFxuICAgIG5vcnRod2VzdDogeyB4OiAtMSwgeTogLTEgfSxcbiAgICBub3J0aGVhc3Q6IHsgeDogMSwgeTogLTEgfSxcbiAgICBzb3V0aGVhc3Q6IHsgeDogMSwgeTogMSB9LFxuICAgIHNvdXRod2VzdDogeyB4OiAtMSwgeTogMSB9XG59XG5cblxuZXhwb3J0IHsgRElSRUNUSU9OUyB9XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBJbnZlbnRvcnlEaXNwbGF5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pbnZlbnRvcnknLCB0aGlzLnJlbmRlciwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2Rpc3BsYXktbWluZWQnLCB0aGlzLnJlbmRlck1pbmVkLCB0aGlzKVxuICAgIH1cblxuICAgIHJlbmRlcihpbnZlbnRvcnlPYmplY3QpIHtcbiAgICAgICAgbGV0IHN0ciA9IGludmVudG9yeU9iamVjdC5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpLmpvaW4oJzxicj4nKVxuICAgICAgICBzdHIgPSAnSU5WRU5UT1JZIDxicj48YnI+JyArIHN0clxuICAgICAgICB0aGlzLnNldChzdHIsICdpbnZlbnRvcnktc3RhdHVzJylcbiAgICB9XG5cbiAgICByZW5kZXJNaW5lZChtaW5lZEVsZW1lbnRzT2JqZWN0KSB7XG4gICAgICAgIGxldCBzdHIgPSB0aGlzLmNsZWFuSlNPTlN0cmluZyhKU09OLnN0cmluZ2lmeShtaW5lZEVsZW1lbnRzT2JqZWN0KSlcbiAgICAgICAgc3RyID0gJ1BBUlRJQ0xFUyBNSU5FRCA8YnI+PGJyPicgKyBzdHJcbiAgICAgICAgdGhpcy5zZXQoc3RyLCAnbWluaW5nLXN0YXR1cycpXG4gICAgfVxuXG4gICAgY2xlYW5KU09OU3RyaW5nKHN0cikge1xuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXCIvZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC86L2csICcgJylcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL3svZywgJycpXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC99L2csICcnKVxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvLC9nLCAnPGJyPicpXG5cbiAgICAgICAgcmV0dXJuIHN0clxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbiwgZWxlbWVudElELCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJRCkuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICAgICAgfSwgZGVsYXkpXG4gICAgfVxuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgSW52ZW50b3J5RGlzcGxheVxuIiwiY2xhc3MgTGFuZHNjYXBlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB0aGlzLmZlYXR1cmVzKClcbiAgICAgICAgdGhpcy5iYXJlID0gdGhpcy5iYXJlKClcbiAgICB9XG5cbiAgICBmZWF0dXJlcygpIHtcbiAgICAgICAgY29uc3QgcGVyaW9kID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJy4nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICd0aGUgYWlyIGlzIGNob2tlZCB3aXRoIGR1c3QsIHN0YXRpYywgd2lmaScsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjUsXG4gICAgICAgICAgICBjbHM6ICdwZXJpb2QnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBjaHJvbWU6IDE1LFxuICAgICAgICAgICAgICAgIGxlYWQ6IDMwLFxuICAgICAgICAgICAgICAgIHN0eXJvZm9hbTogMzAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBzaWxpY29uOiAxMCxcbiAgICAgICAgICAgICAgICBjZXJhbWljOiAxMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21tYSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcsJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnc3ByYXdsIG9mIHNtYXJ0IGhvbWVzLCBjdWwtZGUtc2FjcywgbGFuZXdheXMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDI2LFxuICAgICAgICAgICAgY2xzOiAnY29tbWEnLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgY29wcGVyOiAxMCxcbiAgICAgICAgICAgICAgICBtZXJjdXJ5OiAxMCxcbiAgICAgICAgICAgICAgICBsYXRleDogMTUsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgaHlkcm9jYXJib25zOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbWljb2xvbiA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICc7JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAncm93cyBvZiBncmVlbmhvdXNlczogc29tZSBzaGF0dGVyZWQgYW5kIGJhcnJlbiwgb3RoZXJzIG92ZXJncm93bicsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMjQsXG4gICAgICAgICAgICBjbHM6ICdzZW1pY29sb24nLFxuICAgICAgICAgICAgcGFydGljbGVzOiB7XG4gICAgICAgICAgICAgICAgaXJvbjogMzAsXG4gICAgICAgICAgICAgICAgd29vZDogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIGJvbmU6IDEwLFxuICAgICAgICAgICAgICAgIGFjcnlsaWM6IDIwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2FyYm9uOiAyMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTBcblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdyYXZlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJ14nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhIHNoaW1tZXJpbmcgZmllbGQgb2Ygc29sYXIgcGFuZWxzLCBicm9rZW4gYW5kIGNvcnJvZGVkJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMixcbiAgICAgICAgICAgIGNsczogJ2dyYXZlJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNvcHBlcjogMTAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgYWNyeWxpYzogMjAsXG4gICAgICAgICAgICAgICAgZmliZXI6IDEwLFxuICAgICAgICAgICAgICAgIG96b25lOiAxNSxcbiAgICAgICAgICAgICAgICBiZW56ZW5lOiAyMCxcbiAgICAgICAgICAgICAgICBnbGFzczogMzAsXG4gICAgICAgICAgICAgICAgY2VyYW1pYzogMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJ0aWNsZUFtb3VudDogMTAsXG4gICAgICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwXG5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhc3RlcmlzayA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcqJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnaG9sbG93IHVzZXJzIGphY2sgaW4gYXQgdGhlIGRhdGFodWJzJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAyMCxcbiAgICAgICAgICAgIGNsczogJ2FzdGVyaXNrJyxcbiAgICAgICAgICAgIHBhcnRpY2xlczoge1xuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBhY3J5bGljOiAyMCxcbiAgICAgICAgICAgICAgICBiZW56ZW5lOiAyMCxcbiAgICAgICAgICAgICAgICBzaWxpY29uOiAxMCxcbiAgICAgICAgICAgICAgICBjYXJib246IDIwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGljbGVBbW91bnQ6IDEwLFxuICAgICAgICAgICAgbWF4UGFydGljbGVzOiAxMFxuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwZXJpb2QsIGNvbW1hLCBzZW1pY29sb24sIHNlbWljb2xvbiwgYXN0ZXJpc2ssIGFzdGVyaXNrLCBncmF2ZSwgZ3JhdmVdXG4gICAgfVxuXG4gICAgYmFyZSgpIHtcbiAgICAgICAgY29uc3QgYmFyZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmbmJzcDsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjb25jcmV0ZSBhbmQgdHdpc3RlZCByZWJhciBzdHJldGNoIHRvIHRoZSBob3Jpem9uJyxcbiAgICAgICAgICAgIGNsczogJ2JsYW5rJyxcbiAgICAgICAgICAgIHBhcnRpY2xlQW1vdW50OiAxMCxcbiAgICAgICAgICAgIG1heFBhcnRpY2xlczogMTAsXG4gICAgICAgICAgICBwYXJ0aWNsZXM6IHtcbiAgICAgICAgICAgICAgICBpcm9uOiAzMCxcbiAgICAgICAgICAgICAgICBjb3BwZXI6IDEwLFxuICAgICAgICAgICAgICAgIGNocm9tZTogMTUsXG4gICAgICAgICAgICAgICAgbGVhZDogMzAsXG4gICAgICAgICAgICAgICAgbWVyY3VyeTogMTAsXG4gICAgICAgICAgICAgICAgc3R5cm9mb2FtOiAzMCxcbiAgICAgICAgICAgICAgICBib25lOiAxMCxcbiAgICAgICAgICAgICAgICBoeWRyb2NhcmJvbnM6IDE1LFxuICAgICAgICAgICAgICAgIHVyYW5pdW06IDEwLFxuICAgICAgICAgICAgICAgIGNhcmJvbjogMjBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXJlXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYW5kc2NhcGVEYXRhXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuaW1wb3J0IE1hcEdlbmVyYXRvciBmcm9tICcuL01hcEdlbmVyYXRvcidcblxuY2xhc3MgTWFwIHtcbiAgICBjb25zdHJ1Y3RvcihtYXBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgY29uc3RydWN0b3InLCBtYXBEYXRhKVxuXG4gICAgICAgIHRoaXMubWFwID0gbWFwRGF0YVxuICAgICAgICB0aGlzLmNvbCA9IE1hcC5nZXRDb2wobWFwRGF0YSlcbiAgICAgICAgdGhpcy5yb3cgPSBNYXAuZ2V0Um93KG1hcERhdGEpXG5cbiAgICAgICAgdGhpcy5pdGVtc09uTWFwID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDb2wobWFwRGF0YSkge1xuICAgICAgICByZXR1cm4gbWFwRGF0YS5sZW5ndGhcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Um93KG1hcERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1hcERhdGFbMF0ubGVuZ3RoXG4gICAgfVxuXG4gICAgc3RhdGljIGdlbmVyYXRlKHsgY29sLCByb3cgfSkge1xuICAgICAgICBjb25zdCBtYXBHZW5lcmF0b3IgPSBuZXcgTWFwR2VuZXJhdG9yKClcblxuICAgICAgICByZXR1cm4gbWFwR2VuZXJhdG9yLmdlbmVyYXRlKHsgY29sLCByb3d9KVxuICAgIH1cblxuICAgIGdldE1hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwXG4gICAgfVxuXG4gICAgZ2V0TWFwQ2VudGVyKCkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IodGhpcy5jb2wvMiksIE1hdGguZmxvb3IodGhpcy5yb3cvMildXG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tTWFwTG9jYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBbVXRpbGl0eS5yYW5kb21pemUodGhpcy5yb3cgLSAxKSwgVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKV1cbiAgICB9XG5cbiAgICBzZXRDaGFyYWN0ZXIoY2hhcmFjdGVyKSB7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyID0gY2hhcmFjdGVyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLnNldE1hcCh0aGlzLm1hcClcbiAgICB9XG5cbiAgICBzZXRJdGVtcyhpdGVtcykge1xuICAgICAgICBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21NYXBMb2NhdGlvbiA9IHRoaXMuZ2V0UmFuZG9tTWFwTG9jYXRpb24oKVxuICAgICAgICAgICAgaXRlbS5zZXRPbk1hcCh0aGlzLm1hcCwgcmFuZG9tTWFwTG9jYXRpb24pXG4gICAgICAgICAgICBpdGVtLmNyZWF0ZUluaXRpYWxDaGlsZEVsZW1lbnQoJ2l0ZW0tbGF5ZXInKSAgLy8gbW92ZWQgY2hpbGRFbGVtZW50IGNyZWF0aW9uIG91dCBvZiAnc2V0T25NYXAnXG4gICAgICAgICAgICB0aGlzLnB1c2hJdGVtKGl0ZW0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHVzaEl0ZW0oaXRlbSkge1xuICAgICAgICB0aGlzLml0ZW1zT25NYXAucHVzaChpdGVtKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgTGFuZHNjYXBlRGF0YSBmcm9tICcuL0xhbmRzY2FwZURhdGEnXG5pbXBvcnQgeyBESVJFQ1RJT05TIH0gZnJvbSAnLi9Db25zdGFudHMnXG5cblxuY2xhc3MgTWFwR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBnZW5lcmF0ZSh7IGNvbCwgcm93IH0pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYXRpbmcgbWFwJylcbiAgICAgICAgdGhpcy5jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5yb3cgPSByb3dcblxuICAgICAgICB0aGlzLmxhbmRzY2FwZVNlZWRzID0gbmV3IExhbmRzY2FwZURhdGEoKVxuICAgICAgICBjb25zdCBncmlkID0gdGhpcy5tYWtlR3JpZCgpXG4gICAgICAgIGNvbnN0IHNlZWRlZEdyaWQgPSB0aGlzLnNlZWQoZ3JpZClcbiAgICAgICAgdGhpcy5zZWVkZWRHcmlkID0gc2VlZGVkR3JpZFxuICAgICAgICB0aGlzLmdyb3coKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgZ2VuZXJhdGVkJylcblxuICAgICAgICByZXR1cm4gdGhpcy5zZWVkZWRHcmlkXG4gICAgfVxuXG4gICAgbWFrZUdyaWQoKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IHRoaXMuY29sXG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMucm93XG4gICAgICAgIGNvbnN0IGdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvdzsgaSsrKSB7XG4gICAgICAgICAgICBncmlkW2ldID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBncmlkW2ldLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBzZWVkKGdyaWQpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tRWxlbWVudHMgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2V0TnVtYmVyT2ZFbGVtZW50U2VlZHMoKTsgaSsrKSB7XG4gICAgICAgICAgICByYW5kb21FbGVtZW50cy5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuZmVhdHVyZXNbVXRpbGl0eS5yYW5kb21pemUodGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlcy5sZW5ndGgpXSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWVkcyA9IHRoaXMuZ2VuZXJhdGVTZWVkTG9jYXRpb25zKHJhbmRvbUVsZW1lbnRzKVxuICAgICAgICBzZWVkcy5tYXAoc2VlZCA9PiBncmlkW3NlZWQueV1bc2VlZC54XSA9IHNlZWQpXG4gICAgICAgIHRoaXMuX3NlZWRzID0gc2VlZHNcbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpIHtcbiAgICAgICAgLy8gIHJldHVybiAxICAgICAgICAvLyB0ZXN0IHNldHRpbmdcbiAgICAgICAgLy8gcmV0dXJuICgodGhpcy5jb2wgKiB0aGlzLnJvdykgLyAodGhpcy5fY29sICsgdGhpcy5yb3cpKSAgLy8gc3BhcnNlIGluaXRpYWwgc2VlZGluZ1xuICAgICAgICByZXR1cm4gKHRoaXMuY29sICsgdGhpcy5yb3cpICAvLyByaWNoIGluaXRpYWwgc2VlZGluZ1xuICAgIH1cblxuICAgIGdlbmVyYXRlU2VlZExvY2F0aW9ucyhyYW5kb21FbGVtZW50cykge1xuICAgICAgICByZXR1cm4gcmFuZG9tRWxlbWVudHMubWFwKGVsID0+IHtcbiAgICAgICAgICAgIGVsLnggPSBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLnJvdyAtIDEpXG4gICAgICAgICAgICBlbC55ID0gVXRpbGl0eS5yYW5kb21pemUodGhpcy5jb2wgLSAxKVxuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ3JvdygpIHtcbiAgICAgICAgbGV0IHNlZWRzID0gdGhpcy5fc2VlZHNcbiAgICAgICAgbGV0IG1hcFBvcHVsYXRlZCA9IGZhbHNlXG5cbiAgICAgICAgd2hpbGUgKCFtYXBQb3B1bGF0ZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ29vZFNlZWRzID0gW11cbiAgICAgICAgICAgIHRoaXMuZ29vZFNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB0aGlzLm5leHRHZW5lcmF0aW9uU2VlZHMoc2VlZHMpLmZvckVhY2goKHNlZWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1NlZWQoc2VlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZFNlZWRzLnB1c2godGhpcy5jaGVja1NlZWQoc2VlZCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGZvciAobGV0IGdvb2RTZWVkIG9mIGdvb2RTZWVkcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPSBnb29kU2VlZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5jb3VudFVuc2VlZGVkTG9jYXRpb25zKCkpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3VudFVuc2VlZGVkTG9jYXRpb25zKCkge1xuICAgICAgICBjb25zdCBmbGF0dGVuZWRHcmlkID0gW10uY29uY2F0LmFwcGx5KFtdLCB0aGlzLnNlZWRlZEdyaWQpXG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSBvZiBmbGF0dGVuZWRHcmlkKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICAgICAgY291bnQrK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudFxuICAgIH1cblxuICAgIGNoZWNrU2VlZChzZWVkKSB7XG4gICAgICAgIGxldCBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICBpZiAoKHNlZWQueCA8IHRoaXMuY29sICYmIHNlZWQueCA+PSAwKSAmJlxuICAgICAgICAgICAgKHNlZWQueSA8IHRoaXMucm93ICYmIHNlZWQueSA+PSAwKSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW3NlZWQueV1bc2VlZC54XSAhPT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nb29kU2VlZHMuZm9yRWFjaChnb29kU2VlZCA9PiB7XG4gICAgICAgICAgICBpZiAoKHNlZWQueCA9PT0gZ29vZFNlZWQueCkgJiZcbiAgICAgICAgICAgICAgICAoc2VlZC55ID09PSBnb29kU2VlZC55KSkge1xuICAgICAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHNlZWRTdWNjZWVkcykge1xuICAgICAgICAgICAgcmV0dXJuIHNlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKSB7XG4gICAgICAgIGNvbnN0IG5leHRHZW5TZWVkcyA9IFtdXG4gICAgICAgIHNlZWRzLmZvckVhY2goKG9yaWdpbmFsU2VlZCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIGluIERJUkVDVElPTlMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb25WYWx1ZXMgPSBESVJFQ1RJT05TW2RpcmVjdGlvbl1cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0R2VuU2VlZCA9IE9iamVjdC5hc3NpZ24oe30sIG9yaWdpbmFsU2VlZClcbiAgICAgICAgICAgICAgICBpZiAoVXRpbGl0eS5wcm9iYWJpbGl0eShuZXh0R2VuU2VlZC5wcm9iYWJpbGl0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGRpcmVjdGlvblZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZC54ID0gb3JpZ2luYWxTZWVkLnggKyBkaXJlY3Rpb25WYWx1ZXNba2V5XVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueSA9IG9yaWdpbmFsU2VlZC55ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXh0R2VuU2VlZHMucHVzaChuZXh0R2VuU2VlZClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMubmV4dEdlblNlZWRzID0gbmV4dEdlblNlZWRzXG4gICAgICAgIHJldHVybiBuZXh0R2VuU2VlZHNcbiAgICB9XG5cbiAgICAvLyBwcm9iYWJpbGl0eShwZXJjZW50YWdlKSB7XG4gICAgLy8gICAgIGNvbnN0IHByb2JhYmlsaXR5QXJyYXkgPSBbXVxuICAgIC8vICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcmNlbnRhZ2U7IGkrKykge1xuICAgIC8vICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKHRydWUpXG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAgLSBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAvLyAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaChmYWxzZSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICByZXR1cm4gcHJvYmFiaWxpdHlBcnJheVtVdGlsaXR5LnJhbmRvbWl6ZSgxMDApXVxuICAgIC8vIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFwR2VuZXJhdG9yXG4iLCJpbXBvcnQgUmVuZGVyYWJsZSBmcm9tICcuL1JlbmRlcmFibGUnXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5pbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5cblxuY2xhc3MgTW92ZWFibGUgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIG1vdmVtZW50IGFuZCBwbGFjZW1lbnQgb24gdGhlIGdyaWRcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgc2V0TWFwKG1hcCkge1xuICAgICAgICB0aGlzLm1hcCA9IG1hcFxuICAgIH1cblxuICAgIHNldEluaXRpYWxHcmlkSW5kaWNlcyhncmlkSW5kaWNlcykge1xuICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gZ3JpZEluZGljZXNcbiAgICB9XG5cbiAgICBnZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cblxuICAgICAgICByZXR1cm4geyB4LCB5IH1cbiAgICB9XG5cbiAgICB1cGRhdGVHcmlkSW5kaWNlcyhhY3RvciwgbW92ZSkge1xuICAgICAgICBjb25zdCBuZXdHcmlkSW5kaWNlcyA9IFt0aGlzLmdyaWRJbmRpY2VzWzBdICsgbW92ZS54LCB0aGlzLmdyaWRJbmRpY2VzWzFdICsgbW92ZS55XVxuICAgICAgICBsZXQgbG9jYXRpb24gPSAnJ1xuICAgICAgICBpZiAodGhpcy5jaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSkge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLm1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICB0aGlzLmdyaWRJbmRpY2VzID0gbmV3R3JpZEluZGljZXNcbiAgICAgICAgICAgIGFjdG9yLnggPSBuZXdHcmlkSW5kaWNlc1swXVxuICAgICAgICAgICAgYWN0b3IueSA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2NhdGlvbiA9IHRoaXMubWFwW3RoaXMuZ3JpZEluZGljZXNbMV0sIHRoaXMuZ3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAoYWN0b3IubmFtZSA9PT0gJ2NoYXJhY3RlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ3N0YXR1cycsIFwieW91J3ZlIHJlYWNoZWQgdGhlIG1hcCdzIGVkZ2VcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYXRpb25cbiAgICB9XG5cbiAgICBjaGVja0dyaWRJbmRpY2VzKG5ld0dyaWRJbmRpY2VzKSB7XG4gICAgICAgIGxldCBsb2NhdGlvbk9uR3JpZCA9IGZhbHNlXG5cbiAgICAgICAgY29uc3QgeCA9IG5ld0dyaWRJbmRpY2VzWzFdXG4gICAgICAgIGNvbnN0IHkgPSBuZXdHcmlkSW5kaWNlc1swXVxuXG4gICAgICAgIGlmICh0aGlzLm1hcFt4XSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLm1hcFt4XVt5XVxuICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb25PbkdyaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbG9jYXRpb25PbkdyaWRcbiAgICB9XG5cbiAgICBnZXRDU1NIZWlnaHRBbmRXaWR0aCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdCcpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgICAgIGNvbnN0IHdpZHRoID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKVxuICAgICAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH1cbiAgICB9XG5cbiAgICBnZXRDU1NDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgY3NzID0gdGhpcy5nZXRDU1NIZWlnaHRBbmRXaWR0aCgpXG4gICAgICAgIGNvbnN0IGNzc0xlZnQgPSB0aGlzLmdyaWRJbmRpY2VzWzBdICogY3NzLmhlaWdodFxuICAgICAgICBjb25zdCBjc3NUb3AgPSB0aGlzLmdyaWRJbmRpY2VzWzFdICogY3NzLndpZHRoXG4gICAgICAgIHJldHVybiB7IGNzc0xlZnQsIGNzc1RvcCB9XG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IE1vdmVhYmxlXG4iLCJjbGFzcyBSZW5kZXJhYmxlIHsgIC8vIGdlbmVyYWxpemVkIHJlbmRlciBmdW5jdGlvbnMgZm9yIFNjZW5lcnksIENoYXJhY3RlclxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHNldExheWVyKGxheWVyKSB7XG4gICAgICAgIHRoaXMubGF5ZXIgPSBsYXllclxuICAgIH1cblxuICAgIGdldExheWVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXllclxuICAgIH1cblxuICAgIHJlbmRlclNwYW4odW5pdCkge1xuICAgICAgICBsZXQgY2xzID0gJydcbiAgICAgICAgbGV0IGVsZW1lbnQgPSAnJm5ic3A7J1xuICAgICAgICBsZXQgc3R5bGUgPSAnJ1xuICAgICAgICBpZiAodW5pdCkge1xuICAgICAgICAgICAgY2xzID0gdW5pdC5jbHNcbiAgICAgICAgICAgIGVsZW1lbnQgPSB1bml0LmVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bml0LnRvcCAmJiB1bml0LmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHt1bml0LnRvcH1weDsgbGVmdDogJHt1bml0LmxlZnR9cHhgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cInVuaXQgJHtjbHN9XCIgc3R5bGU9XCIke3N0eWxlfVwiPiR7ZWxlbWVudH08L3NwYW4+YFxuICAgIH1cblxuICAgIHJlbmRlckRpdihpdGVtKSB7XG4gICAgICAgIGxldCBkaXYgPSAnJ1xuICAgICAgICBsZXQgZWxlbWVudCA9ICcmbmJzcDsnXG4gICAgICAgIGxldCBzdHlsZSA9ICcnXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICBkaXYgPSBpdGVtLmRpdlxuICAgICAgICAgICAgZWxlbWVudCA9IGl0ZW0uZWxlbWVudFxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnRvcCAmJiBpdGVtLmxlZnQpIHtcbiAgICAgICAgICAgIHN0eWxlID0gYHRvcDogJHtpdGVtLnRvcH1weDsgbGVmdDogJHtpdGVtLmxlZnR9cHg7IHBvc2l0aW9uOiBhYnNvbHV0ZWBcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5vZmZNYXApIHtcbiAgICAgICAgICAgIHN0eWxlICs9IGA7IGRpc3BsYXk6IG5vbmVgXG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGl0ZW0ubWluaW5nKSB7XG4gICAgICAgICAgICBjYXNlICdmdWxsJzpcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgOyBhbmltYXRpb246IG1pbmluZy1mdWxsIDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdoYWxmJzpcbiAgICAgICAgICAgICAgICBzdHlsZSArPSBgOyBhbmltYXRpb246IG1pbmluZy1oYWxmIDNzIGluZmluaXRlYFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgICAgICAgc3R5bGUgKz0gYDsgYW5pbWF0aW9uOiBtaW5pbmctZW1wdHkgM3MgaW5maW5pdGVgXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBgPGRpdiBpZD1cIiR7ZGl2fVwiIHN0eWxlPVwiJHtzdHlsZX1cIj4ke2VsZW1lbnR9PC9kaXY+YFxuICAgIH1cblxuICAgIHVwZGF0ZVNwYW4oYWN0b3IpIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLnJlbmRlclNwYW4oYWN0b3IpKVxuICAgIH1cblxuICAgIHVwZGF0ZURpdihpdGVtKSB7XG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5yZW5kZXJEaXYoaXRlbSkpXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXllcklkKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cbiAgICBjcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KHBhcmVudExheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJlbnRMYXllcklkKVxuICAgICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpIC8vIGNyZWF0ZXMgZGl2IGlkIHdpdGhpbiBlbmNsb3NpbmcgZGl2IC4uLlxuICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUmVuZGVyYWJsZVxuIiwiaW1wb3J0IFJlbmRlcmFibGUgZnJvbSAnLi9SZW5kZXJhYmxlJ1xuXG5cbmNsYXNzIFNjZW5lcnkgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIFNjZW5lcnktc3BlY2lmaWMgcmVuZGVyaW5nIGZ1bmN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMubWFwID0gbWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIoKVxuICAgICAgICBjb25zb2xlLmxvZygnc2NlbmVyeSByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyTGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLm1hcC5tYXAoYXJyID0+IHsgcmV0dXJuIGFyci5zbGljZSgpIH0pXG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5jcmVhdGVMYXllcihncmlkKSlcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUxheWVyKGdyaWQpIHtcbiAgICAgICAgY29uc3Qgc2NlbmVyeUdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0l0ZW1zID0gZ3JpZFtpXVxuICAgICAgICAgICAgbGV0IHJvdyA9ICcnICAvLyBwb3NzaWJseSBtYWtlIGVhY2ggcm93IGEgdGFibGU/XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm93ICs9IHRoaXMucmVuZGVyU3Bhbihyb3dJdGVtc1tpXSkgLy8gYWRkIHJlbmRlcmVkIGl0ZW1zIHRvIHRoZSBncmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzY2VuZXJ5R3JpZC5wdXNoKHJvdylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2NlbmVyeUdyaWRcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGNvbnN0IGdyaWRUb0hUTUwgPSBsYXllci5qb2luKCc8YnIgLz4nKSAgLy8gdXNpbmcgSFRNTCBicmVha3MgZm9yIG5vd1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYW5kc2NhcGUtbGF5ZXInKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSBncmlkVG9IVE1MXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lcnlcbiIsImltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9ldmVudE1hbmFnZXInXG5cbmNsYXNzIFN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMudXBkYXRlLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnZGlzcGxheS1pdGVtJywgdGhpcy5kaXNwbGF5SXRlbSwgdGhpcylcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ3N0YXR1cycsIHRoaXMuZGVmYXVsdCwgdGhpcylcbiAgICB9XG5cbiAgICB1cGRhdGUobG9jYXRpb24pIHtcbiAgICAgICAgdGhpcy5zZXQobG9jYXRpb24uZGVzY3JpcHRpb24pXG4gICAgfVxuXG4gICAgYmVnaW5zV2l0aFZvd2VsKHRleHQpIHtcbiAgICAgICAgY29uc3QgZmlyc3RMZXR0ZXIgPSB0ZXh0WzBdXG4gICAgICAgIGNvbnN0IHZvd2VscyA9IFsnYScsICdlJywgJ2knLCAnbycsICd1J11cbiAgICAgICAgbGV0IGJlZ2luc1dpdGhWb3dlbCA9IGZhbHNlXG4gICAgICAgIHZvd2Vscy5mb3JFYWNoKHZvd2VsID0+IHtcbiAgICAgICAgICAgIGlmIChmaXJzdExldHRlciA9PT0gdm93ZWwpIHtcbiAgICAgICAgICAgICAgICBiZWdpbnNXaXRoVm93ZWwgPSB0cnVlXG4gICAgICAgICAgICB9fSlcbiAgICAgICAgcmV0dXJuIGJlZ2luc1dpdGhWb3dlbFxuICAgIH1cblxuICAgIGRpc3BsYXlJdGVtKGl0ZW1OYW1lKSB7XG4gICAgICAgIGNvbnN0IGJlZ2luc1dpdGhWb3dlbCA9IHRoaXMuYmVnaW5zV2l0aFZvd2VsKGl0ZW1OYW1lKVxuICAgICAgICBsZXQgdGV4dCA9ICcnXG4gICAgICAgIGlmIChiZWdpbnNXaXRoVm93ZWwpIHtcbiAgICAgICAgICAgIHRleHQgPSBgeW91IHNlZSBhbiAke2l0ZW1OYW1lfSBoZXJlYFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dCA9IGB5b3Ugc2VlIGEgJHtpdGVtTmFtZX0gaGVyZWBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldCh0ZXh0LCAxMClcbiAgICB9XG5cbiAgICBkZWZhdWx0KHRleHQpIHtcbiAgICAgICAgdGhpcy5zZXQodGV4dCwgMTApXG4gICAgfVxuXG4gICAgc2V0KGRlc2NyaXB0aW9uLCBkZWxheT0wKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKS5pbm5lckhUTUwgPSBkZXNjcmlwdGlvblxuICAgICAgICB9LCBkZWxheSlcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgU3RhdHVzXG4iLCJpbXBvcnQgVXRpbGl0eSBmcm9tICcuL1V0aWxpdHknXG5cblxuY2xhc3MgVXNlcklucHV0IHtcbiAgICBjb25zdHJ1Y3RvcihrZXlBY3Rpb25NYXApIHtcbiAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXAgPSBrZXlBY3Rpb25NYXBcblxuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSB0aGlzLnRyeUFjdGlvbkZvckV2ZW50LmJpbmQodGhpcylcbiAgICB9XG5cbiAgICB0cnlBY3Rpb25Gb3JFdmVudChldmVudCkge1xuICAgICAgICBpZiAoIVV0aWxpdHkuY29udGFpbnModGhpcy5rZXlBY3Rpb25NYXAsIGV2ZW50LmtleUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgbm90IGEgdmFsaWQga2V5Y29kZTogJHtldmVudC5rZXlDb2RlfWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmtleUFjdGlvbk1hcFtldmVudC5rZXlDb2RlXSgpXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXNlcklucHV0XG4iLCJsZXQgaWQgPSAwXG5cbmZ1bmN0aW9uIGdlbmVyYXRlSWQoKSB7XG4gICAgaWQgPSBpZCArIDFcbiAgICByZXR1cm4gaWRcbn1cblxuY2xhc3MgVXRpbGl0eSB7XG4gICAgc3RhdGljIGNvbnRhaW5zKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuaW5kZXhPZihTdHJpbmcocHJvcGVydHkpKSAhPT0gLTFcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RyaW5nVG9OdW1iZXIoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcubWF0Y2goL1xcZCsvKVswXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb21pemUobXVsdCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXVsdClcbiAgICB9XG5cbiAgICBzdGF0aWMgSWQoKSB7XG4gICAgICAgIHJldHVybiBnZW5lcmF0ZUlkKClcbiAgICB9XG5cbiAgICBzdGF0aWMgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgVXRpbGl0eVxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudHNMaXN0ID0gW10gICAgICAgIC8vIGNyZWF0ZSBhcnJheSBvZiBldmVudHNcbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoZXZlbnQsIGZuLCB0aGlzVmFsdWUsIG9uY2U9ZmFsc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7ICAgLy8gaWYgbm8gdGhpc1ZhbHVlIHByb3ZpZGVkLCBiaW5kcyB0aGUgZm4gdG8gdGhlIGZuPz9cbiAgICAgICAgICAgIHRoaXNWYWx1ZSA9IGZuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50c0xpc3QucHVzaCh7ICAgICAgLy8gY3JlYXRlIG9iamVjdHMgbGlua2luZyBldmVudHMgKyBmdW5jdGlvbnMgdG8gcGVyZm9ybVxuICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LCAgICAgICAgICAgLy8gcHVzaCBlbSB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGZuOiBmbixcbiAgICAgICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgICAgICB0aGlzVmFsdWU6IHRoaXNWYWx1ZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHVuc3Vic2NyaWJlKGV2ZW50KSB7XG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMuZXZlbnRzTGlzdC5zcGxpY2UoaSwgMSlcbiAgICAvLyAgICAgICAgICAgICBicmVha1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgcHVibGlzaChldmVudCwgYXJnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNMaXN0W2ldLmV2ZW50ID09PSBldmVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdGhpc1ZhbHVlLCBmbiwgb25jZSB9ID0gdGhpcy5ldmVudHNMaXN0W2ldXG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzVmFsdWUsIGFyZylcbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzTGlzdFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBuZXcgRXZlbnRNYW5hZ2VyKClcbiIsImltcG9ydCBNYXAgZnJvbSAnLi9NYXAnXG5pbXBvcnQgU2NlbmVyeSBmcm9tICcuL1NjZW5lcnknXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gJy4vQ2hhcmFjdGVyJ1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICcuL2V2ZW50TWFuYWdlcidcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi9TdGF0dXMnXG5pbXBvcnQgVXNlcklucHV0IGZyb20gJy4vVXNlcklucHV0J1xuaW1wb3J0IEJsdWVwcmludHMgZnJvbSAnLi9CbHVlcHJpbnRzJ1xuaW1wb3J0IGludmVudG9yeSBmcm9tICcuL2ludmVudG9yeSdcbmltcG9ydCB7IGdlbmVyYXRlSXRlbXMgfSBmcm9tICcuL2l0ZW1zJ1xuaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUnXG5pbXBvcnQgSW52ZW50b3J5RGlzcGxheSBmcm9tICcuL0ludmVudG9yeURpc3BsYXknXG5cbmNvbnN0IENPTCA9IDYwXG5jb25zdCBST1cgPSA2MFxuY29uc3QgSVRFTV9OVU0gPSA1XG5cbmNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmluaXRHYW1lKClcbiAgICB9XG5cbiAgICBpbml0R2FtZSgpIHtcbiAgICAgICAgbGV0IHNldHRpbmdzXG5cbiAgICAgICAgaWYgKHRoaXMuaGFzR2FtZUluUHJvZ3Jlc3MoKSkge1xuICAgICAgICAgICAgc2V0dGluZ3MgPSB0aGlzLnJlc3VtZVNldHRpbmdzKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldHRpbmdzID0gdGhpcy5nZW5lcmF0ZVNldHRpbmdzKClcbiAgICAgICAgfVxuXG5cbiAgICAgICAgY29uc3QgbW92ZWQgPSAobG9jYXRpb24pID0+IHtjb25zb2xlLmxvZygnbG9jYXRpb24nLCBsb2NhdGlvbil9XG4gICAgICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoJ21vdmVkLXRvJywgbW92ZWQpXG5cbiAgICAgICAgdGhpcy5sb2FkU2V0dGluZ3Moc2V0dGluZ3MpXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKClcbiAgICB9XG5cbiAgICBoYXNHYW1lSW5Qcm9ncmVzcygpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmhhcygnbWFwJylcbiAgICB9XG5cbiAgICByZXN1bWVTZXR0aW5ncygpIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBtYXBEYXRhOiBzdG9yZS5nZXQoJ21hcCcpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3NcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVNldHRpbmdzKCkge1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHt9XG5cbiAgICAgICAgc2V0dGluZ3MubWFwRGF0YSA9IE1hcC5nZW5lcmF0ZSh7IGNvbDogQ09MLCByb3c6ICBST1cgfSlcblxuICAgICAgICBzdG9yZS5zZXQoJ21hcCcsIHNldHRpbmdzLm1hcERhdGEpXG5cbiAgICAgICAgcmV0dXJuIHNldHRpbmdzXG4gICAgfVxuXG4gICAgbG9hZFNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgICAgIGNvbnN0IGJsdWVwcmludCA9IHRoaXMuYmx1ZXByaW50ID0gQmx1ZXByaW50cy5yYW5kb20oKVxuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMgPSBnZW5lcmF0ZUl0ZW1zKElURU1fTlVNKVxuXG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMuc3RhdHVzID0gbmV3IFN0YXR1cygpXG4gICAgICAgIGNvbnN0IGludmVudG9yeURpc3BsYXkgPSB0aGlzLmludmVudG9yeURpc3BsYXkgPSBuZXcgSW52ZW50b3J5RGlzcGxheSgpXG5cbiAgICAgICAgY29uc3QgbWFwID0gdGhpcy5tYXAgPSBuZXcgTWFwKHNldHRpbmdzLm1hcERhdGEpXG4gICAgICAgIGNvbnN0IHNjZW5lcnkgPSB0aGlzLnNjZW5lcnkgPSBuZXcgU2NlbmVyeShtYXApXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHRoaXMuY2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcihtYXApXG5cbiAgICAgICAgbWFwLnNldEl0ZW1zKGl0ZW1zKVxuICAgICAgICBtYXAuc2V0Q2hhcmFjdGVyKGNoYXJhY3RlcilcblxuICAgICAgICB0aGlzLmludmVudG9yeSA9IGludmVudG9yeVxuICAgICAgICB0aGlzLmludmVudG9yeS5hZGQoYmx1ZXByaW50KVxuXG4gICAgICAgIHRoaXMuaW5wdXQgPSB0aGlzLmluaXRVc2VySW5wdXQoY2hhcmFjdGVyKVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzZXQgbWFwIScpXG5cbiAgICAgICAgc3RvcmUuY2xlYXIoKVxuXG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgIH1cblxuICAgIGluaXRVc2VySW5wdXQoY2hhcmFjdGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgVXNlcklucHV0KHtcbiAgICAgICAgICAgICc4Mic6IHRoaXMucmVzZXQuYmluZCh0aGlzKSwgLy8gKHIpIHJlc2V0IG1hcFxuICAgICAgICAgICAgJzM4JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdub3J0aCcpLFxuICAgICAgICAgICAgJzM3JzogY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICd3ZXN0JyksXG4gICAgICAgICAgICAnMzknOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ2Vhc3QnKSxcbiAgICAgICAgICAgICc0MCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnc291dGgnKSxcbiAgICAgICAgICAgICc4NCc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ3Rha2UnKSwgLy8gKHQpYWtlIGl0ZW1cbiAgICAgICAgICAgIC8vICc3Myc6IGNoYXJhY3Rlci5nZXRBY3Rpb24oJ2NoZWNrSW52ZW50b3J5JyksIC8vIGNoZWNrIChpKW52ZW50b3J5XG4gICAgICAgICAgICAnNzcnOiBjaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtaW5lJykgLy8gZGVwbG95IHBhcnRpY2xlIChtKWluZXJcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGFydEdhbWUoKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzLnNldCgneW91IHdha2UgdXAnKVxuICAgICAgICB0aGlzLnN0YXR1cy5zZXQoYHlvdSBhcmUgY2FycnlpbmcgJHt0aGlzLmJsdWVwcmludC5uYW1lfWAsIDQwMDApXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBHYW1lKCk7XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBJbnZlbnRvcnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRzID0gW11cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnYWRkLWludmVudG9yeScsIHRoaXMuYWRkLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgncmVtb3ZlLWludmVudG9yeScsIHRoaXMucmVtb3ZlLCB0aGlzKVxuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZSgnYWRkLW1pbmVkJywgdGhpcy5hZGRNaW5lZCwgdGhpcylcblxuICAgICAgICB0aGlzLnN0b3JlTWluaW5nID0ge31cbiAgICAgICAgdGhpcy5taW5pbmdTdGF0ZU9iaiA9IHt9XG5cbiAgICB9XG5cbiAgICBhZGQoaXRlbSkge1xuICAgICAgICB0aGlzLmNvbnRlbnRzLnB1c2goaXRlbSlcbiAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH1cblxuICAgIHJlbW92ZShpdGVtKSB7XG4gICAgICAgIGNvbnN0IHRoZUl0ZW0gPSBpdGVtXG4gICAgICAgIHRoaXMuY29udGVudHMuZm9yRWFjaCgoaXRlbSwgaSwgYXJyYXkpID0+IHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gdGhlSXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudHMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ludmVudG9yeSBpdGVtIHJlbW92ZWQnKVxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgICAgICAgIH19KVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5FTS5wdWJsaXNoKCdkaXNwbGF5LWludmVudG9yeScsIHRoaXMuY29udGVudHMpXG4gICAgfVxuXG5cblxuXG5cblxuICAgIGFkZE1pbmVkKGN1cnJlbnRPYmopIHtcbiAgICAgICAgLy8gaWYgc3RhdGUgb2JqZWN0IGRvZXNuJ3QgZXhpc3QsIGFkZCBhbGwgcGFydGljbGVzIHRvIHN0b3JhZ2VcbiAgICAgICAgaWYgKCF0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1pbmluZ1N0YXRlKGN1cnJlbnRPYmopXG4gICAgICAgICAgICB0aGlzLmluY3JlbWVudFN0b3JhZ2UodGhpcy5zdHJpcElEKGN1cnJlbnRPYmopKVxuXG4gICAgICAgIC8vIGlmIGl0IGRvZXMgZXhpc3QsIGNoZWNrIGN1cnIgdnMgc3RhdGUgYW5kIGFkZCBvbmx5IHRoZSByaWdodCBwYXJ0aWNsZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50U3RvcmFnZSh0aGlzLnN0cmlwSUQodGhpcy5jaGVja01pbmluZ1N0YXRlKGN1cnJlbnRPYmopKSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWluaW5nU3RhdGUoY3VycmVudE9iailcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRpc3BsYXlQYXJ0aWNsZXMgPSB0aGlzLnN0b3JlTWluaW5nXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnZGlzcGxheS1taW5lZCcsIGRpc3BsYXlQYXJ0aWNsZXMpXG59XG5cblxuICAgIGNoZWNrTWluaW5nU3RhdGUoY3VycmVudE9iaikge1xuICAgICAgICBjb25zdCBjaGVja2VkT2JqID0ge31cbiAgICAgICAgT2JqZWN0LmtleXMoY3VycmVudE9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKCFjaGVja2VkT2JqW2tleV0pIHtcbiAgICAgICAgICAgICAgICBjaGVja2VkT2JqW2tleV0gPSAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF1ba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF1ba2V5XSA9IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoZWNrZWRPYmpba2V5XSA9IGN1cnJlbnRPYmpba2V5XSAtIHRoaXMubWluaW5nU3RhdGVPYmpbY3VycmVudE9iai5JRF1ba2V5XVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY2hlY2tlZE9ialxuICAgIH1cblxuXG4gICAgaW5jcmVtZW50U3RvcmFnZShwYXJ0aWNsZU9iaikge1xuICAgICAgICBPYmplY3Qua2V5cyhwYXJ0aWNsZU9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0b3JlTWluaW5nW2tleV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlTWluaW5nW2tleV0gPSAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0b3JlTWluaW5nW2tleV0gKz0gcGFydGljbGVPYmpba2V5XVxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgdXBkYXRlTWluaW5nU3RhdGUoY3VycmVudE9iaikge1xuICAgICAgICB0aGlzLm1pbmluZ1N0YXRlT2JqW2N1cnJlbnRPYmouSURdID0gT2JqZWN0LmFzc2lnbih7fSwgY3VycmVudE9iailcbiAgICB9XG5cblxuICAgIHN0cmlwSUQoY3VycmVudE9iaikge1xuICAgICAgICBjb25zdCBwYXJ0aWNsZU9iaiA9IHt9XG4gICAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnRPYmopLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkgIT09ICdJRCcpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZU9ialtrZXldID0gY3VycmVudE9ialtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBwYXJ0aWNsZU9ialxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW52ZW50b3J5XG4iLCJpbXBvcnQgTW92ZWFibGUgZnJvbSAnanMvTW92ZWFibGUnXG5pbXBvcnQgVXRpbGl0eSBmcm9tICdqcy9VdGlsaXR5J1xuaW1wb3J0IGV2ZW50TWFuYWdlciBmcm9tICdqcy9ldmVudE1hbmFnZXInXG5cblxuLy8gY29uc3QgSVRFTVMgPSB7XG4vLyAgICAgbWluZXI6IHtcbi8vICAgICAgICAgbmFtZTogJ3BhcnRpY2xlIG1pbmVyJyxcbi8vICAgICAgICAgdHlwZTogJ2l0ZW0nLFxuLy8gICAgICAgICBlbGVtZW50OiAnfCcsXG4vLyAgICAgICAgIGRlc2NyaXB0aW9uOiAnbWluZXMsIGRpdmlkZXMsIGFuZCBzdG9yZXMgYW1iaWVudCBjaGVtaWNhbCBlbGVtZW50cyBhbmQgbGFyZ2VyIGNvbXBvdW5kcyBmb3VuZCB3aXRoaW4gYSAxMDAgbWV0ZXIgcmFkaXVzLiA5NyUgYWNjdXJhY3kgcmF0ZS4nLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLW1pbmVyJ1xuLy8gICAgIH0sXG4vLyAgICAgcGFyc2VyOiB7XG4vLyAgICAgICAgIG5hbWU6ICdub2lzZSBwYXJzZXInLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICc/Jyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246ICdwcm90b3R5cGUuIHBhcnNlcyBhdG1vc3BoZXJpYyBkYXRhIGZvciBsYXRlbnQgaW5mb3JtYXRpb24uIHNpZ25hbC10by1ub2lzZSByYXRpbyBub3QgZ3VhcmFudGVlZC4nLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLXBhcnNlcidcbi8vICAgICB9LFxuLy8gICAgIGludGVyZmFjZToge1xuLy8gICAgICAgICBuYW1lOiAncHNpb25pYyBpbnRlcmZhY2UnLFxuLy8gICAgICAgICB0eXBlOiAnaXRlbScsXG4vLyAgICAgICAgIGVsZW1lbnQ6ICcmJyxcbi8vICAgICAgICAgZGVzY3JpcHRpb246IGBjb25uZWN0cyBzZWFtbGVzc2x5IHRvIGEgc3RhbmRhcmQtaXNzdWUgYmlvcG9ydC4gZmFjaWxpdGF0ZXMgc3VuZHJ5IGludGVyYWN0aW9ucyBwZXJmb3JtZWQgdmlhIFBTSS1ORVQuYCxcbi8vICAgICAgICAgZGl2OiAnaXRlbS1pbnRlcmZhY2UnXG4vLyAgICAgfSxcbi8vICAgICBwcmludGVyOiB7XG4vLyAgICAgICAgIG5hbWU6ICdtb2xlY3VsYXIgcHJpbnRlcicsXG4vLyAgICAgICAgIHR5cGU6ICdpdGVtJyxcbi8vICAgICAgICAgZWxlbWVudDogJyMnLFxuLy8gICAgICAgICBkZXNjcmlwdGlvbjogJ2dlbmVyYXRlcyBvYmplY3RzIGFjY29yZGluZyB0byBhIGJsdWVwcmludC4gbW9sZWN1bGVzIG5vdCBpbmNsdWRlZC4nLFxuLy8gICAgICAgICBkaXY6ICdpdGVtLXByaW50ZXInXG4vLyAgICAgfVxuLy8gfVxuXG5jbGFzcyBJdGVtIGV4dGVuZHMgTW92ZWFibGUge1xuICAgIGNvbnN0cnVjdG9yKGl0ZW1Db25maWcpIHtcbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIC8vIG1lcmdlIGluIGNvbmZpZyBwcm9wZXJ0aWVzXG4gICAgICAgIC8vIGNvbnN0IHRhcmdldCA9IE9iamVjdC5hc3NpZ24odGhpcywgaXRlbUNvbmZpZylcblxuICAgICAgICAvLyBhZGRpdGlvbmFsIHByb3BlcnRpZXNcbiAgICAgICAgdGhpcy5pZGVudGl0eU51bWJlciA9IFV0aWxpdHkuSWQoKVxuICAgICAgICB0aGlzLnR5cGUgPSAnaXRlbSdcbiAgICAgICAgdGhpcy5vZmZNYXAgPSBmYWxzZVxuICAgICAgICAvLyB0aGlzLmluSW52ZW50b3J5ID0gZmFsc2VcblxuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgc2V0T25NYXAobWFwLCBsb2NhdGlvbikge1xuICAgICAgICB0aGlzLnNldE1hcChtYXApXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbEdyaWRJbmRpY2VzKGxvY2F0aW9uKVxuICAgICAgICB0aGlzLnNldENvb3JkaW5hdGVzKClcbiAgICAgICAgdGhpcy5zZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIHRoaXMuc2V0RGl2KHRoaXMuZ2V0SWQoKSlcbiAgICAgICAgdGhpcy51cGRhdGVEaXYodGhpcylcblxuLy8gbW92ZWQgdGhpcyBvdXQgc28gd2UgYXJlIG5vdCBjcmVhdGluZyBjaGlsZHJlbiBlYWNoIHRpbWUgd2Ugd2FudCB0byBwbGFjZSBvbiBtYXBcbiAgICAgICAgLy8gdGhpcy5jcmVhdGVJbml0aWFsQ2hpbGRFbGVtZW50KCdpdGVtLWxheWVyJylcbiAgICB9XG5cbiAgICBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpdHlOdW1iZXJcbiAgICB9XG5cbiAgICBzZXRDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgeyBjc3NMZWZ0LCBjc3NUb3AgfSA9IHRoaXMuZ2V0Q1NTQ29vcmRpbmF0ZXMoKVxuICAgICAgICB0aGlzLmxlZnQgPSBjc3NMZWZ0XG4gICAgICAgIHRoaXMudG9wID0gY3NzVG9wXG4gICAgfVxuXG4gICAgc2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG5cbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgfVxuXG4gICAgc2V0RGl2KGlkZW50aXR5TnVtYmVyKSB7XG4gICAgICAgIGlmICghdGhpcy5kaXZTZXQpIHtcbiAgICAgICAgICAgIHRoaXMuZGl2ID0gdGhpcy5kaXYgKyBpZGVudGl0eU51bWJlclxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGl2U2V0ID0gdHJ1ZVxuICAgIH1cblxuXG4gICAgLy8gc3BlY2lmaWMgdG8gaXRlbSBkcmF3aW5nOiB1c2Ugb3V0ZXJIVE1MXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXllcklkKVxuICAgICAgICBlbC5vdXRlckhUTUwgPSB0aGlzLmdldExheWVyKClcbiAgICB9XG5cblxuXG4gICAgcmVuZGVyTGF5ZXIodW5pdCwgbGF5ZXJJZCkge1xuICAgICAgICBpZiAodW5pdC50eXBlID09PSAnaXRlbScpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGl2KHVuaXQpXG4gICAgICAgICAgICB0aGlzLmRyYXdMYXllcihsYXllcklkKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBvblRha2UoKSB7XG4gICAgICAgIHRoaXMueCA9IG51bGxcbiAgICAgICAgdGhpcy55ID0gbnVsbFxuICAgICAgICB0aGlzLm9mZk1hcCA9IHRydWUgLy8gY2hhbmdlcyBjc3MgZGlzcGxheSB0byAnbm9uZSdcblxuICAgICAgICBzd2l0Y2ggKHRoaXMubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAncGFydGljbGUgbWluZXInOlxuICAgICAgICAgICAgICAgIHRoaXMuaGFsdE1pbmluZygpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnYWRkLWludmVudG9yeScsIHRoaXMpXG4gICAgICAgIC8vIHRoaXMuRU0uc3Vic2NyaWJlKCdyZW1vdmUtaW52ZW50b3J5JywgdGhpcy5vbkRyb3AsIHRoaXMpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIodGhpcywgdGhpcy5kaXYpXG4gICAgfVxuXG4gICAgb25Ecm9wKCkge1xuXG4gICAgICAgIHRoaXMuRU0uc3Vic2NyaWJlKGAke3RoaXMubmFtZX0tJHt0aGlzLmlkZW50aXR5TnVtYmVyfSB0YWtlbmAsIHRoaXMub25UYWtlLCB0aGlzLCB0cnVlKVxuICAgIC8vICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMsIHRoaXMuZGl2KVxuXG4gICAgfVxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW1cbiIsImltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSdcbmltcG9ydCBVdGlsaXR5IGZyb20gJ2pzL1V0aWxpdHknXG5cbmNsYXNzIFBhcnRpY2xlTWluZXIgZXh0ZW5kcyBJdGVtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuXG4gICAgICAgIHRoaXMubmFtZSA9ICdwYXJ0aWNsZSBtaW5lcidcbiAgICAgICAgdGhpcy50eXBlID0gJ2l0ZW0nXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICd8J1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gJ21pbmVzLCBkaXZpZGVzLCBhbmQgc3RvcmVzIGFtYmllbnQgY2hlbWljYWwgZWxlbWVudHMgYW5kIGxhcmdlciBjb21wb3VuZHMgZm91bmQgd2l0aGluIGEgMTAwIG1ldGVyIHJhZGl1cy4gOTclIGFjY3VyYWN5IHJhdGUuJ1xuICAgICAgICB0aGlzLmRpdiA9ICdpdGVtLW1pbmVyJ1xuICAgICAgICAvLyBtdXN0IHN1YnNjcmliZSB0aGUgaXRlbSBkaXJlY3RseSwgbm90IG9uIHRoZSBhYnN0cmFjdCBjbGFzc1xuICAgICAgICB0aGlzLkVNLnN1YnNjcmliZShgJHt0aGlzLm5hbWV9LSR7dGhpcy5pZGVudGl0eU51bWJlcn0gdGFrZW5gLCB0aGlzLm9uVGFrZSwgdGhpcylcblxuICAgICAgICB0aGlzLm1pbmVkUGFydGljbGVzID0ge1xuICAgICAgICAgICAgSUQ6IHRoaXMuaWRlbnRpdHlOdW1iZXJcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbWluZShsb2NhdGlvbikge1xuICAgICAgICAvLyB0cnkgc2V0dGluZyB0aGUgbG9jYXRpb24gaW1tZWRpYXRlbHksIHVzaW5nIFRISVNcblxuICAgICAgICB0aGlzLmxvY2FsZSA9IHRoaXMubWFwW2xvY2F0aW9uWzFdXVtsb2NhdGlvblswXV1cblxuICAgICAgICB0aGlzLnNldE1pbmluZ0NvbmZpZygpXG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHJhdGlvcyBvbmNlLCByYXRoZXIgdGhhbiB3IGV2ZXJ5IGludGVydmFsXG4gICAgICAgIHRoaXMuZGV0ZXJtaW5lUGFydGljbGVSYXRpb3MoKVxuICAgICAgICB0aGlzLmNoZWNrUGFydGljbGVBbW91bnRzKClcbiAgICAgICAgdGhpcy5jYW5jZWxsYXRpb25LZXkgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja1BhcnRpY2xlQW1vdW50cygpXG4gICAgICAgIH0sIDMwMDApXG5cbiAgICAgICAgdGhpcy5zZXRPbk1hcCh0aGlzLm1hcCwgbG9jYXRpb24pXG4gICAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG5cbiAgICBzZXRNaW5pbmdDb25maWcoKSB7XG4gICAgICAgIHRoaXMub2ZmTWFwID0gZmFsc2VcbiAgICAgICAgaWYgKCF0aGlzLm1pbmluZykge1xuICAgICAgICAgICAgdGhpcy5taW5pbmcgPSAnZnVsbCdcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRldGVybWluZVBhcnRpY2xlUmF0aW9zKCkge1xuICAgICAgICB0aGlzLmFsbFBhcnRpY2xlcyA9IFtdXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMubG9jYWxlLnBhcnRpY2xlcykuZm9yRWFjaChwYXJ0aWNsZSA9PiB7XG4gICAgICAgICAgICBsZXQgbnVtYmVyT2ZQYXJ0aWNsZXMgPSB0aGlzLmxvY2FsZS5wYXJ0aWNsZXNbcGFydGljbGVdXG4gICAgICAgICAgICB3aGlsZSAobnVtYmVyT2ZQYXJ0aWNsZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFsbFBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKVxuICAgICAgICAgICAgICAgIG51bWJlck9mUGFydGljbGVzLS1cbiAgICAgICAgfX0pXG4gICAgfVxuXG5cbiAgICBleHRyYWN0UGFydGljbGVzKCkge1xuICAgICAgICBjb25zdCByYW5kb21QYXJ0aWNsZSA9IHRoaXMuYWxsUGFydGljbGVzW1V0aWxpdHkucmFuZG9taXplKHRoaXMuYWxsUGFydGljbGVzLmxlbmd0aCldXG4gICAgICAgIGlmICghdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0pIHtcbiAgICAgICAgICAgIHRoaXMubWluZWRQYXJ0aWNsZXNbcmFuZG9tUGFydGljbGVdID0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taW5lZFBhcnRpY2xlc1tyYW5kb21QYXJ0aWNsZV0rK1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1pbmVkT2JqID0gdGhpcy5taW5lZFBhcnRpY2xlc1xuICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2FkZC1taW5lZCcsIG1pbmVkT2JqKVxuICAgIH1cblxuXG5cbiAgICBjaGVja1BhcnRpY2xlQW1vdW50cygpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbmcgPSAnZW1wdHknXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50ID49ICh0aGlzLmxvY2FsZS5tYXhQYXJ0aWNsZXMgLyAyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWluaW5nID0gJ2Z1bGwnXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUucGFydGljbGVBbW91bnQtLVxuICAgICAgICAgICAgICAgIHRoaXMuZXh0cmFjdFBhcnRpY2xlcygpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubG9jYWxlLnBhcnRpY2xlQW1vdW50IDwgKHRoaXMubG9jYWxlLm1heFBhcnRpY2xlcyAvIDIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5taW5pbmcgPSAnaGFsZidcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5wYXJ0aWNsZUFtb3VudC0tXG4gICAgICAgICAgICAgICAgdGhpcy5leHRyYWN0UGFydGljbGVzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG5cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVEaXYodGhpcylcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIodGhpcy5kaXYpXG4gICAgfVxuXG5cbiAgICBoYWx0TWluaW5nKCkge1xuICAgICAgICAvLyB0aGlzLm1pbmluZyA9IGZhbHNlXG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuY2FuY2VsbGF0aW9uS2V5KVxuICAgIH1cblxuXG5cblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhcnRpY2xlTWluZXJcbiIsImltcG9ydCBQYXJ0aWNsZU1pbmVyIGZyb20gJy4vUGFydGljbGVNaW5lcidcbmltcG9ydCBVdGlsaXR5IGZyb20gJ2pzL1V0aWxpdHknXG5pbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nXG5cbmNvbnN0IElURU1TID0gW1xuICAgIFBhcnRpY2xlTWluZXJcbl1cblxuZnVuY3Rpb24gcmFuZG9tSXRlbSgpIHtcbiAgICByZXR1cm4gbmV3IElURU1TW1V0aWxpdHkucmFuZG9taXplKElURU1TLmxlbmd0aCldXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSXRlbXMobnVtYmVyPTEpIHtcbiAgICBjb25zdCBpdGVtcyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXI7IGkrKykge1xuICAgICAgICBpdGVtcy5wdXNoKHJhbmRvbUl0ZW0oKSlcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1zXG59XG5cblxuZXhwb3J0IHtcbiAgICBnZW5lcmF0ZUl0ZW1zXG59XG4iLCJpbXBvcnQgZXZlbnRNYW5hZ2VyIGZyb20gJy4vZXZlbnRNYW5hZ2VyJ1xuXG5jbGFzcyBTdG9yZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcblxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gbG9jYWxzdG9yYWdlLCBzYXZpbmcgZGlzYWJsZWQnKVxuICAgICAgICAgICAgd2luZG93LmFsZXJ0KCdzYXZpbmcgZGlzYWJsZWQnKVxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgICAgICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5jbGVhcigpXG4gICAgfVxuXG4gICAgaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gKHRoaXMuc3RvcmFnZS5nZXRJdGVtKGtleSkgIT09IG51bGwpXG4gICAgfVxuXG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3JlLnNldCcsIGtleSlcblxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSlcbiAgICB9XG5cbiAgICBnZXQoa2V5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdG9yZS5nZXQnLCBrZXkpXG5cbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5zdG9yYWdlLmdldEl0ZW0oa2V5KSlcbiAgICB9XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFN0b3JlKClcbiJdfQ==
