import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

async function deployDiscrateStakingToken() {
  const [stakingPoolOwner, alice, bob] = await hre.ethers.getSigners();

  const StakingToken = await hre.ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy();

  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();

  const DiscrateStakingPool = await hre.ethers.getContractFactory(
    "DiscreteStakingPool"
  );
  const disCrateStakingPool = await DiscrateStakingPool.deploy(
    stakingToken,
    rewardToken
  );

  return {
    stakingToken,
    rewardToken,
    disCrateStakingPool,
    stakingPoolOwner,
    alice,
    bob,
  };
}

async function deployStakingToken() {
  const [stakingPoolOwner, alice, bob, carol] = await hre.ethers.getSigners();

  const StakingToken = await hre.ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy();

  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();

  const StakingPool = await hre.ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(stakingToken, rewardToken);

  return {
    stakingToken,
    rewardToken,
    stakingPool,
    stakingPoolOwner,
    alice,
    bob,
    carol,
  };
}

describe("Discrate Staking Pool Verify", function () {
  it("Should get the right result, happy path", async function () {
    const {
      stakingToken,
      rewardToken,
      disCrateStakingPool,
      stakingPoolOwner,
      alice,
      bob,
    } = await loadFixture(deployDiscrateStakingToken);

    const initStakingTokens = hre.ethers.parseEther("1000");
    await stakingToken
      .connect(stakingPoolOwner)
      .transfer(alice.address, initStakingTokens);

    expect(await stakingToken.balanceOf(alice)).to.equal(initStakingTokens);

    await stakingToken
      .connect(stakingPoolOwner)
      .transfer(bob.address, initStakingTokens);

    expect(await stakingToken.balanceOf(bob)).to.equal(initStakingTokens);

    const initStakingReward = hre.ethers.parseEther("1000");
    await rewardToken
      .connect(stakingPoolOwner)
      .transfer(disCrateStakingPool, initStakingReward);

    expect(await rewardToken.balanceOf(disCrateStakingPool)).to.equal(
      initStakingReward
    );

    const alice1stStakingValue = hre.ethers.parseEther("100");
    await stakingToken
      .connect(alice)
      .approve(disCrateStakingPool, alice1stStakingValue);

    await disCrateStakingPool.connect(alice).stake(alice1stStakingValue);

    expect(await disCrateStakingPool.balanceOf(alice)).to.equal(
      alice1stStakingValue
    );

    const the1stStakingReward = hre.ethers.parseEther("100");
    await rewardToken
      .connect(stakingPoolOwner)
      .approve(disCrateStakingPool, the1stStakingReward);

    await disCrateStakingPool
      .connect(stakingPoolOwner)
      .updateRewardIndex(the1stStakingReward);

    expect(await disCrateStakingPool.calculateRewardsEarned(alice)).to.equal(
      the1stStakingReward
    );

    const alice2ndStakingValue = hre.ethers.parseEther("100");
    await stakingToken
      .connect(alice)
      .approve(disCrateStakingPool, alice2ndStakingValue);

    await disCrateStakingPool.connect(alice).stake(alice2ndStakingValue);

    expect(await disCrateStakingPool.balanceOf(alice)).to.equal(
      alice1stStakingValue + alice2ndStakingValue
    );

    const bob1stStakingValue = hre.ethers.parseEther("100");
    await stakingToken
      .connect(bob)
      .approve(disCrateStakingPool, bob1stStakingValue);

    await disCrateStakingPool.connect(bob).stake(bob1stStakingValue);

    expect(await disCrateStakingPool.balanceOf(bob)).to.equal(
      bob1stStakingValue
    );

    expect(await disCrateStakingPool.totalSupply()).to.equal(
      alice1stStakingValue + alice2ndStakingValue + bob1stStakingValue
    );

    const the2ndStakingReward = hre.ethers.parseEther("150");
    await rewardToken
      .connect(stakingPoolOwner)
      .approve(disCrateStakingPool, the2ndStakingReward);

    await disCrateStakingPool
      .connect(stakingPoolOwner)
      .updateRewardIndex(the2ndStakingReward);

    expect(await disCrateStakingPool.calculateRewardsEarned(alice)).to.equal(
      the1stStakingReward + (the2ndStakingReward * 2n) / 3n
    );

    expect(await disCrateStakingPool.calculateRewardsEarned(bob)).to.equal(
      (the2ndStakingReward * 1n) / 3n
    );

    const alice1stWithdrawValue = hre.ethers.parseEther("100");
    await disCrateStakingPool.connect(alice).unstake(alice1stWithdrawValue);

    const the3rdStakingReward = hre.ethers.parseEther("100");
    await rewardToken
      .connect(stakingPoolOwner)
      .approve(disCrateStakingPool, the3rdStakingReward);

    await disCrateStakingPool
      .connect(stakingPoolOwner)
      .updateRewardIndex(the3rdStakingReward);

    expect(await disCrateStakingPool.calculateRewardsEarned(alice)).to.equal(
      the1stStakingReward +
        (the2ndStakingReward * 2n) / 3n +
        (the3rdStakingReward * 1n) / 2n
    );

    expect(await disCrateStakingPool.calculateRewardsEarned(bob)).to.equal(
      (the2ndStakingReward * 1n) / 3n + (the3rdStakingReward * 1n) / 2n
    );

    const alice2ndWithdrawValue = hre.ethers.parseEther("100");
    await disCrateStakingPool.connect(alice).unstake(alice2ndWithdrawValue);

    const the4thStakingReward = hre.ethers.parseEther("100");
    await rewardToken
      .connect(stakingPoolOwner)
      .approve(disCrateStakingPool, the4thStakingReward);

    await disCrateStakingPool
      .connect(stakingPoolOwner)
      .updateRewardIndex(the4thStakingReward);

    expect(await disCrateStakingPool.calculateRewardsEarned(alice)).to.equal(
      the1stStakingReward +
        (the2ndStakingReward * 2n) / 3n +
        (the3rdStakingReward * 1n) / 2n
    );

    expect(await disCrateStakingPool.calculateRewardsEarned(bob)).to.equal(
      (the2ndStakingReward * 1n) / 3n +
        (the3rdStakingReward * 1n) / 2n +
        the4thStakingReward
    );
  });
});


