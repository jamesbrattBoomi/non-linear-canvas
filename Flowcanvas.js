import React from "react"

const data = require('./data.json');

const COLOURS = {
    input: 'rgb(103, 165, 231)',
    step: 'rgb(98, 183, 237)',
    decision: 'rgb(124, 207, 96)',
    operator: 'rgb(95, 204, 100)',
    message: 'rgb(84, 196, 115)',
    return: 'rgb(158, 158, 158)',
    database_save: 'rgb(235, 104, 127)',
    database_load: 'rgb(248, 125, 118)',
    database_delete: 'rgb(217, 88, 121)',
    START: '#34b59d',
}

const Flowcanvas = () => {

    const generateRoute = (e, routes, loopBackId) => {
        const elements = [];

        const generate = (elem, l) => {

            let loopBack = null;
            let branches = [];

            if (elem.outcomes && elem.id !== loopBackId && elem.id !== l) {
                if (elem.elementType === 'input' || elem.elementType === 'decision') {
                    branches = elem.outcomes.map(outcome => {
                        const nextElement = data.mapElements.find(m => m.id === outcome.nextMapElementId);
                        if (nextElement.outcomes === null) {
                            loopBack = null
                        } else if (nextElement.outcomes.filter(o => routes.some(r => r === o.id)).length > 0) {
                            loopBack = nextElement.id
                        }

                        const updatedRoutes = [
                            ...routes,
                            outcome.id,
                        ];
                        return { name: outcome.developerName, elements: generateRoute(nextElement, updatedRoutes, loopBack) };
                    
                    });
                }
            }

            if (elem.outcomes) {
                if (elem.elementType !== 'input' && elem.elementType !== 'decision') {
                    const nextElement = data.mapElements.find(m => m.id === elem.outcomes[0].nextMapElementId);
                    if (nextElement.outcomes === null) {
                        loopBack = null
                    } else if (nextElement.outcomes.filter(o => routes.some(r => r === o.id)).length > 0) {
                        loopBack = nextElement.id
                    }
                    generate(nextElement, loopBack);
                }
            }

            elements.unshift({ element: elem, branches });
        }

        generate(e);
        return elements;
    }

    const rects = [];

    const renderFlow = (branches, x, y) => {
        let xCounter = x;
        let yCounter = y;

        branches.elements.forEach(e => {
            const fill = COLOURS[e.element.elementType];
            const domNode = <rect x={xCounter} y={y} width="100px" height="40px" fill={fill} />

            rects.push(domNode);

            xCounter = xCounter + 110;

            if (e.branches.length > 0) {

                e.branches.sort((a, b) => {
                    return b.elements.length - a.elements.length;
                });

                e.branches.forEach(b => {
                    yCounter = yCounter + 50
                    renderFlow(b, xCounter, yCounter)
                })
            }
        })
    }

    const startElement = data.mapElements.find(m => m.elementType === 'START');
    const flowData = generateRoute(startElement, [], null)
    renderFlow({ name: 'root', elements: flowData }, 0, 0)

    return (
        <svg fill="red" style={{ width: '1000px', height: '1000px' }}>
            {rects}
        </svg>
    )
}

export default Flowcanvas