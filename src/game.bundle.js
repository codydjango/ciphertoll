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

var LANDSCAPE = [{
    element: '.',
    description: '',
    probability: 28
}, {
    element: ',',
    description: '',
    probability: 28
}, {
    element: ';',
    description: '',
    probability: 22
}, {
    element: '^',
    description: '',
    probability: 22
}, {
    element: '*',
    description: '',
    probability: 22
}, {
    element: ';',
    description: '',
    probability: 22
}, {
    element: '^',
    description: '',
    probability: 22
}, {
    element: '*',
    description: '',
    probability: 22
}];

// klhjkhjklh

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, null, [{
        key: 'contains',
        value: function contains(obj, property) {
            return Object.keys(obj).indexOf(String(property)) !== -1;
        }
    }]);

    return Utility;
}();

var MapGenerator = function () {
    function MapGenerator(col, row) {
        _classCallCheck(this, MapGenerator);

        console.log('generating map');
        var grid = this.init(col, row);
        var seededGrid = this.seed(grid);
        this.seededGrid = seededGrid;

        this.grow();
    }

    _createClass(MapGenerator, [{
        key: 'getMap',
        value: function getMap() {
            return this.seededGrid;
        }
    }, {
        key: 'init',
        value: function init(col, row) {
            // create array of size col, row
            // populate with value '.'
            this._col = col;
            this._row = row;
            var bareLandscape = '&nbsp;';
            this.bareLandscape = bareLandscape;
            var grid = [];

            for (var i = 0; i < row; i++) {
                grid[i] = [];
                for (var j = 0; j < col; j++) {
                    grid[i].push(bareLandscape);
                }
            }
            return grid;
        }
    }, {
        key: 'seed',
        value: function seed(grid) {
            var numberOfElementSeeds = this.getNumberOfElementSeeds();
            var randomElements = [];
            for (var i = 0; i < numberOfElementSeeds; i++) {
                var randomElementIndex = this.randomize(LANDSCAPE.length);
                var randomElement = LANDSCAPE[randomElementIndex];
                randomElements.push(randomElement);
            }

            var seeds = this.generateSeedLocations(randomElements);
            seeds.map(function (seed) {
                return grid[seed.x][seed.y] = seed.element;
            });
            // console.log('seeds: ', seeds)
            this._seeds = seeds;

            return grid;
        }
    }, {
        key: 'getNumberOfElementSeeds',
        value: function getNumberOfElementSeeds() {
            //  return 1        // test setting
            // return ((this._col * this._row) / (this._col + this._row))  // sparse initial seeding
            return this._col + this._row; // rich initial seeding
        }
    }, {
        key: 'randomize',
        value: function randomize(mult) {
            return Math.floor(Math.random() * mult);
        }
    }, {
        key: 'generateSeedLocations',
        value: function generateSeedLocations(randomElements) {
            var _this = this;

            // create array of objects
            var seeds = randomElements.map(function (el) {
                el.x = _this.randomize(_this._row - 1);
                el.y = _this.randomize(_this._col - 1);
                return el;
            });
            return seeds;
        }
    }, {
        key: 'grow',
        value: function grow() {
            var _this2 = this;

            var seeds = this._seeds;
            var mapPopulated = false;

            var _loop = function _loop() {
                // introduce while loop to populate entire map

                var nextGenSeeds = _this2.getNextGenSeeds(seeds); // get next generation of seeds

                if (nextGenSeeds.length === 0) {
                    mapPopulated = true;
                }

                var goodSeeds = []; // goodSeeds clears itself automatically
                _this2.goodSeeds = goodSeeds;

                nextGenSeeds.forEach(function (seed) {
                    var checkedSeed = _this2.checkSeed(seed); // check that seed is on map
                    if (checkedSeed !== null) {
                        goodSeeds.push(checkedSeed); // problem: goodSeed is too large
                    }
                });

                // console.log('goodSeeds: ', goodSeeds)

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = goodSeeds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var goodSeed = _step.value;

                        var x = goodSeed.x;
                        var y = goodSeed.y;
                        if (_this2.seededGrid[x][y] === _this2.bareLandscape) {
                            _this2.seededGrid[x][y] = goodSeed.element; // inject seed into grid
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

                var unseededLocations = _this2.countUnseeded(); // find number of unseeded locations
                console.log('unseededLocations: ', unseededLocations);
                if (unseededLocations === 0) {
                    mapPopulated = true; // loop until all locations are seeded
                } else {
                    seeds = goodSeeds; // feed all goodSeeds back into the grower
                }
            };

            while (mapPopulated === false) {
                _loop();
            }
        }
    }, {
        key: 'countUnseeded',
        value: function countUnseeded() {
            var flattenedGrid = [].concat.apply([], this.seededGrid);
            var count = 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = flattenedGrid[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var i = _step2.value;

                    if (i === this.bareLandscape) {
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
            var x = seed.x;
            var y = seed.y;
            var seedSucceeds = false;

            // check that seed is within grid bounds
            if (y < this._col && y >= 0 && x < this._row && x >= 0) {
                seedSucceeds = true;
            } else {
                return null;
            }

            // check that seed location is not already seeded
            if (this.seededGrid[x][y] !== this.bareLandscape) {
                seedSucceeds = false;
            }

            // check that seed location is not already waiting to be seeded
            this.goodSeeds.forEach(function (goodSeed) {
                if (x === goodSeed.x && y === goodSeed.y) {
                    seedSucceeds = false;
                }
            });

            if (seedSucceeds === true) {
                return seed;
            } else {
                return null;
            }
        }
    }, {
        key: 'getNextGenSeeds',
        value: function getNextGenSeeds(seeds) {
            var _this3 = this;

            var nextGenSeeds = [];
            seeds.forEach(function (originalSeed) {

                for (var direction in DIRECTIONS) {
                    // for each direction
                    var directionValues = DIRECTIONS[direction];
                    var nextGenSeed = Object.assign({}, originalSeed);

                    var percentage = nextGenSeed.probability;
                    var probabilityCheck = _this3.probability(percentage);

                    if (probabilityCheck === true) {

                        for (var key in directionValues) {
                            // for each key in each direction
                            if (key === 'x') {
                                nextGenSeed.x = originalSeed.x + directionValues[key]; // move from seeded location to new location
                            } else if (key === 'y') {
                                nextGenSeed.y = originalSeed.y + directionValues[key]; // currently only works for seed element 0
                            }
                        }
                        nextGenSeeds.push(nextGenSeed);
                    }
                }
            });

            console.log('nextGenSeeds: ', nextGenSeeds);

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
            // console.log('probabilityArray: ', probabilityArray)

            var index = this.randomize(100);
            // console.log(probabilityArray[index])

            return probabilityArray[index];
        }
    }]);

    return MapGenerator;
}();

var Map = function () {
    function Map(col, row) {
        _classCallCheck(this, Map);

        this.generatedMap = new MapGenerator(col, row);

        console.log('map instantiated');
        this.setInitialCharacterCoordinates();

        this.render();
    }

    _createClass(Map, [{
        key: 'setInitialCharacterCoordinates',
        value: function setInitialCharacterCoordinates() {
            var initialCoordinates = [9, 9];
            var x = initialCoordinates[0];
            var y = initialCoordinates[1];

            var characterLocation = this.generatedMap.seededGrid[y][x];

            console.log('character coordinates: ' + initialCoordinates);
            console.log('character location: ' + characterLocation);

            this.coordinates = initialCoordinates;
        }
    }, {
        key: 'updateCharacterCoordinates',
        value: function updateCharacterCoordinates(move) {
            var newCoordinates = [this.coordinates[0] + move.x, this.coordinates[1] + move.y];
            console.log('character coordinates: ' + newCoordinates);

            var x = newCoordinates[0];
            var y = newCoordinates[1];

            var characterLocation = this.generatedMap.seededGrid[y][x];

            console.log('character location: ' + characterLocation);

            this.coordinates = newCoordinates;
        }
    }, {
        key: 'moveDudeNorth',
        value: function moveDudeNorth() {
            console.log('north');
            this.updateCharacterCoordinates(DIRECTIONS.north);
            this.render();
        }
    }, {
        key: 'moveDudeSouth',
        value: function moveDudeSouth() {
            console.log('south');
            this.updateCharacterCoordinates(DIRECTIONS.south);
            this.render();
        }
    }, {
        key: 'moveDudeWest',
        value: function moveDudeWest() {
            console.log('west');
            this.updateCharacterCoordinates(DIRECTIONS.west);
            this.render();
        }
    }, {
        key: 'moveDudeEast',
        value: function moveDudeEast() {
            console.log('east');
            this.updateCharacterCoordinates(DIRECTIONS.east);
            this.render();
        }
    }, {
        key: 'getCharacter',
        value: function getCharacter() {
            var character = '@';
            return character;
        }
    }, {
        key: 'renderItem',
        value: function renderItem(item) {
            var cls = '';
            if (item === '@') {
                cls = 'character';
            }
            return '<span class="item ' + cls + '">' + item + '</span>';
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            // convert 2D array map into browser-displayable strings
            var displayGrid = this.generatedMap.seededGrid.map(function (arr) {
                return arr.slice();
            });

            var x = this.coordinates[0];
            var y = this.coordinates[1];

            displayGrid[y][x] = this.getCharacter();

            var renderedGrid = [];

            for (var i = 0; i < displayGrid.length; i++) {
                var rowItems = displayGrid[i];
                var row = rowItems.reduce(function (sum, item) {
                    return sum + _this4.renderItem(item);
                }, '');

                renderedGrid.push(row);
            }

            var gridToHTML = renderedGrid.join('<br />');

            // display the rendered app
            var el = document.getElementById('map');
            el.innerHTML = gridToHTML;
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.render();
        }
    }]);

    return Map;
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
            this.input = this.initUserInput();
        }
    }, {
        key: 'initUserInput',
        value: function initUserInput() {
            return new UserInput({
                '38': this.map.moveDudeNorth.bind(this.map),
                '37': this.map.moveDudeWest.bind(this.map),
                '39': this.map.moveDudeEast.bind(this.map),
                '40': this.map.moveDudeSouth.bind(this.map)
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

//     giveOptionForAction() {
// if (window.prompt('Exit?', 'Sure') === 'Sure') {
// this.gameOver = true
// }

// actions could have constraints, such as
//     -only can take one action of this type at a time
//     - action requires cooldown
//     - action requires prep
//     - action costs resources


// ask player for action
// process action
// calculate stats
// }

},{"./test":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var foo = 'bar5';

exports.default = foo;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvanMvR2FtZS5qcyIsInNyYy9qcy90ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsT0FBTyxJQUFQOzs7Ozs7Ozs7OztBQ0ZBOzs7Ozs7OztBQUVBOztBQUVBLElBQU0sYUFBYTtBQUNmLFdBQU8sRUFBRSxHQUFHLENBQUwsRUFBUSxHQUFHLENBQUMsQ0FBWixFQURRO0FBRWYsV0FBTyxFQUFFLEdBQUcsQ0FBTCxFQUFRLEdBQUcsQ0FBWCxFQUZRO0FBR2YsVUFBTSxFQUFFLEdBQUcsQ0FBTCxFQUFRLEdBQUcsQ0FBWCxFQUhTO0FBSWYsVUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFOLEVBQVMsR0FBRyxDQUFaLEVBSlM7QUFLZixlQUFXLEVBQUUsR0FBRyxDQUFDLENBQU4sRUFBUyxHQUFHLENBQUMsQ0FBYixFQUxJO0FBTWYsZUFBVyxFQUFFLEdBQUcsQ0FBTCxFQUFRLEdBQUcsQ0FBQyxDQUFaLEVBTkk7QUFPZixlQUFXLEVBQUUsR0FBRyxDQUFMLEVBQVEsR0FBRyxDQUFYLEVBUEk7QUFRZixlQUFXLEVBQUUsR0FBRyxDQUFDLENBQU4sRUFBUyxHQUFHLENBQVo7QUFSSSxDQUFuQjs7QUFXQSxJQUFNLFlBQVksQ0FDZDtBQUNJLGFBQVMsR0FEYjtBQUVJLGlCQUFhLEVBRmpCO0FBR0ksaUJBQWE7QUFIakIsQ0FEYyxFQUtYO0FBQ0MsYUFBUyxHQURWO0FBRUMsaUJBQWEsRUFGZDtBQUdDLGlCQUFhO0FBSGQsQ0FMVyxFQVNYO0FBQ0MsYUFBUyxHQURWO0FBRUMsaUJBQWEsRUFGZDtBQUdDLGlCQUFhO0FBSGQsQ0FUVyxFQWFYO0FBQ0MsYUFBUyxHQURWO0FBRUMsaUJBQWEsRUFGZDtBQUdDLGlCQUFhO0FBSGQsQ0FiVyxFQWlCWDtBQUNDLGFBQVMsR0FEVjtBQUVDLGlCQUFhLEVBRmQ7QUFHQyxpQkFB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Q0FBc0IsSUFBdEIsQ0FBMkIsS0FBSyxHQUFoQyxDQUhXO0FBSWpCLHNCQUFNLEtBQUssR0FBTCxDQUFTLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBNEIsS0FBSyxHQUFqQztBQUpXLGFBQWQsQ0FBUDtBQU1IOzs7b0NBRVc7QUFDUixvQkFBUSxHQUFSLENBQVksUUFBWjtBQUNIOzs7cUNBRVk7QUFDVCxtQkFBTyxLQUFLLFFBQVo7QUFDSDs7O2tDQUVTO0FBQ04sb0JBQVEsR0FBUixvQkFBNkIsS0FBSyxJQUFsQztBQUNIOzs7Ozs7SUFJQyxTO0FBQ0YsdUJBQVksWUFBWixFQUEwQjtBQUFBOztBQUN0QixhQUFLLFlBQUwsR0FBb0IsWUFBcEI7O0FBRUEsaUJBQVMsU0FBVCxHQUFxQixLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQXJCO0FBQ0g7Ozs7MENBRWlCLEssRUFBTztBQUNyQixnQkFBSSxDQUFDLFFBQVEsUUFBUixDQUFpQixLQUFLLFlBQXRCLEVBQW9DLE1BQU0sT0FBMUMsQ0FBTCxFQUF5RDtBQUNyRCx3QkFBUSxHQUFSLDJCQUFvQyxNQUFNLE9BQTFDO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUssWUFBTCxDQUFrQixNQUFNLE9BQXhCO0FBQ0g7QUFDSjs7Ozs7O2tCQUdVLElBQUksSUFBSixFOztBQUlmO0FBQ1E7QUFDSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNKOzs7Ozs7OztBQ2hjSixJQUFNLE1BQU0sTUFBWjs7a0JBRWUsRyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IGdhbWUgZnJvbSAnLi9qcy9HYW1lJ1xuXG53aW5kb3cuZ2FtZSA9IGdhbWVcbiIsImltcG9ydCBmb28gZnJvbSAnLi90ZXN0J1xuXG5hbGVydChgZm9vOiAke2Zvb31gKVxuXG5jb25zdCBESVJFQ1RJT05TID0ge1xuICAgIG5vcnRoOiB7IHg6IDAsIHk6IC0xIH0sXG4gICAgc291dGg6IHsgeDogMCwgeTogMSB9LFxuICAgIGVhc3Q6IHsgeDogMSwgeTogMCB9LFxuICAgIHdlc3Q6IHsgeDogLTEsIHk6IDAgfSxcbiAgICBub3J0aHdlc3Q6IHsgeDogLTEsIHk6IC0xIH0sXG4gICAgbm9ydGhlYXN0OiB7IHg6IDEsIHk6IC0xIH0sXG4gICAgc291dGhlYXN0OiB7IHg6IDEsIHk6IDEgfSxcbiAgICBzb3V0aHdlc3Q6IHsgeDogLTEsIHk6IDEgfVxufVxuXG5jb25zdCBMQU5EU0NBUEUgPSBbXG4gICAge1xuICAgICAgICBlbGVtZW50OiAnLicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgcHJvYmFiaWxpdHk6IDI4XG4gICAgfSwge1xuICAgICAgICBlbGVtZW50OiAnLCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgcHJvYmFiaWxpdHk6IDI4XG4gICAgfSwge1xuICAgICAgICBlbGVtZW50OiAnOycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgcHJvYmFiaWxpdHk6IDIyXG4gICAgfSwge1xuICAgICAgICBlbGVtZW50OiAnXicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgcHJvYmFiaWxpdHk6IDIyXG4gICAgfSwge1xuICAgICAgICBlbGVtZW50OiAnKicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgcHJvYmFiaWxpdHk6IDIyXG4gICAgfSwge1xuICAgICAgICBlbGVtZW50OiAnOycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgcHJvYmFiaWxpdHk6IDIyXG4gICAgfSwge1xuICAgICAgICBlbGVtZW50OiAnXicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgcHJvYmFiaWxpdHk6IDIyXG4gICAgfSwge1xuICAgICAgICBlbGVtZW50OiAnKicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgcHJvYmFiaWxpdHk6IDIyXG4gICAgfVxuXVxuXG4vLyBrbGhqa2hqa2xoXG5jbGFzcyBVdGlsaXR5IHtcbiAgICBzdGF0aWMgY29udGFpbnMob2JqLCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5pbmRleE9mKFN0cmluZyhwcm9wZXJ0eSkpICE9PSAtMVxuICAgIH1cbn1cblxuXG5jbGFzcyBNYXBHZW5lcmF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKGNvbCwgcm93KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnZW5lcmF0aW5nIG1hcCcpXG4gICAgICAgIGNvbnN0IGdyaWQgPSB0aGlzLmluaXQoY29sLCByb3cpXG4gICAgICAgIGNvbnN0IHNlZWRlZEdyaWQgPSB0aGlzLnNlZWQoZ3JpZClcbiAgICAgICAgdGhpcy5zZWVkZWRHcmlkID0gc2VlZGVkR3JpZFxuXG4gICAgICAgIHRoaXMuZ3JvdygpXG4gICAgfVxuXG4gICAgZ2V0TWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWVkZWRHcmlkXG4gICAgfVxuXG4gICAgaW5pdChjb2wsIHJvdykge1xuICAgICAgICAvLyBjcmVhdGUgYXJyYXkgb2Ygc2l6ZSBjb2wsIHJvd1xuICAgICAgICAvLyBwb3B1bGF0ZSB3aXRoIHZhbHVlICcuJ1xuICAgICAgICB0aGlzLl9jb2wgPSBjb2xcbiAgICAgICAgdGhpcy5fcm93ID0gcm93XG4gICAgICAgIGNvbnN0IGJhcmVMYW5kc2NhcGUgPSAnJm5ic3A7J1xuICAgICAgICB0aGlzLmJhcmVMYW5kc2NhcGUgPSBiYXJlTGFuZHNjYXBlXG4gICAgICAgIGNvbnN0IGdyaWQgPSBbXVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93OyBpKyspIHtcbiAgICAgICAgICAgIGdyaWRbaV0gPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2w7IGorKykge1xuICAgICAgICAgICAgICAgIGdyaWRbaV0ucHVzaChiYXJlTGFuZHNjYXBlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgc2VlZChncmlkKSB7XG4gICAgICAgIGNvbnN0IG51bWJlck9mRWxlbWVudFNlZWRzID0gdGhpcy5nZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpXG4gICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZkVsZW1lbnRTZWVkczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21FbGVtZW50SW5kZXggPSB0aGlzLnJhbmRvbWl6ZShMQU5EU0NBUEUubGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUVsZW1lbnQgPSBMQU5EU0NBUEVbcmFuZG9tRWxlbWVudEluZGV4XTtcbiAgICAgICAgICAgIHJhbmRvbUVsZW1lbnRzLnB1c2gocmFuZG9tRWxlbWVudClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlZWRzID0gdGhpcy5nZW5lcmF0ZVNlZWRMb2NhdGlvbnMocmFuZG9tRWxlbWVudHMpXG4gICAgICAgIHNlZWRzLm1hcChzZWVkID0+IGdyaWRbc2VlZC54XVtzZWVkLnldID0gc2VlZC5lbGVtZW50KVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2VlZHM6ICcsIHNlZWRzKVxuICAgICAgICB0aGlzLl9zZWVkcyA9IHNlZWRzXG5cbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICBnZXROdW1iZXJPZkVsZW1lbnRTZWVkcygpIHtcbiAgICAgICAgLy8gIHJldHVybiAxICAgICAgICAvLyB0ZXN0IHNldHRpbmdcbiAgICAgICAgLy8gcmV0dXJuICgodGhpcy5fY29sICogdGhpcy5fcm93KSAvICh0aGlzLl9jb2wgKyB0aGlzLl9yb3cpKSAgLy8gc3BhcnNlIGluaXRpYWwgc2VlZGluZ1xuICAgICAgICByZXR1cm4gKHRoaXMuX2NvbCArIHRoaXMuX3JvdykgIC8vIHJpY2ggaW5pdGlhbCBzZWVkaW5nXG4gICAgfVxuXG4gICAgcmFuZG9taXplKG11bHQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG11bHQpXG4gICAgfVxuXG4gICAgZ2VuZXJhdGVTZWVkTG9jYXRpb25zKHJhbmRvbUVsZW1lbnRzKSB7ICAvLyBjcmVhdGUgYXJyYXkgb2Ygb2JqZWN0c1xuICAgICAgICBjb25zdCBzZWVkcyA9IHJhbmRvbUVsZW1lbnRzLm1hcChlbCA9PiB7XG4gICAgICAgICAgICBlbC54ID0gdGhpcy5yYW5kb21pemUodGhpcy5fcm93IC0gMSlcbiAgICAgICAgICAgIGVsLnkgPSB0aGlzLnJhbmRvbWl6ZSh0aGlzLl9jb2wgLSAxKVxuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzZWVkc1xuICAgIH1cblxuICAgIGdyb3coKSB7XG4gICAgICAgIGxldCBzZWVkcyA9IHRoaXMuX3NlZWRzXG4gICAgICAgIGxldCBtYXBQb3B1bGF0ZWQgPSBmYWxzZVxuXG4gICAgICAgIHdoaWxlIChtYXBQb3B1bGF0ZWQgPT09IGZhbHNlKSB7ICAgLy8gaW50cm9kdWNlIHdoaWxlIGxvb3AgdG8gcG9wdWxhdGUgZW50aXJlIG1hcFxuXG4gICAgICAgICAgICBjb25zdCBuZXh0R2VuU2VlZHMgPSB0aGlzLmdldE5leHRHZW5TZWVkcyhzZWVkcykgICAgLy8gZ2V0IG5leHQgZ2VuZXJhdGlvbiBvZiBzZWVkc1xuXG4gICAgICAgICAgICBpZiAobmV4dEdlblNlZWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1hcFBvcHVsYXRlZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGdvb2RTZWVkcyA9IFtdICAvLyBnb29kU2VlZHMgY2xlYXJzIGl0c2VsZiBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgICB0aGlzLmdvb2RTZWVkcyA9IGdvb2RTZWVkc1xuXG4gICAgICAgICAgICBuZXh0R2VuU2VlZHMuZm9yRWFjaCgoc2VlZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrZWRTZWVkID0gdGhpcy5jaGVja1NlZWQoc2VlZCkgICAgLy8gY2hlY2sgdGhhdCBzZWVkIGlzIG9uIG1hcFxuICAgICAgICAgICAgICAgIGlmIChjaGVja2VkU2VlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBnb29kU2VlZHMucHVzaChjaGVja2VkU2VlZCkgLy8gcHJvYmxlbTogZ29vZFNlZWQgaXMgdG9vIGxhcmdlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2dvb2RTZWVkczogJywgZ29vZFNlZWRzKVxuXG4gICAgICAgICAgICBmb3IgKGxldCBnb29kU2VlZCBvZiBnb29kU2VlZHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gZ29vZFNlZWQueFxuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSBnb29kU2VlZC55XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFt4XVt5XSA9PT0gdGhpcy5iYXJlTGFuZHNjYXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VlZGVkR3JpZFt4XVt5XSA9IGdvb2RTZWVkLmVsZW1lbnQgICAgLy8gaW5qZWN0IHNlZWQgaW50byBncmlkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdW5zZWVkZWRMb2NhdGlvbnMgPSB0aGlzLmNvdW50VW5zZWVkZWQoKSAgICAvLyBmaW5kIG51bWJlciBvZiB1bnNlZWRlZCBsb2NhdGlvbnNcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1bnNlZWRlZExvY2F0aW9uczogJywgdW5zZWVkZWRMb2NhdGlvbnMpXG4gICAgICAgICAgICBpZiAodW5zZWVkZWRMb2NhdGlvbnMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXBQb3B1bGF0ZWQgPSB0cnVlICAgICAvLyBsb29wIHVudGlsIGFsbCBsb2NhdGlvbnMgYXJlIHNlZWRlZFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWVkcyA9IGdvb2RTZWVkcyAgLy8gZmVlZCBhbGwgZ29vZFNlZWRzIGJhY2sgaW50byB0aGUgZ3Jvd2VyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGNvdW50VW5zZWVkZWQoKSB7XG4gICAgICAgIGNvbnN0IGZsYXR0ZW5lZEdyaWQgPSBbXS5jb25jYXQuYXBwbHkoW10sIHRoaXMuc2VlZGVkR3JpZClcbiAgICAgICAgbGV0IGNvdW50ID0gMFxuICAgICAgICBmb3IgKGxldCBpIG9mIGZsYXR0ZW5lZEdyaWQpIHtcbiAgICAgICAgICAgIGlmIChpID09PSB0aGlzLmJhcmVMYW5kc2NhcGUpIHtcbiAgICAgICAgICAgICAgICBjb3VudCsrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50XG4gICAgfVxuXG5cbiAgICBjaGVja1NlZWQoc2VlZCkge1xuICAgICAgICBjb25zdCB4ID0gc2VlZC54XG4gICAgICAgIGNvbnN0IHkgPSBzZWVkLnlcbiAgICAgICAgbGV0IHNlZWRTdWNjZWVkcyA9IGZhbHNlXG5cbiAgICAgICAgLy8gY2hlY2sgdGhhdCBzZWVkIGlzIHdpdGhpbiBncmlkIGJvdW5kc1xuICAgICAgICBpZiAoKHkgPCB0aGlzLl9jb2wgJiYgeSA+PSAwKSAmJlxuICAgICAgICAgICAgKHggPCB0aGlzLl9yb3cgJiYgeCA+PSAwKSkge1xuICAgICAgICAgICAgc2VlZFN1Y2NlZWRzID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHRoYXQgc2VlZCBsb2NhdGlvbiBpcyBub3QgYWxyZWFkeSBzZWVkZWRcbiAgICAgICAgaWYgKHRoaXMuc2VlZGVkR3JpZFt4XVt5XSAhPT0gdGhpcy5iYXJlTGFuZHNjYXBlKSB7XG4gICAgICAgICAgICBzZWVkU3VjY2VlZHMgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgdGhhdCBzZWVkIGxvY2F0aW9uIGlzIG5vdCBhbHJlYWR5IHdhaXRpbmcgdG8gYmUgc2VlZGVkXG4gICAgICAgIHRoaXMuZ29vZFNlZWRzLmZvckVhY2goZ29vZFNlZWQgPT4ge1xuICAgICAgICAgICAgaWYgKCh4ID09PSBnb29kU2VlZC54KSAmJlxuICAgICAgICAgICAgICAgICh5ID09PSBnb29kU2VlZC55KSkge1xuICAgICAgICAgICAgICAgIHNlZWRTdWNjZWVkcyA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKHNlZWRTdWNjZWVkcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHNlZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgZ2V0TmV4dEdlblNlZWRzKHNlZWRzKSB7XG4gICAgICAgIGNvbnN0IG5leHRHZW5TZWVkcyA9IFtdXG4gICAgICAgIHNlZWRzLmZvckVhY2goKG9yaWdpbmFsU2VlZCkgPT4ge1xuXG4gICAgICAgICAgICBmb3IgKGxldCBkaXJlY3Rpb24gaW4gRElSRUNUSU9OUykgeyAgLy8gZm9yIGVhY2ggZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uVmFsdWVzID0gRElSRUNUSU9OU1tkaXJlY3Rpb25dXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dEdlblNlZWQgPSBPYmplY3QuYXNzaWduKHt9LCBvcmlnaW5hbFNlZWQpXG5cblxuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSBuZXh0R2VuU2VlZC5wcm9iYWJpbGl0eVxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2JhYmlsaXR5Q2hlY2sgPSAodGhpcy5wcm9iYWJpbGl0eShwZXJjZW50YWdlKSlcblxuICAgICAgICAgICAgICAgIGlmIChwcm9iYWJpbGl0eUNoZWNrID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIGRpcmVjdGlvblZhbHVlcykgeyAgLy8gZm9yIGVhY2gga2V5IGluIGVhY2ggZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAneCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRHZW5TZWVkLnggPSBvcmlnaW5hbFNlZWQueCArIGRpcmVjdGlvblZhbHVlc1trZXldICAvLyBtb3ZlIGZyb20gc2VlZGVkIGxvY2F0aW9uIHRvIG5ldyBsb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICd5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWQueSA9IG9yaWdpbmFsU2VlZC55ICsgZGlyZWN0aW9uVmFsdWVzW2tleV0gIC8vIGN1cnJlbnRseSBvbmx5IHdvcmtzIGZvciBzZWVkIGVsZW1lbnQgMFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbmV4dEdlblNlZWRzLnB1c2gobmV4dEdlblNlZWQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCduZXh0R2VuU2VlZHM6ICcsIG5leHRHZW5TZWVkcylcblxuICAgICAgICB0aGlzLm5leHRHZW5TZWVkcyA9IG5leHRHZW5TZWVkc1xuICAgICAgICByZXR1cm4gbmV4dEdlblNlZWRzXG4gICAgfVxuXG5cbiAgICBwcm9iYWJpbGl0eShwZXJjZW50YWdlKSB7XG4gICAgICAgIGNvbnN0IHByb2JhYmlsaXR5QXJyYXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcmNlbnRhZ2U7IGkrKykge1xuICAgICAgICAgICAgcHJvYmFiaWxpdHlBcnJheS5wdXNoKHRydWUpXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAgLSBwZXJjZW50YWdlOyBpKyspIHtcbiAgICAgICAgICAgIHByb2JhYmlsaXR5QXJyYXkucHVzaChmYWxzZSlcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygncHJvYmFiaWxpdHlBcnJheTogJywgcHJvYmFiaWxpdHlBcnJheSlcblxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucmFuZG9taXplKDEwMClcbiAgICAgICAgLy8gY29uc29sZS5sb2cocHJvYmFiaWxpdHlBcnJheVtpbmRleF0pXG5cbiAgICAgICAgcmV0dXJuIHByb2JhYmlsaXR5QXJyYXlbaW5kZXhdXG4gICAgfVxuXG5cblxufVxuXG5cbmNsYXNzIE1hcCB7XG4gICAgY29uc3RydWN0b3IoY29sLCByb3cpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRNYXAgPSBuZXcgTWFwR2VuZXJhdG9yKGNvbCwgcm93KVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdtYXAgaW5zdGFudGlhdGVkJylcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsQ2hhcmFjdGVyQ29vcmRpbmF0ZXMoKVxuXG4gICAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsQ2hhcmFjdGVyQ29vcmRpbmF0ZXMoKSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxDb29yZGluYXRlcyA9IFs5LCA5XVxuICAgICAgICBjb25zdCB4ID0gaW5pdGlhbENvb3JkaW5hdGVzWzBdXG4gICAgICAgIGNvbnN0IHkgPSBpbml0aWFsQ29vcmRpbmF0ZXNbMV1cblxuICAgICAgICBjb25zdCBjaGFyYWN0ZXJMb2NhdGlvbiA9IHRoaXMuZ2VuZXJhdGVkTWFwLnNlZWRlZEdyaWRbeV1beF1cblxuICAgICAgICBjb25zb2xlLmxvZyhgY2hhcmFjdGVyIGNvb3JkaW5hdGVzOiAke2luaXRpYWxDb29yZGluYXRlc31gKVxuICAgICAgICBjb25zb2xlLmxvZyhgY2hhcmFjdGVyIGxvY2F0aW9uOiAke2NoYXJhY3RlckxvY2F0aW9ufWApXG5cbiAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IGluaXRpYWxDb29yZGluYXRlc1xuICAgIH1cblxuICAgIHVwZGF0ZUNoYXJhY3RlckNvb3JkaW5hdGVzKG1vdmUpIHtcbiAgICAgICAgY29uc3QgbmV3Q29vcmRpbmF0ZXMgPSBbdGhpcy5jb29yZGluYXRlc1swXSArIG1vdmUueCwgdGhpcy5jb29yZGluYXRlc1sxXSArIG1vdmUueV1cbiAgICAgICAgY29uc29sZS5sb2coYGNoYXJhY3RlciBjb29yZGluYXRlczogJHtuZXdDb29yZGluYXRlc31gKVxuXG4gICAgICAgIGNvbnN0IHggPSBuZXdDb29yZGluYXRlc1swXVxuICAgICAgICBjb25zdCB5ID0gbmV3Q29vcmRpbmF0ZXNbMV1cblxuICAgICAgICBjb25zdCBjaGFyYWN0ZXJMb2NhdGlvbiA9IHRoaXMuZ2VuZXJhdGVkTWFwLnNlZWRlZEdyaWRbeV1beF1cblxuICAgICAgICBjb25zb2xlLmxvZyhgY2hhcmFjdGVyIGxvY2F0aW9uOiAke2NoYXJhY3RlckxvY2F0aW9ufWApXG5cbiAgICAgICAgdGhpcy5jb29yZGluYXRlcyA9IG5ld0Nvb3JkaW5hdGVzXG4gICAgfVxuXG4gICAgbW92ZUR1ZGVOb3J0aCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25vcnRoJylcbiAgICAgICAgdGhpcy51cGRhdGVDaGFyYWN0ZXJDb29yZGluYXRlcyhESVJFQ1RJT05TLm5vcnRoKVxuICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgfVxuXG4gICAgbW92ZUR1ZGVTb3V0aCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NvdXRoJylcbiAgICAgICAgdGhpcy51cGRhdGVDaGFyYWN0ZXJDb29yZGluYXRlcyhESVJFQ1RJT05TLnNvdXRoKVxuICAgICAgICB0aGlzLnJlbmRlcigpXG5cbiAgICB9XG4gICAgbW92ZUR1ZGVXZXN0KCkge1xuICAgICAgICBjb25zb2xlLmxvZygnd2VzdCcpXG4gICAgICAgIHRoaXMudXBkYXRlQ2hhcmFjdGVyQ29vcmRpbmF0ZXMoRElSRUNUSU9OUy53ZXN0KVxuICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgfVxuXG4gICAgbW92ZUR1ZGVFYXN0KCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZWFzdCcpXG4gICAgICAgIHRoaXMudXBkYXRlQ2hhcmFjdGVyQ29vcmRpbmF0ZXMoRElSRUNUSU9OUy5lYXN0KVxuICAgICAgICB0aGlzLnJlbmRlcigpXG4gICAgfVxuXG4gICAgZ2V0Q2hhcmFjdGVyKCkge1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXIgPSAnQCdcbiAgICAgICAgcmV0dXJuIGNoYXJhY3RlclxuICAgIH1cblxuICAgIHJlbmRlckl0ZW0oaXRlbSkge1xuICAgICAgICBsZXQgY2xzID0gJydcbiAgICAgICAgaWYgKGl0ZW0gPT09ICdAJykge1xuICAgICAgICAgICAgY2xzID0gJ2NoYXJhY3RlcidcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwiaXRlbSAke2Nsc31cIj4ke2l0ZW19PC9zcGFuPmBcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgMkQgYXJyYXkgbWFwIGludG8gYnJvd3Nlci1kaXNwbGF5YWJsZSBzdHJpbmdzXG4gICAgICAgIGNvbnN0IGRpc3BsYXlHcmlkID0gdGhpcy5nZW5lcmF0ZWRNYXAuc2VlZGVkR3JpZC5tYXAoYXJyID0+IHsgcmV0dXJuIGFyci5zbGljZSgpIH0pXG5cbiAgICAgICAgY29uc3QgeCA9IHRoaXMuY29vcmRpbmF0ZXNbMF1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuY29vcmRpbmF0ZXNbMV1cblxuICAgICAgICBkaXNwbGF5R3JpZFt5XVt4XSA9IHRoaXMuZ2V0Q2hhcmFjdGVyKClcblxuICAgICAgICBjb25zdCByZW5kZXJlZEdyaWQgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpc3BsYXlHcmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3dJdGVtcyA9IGRpc3BsYXlHcmlkW2ldXG4gICAgICAgICAgICBjb25zdCByb3cgPSByb3dJdGVtcy5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgdGhpcy5yZW5kZXJJdGVtKGl0ZW0pLCAnJylcblxuICAgICAgICAgICAgcmVuZGVyZWRHcmlkLnB1c2gocm93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGdyaWRUb0hUTUwgPSByZW5kZXJlZEdyaWQuam9pbignPGJyIC8+Jyk7XG5cbiAgICAgICAgLy8gZGlzcGxheSB0aGUgcmVuZGVyZWQgYXBwXG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBncmlkVG9IVE1MO1xuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9XG59XG5cblxuY2xhc3MgR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdEdhbWUoKVxuICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpXG4gICAgfVxuXG4gICAgaW5pdEdhbWUoKSB7XG4gICAgICAgIHRoaXMuc3BhY2VzID0gW107XG4gICAgICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tYXAgPSBuZXcgTWFwKDYwLCA2MClcbiAgICAgICAgdGhpcy5pbnB1dCA9IHRoaXMuaW5pdFVzZXJJbnB1dCgpXG4gICAgfVxuXG4gICAgaW5pdFVzZXJJbnB1dCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBVc2VySW5wdXQoe1xuICAgICAgICAgICAgJzM4JzogdGhpcy5tYXAubW92ZUR1ZGVOb3J0aC5iaW5kKHRoaXMubWFwKSxcbiAgICAgICAgICAgICczNyc6IHRoaXMubWFwLm1vdmVEdWRlV2VzdC5iaW5kKHRoaXMubWFwKSxcbiAgICAgICAgICAgICczOSc6IHRoaXMubWFwLm1vdmVEdWRlRWFzdC5iaW5kKHRoaXMubWFwKSxcbiAgICAgICAgICAgICc0MCc6IHRoaXMubWFwLm1vdmVEdWRlU291dGguYmluZCh0aGlzLm1hcCksXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhcnRHYW1lKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnQhJylcbiAgICB9XG5cbiAgICBnYW1lSXNPdmVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lT3ZlclxuICAgIH1cblxuICAgIGV4cGxvcmUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBleHBsb3JpbmcgdGhlICR7dGhpcy5raW5kfSB6b25lIWApXG4gICAgfVxufVxuXG5cbmNsYXNzIFVzZXJJbnB1dCB7XG4gICAgY29uc3RydWN0b3Ioa2V5QWN0aW9uTWFwKSB7XG4gICAgICAgIHRoaXMua2V5QWN0aW9uTWFwID0ga2V5QWN0aW9uTWFwXG5cbiAgICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gdGhpcy50cnlBY3Rpb25Gb3JFdmVudC5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgdHJ5QWN0aW9uRm9yRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFVdGlsaXR5LmNvbnRhaW5zKHRoaXMua2V5QWN0aW9uTWFwLCBldmVudC5rZXlDb2RlKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYG5vdCBhIHZhbGlkIGtleWNvZGU6ICR7ZXZlbnQua2V5Q29kZX1gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rZXlBY3Rpb25NYXBbZXZlbnQua2V5Q29kZV0oKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgR2FtZSgpO1xuXG5cblxuLy8gICAgIGdpdmVPcHRpb25Gb3JBY3Rpb24oKSB7XG4gICAgICAgIC8vIGlmICh3aW5kb3cucHJvbXB0KCdFeGl0PycsICdTdXJlJykgPT09ICdTdXJlJykge1xuICAgICAgICAgICAgLy8gdGhpcy5nYW1lT3ZlciA9IHRydWVcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIGFjdGlvbnMgY291bGQgaGF2ZSBjb25zdHJhaW50cywgc3VjaCBhc1xuICAgICAgICAvLyAgICAgLW9ubHkgY2FuIHRha2Ugb25lIGFjdGlvbiBvZiB0aGlzIHR5cGUgYXQgYSB0aW1lXG4gICAgICAgIC8vICAgICAtIGFjdGlvbiByZXF1aXJlcyBjb29sZG93blxuICAgICAgICAvLyAgICAgLSBhY3Rpb24gcmVxdWlyZXMgcHJlcFxuICAgICAgICAvLyAgICAgLSBhY3Rpb24gY29zdHMgcmVzb3VyY2VzXG5cblxuICAgICAgICAvLyBhc2sgcGxheWVyIGZvciBhY3Rpb25cbiAgICAgICAgLy8gcHJvY2VzcyBhY3Rpb25cbiAgICAgICAgLy8gY2FsY3VsYXRlIHN0YXRzXG4gICAgLy8gfVxuIiwiY29uc3QgZm9vID0gJ2JhcjUnXG5cbmV4cG9ydCBkZWZhdWx0IGZvb1xuIl19
