const DEBUG = false;

const fs = require('fs');


fs.readFile(__dirname + '/input.txt', { encoding: 'utf8' }, (err, data) => {
    if (err) {
        console.log('err', err);
        return;
    }

    let graphDataAsText = "";
    let queryDataAsText = "";

    let lines = data.split("\n");

    for (let line of lines) {
        if (line[0] === '?')
            queryDataAsText += line + '\n';
        else
            graphDataAsText += line + '\n';
    }

    let queries = {};
    let queryLines = queryDataAsText.split('\n');
    for (let query of queryLines) {
        if (query === "") continue;
        
        let [_, from, to] = query.split(" ");
        
        !queries[from] && (queries[from] = []);
        queries[from].push(to);
        
    }

    for (let from of Object.keys(queries)) {
        let customPathFinder = new GraphPathFinder(graphDataAsText, from);
        for (let to of queries[from]) {
            let foundPath = customPathFinder.getPath(from, to);
            if (foundPath) {
                console.log(`The path from ${from} to ${to} is:`);
                console.log(foundPath.join(" -> "));
            } else {
                console.log(`The path from ${from} to ${to} DOESN'T EXIST!`);
            }
        }
    }
    
});

class GraphPathFinder {

    // create a minimal graph using Dijkstra's algorithm
    constructor(graphDataAsText, startVertex) {
        this.graph = {};

        this.visited = [];
        this.weightTable = {};
        this.fromTable = {};

        let lines = graphDataAsText.split('\n');
        for (let line of lines) {
            let [from, to, weight] = line.split(' ');

            !this.graph[from] && (this.graph[from] = []);
            !this.graph[to] && (this.graph[to] = []);

            if (!this.graph[from].find(v => v.to === to)) {
                this.graph[from].push({
                    to,
                    weight,
                });
            }
            if (!this.graph[to].find(v => v.to === from)) {
                this.graph[to].push({
                    to: from,
                    weight,
                });
            }

        }

        // recursive dijkstra function
        const helper = (curVertex, curWeight) => {
            this.visited.push(curVertex);

            if (!this.graph[curVertex])
                return;

            for (let neighbor of this.graph[curVertex]) {
                if (this.weightTable[neighbor.to] === undefined) {
                    this.fromTable[neighbor.to] = curVertex;
                    this.weightTable[neighbor.to] = +neighbor.weight + +curWeight;
                } else {
                    if (
                        +curWeight
                        + +neighbor.weight
                        < +this.weightTable[neighbor.to]) {
                        this.weightTable[neighbor.to] = +curWeight + +neighbor.weight;
                        this.fromTable[neighbor.to] = curVertex;
                    }
                }
            }

            // get the min
            let nextVertex = null;
            for (let vertex in this.weightTable) {
                if (this.visited.includes(vertex)) continue;
                if (!nextVertex)
                    nextVertex = vertex;
                else if (parseInt(this.weightTable[vertex]) < parseInt(this.weightTable[nextVertex])) {
                    nextVertex = vertex;
                }
            }

            if (DEBUG) {
                console.log('debug:');
                console.log(nextVertex);
                console.log(this.weightTable[nextVertex]);
            }

            if (nextVertex)
                helper(nextVertex, this.weightTable[nextVertex]);
        }


        let startWeight = 0;
        this.weightTable[startVertex] = startWeight;

        helper(startVertex, startWeight);

        if (DEBUG) {
            console.log(this.visited);
            console.log(this.weightTable);
            console.log(this.fromTable);
        }

    }

    getPath(from, to) {
        let res = [];

        if (from === to)
            return [from].concat(res);

        if (this.fromTable[to]) {
            let prev = this.fromTable[to];
            res.push(to);
            let remaining = this.getPath(from, prev);
            if (remaining)
                return remaining.concat(res);
            else
                return null;
        } else
            return null;
    }
}
