(function () {
  if (!Set.prototype.union) {
    Set.prototype.union = function (other: Set<any>): Set<any> {
      const res = new Set(this);
      for (const o of other) {
        res.add(o);
      }
      return res;
    };
  }
})();
