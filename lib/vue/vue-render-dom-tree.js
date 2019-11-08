let VueRenderDomTree = function(h) {
    this.h = h;
    let root = new VueRenderDomTree.Element('div');
    root.dom = this;
    this.root = root;
}

VueRenderDomTree.prototype.createElement = function(name, options) {
    return this.root.createElement(name, options);
}

VueRenderDomTree.prototype.setOptions = function(options) {
    this.root.options = options;
    return this.root;
}

VueRenderDomTree.Element = function(name, options) {
    this.name = name;
    this.options = options;

};

VueRenderDomTree.Element.prototype.createElement = function(name, options) {
    let el = new VueRenderDomTree.Element(name, options);
    this.append(el);
    return el;
}

VueRenderDomTree.Element.prototype.append = function(element) {
    if (!this.children) {
        this.children = [];
    }
    element.dom = this.dom;
    this.children.push(element);
    return element;
}

VueRenderDomTree.Element.prototype.render = function() {
    let name = this.name;
    let dom = this.dom;
    if (!dom) {
        console.warn("element ", name, " is not append to dom");
        return;
    }
    let h = dom.h;
    let childrenRender = [];
    if (this.options.text) {
        childrenRender.push(this.options.text);
    }
    let children = this.children;
    if (children) {
        children.forEach(c => {
            if (c instanceof VueRenderDomTree.Element) {
                childrenRender.push(c.render());
            } else if (typeof c === "Number") {
                childrenRender.push(c + "");
            } else {
                childrenRender.push(c);
            }
        });
    }
    return h(name, this.options, childrenRender);
}

VueRenderDomTree.prototype.render = function() {
    return this.root.render();
}