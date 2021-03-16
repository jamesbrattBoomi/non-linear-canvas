import React from "react"

const data = require('./data.json')

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

    /*const generateRoute = (e) => {
        const elements = [];

        const generate = (elem) => {
            if (elem.outcomes) {
                return elem.outcomes.map(outcome => {
                    const nextElement = data.mapElements.find(m => m.id === outcome.nextMapElementId);
    
                    let children = [];
    
                    if (nextElement.elementType === 'input') {
                        children = generateRoute(nextElement);
                    }
    
                    elements.push({ element: nextElement, children });
                    if (nextElement.elementType !== 'input') {
                        generate(nextElement);
                    }
                })
            }
        }

        generate(e);
        return elements;
    }*/

    const startElement = data.mapElements.find(m => m.elementType === 'START');
    const flowData = generateRoute(startElement, [], null)
    console.log(flowData)

    return (
        <svg fill="red" style={{ width: '1000px', height: '1000px' }}></svg>
    )
}

export default Flowcanvas