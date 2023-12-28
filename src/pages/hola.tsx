import { getRandomSideRotation, rotationType } from '@/helper/getRandomSide';
import {
  Canvas,
  MeshProps,
  ThreeElements,
  useFrame,
  useLoader,
} from '@react-three/fiber';
import {
  Dispatch,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as Three from 'three';

const mock = false;

export default function Hola() {
  const [basicRotations, setBasicRotations] = useState<rotationType | null>(
    null
  );
  const [rotateOnMouseMovement, setRotateOnMouseMovement] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const [completeRotations, setCompleteRotations] =
    useState<rotationType | null>(null);

  const rotate = async () => {
    setDisableClick(true);
    try {
      // So animations start immediately
      setBasicRotations({ x: 100, y: 100, z: 100 });
      setCompleteRotations({ x: 100, y: 100, z: 100 });
      //
      const response = mock
        ? getRandomSideRotation()
        : await fetch(process.env.NEXT_PUBLIC_LAMBDA_FUNCTION_ROUTE ?? '', {
            headers: {
              'Content-Type': 'application/json',
            },
          });
      var body =
        response instanceof Response ? await response.json() : response;

      const { basicRotations: bRotations, completeRotations: cRotations } =
        body;
      setBasicRotations(bRotations);
      setCompleteRotations(cRotations);
    } catch (error) {
      setDisableClick(false);
      console.log(error);
    }
  };

  const cancelRotation = () => {
    setBasicRotations(null);
    setCompleteRotations(null);
    setDisableClick(false);
  };

  return (
    <div
      id="canvas-container"
      className="w-full h-[100vh] transition ease-in-out delay-20 bg-background active:bg-secondary"
    >
      <Canvas
        onPointerDown={() => setRotateOnMouseMovement(true)}
        onPointerUp={() => setRotateOnMouseMovement(false)}
        // onPointerOut={() => setRotateOnMouseMovement(false)}
      >
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <Box
          basicRotations={basicRotations}
          completeRotations={completeRotations}
          setBasicRotations={setBasicRotations}
          setCompleteRotations={setCompleteRotations}
          rotateOnMouseMovement={rotateOnMouseMovement}
          setDisableClick={setDisableClick}
          cancelRotation={cancelRotation}
        />
      </Canvas>
      <div className="absolute bottom-[10%] flex  w-full -i-bg-[yellow] justify-center">
        <button
          className="p-2 px-5 rounded-lg transition ease-in-out min-w-[10rem] max-w-[100%] w-[90%] md:w-[10rem] delay-50 bg-primary hover:-translate-y-1 hover:scale-110 hover:bg-secondary duration-300 disabled:bg-[gray] active:translate-y-0 active:bg-primary "
          onClick={!disableClick ? rotate : cancelRotation}
        >
          {!disableClick ? 'Simulate' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}

const Box = ({
  basicRotations,
  completeRotations,
  setBasicRotations,
  setCompleteRotations,
  rotateOnMouseMovement,
  setDisableClick,
  cancelRotation,
}: {
  basicRotations: rotationType | null;
  completeRotations: rotationType | null;
  rotateOnMouseMovement: boolean;
  setBasicRotations: Dispatch<SetStateAction<rotationType | null>>;
  setCompleteRotations: Dispatch<SetStateAction<rotationType | null>>;
  setDisableClick: Dispatch<SetStateAction<boolean>>;
  cancelRotation: () => void;
}) => {
  const myMesh: Ref<
    Three.Mesh<
      Three.BufferGeometry<Three.NormalBufferAttributes>,
      Three.Material | Three.Material[],
      Three.Object3DEventMap
    >
  > =
    useRef<
      Three.Mesh<
        Three.BufferGeometry<Three.NormalBufferAttributes>,
        Three.Material | Three.Material[],
        Three.Object3DEventMap
      >
    >(null);

  useFrame(({ mouse, viewport }) => {
    const meshX = myMesh?.current?.rotation?.x;
    const meshY = myMesh?.current?.rotation?.y;
    const meshZ = myMesh?.current?.rotation?.z;
    if (
      meshX !== undefined &&
      meshY !== undefined &&
      meshZ !== undefined &&
      myMesh?.current?.rotation
    ) {
      if (rotateOnMouseMovement) {
        const x = (mouse.x * viewport.width) / 2.5;
        const y = (mouse.y * viewport.height) / 2.5;
        myMesh?.current?.lookAt(x, y, 1);
      } else if (basicRotations && completeRotations) {
        if (meshX < completeRotations.x) {
          myMesh.current.rotation.x = meshX + 0.04;
        }
        if (meshY < completeRotations.y) {
          myMesh.current.rotation.y = meshY + 0.04;
        }
        if (meshZ < completeRotations.z) {
          myMesh.current.rotation.z = meshZ + 0.04;
        }
        if (
          meshX > completeRotations.x &&
          meshY > completeRotations.y &&
          meshZ > completeRotations.z
        ) {
          cancelRotation();

          console.log(
            `Difference X: ${completeRotations.x} - ${myMesh.current.rotation.x}`
          );
          console.log(
            `Difference Y: ${completeRotations.y} - ${myMesh.current.rotation.y}`
          );
          console.log(
            `Difference Z: ${completeRotations.z} - ${myMesh.current.rotation.z}`
          );

          myMesh.current.rotation.x = basicRotations.x;
          myMesh.current.rotation.y = basicRotations.y;
          myMesh.current.rotation.z = basicRotations.z;
        }
      }
    }
  });

  const one = useLoader(Three.TextureLoader, '/Side-One.png');
  const two = useLoader(Three.TextureLoader, '/Side-Two.png');
  const three = useLoader(Three.TextureLoader, '/Side-Three.png');
  const four = useLoader(Three.TextureLoader, '/Side-Four.png');
  const five = useLoader(Three.TextureLoader, '/Side-Five.png');
  const six = useLoader(Three.TextureLoader, '/Side-Six.png');

  return (
    <mesh
      ref={myMesh}
      rotation={[Math.PI * (1 / 2) * 2, 0.9, Math.PI * (1 / 2) * 0]}
      position={[0, 0.6, 0.1]}
    >
      <boxGeometry />
      {/* <meshStandardMaterial /> */}
      <meshBasicMaterial map={one} attach="material-0" />
      <meshBasicMaterial map={two} attach="material-1" />
      <meshBasicMaterial map={three} attach="material-2" />
      <meshBasicMaterial map={four} attach="material-3" />
      <meshBasicMaterial map={five} attach="material-4" />
      <meshBasicMaterial map={six} attach="material-5" />
    </mesh>
  );
};
