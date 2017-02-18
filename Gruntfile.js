module.exports = function ( grunt ) {
 grunt.loadNpmTasks('grunt-tslint');
 var taskConfig = {
    tslint: {
        options: {
            configuration: "tslint.json",
            force: false,
            fix: false
        },
        files: {
            src: [
                "src/**/*.ts",
                "src/*.ts"
            ]
        }
    }
 };
 grunt.initConfig(taskConfig);
 grunt.registerTask('default', ['tslint']);
};
