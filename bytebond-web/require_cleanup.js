const fs = require('fs');

function removeStringFromFile(filePath) {
    // Read the file
    fs.readFile(filePath, 'utf8', function(err, data){
        if (err) {
            return console.log(err);
        }

        // Replace the string
        let result = data.replace(/\|\|require\("buffer"\)\.Buffer/g, '');

        // Write the updated content back to the file
        fs.writeFile(filePath, result, 'utf8', function(err){
            if (err) return console.log(err);
        });
    });
}
const path = require('path');

x = ''

function findIndexFiles(directoryPath) {
    // Read the directory
    fs.readdir(directoryPath, function(err, files){
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        // Filter files that start with 'index' and end with '.js'
        const indexFiles = files.filter(file => file.startsWith('index') && file.endsWith('.js'));

        // Log the files
        removeStringFromFile(`./dist/assets/${indexFiles[0]}`);
    });
}

// Call the function with the path to your directory
findIndexFiles('./dist/assets');

//
// // Call the function with the path to your file
//
