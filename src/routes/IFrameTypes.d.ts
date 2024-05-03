// Custom type defs
interface AttributeMap {
  [key: string]: string | undefined;
}

interface IFrameElement {
  el: DOMElement;
  attrs: AttributeMap;
}
