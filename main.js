/**
 * calculating from a string of polish postfix notation
 * @param str: String of polish postfix notation
 * @returns {*}
 */
function polishPostfix(str) {
    let arr = str.split(' ');
    let st = [];
    for (let item of arr) {
        // console.log(st, item);
        let a;
        switch (item) {
            case '+':
                st.push(st.pop() * 1 + st.pop() * 1);
                break;
            case '-':
                a = st.pop();
                st.push(st.pop() - a);
                break;
            case '*':
                st.push(st.pop() * st.pop());
                break;
            case '/':
                a = st.pop();
                st.push(st.pop() / a);
                break;
            default:
                st.push(item);
                break;
        }
    }
    return st.pop();
}

/**
 * Convert reference string to all number and operations
 * @param key
 * @param str: String need to de reference
 * @param obj: The object that converted from the input
 * @param tmp: temp array to store chain of reference. So we can detect the root of chain to throw circular dependency.
 * @returns {string|*}
 */
function deRef(key, cur_key, str, obj, tmp = []) {
    // console.log(str);
    if (!isNaN(str)) {  //If the value is number
        return str
    }
    if (!str) {
        throw `${tmp.pop()} is not declared`
    }
    let arr = str.split(' ');
    let len = arr.length;
    let ar2 = [];
    for (let i = 0; i < len; i++) {
        let item = arr[i];
        if (['+', '-', '*', '/'].includes(item) || !isNaN(item)) {
            ar2.push(item);
        } else {
            if (key === item) {
                throw `Circular dependency between ${key} and ${tmp[0]} detected`;
            }
            tmp.push(item);
            ar2.push(deRef(key, item, obj[item], obj, tmp));
            tmp.pop();
        }
    }
    obj[cur_key] = ar2.join(' ');
    return ar2.join(' ');
}

/**
 * The main function
 * @param n: number of line
 * @param obj: the object that was converted from input
 */
function excel(n, obj) {
    try {
        console.log('---Input---');
        console.log(obj);
        let keys = Object.keys(obj);
        for (let key of keys) {
            let value = obj[key];
            if (isNaN(value)) {// is string
                obj[key] = polishPostfix(deRef(key, key, value, obj));
            }
        }
        let sorted_keys = keys.sort();
        for (let key of sorted_keys) {
            console.log(key);
            console.log(obj[key]);
        }
    } catch (e) {
        console.log(e);
    }
}
function arrayToObj(arr){
    let obj = {};
    for (let i = 0; i < arr.length/2; i++) {
        obj[arr[i*2]] = arr[i*2+1];
    }
    return obj
}


let fs = require('fs');
let files = fs.readdirSync('test');
console.log(files);
for (let file of files){
    let inputs = fs.readFileSync('test/'+file).toString().split('\n');
    excel(parseInt(inputs[0]), arrayToObj(inputs.slice(1)));
}

/*function arrayToObj(arr){
    let obj = {};
    for (let i = 0; i < n; i++) {
        obj[arr[i*2]] = arr[i*2+1];
    }
    return obj
}
let n=3;
let data = ['A1', '5', 'A2', 'A1 5 * B1 +', 'B1', '6'];
excel(n, arrayToObj(data));*/

// excel(3, {
//     A1: 5,
//     A2: 'A1 5 * B1 +',
//     B1: 6
// });
// console.log('---------------');
// excel(3, {
//     B2: 'B1 C1 /',
//     A1: 5,
//     A2: 'A1 5 * B2 +',
//     B1: 6,
//     C1: 0
// });
//
// console.log('---------------');
// excel(2, {
//     A1: 'A2 2 *',
//     A2: 'A1 5 +'
// });
//
// console.log('---------------');
// excel(4, {
//     A1: 'B2 2 *',
//     A2: 'B1 5 +',
//     B1: 'B2 2 +',
//     B2: 'A1 1 *'
// });
//
// console.log('---------------');
// excel(1, {
//     A1: 'B2 2 *',
//     A2: 'B2 2 *',
// });
//
// console.log('---------------');
// excel(4, {
//     B2: 'A1 2 *',
//     A2: 'B1 5 +',
//     B1: 'B2 2 +',
//     A1: 'B2 1 *'
// });
// console.log('---------------');
// excel(4, {
//     B2: 'A2 2 *',
//     A2: 'A1 5 * B1 + B2 3 +',
//     B1: 6,
//     A1: 5
// });
// console.log('---------------');
// excel(5, {
//     A1: 'B2 2 * C1 +',
//     A2: 'B2 2 *',
//     B2: 1,
//     B1: 'A1',
//     C1: 'A1 A2 + B1 -'
// });
// console.log('---------------');
// excel(5, {
//     A1: 'B2 2 * C1 +',
//     A2: 'B2 2 * C1 -',
//     B2: 0,
//     B1: 'A1'
// });
