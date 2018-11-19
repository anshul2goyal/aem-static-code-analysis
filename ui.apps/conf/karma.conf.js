/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

module.exports = function(config) {
  config.set({
    basePath: '../',
    autoWatch: true,
    concurrency: 1,
    frameworks: [ 'mocha', 'chai' ],
    files: [
      'src/main/content/jcr_root/apps/business/clientlibs/**/*.js',
      'src/test/javascript/test*.js'
    ],
    plugins: [
        'karma-verbose-reporter',
        'karma-coverage',
        'karma-mocha',
        'karma-chai',
        'karma-phantomjs-launcher',
        'karma-firefox-launcher',
        'karma-chrome-launcher'
    ],

    browsers: [
        //'PhantomJS'
    	'Chrome'
        // // Native browser
        // , 'Firefox'
    ],

    reporters: [
        'verbose'
        // Coverage
        , 'coverage'
    ],

    // Coverage
    preprocessors: { 'src/main/content/jcr_root/apps/business/clientlibs/**/*.js': ['coverage'] },

    coverageReporter: {
        dir : 'coverage/ut/',
        reporters: [
            { type: 'html', subdir: 'html' },
            { type: 'lcovonly', subdir: 'lcov' },
            { type: 'text-summary' },
            { type: 'text' }
        ],
        check: {
            global: {
            lines: 50
            }
        }

    },

    singleRun: true

  });
};
