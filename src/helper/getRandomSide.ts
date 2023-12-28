const x = 10;
const quarterPeriod = Math.PI * (1 / 2);

export type rotationType = {
  x: number;
  y: number;
  z: number;
};

const rotations: { [key: number]: rotationType } = {
  1: {
    x: 1,
    y: 1,
    z: 1,
  },
  2: {
    x: 3,
    y: 1,
    z: 1,
  },
  3: {
    x: 1,
    y: 1,
    z: 0,
  },
  4: {
    x: 3,
    y: 1,
    z: 0,
  },
  5: {
    x: 2,
    y: 2,
    z: 0,
  },
  6: {
    x: 0,
    y: 2,
    z: 0,
  },
};

const getCompleteRotations = (basicRotation: rotationType): rotationType => {
  return {
    x: Math.PI * (1 / 2) * (basicRotation.x + 1.5 * x) + 0.2,
    y: Math.PI * (1 / 2) * (basicRotation.y + 1.5 * x) + 0.2,
    z: Math.PI * (1 / 2) * (basicRotation.z + 1.5 * x) + 0.2,
  };
};

export const getRandomSideRotation = () => {
  const random = (Math.floor(Math.random() * 100) % 6) + 1;
  console.log({ random });
  const basicRotations = rotations[`${random}`];
  const completeRotations = getCompleteRotations(basicRotations);

  console.log({ basicRotations, completeRotations });

  return {
    basicRotations: {
      x: quarterPeriod * basicRotations.x + 0.2,
      y: quarterPeriod * basicRotations.y + 0.2,
      z: quarterPeriod * basicRotations.z + 0.2,
    },
    completeRotations,
  };
};
