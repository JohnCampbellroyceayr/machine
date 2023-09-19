const fs = require('fs');
// const path = require('path');

class file {
    static getFileNames(folderPath) {
        try {
            const fileNames = fs.readdirSync(folderPath);
            return fileNames;
        } catch (error) {
            console.error('Error reading files:', error);
            return [];
        }
    }
    static read(path) {
        return fs.readFileSync(path, 'utf-8');
    }
    static createFile(fileName, content) {
        fs.writeFileSync(fileName, content, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
}

export default file;