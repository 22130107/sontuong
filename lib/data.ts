import { Product, Project, Service, NewsArticle } from "./types";

// Base image URL from the original design
const IMG_BASE =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

export const COMPANY_INFO = {
  name: "Sơn Mặt Trời Việt NaSun",
  fullName: "Công ty TNHH Kỹ Thuật Xây Lắp Và Thương Mại Mặt Trời Việt NaSun",
  address: "Địa chỉ công ty, TP Vũng Tàu",
  phone: "0xx xxx xxxx",
  phoneSupport: "0xx xxx xxxx",
  website: "example.com",
  email: "info@example.com",
  facebook: "https://facebook.com/",
  zalo: "https://zalo.me/",
  mapUrl: "https://maps.google.com/?q=Vung+Tau",
  lat: 10.3459,
  lng: 107.0843,
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "son-dulux",
    name: "Sơn Dulux",
    category: "Sơn nước",
    price: "Liên hệ",
    images: [
      `${IMG_BASE}d2bebc07683c9f6c3019ee50f589acb3a713a551.png?generation=1777545030716546&alt=media`,
      `${IMG_BASE}e7d250cd1f1e39d2ab8ef8d78d39c43789509bb9.jpg?generation=1777545030662315&alt=media`,
      `${IMG_BASE}37ac5fb801efb95cd460f6045dcd54df3a19203f.jpg?generation=1777545030665669&alt=media`,
      `${IMG_BASE}8db009924f1c1e1ec837548cfebd88247697e7cd.png?generation=1777545030647762&alt=media`,
    ],
    thumbnail: `${IMG_BASE}d2bebc07683c9f6c3019ee50f589acb3a713a551.png?generation=1777545030716546&alt=media`,
    description:
      "Sơn Dulux chính hãng, chất lượng cao, đa dạng màu sắc. Phù hợp cho nội thất và ngoại thất. Bền màu, chống thấm, dễ thi công.",
    specs: {
      "Xuất xứ": "Anh Quốc",
      "Loại sơn": "Sơn nước",
      "Ứng dụng": "Nội thất, Ngoại thất",
    },
    inStock: true,
  },
  {
    id: "2",
    slug: "son-jotun",
    name: "Sơn Jotun",
    category: "Sơn chống thấm",
    price: "Liên hệ",
    images: [
      `${IMG_BASE}6ab4c27d4d3fa99da9e7042daf15964b5bcd205f.jpg?generation=1777545030655960&alt=media`,
      `${IMG_BASE}f1f2b14887a0c2b9e3497e86d6eadb61a2fb03fa.jpg?generation=1777545030868159&alt=media`,
      `${IMG_BASE}a45b046fd329713eda212f9f33d023d6f6a40684.jpg?generation=1777545030958176&alt=media`,
      `${IMG_BASE}cdf137a7c47e4649403849de24de6c3c831093be.jpg?generation=1777545030951387&alt=media`,
      `${IMG_BASE}3b767942c708c4a465caaeae49110d16654915e7.jpg?generation=1777545030936297&alt=media`,
      `${IMG_BASE}22985de630bd98b4f707cc090bc19f03dba510d0.jpg?generation=1777545030941503&alt=media`,
    ],
    thumbnail: `${IMG_BASE}6ab4c27d4d3fa99da9e7042daf15964b5bcd205f.jpg?generation=1777545030655960&alt=media`,
    description:
      "Sơn Jotun chống thấm cao cấp, bảo vệ công trình khỏi thời tiết khắc nghiệt. Sản phẩm nhập khẩu chính hãng từ Na Uy.",
    specs: {
      "Xuất xứ": "Na Uy",
      "Loại sơn": "Sơn chống thấm",
      "Ứng dụng": "Ngoại thất, Mái nhà",
    },
    inStock: true,
  },
  {
    id: "3",
    slug: "son-kova",
    name: "Sơn Kova",
    category: "Sơn nước",
    price: "Liên hệ",
    images: [
      `${IMG_BASE}661a15c10c9ed86b73edf7eb17d4642990cc86f4.png?generation=1777545199454855&alt=media`,
      `${IMG_BASE}774ea9010fbe9ca2f453fb3286420a020e258fbe.png?generation=1777545199479168&alt=media`,
    ],
    thumbnail: `${IMG_BASE}661a15c10c9ed86b73edf7eb17d4642990cc86f4.png?generation=1777545199454855&alt=media`,
    description:
      "Sơn Kova thương hiệu Việt, chất lượng quốc tế. Sơn chống thấm, sơn nội thất, ngoại thất đa dạng dòng sản phẩm.",
    specs: {
      "Xuất xứ": "Việt Nam",
      "Loại sơn": "Sơn nước, Sơn chống thấm",
      "Ứng dụng": "Nội thất, Ngoại thất",
    },
    inStock: true,
  },
  {
    id: "4",
    slug: "son-nippon",
    name: "Sơn Nippon",
    category: "Sơn nước cao cấp",
    price: "Liên hệ",
    images: [
      `${IMG_BASE}5fef1a46ece711b9c8fe34c127c7f1240a727283.jpg?generation=1777545199456994&alt=media`,
      `${IMG_BASE}439848eaac656467136c16a44ae91aa17dec0682.jpg?generation=1777545199464215&alt=media`,
    ],
    thumbnail: `${IMG_BASE}5fef1a46ece711b9c8fe34c127c7f1240a727283.jpg?generation=1777545199456994&alt=media`,
    description:
      "Sơn Nippon chất lượng Nhật Bản, bền màu vượt trội, kháng nấm mốc hiệu quả. Lý tưởng cho khí hậu nhiệt đới.",
    specs: {
      "Xuất xứ": "Nhật Bản",
      "Loại sơn": "Sơn nước cao cấp",
      "Ứng dụng": "Nội thất, Ngoại thất",
    },
    inStock: true,
  },
  {
    id: "5",
    slug: "son-esse",
    name: "Sơn Esse",
    category: "Sơn nước",
    price: "Liên hệ",
    images: [
      `${IMG_BASE}f674c53654e226fd620e2a988869c1376c3f1066.jpg?generation=1777545031253598&alt=media`,
      `${IMG_BASE}85cd9bb1aecc99871b6716bc66abe0165df2eabd.jpg?generation=1777545199453240&alt=media`,
      `${IMG_BASE}f334133616ff93bf6d1e74cd2565285406b54950.jpg?generation=1777545199522701&alt=media`,
      `${IMG_BASE}ef5d0c3bc8c1385fd52dddf4c761d82c66da03bc.jpg?generation=1777545199479358&alt=media`,
      `${IMG_BASE}67c226ec29428478e89d138cdcfe5cbb440aa605.jpg?generation=1777545199487663&alt=media`,
    ],
    thumbnail: `${IMG_BASE}f674c53654e226fd620e2a988869c1376c3f1066.jpg?generation=1777545031253598&alt=media`,
    description:
      "Sơn Esse giá tốt, chất lượng ổn định, phù hợp cho các công trình dân dụng. Đa dạng màu sắc theo yêu cầu.",
    specs: {
      "Xuất xứ": "Việt Nam",
      "Loại sơn": "Sơn nước",
      "Ứng dụng": "Nội thất",
    },
    inStock: true,
  },
];

export const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "chuyen-nhan-sua-chua-nha-tai-ba-ria-vung-tau",
    title: "Chuyên Nhận Sửa Chữa Nhà Tại Bà Rịa Vũng Tàu",
    category: "chung-cu",
    image: `${IMG_BASE}501b139efa8dfd5cec279d32118c4cace0c5909c.jpg?generation=1777545030327700&alt=media`,
    description:
      "Dự án sửa chữa và sơn lại toàn bộ chung cư tại Bà Rịa Vũng Tàu, hoàn thiện đúng tiến độ.",
  },
  {
    id: "2",
    slug: "don-vi-thi-cong-son-nuoc-chuyen-nghiep-tai-vung-tau",
    title: "Đơn Vị Thi Công Sơn Nước Chuyên Nghiệp Tại Vũng Tàu",
    category: "biet-thu",
    image: `${IMG_BASE}dacece20e0cec9d4fbd116290a8c34f2ef603939.jpg?generation=1777545030357214&alt=media`,
    description: "Thi công sơn nước biệt thự cao cấp, hoàn thiện nội ngoại thất chuyên nghiệp.",
  },
  {
    id: "3",
    slug: "nhung-thong-tin-ve-son-nuoc-khong-nen-bo-qua",
    title: "Những Thông Tin Về Sơn Nước Không Nên Bỏ Qua",
    category: "nha-pho",
    image: `${IMG_BASE}4badd65dfb72967d486eae34f5d08ad389d3cce4.jpg?generation=1777545030593481&alt=media`,
    description: "Thi công sơn nhà phố, hoàn thiện nội ngoại thất chuyên nghiệp.",
  },
  {
    id: "4",
    slug: "thi-cong-tran-thach-cao",
    title: "Thi Công Trần Thạch Cao",
    category: "phong-bep",
    image: `${IMG_BASE}3bcd878b6a6b3f90400ea953044c837f37b77ea9.jpg?generation=1777545030670871&alt=media`,
    description: "Thi công trần thạch cao phòng bếp, thiết kế hiện đại, thẩm mỹ cao.",
  },
  {
    id: "5",
    slug: "cong-trinh-thi-cong-son-nuoc-uy-tin-nhat-tinh-ba-ria-vung-tau",
    title: "Công Trình Thi Công Sơn Nước Uy Tín Nhất Bà Rịa Vũng Tàu",
    category: "phong-ngu",
    image: `${IMG_BASE}85cd9bb1aecc99871b6716bc66abe0165df2eabd.jpg?generation=1777545199453240&alt=media`,
    description: "Sơn phòng ngủ với màu sắc nhẹ nhàng, tạo không gian nghỉ ngơi lý tưởng.",
  },
  {
    id: "6",
    slug: "son-phong-tre-em-dep",
    title: "Sơn Phòng Trẻ Em Đẹp, An Toàn",
    category: "phong-tre-em",
    image: `${IMG_BASE}f334133616ff93bf6d1e74cd2565285406b54950.jpg?generation=1777545199522701&alt=media`,
    description:
      "Sơn phòng trẻ em với màu sắc tươi sáng, sử dụng sơn an toàn không độc hại.",
  },
];

export const SERVICES: Service[] = [
  {
    id: "1",
    slug: "thi-cong-son-nuoc",
    title: "Thi Công Sơn Nước",
    description:
      "Chuyên thi công sơn nước nội thất và ngoại thất cho mọi loại công trình. Đội ngũ thợ lành nghề, kinh nghiệm nhiều năm.",
    image: `${IMG_BASE}dacece20e0cec9d4fbd116290a8c34f2ef603939.jpg?generation=1777545030357214&alt=media`,
    details:
      "Dịch vụ thi công sơn nước chuyên nghiệp tại Vũng Tàu. Chúng tôi nhận thi công sơn nhà mới, sơn sửa nhà cũ, sơn chung cư, biệt thự, văn phòng...",
  },
  {
    id: "2",
    slug: "son-nha-moi",
    title: "Sơn Nhà Mới",
    description:
      "Hoàn thiện sơn nhà mới xây, đảm bảo chất lượng bề mặt, màu sắc đồng đều và bền đẹp theo thời gian.",
    image: `${IMG_BASE}501b139efa8dfd5cec279d32118c4cace0c5909c.jpg?generation=1777545030327700&alt=media`,
    details:
      "Thi công sơn nhà mới với quy trình chuẩn: xử lý bề mặt, bả matit, sơn lót, sơn phủ 2 lớp. Bảo hành công trình.",
  },
  {
    id: "3",
    slug: "son-sua-nha-cu",
    title: "Sơn Sửa Nhà Cũ",
    description:
      "Làm mới nhà cũ với dịch vụ sơn sửa chuyên nghiệp. Xử lý tường nứt, ố vàng, rong rêu trước khi sơn.",
    image: `${IMG_BASE}4badd65dfb72967d486eae34f5d08ad389d3cce4.jpg?generation=1777545030593481&alt=media`,
    details:
      "Chuyên xử lý và sơn lại nhà cũ. Khắc phục các vấn đề: tường nứt, thấm dột, ố vàng, bong tróc sơn cũ.",
  },
  {
    id: "4",
    slug: "thi-cong-tran-thach-cao",
    title: "Thi Công Trần Thạch Cao",
    description:
      "Thiết kế và thi công trần thạch cao các loại: trần phẳng, trần giật cấp, trần thả. Đẹp, bền, cách âm tốt.",
    image: `${IMG_BASE}3bcd878b6a6b3f90400ea953044c837f37b77ea9.jpg?generation=1777545030670871&alt=media`,
    details:
      "Thi công trần thạch cao theo yêu cầu. Đa dạng mẫu mã, phù hợp mọi không gian từ nhà ở đến văn phòng, khách sạn.",
  },
  {
    id: "5",
    slug: "xu-ly-tuong-nut-tham-dot",
    title: "Xử Lý Tường Nứt, Thấm Dột",
    description:
      "Chuyên xử lý các sự cố tường nứt, thấm dột, ố vàng, đóng rong rêu. Giải pháp triệt để, bảo hành dài hạn.",
    image: `${IMG_BASE}85cd9bb1aecc99871b6716bc66abe0165df2eabd.jpg?generation=1777545199453240&alt=media`,
    details:
      "Sử dụng vật liệu chống thấm cao cấp để xử lý triệt để tình trạng thấm dột, nứt tường.",
  },
];

export const NEWS: NewsArticle[] = [
  {
    id: "1",
    slug: "chuyen-nhan-sua-chua-nha-tai-ba-ria-vung-tau",
    title: "Chuyên Nhận Sửa Chữa Nhà Tại Bà Rịa Vũng Tàu",
    excerpt:
      "Mặt Trời Việt NaSun chuyên nhận sửa chữa nhà tại Bà Rịa Vũng Tàu với đội ngũ thợ lành nghề, giá cả hợp lý.",
    content:
      "Với nhiều năm kinh nghiệm trong lĩnh vực thi công sơn nước và sửa chữa nhà tại Vũng Tàu, Mặt Trời Việt NaSun tự hào là đơn vị uy tín được nhiều khách hàng tin tưởng lựa chọn...",
    image: `${IMG_BASE}501b139efa8dfd5cec279d32118c4cace0c5909c.jpg?generation=1777545030327700&alt=media`,
    publishedAt: "2024-01-15",
    category: "Dịch vụ",
  },
  {
    id: "2",
    slug: "don-vi-thi-cong-son-nuoc-chuyen-nghiep-tai-vung-tau",
    title: "Đơn Vị Thi Công Sơn Nước Chuyên Nghiệp Tại Vũng Tàu",
    excerpt:
      "Tìm hiểu về quy trình thi công sơn nước chuyên nghiệp của Mặt Trời Việt NaSun tại Vũng Tàu.",
    content:
      "Quy trình thi công sơn nước chuyên nghiệp bao gồm nhiều bước quan trọng: chuẩn bị bề mặt, bả matit, sơn lót và sơn phủ...",
    image: `${IMG_BASE}dacece20e0cec9d4fbd116290a8c34f2ef603939.jpg?generation=1777545030357214&alt=media`,
    publishedAt: "2024-01-20",
    category: "Dịch vụ",
  },
  {
    id: "3",
    slug: "nhung-thong-tin-ve-son-nuoc-khong-nen-bo-qua",
    title: "Những Thông Tin Về Sơn Nước Không Nên Bỏ Qua",
    excerpt:
      "Tổng hợp những thông tin quan trọng về sơn nước mà bạn cần biết trước khi thi công.",
    content:
      "Sơn nước là vật liệu hoàn thiện không thể thiếu trong xây dựng. Để chọn đúng loại sơn và thi công đúng cách, bạn cần nắm rõ các thông tin sau...",
    image: `${IMG_BASE}4badd65dfb72967d486eae34f5d08ad389d3cce4.jpg?generation=1777545030593481&alt=media`,
    publishedAt: "2024-02-01",
    category: "Tin tức",
  },
  {
    id: "4",
    slug: "thi-cong-tran-thach-cao-dep",
    title: "THI CÔNG TRẦN THẠCH CAO",
    excerpt:
      "Hướng dẫn chi tiết về thi công trần thạch cao, các loại trần phổ biến và chi phí tham khảo.",
    content:
      "Trần thạch cao ngày càng được ưa chuộng trong thiết kế nội thất hiện đại. Bài viết này sẽ giúp bạn hiểu rõ hơn về các loại trần thạch cao và quy trình thi công...",
    image: `${IMG_BASE}3bcd878b6a6b3f90400ea953044c837f37b77ea9.jpg?generation=1777545030670871&alt=media`,
    publishedAt: "2024-02-10",
    category: "Tin tức",
  },
  {
    id: "5",
    slug: "cong-trinh-thi-cong-son-nuoc-uy-tin-nhat-tinh-ba-ria-vung-tau",
    title: "Công Trình Thi Công Sơn Nước Uy Tín Nhất Bà Rịa Vũng Tàu",
    excerpt:
      "Giới thiệu các công trình tiêu biểu đã được Mặt Trời Việt NaSun thi công thành công tại Bà Rịa Vũng Tàu.",
    content:
      "Mặt Trời Việt NaSun đã hoàn thành hàng trăm công trình lớn nhỏ tại Bà Rịa Vũng Tàu. Dưới đây là một số công trình tiêu biểu...",
    image: `${IMG_BASE}85cd9bb1aecc99871b6716bc66abe0165df2eabd.jpg?generation=1777545199453240&alt=media`,
    publishedAt: "2024-02-15",
    category: "Công trình",
  },
];

export const SLIDER_IMAGES = [
  {
    src: `${IMG_BASE}0081477e131ab91a47682e6ea17e8ef751cf4fba.jpg?generation=1777545030309979&alt=media`,
    alt: "Sơn nước Vũng Tàu - Mặt Trời Việt NaSun",
  },
  {
    src: `${IMG_BASE}bdd77ab9e1fa1e88cb19af1ceb7c9937bf9c97d7.jpg?generation=1777545030356216&alt=media`,
    alt: "Thi công sơn nước chuyên nghiệp tại Vũng Tàu",
  },
  {
    src: `${IMG_BASE}7441281fd879eb54ae054b4497fbfa6d4d851dc6.jpg?generation=1777545030359047&alt=media`,
    alt: "Sơn nước chính hãng tại Vũng Tàu",
  },
];

export const LOGO_URL = "/logo.png";
export const CART_ICON_URL = `${IMG_BASE}e63cfcd394677b12b9a121e469cbbd3f76974609.png?generation=1777545030333650&alt=media`;

// Thay đổi domain thực tế của bạn tại đây
export const SITE_URL = "https://example.com";
