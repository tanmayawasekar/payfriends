//Imports all the dev dependencies
gulp = require('gulp');
watch = require('gulp-watch'); //Watches over the specified files for changes.
server = require('gulp-live-server'); //Server with livereload.
pm2 = require('pm2'); //Handles process clustering | PM2 docs - http://pm2.keymetrics.io/docs/usage/cluster-mode/

const paths = {
	'js': ['./**/*.js', './src/**/*.jade']
};

//Starts a new server instance
gulp.task('server', () => {

	/*
		- All About PM2 Configuration file - http://pm2.keymetrics.io/docs/usage/application-declaration
		- All the available options that can be added to PM2 config file - http://pm2.keymetrics.io/docs/usage/application-declaration/#list-of-attributes-available
	*/

	//Base Configuration [irrespective of the environment]
	let pm2Config = {
		'name': 'payfriends',
		'script': './bin/www.js'
	};

	//Environment specific configuration
	if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'mobile') {
		pm2Config['exec_mode'] = 'fork';
	} else {
		pm2Config['exec_mode'] = 'cluster';
		pm2Config['instances'] = 0; // number of instances for your clustered app, 0 means as much instances as you have CPU cores. a negative value means CPU cores - value (e.g -1 on a 4 cores machine will spawn 3 instances)
		pm2Config['max_memory_restart'] = '250M'; // your app will be restarted by PM2 if it exceeds the amount of memory specified. human-friendly format : it can be “10M”, “100K”, “2G” and so on…
		pm2Config['out_file'] = "";
		pm2Config['error_file'] = "";
	}

	pm2.connect(true, function(err) {
		if (err) {
			console.error(err);
			process.exit(2);
		}

		pm2.start(pm2Config, function(error, apps) {
    	pm2.connect(true, function(pm2Err) {
    		if (pm2Err) {
    			console.error(pm2Err);
    			process.exit(2);
    		}
    		pm2.list();
    	});
    pm2.disconnect();
    });
	});
});

gulp.task('restart-server', () => {

	pm2.connect(true, function(err) {
		if (err) {
			console.error(err);
			process.exit(2);
		}

		pm2.restart('all', function(error, proc) {
			pm2.list();
    	pm2.disconnect();
    });
	});
});

//Watches over the files and runs the build task
gulp.task('watch', () => {
	return watch(paths.js, () => {
		gulp.start('watch-build');
	});
});


gulp.task('default', ['set-dev-node-env', 'build', 'watch'], cb => {
});

gulp.task('prod', ['set-prod-node-env', 'build', 'watch'], cb => {
});

gulp.task('stage', ['set-stage-node-env', 'build', 'watch'], cb => {
});

gulp.task('mobile', ['set-mobile-app-node-env', 'build', 'watch'], cb => {
});

gulp.task('set-dev-node-env', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function() {
  return process.env.NODE_ENV = 'production';
});

gulp.task('set-stage-node-env', function() {
  return process.env.NODE_ENV = 'stage';
});

gulp.task('set-mobile-app-node-env', function() {
  return process.env.NODE_ENV = 'mobile';
});

gulp.task('build', ['server'], cb => {
});

gulp.task('watch-build', ['restart-server'],cb => {
});
