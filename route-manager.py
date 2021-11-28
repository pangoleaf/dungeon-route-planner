from dataclasses import dataclass
import jsonpickle as jp


@dataclass
class Gate:
    level: int
    location: str
    discovered: bool = True


@dataclass
class Route:
    id: int
    activation: str
    gates: list[Gate]


@dataclass
class RouteList:
    routes_path: str = "./routes"

    def load_routes(self):
        with open(self.routes_path + ".json", "r") as f:
            file_contents = f.read()
        self.routes = jp.decode(file_contents) if file_contents else []
        return self

    def save_routes(self, js=False):
        ext = ".js" if js else ".json"
        with open(self.routes_path + ext, "w") as f:
            if js:
                f.write("export default ")
            f.write(jp.encode(self.routes))  # , unpicklable=False
        return self

    def new_route_id(self, routes):
        try:
            return max([r.id for r in self.routes]) + 1
        except ValueError:
            return 1

    def add_route(self, activation, g1lvl, g1loc, g1dsc, g2lvl, g2loc, g2dsc):
        self.routes.append(
            Route(
                self.new_route_id(self.routes),
                activation,
                [
                    Gate(g1lvl, g1loc, g1dsc),
                    Gate(g2lvl, g2loc, g2dsc),
                ],
            )
        )
        return self


routes = (
    RouteList()
    .load_routes()
    # .add_route(
    #     "Saying \"Axalan\"",
    #     10,
    #     "Muiral's Gauntlet - Skull mirror room off mezzanine floor",
    #     True,
    #     12,
    #     "The Maze (working title)",
    #     True
    # )
    .save_routes()
    .save_routes(js=True)
)
