export class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

export function insertBST(root, val) {
    if (!root) return new TreeNode(val);
    if (val < root.val) root.left = insertBST(root.left, val);
    else root.right = insertBST(root.right, val);
    return root;
}

export function buildBST(arr) {
    let root = null;
    arr.forEach((val) => (root = insertBST(root, val)));
    return root;
}

export function inorder(root) {
    const steps = [];

    function helper(node) {
        if (!node) return;
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [0],
            msg: `Go left from ${node.val}`,
        });
        helper(node.left);
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [1],
            msg: `Visit node ${node.val}`,
        });
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [2],
            msg: `Go right from ${node.val}`,
        });
        helper(node.right);
    }

    helper(root);
    steps.push({
        current: null,
        visited: steps.map((s) => s.current).filter(Boolean),
        codeLines: [],
        msg: `Inorder Complete!`,
    });
    return steps;
}

export function preorder(root) {
    const steps = [];

    function helper(node) {
        if (!node) return;
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [0],
            msg: `Visit node ${node.val}`,
        });
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [1],
            msg: `Go left from ${node.val}`,
        });
        helper(node.left);
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [2],
            msg: `Go right from ${node.val}`,
        });
        helper(node.right);
    }

    helper(root);
    steps.push({
        current: null,
        visited: steps.map((s) => s.current).filter(Boolean),
        codeLines: [],
        msg: `Preorder Complete!`,
    });
    return steps;
}

export function postorder(root) {
    const steps = [];

    function helper(node) {
        if (!node) return;
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [0],
            msg: `Go left from ${node.val}`,
        });
        helper(node.left);
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [1],
            msg: `Go right from ${node.val}`,
        });
        helper(node.right);
        steps.push({
            current: node.val,
            visited: steps.map((s) => s.current),
            codeLines: [2],
            msg: `Visit node ${node.val}`,
        });
    }

    helper(root);
    steps.push({
        current: null,
        visited: steps.map((s) => s.current).filter(Boolean),
        codeLines: [],
        msg: `Postorder Complete!`,
    });
    return steps;
}

export function getTreeLayout(root) {
    const nodes = [];
    const edges = [];

    function helper(node, x, y, spread) {
        if (!node) return;
        nodes.push({ val: node.val, x, y });
        if (node.left) {
            edges.push({ from: { x, y }, to: { x: x - spread, y: y + 80 } });
            helper(node.left, x - spread, y + 80, spread / 2);
        }
        if (node.right) {
            edges.push({ from: { x, y }, to: { x: x + spread, y: y + 80 } });
            helper(node.right, x + spread, y + 80, spread / 2);
        }
    }

    helper(root, 300, 40, 120);
    return { nodes, edges };
}