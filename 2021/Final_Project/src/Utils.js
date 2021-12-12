class Utils {

  // source: three.js fundamentals
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

  print_dump_object(object){
    console.log(this.dumpObject(object).join('\n'));
  }
  // source: https://dmitripavlutin.com/how-to-compare-objects-in-javascript/
  isObject(object) {
    return object != null && typeof object === 'object';
  }
  deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = this.isObject(val1) && this.isObject(val2);
      if (
        areObjects && !this.deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
  
    return true;
  }
  
  deepCopy(object){
    return JSON.parse(JSON.stringify(object));
  }

};

export { Utils };



