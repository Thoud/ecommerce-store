import Image from 'next/image';
import Link from 'next/link';

type Props = {
  id?: number;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  name?: string;
  description?: string;
  ingredients?: string;
  allergens?: string;
  price?: string;
};

export default function ProductInfo(props: Props) {
  return (
    <>
      {props.id && props.src && props.alt && props.width && props.height && (
        <Link href={`/products/${props.id}`}>
          <a>
            <Image
              src={props.src}
              alt={props.alt}
              width={props.width}
              height={props.height}
            />
          </a>
        </Link>
      )}

      {props.name && (
        <p className="font-semibold text-center mb-10">{props.name}</p>
      )}
      {props.description && (
        <>
          <p className="font-semibold">Description</p>
          <p className="mb-10">{props.description}</p>
        </>
      )}
      {props.ingredients && (
        <>
          <p className="font-semibold">Ingredients</p>
          <p className="mb-10">{props.ingredients}</p>
        </>
      )}
      {props.allergens && (
        <>
          <p className="font-semibold">Allergens</p>
          <p className="mb-10">{props.allergens}</p>
        </>
      )}
      {props.price && (
        <>
          <p className="font-semibold">Price</p>{' '}
          <p className="mb-10 font-medium">{props.price} €</p>
        </>
      )}
    </>
  );
}
