/**
 * Monitor special variables
 */
import {createProxy} from '../utils/util';
import Store from '../store/index';
import method from '../global/method';
import { getluckysheetfile } from '../methods/get'
import { toJson,setRangeShow } from '../global/api';//add by luyaqin  解决初始化luckysheet默认选中第一个单元格

let undoTimer,redoTimer;
function undoAccessible(len) {
    clearTimeout(undoTimer);
    undoTimer = setTimeout(() => {
        $('#luckysheet-icon-undo')[len ? 'removeClass' : 'addClass']('disabled');
    }, 10);
}
function redoAccessible(len) {
    clearTimeout(redoTimer);
    redoTimer = setTimeout(() => {
        $('#luckysheet-icon-redo')[len ? 'removeClass' : 'addClass']('disabled');
    }, 10);
}

const initListener = function(){
    // createProxy(Store,['jfredo']);
    createProxy(Store, 'jfredo',(target, property, val, receiver)=>{
        if (property !== 'length') {
            //  钩子函数
            method.createHookFunction('updated',val)
        }
        undoAccessible(Store.jfredo.length);
    } );
    createProxy(Store, 'jfundo',(target, property, val, receiver)=>{
        redoAccessible(Store.jfundo.length);
    } );
    


    createProxy(Store, 'asyncLoad', (target, property, val, receiver)=>{
        if(property === 'length' && val === 0){
            setRangeShow([], { show: false }) //add by luyaqin  解决初始化luckysheet默认选中第一个单元格
            method.createHookFunction('workbookCreateAfter', toJson())
        }
    })
}

export {
    initListener
}