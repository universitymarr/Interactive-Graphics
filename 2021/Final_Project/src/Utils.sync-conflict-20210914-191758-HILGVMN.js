class Utils {

  dumpVec3(v3, precision = 3) {
    return `${v3.x.toFixed(precision)}, ${v3.y.toFixed(precision)}, ${v3.z.toFixed(precision)}`;
  }
    
  dumpObject(obj, lines=[], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const dataPrefix = obj.children.length
        ? (isLast ? '  │ ' : '│ │ ')
        : (isLast ? '    ' : '│   ');
    lines.push(`${prefix}${dataPrefix}  pos: ${this.dumpVec3(obj.position)}`);
    lines.push(`${prefix}${dataPrefix}  rot: ${this.dumpVec3(obj.rotation)}`);
    lines.push(`${prefix}${dataPrefix}  scl: ${this.dumpVec3(obj.scale)}`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      this.dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

};

export { Utils };



