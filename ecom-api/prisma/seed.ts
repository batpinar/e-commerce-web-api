import { PrismaClient, Product } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/tr';

const prisma = new PrismaClient();

// Yardımcı fonksiyonlar
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const generatePasswordHash = () => {
  // Gerçek uygulamada bcrypt kullanılmalı
  return faker.internet.password({ length: 60 });
};

async function main() {
  // Kategorileri oluştur
  const categories = [
    { name: 'T-Shirt', slug: 't-shirt', order: 1 },
    { name: 'Gömlek', slug: 'gomlek', order: 2 },
    { name: 'Pantolon', slug: 'pantolon', order: 3 },
    { name: 'Kot', slug: 'kot', order: 4 },
    { name: 'Elbise', slug: 'elbise', order: 5 },
    { name: 'Etek', slug: 'etek', order: 6 },
    { name: 'Ceket', slug: 'ceket', order: 7 },
    { name: 'Mont', slug: 'mont', order: 8 },
    { name: 'Ayakkabı', slug: 'ayakkabi', order: 9 },
    { name: 'Aksesuar', slug: 'aksesuar', order: 10 },
  ];

  const createdCategories = await Promise.all(
    categories.map(async (category) => {
      return prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    })
  );

  // Kullanıcıları oluştur
  const userCount = faker.number.int({ min: 10, max: 20 });
  const users = await Promise.all(
    Array.from({ length: userCount }).map(async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return prisma.user.create({
        data: {
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          username: faker.internet.userName(),
          email: faker.internet.email(),
          passwordHash: generatePasswordHash(),
        },
      });
    })
  );

  // Her kategori için ürünler oluştur
  const allProducts: Product[] = [];
  for (const category of createdCategories) {
    const productCount = faker.number.int({ min: 5, max: 10 });
    const categoryProducts = await Promise.all(
      Array.from({ length: productCount }).map(async () => {
        const name = faker.commerce.productName();
        return prisma.product.create({
          data: {
            categoryId: category.id,
            name,
            slug: generateSlug(name),
            shortDescription: faker.commerce.productDescription(),
            longDescription: faker.lorem.paragraphs(3),
            price: parseFloat(faker.commerce.price({ min: 100, max: 2000 })),
            primaryPhotoUrl: faker.image.url({ width: 800, height: 600 }),
            commentCount: 0,
            averageRating: 0,
          },
        });
      })
    );
    allProducts.push(...categoryProducts);
  }

  // Her ürün için fotoğraflar oluştur
  for (const product of allProducts) {
    const photoCount = faker.number.int({ min: 1, max: 3 });
    await Promise.all(
      Array.from({ length: photoCount }).map(async (_, index) => {
        return prisma.productPhoto.create({
          data: {
            productId: product.id,
            url: faker.image.url({ width: 800, height: 600 }),
            size: faker.number.int({ min: 100000, max: 1000000 }),
            order: index,
            isPrimary: index === 0,
          },
        });
      })
    );
  }

  // Her kullanıcı için sepet ve yorumlar oluştur
  for (const user of users) {
    // Sepet oluştur
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    // Sepete rastgele ürünler ekle
    const cartItemCount = faker.number.int({ min: 1, max: 5 });
    const randomProducts = faker.helpers.arrayElements(allProducts, cartItemCount);
    await Promise.all(
      randomProducts.map(async (product) => {
        return prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 3 }),
          },
        });
      })
    );

    // Rastgele ürünlere yorum ekle
    const commentCount = faker.number.int({ min: 0, max: 3 });
    if (commentCount > 0) {
      const randomProducts = faker.helpers.arrayElements(allProducts, commentCount);
      await Promise.all(
        randomProducts.map(async (product) => {
          const rating = faker.number.int({ min: 1, max: 5 });
          return prisma.productComment.create({
            data: {
              userId: user.id,
              productId: product.id,
              title: faker.lorem.sentence(),
              content: faker.lorem.paragraph(),
              rating,
            },
          });
        })
      );
    }

    // Bazı kullanıcılar için sipariş oluştur
    if (faker.datatype.boolean({ probability: 0.4 })) {
      const orderCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < orderCount; i++) {
        const order = await prisma.order.create({
          data: {
            userId: user.id,
            status: faker.helpers.arrayElement(['PENDING', 'COMPLETED', 'CANCELLED']),
            paymentMethod: faker.helpers.arrayElement(['CREDIT_CARD', 'BANK_TRANSFER']),
          },
        });

        // Siparişe ürün ekle
        const orderItemCount = faker.number.int({ min: 1, max: 3 });
        const randomProducts = faker.helpers.arrayElements(allProducts, orderItemCount);
        await Promise.all(
          randomProducts.map(async (product) => {
            return prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId: product.id,
                quantity: faker.number.int({ min: 1, max: 3 }),
                price: product.price,
              },
            });
          })
        );

        // Bazı siparişlere teslimat adresi ekle
        if (faker.datatype.boolean({ probability: 0.7 })) {
          await prisma.shippingAddress.create({
            data: {
              orderId: order.id,
              fullName: `${user.firstName} ${user.lastName}`,
              phone: faker.phone.number(),
              address: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              zipCode: faker.location.zipCode('#####'),
              country: 'Türkiye',
            },
          });
        }
      }
    }
  }

  // Ürünlerin ortalama puanlarını ve yorum sayılarını güncelle
  for (const product of allProducts) {
    const comments = await prisma.productComment.findMany({
      where: { productId: product.id },
    });

    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = comments.length > 0 ? totalRating / comments.length : 0;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        averageRating,
        commentCount: comments.length,
      },
    });
  }

  console.log('✅ Mock data seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 