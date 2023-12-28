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
    x: Math.PI * (1 / 2) * (basicRotation.x + 1.0 * x),
    y: Math.PI * (1 / 2) * (basicRotation.y + 1.0 * x),
    z: Math.PI * (1 / 2) * (basicRotation.z + 1.0 * x),
  };
};

export const getRandomSideRotation = () => {
  const random = (Math.floor(Math.random() * 100) % 6) + 1;
  const basicRotations = rotations[`${random}`];
  const completeRotations = getCompleteRotations(basicRotations);

  return {
    basicRotations: {
      x: quarterPeriod * basicRotations.x,
      y: quarterPeriod * basicRotations.y,
      z: quarterPeriod * basicRotations.z,
    },
    completeRotations,
  };
};
