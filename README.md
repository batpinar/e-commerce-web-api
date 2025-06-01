# E-Commerce Web API

Modern bir e-ticaret platformu için geliştirilmiş RESTful API servisi. NestJS framework'ü kullanılarak TypeScript ile geliştirilmiştir.

## 🚀 Özellikler

- 🔐 JWT tabanlı kimlik doğrulama ve yetkilendirme (Refresh Token Rotation)
- 👥 Kullanıcı yönetimi
- 📦 Ürün yönetimi
- 📸 Ürün fotoğrafları yönetimi (Sıralama ve birincil fotoğraf desteği)
- 📝 Ürün yorumları ve değerlendirmeleri
- 📑 Kategori yönetimi
- 🔍 Gelişmiş arama ve filtreleme özellikleri

## 🛠 Teknolojiler

- [NestJS](https://nestjs.com/) - Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - Programlama dili
- [Express.js](https://expressjs.com/) - HTTP Server
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Veritabanı
- [JWT](https://jwt.io/) - Kimlik doğrulama
- [Passport.js](https://www.passportjs.org/) - Kimlik doğrulama middleware
- [Cerbos](https://cerbos.dev/) - Yetkilendirme
- [Class Validator](https://github.com/typestack/class-validator) - Veri doğrulama
- [Jest](https://jestjs.io/) - Test framework

## 📋 Gereksinimler

- Node.js (v18 veya üzeri)
- PostgreSQL
- npm veya yarn

## 🚀 Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd ecom-api
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
```

4. Veritabanı şemasını oluşturun:
```bash
npx prisma migrate dev
```

5. Uygulamayı başlatın:
```bash
# Geliştirme modu
npm run start:dev

# Prodüksiyon modu
npm run build
npm run start:prod
```

## 📚 API Endpoints

Tüm endpoint'ler `/api` prefix'i ile başlar.

### Kimlik Doğrulama
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcıyı görüntüleme
- `POST /api/auth/logout` - Mevcut oturumdan çıkış yapma
- `POST /api/auth/logout-all` - Tüm oturumlardan çıkış yapma

### Kullanıcılar
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/:id` - Kullanıcı detayları
- `PATCH /api/users/:id` - Kullanıcı bilgilerini güncelle

### Ürünler
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Ürün detayları
- `POST /api/products` - Yeni ürün ekle
- `PATCH /api/products/:id` - Ürün bilgilerini güncelle
- `DELETE /api/products/:id` - Ürün sil

### Ürün Fotoğrafları
- `POST /api/product-photos` - Yeni ürün fotoğrafı ekle
- `PATCH /api/product-photos/:id` - Ürün fotoğrafı güncelle (sıra ve birincil fotoğraf durumu)
- `DELETE /api/product-photos/:id` - Ürün fotoğrafı sil

### Kategoriler
- `GET /api/categories` - Tüm kategorileri listele
- `GET /api/categories/:id` - Kategori detayları
- `POST /api/categories` - Yeni kategori ekle
- `PATCH /api/categories/:id` - Kategori bilgilerini güncelle
- `DELETE /api/categories/:id` - Kategori sil

### Ürün Yorumları
- `GET /api/comments` - Ürün yorumlarını listele (product_id ve puan ile filtreleme)
- `GET /api/comments/:id` - Yorum detayları
- `POST /api/comments` - Yeni yorum ekle
- `PATCH /api/comments/:id` - Yorum güncelle
- `DELETE /api/comments/:id` - Yorum sil

## 📊 Veritabanı Şeması

### Users
- id (UUID)
- firstName (String)
- lastName (String)
- fullName (String)
- username (String, unique)
- email (String, unique)
- passwordHash (String)
- createdAt (DateTime)
- updatedAt (DateTime)

### Categories
- id (UUID)
- name (String, unique)
- slug (String, unique)
- order (Int)
- createdAt (DateTime)
- updatedAt (DateTime)

### Products
- id (UUID)
- categoryId (UUID, foreign key)
- name (String)
- slug (String, unique)
- shortDescription (Text)
- longDescription (Text)
- price (Float)
- primaryPhotoUrl (String, nullable)
- commentCount (Int, default: 0)
- averageRating (Float, default: 0)
- createdAt (DateTime)
- updatedAt (DateTime)

### ProductPhotos
- id (UUID)
- productId (UUID, foreign key)
- isPrimary (Boolean, default: false)
- url (String)
- size (Int)
- order (Int)
- createdAt (DateTime)
- updatedAt (DateTime)

### ProductComments
- id (UUID)
- userId (UUID, foreign key)
- productId (UUID, foreign key)
- title (String, nullable)
- content (String, nullable)
- rating (Int, 1-5)
- createdAt (DateTime)
- updatedAt (DateTime)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun
