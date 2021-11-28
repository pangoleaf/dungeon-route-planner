import { PortalList, PortalUnrouted, Gate, RouteList } from './models.js';
import { notAvoided } from './utils.js';

export class RoutePlanner {
  constructor (portalData) {
    this.portals = new PortalList(
      ...portalData.map(r => new PortalUnrouted(
        r.activation,
        new Gate(r.gates[0]),
        new Gate(r.gates[1]),
      ))
    );
  }

  // list every portal with a gate on given level
  allDests (level, avoid, ignore=[]) {
    return this.portals
      .filter(p => p.levels().includes(level))
      .filter(p => notAvoided(avoid, p.gates.map(g => g.level)))
      .map(p => p.routedFrom(level))
      .filter(p => !ignore.includes(p.to.level));
  };

  // recursively build RouteList of Rutes, when 1+ reaches destination returns only those routes
  buildRoutes (dest, routes, avoid, depth=1) {
    if (depth >= Math.max(this.portals.allLevels())) 
      return new RouteList().withComment("No current route known, not even walking apparently");
    
    const winners = routes.filter(r => r.latestTo() === dest);

    return winners.length > 0
      ? winners
      : this.buildRoutes(
        dest,
        routes.flatMap(r => this.allDests(r.latestTo(), avoid, r.traversed()).toRoutes(r)),
        avoid,
        depth+1
      );
  }

  // Check route is possible and kick off buildRoutes
  findRoutes (start, dest, avoid=[]) {
    if (!this.portals.allLevels().includes(dest)) 
      return new RouteList().withComment(`No portals to ${dest} have been found yet!`);

    return this.buildRoutes(
      dest,
      this.allDests(start, avoid).toRoutes(),
      avoid
    );
  };
}
