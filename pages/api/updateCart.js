import nc from "next-connect";
import Product from "../../models/Product";
import db from "../../utils/db";
const handler = nc();

handler.post(async (req, res) => {
  try {
    db.connectDb();
    const promises = req.body.products.map(async (p) => {
        let dbProduct = await Product.findById(p._id).lean();
        let originalPrice = dbProduct.subProducts[p.style].sizes.find(
        (x) => x.size == p.size
        ).price;
        let quantity = dbProduct.subProducts[p.style].sizes.find(
        (x) => x.size == p.size 
        ).qty;
        let discount = dbProduct.subProducts[p.style].discount;
        return{
        ...p,
        priceBefore: originalPrice,
        price:
        discount>0
        ? originalPrice - originalPrice / discount
        : originalPrice,
        discount : discount,
        quantity : quantity,
        shippingFee :dbProduct.shipping,
    };
  });
  const data = await Promise.all(promises)
//   console.log(data);
    db.disconnectDb();
    return res.json(data);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default handler;