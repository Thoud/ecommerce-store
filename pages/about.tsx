import Head from 'next/head';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Head>
        <title>About | Chocolate Heaven</title>
      </Head>

      <div className="flex flex-wrap justify-center">
        <h1 className="text-4xl mx-10 mt-10 h-5 w-full">About</h1>

        <div className="flex items-center mt-20">
          <Image src="/chef.jpg" alt="chef" width={500} height={332} />

          <div className="ml-40">
            <h2 className="text-3xl my-10">
              Everyday 100% compassion for your delight!
            </h2>
            <p className="max-w-xl">
              Being a chocolatier and confectioner with more than 50 years of
              experience in handcrafting fine pralines and chocolate, we give
              our absolute best to be purveyor and innovator in this special
              expertise. Perfection is our daily mission and this ranges from
              selecting raw materials, process those in state-of-the-art
              manufacturing, package our high-quality products adequately and
              deliver them safe and promptly. We are continuously writing
              history with our exclusive signature recipes, our exceptional
              innovations and our daily compassion.
            </p>
          </div>
        </div>

        <div className="flex items-center mt-40">
          <div className="mr-40">
            <h2 className="text-3xl my-10">Innovation</h2>
            <p className="max-w-xl">
              With us, craftsmanship and technical lead go hand in hand. With a
              love of craftsmanship, in addition to the annual range, seasonal
              collections are produced, new combinations and varieties are tried
              out and current trends are picked up. Chocolate creations from
              Chocolate Heaven are not only a sensual pleasure experience, but
              rather a gift, something special with high quality that gives
              beautiful moments.
            </p>
          </div>
          <Image src="/innovation.jpg" alt="" width={500} height={400} />
        </div>

        <div className="flex items-center mt-40">
          <Image src="/creativity.jpg" alt="" width={500} height={624} />
          <div className="ml-40">
            <h2 className="text-3xl my-10">Creativity</h2>
            <p className="max-w-xl">
              Creativity plays a major role in the manufacture of our products.
              Several times a year we create our own product collections on
              various topics that pick up on current nutritional and design
              trends and reinterpret them in a sweet way.
            </p>
          </div>
        </div>

        <div className="flex items-center mt-40">
          <div className="mr-40">
            <h2 className="text-3xl my-10">Love of craft</h2>
            <p className="max-w-xl">
              The love for handicraft has remained despite growth. Our specially
              developed, traditional recipes have become classics in the range
              and form the basis for new products. The production of the
              chocolate works requires a lot of time, skill and accuracy - a
              praline requires an average of 5 work steps. We have revived the
              craft of candy and confectionery manufacturer in Austria, because
              this traditional and rare profession should not be lost.
            </p>
          </div>
          <Image src="/craft.png" alt="chef" width={500} height={332} />
        </div>

        <div className="flex items-center my-40">
          <Image src="/quality.jpg" alt="chef" width={500} height={624} />
          <div className="ml-40">
            <h2 className="text-3xl my-10">Highest raw material quality</h2>
            <p className="max-w-xl">
              The quality of our products is our top priority. We use selected
              Fairtrade-certified cocoa varieties for our fine creations.
              Fairtrade has set itself the goal of improving the living
              conditions of small farmers in developing and emerging countries.
              The Fairtrade premium enables investments in social projects and
              quality-enhancing measures and promotes sustainable cocoa
              cultivation. Our raw chocolates are available in organic quality,
              so we can offer a wide range of organic products. To produce
              Chocolate Heaven products, only raw materials from organic
              agriculture are used and continuously monitored. We obtain the
              organic whipped cream as well as herbs and fine brandies directly
              from the region.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
