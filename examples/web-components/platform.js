import createSecureEnvironment from '../../lib/browser-realm.js';

// getting reference to the function to be distorted
const { get: ShadowRootHostGetter } = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, 'host');
const { assignedNodes, assignedElements } = HTMLSlotElement.prototype;

const distortionMap = new Map();
distortionMap.set(ShadowRootHostGetter, _ => { throw new Error(`Forbidden`); });
distortionMap.set(assignedNodes, _ => { throw new Error(`Forbidden`); });
distortionMap.set(assignedElements, _ => { throw new Error(`Forbidden`); });

function distortionCallback(t) {
    const d = distortionMap.get(t);
    return d === undefined ? t : d;
}

function evaluateInNewSandbox(sourceText) {
    const secureGlobalThis = createSecureEnvironment(distortionCallback);
    secureGlobalThis.eval(sourceText);
}

document.querySelector('button').addEventListener('click', function (e) {
    const sourceText = document.querySelector('textarea').value;
    evaluateInNewSandbox(sourceText);
});
