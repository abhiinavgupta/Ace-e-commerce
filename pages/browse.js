import styles from "../styles/browse.module.scss";
import db from "../utils/db";
import Product from "../models/Product";
import Category from "../models/Category";
import Header from "../components/header";
import SubCategory from "../models/SubCategory";
import {
  filterArray,
  randomize,
  removeDuplicates,
} from "../utils/arrays_utils";
import Link from "next/link";
import ProductCard from "../components/productCard";
import CategoryFilter from "../components/browse/categoryFilter";
import SizesFilter from "../components/browse/sizesFilter";
import ColorsFilter from "../components/browse/colorsFilter";
import BrandsFilter from "../components/browse/brandsFilter";
import StylesFilter from "../components/browse/stylesFilter";
import PatternsFilter from "../components/browse/patternsFilter";
import MaterialsFilter from "../components/browse/materialsFilter";
import GenderFilter from "../components/browse/genderFilter";
import HeadingFilters from "../components/browse/headingFilters";
import { useRouter } from "next/router";
import { Pagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
const country = {
  name: "India",
  flag: "data:image/jpeg;base64,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",
};

export default function Browse({
  categories,
  subCategories,
  products,
  sizes,
  colors,
  brands,
  stylesData,
  patterns,
  materials,
  paginationCount,
  
}) {
  const router = useRouter();
  const filter = ({
    search,
    category,
    brand,
    style,
    size,
    color,
    pattern,
    material,
    gender,
    price,
    shipping,
    rating,
    sort,
    page,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (search) query.search = search;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (style) query.style = style;
    if (size) query.size = size;
    if (color) query.color = color;
    if (pattern) query.pattern = pattern;
    if (material) query.material = material;
    if (gender) query.gender = gender;
    if (price) query.price = price;
    if (shipping) query.shipping = shipping;
    if (rating) query.rating = rating;
    if (sort) query.sort = sort;
    if (page) query.page = page;
    router.push({
      pathname: path,
      query: query,
    });
  };
  const searchHandler = (search) => {
    if (search == "") {
      filter({ search: {} });
    } else {
      filter({ search });
    }
  };
  const categoryHandler = (category) => {
    filter({ category });
  };
  const brandHandler = (brand) => {
    filter({ brand });
  };
  const styleHandler = (style) => {
    filter({ style });
  };
  const sizeHandler = (size) => {
    filter({ size });
  };
  const colorHandler = (color) => {
    filter({ color });
  };
  const patternHandler = (pattern) => {
    filter({ pattern });
  };
  const materialHandler = (material) => {
    filter({ material });
  };
  const genderHandler = (gender) => {
    if (gender == "Unisex") {
      filter({ gender: {} });
    } else {
      filter({ gender });
    }
  };
  const priceHandler = (price, type) => {
    let priceQuery = router.query.price?.split("_") || "";
    let min = priceQuery[0] || "";
    let max = priceQuery[1] || "";
    let newPrice = "";
    if (type == "min") {
      newPrice = `${price}_${max}`;
    } else {
      newPrice = `${min}_${price}`;
    }
    filter({ price: newPrice });
  };
  const multiPriceHandler = (min, max) => {
    filter({ price: `${min}_${max}` });
  };
  const shippingHandler = (shipping) => {
    filter({ shipping });
  };
  const ratingHandler = (rating) => {
    filter({ rating });
  };
  const sortHandler = (sort) => {
    if (sort == "") {
      filter({ sort: {} });
    } else {
      filter({ sort });
    }
  };
  const pageHandler = (e, page) => {
    filter({ page });
  };
  //----------
  function checkChecked(queryName, value) {
    if (router.query[queryName]?.search(value) !== -1) {
      return true;
    }
    return false;
  }
  function replaceQuery(queryName, value) {
    const existedQuery = router.query[queryName];
    const valueCheck = existedQuery?.search(value);
    const _check = existedQuery?.search(`_${value}`);
    let result = "";
    if (existedQuery) {
      if (existedQuery == value) {
        result = {};
      } else {
        if (valueCheck !== -1) {
          if (_check !== -1) {
            result = existedQuery?.replace(`_${value}`, "");
          } else if (valueCheck == 0) {
            result = existedQuery?.replace(`${value}_`, "");
          } else {
            result = existedQuery?.replace(value, "");
          }
        } else {
          result = `${existedQuery}_${value}`;
        }
      }
    } else {
      result = value;
    }
    return {
      result,
      active: existedQuery && valueCheck !== -1 ? true : false,
    };
  }
  //---------------------------------
  const [scrollY, setScrollY] = useState(0);
  const [height, setHeight] = useState(0);
  const headerRef = useRef(null);
  const el = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    setHeight(headerRef.current?.offsetHeight + el.current?.offsetHeight);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  console.log(scrollY, height);
  //---------------------------------
  return (
    <div className={styles.browse}>
      <div ref={headerRef}>
        <Header searchHandler={searchHandler} country={country} />
      </div>
      <div className={styles.browse__container}>
        <div ref={el}>
          <div className={styles.browse__path}>Home / Browse</div>
          <div className={styles.browse__tags}>
            {categories.map((c) => (
              <Link legacyBehavior href="" key={c._id}>
                <a>{c.name}</a>
              </Link>
            ))}
          </div>
        </div>
        <div
          className={`${styles.browse__store} ${
            scrollY >= height ? styles.fixed : ""
          }`}
        >
          <div
            className={`${styles.browse__store_filters} ${styles.scrollbar}`}
          >
            <button
              className={styles.browse__clearBtn}
              onClick={() => router.push("/browse")}
            >
              Clear All ({Object.keys(router.query).length})
            </button>
            <CategoryFilter
              categories={categories}
              subCategories={subCategories}
              categoryHandler={categoryHandler}
              replaceQuery={replaceQuery}
            />
            <SizesFilter sizes={sizes} sizeHandler={sizeHandler} />
            <ColorsFilter
              colors={colors}
              colorHandler={colorHandler}
              replaceQuery={replaceQuery}
            />
            <BrandsFilter
              brands={brands}
              brandHandler={brandHandler}
              replaceQuery={replaceQuery}
            />
            <StylesFilter
              data={stylesData}
              styleHandler={styleHandler}
              replaceQuery={replaceQuery}
            />
            <PatternsFilter
              patterns={patterns}
              patternHandler={patternHandler}
              replaceQuery={replaceQuery}
            />
            <MaterialsFilter
              materials={materials}
              materialHandler={materialHandler}
              replaceQuery={replaceQuery}
            />
            <GenderFilter
              genderHandler={genderHandler}
              replaceQuery={replaceQuery}
            />
          </div>
          <div className={styles.browse__store_products_wrap}>
            <HeadingFilters
              priceHandler={priceHandler}
              multiPriceHandler={multiPriceHandler}
              shippingHandler={shippingHandler}
              ratingHandler={ratingHandler}
              replaceQuery={replaceQuery}
              sortHandler={sortHandler}
            />
            <div className={styles.browse__store_products}>
              {products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
            <div className={styles.pagination}>
              <Pagination
                count={paginationCount}
                defaultPage={Number(router.query.page) || 1}
                onChange={pageHandler}
                variant="outlined"
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  //-------------------------------------------------->
  const searchQuery = query.search || "";
  const categoryQuery = query.category || "";
  const genderQuery = query.gender || "";
  const priceQuery = query.price?.split("_") || "";
  const shippingQuery = query.shipping || 0;
  const ratingQuery = query.rating || "";
  const sortQuery = query.sort || "";
  const pageSize = 50;
  const page = query.page || 1;

  //-----------
  const brandQuery = query.brand?.split("_") || "";
  const brandRegex = `^${brandQuery[0]}`;
  const brandSearchRegex = createRegex(brandQuery, brandRegex);
  //-----------
  //-----------
  const styleQuery = query.style?.split("_") || "";
  const styleRegex = `^${styleQuery[0]}`;
  const styleSearchRegex = createRegex(styleQuery, styleRegex);
  //-----------
  //-----------
  const patternQuery = query.pattern?.split("_") || "";
  const patternRegex = `^${patternQuery[0]}`;
  const patternSearchRegex = createRegex(patternQuery, patternRegex);
  //-----------
  //-----------
  const materialQuery = query.material?.split("_") || "";
  const materialRegex = `^${materialQuery[0]}`;
  const materialSearchRegex = createRegex(materialQuery, materialRegex);
  //-----------
  const sizeQuery = query.size?.split("_") || "";
  const sizeRegex = `^${sizeQuery[0]}`;
  const sizeSearchRegex = createRegex(sizeQuery, sizeRegex);
  //-----------
  const colorQuery = query.color?.split("_") || "";
  const colorRegex = `^${colorQuery[0]}`;
  const colorSearchRegex = createRegex(colorQuery, colorRegex);
  //-------------------------------------------------->
  const search =
    searchQuery && searchQuery !== ""
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const category =
    categoryQuery && categoryQuery !== "" ? { category: categoryQuery } : {};

  const style =
    styleQuery && styleQuery !== ""
      ? {
          "details.value": {
            $regex: styleSearchRegex,
            $options: "i",
          },
        }
      : {};
  const size =
    sizeQuery && sizeQuery !== ""
      ? {
          "subProducts.sizes.size": {
            $regex: sizeSearchRegex,
            $options: "i",
          },
        }
      : {};
  const color =
    colorQuery && colorQuery !== ""
      ? {
          "subProducts.color.color": {
            $regex: colorSearchRegex,
            $options: "i",
          },
        }
      : {};
  const brand =
    brandQuery && brandQuery !== ""
      ? {
          brand: {
            $regex: brandSearchRegex,
            $options: "i",
          },
        }
      : {};
  const pattern =
    patternQuery && patternQuery !== ""
      ? {
          "details.value": {
            $regex: patternSearchRegex,
            $options: "i",
          },
        }
      : {};
  const material =
    materialQuery && materialQuery !== ""
      ? {
          "details.value": {
            $regex: materialSearchRegex,
            $options: "i",
          },
        }
      : {};
  const gender =
    genderQuery && genderQuery !== ""
      ? {
          "details.value": {
            $regex: genderQuery,
            $options: "i",
          },
        }
      : {};
  const price =
    priceQuery && priceQuery !== ""
      ? {
          "subProducts.sizes.price": {
            $gte: Number(priceQuery[0]) || 0,
            $lte: Number(priceQuery[1]) || Infinity,
          },
        }
      : {};
  const shipping =
    shippingQuery && shippingQuery == "0"
      ? {
          shipping: 0,
        }
      : {};
  const rating =
    ratingQuery && ratingQuery !== ""
      ? {
          rating: {
            $gte: Number(ratingQuery),
          },
        }
      : {};
  const sort =
    sortQuery == ""
      ? {}
      : sortQuery == "popular"
      ? { rating: -1, "subProducts.sold": -1 }
      : sortQuery == "newest"
      ? { createdAt: -1 }
      : sortQuery == "topSelling"
      ? { "subProducts.sold": -1 }
      : sortQuery == "topReviewed"
      ? { rating: -1 }
      : sortQuery == "priceHighToLow"
      ? { "subProducts.sizes.price": -1 }
      : sortQuery == "priceLowToHigh"
      ? { "subProducts.sizes.price": 1 }
      : {};
  //-------------------------------------------------->
  //-------------------------------------------------->
  function createRegex(data, styleRegex) {
    if (data.length > 1) {
      for (var i = 1; i < data.length; i++) {
        styleRegex += `|^${data[i]}`;
      }
    }
    return styleRegex;
  }
  let data = await axios
    .get("https://api.ipregistry.co/?key=vbcu12byt5kgca9j")
    .then((res) => {
      return res.data.location.country;
    })
    .catch((err) => {
      console.log(err);
    });
  //-------------------------------------------------->
  db.connectDb();
  let productsDb = await Product.find({
    ...search,
    ...category,
    ...brand,
    ...style,
    ...size,
    ...color,
    ...pattern,
    ...material,
    ...gender,
    ...price,
    ...shipping,
    ...rating,
  })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort(sort)
    .lean();
  let products =
    sortQuery && sortQuery !== "" ? productsDb : randomize(productsDb);
  let categories = await Category.find().lean();
  let subCategories = await SubCategory.find()
    .populate({
      path: "parent",
      model: Category,
    })
    .lean();
  let colors = await Product.find({ ...category }).distinct(
    "subProducts.color.color"
  );
  let brandsDb = await Product.find({ ...category }).distinct("brand");
  let sizes = await Product.find({ ...category }).distinct(
    "subProducts.sizes.size"
  );
  let details = await Product.find({ ...category }).distinct("details");
  let stylesDb = filterArray(details, "Style");
  let patternsDb = filterArray(details, "Pattern Type");
  let materialsDb = filterArray(details, "Material");
  let styles = removeDuplicates(stylesDb);
  let patterns = removeDuplicates(patternsDb);
  let materials = removeDuplicates(materialsDb);
  let brands = removeDuplicates(brandsDb);
  let totalProducts = await Product.countDocuments({
    ...search,
    ...category,
    ...brand,
    ...style,
    ...size,
    ...color,
    ...pattern,
    ...material,
    ...gender,
    ...price,
    ...shipping,
    ...rating,
  });
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
      sizes,
      colors,
      brands,
      stylesData: styles,
      patterns,
      materials,
      paginationCount: Math.ceil(totalProducts / pageSize),
      country: {
        
          name: "India",
          flag: "data:image/jpeg;base64,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",
        },
    },
  };
}
