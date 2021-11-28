from dataclasses import dataclass
import jsonpickle as jp


@dataclass
class Gate:
    level: int
    location: str
    discovered: bool = True


@dataclass
class Portal:
    id: int
    activation: str
    gates: list[Gate]


@dataclass
class PortalList:
    portals_path: str = "./portals"

    def load_portals(self):
        with open(self.portals_path + ".json", "r") as f:
            file_contents = f.read()
        self.portals = jp.decode(file_contents) if file_contents else []
        return self

    def save_portals(self, js=False):
        ext = ".js" if js else ".json"
        with open(self.portals_path + ext, "w") as f:
            if js:
                f.write("export default ")
            f.write(jp.encode(self.portals, unpicklable=False))  # , unpicklable=False
        return self

    def new_route_id(self, portals):
        try:
            return max([r.id for r in self.portals]) + 1
        except ValueError:
            return 1

    def add_route(self, activation, g1lvl, g1loc, g1dsc, g2lvl, g2loc, g2dsc):
        self.portals.append(
            Portal(
                self.new_route_id(self.portals),
                activation,
                [
                    Gate(g1lvl, g1loc, g1dsc),
                    Gate(g2lvl, g2loc, g2dsc),
                ],
            )
        )
        return self


portals = (
    PortalList()
    .load_portals()
    # .add_route(
    #     "Saying \"Axalan\"",
    #     10,
    #     "Muiral's Gauntlet - Skull mirror room off mezzanine floor",
    #     True,
    #     12,
    #     "The Maze (working title)",
    #     True
    # )
    .save_portals()
    .save_portals(js=True)
)

# # Adding walking portals
# portals = PortalList().load_portals()
# for i in range(1, 13):
#     portals.add_route(
#         "Walking",
#         i,
#         "",
#         True,
#         i+1,
#         "",
#         True
#     )
# portals.save_portals().save_portals(js=True)