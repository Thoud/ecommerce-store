import Link from 'next/link';
import { addItemOverlayActions } from '../store/addItemOverlaySlice';
import { useAppDispatch } from '../util/hooks';

export default function AddItemOverlay() {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed bg-gray-300 bg-opacity-70 top-0 right-0 bottom-0 left-0 z-20 flex justify-center items-center">
      <div className="bg-white flex flex-wrap justify-center items-center rounded-lg h-60 p-10">
        <h3 className="text-2xl w-full text-center">
          The product has been added to the cart
        </h3>

        <Link href="/cart">
          <button
            className="bg-tertiary rounded-lg font-medium px-4 py-1"
            onClick={() => dispatch(addItemOverlayActions.toggle())}
          >
            Go to cart
          </button>
        </Link>

        <button
          className="bg-tertiary rounded-lg font-medium px-4 py-1 ml-16"
          onClick={() => dispatch(addItemOverlayActions.toggle())}
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
}
