import Image from 'next/image';
import Link from 'next/link';

type Props = {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  name?: string;
  description?: string;
  ingredients?: string;
  allergens?: string;
  price?: string;
};

export default function ProductInfo(props: Props) {
  return (
    <>
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

      {props.name && <p>{props.name}</p>}
      {props.description && (
        <>
          <p>Description</p>
          <p>{props.description}</p>
        </>
      )}
      {props.ingredients && (
        <>
          <p>Ingredients</p>
          <p>{props.ingredients}</p>
        </>
      )}
      {props.allergens && (
        <>
          <p>Allergens</p>
          <p>{props.allergens}</p>
        </>
      )}
      {props.price && <p>{props.price} €</p>}
    </>
  );
}
