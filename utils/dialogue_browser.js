document.addEventListener('DOMContentLoaded', function () {
    const locationPicker = document.getElementById('location-picker');
    const npcPicker = document.getElementById('npc-picker');
    const graphContainer = document.getElementById('graph-container');
    const nodeDetailsContent = document.getElementById('node-details-content');

    const nodesCountEl = document.getElementById('nodes-count');
    const unconditionalEdgesCountEl = document.getElementById('unconditional-edges-count');
    const conditionalEdgesCountEl = document.getElementById('conditional-edges-count');

    let network = null;
    let allNpcData = {};

    function initializePickers() {
        for (const locationId in NPC_DATA) {
            allNpcData[locationId] = {};
            for (const npcId in NPC_DATA[locationId]) {
                allNpcData[locationId][npcId] = NPC_DATA[locationId][npcId];
            }
        }

        Object.keys(LOCATION_DATA).forEach(locationId => {
            const option = document.createElement('option');
            option.value = locationId;
            option.textContent = LOCATION_DATA[locationId].name;
            locationPicker.appendChild(option);
        });

        locationPicker.addEventListener('change', populateNpcPicker);
        npcPicker.addEventListener('change', drawGraph);

        populateNpcPicker();
    }

    function populateNpcPicker() {
        const selectedLocationId = locationPicker.value;
        npcPicker.innerHTML = '';
        if (LOCATION_DATA[selectedLocationId] && LOCATION_DATA[selectedLocationId].npcs) {
            LOCATION_DATA[selectedLocationId].npcs.forEach(npcId => {
                if (NPC_DATA[selectedLocationId] && NPC_DATA[selectedLocationId][npcId]) {
                    const option = document.createElement('option');
                    option.value = npcId;
                    option.textContent = NPC_DATA[selectedLocationId][npcId].name;
                    npcPicker.appendChild(option);
                }
            });
        }
        drawGraph();
    }

    function drawGraph() {
        nodesCountEl.textContent = '0';
        unconditionalEdgesCountEl.textContent = '0';
        conditionalEdgesCountEl.textContent = '0';

        const locationId = locationPicker.value;
        const npcId = npcPicker.value;

        if (!locationId || !npcId || !allNpcData[locationId] || !allNpcData[locationId][npcId]) {
            if (network) network.destroy();
            graphContainer.innerHTML = 'No NPC selected or data not found.';
            return;
        }

        const npc = allNpcData[locationId][npcId];
        const dialogueGraph = npc.dialogue_graph;

        if (!dialogueGraph) {
            if (network) network.destroy();
            graphContainer.innerHTML = 'This NPC has no dialogue graph.';
            return;
        }

        const nodes = [];
        const edges = [];
        const nodeIds = Object.keys(dialogueGraph);

        let unconditionalEdgeCount = 0;
        let conditionalEdgeCount = 0;
        nodesCountEl.textContent = nodeIds.length;

        nodeIds.forEach(nodeId => {
            const nodeData = dialogueGraph[nodeId];
            const isSpecialNode = ['start', 'return', 'end', 'trade'].includes(nodeId);
            nodes.push({ id: nodeId, label: nodeId, color: isSpecialNode ? '#f99157' : '#6699cc', shape: 'box' });

            if (nodeData.destination_nodes) {
                nodeData.destination_nodes.forEach(dest => {
                    const destNode = dialogueGraph[dest.node_id];
                    // Check if the destination node has conditions (edges leading TO conditional nodes should be dotted)
                    const hasCondition = destNode && destNode.conditions && destNode.conditions.condition && destNode.conditions.condition.length > 0;
                    if (hasCondition) { conditionalEdgeCount++; } else { unconditionalEdgeCount++; }
                    edges.push({ from: nodeId, to: dest.node_id, arrows: 'to', dashes: hasCondition });
                });
            }
        });

        unconditionalEdgesCountEl.textContent = unconditionalEdgeCount;
        conditionalEdgesCountEl.textContent = conditionalEdgeCount;

        const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
        const options = {
            layout: { hierarchical: { enabled: true, direction: 'UD', sortMethod: 'directed', levelSeparation: 150, nodeSpacing: 150 } },
            physics: { enabled: false },
            nodes: { font: { color: '#ffffff' } },
            edges: {
                color: { color: '#cccccc', highlight: '#a2a2a2' },
                font: { align: 'middle', size: 10, color: '#f0f0f0', strokeWidth: 0 },
                smooth: { enabled: true, type: "cubicBezier", forceDirection: "vertical", roundness: 0.4 }
            },
            interaction: { hover: true }
        };

        if (network) { network.destroy(); }
        network = new vis.Network(graphContainer, data, options);

        network.on('selectNode', function (params) {
            if (params.nodes.length > 0) {
                const selectedNodeId = params.nodes[0];
                nodeDetailsContent.textContent = JSON.stringify(dialogueGraph[selectedNodeId], null, 2);
            } else {
                nodeDetailsContent.textContent = 'Select a node to see its details';
            }
        });
    }

    initializePickers();
});