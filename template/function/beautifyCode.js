const readline = require('linebyline');
const fs = require('fs-extra');
const path = require('path');

const tagStack = [];

const deleteWhiteSpace = (line) =>  {
	return line.replace(/^\s+|\s+$/g, '');
};

const isStartTag = (line) => {
	if (line.indexOf('models:()') >= 0) {
		return true;
	}
	return matchWithLine(line, /^<[^\/].+>$|\)??\s*?{$|[^\)]\($|^\{*.+\)\($/);
};

/**
 * 匹配 </...>|};|}...;|});|/>|],
 * @param {*} line 
 */
const isEndTag = (line) => {
	if (line.endsWith('[],')) {
		return false;
	}
	return matchWithLine(line, /<\/.+>$|}[;,]?$|}.*;$|\);?$|}?\);?$|\/>|\],$/);
};

/**
 * @desc 匹配'})(', '} {'和'>'，需要lineSpace先减一再加一 
 * @param {*} line 
 */
const isEspecialTag = (line) => {
	return line === '})(' || line === '>' || matchWithLine(line, /^\}\)?.+\{$/);
};

/**
 * @desc 匹配 ...{...} (...);
 * @param {*} line 
 */
const isWholeBracket = (line) => {
	return line.indexOf('})') !== 0 && line.indexOf('}') !== 0 && matchWithLine(line, /\(.{0,}?\);?$|^\{.+\}$|\{.{0,}?\}/);
};

/**
* @desc 是否是自闭标签，形如<br/>
*/
const isCloseSelfTag = (line) => {
	return matchWithLine(line, /^<.+?\/>$/);
};

/**
* @desc 起始标签是否在同一行
*/
const isWholeTagInline = (line) => {
	return matchWithLine(line, /^<.{1,}?>.*<\/\w+>$/);
};

/**
* @desc 标签是否折行
*/
const isTagWithWrap = (line) => {
	return matchWithLine(line, /^<\w+/);
	
};

const matchWithLine = (line, regx) => {
	return getMatchStr(line.match(regx));
};

const getMatchStr = (matchArr) => {
	if (Array.isArray(matchArr) && matchArr.length > 0) {
		return matchArr[0];
	}
};

const addWhiteSpace = (line, spaceNum = 0) => {
	let spaceStr = '';
	for (let i = 0; i < spaceNum; i++) {
		spaceStr+=`\t`;
	}
	return `${spaceStr}${line}\n`;
}

let curLineSpace = 0;

const getNewLine = (line) => {
	const _line = deleteWhiteSpace(line);
	if (!_line) { // 空行
		return '';
	}
	if (_line.indexOf('export default') === 0 && _line.indexOf('export default {') !== 0) {
		return addWhiteSpace(_line, 0);
	}
	const wholeTag = isWholeTagInline(_line);
	if (wholeTag) { // 包含起始标签
		return addWhiteSpace(_line, curLineSpace);
    }
    const closeSelfTag = isCloseSelfTag(_line);
	if (closeSelfTag) { // 自闭标签
		return addWhiteSpace(_line, curLineSpace);
	}
	const especialTag = isEspecialTag(_line);
	if (especialTag) {
		return addWhiteSpace(_line, curLineSpace - 1);
	}
	const startTag = isStartTag(_line);
	if (startTag) { // 只包含开始标签
		tagStack.push(curLineSpace);
		curLineSpace++;
		return addWhiteSpace(_line, curLineSpace - 1);
	}
	const wholeBracket = isWholeBracket(_line);
	if (wholeBracket) { // 包含起始圆括号
		return addWhiteSpace(_line, curLineSpace);
	}
	const endTag = isEndTag(_line);
	if (endTag) { // 只包含结束标签
		const lineSpace = tagStack.pop() || 0;
		curLineSpace = lineSpace;
		return addWhiteSpace(_line, curLineSpace);
	}
	const tagWithWrap = isTagWithWrap(_line);
	if (tagWithWrap) { // 开始标签折行
		tagStack.push(curLineSpace);
		curLineSpace++;
		return addWhiteSpace(_line, curLineSpace - 1);
	}
	return addWhiteSpace(_line, curLineSpace);
};

const beautify = (sourceCacheDir, fileName) => {
	reset();
	const copyFileName = `${fileName.slice(0, fileName.lastIndexOf('.'))}Copy.js`;
    const copyFilePath = path.resolve(sourceCacheDir, copyFileName);
	const sourceFilePath = path.resolve(sourceCacheDir, fileName);
    return new Promise((resolve, reject) => {
        fs.ensureFile(copyFilePath).then(() => {
            fs.writeFileSync(copyFilePath, '');
            const rl = readline(sourceFilePath);
            rl.on('line', function(line) {
                fs.appendFileSync(copyFilePath, getNewLine(line));
            }).on('close', () => {
				fs.unlinkSync(sourceFilePath);
				fs.renameSync(copyFilePath, sourceFilePath);
                resolve({
                    code: 0,
                    info: '生成页面成功',
				});
			}).on('error', function(e) {
				fs.unlinkSync(sourceFilePath);
				fs.unlinkSync(copyFilePath);
				console.log('error', e);
                reject(e);
            });
        });
    });
};

const reset = () => {
	curLineSpace = 0;
	tagStack.length = 0;
};

module.exports = beautify;