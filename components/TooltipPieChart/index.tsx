import { useState, ComponentProps } from "react"
import ReactTooltip from "react-tooltip"
import { PieChart } from "react-minimal-pie-chart"

// type CustomPieChartData = ComponentProps<typeof PieChart>["data"] & {
//   tooltip: string;
//   title: string;
//   hovered: number;
//   value: string
// };

// type Props = {
//   data: ComponentProps<typeof PieChart>["data"];
// };

// function makeTooltipContent(entry: CustomPieChartData) {
//   return `${entry.tooltip} - ${entry.value}%`;
// }
type Props = {
  data: ComponentProps<typeof PieChart>["data"];
}

const makeTooltipContent = (index: number) => {
  // return `${entry.tooltip} - ${entry.value}%`
  if (index === 4) return "Liquidity Pool - 52%"
  if (index === 3) return "Marketing and Collaboration - 4%"
  if (index === 2) return "Central Exchange(CEX) - 4%"
  if (index === 1) return "Premium Claim - 25%"
  if (index === 0) return "Free Claim - 15%"
}

export const ToolTipPieChart = (props: Props) => {
  const [hovered, setHovered] = useState<number | null>(null)
  const data = props.data.map(({ title, ...entry }) => {
    return {
      ...entry,
      tooltip: title
    }
  })

  return (
    <div data-tip="" data-for="chart">
      <PieChart
        className="w-[20rem] xs:w-[15rem] mx-auto"
        data={data}
        lineWidth={30}
        paddingAngle={10}
        onMouseOver={(_, index) => {
          setHovered(index)
        }}
        onMouseOut={() => {
          setHovered(null)
        }}
      />
      <ReactTooltip
        id="chart"
        type="light"
        getContent={() =>
          typeof hovered === "number" ? makeTooltipContent(hovered) : null
        }
      />
    </div>
  )
}
