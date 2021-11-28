import { PortalList, PortalUnrouted, Gate, RouteList } from './models.js';
import { dir, arrInclArr} from './utils.js';

import importedPortals from './portals.js';

class RoutePlanner {

  constructor (portalData) {
    this.portals = new PortalList(
      ...portalData.map(r => new PortalUnrouted(
        r.activation,
        new Gate({ ...r.gates[0] }),
        new Gate({ ...r.gates[1] }),
      ))
    );
  }

  allDests (level, ignore, avoid) {
    return this.portals
      .filter(p => p.levels().includes(level))
      .map(p => p.routedFrom(level))
      .filter(p => !ignore.includes(p.to.level))
      .filter(p => !arrInclArr(avoid, [p.from.level,p.to.level]))
      .filter(p => !arrInclArr(avoid, [p.to.level,p.from.level]));
  };

  buildRoutes (dest, routes, avoid, walking, depth=1) {
    if (depth >= walking) {
      console.log("No good route, best to walk it!");
      return new RouteList();
    }

    const winners = routes.filter(r => r.latestTo() === dest);
    return winners.length > 0
      ? winners
      : this.buildRoutes(
        dest,
        routes.flatMap(r => this.allDests(r.latestTo(), r.traversed(), avoid).toRouteList(r)),
        avoid,
        walking,
        depth+1
      );
  }

  findRoutes (start, dest, avoid=[]) {
    if (!this.portals.allLevels().includes(dest)) {
      console.log(`No portals to ${dest} have been found yet!`);
      return new RouteList();
    }

    const walking = Math.abs(dest - start);

    return this.buildRoutes(
      dest,
      this.allDests(start, [], avoid).toRouteList(),
      avoid,
      walking
    );
  };
}

const planner = new RoutePlanner(importedPortals);

// const avoid = [[11,6], [10,6]];
// planner.findRoutes(7, 5, avoid).print();


planner.findRoutes(8, 3, [[6, 3], [5, 3]]).print();
