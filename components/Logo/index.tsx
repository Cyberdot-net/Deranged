import { FC } from "react"
import Image from "next/image"

type LogoProps = {
  size?: string
}

export const Logo: FC<LogoProps> = ({ size = "text-lg" }) => {
  return (
    <div className={`flex items-center ${size} gap-1 font-audiowide tracking-wide`}>
      <Image src="/images/logo.png" alt="Deranged" width={260} height={50} />
    </div>
  )
}
