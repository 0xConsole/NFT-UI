import {
  RiDashboardLine,
  RiPlantLine,
  RiSafe2Line,
  RiBook2Line,
  RiRoadMapLine,
  RiFireLine,
  RiLineChartLine,
  RiExchangeLine,
  RiExternalLinkLine,
  RiGamepadLine
} from "react-icons/ri";
import { BASE_Address } from "../contracts/ContractProvider";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard  ",
    to: "/dashboard",
    icon: <RiDashboardLine className="ml-1 mr-3 mb-0 text-primary h5" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Farms",
    to: "/farms",
    icon: <RiPlantLine className="ml-1 mr-3 mb-0 text-primary h5" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Vaults",
    to: "/vaults",
    icon: <RiSafe2Line className="ml-1 mr-3 mb-0 text-primary h5" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Pyromaniacs",
    to: "/pyromaniacs",
    icon: <RiFireLine className="ml-1 mr-3 mb-0 text-primary h5" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: "Roadmap",
    to: "/roadmap",
    icon: <RiRoadMapLine className="ml-1 mr-3 mb-0 text-primary h5" />,
  },

  {
    _tag: "CSidebarNavItem",
    name: (
      <div>
        Charts <RiExternalLinkLine style={{ marginBottom: "2px" }} />
      </div>
    ),
    href: "https://swap.arken.finance/tokens/polygon/0xf239e69ce434c7fb408b05a0da416b14917d934e",
    target: "_blank",
    icon: <RiLineChartLine className="ml-1 mr-3 mb-0 text-primary h5" />,
  },
  {
    _tag: "CSidebarNavItem",
    name: (
      <div>
        Documentation <RiExternalLinkLine style={{ marginBottom: "2px" }} />
      </div>
    ),
    href: "https://docs.polyshield.finance",
    target: "_blank",
    icon: <RiBook2Line className="ml-1 mr-3 mb-0 text-primary h5" />,
  },
  {
    _tag: "CSidebarNavDropdown",
    route: "/games",
    name: "Games",
    icon: <RiGamepadLine className="ml-1 mr-3 mb-0 text-primary h5" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: <div style={{marginLeft: '50px'}}>{"Rug Quest"}</div>,
        href: "https://rug.quest",
        target: "_blank",
        badge: {
          color: 'success',
          text: 'PLAY',
        }
      },
      {
        _tag: "CSidebarNavItem",
        name: <div style={{marginLeft: '50px'}}>{"Secret Lotto"} </div>,
        href: "https://supersecretlotto.com/",
        target: "_blank",
        badge: {
          color: 'success',
          text: 'PLAY',
        }
      }
    ]
  },
  {
    _tag: "CSidebarNavDropdown",
    route: "/bridge",
    name: "Bridge",
    icon: <RiExchangeLine className="ml-1 mr-3 mb-0 text-primary h5" />,
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: <div style={{marginLeft: '50px'}}>{"CAKE -> PCAKE"} <RiExternalLinkLine style={{ marginBottom: "2px" }} /></div>,
        href: "https://bridge.orbitchain.io/",
        target: "_blank",
      },
      {
        _tag: "CSidebarNavItem",
        name: <div style={{marginLeft: '50px'}}>{"BNB -> SHI3LD"} <RiExternalLinkLine style={{ marginBottom: "2px" }} /></div>,
        href: "https://bridge.evodefi.com/exchange?from=bsc&to=polygon&in=0x0000000000000000000000000000000000000001&out=0xf239e69ce434c7fb408b05a0da416b14917d934e",
        target: "_blank",
      }
    ]
  },
  /*
  {
    _tag: "CSidebarNavItem",
    name: "NFTs",
    to: "/nfts",
    icon: <RiRoadMapLine className="ml-1 mr-3 mb-0 text-primary h5" />,
  },*/
];

export default _nav;
