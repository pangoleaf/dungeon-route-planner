import routes from "./routes.js"

class Gate {
  constructor (level, location) {
    this.level = level;
    this.location = location;
  }
}

class Route {
  constructor (activation, gates) {
    this.id = this.new_id()
    this.activation = activation;
    this.gates = gates;
  }
  new_id () {
    return routes.reduce((curr, prev) => curr.id > prev ? curr.id : prev, 0)
  }
}
