import { HardhatRuntimeEnvironment } from "hardhat/types";

declare module "hardhat/types" {
  interface HardhatRuntimeEnvironment {
    ethers: any; // Replace 'any' with the correct type if available
  }
}