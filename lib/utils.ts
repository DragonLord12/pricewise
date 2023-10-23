import { PriceHistoryItem, Product } from "@/types";

const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if(priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice; 

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      } 

      return firstPrice || cleanPrice;
    }
  }

  return '';
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}

// Extracts description from two possible elements from amazon
export function extractDescription($: any) {
  // these are possible elements holding description of the product
  const selectors = [
    ".a-unordered-list .a-list-item",
    ".a-expander-content p",
    // Add more selectors here if needed
  ];

  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const textContent = elements
        .map((_: any, element: any) => $(element).text().trim())
        .get()
        .join("\n");
      return textContent;
    }
  }

  // If no matching elements were found, return an empty string
  return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;

  return averagePrice;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET as keyof typeof Notification;
  }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export  function getCategoryFromTitle(title: string) {
  const categories = {
    "electronics": ["laptops", "phones", "tablets", "headphones", "speakers", "cameras", "tv", "video", "video game", "consoles", "accessories", "iphone", "macbook", "ipad", "ipod", "imac", "apple watch", "apple tv", "apple pencil", "apple airpods", "apple airpod", "apple earpods", "apple earpod", "apple magic mouse", "apple magic keyboard", "apple magic trackpad", "apple magic", "apple mouse", "apple keyboard", "apple trackpad", "apple charger", "apple cable", "apple adapter", "apple dongle", "apple case", "apple cover", "apple sleeve", "apple bag", "apple backpack", "apple wallet", "apple purse", "apple handbag", "apple pouch", "apple holder", "apple stand", "apple dock", "apple mount", "apple accessory", "apple device", "apple supply", "apple equipment", "apple utensil", "apple tool", "apple gadget", "apple gear", "apple merchandise", "apple goods", "apple material", "apple object", "apple article", "apple component", "apple element", "apple item", "apple product", "apple stuff", "apple thing", "apple device", "apple supply", "apple accessory", "apple equipment", "apple utensil", "apple tool", "apple gadget", "apple gear", "apple merchandise", "apple goods", "apple material", "apple object", "apple article", "apple component", "apple element"],
    "clothing": ["shirt", "pants", "jeans", "shorts", "jacket", "coat", "sweater", "dress", "skirt"],
    "shoes": ["shoes", "sneakers", "boots", "sandals", "slippers"],
    "jewelry": ["necklace", "earrings", "bracelet", "ring", "watch"],
    "sports": ["basketball", "football", "soccer", "tennis", "golf", "baseball", "hockey", "volleyball", "rugby", "cricket", "badminton", "bowling", "boxing", "cycling", "fishing", "hiking", "hunting", "skiing", "swimming", "yoga", "surfing", "skateboarding", "skating", "running", "weightlifting", "gymnastics", "gym", "exercise", "fitness", "workout", "training", "sport"],
    "outdoors": ["camping", "hiking", "hunting", "fishing", "surfing", "skiing", "snowboarding", "skateboarding", "skating", "running", "swimming", "yoga", "exercise", "fitness", "workout",],
    "home": ["furniture", "bed", "chair", "table", "desk", "couch", "sofa", "lamp", "light", "rug", "carpet", "curtain", "blinds", "mattress", "pillow", "blanket", "bedding", "towel", "bathroom", "kitchen", "tools"],
    "kitchen": ["kitchen", "cookware", "dinnerware", "glassware", "flatware", "silverware", "cutlery", "bakeware", "kitchenware", "kitchen appliance", "kitchen utensil", "kitchen tool", "kitchen gadget", "kitchen equipment", "kitchen accessory", "kitchen supply", "kitchenware", "kitchen item", "kitchen product", "kitchen stuff", "kitchen thing", "kitchen device", "kitchenware", "kitchenware item", "kitchenware product", "kitchenware stuff", "kitchenware thing", "kitchenware device", "kitchenware supply", "kitchenware accessory", "kitchenware equipment", "kitchenware utensil", "kitchenware appliance", "kitchenware tool", "kitchenware gadget", "kitchenware gear", "kitchenware merchandise", "kitchenware goods", "kitchenware material", "kitchenware object", 
    "kitchenware article", "kitchenware component", "kitchenware element", "kitchenware item", "kitchenware product", "kitchenware stuff", "kitchenware thing", "kitchenware device", "kitchenware supply", "kitchenware accessory", "kitchenware equipment", "kitchenware utensil", "kitchenware appliance", "kitchenware tool", "kitchenware gadget", "kitchenware gear", "kitchenware merchandise", "kitchenware goods", "kitchenware material", "kitchenware object", "kitchenware article", "kitchenware component", "kitchenware element"],
    "food": ["apple", "banana", "orange", "grape", "strawberry", "blueberry", "raspberry", "blackberry", "watermelon", "melon", "pineapple", "mango", "peach", "pear", "plum", "cherry", "apricot", "avocado", "coconut", "fig", "kiwi", "lemon", "lime", "olive", "papaya", "pomegranate", "tomato", "potato", "carrot", "onion", "garlic", "ginger", "pepper", "cucumber", "lettuce", "cabbage", "broccoli", "cauliflower", "corn", "eggplant", "mushroom", "pea", "bean", "asparagus", "celery", "radish", "spinach", "squash", "zucchini", "yam", "beet", "turnip", "parsnip", "rutabaga", "artichoke", "brussels sprout", "kale", "okra", "pumpkin", "sweet potato", "chili pepper", "jalapeno", "habanero", "bell pepper", "chocolate", "candy", "gum", "snack", "cookie", "cracker", "chips", "pretzel", "popcorn", "cereal", "granola", "oatmeal", "rice", "pasta", "bread", "flour", "sugar", "salt", "pepper", "spice", "herb", "oil", "vinegar", "sauce", "condiment", "dressing", "mayonnaise", "mustard", "ketchup", "jam", "jelly", "honey", "syrup", "butter", "milk", "cheese", "yogurt", "egg", "meat", "chicken", "beef", "pork", "bacon", "ham", "sausage", "fish", "seafood", "shrimp", "lobster", "crab", "oyster", "clam", "mussel", "scallop", "squid", "octopus", "dairy", "produce", "vegetable", "fruit", "grain", "bread", "bakery", "beverage", "drink", "water", "juice", "soda", "tea", "coffee", "alcohol", "beer", "wine", "liquor", "household", "cleaning", "paper", "plastic", "foil", "trash", "bag", "storage", "container", "bathroom", "toilet", "tissue", "facial", "towel", "napkin", "soap", "shampoo", "conditioner", "lotion", "deodorant", "razor", "shaving", "cream", "toothbrush", "toothpaste", "feminine", "hygiene", "diaper", "baby", "pet", "cat", "dog", "bird", "fish", "reptile", "rodent", "insect", "spider", "ant", "bee", "wasp", "mosquito", "fly", "cockroach", "bedbug", "ladybug", "beetle", "butterfly", "moth", "caterpillar", "worm", "snail", "slug", "crustacean", "crab", "lobster", "shrimp", "mollusk", "clam", "oyster", "mussel", "scallop", "squid", "octopus", "shellfish", "food"],
    "health": ["vitamin", "supplement", "medicine", "drug", "pill", "tablet", "capsule", "liquid", "ointment", "cream", "lotion", "spray", "inhaler", "patch", "bandage", "gauze", "tape", "cotton", "swab", "cotton swab", "cotton ball", "cotton pad", "cotton round", "cotton bud", "cotton tip", "cotton applicator", "cotton stick", "cotton wool", "cotton cloth", "cotton fabric", "cotton material", "cotton product", "cotton thing", "cotton device", "cotton supply", "cotton accessory", "cotton equipment", "cotton utensil", "cotton tool", "cotton gadget", "cotton gear", "cotton merchandise", "cotton goods", "cotton material", "cotton object", "cotton article", "cotton component", "cotton element", "cotton item", "cotton product", "cotton stuff", "cotton thing", "cotton device", "cotton supply", "cotton accessory", "cotton equipment", "cotton utensil", "cotton tool", "cotton gadget", "cotton gear", "cotton merchandise", "cotton goods", "cotton material", "cotton object", "cotton article", "cotton component", "cotton element"],
    "beauty": ["makeup", "cosmetics", "skincare", "haircare", "hair", "nail", "beauty", "perfume", "fragrance", "cologne", "deodorant", "shampoo", "conditioner", "lotion", "moisturizer", "cleanser", "toner", "serum", "mask", "scrub", "exfoliator", "peel", "oil", "balm", "gel", "cream", "spray", "mousse", "wax", "paste", "hair spray", "hair gel", "hair wax", "hair paste", "hair mousse", "hair oil", "hair balm", "hair cream", "hair serum", "hair mask", "hair scrub", "hair exfoliator", "hair peel", "hair toner", "hair cleanser", "hair moisturizer", "hair lotion", "hair conditioner", "hair shampoo", "hair deodorant", "hair cologne", "hair fragrance", "hair perfume", "hair beauty", "hair nail", "hair skincare", "hair haircare", "hair makeup", "hair cosmetics", "hair product", "hair stuff", "hair thing", "hair device", "hair supply", "hair accessory", "hair equipment", "hair utensil", "hair tool", "hair gadget", "hair gear", "hair merchandise", "hair goods", "hair material", "hair object", "hair article", "hair component", "hair element", "hair item", "hair product", "hair stuff", "hair thing", "hair device", "hair supply", "hair accessory", "hair equipment", "hair utensil", "hair tool", "hair gadget", "hair gear", "hair merchandise", "hair goods", "hair material", "hair object", "hair article", "hair component", "hair element"],
    "toys": ["toy", "game", "puzzle", "board game", "card game", "doll", "action figure", "stuffed animal", "plush", "plushie", "plushy", "plush toy", "plush animal", "plush creature", "plush thing", "plush device", "plush supply", "plush accessory", "plush equipment", "plush utensil", "plush tool", "plush gadget", "plush gear", "plush merchandise", "plush goods", "plush material", "plush object", "plush article", "plush component", "plush element", "plush item", "plush product", "plush stuff", "plush thing", "plush device", "plush supply", "plush accessory", "plush equipment", "plush utensil", "plush tool", "plush gadget", "plush gear", "plush merchandise", "plush goods", "plush material", "plush object", "plush article", "plush component", "plush element"],
    "baby": ["baby", "infant", "toddler", "child", "kid", "newborn", "baby product", "baby stuff", "baby thing", "baby device", "baby supply", "baby accessory", "baby equipment", "baby utensil", "baby tool", "baby gadget", "baby gear", "baby merchandise", "baby goods", "baby material", "baby object", "baby article", "baby component", "baby element", "baby item", "baby product", "baby stuff", "baby thing", "baby device", "baby supply", "baby accessory", "baby equipment", "baby utensil", "baby tool", "baby gadget", "baby gear", "baby merchandise", "baby goods", "baby material", "baby object", "baby article", "baby component", "baby element"],
    "music": ["music", "album", "song", "track", "record", "vinyl", "cd", "cassette", "tape", "music product", "music stuff", "music thing", "music device", "music supply", "music accessory", "music equipment", "music utensil", "music tool", "music gadget", "music gear", "music merchandise", "music goods", "music material", "music object", "music article", "music component", "music element", "music item", "music product", "music stuff", "music thing", "music device", "music supply", "music accessory", "music equipment", "music utensil", "music tool", "music gadget", "music gear", "music merchandise", "music goods", "music material", "music object", "music article", "music component", "music element"],
    "movies": ["movie", "film", "show", "tv", "television", "series", "episode", "movie product", "movie stuff", "movie thing", "movie device", "movie supply", "movie accessory", "movie equipment", "movie utensil", "movie tool", "movie gadget", "movie gear", "movie merchandise", "movie goods", "movie material", "movie object", "movie article", "movie component", "movie element", "movie item", "movie product", "movie stuff", "movie thing", "movie device", "movie supply", "movie accessory", "movie equipment", "movie utensil", "movie tool", "movie gadget", "movie gear", "movie merchandise", "movie goods", "movie material", "movie object", "movie article", "movie component", "movie element"],
    "books": ["book", "novel", "story", "fiction", "nonfiction", "poem", "poetry", "book product", "book stuff", "book thing", "book device", "book supply", "book accessory", "book equipment", "book utensil", "book tool", "book gadget", "book gear", "book merchandise", "book goods", "book material", "book object", "book article", "book component", "book element", "book item", "book product", "book stuff", "book thing", "book device", "book supply", "book accessory", "book equipment", "book utensil", "book tool", "book gadget", "book gear", "book merchandise", "book goods", "book material", "book object", "book article", "book component", "book element"],
    "automotive": ["car", "truck", "vehicle", "automobile", "motorcycle", "scooter", "bike", "bicycle", "automotive product", "automotive stuff", "automotive thing", "automotive device", "automotive supply", "automotive accessory", "automotive equipment", "automotive utensil", "automotive tool", "automotive gadget", "automotive gear", "automotive merchandise", "automotive goods", "automotive material", "automotive object", "automotive article", "automotive component", "automotive element", "automotive item", "automotive product", "automotive stuff", "automotive thing", "automotive device", "automotive supply", "automotive accessory", "automotive equipment", "automotive utensil", "automotive tool", "automotive gadget", "automotive gear", "automotive merchandise", "automotive goods", "automotive material", "automotive object", "automotive article", "automotive component", "automotive element"],
    "industrial": ["industrial product", "industrial stuff", "industrial thing", "industrial device", "industrial supply", "industrial accessory", "industrial equipment", "industrial utensil", "industrial tool", "industrial gadget", "industrial gear", "industrial merchandise", "industrial goods", "industrial material", "industrial object", "industrial article", "industrial component", "industrial element", "industrial item", "industrial product", "industrial stuff", "industrial thing", "industrial device", "industrial supply", "industrial accessory", "industrial equipment", "industrial utensil", "industrial tool", "industrial gadget", "industrial gear", "industrial merchandise", "industrial goods", "industrial material", "industrial object", "industrial article", "industrial component", "industrial element"],
    "handmade": ["handmade product", "handmade stuff", "handmade thing", "handmade device", "handmade supply", "handmade accessory", "handmade equipment", "handmade utensil", "handmade tool", "handmade gadget", "handmade gear", "handmade merchandise", "handmade goods", "handmade material", "handmade object", "handmade article", "handmade component", "handmade element", "handmade item", "handmade product", "handmade stuff", "handmade thing", "handmade device", "handmade supply", "handmade accessory", "handmade equipment", "handmade utensil", "handmade tool", "handmade gadget", "handmade gear", "handmade merchandise", "handmade goods", "handmade material", "handmade object", "handmade article", "handmade component", "handmade element"],
    "pet": ["pet", "dog", "cat", "bird", "fish", "reptile", "rodent", "insect", "spider", "ant", "bee", "wasp", "mosquito", "fly", "cockroach", "bedbug", "ladybug", "beetle", "butterfly", "moth", "caterpillar", "worm", "snail", "slug", "crustacean", "crab", "lobster", "shrimp", "mollusk", "clam", "oyster", "mussel", "scallop", "squid", "octopus", "shellfish", "pet product", "pet stuff", "pet thing", "pet device", "pet supply", "pet accessory", "pet equipment", "pet utensil", "pet tool", "pet gadget", "pet gear", "pet merchandise", "pet goods", "pet material", "pet object", "pet article", "pet component", "pet element", "pet item", "pet product", "pet stuff", "pet thing", "pet device", "pet supply", "pet accessory", "pet equipment", "pet utensil", "pet tool", "pet gadget", "pet gear", "pet merchandise", "pet goods", "pet material", "pet object", "pet article", "pet component", "pet element"],
    "software": ["software", "program", "application", "app", "software product", "software stuff", "software thing", "software device", "software supply", "software accessory", "software equipment", "software utensil", "software tool", "software gadget", "software gear", "software merchandise", "software goods", "software material", "software object", "software article", "software component", "software element", "software item", "software product", "software stuff", "software thing", "software device", "software supply", "software accessory", "software equipment", "software utensil", "software tool", "software gadget", "software gear", "software merchandise", "software goods", "software material", "software object", "software article", "software component", "software element"],
    "office": ["office", "paper", "pen", "pencil", "marker", "highlighter", "eraser", "ruler", "stapler", "staple", "staples", "tape", "glue", "scissors", "paper clip", "binder", "folder", "envelope", "notebook", "notepad", "journal", "diary", "calendar", "planner", "agenda", "organizer", "desk", "chair", "office product", "office stuff", "office thing", "office device", "office supply", "office accessory", "office equipment", "office utensil", "office tool", "office gadget", "office gear", "office merchandise", "office goods", "office material", "office object", "office article", "office component", "office element", "office item", "office product", "office stuff", "office thing", "office device", "office supply", "office accessory", "office equipment", "office utensil", "office tool", "office gadget", "office gear", "office merchandise", "office goods", "office material", "office object", "office article", "office component", "office element"],
    "art": ["painting", "drawing", "sketch", "sculpture", "photograph", "art product", "art stuff", "art thing", "art device", "art supply", "art accessory", "art equipment", "art utensil", "art tool", "art gadget", "art gear", "art merchandise", "art goods", "art material", "art object", "art article", "art component", "art element", "art item", "art product", "art stuff", "art thing", "art device", "art supply", "art accessory", "art equipment", "art utensil", "art tool", "art gadget", "art gear", "art merchandise", "art goods", "art material", "art object", "art article", "art component", "art element"],
    "crafts": ["craft", "crafts", "crafting", "craft product", "craft stuff", "craft thing", "craft device", "craft supply", "craft accessory", "craft equipment", "craft utensil", "craft tool", "craft gadget", "craft gear", "craft merchandise", "craft goods", "craft material", "craft object", "craft article", "craft component", "craft element", "craft item", "craft product", "craft stuff", "craft thing", "craft device", "craft supply", "craft accessory", "craft equipment", "craft utensil", "craft tool", "craft gadget", "craft gear", "craft merchandise", "craft goods", "craft material", "craft object", "craft article", "craft component", "craft element"],
    "collectibles": ["collectible", "collectibles", "collecting", "collection", "collector", "collectible product", "collectible stuff", "collectible thing", "collectible device", "collectible supply", "collectible accessory", "collectible equipment", "collectible utensil", "collectible tool", "collectible gadget", "collectible gear", "collectible merchandise", "collectible goods", "collectible material", "collectible object", "collectible article", "collectible component", "collectible element", "collectible item", "collectible product", "collectible stuff", "collectible thing", "collectible device", "collectible supply", "collectible accessory", "collectible equipment", "collectible utensil", "collectible tool", "collectible gadget", "collectible gear", "collectible merchandise", "collectible goods", "collectible material", "collectible object", "collectible article", "collectible component", "collectible element"],
  };

  const titleWords = title.toLowerCase().split(" ");

  for (const category in categories) {
    for (const word of titleWords) {
      // @ts-ignore
      if (categories[category].includes(word)) {
        return category;
      }
    }
  }

  return "other";
}

export function extractReviewCount(...elements: any) {
  for (const element of elements) {
    const reviewText = element.text().trim();

    if(reviewText) {
      let cleanReview = reviewText.replace(/[.;,]/g, "");
      
      const firstReview = cleanReview.match(/\d+/)?.[0];
      
      return firstReview || cleanReview;
    }
  }

  return '';
}

export function extractStars(...elements: any) {
  for (const element of elements) {
    const starText = element.text().trim();

    if(starText) {
      const cleanStar = starText.replace(/[^\d.]/g, '');
      
      let firstStar;
      if (cleanStar) {
        firstStar = cleanStar.match(/\d+\.\d{1}/)?.[0];
      }

      return firstStar || cleanStar;
    }
  }

  return '';
}