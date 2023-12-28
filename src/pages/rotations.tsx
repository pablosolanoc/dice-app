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

export default function Rotations() {
  const [basicRotations, setBasicRotations] = useState<rotationType | null>(
    null
  );
  const [rotateOnMouseMovement, setRotateOnMouseMovement] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [completeRotations, setCompleteRotations] =
    useState<rotationType | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setShowDice(true);
    }, 1000);
  }, []);

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
      cancelRotation();
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
      className="w-full h-[100vh] flex justify-center items-center transition ease-in-out delay-20 bg-background active:bg-secondary"
    >
      <Canvas
        onPointerDown={() => setRotateOnMouseMovement(true)}
        onPointerUp={() => setRotateOnMouseMovement(false)}
        className={showDice ? 'visible' : 'invisible'}
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

      <div
        role="status"
        className={`absolute top-[40%] w-[10%] ${
          showDice ? 'invisible' : 'visible'
        }`}
      >
        <svg
          aria-hidden="true"
          className="w-full text-gray-200 animate-spin dark:text-gray-600 fill-secondary"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>

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
        if (meshX <= completeRotations.x) {
          myMesh.current.rotation.x = meshX + 0.04;
        }
        if (meshY <= completeRotations.y) {
          myMesh.current.rotation.y = meshY + 0.04;
        }
        if (meshZ <= completeRotations.z) {
          myMesh.current.rotation.z = meshZ + 0.04;
        }
        if (
          meshX > completeRotations.x &&
          meshY > completeRotations.y &&
          meshZ > completeRotations.z
        ) {
          cancelRotation();

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
