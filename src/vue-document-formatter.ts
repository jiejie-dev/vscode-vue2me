import * as vscode from 'vscode'

const jsbeautify = (require('js-beautify')).js_beautify;

const cssbeautify = (require('js-beautify')).css;

const htmlbeautify = (require('js-beautify')).html;

function format(text) {
    var newTextArr, text;
    newTextArr = [];
    ['html', 'js', 'css'].forEach(function (val, index) {
        var newText;
        newText = replaceText(text, val);
        return newTextArr.push(newText);
    });
    return newTextArr.join('\n\n');
}

function replaceText(text, type) {
    var beautifiedText, beautify, contentRex, regObj, typeArr, typeContent, typeText, typeTextCon;
    regObj = {
        css: /<style(\s|\S)*>(\s|\S)*<\/style>/gi,
        html: /<template(\s|\S)*>(\s|\S)*<\/template>/gi,
        js: /<script(\s|\S)*>(\s|\S)*<\/script>/gi
    };
    beautify = {
        css: cssbeautify,
        html: htmlbeautify,
        js: jsbeautify
    };
    contentRex = />(\s|\S)*<\//g;
    if (regObj[type].exec(text)) {
        console.log(regObj[type].exec(text));
        typeText = regObj[type].exec(text)[0];
    } else {
        return '';
    }
    if (typeText) {
        typeTextCon = contentRex.exec(typeText)[0];
        typeContent = typeTextCon.substring(1).substr(0, typeTextCon.length - 3);
        typeArr = typeText.split(typeContent);
        beautifiedText = beautify[type](typeContent);
        // console.log(beautifiedText);
        return typeArr[0] + '\n\n' + beautifiedText + '\n\n' + typeArr[1];
    } else {
        return '';
    }
}

export class VueDocumentFormatter implements vscode.DocumentFormattingEditProvider {
    /**
     * 
     */
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken):
        vscode.TextEdit[] | Thenable<vscode.TextEdit[]> {
        var start = new vscode.Position(0, 0);
        var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        var range = new vscode.Range(start, end);
        var text = document.getText(range);
        var r: string = format(text);
        var result: vscode.TextEdit[] = [];
        result.push(new vscode.TextEdit(range, r));
        return result
    }
}