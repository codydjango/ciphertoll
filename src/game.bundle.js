(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _Game = require('./js/Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.game = _Game2.default;

},{"./js/Game":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _test = require('./test');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

alert('foo: ' + _test2.default);

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

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, null, [{
        key: 'contains',
        value: function contains(obj, property) {
            return Object.keys(obj).indexOf(String(property)) !== -1;
        }
    }, {
        key: 'stringToNumber',
        value: function stringToNumber(string) {
            return string.match(/\d+/)[0];
        }
    }, {
        key: 'randomize',
        value: function randomize(mult) {
            return Math.floor(Math.random() * mult);
        }
    }]);

    return Utility;
}();

var LandscapeSeeds = function () {
    function LandscapeSeeds() {
        _classCallCheck(this, LandscapeSeeds);

        this.features = this.features();
        this.bare = this.bare();
    }

    _createClass(LandscapeSeeds, [{
        key: 'features',
        value: function features() {
            var period = {
                element: '.',
                description: 'the air is choked with dust, static, wifi',
                probability: 30,
                cls: 'period'
            };
            var comma = {
                element: ',',
                description: 'sprawl of smart homes, cul-de-sacs, laneways',
                probability: 30,
                cls: 'comma'
            };
            var semicolon = {
                element: ';',
                description: 'rows of greenhouses: some shattered and barren, others overgrown',
                probability: 15,
                cls: 'semicolon'
            };
            var grave = {
                element: '^',
                description: 'a shimmering field of solar panels, broken and corroded',
                probability: 15,
                cls: 'grave'
            };
            var asterisk = {
                element: '*',
                description: 'hollow users jack in at the datahubs',
                probability: 15,
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

    return LandscapeSeeds;
}();

var MapGenerator = function () {
    function MapGenerator(col, row) {
        _classCallCheck(this, MapGenerator);

        console.log('generating map');
        this.landscapeSeeds = new LandscapeSeeds();
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
                randomElements.push(this.landscapeSeeds.features[Utility.randomize(this.landscapeSeeds.features.length)]);
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
                el.x = Utility.randomize(_this.row - 1);
                el.y = Utility.randomize(_this.col - 1);
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

            // check that seed location is not already waiting to be seeded
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
                for (var direction in DIRECTIONS) {
                    var directionValues = DIRECTIONS[direction];
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
            return probabilityArray[Utility.randomize(100)];
        }
    }]);

    return MapGenerator;
}();

var Map = function () {
    function Map(col, row) {
        _classCallCheck(this, Map);

        this.col = col;
        this.row = row;
        this.generatedMap = new MapGenerator(col, row);
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
            return [Utility.randomize(this.row - 1), Utility.randomize(this.col - 1)];
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
            console.log('itemsOnMap', this.itemsOnMap);
        }
    }, {
        key: 'checkCharacterLocation',
        value: function checkCharacterLocation() {
            var char = this.character.getCharacter();
            this.itemsOnMap.forEach(function (item) {
                if (item.x === char.x && item.y === char.y) {
                    // if character is on the same location as an item,
                    // print item description and allow character to interact with item
                    console.log('character is at item!');
                }
            });
        }
    }]);

    return Map;
}();

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
        key: 'renderUnit',
        value: function renderUnit(unit) {
            // issue when ITEMS are rendered: cannot render multiple items on one layer??
            var cls = '';
            var element = '&nbsp;';
            if (unit) {
                cls = unit.cls;
                element = unit.element;
            }
            var style = '';
            if (unit.top && unit.left) {
                style = 'top: ' + unit.top + 'px; left: ' + unit.left + 'px';
            }
            return '<span class="unit ' + cls + '" style="' + style + '">' + element + '</span>';
        }
    }]);

    return Renderable;
}();

var Scenery = function (_Renderable) {
    _inherits(Scenery, _Renderable);

    // Scenery-specific rendering functions
    function Scenery(map) {
        _classCallCheck(this, Scenery);

        var _this4 = _possibleConstructorReturn(this, (Scenery.__proto__ || Object.getPrototypeOf(Scenery)).call(this));

        _this4.gotMap = map.getMap();
        _this4.renderLayer();
        console.log('scenery rendered');
        return _this4;
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
                for (var _i2 = 0; _i2 < rowItems.length; _i2++) {
                    row += this.renderUnit(rowItems[_i2]); // add rendered items to the grid
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
}(Renderable);

var Moveable = function (_Renderable2) {
    _inherits(Moveable, _Renderable2);

    // movement and placement on the grid
    function Moveable(map) {
        _classCallCheck(this, Moveable);

        var _this5 = _possibleConstructorReturn(this, (Moveable.__proto__ || Object.getPrototypeOf(Moveable)).call(this));

        _this5.gotMap = map.getMap();
        return _this5;
    }

    _createClass(Moveable, [{
        key: 'createMoveableLayer',
        value: function createMoveableLayer(moveableObject) {
            return this.renderUnit(moveableObject);
        }
    }, {
        key: 'updateLayer',
        value: function updateLayer(moveableObject) {
            this.setLayer(this.createMoveableLayer(moveableObject));
        }
    }, {
        key: 'renderLayer',
        value: function renderLayer(moveableObject, layerId) {
            this.updateLayer(moveableObject);
            this.drawLayer(layerId);
        }
    }, {
        key: 'drawLayer',
        value: function drawLayer(layerId) {
            var el = document.getElementById(layerId);
            el.innerHTML = this.getLayer();
        }
    }, {
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
            var width = Utility.stringToNumber(style.getPropertyValue('width'));
            var height = Utility.stringToNumber(style.getPropertyValue('height'));
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
}(Renderable);

var Character = function (_Moveable) {
    _inherits(Character, _Moveable);

    // Character data and actions
    function Character(map) {
        _classCallCheck(this, Character);

        var _this6 = _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).call(this, map));

        _this6.map = map;
        _this6.EM = null;
        _this6.initialGridIndices = map.getMapCenter();

        _this6.setInitialGridIndices(_this6.initialGridIndices);
        _this6.renderLayer(_this6.getCharacter(), 'character-layer');
        console.log('character rendered');
        return _this6;
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
            // console.log(`${direction}`)
            this.location = this.updateGridIndices(this.getCharacter(), DIRECTIONS[direction]);
            // const char = this.getCharacter()
            // console.log('location', this.location)
            this.map.checkCharacterLocation();

            if (this.EM) {
                this.EM.publish('character-moved', this.location);
            }

            this.renderLayer(this.getCharacter(), 'character-layer');
        }

        // eventmanager testing

    }, {
        key: 'setEventManager',
        value: function setEventManager(eventManager) {
            this.EM = eventManager;
        }
    }, {
        key: 'takeItem',
        value: function takeItem() {
            console.log('attempting to take item...');
            this.EM.publish('item taken');
            console.log('events remaining:', this.EM.getEventsList());
        }
    }]);

    return Character;
}(Moveable);

var Item = function (_Moveable2) {
    _inherits(Item, _Moveable2);

    function Item(map, itemObject) {
        _classCallCheck(this, Item);

        var _this7 = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).call(this, map));

        _this7.item = itemObject;
        _this7.initialGridIndices = map.getRandomMapLocation();
        _this7.setInitialGridIndices(_this7.initialGridIndices);
        _this7.setGridIndices();
        _this7.setCoordinates();

        _this7.renderLayer(_this7.getItem(), 'item-layer'); // issues with rendering multiple items

        console.log('item ' + _this7.item.name + ' rendered at ' + _this7.initialGridIndices);

        return _this7;
    }

    _createClass(Item, [{
        key: 'getItem',
        value: function getItem() {
            return this.item;
        }
    }, {
        key: 'setCoordinates',
        value: function setCoordinates() {
            var _getCSSCoordinates2 = this.getCSSCoordinates(),
                cssLeft = _getCSSCoordinates2.cssLeft,
                cssTop = _getCSSCoordinates2.cssTop;

            this.item.left = cssLeft;
            this.item.top = cssTop;
        }
    }, {
        key: 'setGridIndices',
        value: function setGridIndices() {
            this.item.x = this.gridIndices[0];
            this.item.y = this.gridIndices[1];
        }

        // eventmanager testing

    }, {
        key: 'setEventManager',
        value: function setEventManager(eventManager) {
            this.EM = eventManager;
            this.EM.subscribe('item taken', this.onTake, this);
            console.log('events list', this.EM.getEventsList());
        }
    }, {
        key: 'onTake',
        value: function onTake() {
            console.log(this.item.name + ' taken!');
        }
    }]);

    return Item;
}(Moveable);

var ItemGenerator = function () {
    function ItemGenerator(map, eventManager, numberOfItems) {
        _classCallCheck(this, ItemGenerator);

        this.map = map;
        this.numberOfItems = numberOfItems;
        this.data = new ItemData();

        // eventmanager testing

        this.EM = eventManager;

        this.generateItems();
    }

    _createClass(ItemGenerator, [{
        key: 'getRandomItems',
        value: function getRandomItems() {
            var allItems = this.data.items;
            var randomItems = [];
            for (var i = 0; i < this.numberOfItems; i++) {
                var randomItem = allItems[Utility.randomize(allItems.length)];
                randomItems.push(randomItem);
            }
            return randomItems;
        }
    }, {
        key: 'generateItems',
        value: function generateItems() {
            var _this8 = this;

            var randomItems = this.getRandomItems();
            randomItems.forEach(function (item) {
                _this8.newItem = new Item(_this8.map, item);

                // eventmanager testing

                _this8.newItem.setEventManager(_this8.EM);

                _this8.map.pushItem(_this8.newItem.item); // hmmm... pushItems refreshes each time generateItems is called?
                console.log('item generated:', _this8.newItem.item);
            });
        }
    }]);

    return ItemGenerator;
}();

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
                element: '|',
                description: '',
                cls: 'item miner'
            };
            var blueprint = {
                name: 'blueprint',
                element: '?',
                description: '',
                cls: 'item blueprint'
            };
            var artificialMuscle = {
                name: 'artificial muscle',
                element: '&',
                description: '',
                cls: 'item muscle'
            };
            var printer = {
                name: '3D printer',
                element: '#',
                description: '',
                cls: 'item printer'
            };
            return [particleMiner, blueprint, artificialMuscle, printer];
        }
    }]);

    return ItemData;
}();

// eventmanager testing


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

var Status = function () {
    function Status(EM) {
        _classCallCheck(this, Status);

        EM.subscribe('character-moved', this.update, this);
    }

    _createClass(Status, [{
        key: 'update',
        value: function update(location) {
            this.set(location.description);
        }
    }, {
        key: 'set',
        value: function set(description) {
            document.getElementById('status').innerHTML = description;
        }
    }]);

    return Status;
}();

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
            this.map = new Map(60, 60);
            this.scenery = new Scenery(this.map);
            this.character = new Character(this.map);
            this.map.setCharacter(this.character); // gives map reference to character


            // eventmanager testing
            this.EM = new EventManager(); // create only one EM ? or multiple ?
            this.character.setEventManager(this.EM);
            this.map.setEventManager(this.EM);

            // try generating from a set of stock items
            // bug: only the last item generated will display!!
            // testing with one item generated ...
            this.itemGenerator = new ItemGenerator(this.map, this.EM, 5); // have to pass in EM to generator (inelegant)

            this.status = new Status(this.EM);
            this.status.set('you wake up');

            this.input = this.initUserInput();
        }
    }, {
        key: 'initUserInput',
        value: function initUserInput() {
            return new UserInput({
                '38': this.character.getAction('move', 'north'),
                '37': this.character.getAction('move', 'west'),
                '39': this.character.getAction('move', 'east'),
                '40': this.character.getAction('move', 'south'),
                '84': this.character.getAction('takeItem', 'item') // (t)ake item
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

var UserInput = function () {
    function UserInput(keyActionMap) {
        _classCallCheck(this, UserInput);

        this.keyActionMap = keyActionMap;

        document.onkeydown = this.tryActionForEvent.bind(this);
    }

    _createClass(UserInput, [{
        key: 'tryActionForEvent',
        value: function tryActionForEvent(event) {
            if (!Utility.contains(this.keyActionMap, event.keyCode)) {
                console.log('not a valid keycode: ' + event.keyCode);
            } else {
                this.keyActionMap[event.keyCode]();
            }
        }
    }]);

    return UserInput;
}();

exports.default = new Game();

},{"./test":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var foo = 'bar6';

exports.default = foo;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvR2FtZS5qcyIsInNyYy9qcy90ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsT0FBTyxJQUFQOzs7Ozs7Ozs7OztBQ0ZBOzs7Ozs7Ozs7Ozs7QUFFQTs7QUFFQSxJQUFNLGFBQWE7QUFDZixXQUFPLEVBQUUsR0FBRyxDQUFMLEVBQVEsR0FBRyxDQUFDLENBQVosRUFEUTtBQUVmLFdBQU8sRUFBRSxHQUFHLENBQUwsRUFBUSxHQUFHLENBQVgsRUFGUTtBQUdmLFVBQU0sRUFBRSxHQUFHLENBQUwsRUFBUSxHQUFHLENBQVgsRUFIUztBQUlmLFVBQU0sRUFBRSxHQUFHLENBQUMsQ0FBTixFQUFTLEdBQUcsQ0FBWixFQUpTO0FBS2YsZUFBVyxFQUFFLEdBQUcsQ0FBQyxDQUFOLEVBQVMsR0FBRyxDQUFDLENBQWIsRUFMSTtBQU1mLGVBQVcsRUFBRSxHQUFHLENBQUwsRUFBUSxHQUFHLENBQUMsQ0FBWixFQU5JO0FBT2YsZUFBVyxFQUFFLEdBQUcsQ0FBTCxFQUFRLEdBQUcsQ0FBWCxFQVBJO0FBUWYsZUFBVyxFQUFFLEdBQUcsQ0FBQyxDQUFOLEVBQVMsR0FBRyxDQUFaO0FBUkksQ0FBbkI7O0lBV00sTzs7Ozs7OztpQ0FDYyxHLEVBQUssUSxFQUFVO0FBQzNCLG1CQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosRUFBaUIsT0FBakIsQ0FBeUIsT0FBTyxRQUFQLENBQXpCLE1BQStDLENBQUMsQ0FBdkQ7QUFDSDs7O3VDQUVxQixNLEVBQVE7QUFDMUIsbUJBQU8sT0FBTyxLQUFQLENBQWEsS0FBYixFQUFvQixDQUFwQixDQUFQO0FBQ0g7OztrQ0FFZ0IsSSxFQUFNO0FBQ25CLG1CQUFPLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixJQUEzQixDQUFQO0FBQ0g7Ozs7OztJQUlDLGM7QUFDRiw4QkFBYztBQUFBOztBQUNWLGFBQUssUUFBTCxHQUFnQixLQUFLLFFBQUwsRUFBaEI7QUFDQSxhQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsRUFBWjtBQUNIOzs7O21DQUVVO0FBQ1AsZ0JBQU0sU0FBUztBQUNYLHlCQUFTLEdBREU7QUFFWCw2QkFBYSwyQ0FGRjtBQUdYLDZCQUFhLEVBSEY7QUFJWCxxQkFBSztBQUpNLGFBQWY7QUFNQSxnQkFBTSxRQUFRO0FBQ1YseUJBQVMsR0FEQztBQUVWLDZCQUFhLDhDQUZIO0FBR1YsNkJBQWEsRUFISDtBQUlWLHFCQUFLO0FBSkssYUFBZDtBQU1BLGdCQUFNLFlBQVk7QUFDZCx5QkFBUyxHQURLO0FBRWQsNkJBQWEsa0VBRkM7QUFHZCw2QkFBYSxFQUhDO0FBSWQscUJBQUs7QUFKUyxhQUFsQjtBQU1BLGdCQUFNLFFBQVE7QUFDVix5QkFBUyxHQURDO0FBRVYsNkJBQWEseURBRkg7QUFHViw2QkFBYSxFQUhIO0FBSVYscUJBQUs7QUFKSyxhQUFkO0FBTUEsZ0JBQU0sV0FBVztBQUNiLHlCQUFTLEdBREk7QUFFYiw2QkFBYSxzQ0FGQTtBQUdiLDZCQUFhLEVBSEE7QUFJYixxQkFBSztBQUpRLGFBQWpCO0FBTUEsbUJBQU8sQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixTQUFoQixFQUEyQixTQUEzQixFQUFzQyxRQUF0QyxFQUFnRCxRQUFoRCxFQUEwRCxLQUExRCxFQUFpRSxLQUFqRSxDQUFQO0FBQ0g7OzsrQkFFTTtBQUNILGdCQUFNLE9BQU87QUFDVCx5QkFBUyxRQURBO0FBRVQsNkJBQWEsbURBRko7QUFHVCxxQkFBSztBQUhJLGFBQWI7QUFLQSxtQkFBTyxJQUFQO0FBQ0g7Ozs7OztJQUlDLFk7QUFDRiwwQkFBWSxHQUFaLEVBQWlCLEdBQWpCLEVBQXNCO0FBQUE7O0FBQ2xCLGdCQUFRLEdBQVIsQ0FBWSxnQkFBWjtBQUNBLGFBQUssY0FBTCxHQUFzQixJQUFJLGNBQUosRUFBdEI7QUFDQSxZQUFNLE9BQU8sS0FBSyxJQUFMLENBQVUsR0FBVixFQUFlLEdBQWYsQ0FBYjtBQUNBLFlBQU0sYUFBYSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQW5CO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLFVBQWxCO0FBQ0EsYUFBSyxJQUFMO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLGVBQVo7QUFDSDs7OztpQ0FFUTtBQUNMLG1CQUFPLEtBQUssVUFBWjtBQUNIOzs7NkJBRUksRyxFQUFLLEcsRUFBSztBQUNYLGlCQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsaUJBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxnQkFBTSxPQUFPLEVBQWI7QUFDQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCO0FBQzFCLHFCQUFLLENBQUwsSUFBVSxFQUFWO0FBQ0EscUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxHQUFwQixFQUF5QixHQUF6QixFQUE4QjtBQUMxQix5QkFBSyxDQUFMLEVBQVEsSUFBUixDQUFhLEtBQUssY0FBTCxDQUFvQixJQUFqQztBQUNIO0FBQ0o7QUFDRCxtQkFBTyxJQUFQO0FBQ0g7Ozs2QkFFSSxJLEVBQU07QUFDUCxnQkFBTSxpQkFBaUIsRUFBdkI7QUFDQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssdUJBQUwsRUFBcEIsRUFBb0QsR0FBcEQsRUFBeUQ7QUFDckQsK0JBQWUsSUFBZixDQUFvQixLQUFLLGNBQUwsQ0FBb0IsUUFBcEIsQ0FBNkIsUUFBUSxTQUFSLENBQWtCLEtBQUssY0FBTCxDQUFvQixRQUFwQixDQUE2QixNQUEvQyxDQUE3QixDQUFwQjtBQUNIO0FBQ0QsZ0JBQU0sUUFBUSxLQUFLLHFCQUFMLENBQTJCLGNBQTNCLENBQWQ7QUFDQSxrQkFBTSxHQUFOLENBQVU7QUFBQSx1QkFBUSxLQUFLLEtBQUssQ0FBVixFQUFhLEtBQUssQ0FBbEIsSUFBdUIsSUFBL0I7QUFBQSxhQUFWO0FBQ0EsaUJBQUssTUFBTCxHQUFjLEtBQWQ7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7OztrREFFeUI7QUFDdEI7QUFDQTtBQUNBLG1CQUFRLEtBQUssR0FBTCxHQUFXLEtBQUssR0FBeEIsQ0FIc0IsQ0FHUTtBQUNqQzs7OzhDQUVxQixjLEVBQWdCO0FBQUE7O0FBQ2xDLG1CQUFPLGVBQWUsR0FBZixDQUFtQixjQUFNO0FBQzVCLG1CQUFHLENBQUgsR0FBTyxRQUFRLFNBQVIsQ0FBa0IsTUFBSyxHQUFMLEdBQVcsQ0FBN0IsQ0FBUDtBQUNBLG1CQUFHLENBQUgsR0FBTyxRQUFRLFNBQVIsQ0FBa0IsTUFBSyxHQUFMLEdBQVcsQ0FBN0IsQ0FBUDtBQUNBLHVCQUFPLEVBQVA7QUFDSCxhQUpNLENBQVA7QUFLSDs7OytCQUVNO0FBQUE7O0FBQ0gsZ0JBQUksUUFBUSxLQUFLLE1BQWpCO0FBQ0EsZ0JBQUksZUFBZSxLQUFuQjs7QUFGRztBQU9DLG9CQUFJLENBQUMsT0FBSyxtQkFBTCxDQUF5QixLQUF6QixFQUFnQyxNQUFyQyxFQUE2QztBQUN6QyxtQ0FBZSxJQUFmO0FBQ0g7QUFDRCxvQkFBSSxZQUFZLEVBQWhCO0FBQ0EsdUJBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLHVCQUFLLG1CQUFMLENBQXlCLEtBQXpCLEVBQWdDLE9BQWhDLENBQXdDLFVBQUMsSUFBRCxFQUFVO0FBQzlDLHdCQUFJLE9BQUssU0FBTCxDQUFlLElBQWYsQ0FBSixFQUEwQjtBQUN0QixrQ0FBVSxJQUFWLENBQWUsT0FBSyxTQUFMLENBQWUsSUFBZixDQUFmO0FBQ0g7QUFDSixpQkFKRDtBQVpEO0FBQUE7QUFBQTs7QUFBQTtBQWlCQyx5Q0FBcUIsU0FBckIsOEhBQWdDO0FBQUEsNEJBQXZCLFFBQXVCOztBQUM1Qiw0QkFBSSxPQUFLLFVBQUwsQ0FBZ0IsU0FBUyxDQUF6QixFQUE0QixTQUFTLENBQXJDLE1BQTRDLE9BQUssY0FBTCxDQUFvQixJQUFwRSxFQUEwRTtBQUN0RSxtQ0FBSyxVQUFMLENBQWdCLFNBQVMsQ0FBekIsRUFBNEIsU0FBUyxDQUFyQyxJQUEwQyxRQUExQztBQUNIO0FBQ0o7QUFyQkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFzQkMsb0JBQUksQ0FBQyxPQUFLLHNCQUFMLEVBQUwsRUFBb0M7QUFDaEMsbUNBQWUsSUFBZjtBQUNILGlCQUZELE1BRU87QUFDSCw0QkFBUSxTQUFSO0FBQ0g7QUExQkY7O0FBTUgsbUJBQU8sQ0FBQyxZQUFSLEVBQXNCO0FBQUE7QUFxQnJCO0FBQ0o7OztpREFFd0I7QUFDckIsZ0JBQU0sZ0JBQWdCLEdBQUcsTUFBSCxDQUFVLEtBQVYsQ0FBZ0IsRUFBaEIsRUFBb0IsS0FBSyxVQUF6QixDQUF0QjtBQUNBLGdCQUFJLFFBQVEsQ0FBWjtBQUZxQjtBQUFBO0FBQUE7O0FBQUE7QUFHckIsc0NBQWMsYUFBZCxtSUFBNkI7QUFBQSx3QkFBcEIsQ0FBb0I7O0FBQ3pCLHdCQUFJLE1BQU0sS0FBSyxjQUFMLENBQW9CLElBQTlCLEVBQW9DO0FBQ2hDO0FBQ0g7QUFDSjtBQVBvQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVFyQixtQkFBTyxLQUFQO0FBQ0g7OztrQ0FFUyxJLEVBQU07QUFDWixnQkFBSSxlQUFlLEtBQW5CO0FBQ0EsZ0JBQUssS0FBSyxDQUFMLEdBQVMsS0FBSyxHQUFkLElBQXFCLEtBQUssQ0FBTCxJQUFVLENBQWhDLElBQ0MsS0FBSyxDQUFMLEdBQVMsS0FBSyxHQUFkLElBQXFCLEtBQUssQ0FBTCxJQUFVLENBRHBDLEVBQ3dDO0FBQ3BDLCtCQUFlLElBQWY7QUFDSCxhQUhELE1BR087QUFDSCx1QkFBTyxJQUFQO0FBQ0g7QUFDRCxnQkFBSSxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxDQUFyQixFQUF3QixLQUFLLENBQTdCLE1BQW9DLEtBQUssY0FBTCxDQUFvQixJQUE1RCxFQUFrRTtBQUM5RCwrQkFBZSxLQUFmO0FBQ0g7O0FBRUQ7QUFDQSxpQkFBSyxTQUFMLENBQWUsT0FBZixDQUF1QixvQkFBWTtBQUMvQixvQkFBSyxLQUFLLENBQUwsS0FBVyxTQUFTLENBQXJCLElBQ0MsS0FBSyxDQUFMLEtBQVcsU0FBUyxDQUR6QixFQUM2QjtBQUN6QixtQ0FBZSxLQUFmO0FBQ0g7QUFDSixhQUxEOztBQU9BLGdCQUFJLFlBQUosRUFBa0I7QUFDZCx1QkFBTyxJQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU8sSUFBUDtBQUNIO0FBQ0o7Ozs0Q0FFbUIsSyxFQUFPO0FBQUE7O0FBQ3ZCLGdCQUFNLGVBQWUsRUFBckI7QUFDQSxrQkFBTSxPQUFOLENBQWMsVUFBQyxZQUFELEVBQWtCO0FBQzVCLHFCQUFLLElBQUksU0FBVCxJQUFzQixVQUF0QixFQUFrQztBQUM5Qix3QkFBTSxrQkFBa0IsV0FBVyxTQUFYLENBQXhCO0FBQ0Esd0JBQU0sY0FBYyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLFlBQWxCLENBQXBCO0FBQ0Esd0JBQUksT0FBSyxXQUFMLENBQWlCLFlBQVksV0FBN0IsQ0FBSixFQUErQztBQUMzQyw2QkFBSyxJQUFJLEdBQVQsSUFBZ0IsZUFBaEIsRUFBaUM7QUFDN0IsZ0NBQUksUUFBUSxHQUFaLEVBQWlCO0FBQ2pCLDRDQUFZLENBQVosR0FBZ0IsYUFBYSxDQUFiLEdBQWlCLGdCQUFnQixHQUFoQixDQUFqQztBQUNDLDZCQUZELE1BRU8sSUFBSSxRQUFRLEdBQVosRUFBaUI7QUFDeEIsNENBQVksQ0FBWixHQUFnQixhQUFhLENBQWIsR0FBaUIsZ0JBQWdCLEdBQWhCLENBQWpDO0FBQ0M7QUFDSjtBQUNELHFDQUFhLElBQWIsQ0FBa0IsV0FBbEI7QUFDSDtBQUNKO0FBQ0osYUFmRDtBQWdCQSxpQkFBSyxZQUFMLEdBQW9CLFlBQXBCO0FBQ0EsbUJBQU8sWUFBUDtBQUNIOzs7b0NBRVcsVSxFQUFZO0FBQ3BCLGdCQUFNLG1CQUFtQixFQUF6QjtBQUNBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBcEIsRUFBZ0MsR0FBaEMsRUFBcUM7QUFDakMsaUNBQWlCLElBQWpCLENBQXNCLElBQXRCO0FBQ0g7QUFDRCxpQkFBSyxJQUFJLEtBQUksQ0FBYixFQUFnQixLQUFJLE1BQU0sVUFBMUIsRUFBc0MsSUFBdEMsRUFBMkM7QUFDdkMsaUNBQWlCLElBQWpCLENBQXNCLEtBQXRCO0FBQ0g7QUFDRCxtQkFBTyxpQkFBaUIsUUFBUSxTQUFSLENBQWtCLEdBQWxCLENBQWpCLENBQVA7QUFDSDs7Ozs7O0lBSUMsRztBQUNGLGlCQUFZLEdBQVosRUFBaUIsR0FBakIsRUFBc0I7QUFBQTs7QUFDbEIsYUFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLGFBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxhQUFLLFlBQUwsR0FBb0IsSUFBSSxZQUFKLENBQWlCLEdBQWpCLEVBQXNCLEdBQXRCLENBQXBCO0FBQ0EsYUFBSyxHQUFMLEdBQVcsS0FBSyxZQUFMLENBQWtCLE1BQWxCLEVBQVg7QUFDQSxhQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDSDs7OztpQ0FFUTtBQUNMLG1CQUFPLEtBQUssR0FBWjtBQUNIOzs7dUNBRWM7QUFDWCxtQkFBTyxDQUFDLEtBQUssS0FBTCxDQUFXLEtBQUssR0FBTCxHQUFTLENBQXBCLENBQUQsRUFBeUIsS0FBSyxLQUFMLENBQVcsS0FBSyxHQUFMLEdBQVMsQ0FBcEIsQ0FBekIsQ0FBUDtBQUNIOzs7K0NBRXNCO0FBQ25CLG1CQUFPLENBQUMsUUFBUSxTQUFSLENBQWtCLEtBQUssR0FBTCxHQUFXLENBQTdCLENBQUQsRUFBa0MsUUFBUSxTQUFSLENBQWtCLEtBQUssR0FBTCxHQUFXLENBQTdCLENBQWxDLENBQVA7QUFDSDs7O3FDQUVZLFMsRUFBVztBQUNwQixpQkFBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0g7Ozt3Q0FFZSxZLEVBQWM7QUFDMUIsaUJBQUssRUFBTCxHQUFVLFlBQVY7QUFDSDs7O2lDQUdRLEksRUFBTTtBQUNYLGlCQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckI7QUFDQSxvQkFBUSxHQUFSLENBQVksWUFBWixFQUEwQixLQUFLLFVBQS9CO0FBQ0g7OztpREFFd0I7QUFDckIsZ0JBQU0sT0FBTyxLQUFLLFNBQUwsQ0FBZSxZQUFmLEVBQWI7QUFDQSxpQkFBSyxVQUFMLENBQWdCLE9BQWhCLENBQXdCLGdCQUFRO0FBQzVCLG9CQUFJLEtBQUssQ0FBTCxLQUFXLEtBQUssQ0FBaEIsSUFDQSxLQUFLLENBQUwsS0FBVyxLQUFLLENBRHBCLEVBQ3VCO0FBQ25CO0FBQ0E7QUFDQSw0QkFBUSxHQUFSLENBQVksdUJBQVo7QUFDSDtBQUNKLGFBUEQ7QUFRSDs7Ozs7O0lBTUMsVTtBQUFjO0FBQ2hCLDBCQUFjO0FBQUE7QUFDYjs7OztpQ0FFUSxLLEVBQU87QUFDWixpQkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNIOzs7bUNBRVU7QUFDUCxtQkFBTyxLQUFLLEtBQVo7QUFDSDs7O21DQUVVLEksRUFBTTtBQUFPO0FBQ3BCLGdCQUFJLE1BQU0sRUFBVjtBQUNBLGdCQUFJLFVBQVUsUUFBZDtBQUNBLGdCQUFJLElBQUosRUFBVTtBQUNOLHNCQUFNLEtBQUssR0FBWDtBQUNBLDBCQUFVLEtBQUssT0FBZjtBQUNIO0FBQ0QsZ0JBQUksUUFBUSxFQUFaO0FBQ0EsZ0JBQUksS0FBSyxHQUFMLElBQVksS0FBSyxJQUFyQixFQUEyQjtBQUN2QixrQ0FBZ0IsS0FBSyxHQUFyQixrQkFBcUMsS0FBSyxJQUExQztBQUNIO0FBQ0QsMENBQTRCLEdBQTVCLGlCQUEyQyxLQUEzQyxVQUFxRCxPQUFyRDtBQUNIOzs7Ozs7SUFJQyxPOzs7QUFBOEI7QUFDaEMscUJBQVksR0FBWixFQUFpQjtBQUFBOztBQUFBOztBQUViLGVBQUssTUFBTCxHQUFjLElBQUksTUFBSixFQUFkO0FBQ0EsZUFBSyxXQUFMO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLGtCQUFaO0FBSmE7QUFLaEI7Ozs7c0NBRWE7QUFDVixnQkFBTSxPQUFPLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsZUFBTztBQUFFLHVCQUFPLElBQUksS0FBSixFQUFQO0FBQW9CLGFBQTdDLENBQWI7QUFDQSxpQkFBSyxRQUFMLENBQWMsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQWQ7QUFDQSxpQkFBSyxTQUFMO0FBQ0g7OztvQ0FFVyxJLEVBQU07QUFDZCxnQkFBTSxjQUFjLEVBQXBCO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ2xDLG9CQUFNLFdBQVcsS0FBSyxDQUFMLENBQWpCO0FBQ0Esb0JBQUksTUFBTSxFQUFWLENBRmtDLENBRXBCO0FBQ2QscUJBQUssSUFBSSxNQUFJLENBQWIsRUFBZ0IsTUFBSSxTQUFTLE1BQTdCLEVBQXFDLEtBQXJDLEVBQTBDO0FBQ3RDLDJCQUFPLEtBQUssVUFBTCxDQUFnQixTQUFTLEdBQVQsQ0FBaEIsQ0FBUCxDQURzQyxDQUNGO0FBQ3ZDO0FBQ0QsNEJBQVksSUFBWixDQUFpQixHQUFqQjtBQUNIO0FBQ0QsbUJBQU8sV0FBUDtBQUNIOzs7b0NBRVc7QUFDUixnQkFBTSxRQUFRLEtBQUssUUFBTCxFQUFkO0FBQ0EsZ0JBQU0sYUFBYSxNQUFNLElBQU4sQ0FBVyxRQUFYLENBQW5CLENBRlEsQ0FFaUM7QUFDekMsZ0JBQU0sS0FBSyxTQUFTLGNBQVQsQ0FBd0IsaUJBQXhCLENBQVg7QUFDQSxlQUFHLFNBQUgsR0FBZSxVQUFmO0FBQ0g7Ozs7RUFoQ2lCLFU7O0lBb0NoQixROzs7QUFBK0I7QUFDakMsc0JBQVksR0FBWixFQUFpQjtBQUFBOztBQUFBOztBQUViLGVBQUssTUFBTCxHQUFjLElBQUksTUFBSixFQUFkO0FBRmE7QUFHaEI7Ozs7NENBRW1CLGMsRUFBZ0I7QUFDaEMsbUJBQU8sS0FBSyxVQUFMLENBQWdCLGNBQWhCLENBQVA7QUFDSDs7O29DQUVXLGMsRUFBZ0I7QUFDeEIsaUJBQUssUUFBTCxDQUFjLEtBQUssbUJBQUwsQ0FBeUIsY0FBekIsQ0FBZDtBQUNIOzs7b0NBRVcsYyxFQUFnQixPLEVBQVM7QUFDakMsaUJBQUssV0FBTCxDQUFpQixjQUFqQjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxPQUFmO0FBQ0g7OztrQ0FFUyxPLEVBQVM7QUFDZixnQkFBTSxLQUFLLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFYO0FBQ0EsZUFBRyxTQUFILEdBQWUsS0FBSyxRQUFMLEVBQWY7QUFDSDs7OzhDQUdxQixXLEVBQWE7QUFDL0IsaUJBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNBLGdCQUFNLFdBQVcsS0FBSyxNQUFMLENBQVksS0FBSyxXQUFMLENBQWlCLENBQWpCLENBQVosRUFBaUMsS0FBSyxXQUFMLENBQWlCLENBQWpCLENBQWpDLENBQWpCO0FBQ0g7Ozt5Q0FFZ0I7QUFDYixnQkFBTSxJQUFJLEtBQUssV0FBTCxDQUFpQixDQUFqQixDQUFWO0FBQ0EsZ0JBQU0sSUFBSSxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBVjtBQUNBLG1CQUFPLEVBQUUsSUFBRixFQUFLLElBQUwsRUFBUDtBQUNIOzs7MENBRWlCLEssRUFBTyxJLEVBQU07QUFDM0IsZ0JBQU0saUJBQWlCLENBQUMsS0FBSyxXQUFMLENBQWlCLENBQWpCLElBQXNCLEtBQUssQ0FBNUIsRUFBK0IsS0FBSyxXQUFMLENBQWlCLENBQWpCLElBQXNCLEtBQUssQ0FBMUQsQ0FBdkI7QUFDQSxnQkFBSSxXQUFXLEVBQWY7QUFDQSxnQkFBSSxLQUFLLGdCQUFMLENBQXNCLGNBQXRCLENBQUosRUFBMkM7QUFDdkMsMkJBQVcsS0FBSyxNQUFMLENBQVksZUFBZSxDQUFmLENBQVosRUFBK0IsZUFBZSxDQUFmLENBQS9CLENBQVg7QUFDQSxxQkFBSyxXQUFMLEdBQW1CLGNBQW5CO0FBQ0Esc0JBQU0sQ0FBTixHQUFVLGVBQWUsQ0FBZixDQUFWO0FBQ0Esc0JBQU0sQ0FBTixHQUFVLGVBQWUsQ0FBZixDQUFWO0FBQ0gsYUFMRCxNQUtPO0FBQ0gsMkJBQVcsS0FBSyxNQUFMLEVBQVksS0FBSyxXQUFMLENBQWlCLENBQWpCLEdBQXFCLEtBQUssV0FBTCxDQUFpQixDQUFqQixDQUFqQyxFQUFYO0FBQ0Esb0JBQUksTUFBTSxJQUFOLEtBQWUsV0FBbkIsRUFBZ0M7QUFDNUIsNEJBQVEsR0FBUixDQUFZLCtCQUFaO0FBQ0g7QUFDSjtBQUNELG1CQUFPLFFBQVA7QUFDSDs7O3lDQUVnQixjLEVBQWdCO0FBQzdCLGdCQUFJLGlCQUFpQixLQUFyQjtBQUNBLGdCQUFJLEtBQUssTUFBTCxDQUFZLGVBQWUsQ0FBZixDQUFaLENBQUosRUFBb0M7QUFDaEMsb0JBQU0sV0FBVyxLQUFLLE1BQUwsQ0FBWSxlQUFlLENBQWYsQ0FBWixFQUErQixlQUFlLENBQWYsQ0FBL0IsQ0FBakI7QUFDQSxvQkFBSSxRQUFKLEVBQWM7QUFDVixxQ0FBaUIsSUFBakI7QUFDSDtBQUNKO0FBQ0QsbUJBQU8sY0FBUDtBQUNIOzs7K0NBRXNCO0FBQ25CLGdCQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQVg7QUFDQSxnQkFBTSxRQUFRLE9BQU8sZ0JBQVAsQ0FBd0IsRUFBeEIsQ0FBZDtBQUNBLGdCQUFNLFFBQVEsUUFBUSxjQUFSLENBQXVCLE1BQU0sZ0JBQU4sQ0FBdUIsT0FBdkIsQ0FBdkIsQ0FBZDtBQUNBLGdCQUFNLFNBQVMsUUFBUSxjQUFSLENBQXVCLE1BQU0sZ0JBQU4sQ0FBdUIsUUFBdkIsQ0FBdkIsQ0FBZjtBQUNBLG1CQUFPLEVBQUUsWUFBRixFQUFTLGNBQVQsRUFBUDtBQUNIOzs7NENBRW1CO0FBQ2hCLGdCQUFNLE1BQU0sS0FBSyxvQkFBTCxFQUFaO0FBQ0EsZ0JBQU0sVUFBVSxLQUFLLFdBQUwsQ0FBaUIsQ0FBakIsSUFBc0IsSUFBSSxNQUExQztBQUNBLGdCQUFNLFNBQVMsS0FBSyxXQUFMLENBQWlCLENBQWpCLElBQXNCLElBQUksS0FBekM7QUFDQSxtQkFBTyxFQUFFLGdCQUFGLEVBQVcsY0FBWCxFQUFQO0FBQ0g7Ozs7RUE3RWtCLFU7O0lBaUZqQixTOzs7QUFBOEI7QUFDaEMsdUJBQVksR0FBWixFQUFpQjtBQUFBOztBQUFBLDJIQUNQLEdBRE87O0FBRWIsZUFBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLGVBQUssRUFBTCxHQUFVLElBQVY7QUFDQSxlQUFLLGtCQUFMLEdBQTBCLElBQUksWUFBSixFQUExQjs7QUFFQSxlQUFLLHFCQUFMLENBQTJCLE9BQUssa0JBQWhDO0FBQ0EsZUFBSyxXQUFMLENBQWlCLE9BQUssWUFBTCxFQUFqQixFQUFzQyxpQkFBdEM7QUFDQSxnQkFBUSxHQUFSLENBQVksb0JBQVo7QUFSYTtBQVNoQjs7Ozt1Q0FFYztBQUFBLHFDQUNpQixLQUFLLGlCQUFMLEVBRGpCO0FBQUEsZ0JBQ0gsT0FERyxzQkFDSCxPQURHO0FBQUEsZ0JBQ00sTUFETixzQkFDTSxNQUROOztBQUFBLGtDQUVNLEtBQUssY0FBTCxFQUZOO0FBQUEsZ0JBRUgsQ0FGRyxtQkFFSCxDQUZHO0FBQUEsZ0JBRUEsQ0FGQSxtQkFFQSxDQUZBOztBQUdYLGdCQUFNLFlBQVk7QUFDZCxzQkFBTSxXQURRO0FBRWQseUJBQVMsR0FGSztBQUdkLHFCQUFLLFdBSFM7QUFJZCxzQkFBTSxPQUpRO0FBS2QscUJBQUssTUFMUztBQU1kLG1CQUFHLENBTlc7QUFPZCxtQkFBRztBQVBXLGFBQWxCO0FBU0EsbUJBQU8sU0FBUDtBQUNIOzs7a0NBRVMsTSxFQUFRLEcsRUFBSztBQUNuQixtQkFBTyxLQUFLLE1BQUwsRUFBYSxJQUFiLENBQWtCLElBQWxCLEVBQXdCLEdBQXhCLENBQVA7QUFDSDs7OzZCQUVJLFMsRUFBVztBQUNaO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixLQUFLLGlCQUFMLENBQXVCLEtBQUssWUFBTCxFQUF2QixFQUE0QyxXQUFXLFNBQVgsQ0FBNUMsQ0FBaEI7QUFDQTtBQUNBO0FBQ0EsaUJBQUssR0FBTCxDQUFTLHNCQUFUOztBQUVBLGdCQUFJLEtBQUssRUFBVCxFQUFhO0FBQ1QscUJBQUssRUFBTCxDQUFRLE9BQVIsQ0FBZ0IsaUJBQWhCLEVBQW1DLEtBQUssUUFBeEM7QUFDSDs7QUFFRCxpQkFBSyxXQUFMLENBQWlCLEtBQUssWUFBTCxFQUFqQixFQUFzQyxpQkFBdEM7QUFDSDs7QUFFRDs7Ozt3Q0FDZ0IsWSxFQUFjO0FBQzFCLGlCQUFLLEVBQUwsR0FBVSxZQUFWO0FBQ0g7OzttQ0FFVTtBQUNQLG9CQUFRLEdBQVIsQ0FBWSw0QkFBWjtBQUNBLGlCQUFLLEVBQUwsQ0FBUSxPQUFSLENBQWdCLFlBQWhCO0FBQ0Esb0JBQVEsR0FBUixDQUFZLG1CQUFaLEVBQWlDLEtBQUssRUFBTCxDQUFRLGFBQVIsRUFBakM7QUFDSDs7OztFQXREbUIsUTs7SUE2RGxCLEk7OztBQUNGLGtCQUFZLEdBQVosRUFBaUIsVUFBakIsRUFBNkI7QUFBQTs7QUFBQSxpSEFDbkIsR0FEbUI7O0FBRXpCLGVBQUssSUFBTCxHQUFZLFVBQVo7QUFDQSxlQUFLLGtCQUFMLEdBQTBCLElBQUksb0JBQUosRUFBMUI7QUFDQSxlQUFLLHFCQUFMLENBQTJCLE9BQUssa0JBQWhDO0FBQ0EsZUFBSyxjQUFMO0FBQ0EsZUFBSyxjQUFMOztBQUdBLGVBQUssV0FBTCxDQUFpQixPQUFLLE9BQUwsRUFBakIsRUFBaUMsWUFBakMsRUFUeUIsQ0FTdUI7O0FBRWhELGdCQUFRLEdBQVIsV0FBb0IsT0FBSyxJQUFMLENBQVUsSUFBOUIscUJBQWtELE9BQUssa0JBQXZEOztBQVh5QjtBQWE1Qjs7OztrQ0FFUztBQUNOLG1CQUFPLEtBQUssSUFBWjtBQUNIOzs7eUNBRWdCO0FBQUEsc0NBQ2UsS0FBSyxpQkFBTCxFQURmO0FBQUEsZ0JBQ0wsT0FESyx1QkFDTCxPQURLO0FBQUEsZ0JBQ0ksTUFESix1QkFDSSxNQURKOztBQUViLGlCQUFLLElBQUwsQ0FBVSxJQUFWLEdBQWlCLE9BQWpCO0FBQ0EsaUJBQUssSUFBTCxDQUFVLEdBQVYsR0FBZ0IsTUFBaEI7QUFDSDs7O3lDQUVnQjtBQUNiLGlCQUFLLElBQUwsQ0FBVSxDQUFWLEdBQWMsS0FBSyxXQUFMLENBQWlCLENBQWpCLENBQWQ7QUFDQSxpQkFBSyxJQUFMLENBQVUsQ0FBVixHQUFjLEtBQUssV0FBTCxDQUFpQixDQUFqQixDQUFkO0FBQ0g7O0FBR0Q7Ozs7d0NBRWdCLFksRUFBYztBQUMxQixpQkFBSyxFQUFMLEdBQVUsWUFBVjtBQUNBLGlCQUFLLEVBQUwsQ0FBUSxTQUFSLENBQWtCLFlBQWxCLEVBQWdDLEtBQUssTUFBckMsRUFBNkMsSUFBN0M7QUFDQSxvQkFBUSxHQUFSLENBQVksYUFBWixFQUEyQixLQUFLLEVBQUwsQ0FBUSxhQUFSLEVBQTNCO0FBQ0g7OztpQ0FFUTtBQUNMLG9CQUFRLEdBQVIsQ0FBZSxLQUFLLElBQUwsQ0FBVSxJQUF6QjtBQUNIOzs7O0VBMUNjLFE7O0lBOENiLGE7QUFDRiwyQkFBWSxHQUFaLEVBQWlCLFlBQWpCLEVBQStCLGFBQS9CLEVBQThDO0FBQUE7O0FBQzFDLGFBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxhQUFLLGFBQUwsR0FBcUIsYUFBckI7QUFDQSxhQUFLLElBQUwsR0FBWSxJQUFJLFFBQUosRUFBWjs7QUFFQTs7QUFFQSxhQUFLLEVBQUwsR0FBVSxZQUFWOztBQUVBLGFBQUssYUFBTDtBQUNIOzs7O3lDQUVnQjtBQUNiLGdCQUFNLFdBQVcsS0FBSyxJQUFMLENBQVUsS0FBM0I7QUFDQSxnQkFBTSxjQUFjLEVBQXBCO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLGFBQXpCLEVBQXdDLEdBQXhDLEVBQTZDO0FBQ3pDLG9CQUFNLGFBQWEsU0FBUyxRQUFRLFNBQVIsQ0FBa0IsU0FBUyxNQUEzQixDQUFULENBQW5CO0FBQ0EsNEJBQVksSUFBWixDQUFpQixVQUFqQjtBQUNIO0FBQ0QsbUJBQU8sV0FBUDtBQUNIOzs7d0NBRWU7QUFBQTs7QUFDWixnQkFBTSxjQUFjLEtBQUssY0FBTCxFQUFwQjtBQUNBLHdCQUFZLE9BQVosQ0FBb0IsZ0JBQVE7QUFDeEIsdUJBQUssT0FBTCxHQUFlLElBQUksSUFBSixDQUFTLE9BQUssR0FBZCxFQUFtQixJQUFuQixDQUFmOztBQUdBOztBQUVBLHVCQUFLLE9BQUwsQ0FBYSxlQUFiLENBQTZCLE9BQUssRUFBbEM7O0FBRUEsdUJBQUssR0FBTCxDQUFTLFFBQVQsQ0FBa0IsT0FBSyxPQUFMLENBQWEsSUFBL0IsRUFSd0IsQ0FRYztBQUN0Qyx3QkFBUSxHQUFSLENBQVksaUJBQVosRUFBK0IsT0FBSyxPQUFMLENBQWEsSUFBNUM7QUFDSCxhQVZEO0FBV0g7Ozs7OztJQU9DLFE7QUFDRix3QkFBYztBQUFBOztBQUNWLGFBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxFQUFiO0FBQ0g7Ozs7Z0NBRU87QUFDSixnQkFBTSxnQkFBZ0I7QUFDbEIsc0JBQU0sZ0JBRFk7QUFFbEIseUJBQVMsR0FGUztBQUdsQiw2QkFBYSxFQUhLO0FBSWxCLHFCQUFLO0FBSmEsYUFBdEI7QUFNQSxnQkFBTSxZQUFZO0FBQ2Qsc0JBQU0sV0FEUTtBQUVkLHlCQUFTLEdBRks7QUFHZCw2QkFBYSxFQUhDO0FBSWQscUJBQUs7QUFKUyxhQUFsQjtBQU1BLGdCQUFNLG1CQUFtQjtBQUNyQixzQkFBTSxtQkFEZTtBQUVyQix5QkFBUyxHQUZZO0FBR3JCLDZCQUFhLEVBSFE7QUFJckIscUJBQUs7QUFKZ0IsYUFBekI7QUFNQSxnQkFBTSxVQUFVO0FBQ1osc0JBQU0sWUFETTtBQUVaLHlCQUFTLEdBRkc7QUFHWiw2QkFBYSxFQUhEO0FBSVoscUJBQUs7QUFKTyxhQUFoQjtBQU1BLG1CQUFPLENBQUMsYUFBRCxFQUFnQixTQUFoQixFQUEyQixnQkFBM0IsRUFBNkMsT0FBN0MsQ0FBUDtBQUNIOzs7Ozs7QUFJTDs7O0lBQ00sWTtBQUNGLDRCQUFjO0FBQUE7O0FBQ1YsYUFBSyxVQUFMLEdBQWtCLEVBQWxCLENBRFUsQ0FDa0I7QUFDL0I7Ozs7a0NBRVMsSyxFQUFPLEUsRUFBSSxTLEVBQXVCO0FBQUEsZ0JBQVosSUFBWSx1RUFBUCxLQUFPOztBQUN4QyxnQkFBSSxPQUFPLFNBQVAsS0FBcUIsV0FBekIsRUFBc0M7QUFBSTtBQUN0Qyw0QkFBWSxFQUFaO0FBQ0g7QUFDRCxpQkFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLEVBQU87QUFDeEIsdUJBQU8sS0FEVSxFQUNPO0FBQ3hCLG9CQUFJLEVBRmE7QUFHakIsc0JBQU0sSUFIVztBQUlqQiwyQkFBVztBQUpNLGFBQXJCO0FBTUg7OztnQ0FFTyxLLEVBQU8sRyxFQUFLO0FBQ2hCLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxVQUFMLENBQWdCLE1BQXBDLEVBQTRDLEdBQTVDLEVBQWlEO0FBQzdDLG9CQUFJLEtBQUssVUFBTCxDQUFnQixDQUFoQixFQUFtQixLQUFuQixLQUE2QixLQUFqQyxFQUF3QztBQUFBLHdDQUNKLEtBQUssVUFBTCxDQUFnQixDQUFoQixDQURJO0FBQUEsd0JBQzVCLFNBRDRCLGlCQUM1QixTQUQ0QjtBQUFBLHdCQUNqQixFQURpQixpQkFDakIsRUFEaUI7QUFBQSx3QkFDYixJQURhLGlCQUNiLElBRGE7OztBQUdwQyx1QkFBRyxJQUFILENBQVEsU0FBUixFQUFtQixHQUFuQjs7QUFFQSx3QkFBSSxJQUFKLEVBQVU7QUFDTiw2QkFBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLENBQXZCLEVBQTBCLENBQTFCO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7Ozt3Q0FFZTtBQUNaLG1CQUFPLEtBQUssVUFBWjtBQUNIOzs7Ozs7SUFJQyxNO0FBQ0Ysb0JBQVksRUFBWixFQUFnQjtBQUFBOztBQUNaLFdBQUcsU0FBSCxDQUFhLGlCQUFiLEVBQWdDLEtBQUssTUFBckMsRUFBNkMsSUFBN0M7QUFDSDs7OzsrQkFFTSxRLEVBQVU7QUFDYixpQkFBSyxHQUFMLENBQVMsU0FBUyxXQUFsQjtBQUNIOzs7NEJBRUcsVyxFQUFhO0FBQ2IscUJBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxTQUFsQyxHQUE4QyxXQUE5QztBQUNIOzs7Ozs7SUFJQyxJO0FBQ0Ysb0JBQWM7QUFBQTs7QUFDVixhQUFLLFFBQUw7QUFDQSxhQUFLLFNBQUw7QUFDSDs7OzttQ0FFVTtBQUNQLGlCQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0EsaUJBQUssUUFBTCxHQUFnQixLQUFoQjtBQUNBLGlCQUFLLEdBQUwsR0FBVyxJQUFJLEdBQUosQ0FBUSxFQUFSLEVBQVksRUFBWixDQUFYO0FBQ0EsaUJBQUssT0FBTCxHQUFlLElBQUksT0FBSixDQUFZLEtBQUssR0FBakIsQ0FBZjtBQUNBLGlCQUFLLFNBQUwsR0FBaUIsSUFBSSxTQUFKLENBQWMsS0FBSyxHQUFuQixDQUFqQjtBQUNBLGlCQUFLLEdBQUwsQ0FBUyxZQUFULENBQXNCLEtBQUssU0FBM0IsRUFOTyxDQU1nQzs7O0FBR3ZDO0FBQ0EsaUJBQUssRUFBTCxHQUFVLElBQUksWUFBSixFQUFWLENBVk8sQ0FVdUI7QUFDOUIsaUJBQUssU0FBTCxDQUFlLGVBQWYsQ0FBK0IsS0FBSyxFQUFwQztBQUNBLGlCQUFLLEdBQUwsQ0FBUyxlQUFULENBQXlCLEtBQUssRUFBOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQUssYUFBTCxHQUFxQixJQUFJLGFBQUosQ0FBa0IsS0FBSyxHQUF2QixFQUE0QixLQUFLLEVBQWpDLEVBQXFDLENBQXJDLENBQXJCLENBakJPLENBaUJ1RDs7QUFFOUQsaUJBQUssTUFBTCxHQUFjLElBQUksTUFBSixDQUFXLEtBQUssRUFBaEIsQ0FBZDtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLGFBQWhCOztBQUVBLGlCQUFLLEtBQUwsR0FBYSxLQUFLLGFBQUwsRUFBYjtBQUNIOzs7d0NBRWU7QUFDWixtQkFBTyxJQUFJLFNBQUosQ0FBYztBQUNqQixzQkFBTSxLQUFLLFNBQUwsQ0FBZSxTQUFmLENBQXlCLE1BQXpCLEVBQWlDLE9BQWpDLENBRFc7QUFFakIsc0JBQU0sS0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixNQUF6QixFQUFpQyxNQUFqQyxDQUZXO0FBR2pCLHNCQUFNLEtBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsTUFBekIsRUFBaUMsTUFBakMsQ0FIVztBQUlqQixzQkFBTSxLQUFLLFNBQUwsQ0FBZSxTQUFmLENBQXlCLE1BQXpCLEVBQWlDLE9BQWpDLENBSlc7QUFLakIsc0JBQU0sS0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixVQUF6QixFQUFxQyxNQUFyQyxDQUxXLENBS2tDO0FBTGxDLGFBQWQsQ0FBUDtBQU9IOzs7b0NBRVc7QUFDUixvQkFBUSxHQUFSLENBQVksUUFBWjtBQUNIOzs7cUNBRVk7QUFDVCxtQkFBTyxLQUFLLFFBQVo7QUFDSDs7O2tDQUVTO0FBQ04sb0JBQVEsR0FBUixvQkFBNkIsS0FBSyxJQUFsQztBQUNIOzs7Ozs7SUFJQyxTO0FBQ0YsdUJBQVksWUFBWixFQUEwQjtBQUFBOztBQUN0QixhQUFLLFlBQUwsR0FBb0IsWUFBcEI7O0FBRUEsaUJBQVMsU0FBVCxHQUFxQixLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQXJCO0FBQ0g7Ozs7MENBRWlCLEssRUFBTztBQUNyQixnQkFBSSxDQUFDLFFBQVEsUUFBUixDQUFpQixLQUFLLFlBQXRCLEVBQW9DLE1BQU0sT0FBMUMsQ0FBTCxFQUF5RDtBQUNyRCx3QkFBUSxHQUFSLDJCQUFvQyxNQUFNLE9BQTFDO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUssWUFBTCxDQUFrQixNQUFNLE9BQXhCO0FBQ0g7QUFDSjs7Ozs7O2tCQUdVLElBQUksSUFBSixFOzs7Ozs7OztBQ3R1QmYsSUFBTSxNQUFNLE1BQVo7O2tCQUVlLEciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBnYW1lIGZyb20gJy4vanMvR2FtZSdcblxud2luZG93LmdhbWUgPSBnYW1lXG4iLCJpbXBvcnQgZm9vIGZyb20gJy4vdGVzdCdcblxuYWxlcnQoYGZvbzogJHtmb299YClcblxuY29uc3QgRElSRUNUSU9OUyA9IHtcbiAgICBub3J0aDogeyB4OiAwLCB5OiAtMSB9LFxuICAgIHNvdXRoOiB7IHg6IDAsIHk6IDEgfSxcbiAgICBlYXN0OiB7IHg6IDEsIHk6IDAgfSxcbiAgICB3ZXN0OiB7IHg6IC0xLCB5OiAwIH0sXG4gICAgbm9ydGh3ZXN0OiB7IHg6IC0xLCB5OiAtMSB9LFxuICAgIG5vcnRoZWFzdDogeyB4OiAxLCB5OiAtMSB9LFxuICAgIHNvdXRoZWFzdDogeyB4OiAxLCB5OiAxIH0sXG4gICAgc291dGh3ZXN0OiB7IHg6IC0xLCB5OiAxIH1cbn1cblxuY2xhc3MgVXRpbGl0eSB7XG4gICAgc3RhdGljIGNvbnRhaW5zKG9iaiwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuaW5kZXhPZihTdHJpbmcocHJvcGVydHkpKSAhPT0gLTFcbiAgICB9XG5cbiAgICBzdGF0aWMgc3RyaW5nVG9OdW1iZXIoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmcubWF0Y2goL1xcZCsvKVswXVxuICAgIH1cblxuICAgIHN0YXRpYyByYW5kb21pemUobXVsdCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXVsdClcbiAgICB9XG59XG5cblxuY2xhc3MgTGFuZHNjYXBlU2VlZHMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZlYXR1cmVzID0gdGhpcy5mZWF0dXJlcygpXG4gICAgICAgIHRoaXMuYmFyZSA9IHRoaXMuYmFyZSgpXG4gICAgfVxuXG4gICAgZmVhdHVyZXMoKSB7XG4gICAgICAgIGNvbnN0IHBlcmlvZCA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcuJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAndGhlIGFpciBpcyBjaG9rZWQgd2l0aCBkdXN0LCBzdGF0aWMsIHdpZmknLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDMwLFxuICAgICAgICAgICAgY2xzOiAncGVyaW9kJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbW1hID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJywnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdzcHJhd2wgb2Ygc21hcnQgaG9tZXMsIGN1bC1kZS1zYWNzLCBsYW5ld2F5cycsXG4gICAgICAgICAgICBwcm9iYWJpbGl0eTogMzAsXG4gICAgICAgICAgICBjbHM6ICdjb21tYSdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZW1pY29sb24gPSB7XG4gICAgICAgICAgICBlbGVtZW50OiAnOycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ3Jvd3Mgb2YgZ3JlZW5ob3VzZXM6IHNvbWUgc2hhdHRlcmVkIGFuZCBiYXJyZW4sIG90aGVycyBvdmVyZ3Jvd24nLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDE1LFxuICAgICAgICAgICAgY2xzOiAnc2VtaWNvbG9uJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdyYXZlID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJ14nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdhIHNoaW1tZXJpbmcgZmllbGQgb2Ygc29sYXIgcGFuZWxzLCBicm9rZW4gYW5kIGNvcnJvZGVkJyxcbiAgICAgICAgICAgIHByb2JhYmlsaXR5OiAxNSxcbiAgICAgICAgICAgIGNsczogJ2dyYXZlJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFzdGVyaXNrID0ge1xuICAgICAgICAgICAgZWxlbWVudDogJyonLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdob2xsb3cgdXNlcnMgamFjayBpbiBhdCB0aGUgZGF0YWh1YnMnLFxuICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDE1LFxuICAgICAgICAgICAgY2xzOiAnYXN0ZXJpc2snXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwZXJpb2QsIGNvbW1hLCBzZW1pY29sb24sIHNlbWljb2xvbiwgYXN0ZXJpc2ssIGFzdGVyaXNrLCBncmF2ZSwgZ3JhdmVdXG4gICAgfVxuXG4gICAgYmFyZSgpIHtcbiAgICAgICAgY29uc3QgYmFyZSA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcmbmJzcDsnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjb25jcmV0ZSBhbmQgdHdpc3RlZCByZWJhciBzdHJldGNoIHRvIHRoZSBob3Jpem9uJyxcbiAgICAgICAgICAgIGNsczogJ2JsYW5rJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXJlXG4gICAgfVxufVxuXG5cbmNsYXNzIE1hcEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYXRpbmcgbWFwJylcbiAgICAgICAgdGhpcy5sYW5kc2NhcGVTZWVkcyA9IG5ldyBMYW5kc2NhcGVTZWVkcygpXG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLmluaXQoY29sLCByb3cpXG4gICAgICAgIGNvbnN0IHNlZWRlZEdyaWQgPSB0aGlzLnNlZWQoZ3JpZClcbiAgICAgICAgdGhpcy5zZWVkZWRHcmlkID0gc2VlZGVkR3JpZFxuICAgICAgICB0aGlzLmdyb3coKVxuICAgICAgICBjb25zb2xlLmxvZygnbWFwIGdlbmVyYXRlZCcpXG4gICAgfVxuXG4gICAgZ2V0TWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWVkZWRHcmlkXG4gICAgfVxuXG4gICAgaW5pdChjb2wsIHJvdykge1xuICAgICAgICB0aGlzLmNvbCA9IGNvbFxuICAgICAgICB0aGlzLnJvdyA9IHJvd1xuICAgICAgICBjb25zdCBncmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3c7IGkrKykge1xuICAgICAgICAgICAgZ3JpZFtpXSA9IFtdXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgZ3JpZFtpXS5wdXNoKHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ3JpZFxuICAgIH1cblxuICAgIHNlZWQoZ3JpZCkge1xuICAgICAgICBjb25zdCByYW5kb21FbGVtZW50cyA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpOyBpKyspIHtcbiAgICAgICAgICAgIHJhbmRvbUVsZW1lbnRzLnB1c2godGhpcy5sYW5kc2NhcGVTZWVkcy5mZWF0dXJlc1tVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLmxhbmRzY2FwZVNlZWRzLmZlYXR1cmVzLmxlbmd0aCldKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlZWRzID0gdGhpcy5nZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpXG4gICAgICAgIHNlZWRzLm1hcChzZWVkID0+IGdyaWRbc2VlZC55XVtzZWVkLnhdID0gc2VlZClcbiAgICAgICAgdGhpcy5fc2VlZHMgPSBzZWVkc1xuICAgICAgICByZXR1cm4gZ3JpZFxuICAgIH1cblxuICAgIGdldE51bWJlck9mRWxlbWVudFNlZWRzKCkge1xuICAgICAgICAvLyAgcmV0dXJuIDEgICAgICAgIC8vIHRlc3Qgc2V0dGluZ1xuICAgICAgICAvLyByZXR1cm4gKCh0aGlzLmNvbCAqIHRoaXMucm93KSAvICh0aGlzLl9jb2wgKyB0aGlzLnJvdykpICAvLyBzcGFyc2UgaW5pdGlhbCBzZWVkaW5nXG4gICAgICAgIHJldHVybiAodGhpcy5jb2wgKyB0aGlzLnJvdykgIC8vIHJpY2ggaW5pdGlhbCBzZWVkaW5nXG4gICAgfVxuXG4gICAgZ2VuZXJhdGVTZWVkTG9jYXRpb25zKHJhbmRvbUVsZW1lbnRzKSB7XG4gICAgICAgIHJldHVybiByYW5kb21FbGVtZW50cy5tYXAoZWwgPT4ge1xuICAgICAgICAgICAgZWwueCA9IFV0aWxpdHkucmFuZG9taXplKHRoaXMucm93IC0gMSlcbiAgICAgICAgICAgIGVsLnkgPSBVdGlsaXR5LnJhbmRvbWl6ZSh0aGlzLmNvbCAtIDEpXG4gICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBncm93KCkge1xuICAgICAgICBsZXQgc2VlZHMgPSB0aGlzLl9zZWVkc1xuICAgICAgICBsZXQgbWFwUG9wdWxhdGVkID0gZmFsc2VcblxuXG5cbiAgICAgICAgd2hpbGUgKCFtYXBQb3B1bGF0ZWQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5uZXh0R2VuZXJhdGlvblNlZWRzKHNlZWRzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZ29vZFNlZWRzID0gW11cbiAgICAgICAgICAgIHRoaXMuZ29vZFNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB0aGlzLm5leHRHZW5lcmF0aW9uU2VlZHMoc2VlZHMpLmZvckVhY2goKHNlZWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1NlZWQoc2VlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ29vZFNlZWRzLnB1c2godGhpcy5jaGVja1NlZWQoc2VlZCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGZvciAobGV0IGdvb2RTZWVkIG9mIGdvb2RTZWVkcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPT09IHRoaXMubGFuZHNjYXBlU2VlZHMuYmFyZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWRlZEdyaWRbZ29vZFNlZWQueV1bZ29vZFNlZWQueF0gPSBnb29kU2VlZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5jb3VudFVuc2VlZGVkTG9jYXRpb25zKCkpIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZWRzID0gZ29vZFNlZWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb3VudFVuc2VlZGVkTG9jYXRpb25zKCkge1xuICAgICAgICBjb25zdCBmbGF0dGVuZWRHcmlkID0gW10uY29uY2F0LmFwcGx5KFtdLCB0aGlzLnNlZWRlZEdyaWQpXG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSBvZiBmbGF0dGVuZWRHcmlkKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICAgICAgY291bnQrK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudFxuICAgIH1cblxuICAgIGNoZWNrU2VlZChzZWVkKSB7XG4gICAgICAgIGxldCBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICBpZiAoKHNlZWQueCA8IHRoaXMuY29sICYmIHNlZWQueCA+PSAwKSAmJlxuICAgICAgICAgICAgKHNlZWQueSA8IHRoaXMucm93ICYmIHNlZWQueSA+PSAwKSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWVkZWRHcmlkW3NlZWQueV1bc2VlZC54XSAhPT0gdGhpcy5sYW5kc2NhcGVTZWVkcy5iYXJlKSB7XG4gICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgdGhhdCBzZWVkIGxvY2F0aW9uIGlzIG5vdCBhbHJlYWR5IHdhaXRpbmcgdG8gYmUgc2VlZGVkXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKChzZWVkLnggPT09IGdvb2RTZWVkLngpICYmXG4gICAgICAgICAgICAgICAgKHNlZWQueSA9PT0gZ29vZFNlZWQueSkpIHtcbiAgICAgICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGlmIChzZWVkU3VjY2VlZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dEdlbmVyYXRpb25TZWVkcyhzZWVkcykge1xuICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSBbXVxuICAgICAgICBzZWVkcy5mb3JFYWNoKChvcmlnaW5hbFNlZWQpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmFiaWxpdHkobmV4dEdlblNlZWQucHJvYmFiaWxpdHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkaXJlY3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICd4Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueCA9IG9yaWdpbmFsU2VlZC54ICsgZGlyZWN0aW9uVmFsdWVzW2tleV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAneScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnkgPSBvcmlnaW5hbFNlZWQueSArIGRpcmVjdGlvblZhbHVlc1trZXldXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG4gICAgcHJvYmFiaWxpdHkocGVyY2VudGFnZSkge1xuICAgICAgICBjb25zdCBwcm9iYWJpbGl0eUFycmF5ID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaCh0cnVlKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwIC0gcGVyY2VudGFnZTsgaSsrKSB7XG4gICAgICAgICAgICBwcm9iYWJpbGl0eUFycmF5LnB1c2goZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbVXRpbGl0eS5yYW5kb21pemUoMTAwKV1cbiAgICB9XG59XG5cblxuY2xhc3MgTWFwIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2wsIHJvdykge1xuICAgICAgICB0aGlzLmNvbCA9IGNvbFxuICAgICAgICB0aGlzLnJvdyA9IHJvd1xuICAgICAgICB0aGlzLmdlbmVyYXRlZE1hcCA9IG5ldyBNYXBHZW5lcmF0b3IoY29sLCByb3cpXG4gICAgICAgIHRoaXMubWFwID0gdGhpcy5nZW5lcmF0ZWRNYXAuZ2V0TWFwKClcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwID0gW11cbiAgICB9XG5cbiAgICBnZXRNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcFxuICAgIH1cblxuICAgIGdldE1hcENlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHRoaXMuY29sLzIpLCBNYXRoLmZsb29yKHRoaXMucm93LzIpXVxuICAgIH1cblxuICAgIGdldFJhbmRvbU1hcExvY2F0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1V0aWxpdHkucmFuZG9taXplKHRoaXMucm93IC0gMSksIFV0aWxpdHkucmFuZG9taXplKHRoaXMuY29sIC0gMSldXG4gICAgfVxuXG4gICAgc2V0Q2hhcmFjdGVyKGNoYXJhY3Rlcikge1xuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IGNoYXJhY3RlclxuICAgIH1cblxuICAgIHNldEV2ZW50TWFuYWdlcihldmVudE1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuICAgIH1cblxuXG4gICAgcHVzaEl0ZW0oaXRlbSkge1xuICAgICAgICB0aGlzLml0ZW1zT25NYXAucHVzaChpdGVtKVxuICAgICAgICBjb25zb2xlLmxvZygnaXRlbXNPbk1hcCcsIHRoaXMuaXRlbXNPbk1hcClcbiAgICB9XG5cbiAgICBjaGVja0NoYXJhY3RlckxvY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBjaGFyID0gdGhpcy5jaGFyYWN0ZXIuZ2V0Q2hhcmFjdGVyKClcbiAgICAgICAgdGhpcy5pdGVtc09uTWFwLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBpZiAoaXRlbS54ID09PSBjaGFyLnggJiZcbiAgICAgICAgICAgICAgICBpdGVtLnkgPT09IGNoYXIueSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGNoYXJhY3RlciBpcyBvbiB0aGUgc2FtZSBsb2NhdGlvbiBhcyBhbiBpdGVtLFxuICAgICAgICAgICAgICAgIC8vIHByaW50IGl0ZW0gZGVzY3JpcHRpb24gYW5kIGFsbG93IGNoYXJhY3RlciB0byBpbnRlcmFjdCB3aXRoIGl0ZW1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhcmFjdGVyIGlzIGF0IGl0ZW0hJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbn1cblxuXG5cbmNsYXNzIFJlbmRlcmFibGUgeyAgLy8gZ2VuZXJhbGl6ZWQgcmVuZGVyIGZ1bmN0aW9ucyBmb3IgU2NlbmVyeSwgQ2hhcmFjdGVyXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgc2V0TGF5ZXIobGF5ZXIpIHtcbiAgICAgICAgdGhpcy5sYXllciA9IGxheWVyXG4gICAgfVxuXG4gICAgZ2V0TGF5ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxheWVyXG4gICAgfVxuXG4gICAgcmVuZGVyVW5pdCh1bml0KSB7ICAgICAgLy8gaXNzdWUgd2hlbiBJVEVNUyBhcmUgcmVuZGVyZWQ6IGNhbm5vdCByZW5kZXIgbXVsdGlwbGUgaXRlbXMgb24gb25lIGxheWVyPz9cbiAgICAgICAgbGV0IGNscyA9ICcnXG4gICAgICAgIGxldCBlbGVtZW50ID0gJyZuYnNwOydcbiAgICAgICAgaWYgKHVuaXQpIHtcbiAgICAgICAgICAgIGNscyA9IHVuaXQuY2xzXG4gICAgICAgICAgICBlbGVtZW50ID0gdW5pdC5lbGVtZW50XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0eWxlID0gJydcbiAgICAgICAgaWYgKHVuaXQudG9wICYmIHVuaXQubGVmdCkge1xuICAgICAgICAgICAgc3R5bGUgPSBgdG9wOiAke3VuaXQudG9wfXB4OyBsZWZ0OiAke3VuaXQubGVmdH1weGBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwidW5pdCAke2Nsc31cIiBzdHlsZT1cIiR7c3R5bGV9XCI+JHtlbGVtZW50fTwvc3Bhbj5gXG4gICAgfVxufVxuXG5cbmNsYXNzIFNjZW5lcnkgZXh0ZW5kcyBSZW5kZXJhYmxlIHsgIC8vIFNjZW5lcnktc3BlY2lmaWMgcmVuZGVyaW5nIGZ1bmN0aW9uc1xuICAgIGNvbnN0cnVjdG9yKG1hcCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMuZ290TWFwID0gbWFwLmdldE1hcCgpXG4gICAgICAgIHRoaXMucmVuZGVyTGF5ZXIoKVxuICAgICAgICBjb25zb2xlLmxvZygnc2NlbmVyeSByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgcmVuZGVyTGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLmdvdE1hcC5tYXAoYXJyID0+IHsgcmV0dXJuIGFyci5zbGljZSgpIH0pXG4gICAgICAgIHRoaXMuc2V0TGF5ZXIodGhpcy5jcmVhdGVMYXllcihncmlkKSlcbiAgICAgICAgdGhpcy5kcmF3TGF5ZXIoKVxuICAgIH1cblxuICAgIGNyZWF0ZUxheWVyKGdyaWQpIHtcbiAgICAgICAgY29uc3Qgc2NlbmVyeUdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0l0ZW1zID0gZ3JpZFtpXVxuICAgICAgICAgICAgbGV0IHJvdyA9ICcnICAvLyBwb3NzaWJseSBtYWtlIGVhY2ggcm93IGEgdGFibGU/XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0l0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcm93ICs9IHRoaXMucmVuZGVyVW5pdChyb3dJdGVtc1tpXSkgLy8gYWRkIHJlbmRlcmVkIGl0ZW1zIHRvIHRoZSBncmlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzY2VuZXJ5R3JpZC5wdXNoKHJvdylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2NlbmVyeUdyaWRcbiAgICB9XG5cbiAgICBkcmF3TGF5ZXIoKSB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRMYXllcigpXG4gICAgICAgIGNvbnN0IGdyaWRUb0hUTUwgPSBsYXllci5qb2luKCc8YnIgLz4nKSAgLy8gdXNpbmcgSFRNTCBicmVha3MgZm9yIG5vd1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYW5kc2NhcGUtbGF5ZXInKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSBncmlkVG9IVE1MXG4gICAgfVxufVxuXG5cbmNsYXNzIE1vdmVhYmxlIGV4dGVuZHMgUmVuZGVyYWJsZSB7ICAvLyBtb3ZlbWVudCBhbmQgcGxhY2VtZW50IG9uIHRoZSBncmlkXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5nb3RNYXAgPSBtYXAuZ2V0TWFwKClcbiAgICB9XG5cbiAgICBjcmVhdGVNb3ZlYWJsZUxheWVyKG1vdmVhYmxlT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclVuaXQobW92ZWFibGVPYmplY3QpXG4gICAgfVxuXG4gICAgdXBkYXRlTGF5ZXIobW92ZWFibGVPYmplY3QpIHtcbiAgICAgICAgdGhpcy5zZXRMYXllcih0aGlzLmNyZWF0ZU1vdmVhYmxlTGF5ZXIobW92ZWFibGVPYmplY3QpKVxuICAgIH1cblxuICAgIHJlbmRlckxheWVyKG1vdmVhYmxlT2JqZWN0LCBsYXllcklkKSB7XG4gICAgICAgIHRoaXMudXBkYXRlTGF5ZXIobW92ZWFibGVPYmplY3QpXG4gICAgICAgIHRoaXMuZHJhd0xheWVyKGxheWVySWQpXG4gICAgfVxuXG4gICAgZHJhd0xheWVyKGxheWVySWQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXllcklkKVxuICAgICAgICBlbC5pbm5lckhUTUwgPSB0aGlzLmdldExheWVyKCk7XG4gICAgfVxuXG5cbiAgICBzZXRJbml0aWFsR3JpZEluZGljZXMoZ3JpZEluZGljZXMpIHtcbiAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IGdyaWRJbmRpY2VzXG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbdGhpcy5ncmlkSW5kaWNlc1sxXV1bdGhpcy5ncmlkSW5kaWNlc1swXV1cbiAgICB9XG5cbiAgICBnZXRHcmlkSW5kaWNlcygpIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuZ3JpZEluZGljZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cbiAgICAgICAgcmV0dXJuIHsgeCwgeSB9XG4gICAgfVxuXG4gICAgdXBkYXRlR3JpZEluZGljZXMoYWN0b3IsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3R3JpZEluZGljZXMgPSBbdGhpcy5ncmlkSW5kaWNlc1swXSArIG1vdmUueCwgdGhpcy5ncmlkSW5kaWNlc1sxXSArIG1vdmUueV1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gJydcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tHcmlkSW5kaWNlcyhuZXdHcmlkSW5kaWNlcykpIHtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gdGhpcy5nb3RNYXBbbmV3R3JpZEluZGljZXNbMV1dW25ld0dyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgdGhpcy5ncmlkSW5kaWNlcyA9IG5ld0dyaWRJbmRpY2VzXG4gICAgICAgICAgICBhY3Rvci54ID0gbmV3R3JpZEluZGljZXNbMF1cbiAgICAgICAgICAgIGFjdG9yLnkgPSBuZXdHcmlkSW5kaWNlc1sxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFt0aGlzLmdyaWRJbmRpY2VzWzFdLCB0aGlzLmdyaWRJbmRpY2VzWzBdXVxuICAgICAgICAgICAgaWYgKGFjdG9yLm5hbWUgPT09ICdjaGFyYWN0ZXInKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UndmUgcmVhY2hlZCB0aGUgbWFwJ3MgZWRnZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhdGlvblxuICAgIH1cblxuICAgIGNoZWNrR3JpZEluZGljZXMobmV3R3JpZEluZGljZXMpIHtcbiAgICAgICAgbGV0IGxvY2F0aW9uT25HcmlkID0gZmFsc2VcbiAgICAgICAgaWYgKHRoaXMuZ290TWFwW25ld0dyaWRJbmRpY2VzWzFdXSkge1xuICAgICAgICAgICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmdvdE1hcFtuZXdHcmlkSW5kaWNlc1sxXV1bbmV3R3JpZEluZGljZXNbMF1dXG4gICAgICAgICAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbk9uR3JpZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYXRpb25PbkdyaWRcbiAgICB9XG5cbiAgICBnZXRDU1NIZWlnaHRBbmRXaWR0aCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudW5pdCcpXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gICAgICAgIGNvbnN0IHdpZHRoID0gVXRpbGl0eS5zdHJpbmdUb051bWJlcihzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpKVxuICAgICAgICBjb25zdCBoZWlnaHQgPSBVdGlsaXR5LnN0cmluZ1RvTnVtYmVyKHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpKVxuICAgICAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0IH1cbiAgICB9XG5cbiAgICBnZXRDU1NDb29yZGluYXRlcygpIHtcbiAgICAgICAgY29uc3QgY3NzID0gdGhpcy5nZXRDU1NIZWlnaHRBbmRXaWR0aCgpXG4gICAgICAgIGNvbnN0IGNzc0xlZnQgPSB0aGlzLmdyaWRJbmRpY2VzWzBdICogY3NzLmhlaWdodFxuICAgICAgICBjb25zdCBjc3NUb3AgPSB0aGlzLmdyaWRJbmRpY2VzWzFdICogY3NzLndpZHRoXG4gICAgICAgIHJldHVybiB7IGNzc0xlZnQsIGNzc1RvcCB9XG4gICAgfVxufVxuXG5cbmNsYXNzIENoYXJhY3RlciBleHRlbmRzIE1vdmVhYmxlIHsgIC8vIENoYXJhY3RlciBkYXRhIGFuZCBhY3Rpb25zXG4gICAgY29uc3RydWN0b3IobWFwKSB7XG4gICAgICAgIHN1cGVyKG1hcClcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICAgICAgdGhpcy5FTSA9IG51bGxcbiAgICAgICAgdGhpcy5pbml0aWFsR3JpZEluZGljZXMgPSBtYXAuZ2V0TWFwQ2VudGVyKClcblxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyh0aGlzLmluaXRpYWxHcmlkSW5kaWNlcylcbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldENoYXJhY3RlcigpLCAnY2hhcmFjdGVyLWxheWVyJylcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJhY3RlciByZW5kZXJlZCcpXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIGNvbnN0IGNoYXJhY3RlciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdjaGFyYWN0ZXInLFxuICAgICAgICAgICAgZWxlbWVudDogJ0AnLFxuICAgICAgICAgICAgY2xzOiAnY2hhcmFjdGVyJyxcbiAgICAgICAgICAgIGxlZnQ6IGNzc0xlZnQsXG4gICAgICAgICAgICB0b3A6IGNzc1RvcCxcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlclxuICAgIH1cblxuICAgIGdldEFjdGlvbihmbk5hbWUsIGFyZykge1xuICAgICAgICByZXR1cm4gdGhpc1tmbk5hbWVdLmJpbmQodGhpcywgYXJnKVxuICAgIH1cblxuICAgIG1vdmUoZGlyZWN0aW9uKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGAke2RpcmVjdGlvbn1gKVxuICAgICAgICB0aGlzLmxvY2F0aW9uID0gdGhpcy51cGRhdGVHcmlkSW5kaWNlcyh0aGlzLmdldENoYXJhY3RlcigpLCBESVJFQ1RJT05TW2RpcmVjdGlvbl0pXG4gICAgICAgIC8vIGNvbnN0IGNoYXIgPSB0aGlzLmdldENoYXJhY3RlcigpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsb2NhdGlvbicsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIHRoaXMubWFwLmNoZWNrQ2hhcmFjdGVyTG9jYXRpb24oKVxuXG4gICAgICAgIGlmICh0aGlzLkVNKSB7XG4gICAgICAgICAgICB0aGlzLkVNLnB1Ymxpc2goJ2NoYXJhY3Rlci1tb3ZlZCcsIHRoaXMubG9jYXRpb24pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlckxheWVyKHRoaXMuZ2V0Q2hhcmFjdGVyKCksICdjaGFyYWN0ZXItbGF5ZXInKVxuICAgIH1cblxuICAgIC8vIGV2ZW50bWFuYWdlciB0ZXN0aW5nXG4gICAgc2V0RXZlbnRNYW5hZ2VyKGV2ZW50TWFuYWdlcikge1xuICAgICAgICB0aGlzLkVNID0gZXZlbnRNYW5hZ2VyXG4gICAgfVxuXG4gICAgdGFrZUl0ZW0oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhdHRlbXB0aW5nIHRvIHRha2UgaXRlbS4uLicpXG4gICAgICAgIHRoaXMuRU0ucHVibGlzaCgnaXRlbSB0YWtlbicpXG4gICAgICAgIGNvbnNvbGUubG9nKCdldmVudHMgcmVtYWluaW5nOicsIHRoaXMuRU0uZ2V0RXZlbnRzTGlzdCgpKVxuICAgIH1cbn1cblxuXG5cblxuXG5jbGFzcyBJdGVtIGV4dGVuZHMgTW92ZWFibGUge1xuICAgIGNvbnN0cnVjdG9yKG1hcCwgaXRlbU9iamVjdCkge1xuICAgICAgICBzdXBlcihtYXApXG4gICAgICAgIHRoaXMuaXRlbSA9IGl0ZW1PYmplY3RcbiAgICAgICAgdGhpcy5pbml0aWFsR3JpZEluZGljZXMgPSBtYXAuZ2V0UmFuZG9tTWFwTG9jYXRpb24oKVxuICAgICAgICB0aGlzLnNldEluaXRpYWxHcmlkSW5kaWNlcyh0aGlzLmluaXRpYWxHcmlkSW5kaWNlcylcbiAgICAgICAgdGhpcy5zZXRHcmlkSW5kaWNlcygpXG4gICAgICAgIHRoaXMuc2V0Q29vcmRpbmF0ZXMoKVxuXG5cbiAgICAgICAgdGhpcy5yZW5kZXJMYXllcih0aGlzLmdldEl0ZW0oKSwgJ2l0ZW0tbGF5ZXInKSAgLy8gaXNzdWVzIHdpdGggcmVuZGVyaW5nIG11bHRpcGxlIGl0ZW1zXG5cbiAgICAgICAgY29uc29sZS5sb2coYGl0ZW0gJHt0aGlzLml0ZW0ubmFtZX0gcmVuZGVyZWQgYXQgJHt0aGlzLmluaXRpYWxHcmlkSW5kaWNlc31gKVxuXG4gICAgfVxuXG4gICAgZ2V0SXRlbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbVxuICAgIH1cblxuICAgIHNldENvb3JkaW5hdGVzKCkge1xuICAgICAgICBjb25zdCB7IGNzc0xlZnQsIGNzc1RvcCB9ID0gdGhpcy5nZXRDU1NDb29yZGluYXRlcygpXG4gICAgICAgIHRoaXMuaXRlbS5sZWZ0ID0gY3NzTGVmdFxuICAgICAgICB0aGlzLml0ZW0udG9wID0gY3NzVG9wXG4gICAgfVxuXG4gICAgc2V0R3JpZEluZGljZXMoKSB7XG4gICAgICAgIHRoaXMuaXRlbS54ID0gdGhpcy5ncmlkSW5kaWNlc1swXVxuICAgICAgICB0aGlzLml0ZW0ueSA9IHRoaXMuZ3JpZEluZGljZXNbMV1cbiAgICB9XG5cblxuICAgIC8vIGV2ZW50bWFuYWdlciB0ZXN0aW5nXG5cbiAgICBzZXRFdmVudE1hbmFnZXIoZXZlbnRNYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuRU0gPSBldmVudE1hbmFnZXJcbiAgICAgICAgdGhpcy5FTS5zdWJzY3JpYmUoJ2l0ZW0gdGFrZW4nLCB0aGlzLm9uVGFrZSwgdGhpcylcbiAgICAgICAgY29uc29sZS5sb2coJ2V2ZW50cyBsaXN0JywgdGhpcy5FTS5nZXRFdmVudHNMaXN0KCkpXG4gICAgfVxuXG4gICAgb25UYWtlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLml0ZW0ubmFtZX0gdGFrZW4hYClcbiAgICB9XG59XG5cblxuY2xhc3MgSXRlbUdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IobWFwLCBldmVudE1hbmFnZXIsIG51bWJlck9mSXRlbXMpIHtcbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcbiAgICAgICAgdGhpcy5udW1iZXJPZkl0ZW1zID0gbnVtYmVyT2ZJdGVtc1xuICAgICAgICB0aGlzLmRhdGEgPSBuZXcgSXRlbURhdGEoKVxuXG4gICAgICAgIC8vIGV2ZW50bWFuYWdlciB0ZXN0aW5nXG5cbiAgICAgICAgdGhpcy5FTSA9IGV2ZW50TWFuYWdlclxuXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVJdGVtcygpXG4gICAgfVxuXG4gICAgZ2V0UmFuZG9tSXRlbXMoKSB7XG4gICAgICAgIGNvbnN0IGFsbEl0ZW1zID0gdGhpcy5kYXRhLml0ZW1zXG4gICAgICAgIGNvbnN0IHJhbmRvbUl0ZW1zID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bWJlck9mSXRlbXM7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tSXRlbSA9IGFsbEl0ZW1zW1V0aWxpdHkucmFuZG9taXplKGFsbEl0ZW1zLmxlbmd0aCldXG4gICAgICAgICAgICByYW5kb21JdGVtcy5wdXNoKHJhbmRvbUl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJhbmRvbUl0ZW1zXG4gICAgfVxuXG4gICAgZ2VuZXJhdGVJdGVtcygpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tSXRlbXMgPSB0aGlzLmdldFJhbmRvbUl0ZW1zKClcbiAgICAgICAgcmFuZG9tSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIHRoaXMubmV3SXRlbSA9IG5ldyBJdGVtKHRoaXMubWFwLCBpdGVtKVxuXG5cbiAgICAgICAgICAgIC8vIGV2ZW50bWFuYWdlciB0ZXN0aW5nXG5cbiAgICAgICAgICAgIHRoaXMubmV3SXRlbS5zZXRFdmVudE1hbmFnZXIodGhpcy5FTSlcblxuICAgICAgICAgICAgdGhpcy5tYXAucHVzaEl0ZW0odGhpcy5uZXdJdGVtLml0ZW0pICAvLyBobW1tLi4uIHB1c2hJdGVtcyByZWZyZXNoZXMgZWFjaCB0aW1lIGdlbmVyYXRlSXRlbXMgaXMgY2FsbGVkP1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2l0ZW0gZ2VuZXJhdGVkOicsIHRoaXMubmV3SXRlbS5pdGVtKVxuICAgICAgICB9KVxuICAgIH1cblxuXG5cbn1cblxuXG5jbGFzcyBJdGVtRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zKClcbiAgICB9XG5cbiAgICBpdGVtcygpIHtcbiAgICAgICAgY29uc3QgcGFydGljbGVNaW5lciA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdwYXJ0aWNsZSBtaW5lcicsXG4gICAgICAgICAgICBlbGVtZW50OiAnfCcsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBjbHM6ICdpdGVtIG1pbmVyJ1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJsdWVwcmludCA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdibHVlcHJpbnQnLFxuICAgICAgICAgICAgZWxlbWVudDogJz8nLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgY2xzOiAnaXRlbSBibHVlcHJpbnQnXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJ0aWZpY2lhbE11c2NsZSA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdhcnRpZmljaWFsIG11c2NsZScsXG4gICAgICAgICAgICBlbGVtZW50OiAnJicsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBjbHM6ICdpdGVtIG11c2NsZSdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmludGVyID0ge1xuICAgICAgICAgICAgbmFtZTogJzNEIHByaW50ZXInLFxuICAgICAgICAgICAgZWxlbWVudDogJyMnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgY2xzOiAnaXRlbSBwcmludGVyJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbcGFydGljbGVNaW5lciwgYmx1ZXByaW50LCBhcnRpZmljaWFsTXVzY2xlLCBwcmludGVyXVxuICAgIH1cbn1cblxuXG4vLyBldmVudG1hbmFnZXIgdGVzdGluZ1xuY2xhc3MgRXZlbnRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudHNMaXN0ID0gW10gICAgICAgIC8vIGNyZWF0ZSBhcnJheSBvZiBldmVudHNcbiAgICB9XG5cbiAgICBzdWJzY3JpYmUoZXZlbnQsIGZuLCB0aGlzVmFsdWUsIG9uY2U9ZmFsc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7ICAgLy8gaWYgbm8gdGhpc1ZhbHVlIHByb3ZpZGVkLCBiaW5kcyB0aGUgZm4gdG8gdGhlIGZuPz9cbiAgICAgICAgICAgIHRoaXNWYWx1ZSA9IGZuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ldmVudHNMaXN0LnB1c2goeyAgICAgIC8vIGNyZWF0ZSBvYmplY3RzIGxpbmtpbmcgZXZlbnRzICsgZnVuY3Rpb25zIHRvIHBlcmZvcm1cbiAgICAgICAgICAgIGV2ZW50OiBldmVudCwgICAgICAgICAgIC8vIHB1c2ggZW0gdG8gdGhlIGFycmF5XG4gICAgICAgICAgICBmbjogZm4sXG4gICAgICAgICAgICBvbmNlOiBvbmNlLFxuICAgICAgICAgICAgdGhpc1ZhbHVlOiB0aGlzVmFsdWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwdWJsaXNoKGV2ZW50LCBhcmcpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c0xpc3RbaV0uZXZlbnQgPT09IGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB0aGlzVmFsdWUsIGZuLCBvbmNlIH0gPSB0aGlzLmV2ZW50c0xpc3RbaV1cblxuICAgICAgICAgICAgICAgIGZuLmNhbGwodGhpc1ZhbHVlLCBhcmcpXG5cbiAgICAgICAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c0xpc3Quc3BsaWNlKGksIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzTGlzdFxuICAgIH1cbn1cblxuXG5jbGFzcyBTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKEVNKSB7XG4gICAgICAgIEVNLnN1YnNjcmliZSgnY2hhcmFjdGVyLW1vdmVkJywgdGhpcy51cGRhdGUsIHRoaXMpXG4gICAgfVxuXG4gICAgdXBkYXRlKGxvY2F0aW9uKSB7XG4gICAgICAgIHRoaXMuc2V0KGxvY2F0aW9uLmRlc2NyaXB0aW9uKVxuICAgIH1cblxuICAgIHNldChkZXNjcmlwdGlvbikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJykuaW5uZXJIVE1MID0gZGVzY3JpcHRpb25cbiAgICB9XG59XG5cblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdEdhbWUoKSB7XG4gICAgICAgIHRoaXMuc3BhY2VzID0gW11cbiAgICAgICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlXG4gICAgICAgIHRoaXMubWFwID0gbmV3IE1hcCg2MCwgNjApXG4gICAgICAgIHRoaXMuc2NlbmVyeSA9IG5ldyBTY2VuZXJ5KHRoaXMubWFwKVxuICAgICAgICB0aGlzLmNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIodGhpcy5tYXApXG4gICAgICAgIHRoaXMubWFwLnNldENoYXJhY3Rlcih0aGlzLmNoYXJhY3RlcikgIC8vIGdpdmVzIG1hcCByZWZlcmVuY2UgdG8gY2hhcmFjdGVyXG5cblxuICAgICAgICAvLyBldmVudG1hbmFnZXIgdGVzdGluZ1xuICAgICAgICB0aGlzLkVNID0gbmV3IEV2ZW50TWFuYWdlcigpICAvLyBjcmVhdGUgb25seSBvbmUgRU0gPyBvciBtdWx0aXBsZSA/XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyLnNldEV2ZW50TWFuYWdlcih0aGlzLkVNKVxuICAgICAgICB0aGlzLm1hcC5zZXRFdmVudE1hbmFnZXIodGhpcy5FTSlcblxuICAgICAgICAvLyB0cnkgZ2VuZXJhdGluZyBmcm9tIGEgc2V0IG9mIHN0b2NrIGl0ZW1zXG4gICAgICAgIC8vIGJ1Zzogb25seSB0aGUgbGFzdCBpdGVtIGdlbmVyYXRlZCB3aWxsIGRpc3BsYXkhIVxuICAgICAgICAvLyB0ZXN0aW5nIHdpdGggb25lIGl0ZW0gZ2VuZXJhdGVkIC4uLlxuICAgICAgICB0aGlzLml0ZW1HZW5lcmF0b3IgPSBuZXcgSXRlbUdlbmVyYXRvcih0aGlzLm1hcCwgdGhpcy5FTSwgNSkgIC8vIGhhdmUgdG8gcGFzcyBpbiBFTSB0byBnZW5lcmF0b3IgKGluZWxlZ2FudClcblxuICAgICAgICB0aGlzLnN0YXR1cyA9IG5ldyBTdGF0dXModGhpcy5FTSlcbiAgICAgICAgdGhpcy5zdGF0dXMuc2V0KCd5b3Ugd2FrZSB1cCcpXG5cbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuaW5pdFVzZXJJbnB1dCgpXG4gICAgfVxuXG4gICAgaW5pdFVzZXJJbnB1dCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VySW5wdXQoe1xuICAgICAgICAgICAgJzM4JzogdGhpcy5jaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ25vcnRoJyksXG4gICAgICAgICAgICAnMzcnOiB0aGlzLmNoYXJhY3Rlci5nZXRBY3Rpb24oJ21vdmUnLCAnd2VzdCcpLFxuICAgICAgICAgICAgJzM5JzogdGhpcy5jaGFyYWN0ZXIuZ2V0QWN0aW9uKCdtb3ZlJywgJ2Vhc3QnKSxcbiAgICAgICAgICAgICc0MCc6IHRoaXMuY2hhcmFjdGVyLmdldEFjdGlvbignbW92ZScsICdzb3V0aCcpLFxuICAgICAgICAgICAgJzg0JzogdGhpcy5jaGFyYWN0ZXIuZ2V0QWN0aW9uKCd0YWtlSXRlbScsICdpdGVtJykgLy8gKHQpYWtlIGl0ZW1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGFydEdhbWUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydCEnKVxuICAgIH1cblxuICAgIGdhbWVJc092ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWVPdmVyXG4gICAgfVxuXG4gICAgZXhwbG9yZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coYGV4cGxvcmluZyB0aGUgJHt0aGlzLmtpbmR9IHpvbmUhYClcbiAgICB9XG59XG5cblxuY2xhc3MgVXNlcklucHV0IHtcbiAgICBjb25zdHJ1Y3RvcihrZXlBY3Rpb25NYXApIHtcbiAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXAgPSBrZXlBY3Rpb25NYXBcblxuICAgICAgICBkb2N1bWVudC5vbmtleWRvd24gPSB0aGlzLnRyeUFjdGlvbkZvckV2ZW50LmJpbmQodGhpcylcbiAgICB9XG5cbiAgICB0cnlBY3Rpb25Gb3JFdmVudChldmVudCkge1xuICAgICAgICBpZiAoIVV0aWxpdHkuY29udGFpbnModGhpcy5rZXlBY3Rpb25NYXAsIGV2ZW50LmtleUNvZGUpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgbm90IGEgdmFsaWQga2V5Y29kZTogJHtldmVudC5rZXlDb2RlfWApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmtleUFjdGlvbk1hcFtldmVudC5rZXlDb2RlXSgpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBHYW1lKCk7XG4iLCJjb25zdCBmb28gPSAnYmFyNidcblxuZXhwb3J0IGRlZmF1bHQgZm9vXG4iXX0=
