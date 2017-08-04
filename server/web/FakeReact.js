var React = {
    createElement: function (tag, attrs, children) {
        var e = document.createElement(tag);

        // Add attributes
        for (var name in attrs) {
            if (name && attrs.hasOwnProperty(name)) {
                var v = attrs[name];
                if (v === true) {
                    e.setAttribute(name, name);
                } else if (v !== false && v != null) {
                    e.setAttribute(name, v.toString());
                }
            }
        }

        // Append children
        for (var i = 2; i < arguments.length; i++) {
            var child = arguments[i];
            e.appendChild(
                child.nodeType == null ?
                document.createTextNode(child.toString()) :
                child
            );
        }

        return e;
    }
}
