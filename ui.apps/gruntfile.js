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

module.exports = function(grunt) {

	// reads the configuration of the caller to get the project related values
	pkg = require(process.cwd() + '/package.json');

	// Project configuration.
	grunt.initConfig({

		// Build Tasks
		clean : [ 'build', 'tmp-instrument' ],

		concat : {
			options : {
				separator : '\n\n;\n\n',
			},
			dist : {
				files : {
					'build/business.js' : [ 'src/main/content/jcr_root/apps/business/clientlibs/**/*.js' ]
				}
			},
			'instr-code' : {
				files : {
					'build/business-instr.js' : 
						[ 'tmp-instrument/src/main/content/jcr_root/apps/business/clientlibs/**/*.js']
				}
			}
		}

		// Sonar
		,
		sonarRunner : {
			analysis : {
				options : {
					debug : false,
					separator : '\n',
					sonar : {
						host : {
							url : 'http://localhost:9000'
						},

						// maxBuffer: 1000 * 1024,

						projectKey : pkg.key,
						projectName : pkg.name,
						projectDescription : pkg.description,
						projectVersion : pkg.version,

						language : 'js',
						sourceEncoding : 'UTF-8',
						sources : [ 'src' ].join(','),
						// exclusions: ['**/libs/**'].join(','),

						// Coverage reports
						javascript : {
							lcov : {
								reportPath : 'coverage/ut/lcov/lcov.info',
								itReportPath : 'coverage/it/lcov.info'
							}
						}
					}
				}
			}
		}

		// Linting - Static Code Analysis
		,
		eslint : {
			all : [ 'src/main/content/jcr_root/apps/business/clientlibs/**/*.js' ],
			options : {
				config : "conf/eslint.conf.json"
			}
		}

		// Unit Testing
		,
		karma : {
			test : {
				configFile : 'conf/karma.conf.js'
			}
		},

		// IT Coverage - Instrument js files
		instrument : {
			files : 'src/main/content/jcr_root/apps/business/clientlibs/**/*.js',
			options : {
				lazy : true,
				basePath : 'tmp-instrument/'
			}
		},

		makeReport : {
			src : 'coverage/*.json',
			options : {
				// print: 'detail'
				type : 'lcov',
				dir : 'coverage/it'
			}
		}

	});

	/** Load generic tasks * */

	// This plugin provides the "clean" task.
	grunt.loadNpmTasks('grunt-contrib-clean');

	// This plugin provides the "concat" task.
	grunt.loadNpmTasks('grunt-contrib-concat');

	// This plugin provides the "sonarRunner" task.
	grunt.loadNpmTasks('grunt-sonar-runner');

	// This plugin provides the "eslint" task.
	grunt.loadNpmTasks("grunt-eslint");

	// This plugin provides the "karma" task.
	grunt.loadNpmTasks("grunt-karma");

	// This plugin provides the "instrument" task.
	grunt.loadNpmTasks('grunt-istanbul');

	/** Register advanced tasks * */

	/* Build task scenario */
	// grunt build-lib
	// Delete previous build
	// + code linting
	// + concatenate in single lib file build/timing.js
	grunt.registerTask('build-lib', [ 'clean', 'eslint','concat:dist' ]);

	/* Execute UT with coverage + Sonar analyis */
	// grunt ut-sonar
	// Execute UTs
	// + run SonarQube analysis (http://localhost:9000)
	grunt.registerTask('ut-sonar', [ 'karma:test', 'sonarRunner' ]);

	/* Build lib with instrumented code for IT coverage collection */
	// grunt build-lib-instr-code
	// Delete previous build
	// + code linting
	// + concatenate in single lib file build/timing.js
	grunt.registerTask('build-lib-instr-code', [ 'clean', 'instrument',
			'concat:instr-code' ]);

	/* Complete build */
	// grunt full
	// Delete previous build
	// + code linting
	// + concatenate in single lib file build/timing.js
	// + execute UTs
	// + run SonarQube analysis (http://localhost:9000)
	grunt.registerTask('full', [ 'build-lib', 'ut-sonar' ]);

};
