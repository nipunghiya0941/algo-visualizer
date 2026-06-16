export function bfs(graph, start) {
    const steps = [];
    const visited = new Set();
    const queue = [start];
    visited.add(start);

    steps.push({
        visited: [...visited],
        queue: [...queue],
        current: null,
        codeLines: [0, 1, 2],
        msg: `BFS Start. Queue = [${queue}]`,
    });

    while (queue.length > 0) {
        const node = queue.shift();
        steps.push({
            visited: [...visited],
            queue: [...queue],
            current: node,
            codeLines: [3, 4],
            msg: `Visiting node ${node}. Queue = [${queue}]`,
        });

        for (const neighbor of (graph[node] || [])) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                steps.push({
                    visited: [...visited],
                    queue: [...queue],
                    current: node,
                    codeLines: [5, 6, 7],
                    msg: `Found neighbor ${neighbor} → add to queue. Queue = [${queue}]`,
                });
            } else {
                steps.push({
                    visited: [...visited],
                    queue: [...queue],
                    current: node,
                    codeLines: [5],
                    msg: `Neighbor ${neighbor} already visited, skip.`,
                });
            }
        }
    }

    steps.push({
        visited: [...visited],
        queue: [],
        current: null,
        codeLines: [],
        msg: `BFS Complete! Visited order: ${[...visited].join(' → ')}`,
    });

    return steps;
}

export function dfs(graph, start) {
    const steps = [];
    const visited = new Set();

    function dfsHelper(node) {
        visited.add(node);
        steps.push({
            visited: [...visited],
            current: node,
            codeLines: [0, 1],
            msg: `Visiting node ${node}`,
        });

        for (const neighbor of (graph[node] || [])) {
            if (!visited.has(neighbor)) {
                steps.push({
                    visited: [...visited],
                    current: node,
                    codeLines: [2, 3],
                    msg: `Going deeper: ${node} → ${neighbor}`,
                });
                dfsHelper(neighbor);
            } else {
                steps.push({
                    visited: [...visited],
                    current: node,
                    codeLines: [2],
                    msg: `Neighbor ${neighbor} already visited, skip.`,
                });
            }
        }

        steps.push({
            visited: [...visited],
            current: node,
            codeLines: [4],
            msg: `Backtrack from node ${node}`,
        });
    }

    dfsHelper(start);
    steps.push({
        visited: [...visited],
        current: null,
        codeLines: [],
        msg: `DFS Complete! Visited order: ${[...visited].join(' → ')}`,
    });

    return steps;
}

export function dijkstra(graph, start) {
    const steps = [];
    const dist = {};
    const visited = new Set();

    Object.keys(graph).forEach((node) => (dist[node] = Infinity));
    dist[start] = 0;

    steps.push({
        dist: { ...dist },
        visited: [...visited],
        current: null,
        codeLines: [0, 1, 2],
        msg: `Init distances. dist[${start}] = 0, all others = ∞`,
    });

    while (visited.size < Object.keys(graph).length) {
        const node = Object.keys(dist)
            .filter((n) => !visited.has(n))
            .reduce((a, b) => (dist[a] < dist[b] ? a : b));

        visited.add(node);
        steps.push({
            dist: { ...dist },
            visited: [...visited],
            current: node,
            codeLines: [3, 4],
            msg: `Pick min dist node: ${node} (dist=${dist[node]})`,
        });

        for (const [neighbor, weight] of (graph[node] || [])) {
            const newDist = dist[node] + weight;
            if (newDist < dist[neighbor]) {
                dist[neighbor] = newDist;
                steps.push({
                    dist: { ...dist },
                    visited: [...visited],
                    current: node,
                    codeLines: [5, 6, 7],
                    msg: `Update dist[${neighbor}] = ${newDist} via ${node}`,
                });
            } else {
                steps.push({
                    dist: { ...dist },
                    visited: [...visited],
                    current: node,
                    codeLines: [5],
                    msg: `No update for ${neighbor}: current dist ${dist[neighbor]} ≤ ${newDist}`,
                });
            }
        }
    }

    steps.push({
        dist: { ...dist },
        visited: [...visited],
        current: null,
        codeLines: [],
        msg: `Dijkstra Complete! Shortest distances from ${start}: ${JSON.stringify(dist)}`,
    });

    return steps;
}

export const DEFAULT_GRAPH = {
    A: ['B', 'C'],
    B: ['A', 'D', 'E'],
    C: ['A', 'F'],
    D: ['B'],
    E: ['B', 'F'],
    F: ['C', 'E'],
};

export const DIJKSTRA_GRAPH = {
    A: [['B', 4], ['C', 2]],
    B: [['A', 4], ['D', 3], ['E', 1]],
    C: [['A', 2], ['F', 5]],
    D: [['B', 3]],
    E: [['B', 1], ['F', 2]],
    F: [['C', 5], ['E', 2]],
};