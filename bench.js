
const Flatbush = require('./index.js').default;
const rbush = require('rbush');

const N = 1000000;
const K = 1000;

console.log(N + ' rectangles');

function addRandomBox(arr, boxSize) {
    const x = Math.random() * (100 - boxSize);
    const y = Math.random() * (100 - boxSize);
    const x2 = x + Math.random() * boxSize;
    const y2 = y + Math.random() * boxSize;
    arr.push(x, y, x2, y2);
}

const coords = [];
for (let i = 0; i < N; i++) addRandomBox(coords, 1);

const boxes100 = [];
const boxes10 = [];
const boxes1 = [];
for (let i = 0; i < K; i++) {
    addRandomBox(boxes100, 100 * Math.sqrt(0.1));
    addRandomBox(boxes10, 10);
    addRandomBox(boxes1, 1);
}

console.time('flatbush');
const index = new Flatbush(N, 16);
for (let i = 0; i < coords.length; i += 4) {
    index.add(
        coords[i],
        coords[i + 1],
        coords[i + 2],
        coords[i + 3]);
}
index.finish();
console.timeEnd('flatbush');

function benchSearch(boxes, name) {
    const id = K + ' searches ' + name;
    console.time(id);
    for (let i = 0; i < boxes.length; i += 4) {
        index.search(boxes[i], boxes[i + 1], boxes[i + 2], boxes[i + 3]);
    }
    console.timeEnd(id);
}

benchSearch(boxes100, '10%');
benchSearch(boxes10, '1%');
benchSearch(boxes1, '0.01%');

const dataForRbush = [];
for (let i = 0; i < coords.length; i += 4) {
    dataForRbush.push({
        minX: coords[i],
        minY: coords[i + 1],
        maxX: coords[i + 2],
        maxY: coords[i + 3]
    });
}

console.time('rbush');
const rbushIndex = rbush().load(dataForRbush);
console.timeEnd('rbush');

function benchSearchRBush(boxes, name) {
    const boxes2 = [];
    for (let i = 0; i < boxes.length; i += 4) {
        boxes2.push({
            minX: boxes[i],
            minY: boxes[i + 1],
            maxX: boxes[i + 2],
            maxY: boxes[i + 3]
        });
    }
    const id = K + ' searches ' + name;
    console.time(id);
    for (let i = 0; i < boxes2.length; i++) {
        rbushIndex.search(boxes2[i]);
    }
    console.timeEnd(id);
}

benchSearchRBush(boxes100, '10%');
benchSearchRBush(boxes10, '1%');
benchSearchRBush(boxes1, '0.01%');
