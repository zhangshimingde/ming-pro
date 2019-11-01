const path = require('path');
const fs = require('fs-extra');
const readline = require('linebyline');
const createFile = require('./createFile');
const beautify = require('./beautifyCode');

function strim(str, strimStart = false) {
	if (strimStart) {
		str.replace(/^\s+/, '');
	}
	return str.replace(/\s/g, '');
}

/**
 * @desc 判断是否在项目根目录
 */
function isInProjectRoot() {
	const currentPath = process.cwd();
    const packagePath = path.join(currentPath, 'package.json');
    const srcPath = path.join(currentPath, 'src');
	return fs.existsSync(packagePath) && fs.existsSync(srcPath);
}


/**
 * @desc 将进程目录切换到项目根目录下
 */
function chdirProjectBaseDir(projectDir) {
	const baseDir = process.cwd();
	let preDir = baseDir;
	while(!isInProjectRoot() && preDir !== process.cwd()) {
		preDir = process.cwd();
		process.chdir('../'); // 向上一级目录
	}
	if (!isInProjectRoot()) {
		console.error('please create page in valid project!');
		process.exit(1);
	}
}

const createCode = async ({ pageName = 'Page', projectDir, layoutConfig = [], layerConfig = {} }) => {
    if (!fs.existsSync(projectDir)) {
        return { code: '-1', info: `${projectDir}文件夹不存在` };
    }
    const statProjectDir = fs.lstatSync(projectDir);
    if (!statProjectDir.isDirectory()) {
        return { code: '-1', info: `${projectDir}不是合法的文件夹` };
    }
    const componentsDir = path.resolve(projectDir, `src/components/${pageName}`);
    const servicesDir = path.resolve(projectDir, 'src/services');
    const modelsDir = path.resolve(projectDir, 'src/models');
    fs.ensureDirSync(componentsDir);
    fs.ensureDirSync(servicesDir);
    fs.ensureDirSync(modelsDir);
    fs.ensureFileSync(path.resolve(projectDir, 'src/Router.js'));

    const { modalArr = [] } = layerConfig;
    const results = await Promise.all([
        createFile(pageName, { layoutConfig, layerConfig }, componentsDir),
        ...modalArr.map(({ name, ...rest }) => {
            return createFile(name, Object.assign(rest, { layerConfig, pageName, fileType: 'modal', type: 'ModalContainer' }), componentsDir);
        }),
        createFile(pageName, { layerConfig, fileType: 'model', dir: 'models' }, modelsDir),
        createFile(pageName, { layerConfig, fileType: 'service', dir: 'services' }, servicesDir)
    ]);
    let responseObj = {};
    for (let r of results) {
        responseObj= r;
        if (r.code != '0') {
            break;
        }
    }
    // 修改路由配置文件
    try {
		const routerFile = path.resolve(projectDir, 'src/Router.js');
		if (!fs.pathExistsSync(routerFile)) {
			console.log(`create page ${pageName} success, but no Router.js file exists`);
    		process.exit(0);
		}
		const copyRouterFile = path.resolve(projectDir, 'src/Router_temp.js');
        fs.ensureFileSync(copyRouterFile);
        fs.writeFileSync(copyRouterFile, '');  // 清空缓存文件
        const rl = readline(routerFile);
        rl.on('line', function(line) {
            let appendLine = `
                ${line}\n
            `;
			if (strim(appendLine).indexOf('({history,app})') > 0) {
                appendLine = `${appendLine}
                const ${pageName} = dynamic({
                    app,
                    models:() => [
                        import('./models/${pageName}')
                    ],
                    component: () => import('./components/${pageName}'),
                });
                `;
			} else if (appendLine.indexOf('<Switch>') >= 0) {
                appendLine = `${appendLine}
                <Route exact path="/${pageName}" component={${pageName}} />
                `;
            }
            fs.appendFileSync(copyRouterFile, appendLine);
        }).on('close', () => {
            fs.unlinkSync(routerFile);
            fs.renameSync(copyRouterFile, routerFile);
            beautify(projectDir, 'src/Router.js');
        }).on('error', function(e) {
            fs.unlinkSync(copyRouterFile);
            console.log('error', e);
            process.exit(1);
        });
	} catch(e) {
		console.error(e);
        process.exit(1);
        return {
            code: '-1',
            info: '修改路由配置信息失败',
        };
	}
    return responseObj;
};

module.exports = createCode;