import Image from 'next/image';
import Link from 'next/link';
import { addItemOverlayActions } from '../store/addItemOverlaySlice';
import { useAppDispatch } from '../util/hooks';

export default function AddItemOverlay() {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed bottom-0 right-0 bg-gray-200 bg-opacity-90 shadow-2xl rounded-lg flex flex-wrap justify-end h-52 mr-10 mb-20 z-50">
      <button
        className="h-0 pr-4 pt-4"
        onClick={() => dispatch(addItemOverlayActions.toggle(false))}
      >
        <Image src="/close.svg" alt="close button" width={40} height={40} />
      </button>

      <div className="center-items mb-12 w-full">
        <h3 className="text-center mb-2 w-full">
          The product has been added to the cart
        </h3>

        <Link href="/cart">
          <button
            className="btn-link-style py-2"
            onClick={() => dispatch(addItemOverlayActions.toggle(false))}
          >
            Go to cart
          </button>
        </Link>
      </div>
    </div>
  );
}
