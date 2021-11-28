export class RouteList extends Array{
  format () { 
    return this.map((r, i) => {
      const header = `Option (${i+1})  ${r.summary()}`;

      const portals = r.map(p =>
          `  ${p.from.level} -> ${p.to.level}: Activated by ${p.activation}: ` +
          `([${p.from.location}] -> ` +
          `[${p.to.location}])`
      )

      return [header, ...portals].join("\n");
    }).join("\n\n");
  }
  print () {
    if (this.length > 0) console.log(this.format());
  }
}


export class PortalList extends Array {
  allLevels () {
    return [...new Set(this.flatMap(p => p.levels()))].sort((a, b) => a - b);
  }

  allGates () {
    return this.flatMap(p => p.gates);
  }

  toRouteList (basedOnRoute=[]) {
    return new RouteList(...this.map(p => new Route(...basedOnRoute, p)));
  }
}


export class Route extends Array {
  latestTo () {
    return this[this.length - 1].to.level;
  }

  traversed () {
    return this.map(p => p.from.level);
  }

  summary () {
    return [this[0].from.level, ...this.map(p => p.to.level)].join(" -> ");
  }
}


export class PortalUnrouted {
  constructor (activation, upperGate, lowerGate) {
    this.id = PortalUnrouted.new_id();
    this.activation = activation;
    this.gates = [upperGate, lowerGate];
  }

  static id = 0;
  static new_id () {
    this.id++;
    return this.id;
  }

  levels () {
    return this.gates.map(g => g.level);
  }

  routedFrom (level) {
    const from = this.gates.filter(g => g.level === level)[0];
    const to = this.gates.filter(g => g.level !== level)[0];
    return new Portal(this.id, this.activation, from, to);
  }
}


export class Portal {
  constructor (id, activation, from, to) {
    this.id = id;
    this.activation = activation;
    this.from = from;
    this.to = to;
  }
}


export class Gate {
  constructor ({ level, location, discovered }) {
    this.level = level;
    this.location = location;
    this.discovered = discovered;
  }
}
