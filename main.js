const {app, BrowserWindow, ipcMain} = require('electron');
const { exec } = require('child_process');
const createCode = require('./template/function/createCode');
let mainWindow;
let childProcess = null;
console.log(111)
function createWindow () {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 750,
		webPreferences: {
			nodeIntegration: true, // 是否集成 Nodejs
		},
	});
	childProcess = exec(`${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run server`);
	setTimeout(() => {
		mainWindow.loadURL('http://127.0.0.1:9123/');
	}, 1000);
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		try {
			exec(`${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run stop-server`);
			process.kill(childProcess.pid, 'SIGKILL');
			app.quit();
		} catch(err) {
			process.exit(0);
		};
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('createCode', async (event, arg) => {
	const results = await createCode(JSON.parse(arg));
	event.sender.send('createCodeReply', JSON.stringify(results));
});
