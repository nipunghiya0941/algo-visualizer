export function stackDemo(arr) {
    const steps = [];
    const stack = [];

    arr.forEach((val) => {
        steps.push({
            items: [...stack],
            active: -1,
            operation: 'push',
            codeLines: [1],
            msg: `push(${val}) → add to top`,
        });
        stack.push(val);
        steps.push({
            items: [...stack],
            active: stack.length - 1,
            operation: 'push',
            codeLines: [1],
            msg: `${val} pushed. Stack top = ${stack[stack.length - 1]}`,
        });
    });

    steps.push({
        items: [...stack],
        active: stack.length - 1,
        operation: 'peek',
        codeLines: [3],
        msg: `peek() → top element = ${stack[stack.length - 1]}`,
    });

    for (let i = 0; i < 3 && stack.length > 0; i++) {
        const top = stack[stack.length - 1];
        steps.push({
            items: [...stack],
            active: stack.length - 1,
            operation: 'pop',
            codeLines: [2],
            msg: `pop() → removing ${top} from top`,
        });
        stack.pop();
        steps.push({
            items: [...stack],
            active: -1,
            operation: 'pop',
            codeLines: [2],
            msg: `${top} popped. Stack size = ${stack.length}`,
        });
    }

    return steps;
}

export function queueDemo(arr) {
    const steps = [];
    const queue = [];

    arr.forEach((val) => {
        steps.push({
            items: [...queue],
            active: -1,
            operation: 'enqueue',
            codeLines: [2],
            msg: `enqueue(${val}) → add to rear`,
        });
        queue.push(val);
        steps.push({
            items: [...queue],
            active: queue.length - 1,
            operation: 'enqueue',
            codeLines: [2],
            msg: `${val} enqueued. Queue size = ${queue.length}`,
        });
    });

    for (let i = 0; i < 3 && queue.length > 0; i++) {
        const front = queue[0];
        steps.push({
            items: [...queue],
            active: 0,
            operation: 'dequeue',
            codeLines: [3],
            msg: `dequeue() → removing ${front} from front`,
        });
        queue.shift();
        steps.push({
            items: [...queue],
            active: -1,
            operation: 'dequeue',
            codeLines: [3],
            msg: `${front} dequeued. Queue size = ${queue.length}`,
        });
    }

    return steps;
}

export function linkedListDemo(arr) {
    const steps = [];
    const list = [];

    steps.push({
        items: [],
        active: -1,
        operation: 'init',
        codeLines: [0, 1, 2, 3],
        msg: `Linked List initialized. head = null`,
    });

    arr.forEach((val, idx) => {
        steps.push({
            items: [...list],
            active: -1,
            operation: 'insert',
            codeLines: [4],
            msg: `Inserting ${val} at position ${idx}`,
        });
        list.push(val);
        steps.push({
            items: [...list],
            active: list.length - 1,
            operation: 'insert',
            codeLines: [4],
            msg: `${val} inserted. List size = ${list.length}`,
        });
    });

    return steps;
}

export function arrayDemo(arr) {
    const steps = [];

    steps.push({
        items: [...arr],
        active: -1,
        operation: 'init',
        codeLines: [0],
        msg: `Array initialized with ${arr.length} elements`,
    });

    arr.forEach((val, i) => {
        steps.push({
            items: [...arr],
            active: i,
            operation: 'access',
            codeLines: [1],
            msg: `Accessing arr[${i}] = ${val}`,
        });
    });

    const maxIdx = arr.indexOf(Math.max(...arr));
    steps.push({
        items: [...arr],
        active: maxIdx,
        operation: 'max',
        codeLines: [2],
        msg: `Max element = ${arr[maxIdx]} at index ${maxIdx}`,
    });

    return steps;
}